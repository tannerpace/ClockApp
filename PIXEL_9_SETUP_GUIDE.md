# 📱 Pixel 9 Emulator & SDK Setup Guide

## 🚀 **Installation Status: IN PROGRESS**

**Current Status:** Installing Android SDK packages for Pixel 9 compatibility

Required components for proper Pixel 9 testing:

1. **Android SDK 34** (Android 14) - ⏳ INSTALLING
2. **Pixel 9 System Image** - ⏳ PENDING
3. **Updated Android Emulator** - ⏳ PENDING

## 📦 **Step 1: Update Android SDK**

### **Using Android Studio (Recommended):**

1. Open **Android Studio**
2. Go to **Tools** → **SDK Manager**
3. In **SDK Platforms** tab:
   - ✅ Check **Android 14.0 (API level 34)**
   - ✅ Check **Android 13.0 (API level 33)** (fallback)
4. In **SDK Tools** tab:
   - ✅ Update **Android Emulator** to latest
   - ✅ Update **Android SDK Platform-Tools**
   - ✅ Update **Google Play Services**

### **Using Command Line:**

```bash
# Install Android SDK 34
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platforms;android-34"

# Install Pixel 9 system images
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "system-images;android-34;google_apis_playstore;x86_64"

# Update emulator
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "emulator"
```

## 📱 **Step 2: Create Pixel 9 Emulator**

### **Using Android Studio Device Manager:**

1. Open **Android Studio**
2. Go to **Tools** → **Device Manager**
3. Click **Create Device**
4. Select **Phone** → **Pixel 9** (6.3", 1080 × 2424)
5. Choose **API Level 34** with **Google APIs & Play Store**
6. Name it: `Pixel_9_API_34`
7. **Advanced Settings**:
   - RAM: 4096 MB
   - VM Heap: 512 MB
   - Enable **Hardware Acceleration**

### **Using Command Line:**

```bash
# Create Pixel 9 AVD
$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd \
  -n "Pixel_9_API_34" \
  -k "system-images;android-34;google_apis_playstore;x86_64" \
  -d "pixel_9"

# Start the emulator
$ANDROID_HOME/emulator/emulator -avd Pixel_9_API_34
```

## 🔧 **Step 3: Update Your Project**

Your `app.json` is already configured correctly:

```json
{
  "android": {
    "targetSdkVersion": 34,
    "compileSdkVersion": 34
  }
}
```

## 🧪 **Step 4: Test Your ClockApp**

### **Start Pixel 9 Emulator & Test:**

```bash
# Start your app on the new Pixel 9 emulator
./dev.sh android

# Once loaded, optimize for Pixel 9
./dev.sh pixel9-setup

# Test dock mode
./dev.sh pixel9-test
```

## 📋 **Verification Checklist**

### **Check Your Current Setup:**

```bash
# Check Android SDK version
adb shell getprop ro.build.version.sdk

# Should return: 34 (for Android 14)

# Check device model
adb shell getprop ro.product.model

# Should return: sdk_gphone64_x86_64 or similar

# Check screen resolution
adb shell wm size

# Should return: Physical size: 1080x2424
```

### **Expected Pixel 9 Specs:**

- ✅ **Resolution**: 1080 × 2424 (20:9 aspect ratio)
- ✅ **Density**: 420 DPI
- ✅ **API Level**: 34 (Android 14)
- ✅ **Features**: Always-On Display, Edge-to-Edge

## 🚨 **If You Don't Have Android Studio**

### **Install Android Studio (Easiest):**

1. Download from: https://developer.android.com/studio
2. Install with default settings
3. Follow SDK setup above

### **Command Line Only (Advanced):**

```bash
# Install Android command line tools
brew install --cask android-commandlinetools

# Set environment variables in ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator

# Reload shell
source ~/.zshrc

# Install SDK and emulator
sdkmanager "platforms;android-34"
sdkmanager "system-images;android-34;google_apis_playstore;x86_64"
sdkmanager "emulator"
```

## 🎯 **Quick Test Commands**

Once your Pixel 9 emulator is running:

```bash
# Check if emulator is ready
adb devices

# Start your clock app
./dev.sh android

# Set up optimal Pixel 9 settings
./dev.sh pixel9-setup

# Test landscape dock mode
./dev.sh landscape

# Verify it's working
adb shell settings get system user_rotation
# Should return: 1 (landscape)
```

## 📊 **Expected Results on Pixel 9**

### **Landscape Mode (2424 × 1080):**

- Large time display on left side
- Compact weather info on right
- Perfect for dock/bedside usage

### **Portrait Mode (1080 × 2424):**

- Full weather details
- Scrollable 7-day forecast
- Easy navigation with tall screen

## 💡 **Pro Tips**

1. **Enable GPU Acceleration** in emulator settings for better performance
2. **Allocate 4GB+ RAM** for smooth operation
3. **Use Pixel 9 skin** for realistic visual testing
4. **Test both orientations** to ensure dock mode works perfectly

Your ClockApp will look and perform beautifully on the actual Pixel 9 hardware once tested on the proper emulator! 🎉
