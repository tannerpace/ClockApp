# Screen Burn-In Prevention System

## 🛡️ Overview

The ClockApp now includes a comprehensive screen burn-in prevention system to protect OLED and AMOLED displays from permanent image retention. This is especially important for clock apps that display static content for extended periods.

## 🚀 Features Implemented

### 1. **Position Shifting**

- Periodically moves the entire clock display by small amounts (±20px max)
- Configurable intervals: 2, 5, 10, 15, or 30 minutes
- Uses smooth, random positioning within safe bounds
- Prevents static elements from "burning" in the same pixels

### 2. **Auto-Dimming**

- Automatically dims the display after a period of inactivity
- Configurable timing: 5 minutes to 1 hour, or disabled
- Reduces to 60% opacity for containers and 40% for containers
- Resets on touch/interaction

### 3. **Color Rotation** (Optional)

- Cycles through subtle color variations to prevent pixel wear
- 8 carefully selected light colors that maintain readability
- Changes every minute when enabled
- Preserves the visual aesthetic while providing protection

### 4. **Size Variation** (Optional)

- Slightly varies text size (±5%) to prevent uniform pixel stress
- Changes every 30 seconds when enabled
- Maintains readability while distributing pixel load

### 5. **Activity Detection**

- Touch interactions reset all timers and dimming
- Keeps display bright and responsive during active use
- Smart detection prevents unnecessary battery drain

## ⚙️ Settings Available

Located in **Settings > Screen Protection**:

| Setting                     | Options       | Default  | Description                    |
| --------------------------- | ------------- | -------- | ------------------------------ |
| **Burn-In Prevention**      | On/Off        | On       | Master toggle for all features |
| **Position Shift Interval** | 2-30 min      | 5 min    | How often to move display      |
| **Auto-Dim After**          | 5 min - 1 hr  | 10 min   | Inactivity timeout for dimming |
| **Color Rotation**          | On/Off        | Off      | Subtle color cycling           |
| **Size Variation**          | On/Off        | Off      | Minor size adjustments         |
| **Screen Timeout**          | 30 min - 4 hr | Disabled | Complete screen off (future)   |

## 🔧 Technical Implementation

### Context Architecture

- **BurnInContext**: Manages all burn-in prevention logic
- **Centralized state**: Position, dimming, colors, activity tracking
- **Performance optimized**: Minimal re-renders, efficient timers

### Smart Algorithms

- **Safe bounds calculation**: Ensures content stays on screen
- **Gradual transitions**: Smooth visual changes
- **Battery conscious**: Timers only run when needed
- **Touch responsive**: Immediate feedback to user interaction

### Integration Points

- **DigitalClock**: Full integration with all text elements
- **Container effects**: Both portrait and landscape modes
- **Glass effect compatibility**: Works with/without glassmorphism
- **Responsive design**: Adapts to screen rotations

## 🎯 Benefits

### For OLED/AMOLED Displays:

- **Prevents permanent burn-in** from static clock elements
- **Extends display lifespan** through pixel load distribution
- **Maintains visual quality** over long-term use
- **Energy efficient** with smart dimming

### For User Experience:

- **Unobtrusive operation** - barely noticeable movement
- **Customizable settings** - adjust to personal preferences
- **Activity aware** - stays bright during active use
- **Visual consistency** - maintains app's beautiful design

## 📱 Usage Recommendations

### Conservative Settings (Recommended):

- Burn-In Prevention: **On**
- Position Shift: **5 minutes**
- Auto-Dim: **10 minutes**
- Color Rotation: **Off** (maintain color consistency)
- Size Variation: **Off** (maintain size consistency)

### Aggressive Protection:

- Position Shift: **2 minutes**
- Auto-Dim: **5 minutes**
- Color Rotation: **On**
- Size Variation: **On**

### Minimal Protection:

- Position Shift: **15-30 minutes**
- Auto-Dim: **30 minutes+**
- Other features: **Off**

## 🔮 Future Enhancements

Potential additions planned:

- **Smart brightness adaptation** based on ambient light
- **Sleep mode** with ultra-minimal display
- **Pixel refresh patterns** for deeper protection
- **Usage analytics** to optimize protection timing
- **Device-specific optimizations** for different display types

## ⚠️ Important Notes

1. **Default Settings**: Conservative approach - most users won't notice the protection working
2. **Performance**: Minimal impact on battery life and performance
3. **Compatibility**: Works with all existing app features (glass effects, weather, etc.)
4. **Reversible**: All effects are temporary and don't permanently alter the display
5. **Touch Responsive**: Any interaction immediately restores full brightness and resets timers

The burn-in prevention system provides comprehensive protection while maintaining the beautiful, functional design of the ClockApp!
