# Guía para Crear APK con Bluetooth

## ⚠️ IMPORTANTE

Esta aplicación **NO funcionará en Expo Go** porque usa `react-native-ble-plx` para Bluetooth, que requiere código nativo. Debes crear un APK standalone para usar las funciones de Bluetooth en Android.

## 📱 Qué Funciona Dónde

| Función | Expo Go | Web (Chrome/Edge) | APK Producción |
|---------|---------|-------------------|----------------|
| UI/Navegación | ✅ | ✅ | ✅ |
| Gestión de Rutas | ✅ | ✅ | ✅ |
| Conexión Bluetooth | ❌ | ✅ (solo HTTPS) | ✅ |
| Control de LEDs | ❌ | ✅ (solo HTTPS) | ✅ |

## 🚀 Pasos para Crear APK

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

### 2. Iniciar Sesión en Expo

```bash
eas login
```

### 3. Instalar el Paquete de Bluetooth

```bash
npx expo install react-native-ble-plx
```

### 4. Actualizar app.json

Reemplaza tu `app.json` actual con esta configuración:

```json
{
  "expo": {
    "name": "teulada",
    "slug": "teulada",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "app.rork.teulada",
      "infoPlist": {
        "NSBluetoothAlwaysUsageDescription": "Esta app usa Bluetooth para conectarse al sistema LED de escalada.",
        "NSBluetoothPeripheralUsageDescription": "Esta app usa Bluetooth para conectarse al sistema LED de escalada."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "app.rork.teulada",
      "versionCode": 1,
      "permissions": [
        "BLUETOOTH",
        "BLUETOOTH_ADMIN",
        "BLUETOOTH_SCAN",
        "BLUETOOTH_CONNECT",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://rork.com/"
        }
      ],
      [
        "react-native-ble-plx",
        {
          "isBackgroundEnabled": false,
          "modes": ["peripheral", "central"],
          "bluetoothAlwaysUsageDescription": "Esta app usa Bluetooth para conectarse al sistema LED de escalada.",
          "bluetoothPeripheralUsageDescription": "Esta app usa Bluetooth para conectarse al sistema LED de escalada."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### 5. Crear eas.json

Crea un archivo `eas.json` en la raíz del proyecto:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 6. Construir el APK

Para pruebas (APK de desarrollo):
```bash
eas build --platform android --profile preview
```

Para producción:
```bash
eas build --platform android --profile production
```

### 7. Descargar e Instalar

1. Ve a la página de builds de EAS (el comando te dará el link)
2. Descarga el APK cuando esté listo
3. Instala el APK en tu dispositivo Android
4. Acepta los permisos de Bluetooth cuando la app los solicite

## 🔧 Configuración del ESP32

Asegúrate de que tu ESP32 esté configurado con:

- **Service UUID**: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- **Characteristic UUID**: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- **Nombre del dispositivo**: `FUSTERIA`

## 📝 Permisos de Android

La app solicita estos permisos en tiempo de ejecución:

- **BLUETOOTH** - Para usar Bluetooth
- **BLUETOOTH_ADMIN** - Para administrar conexiones Bluetooth
- **BLUETOOTH_SCAN** - Para escanear dispositivos (Android 12+)
- **BLUETOOTH_CONNECT** - Para conectarse a dispositivos (Android 12+)
- **ACCESS_FINE_LOCATION** - Requerido para escaneo BLE en Android

## 🐛 Solución de Problemas

### El build falla
- Verifica que estés logueado en EAS: `eas login`
- Asegúrate de que `app.json` tenga la configuración correcta
- Revisa los logs del build en el dashboard de EAS

### Bluetooth no funciona en el APK
1. Verifica que los permisos de Bluetooth estén otorgados en Configuración de Android
2. Asegúrate de que Bluetooth esté activado en el dispositivo
3. Verifica que el ESP32 esté encendido y transmitiendo
4. Intenta reiniciar tanto la app como el ESP32

### Error "Cannot find module 'react-native-ble-plx'" en desarrollo
- Este error es normal en Expo Go
- El código funcionará correctamente en el APK de producción
- Para desarrollo, usa la versión web con Chrome/Edge

### La conexión falla
- El ESP32 debe estar transmitiendo con el UUID correcto
- El nombre del dispositivo debe ser "FUSTERIA" o "LA FUSTERIA RESIS"
- Asegúrate de estar cerca del ESP32 (menos de 10 metros)
- Intenta reiniciar el ESP32

## 💻 Desarrollo

### Para probar UI y lógica (sin Bluetooth)
```bash
npm start
```
Escanea el código QR con Expo Go

### Para probar Bluetooth en web
```bash
npm start
```
Abre en Chrome o Edge (debe ser HTTPS o localhost)

### Para probar la app completa
Construye el APK e instálalo en un dispositivo Android real

## 📦 Archivos Importantes

- `app.json` - Configuración actual (para Expo Go)
- `eas.json` - Configuración de builds de EAS
- `types/react-native-ble-plx.d.ts` - Declaraciones de tipos para desarrollo
- `hooks/useClimbingWall.ts` - Lógica de Bluetooth
- `APK_BUILD_INSTRUCTIONS.md` - Instrucciones detalladas en inglés
- `PRODUCTION_SETUP.md` - Guía de configuración de producción

## ✅ Checklist Pre-Build

Antes de construir el APK, verifica:

- [ ] `react-native-ble-plx` está instalado
- [ ] `app.json` tiene la configuración de Bluetooth
- [ ] `eas.json` existe en la raíz del proyecto
- [ ] Estás logueado en EAS (`eas login`)
- [ ] El ESP32 está configurado con los UUIDs correctos
- [ ] Has probado la app en web primero

## 🎯 Versión Mínima de Android

La app requiere **Android 6.0 (API level 23)** o superior para soporte de Bluetooth LE.

## 📱 Para Google Play Store

Si quieres publicar en Google Play Store:

1. Cambia `buildType` a `"aab"` en `eas.json` (perfil production)
2. Construye: `eas build --platform android --profile production`
3. Sube el AAB a Google Play Console

## 🔐 Firma de la App

EAS maneja automáticamente la firma de la app. Si necesitas tu propia keystore:

```bash
eas credentials
```

Sigue las instrucciones para configurar tus propias credenciales.
