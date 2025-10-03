import { useState, useEffect, useCallback, useMemo } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import createContextHook from "@nkzw/create-context-hook";
import type { ClimbingRoute, HoldColor, SelectedHolds, WallDimensions } from "@/types/climbing";
import { convertGrade, type GradeSystem } from "@/utils/gradeConversion";

// Web Bluetooth API types
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: any): Promise<any>;
      getAvailability(): Promise<boolean>;
    };
  }
}

// BLE PLX types for native
type BleManager = any;
type Device = any;
type Characteristic = any;

const ROUTES_STORAGE_KEY = "climbing_routes";
const WALL_DIMENSIONS_KEY = "wall_dimensions";

// Storage utility to avoid direct AsyncStorage import
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    return AsyncStorage.default.getItem(key);
  },
  
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    return AsyncStorage.default.setItem(key, value);
  },
  
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    return AsyncStorage.default.removeItem(key);
  }
};

// BLE service for ESP32 connection
class BLEService {
  private isConnected = false;
  private device: any = null;
  private characteristic: any = null;
  private bleManager: BleManager | null = null;
  private readonly SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  private readonly CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
  
  constructor() {
    if (Platform.OS !== 'web') {
      this.initializeBleManager();
    }
  }
  
  private async initializeBleManager() {
    try {
      const blePlx = await import('react-native-ble-plx').catch(() => null);
      if (blePlx) {
        this.bleManager = new blePlx.BleManager();
        console.log("BLE Manager initialized for native platform");
      } else {
        console.warn("react-native-ble-plx not available. BLE will only work on web via Web Bluetooth API.");
      }
    } catch (error) {
      console.warn("react-native-ble-plx not available. BLE will only work on web via Web Bluetooth API.", error);
    }
  }
  
  private async requestAndroidPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    
    try {
      if (Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        
        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        
        return (
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      }
    } catch (error) {
      console.error("Error requesting Android permissions:", error);
      return false;
    }
  }
  
  async connect(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        if (!window.isSecureContext) {
          throw new Error("Web Bluetooth requires HTTPS. Please use a secure connection.");
        }
        
        if (!navigator.bluetooth) {
          throw new Error("Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera.");
        }
        
        try {
          const available = await navigator.bluetooth.getAvailability();
          if (!available) {
            throw new Error("Bluetooth is not available. Please enable Bluetooth on your device.");
          }
        } catch (availabilityError) {
          console.warn("Could not check Bluetooth availability:", availabilityError);
        }
        
        try {
          this.device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [this.SERVICE_UUID] }],
            optionalServices: [this.SERVICE_UUID]
          });
        } catch (requestError: any) {
          if (requestError.name === 'SecurityError') {
            throw new Error("Bluetooth access denied. This might be due to browser permissions or security policy. Try refreshing the page or using a different browser.");
          } else if (requestError.name === 'NotFoundError') {
            throw new Error("No compatible board found. Make sure your board is powered on and nearby.");
          } else {
            throw new Error(`Failed to request device: ${requestError.message}`);
          }
        }
        
        const server = await this.device.gatt.connect();
        const service = await server.getPrimaryService(this.SERVICE_UUID);
        this.characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
        
        this.isConnected = true;
        console.log("Connected to board via Web Bluetooth");
        return true;
      } else {
        if (!this.bleManager) {
          throw new Error("BLE Manager not initialized. Make sure react-native-ble-plx is installed.");
        }
        
        const hasPermissions = await this.requestAndroidPermissions();
        if (!hasPermissions) {
          throw new Error("Bluetooth permissions not granted. Please enable Bluetooth permissions in settings.");
        }
        
        const state = await this.bleManager.state();
        if (state !== 'PoweredOn') {
          throw new Error("Bluetooth is not enabled. Please turn on Bluetooth.");
        }
        
        console.log("Scanning for devices...");
        
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            this.bleManager?.stopDeviceScan();
            reject(new Error("Device not found. Make sure your board is powered on and nearby."));
          }, 10000);
          
          this.bleManager.startDeviceScan([this.SERVICE_UUID], null, async (error: any, device: Device) => {
            if (error) {
              clearTimeout(timeout);
              this.bleManager?.stopDeviceScan();
              reject(error);
              return;
            }
            
            if (device && (device.name === 'FUSTERIA' || device.name === 'LA FUSTERIA RESIS')) {
              console.log("Found device:", device.name);
              this.bleManager?.stopDeviceScan();
              clearTimeout(timeout);
              
              try {
                this.device = await device.connect();
                await this.device.discoverAllServicesAndCharacteristics();
                
                const services = await this.device.services();
                const service = services.find((s: any) => s.uuid.toLowerCase() === this.SERVICE_UUID.toLowerCase());
                
                if (!service) {
                  throw new Error("Service not found on device");
                }
                
                const characteristics = await service.characteristics();
                this.characteristic = characteristics.find(
                  (c: Characteristic) => c.uuid.toLowerCase() === this.CHARACTERISTIC_UUID.toLowerCase()
                );
                
                if (!this.characteristic) {
                  throw new Error("Characteristic not found on device");
                }
                
                this.isConnected = true;
                console.log("Connected to board via native BLE");
                resolve(true);
              } catch (connectError) {
                console.error("Error connecting to device:", connectError);
                reject(connectError);
              }
            }
          });
        });
      }
    } catch (error) {
      console.error("BLE connection error:", error);
      throw error;
    }
  }
  
  async disconnect(): Promise<void> {
    try {
      if (Platform.OS === 'web' && this.device) {
        await this.device.gatt.disconnect();
      } else if (Platform.OS !== 'web' && this.device) {
        await this.device.cancelConnection();
      }
      
      this.isConnected = false;
      this.device = null;
      this.characteristic = null;
      console.log("Disconnected from board");
    } catch (error) {
      console.error("BLE disconnection error:", error);
    }
  }
  
  async sendLEDData(data: Uint8Array): Promise<void> {
    if (!this.isConnected) {
      throw new Error("Not connected to device");
    }
    
    try {
      if (Platform.OS === 'web' && this.characteristic) {
        await this.characteristic.writeValue(data);
        console.log("Sent BLE LED data:", Array.from(data));
      } else if (Platform.OS !== 'web' && this.characteristic) {
        const base64Data = this.uint8ArrayToBase64(data);
        await this.characteristic.writeWithoutResponse(base64Data);
        console.log("Sent BLE LED data (native):", Array.from(data));
      } else {
        console.log("BLE not available, simulated LED data:", Array.from(data));
      }
    } catch (error) {
      console.error("Error sending BLE LED data:", error);
      throw error;
    }
  }
  
  private uint8ArrayToBase64(data: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < data.length; i++) {
      binary += String.fromCharCode(data[i]);
    }
    return btoa(binary);
  }
  
  async turnOffAllLEDs(): Promise<void> {
    // Send special command to turn off all LEDs: [255, 255, 0, 0, 0]
    const data = new Uint8Array([255, 255, 0, 0, 0]);
    await this.sendLEDData(data);
  }
  
  async setLED(row: number, col: number, red: number, green: number, blue: number): Promise<void> {
    // Send command to set specific LED: [row, col, red, green, blue]
    const data = new Uint8Array([row, col, red, green, blue]);
    await this.sendLEDData(data);
  }
  
  async setMultipleLEDs(leds: {row: number, col: number, red: number, green: number, blue: number}[]): Promise<void> {
    // Send multiple LED commands in one packet
    const data = new Uint8Array(leds.length * 5);
    for (let i = 0; i < leds.length; i++) {
      const led = leds[i];
      const offset = i * 5;
      data[offset] = led.row;
      data[offset + 1] = led.col;
      data[offset + 2] = led.red;
      data[offset + 3] = led.green;
      data[offset + 4] = led.blue;
    }
    await this.sendLEDData(data);
  }
  
  async setMatrixConfiguration(rows: number, cols: number): Promise<void> {
    // Send matrix configuration: [rows, cols]
    const data = new Uint8Array([rows, cols]);
    await this.sendLEDData(data);
    console.log(`Sent matrix configuration: ${rows}x${cols}`);
  }
  
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

const bleService = new BLEService();

export const [ClimbingWallProvider, useClimbingWall] = createContextHook(() => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedHolds, setSelectedHolds] = useState<SelectedHolds>({});
  const [selectedColor, setSelectedColor] = useState<HoldColor>("green");
  const [savedRoutes, setSavedRoutes] = useState<ClimbingRoute[]>([]);
  const [wallDimensions, setWallDimensionsState] = useState<WallDimensions>({ rows: 18, cols: 19 });
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [doubleLedMode, setDoubleLedMode] = useState(false);

  const loadSavedRoutes = useCallback(async () => {
    try {
      const stored = await storage.getItem(ROUTES_STORAGE_KEY);
      if (stored) {
        setSavedRoutes(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading saved routes:", error);
    }
  }, []);

  const loadWallDimensions = useCallback(async () => {
    try {
      const stored = await storage.getItem(WALL_DIMENSIONS_KEY);
      if (stored) {
        setWallDimensionsState(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading wall dimensions:", error);
    }
  }, []);

  useEffect(() => {
    loadSavedRoutes();
    loadWallDimensions();
  }, [loadSavedRoutes, loadWallDimensions]);

  const showModal = useCallback((type: "success" | "error" | "connection", message: string) => {
    if (!message?.trim() || message.length > 200) return;
    
    setModalMessage(message);
    if (type === "success") setShowSuccessModal(true);
    else if (type === "error") setShowErrorModal(true);
    else setShowConnectionModal(true);
  }, []);

  const setWallDimensions = useCallback(async (dimensions: WallDimensions) => {
    try {
      setWallDimensionsState(dimensions);
      await storage.setItem(WALL_DIMENSIONS_KEY, JSON.stringify(dimensions));
      
      // Send configuration to ESP32 if connected
      if (isConnected) {
        try {
          await bleService.setMatrixConfiguration(dimensions.rows, dimensions.cols);
          showModal("success", `Matrix updated to ${dimensions.rows}x${dimensions.cols}`);
        } catch (error) {
          console.error("Error sending matrix configuration:", error);
          showModal("error", "Failed to update matrix configuration on board");
        }
      }
    } catch (error) {
      console.error("Error saving wall dimensions:", error);
    }
  }, [isConnected, showModal]);

  const connect = useCallback(async () => {
    try {
      const connected = await bleService.connect();
      setIsConnected(connected);
      
      if (connected) {
        showModal("success", "Successfully connected to board");
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      
      // Provide specific error messages based on the error
      let errorMessage = "Could not connect to board.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (Platform.OS === 'web') {
        errorMessage = "Web Bluetooth connection failed. Please ensure you're using HTTPS and a compatible browser (Chrome, Edge, or Opera).";
      } else {
        errorMessage = "Make sure Bluetooth is enabled and the board is nearby.";
      }
      
      showModal("error", errorMessage);
    }
  }, [showModal]);

  const disconnect = useCallback(async () => {
    try {
      await bleService.disconnect();
      setIsConnected(false);
      setSelectedHolds({});
      showModal("connection", "Disconnected from board");
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  }, [showModal]);

  const getColorRGB = useCallback((color: HoldColor): {red: number, green: number, blue: number} => {
    switch (color) {
      case "red": return { red: 255, green: 0, blue: 0 };     // Top holds
      case "orange": return { red: 255, green: 165, blue: 0 }; // Feet holds
      case "blue": return { red: 0, green: 0, blue: 255 };    // Hand holds
      case "green": return { red: 0, green: 255, blue: 0 };   // Start holds
      default: return { red: 255, green: 255, blue: 255 };
    }
  }, []);
  
  const parseHoldId = useCallback((holdId: string): {row: number, col: number} => {
    // Parse holdId format "row-col" to get row and column indices
    const [rowStr, colStr] = holdId.split('-');
    return {
      row: parseInt(rowStr, 10),
      col: parseInt(colStr, 10)
    };
  }, []);
  
  const sendLEDCommand = useCallback(async (holdId: string, color: HoldColor | "off") => {
    try {
      const { row, col } = parseHoldId(holdId);
      
      if (color === "off") {
        await bleService.setLED(row, col, 0, 0, 0);
      } else {
        const { red, green, blue } = getColorRGB(color);
        await bleService.setLED(row, col, red, green, blue);
      }
    } catch (error) {
      console.error("Error sending LED command:", error);
    }
  }, [getColorRGB, parseHoldId]);

  const toggleHold = useCallback(async (holdId: string) => {
    if (!isConnected) return;

    const newHolds = { ...selectedHolds };
    
    if (newHolds[holdId]) {
      // Remove hold
      delete newHolds[holdId];
      await sendLEDCommand(holdId, "off");
      
      // If double LED mode is enabled, also turn off adjacent LEDs
      if (doubleLedMode) {
        const { row, col } = parseHoldId(holdId);
        const adjacentHolds = [
          `${row}-${col + 1}`,
          `${row + 1}-${col}`,
          `${row}-${col - 1}`,
          `${row - 1}-${col}`
        ];
        
        for (const adjacentHold of adjacentHolds) {
          if (newHolds[adjacentHold]) {
            delete newHolds[adjacentHold];
            await sendLEDCommand(adjacentHold, "off");
          }
        }
      }
    } else {
      // Add hold with selected color
      newHolds[holdId] = selectedColor;
      await sendLEDCommand(holdId, selectedColor);
      
      // If double LED mode is enabled, also light up adjacent LEDs
      if (doubleLedMode) {
        const { row, col } = parseHoldId(holdId);
        const adjacentHolds = [
          `${row}-${col + 1}`,
          `${row + 1}-${col}`,
          `${row}-${col - 1}`,
          `${row - 1}-${col}`
        ];
        
        for (const adjacentHold of adjacentHolds) {
          const { row: adjRow, col: adjCol } = parseHoldId(adjacentHold);
          // Check if adjacent hold is within wall bounds
          if (adjRow >= 0 && adjRow < wallDimensions.rows && adjCol >= 0 && adjCol < wallDimensions.cols) {
            newHolds[adjacentHold] = selectedColor;
            await sendLEDCommand(adjacentHold, selectedColor);
          }
        }
      }
    }
    
    setSelectedHolds(newHolds);
  }, [isConnected, selectedHolds, selectedColor, sendLEDCommand, doubleLedMode, parseHoldId, wallDimensions]);

  const clearAll = useCallback(async () => {
    if (!isConnected) return;

    try {
      // Send special command to turn off all LEDs at once
      await bleService.turnOffAllLEDs();
      
      setSelectedHolds({});
      showModal("success", "All LEDs turned off");
    } catch (error) {
      console.error("Error clearing LEDs:", error);
      showModal("error", "Failed to clear LEDs");
    }
  }, [isConnected, showModal]);

  const saveRoute = useCallback(async (routeData: Omit<ClimbingRoute, "id">) => {
    try {
      const newRoute: ClimbingRoute = {
        ...routeData,
        id: Date.now().toString(),
      };

      const updatedRoutes = [...savedRoutes, newRoute];
      setSavedRoutes(updatedRoutes);
      
      await storage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(updatedRoutes));
    } catch (error) {
      console.error("Error saving route:", error);
      throw error;
    }
  }, [savedRoutes]);

  const loadRoute = useCallback(async (route: ClimbingRoute) => {
    if (!isConnected) return;

    try {
      // Clear current holds first
      await bleService.turnOffAllLEDs();
      
      // Wait a bit for clearing to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Prepare all LEDs data for the route
      const ledsData = Object.entries(route.holds).map(([holdId, color]) => {
        const { row, col } = parseHoldId(holdId);
        const { red, green, blue } = getColorRGB(color);
        return { row, col, red, green, blue };
      });
      
      // Send all LEDs at once for better performance
      if (ledsData.length > 0) {
        await bleService.setMultipleLEDs(ledsData);
      }
      
      setSelectedHolds(route.holds);
      showModal("success", `"${route.name}" is now displayed on the wall`);
    } catch (error) {
      console.error("Error loading route:", error);
      showModal("error", "Failed to load route");
    }
  }, [isConnected, parseHoldId, getColorRGB, showModal]);

  const deleteRoute = useCallback(async (routeId: string) => {
    try {
      const updatedRoutes = savedRoutes.filter(route => route.id !== routeId);
      setSavedRoutes(updatedRoutes);
      
      await storage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(updatedRoutes));
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  }, [savedRoutes]);

  const clearAllRoutes = useCallback(async () => {
    try {
      setSavedRoutes([]);
      await storage.removeItem(ROUTES_STORAGE_KEY);
      showModal("success", "All routes have been deleted");
    } catch (error) {
      console.error("Error clearing routes:", error);
    }
  }, [showModal]);

  const getRoutesInGradeSystem = useCallback((gradeSystem: GradeSystem) => {
    return savedRoutes.map(route => ({
      ...route,
      grade: convertGrade(route.grade, "french", gradeSystem)
    }));
  }, [savedRoutes]);

  return useMemo(() => ({
    isConnected,
    selectedHolds,
    selectedColor,
    savedRoutes,
    wallDimensions,
    showConnectionModal,
    showSuccessModal,
    showErrorModal,
    modalMessage,
    doubleLedMode,
    connect,
    disconnect,
    toggleHold,
    setSelectedColor,
    clearAll,
    saveRoute,
    loadRoute,
    deleteRoute,
    clearAllRoutes,
    setWallDimensions,
    setDoubleLedMode,
    setShowConnectionModal,
    setShowSuccessModal,
    setShowErrorModal,
    getRoutesInGradeSystem,
  }), [
    isConnected,
    selectedHolds,
    selectedColor,
    savedRoutes,
    wallDimensions,
    showConnectionModal,
    showSuccessModal,
    showErrorModal,
    modalMessage,
    doubleLedMode,
    connect,
    disconnect,
    toggleHold,
    clearAll,
    saveRoute,
    loadRoute,
    deleteRoute,
    clearAllRoutes,
    setWallDimensions,
    getRoutesInGradeSystem,
  ]);
});