declare module 'react-native-ble-plx' {
  export class BleManager {
    constructor();
    state(): Promise<string>;
    startDeviceScan(
      serviceUUIDs: string[] | null,
      options: any | null,
      listener: (error: any, device: Device | null) => void
    ): void;
    stopDeviceScan(): void;
  }

  export interface Device {
    id: string;
    name: string | null;
    connect(): Promise<Device>;
    discoverAllServicesAndCharacteristics(): Promise<Device>;
    services(): Promise<Service[]>;
    cancelConnection(): Promise<Device>;
  }

  export interface Service {
    uuid: string;
    characteristics(): Promise<Characteristic[]>;
  }

  export interface Characteristic {
    uuid: string;
    writeWithoutResponse(base64Value: string): Promise<Characteristic>;
  }
}
