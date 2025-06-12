# ClockApp

A modern clock application built with Expo and React Native for iOS and Android.

## Features

- **Digital Clock Display** - Clean, easy-to-read time display with greeting messages
- **Analog Clock** - Traditional clock face with smooth animations
- **World Clock** - Multiple time zones support (New York, London, Tokyo, Sydney)
- **Dark Theme** - Elegant dark interface optimized for readability
- **Keep Awake** - Screen stays on while using the digital clock
- **Cross Platform** - Works on both iOS and Android

## Screenshots

*Screenshots will be added once the app is developed*

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go app](https://expo.dev/client) on your mobile device
- [Android Studio](https://developer.android.com/studio) (optional, for Android emulator)
- [Xcode](https://developer.apple.com/xcode/) (optional, for iOS simulator on macOS)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ClockApp.git
   cd ClockApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser

## Project Structure

```
ClockApp/
├── App.js                 # Main navigation and app entry
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── components/           # Reusable components
│   ├── DigitalClock.js   # Digital clock display
│   └── AnalogClock.js    # Analog clock with SVG
├── screens/              # Screen components
│   ├── DigitalClockScreen.js
│   ├── AnalogClockScreen.js
│   └── WorldClockScreen.js
├── assets/               # Images and icons
└── README.md
```

## Technologies Used

- **Framework**: Expo SDK 53
- **Language**: JavaScript/React Native
- **Navigation**: React Navigation 6
- **Icons**: Expo Vector Icons
- **Graphics**: react-native-svg
- **Development**: Metro bundler
- **Platform**: Cross-platform (iOS, Android, Web)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator  
- `npm run web` - Run in web browser

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Using EAS Build (Recommended)
```bash
npm install -g @expo/cli
eas build --platform android
eas build --platform ios
```

## Roadmap

- [x] Basic digital clock functionality
- [x] Analog clock with animations
- [x] World clock for multiple timezones
- [x] Dark theme interface
- [ ] Alarm system
- [ ] Timer and stopwatch
- [ ] Customizable themes
- [ ] Widget support (when available in Expo)
- [ ] Backup and restore settings

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/ClockApp/issues) on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Expo Team for the amazing development platform
- React Native community
- Contributors and testers