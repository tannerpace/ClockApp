import { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from './SettingsContext';

const TabBarContext = createContext();

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
};

export const TabBarProvider = ({ children }) => {
  const { settings } = useSettings();
  const [showTabBar, setShowTabBar] = useState(true);
  const [hideTimer, setHideTimer] = useState(null);

  // Auto-hide tab bar functionality
  useEffect(() => {
    if (settings.autoHideTabBar) {
      startHideTimer();
    } else {
      // Show tab bar if auto-hide is disabled
      setShowTabBar(true);
      clearHideTimer();
    }

    return () => clearHideTimer();
  }, [settings.autoHideTabBar]);

  const startHideTimer = () => {
    clearHideTimer();
    const timer = setTimeout(() => {
      setShowTabBar(false);
    }, 3000);
    setHideTimer(timer);
  };

  const clearHideTimer = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      setHideTimer(null);
    }
  };

  const showTabBarAndResetTimer = () => {
    if (settings.autoHideTabBar) {
      setShowTabBar(true);
      startHideTimer();
    }
  };

  const value = {
    showTabBar,
    showTabBarAndResetTimer,
    isAutoHideEnabled: settings.autoHideTabBar,
  };

  return <TabBarContext.Provider value={value}>{children}</TabBarContext.Provider>;
};

export default TabBarContext;
