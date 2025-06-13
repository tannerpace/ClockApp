import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    theme: 'dark',
    showSeconds: true,
    format24Hour: false,
    keepAwake: true,
    brightness: 'auto',
    fontSize: 'medium',
    showWeather: true,
    weatherUnit: 'fahrenheit',
    clockType: 'digital',
    showScreenTitles: true,
    autoHideTabBar: false,
    // Digital clock styling options
    clockShadow: true,
    clockShadowColor: '#000000',
    clockShadowIntensity: 'medium',
    clockShadowOffset: 'medium',
    clockGlow: false,
    clockGlowColor: '#FFFFFF',
    clockGlowIntensity: 'medium',
    clockGradient: false,
    clockGradientColors: ['#FFFFFF', '#CCCCCC'],
    clockGradientDirection: 'vertical',
    clockBorder: false,
    clockBorderColor: '#FFFFFF',
    clockBorderWidth: 'thin',
    clockBorderStyle: 'solid',
    clockBorderRadius: 'none',
    clockBackgroundBlur: false,
    clockBackground: false,
    clockBackgroundColor: 'rgba(0,0,0,0.3)',
    clockBackgroundOpacity: 'medium',
    clockFontWeight: 'normal',
    clockLetterSpacing: 'normal',
    clockTextAlign: 'center',
    clockItalic: false,
    clockUnderline: false,
    clockStrikethrough: false,
    clockOpacity: 100,
    clockRotation: 0,
    clockSkew: 0,
    clockScale: 100,
    clockAnimationPulse: false,
    clockAnimationFade: false,
    clockAnimationBounce: false,
    clockColorAnimation: false,
    clockRainbowText: false,
    clockOutline: false,
    clockOutlineColor: '#000000',
    clockOutlineWidth: 'thin',
    clockEmboss: false,
    clockEngraved: false,
    clockNeon: false,
    clockNeonColor: '#00FFFF',
    clockShowWeather: true,
    // Screen burn-in prevention
    burnInPrevention: true,
    burnInPositionShift: true, // Enable position shifting
    burnInShiftInterval: 300, // seconds (5 minutes)
    burnInAutoDim: true, // Enable auto-dimming
    burnInDimAfter: 600, // seconds (10 minutes)
    burnInColorRotation: false,
    burnInSizeVariation: false,
    burnInScreenTimeout: 0, // 0 = disabled, otherwise minutes
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load settings on app start
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('clockSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async newSettings => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await AsyncStorage.setItem('clockSettings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.log('Error saving settings:', error);
      return settings;
    }
  };

  const resetSettings = async () => {
    try {
      await AsyncStorage.removeItem('clockSettings');
      const defaultSettings = {
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
        theme: 'dark',
        showSeconds: true,
        format24Hour: false,
        keepAwake: true,
        brightness: 'auto',
        fontSize: 'medium',
        showWeather: true,
        weatherUnit: 'fahrenheit',
        clockType: 'digital',
        showScreenTitles: true,
        autoHideTabBar: false,
        // Digital clock styling options
        clockShadow: true,
        clockShadowColor: '#000000',
        clockShadowIntensity: 'medium',
        clockShadowOffset: 'medium',
        clockGlow: false,
        clockGlowColor: '#FFFFFF',
        clockGlowIntensity: 'medium',
        clockGradient: false,
        clockGradientColors: ['#FFFFFF', '#CCCCCC'],
        clockGradientDirection: 'vertical',
        clockBorder: false,
        clockBorderColor: '#FFFFFF',
        clockBorderWidth: 'thin',
        clockBorderStyle: 'solid',
        clockBorderRadius: 'none',
        clockBackgroundBlur: false,
        clockBackground: false,
        clockBackgroundColor: 'rgba(0,0,0,0.3)',
        clockBackgroundOpacity: 'medium',
        clockFontWeight: 'normal',
        clockLetterSpacing: 'normal',
        clockTextAlign: 'center',
        clockItalic: false,
        clockUnderline: false,
        clockStrikethrough: false,
        clockOpacity: 100,
        clockRotation: 0,
        clockSkew: 0,
        clockScale: 100,
        clockAnimationPulse: false,
        clockAnimationFade: false,
        clockAnimationBounce: false,
        clockColorAnimation: false,
        clockRainbowText: false,
        clockOutline: false,
        clockOutlineColor: '#000000',
        clockOutlineWidth: 'thin',
        clockEmboss: false,
        clockEngraved: false,
        clockNeon: false,
        clockNeonColor: '#00FFFF',
        clockShowWeather: true,
        // Screen burn-in prevention
        burnInPrevention: true,
        burnInPositionShift: true,
        burnInShiftInterval: 300,
        burnInAutoDim: true,
        burnInDimAfter: 600,
        burnInColorRotation: false,
        burnInSizeVariation: false,
        burnInScreenTimeout: 0,
      };
      setSettings(defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.log('Error resetting settings:', error);
      return settings;
    }
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export default SettingsContext;
