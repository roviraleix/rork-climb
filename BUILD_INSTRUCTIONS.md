# APK Build Instructions for Teulada Climbing Wall App

This document provides step-by-step instructions for building an APK for the Teulada climbing wall LED control application.

## Prerequisites

Before building the APK, ensure you have:

1. **Node.js** (v18 or later) installed
2. **Expo CLI** installed globally: `npm install -g expo-cli` or `npm install -g eas-cli`
3. An **Expo account** (create one at https://expo.dev)
4. **Android Studio** (optional, for local builds)

## Important: Bluetooth Configuration

### Required Changes to app.json

Since the app uses Bluetooth (via `react-native-ble-plx`), you need to manually update `app.json` with the following configurations:

#### Android Permissions

Add these permissions to the `android` section:

```json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "app.rork.teulada",
      "permissions": [
        "BLUETOOTH",
        "BLUETOOTH_ADMIN",
        "BLUETOOTH_CONNECT",
        "BLUETOOTH_SCAN",
        "ACCESS_FINE_LOCATION"
      ],
      "versionCode": 1
    }
  }
}
```

#### iOS Permissions

Add these to the `ios` section:

```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "app.rork.teulada",
      "infoPlist": {
        "NSBluetoothAlwaysUsageDescription": "This app needs Bluetooth to connect to your climbing wall LED board.",
        "NSBluetoothPeripheralUsageDescription": "This app needs Bluetooth to connect to your climbing wall LED board."
      },
      "buildNumber": "1"
    }
  }
}
```

#### Build Properties Plugin

Add the `expo-build-properties` plugin to the `plugins` array:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://rork.com/"
        }
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 23,
            "targetSdkVersion": 34,
            "compileSdkVersion": 34
          },
          "ios": {
            "deploymentTarget": "13.4"
          }
        }
      ]
    ]
  }
}
```

## Step 1: Install Dependencies

First, install the required Bluetooth library:

```bash
npm install react-native-ble-plx
# or
bun install react-native-ble-plx
```

Install expo-build-properties if not already installed:

```bash
npx expo install expo-build-properties
```

## Step 2: Build with EAS (Recommended)

EAS (Expo Application Services) is the recommended way to build production-ready APKs.

### 2.1 Install EAS CLI

```bash
npm install -g eas-cli
```

### 2.2 Login to Expo

```bash
eas login
```

### 2.3 Configure EAS Build

Initialize EAS in your project:

```bash
eas build:configure
```

This will create an `eas.json` file. Update it to include the development client:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
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
  }
}
```

### 2.4 Build the APK

For a development build (recommended for testing):

```bash
eas build --platform android --profile development
```

For a production build:

```bash
eas build --platform android --profile production
```

The build process will:
1. Upload your code to Expo's servers
2. Build the APK in the cloud
3. Provide a download link when complete

### 2.5 Download and Install

Once the build completes, you'll receive a download link. Download the APK and install it on your Android device.

## Step 3: Local Build (Alternative)

If you prefer to build locally, you'll need Android Studio installed.

### 3.1 Generate Native Code

```bash
npx expo prebuild --platform android
```

This creates the `android` directory with native code.

### 3.2 Build with Gradle

```bash
cd android
./gradlew assembleRelease
```

The APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Step 4: Testing Bluetooth

After installing the APK:

1. **Enable Bluetooth** on your Android device
2. **Grant permissions** when prompted (Location and Bluetooth)
3. **Power on your ESP32 board** (it should advertise as "FUSTERIA")
4. Open the app and tap **"Connect Board"**
5. The app will scan for nearby devices and connect automatically

### Troubleshooting Bluetooth

If Bluetooth doesn't work:

1. **Check permissions**: Go to Settings > Apps > Teulada > Permissions
   - Ensure Location and Nearby Devices are enabled
2. **Check Android version**: 
   - Android 12+ requires `BLUETOOTH_SCAN` and `BLUETOOTH_CONNECT`
   - Android 11 and below require `ACCESS_FINE_LOCATION`
3. **Verify ESP32 is advertising**: The board should show "FUSTERIA" as its name
4. **Check logs**: Use `adb logcat` to see detailed error messages

## App Features

Once connected, you can:

- **Create routes**: Tap holds on the matrix to light them up
- **Save routes**: Name and grade your routes
- **Load routes**: Display saved routes on the wall
- **Adjust matrix size**: Configure rows and columns to match your wall
- **Double LED mode**: Light up adjacent LEDs for better visibility
- **Multi-language support**: Switch between English, Spanish, and Catalan

## ESP32 Configuration

The app expects the ESP32 to:

- **Service UUID**: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- **Characteristic UUID**: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- **Device name**: "FUSTERIA" or "LA FUSTERIA RESIS"

### LED Data Format

The app sends data in the following formats:

1. **Single LED**: `[row, col, red, green, blue]` (5 bytes)
2. **Multiple LEDs**: Multiple 5-byte sequences concatenated
3. **Clear all**: `[255, 255, 0, 0, 0]` (special command)
4. **Matrix config**: `[rows, cols]` (2 bytes)

## Version Management

To increment the version for updates:

1. Update `version` in `app.json` (e.g., "1.0.0" → "1.0.1")
2. Increment `versionCode` in `app.json` (e.g., 1 → 2)
3. Rebuild the APK

## Distribution

### Internal Testing

Use EAS's internal distribution:

```bash
eas build --platform android --profile preview
```

Share the download link with testers.

### Google Play Store

For Play Store distribution:

1. Build a production APK/AAB:
   ```bash
   eas build --platform android --profile production
   ```

2. Create a Google Play Developer account

3. Upload the APK/AAB to the Play Console

4. Complete the store listing and submit for review

## Support

For issues or questions:

- Check the Expo documentation: https://docs.expo.dev
- Review react-native-ble-plx docs: https://github.com/dotintent/react-native-ble-plx
- Check ESP32 BLE examples: https://github.com/espressif/arduino-esp32

## Notes

- **Web version**: The web version uses Web Bluetooth API and requires HTTPS
- **iOS version**: iOS builds require an Apple Developer account ($99/year)
- **Expo Go limitation**: Bluetooth features won't work in Expo Go; you must build a development client or production APK
