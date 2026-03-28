# Production Setup Guide

## Important: This app requires a production build to work with Bluetooth

The app uses `react-native-ble-plx` for Bluetooth connectivity, which is **NOT compatible with Expo Go**. You must create a standalone build (APK/AAB) to use Bluetooth features on Android devices.

## Quick Start

### 1. Install react-native-ble-plx

When building for production, you need to install the Bluetooth package:

```bash
npx expo install react-native-ble-plx
```

### 2. Replace app.json

Before building, replace your `app.json` with `app.json.production`:

```bash
cp app.json.production app.json
```

Or manually add the Bluetooth plugin configuration to your `app.json`.

### 3. Build the APK

```bash
# Install EAS CLI if you haven't
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android --profile preview
```

## What Works Where

| Feature | Expo Go | Web (Chrome/Edge) | Production APK |
|---------|---------|-------------------|----------------|
| UI/Navigation | ✅ | ✅ | ✅ |
| Route Management | ✅ | ✅ | ✅ |
| Bluetooth Connection | ❌ | ✅ (HTTPS only) | ✅ |
| LED Control | ❌ | ✅ (HTTPS only) | ✅ |

## Development Workflow

### Testing UI/Logic (Expo Go)
```bash
npm start
```
- Scan QR code with Expo Go app
- UI and route management will work
- Bluetooth features will show errors (expected)

### Testing Bluetooth (Web)
```bash
npm start
```
- Open in Chrome/Edge browser
- Must use HTTPS (localhost works)
- Web Bluetooth API will be used

### Testing Full App (Production Build)
```bash
eas build --platform android --profile preview
```
- Download and install APK on Android device
- All features including Bluetooth will work

## File Structure

- `app.json` - Current config (for Expo Go development)
- `app.json.production` - Production config with Bluetooth plugin
- `eas.json` - EAS Build configuration
- `APK_BUILD_INSTRUCTIONS.md` - Detailed build instructions

## Bluetooth Requirements

### Android Permissions
The app requests these permissions at runtime:
- BLUETOOTH
- BLUETOOTH_ADMIN
- BLUETOOTH_SCAN
- BLUETOOTH_CONNECT
- ACCESS_FINE_LOCATION

### ESP32 Configuration
- Service UUID: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- Characteristic UUID: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- Device Name: "FUSTERIA"

## Troubleshooting

### "Cannot find module 'react-native-ble-plx'" in Expo Go
This is expected. The package only works in production builds.

### Bluetooth not working in production APK
1. Check Android permissions are granted
2. Ensure Bluetooth is enabled
3. Verify ESP32 is powered on and advertising
4. Check device compatibility (Android 6.0+)

### Build fails
1. Ensure you're logged into EAS: `eas login`
2. Check that `app.json.production` has correct configuration
3. Review build logs on EAS dashboard

## Next Steps

1. Test UI in Expo Go during development
2. When ready to test Bluetooth, build APK with EAS
3. For production release, use production profile and AAB format
