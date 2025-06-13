#!/bin/bash

echo "🚀 Building ClockApp APK..."
echo "=============================="

# Check if device is connected
echo "📱 Checking connected devices..."
adb devices

# Build the APK
echo "🔨 Building release APK..."
npx expo run:android --variant release --device

# Check if APK was created
APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    echo "✅ APK built successfully!"
    echo "📍 Location: $APK_PATH"
    echo "📱 Installing to connected device..."
    adb install "$APK_PATH"
    echo "🎉 Installation complete!"
else
    echo "❌ APK build failed. Check the output above for errors."
fi
