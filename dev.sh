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
        echo "📱 Enabling landscape mode on Android emulator..."
        adb shell settings put system accelerometer_rotation 1
        adb shell input keyevent 82
        echo "Rotation enabled! Use Ctrl+F11/F12 to rotate emulator."
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
        echo "Commands:"
        echo "  start     - Start Expo development server"
        echo "  android   - Start on Android"
        echo "  ios       - Start on iOS"
        echo "  clean     - Clear cache and restart"
        echo "  landscape - Enable rotation on Android emulator"
        echo "  install   - Install npm dependencies"
        echo "  doctor    - Run Expo doctor for diagnostics"
        echo "  status    - Check if Expo is running"
        echo "  kill      - Kill all Expo processes"
        echo ""
        echo "Example: ./dev.sh start"
        ;;
esac
