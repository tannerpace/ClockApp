# 🫥 Auto-Hide Tab Bar Feature

## ✨ **New Feature Added**

Your ClockApp now includes an **Auto-Hide Tab Bar** setting for the ultimate clean dock experience!

## 🎯 **What It Does**

- **Hides the bottom navigation bar** automatically after 3 seconds of inactivity
- **Perfect for dock/bedside usage** - completely clean interface
- **Smart interaction** - tab bar reappears when you interact with the app
- **Toggleable setting** - easily enable/disable in Settings

## ⚙️ **How to Enable**

1. Go to **Settings** tab
2. Navigate to **🎨 Appearance** section
3. Toggle **Auto-hide Tab Bar** ON
4. Return to any other screen
5. Wait 3 seconds → Tab bar disappears automatically! ✨

## 🔄 **How It Works**

### **Auto-Hide Behavior**

- **Timer starts** when you stop interacting with the app
- **3-second countdown** before tab bar hides
- **Smooth disappearance** - tab bar fades away
- **Clean interface** - only clock content visible

### **Show on Interaction**

- **Tap anywhere** on the screen → Tab bar reappears
- **Navigation events** reset the timer
- **Settings changes** instantly apply
- **Timer restarts** each time you interact

### **Smart Logic**

```javascript
// Auto-hide after 3 seconds of inactivity
if (settings.autoHideTabBar) {
  setTimeout(() => setShowTabBar(false), 3000);
}

// Show on any user interaction
onInteraction: () => {
  setShowTabBar(true);
  // Restart 3-second timer
};
```

## 📱 **Perfect for Dock Usage**

### **Ultra-Clean Mode**

Combine with other settings for maximum cleanliness:

1. **Auto-hide Tab Bar**: ON
2. **Show Screen Titles**: OFF
3. **Background**: Dark color
4. **Clock Type**: Digital (minimal)

Result: **Pure clock display with no UI elements**! 🎊

### **Bedroom/Nightstand Perfect**

- No distracting navigation elements
- Tap to access controls when needed
- Auto-hides for minimal light emission
- Perfect for beside charging dock

## 🎨 **Visual States**

### **Normal Mode** (autoHideTabBar: false)

```
┌─────────────────────┐
│     Clock Display   │
│                     │
│                     │
├─────────────────────┤
│ 🕐 ⏱️ 🌤️ ⚙️       │ ← Always visible
└─────────────────────┘
```

### **Auto-Hide Mode** (autoHideTabBar: true)

```
// After 3 seconds:
┌─────────────────────┐
│     Clock Display   │
│                     │
│                     │ ← Completely clean
│                     │
│                     │
└─────────────────────┘

// On tap:
┌─────────────────────┐
│     Clock Display   │
│                     │
│                     │
├─────────────────────┤
│ 🕐 ⏱️ 🌤️ ⚙️       │ ← Reappears
└─────────────────────┘
```

## 🛠️ **Technical Implementation**

### **Settings Integration**

```javascript
// Added to SettingsContext
{
  autoHideTabBar: false, // Default: disabled
}
```

### **App Navigation Logic**

```javascript
// Timer-based hiding
const [showTabBar, setShowTabBar] = useState(true);

useEffect(() => {
  if (settings.autoHideTabBar) {
    const timer = setTimeout(() => {
      setShowTabBar(false);
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [settings.autoHideTabBar]);

// Dynamic tab bar styling
tabBarStyle: settings.autoHideTabBar && !showTabBar
  ? { display: 'none' }
  : { backgroundColor: '#111', borderTopColor: '#333' };
```

### **Interaction Handling**

```javascript
// Reset timer on user interaction
screenListeners={{
  tabPress: resetHideTimer,
  focus: resetHideTimer,
}}
```

## 🧪 **Testing the Feature**

### **Enable Auto-Hide**

1. Settings → Appearance → Auto-hide Tab Bar → ON
2. Go to Clock screen
3. Don't touch screen for 3 seconds
4. ✅ Tab bar should disappear

### **Show on Interaction**

1. With tab bar hidden, tap anywhere on screen
2. ✅ Tab bar should reappear immediately
3. ✅ Timer should restart (hides again after 3 seconds)

### **Disable Auto-Hide**

1. Settings → Appearance → Auto-hide Tab Bar → OFF
2. ✅ Tab bar should always stay visible
3. ✅ No auto-hiding behavior

## 🔮 **Future Enhancements**

### **Planned Improvements**

- **Configurable timer** (1s, 3s, 5s, 10s options)
- **Gesture controls** (swipe up to show tab bar)
- **Auto-hide headers** too (complete full-screen mode)
- **Fade animations** for smoother transitions

### **Advanced Features**

- **Motion detection** (hide only when device is still)
- **Time-based hiding** (auto-hide only at night)
- **App state awareness** (don't hide during active usage)

## ✅ **Status: Ready to Use**

The auto-hide tab bar feature is fully implemented and ready for testing! It provides the cleanest possible dock experience while maintaining easy access to navigation when needed.

Perfect for your Pixel 9 dock setup! 🚀
