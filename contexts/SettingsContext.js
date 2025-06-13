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
    clockStyle: 'digital',
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
        clockStyle: 'digital',
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
