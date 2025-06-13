# ClockApp - Local APK Build Guide

## Quick Commands

### Build APK

```bash
# Easy way - use the build script
./build-apk.sh

# Manual way
npm run build:release
```

### Check Connected Devices

```bash
npm run device:check
# or
adb devices
```

### Install APK to Device

```bash
npm run install:apk
# or manually
adb install android/app/build/outputs/apk/release/app-release.apk
```

## Build Process

1. **Connect Device**: Plug in your Android device with USB debugging enabled
2. **Authorize**: Accept the USB debugging prompt on your device
3. **Build**: Run `./build-apk.sh` or `npm run build:release`
4. **Install**: The APK will be automatically installed to your device

## File Locations

- **APK Output**: `android/app/build/outputs/apk/release/app-release.apk`
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Build Script**: `build-apk.sh`

## Troubleshooting

### Device Not Recognized

```bash
# Check connection
adb devices

# If unauthorized, accept prompt on device
adb kill-server
adb start-server
```

### Build Errors

```bash
# Clean build
npx expo prebuild --platform android --clean
./gradlew clean (from android folder)
```

### Permissions

```bash
# Make build script executable
chmod +x build-apk.sh
```

### NDK Issues (source.properties missing)

If you get an error like "NDK at /path/to/ndk did not have a source.properties file":

```bash
# Check for broken NDK installations
ls -la $HOME/Library/Android/sdk/ndk/

# Remove broken NDK folders (ones that are mostly empty)
rm -rf $HOME/Library/Android/sdk/ndk/[BROKEN_VERSION]

# Clean and regenerate Android project
rm -rf android
npx expo prebuild --platform android --clean
```

The build script now automatically detects and removes broken NDK installations.

## Package.json Scripts Added

- `build:dev` - Build debug APK
- `build:release` - Build release APK
- `install:apk` - Install APK to device
- `device:check` - Check connected devices
