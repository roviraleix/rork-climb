# APK Build Instructions

This app requires native Bluetooth functionality that is NOT available in Expo Go. You must build a standalone APK/AAB to use Bluetooth features.

## Prerequisites

1. Install EAS CLI globally:
```bash
npm install -g eas-cli
```

2. Login to your Expo account:
```bash
eas login
```

## Configuration Files Needed

### 1. Update `app.json`

Add the following to your `app.json`:

```json
{
  "expo": {
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
          "bluetoothAlwaysUsageDescription": "This app uses Bluetooth to connect to your climbing wall LED system.",
          "bluetoothPeripheralUsageDescription": "This app uses Bluetooth to connect to your climbing wall LED system."
        }
      ]
    ]
  }
}
```

### 2. Create `eas.json`

Create a file named `eas.json` in the root directory:

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

## Install Required Package

Install the Bluetooth package:

```bash
npx expo install react-native-ble-plx
```

## Build Commands

### For Development/Testing (APK):
```bash
eas build --platform android --profile preview
```

### For Production (APK):
```bash
eas build --platform android --profile production
```

### For Google Play Store (AAB):
```bash
eas build --platform android --profile production
```
Then change `buildType` to `"aab"` in `eas.json` production profile.

## Important Notes

1. **Expo Go Limitation**: The app will NOT work in Expo Go because `react-native-ble-plx` requires native code.

2. **Web Bluetooth**: The web version uses Web Bluetooth API which works in Chrome/Edge browsers over HTTPS.

3. **Android Permissions**: The app requests Bluetooth permissions at runtime. Users must grant these permissions for the app to work.

4. **Testing**: After building, download the APK from the EAS build page and install it on your Android device.

5. **Minimum Android Version**: The app requires Android 6.0 (API level 23) or higher for Bluetooth LE support.

## Troubleshooting

### Build Fails
- Make sure you have an Expo account and are logged in
- Check that all dependencies are compatible
- Review build logs on the EAS website

### Bluetooth Not Working
- Ensure Bluetooth permissions are granted in Android settings
- Check that Bluetooth is enabled on the device
- Make sure the ESP32 board is powered on and advertising

### Connection Issues
- The ESP32 must be advertising with the service UUID: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- Device name should be "FUSTERIA" or "LA FUSTERIA RESIS"
- Try restarting both the app and the ESP32 board

## ESP32 Configuration

The ESP32 code expects:
- Service UUID: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- Characteristic UUID: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- Device name: "FUSTERIA"

Make sure your ESP32 is programmed with the correct UUIDs and device name.
