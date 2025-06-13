import { useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';

const AutoHideWrapper = ({ children, onToggleTabBar }) => {
  const { settings } = useSettings();
  const [hideTimer, setHideTimer] = useState(null);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  useEffect(() => {
    if (settings.autoHideTabBar) {
      // Auto-hide after 3 seconds of inactivity
      startHideTimer();
    } else {
      // Show tab bar and clear timer if auto-hide is disabled
      setIsTabBarVisible(true);
      clearHideTimer();
      if (onToggleTabBar) {
        onToggleTabBar(true);
      }
    }

    return () => clearHideTimer();
  }, [settings.autoHideTabBar]);

  const startHideTimer = () => {
    clearHideTimer();
    const timer = setTimeout(() => {
      setIsTabBarVisible(false);
      if (onToggleTabBar) {
        onToggleTabBar(false);
      }
    }, 3000); // Hide after 3 seconds
    setHideTimer(timer);
  };

  const clearHideTimer = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      setHideTimer(null);
    }
  };

  const handleUserInteraction = () => {
    if (settings.autoHideTabBar) {
      // Show tab bar on interaction
      setIsTabBarVisible(true);
      if (onToggleTabBar) {
        onToggleTabBar(true);
      }
      // Restart hide timer
      startHideTimer();
    }
  };

  if (!settings.autoHideTabBar) {
    return children;
  }

  return (
    <TouchableWithoutFeedback onPress={handleUserInteraction}>
      <View style={styles.container}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AutoHideWrapper;
