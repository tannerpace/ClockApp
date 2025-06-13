# 🔄 MacBook Rotation Commands for ClockApp

## 🚀 **Quick Commands for Testing Dock Mode**

### **Start App + Set Landscape (Recommended)**

```bash
# Start the app on Android and set landscape mode
./dev.sh android
# Wait for app to load, then rotate:
./dev.sh landscape
```

### **Individual Rotation Commands**

```bash
./dev.sh landscape     # Perfect for dock mode testing
./dev.sh portrait      # Back to normal mode
./dev.sh rotate-left   # 90° left rotation
./dev.sh rotate-right  # 90° right rotation
./dev.sh auto-rotate   # Enable auto-rotation
./dev.sh lock-rotation # Lock current rotation
```

## 📱 **VS Code Tasks (Alternative)**

- **Cmd+Shift+P** → "Tasks: Run Task" → "Test Landscape Mode (Android)"
- **Cmd+Shift+P** → "Tasks: Run Task" → "Set Portrait Mode (Android)"

## 🔧 **Manual ADB Commands**

If you prefer to run them directly:

```bash
# Enable auto-rotation
adb shell settings put system accelerometer_rotation 1

# Rotate to landscape (dock mode)
adb shell settings put system user_rotation 1

# Rotate to portrait
adb shell settings put system user_rotation 0

# Rotate left (270°)
adb shell settings put system user_rotation 3

# Check current rotation
adb shell settings get system user_rotation
```

## 🎯 **Testing Your Clock App**

1. **Start the app**: `./dev.sh android`
2. **Wait for it to load** (check the weather loads)
3. **Set landscape mode**: `./dev.sh landscape`
4. **Check the dock layout**: Should show large time + compact weather

## 📋 **Rotation Values Reference**

- `0` = Portrait (default)
- `1` = Landscape (90° clockwise) - **Perfect for dock**
- `2` = Portrait upside down
- `3` = Landscape (90° counter-clockwise)

## 🔍 **Troubleshooting**

If rotation doesn't work:

```bash
# Check if emulator is connected
adb devices

# Check current settings
adb shell settings get system accelerometer_rotation
adb shell settings get system user_rotation

# Force restart with landscape
./dev.sh kill
./dev.sh android
# Wait for load, then:
./dev.sh landscape
```

Your clock app is optimized for landscape dock usage! 🕰️
