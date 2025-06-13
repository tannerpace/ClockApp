#!/bin/bash
# ClockApp Development Helper Script

echo "🕰️  ClockApp Development Helper"
echo "================================"

case "$1" in
    "start")
        echo "🚀 Starting Expo development server..."
        npx expo start
        ;;
    "android")
        echo "🤖 Starting on Android..."
        npx expo start --android
        ;;
    "ios")
        echo "🍎 Starting on iOS..."
        npx expo start --ios
        ;;
    "clean")
        echo "🧹 Cleaning cache and restarting..."
        npx expo start --clear --reset-cache
        ;;
    "landscape")
        echo "📱 Setting up landscape mode on Android emulator..."
        echo "Enabling auto-rotation..."
        adb shell settings put system accelerometer_rotation 1
        echo "Rotating to landscape..."
        adb shell settings put system user_rotation 1
        adb shell input keyevent 82
        echo "✅ Landscape mode enabled! Your clock app should now be in dock mode."
        ;;
    "portrait")
        echo "📱 Setting up portrait mode on Android emulator..."
        echo "Enabling auto-rotation..."
        adb shell settings put system accelerometer_rotation 1
        echo "Rotating to portrait..."
        adb shell settings put system user_rotation 0
        echo "✅ Portrait mode enabled!"
        ;;
    "rotate-left")
        echo "🔄 Rotating left..."
        adb shell settings put system user_rotation 3
        ;;
    "rotate-right")
        echo "🔄 Rotating right..."
        adb shell settings put system user_rotation 1
        ;;
    "auto-rotate")
        echo "🔄 Enabling auto-rotation..."
        adb shell settings put system accelerometer_rotation 1
        echo "✅ Auto-rotation enabled!"
        ;;
    "lock-rotation")
        echo "🔒 Locking current rotation..."
        adb shell settings put system accelerometer_rotation 0
        echo "✅ Rotation locked!"
        ;;
    "install")
        echo "📦 Installing dependencies..."
        npm install
        ;;
    "doctor")
        echo "🩺 Running Expo doctor..."
        npx expo doctor
        ;;
    "status")
        echo "📊 Checking Expo status..."
        lsof -i :8081 -i :8082 | grep LISTEN || echo "No Expo servers running"
        ;;
    "kill")
        echo "🛑 Killing all Expo processes..."
        pkill -f "expo start" || echo "No Expo processes found"
        ;;
    *)
        echo "Usage: ./dev.sh [command]"
        echo ""
        echo "📱 App Commands:"
        echo "  start     - Start Expo development server"
        echo "  android   - Start on Android"
        echo "  ios       - Start on iOS"
        echo "  clean     - Clear cache and restart"
        echo "  install   - Install npm dependencies"
        echo "  doctor    - Run Expo doctor for diagnostics"
        echo ""
        echo "🔄 Rotation Commands (Android):"
        echo "  landscape    - Set landscape mode (for dock usage)"
        echo "  portrait     - Set portrait mode"
        echo "  rotate-left  - Rotate 90° left"
        echo "  rotate-right - Rotate 90° right"
        echo "  auto-rotate  - Enable auto-rotation"
        echo "  lock-rotation - Lock current rotation"
        echo ""
        echo "🛠️ Utility Commands:"
        echo "  status    - Check if Expo is running"
        echo "  kill      - Kill all Expo processes"
        echo ""
        echo "Example: ./dev.sh landscape"
        ;;
esac
