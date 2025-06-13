# 🛠️ ClockApp Troubleshooting Guide

## 🌤️ **Weather Issues**

### **Rate Limiting (429 Error)**

```bash
# Clear cache and restart
./dev.sh clean

# Or kill and restart
./dev.sh kill
./dev.sh android
```

**Solution**: App automatically tries backup APIs:

1. ipapi.co → ip-api.com → default NYC location

### **"Weather Unavailable" Error**

- Check internet connection
- Verify location services are working
- Weather.gov only works for US locations

### **No Location Showing**

- IP geolocation may be blocked
- Falls back to weather.gov location
- Final fallback: "Location Unknown"

## 📱 **App Development Issues**

### **Metro/Expo Won't Start**

```bash
# Kill all processes and restart
./dev.sh kill
./dev.sh android

# Clear everything
./dev.sh clean
```

### **Code Changes Not Updating**

```bash
# Fast refresh not working? Force reload:
# Press 'r' in terminal or use:
./dev.sh clean
```

### **Android Emulator Issues**

```bash
# Enable rotation for dock testing:
./dev.sh landscape

# Or manually:
adb shell settings put system accelerometer_rotation 1
```

## 🔧 **VS Code Integration**

### **Tasks Not Working**

- **Cmd+Shift+P** → "Tasks: Run Task"
- Check `.vscode/tasks.json` exists
- Restart VS Code if needed

### **Auto-formatting Issues**

- Prettier should format on save
- Check `.vscode/settings.json` for config
- Manual format: **Shift+Alt+F**

### **ESLint Errors**

- Check `.eslintrc.json` config
- Install recommended extensions
- Restart VS Code after extension install

## 🏗️ **Build Issues**

### **Dependencies Missing**

```bash
./dev.sh install
# or
npm install
```

### **Cache Issues**

```bash
# Nuclear option - clear everything:
rm -rf node_modules
npm install
./dev.sh clean
```

## 📊 **Performance Issues**

### **App Running Slow**

- Close other apps on device/emulator
- Restart Metro bundler
- Check for memory leaks in components

### **Weather Loading Slow**

- Normal on first load (IP lookup + weather API)
- Subsequent loads use 10-minute cache
- Check network connection

## 🎯 **Dock Setup Issues**

### **Landscape Mode Not Working**

1. Check `app.json` → `"orientation": "default"`
2. Enable auto-rotation on device
3. Use `./dev.sh landscape` for emulator

### **Layout Not Optimizing**

- App detects orientation automatically
- Large screens: Landscape layout
- Small screens: Portrait layout

## 🚨 **Emergency Reset**

If everything breaks:

```bash
# Kill all processes
./dev.sh kill

# Clean everything
rm -rf node_modules .expo
npm install

# Fresh start
./dev.sh android
```

## 📞 **Quick Commands Reference**

```bash
./dev.sh android    # Start on Android
./dev.sh clean      # Clear cache
./dev.sh kill       # Kill processes
./dev.sh status     # Check if running
./dev.sh landscape  # Enable rotation
```

Your ClockApp is robust with multiple fallbacks! 🕰️
