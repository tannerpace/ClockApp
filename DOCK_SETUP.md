# ClockApp - Dock Setup Guide

## Overview

This Expo React Native clock app is optimized for landscape dock/stand usage, similar to iPhone StandBy mode but for Android devices.

## Features

- **Auto-rotation support** - Works in both portrait and landscape
- **Landscape dock mode** - Optimized layout for side viewing in docks
- **Multiple clock types** - Digital, Analog, World Clock, Timer/Stopwatch
- **Weather integration** - Uses IP-based location with multiple fallback services
- **Always-on display** - Keeps screen awake while app is active

## Dock Usage

When your device is in a landscape dock:

- **Digital Clock**: Large time display with date and greeting
- **Weather**: Compact weather info with temperature and conditions
- **Auto-detection**: App automatically switches to landscape layout

## Development

### Quick Start

Use VS Code tasks for easy development:

- **Ctrl+Shift+P** → "Tasks: Run Task" → "Start Expo Development Server"
- Or use the keyboard shortcut: **Cmd+Shift+R** (Start Expo)

### Available Tasks

- `Start Expo Development Server` - Main development server
- `Start Expo (Android)` - Launch directly on Android
- `Start Expo (iOS)` - Launch directly on iOS
- `Clear Expo Cache` - Clear cache when needed
- `Restart with Clean Cache` - Full reset and restart
- `Test Landscape Mode (Android)` - Enable rotation on Android emulator

### Weather API

Uses multiple fallback location services to avoid rate limiting:

1. ipapi.co (primary)
2. ip-api.com (fallback)
3. ipgeolocation.io (fallback)
4. Default location (NYC) if all fail

Weather data from National Weather Service (weather.gov) API.

### Testing Dock Mode

1. Rotate your device/emulator to landscape
2. The app automatically switches to dock-optimized layout
3. On Android emulator: Use "Test Landscape Mode" task or Ctrl+F11/F12

## File Structure

```
components/
├── DigitalClock.js     # Main clock with landscape optimization
├── AnalogClock.js      # SVG analog clock
└── WeatherComponent.js # Weather with fallback services

screens/
├── DigitalClockScreen.js
├── AnalogClockScreen.js
├── WorldClockScreen.js
├── TimerScreen.js
└── WeatherScreen.js
```

## Recommended Hardware

- Android tablet with landscape dock/stand
- Screen size: 7-10 inches optimal
- Auto-rotation enabled
- WiFi connection for weather data

## Troubleshooting

### Weather Not Loading

- Check internet connection
- Rate limiting: Wait 10 minutes between requests
- Use "Restart with Clean Cache" task

### Landscape Mode Issues

- Ensure auto-rotation is enabled
- Use "Test Landscape Mode" task for Android
- Check app.json orientation setting (should be "default")

### Performance Issues

- Use "Clear Expo Cache" task
- Restart development server
- Check for memory leaks in components
