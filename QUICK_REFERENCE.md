# 📱 Quick Reference - ClockApp Dock Setup

## 🚀 One-Command Start

```bash
# Start development (recommended)
npx expo start --android

# Or use the dev script
./dev.sh android
```

## ⌨️ VS Code Shortcuts

- **Cmd+Shift+R** → Start Expo
- **Cmd+Shift+P** → "Tasks: Run Task" → Choose any task

## 🔄 If Weather API Issues

```bash
# Multiple fallback services now handle rate limiting
# App will automatically try:
# 1. ipapi.co
# 2. ip-api.com
# 3. Default NYC location

# If still issues, clear cache:
./dev.sh clean
```

## 📱 Testing Dock Mode

1. **Rotate device to landscape**
2. **Android emulator**: Ctrl+F11 or F12
3. **Use task**: "Test Landscape Mode (Android)"

## 🎯 Dock Optimizations Active

✅ **Digital Clock**: Large time, compact date  
✅ **Weather**: Essential info only, right-aligned  
✅ **Auto-rotation**: Detects landscape automatically  
✅ **Keep-awake**: Screen stays on  
✅ **Multi-API**: Weather with fallbacks

## 📁 Quick File Access

- `components/DigitalClock.js` - Main clock with dock layout
- `components/WeatherComponent.js` - Weather with API fallbacks
- `.vscode/tasks.json` - All development tasks
- `dev.sh` - Command line helper

## 🛠️ Development Tasks Available

1. Start Expo Development Server
2. Start Expo (Android)
3. Start Expo (iOS)
4. Start Expo (Web)
5. Clear Expo Cache
6. Install Dependencies
7. Expo Doctor
8. Build APK (Development)
9. Restart with Clean Cache
10. Test Landscape Mode (Android)

Your dock clock app is ready! 🕰️
