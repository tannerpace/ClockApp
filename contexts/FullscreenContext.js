import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Safely import expo-navigation-bar with fallback
let NavigationBar;
try {
  NavigationBar = require('expo-navigation-bar');
} catch (error) {
  console.warn('expo-navigation-bar not available:', error);
  NavigationBar = null;
}

const FullscreenContext = createContext();

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
};

export const FullscreenProvider = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [navigationBarVisible, setNavigationBarVisible] = useState(false);

  const enableFullscreen = async () => {
    if (Platform.OS === 'android' && NavigationBar) {
      try {
        await NavigationBar.setVisibilityAsync('hidden');
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        await NavigationBar.setBackgroundColorAsync('#00000000');
        setNavigationBarVisible(false);
        setIsFullscreen(true);
      } catch (error) {
        console.log('Error enabling fullscreen:', error);
        // Fallback - just set the state
        setIsFullscreen(true);
        setNavigationBarVisible(false);
      }
    } else {
      // Fallback for non-Android or when NavigationBar is not available
      setIsFullscreen(true);
      setNavigationBarVisible(false);
    }
  };

  const showNavigationBar = async () => {
    if (Platform.OS === 'android' && NavigationBar) {
      try {
        await NavigationBar.setVisibilityAsync('visible');
        await NavigationBar.setBehaviorAsync('inset-swipe');
        setNavigationBarVisible(true);
        setIsFullscreen(false);
      } catch (error) {
        console.log('Error showing navigation bar:', error);
        // Fallback - just set the state
        setIsFullscreen(false);
        setNavigationBarVisible(true);
      }
    } else {
      // Fallback for non-Android or when NavigationBar is not available
      setIsFullscreen(false);
      setNavigationBarVisible(true);
    }
  };

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await showNavigationBar();
    } else {
      await enableFullscreen();
    }
  };

  // Initialize fullscreen mode
  useEffect(() => {
    enableFullscreen();
  }, []);

  const value = {
    isFullscreen,
    navigationBarVisible,
    enableFullscreen,
    showNavigationBar,
    toggleFullscreen,
  };

  return <FullscreenContext.Provider value={value}>{children}</FullscreenContext.Provider>;
};
