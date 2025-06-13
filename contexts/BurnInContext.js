import { createContext, useContext, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { useSettings } from './SettingsContext';

const BurnInContext = createContext();

export const useBurnIn = () => {
  const context = useContext(BurnInContext);
  if (!context) {
    throw new Error('useBurnIn must be used within a BurnInProvider');
  }
  return context;
};

export const BurnInProvider = ({ children }) => {
  const { settings } = useSettings();
  const [burnInOffset, setBurnInOffset] = useState({ x: 0, y: 0 });
  const [isDimmed, setIsDimmed] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeVariation, setSizeVariation] = useState(1);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Screen dimensions for calculating safe offset ranges
  const screenDimensions = Dimensions.get('window');
  const maxOffsetX = Math.min(20, screenDimensions.width * 0.05);
  const maxOffsetY = Math.min(20, screenDimensions.height * 0.05);

  // Color rotation colors (subtle variations of white/light colors)
  const colorRotationPalette = [
    '#FFFFFF', // White
    '#F0F0F0', // Light gray
    '#E8E8E8', // Slightly darker gray
    '#F8F8FF', // Ghost white
    '#F5F5DC', // Beige
    '#FFF8DC', // Cornsilk
    '#F0FFFF', // Azure
    '#F5FFFA', // Mint cream
  ];

  // Reset activity timer
  const resetActivity = () => {
    setLastActivity(Date.now());
    setIsDimmed(false);
  };

  // Position shifting effect
  useEffect(() => {
    if (!settings.burnInPrevention || !settings.burnInPositionShift) return;

    const shiftInterval = setInterval(() => {
      // Generate random small offset within safe bounds
      const offsetX = (Math.random() - 0.5) * 2 * maxOffsetX;
      const offsetY = (Math.random() - 0.5) * 2 * maxOffsetY;

      setBurnInOffset({ x: offsetX, y: offsetY });
    }, settings.burnInShiftInterval * 1000);

    return () => clearInterval(shiftInterval);
  }, [
    settings.burnInPrevention,
    settings.burnInPositionShift,
    settings.burnInShiftInterval,
    maxOffsetX,
    maxOffsetY,
  ]);

  // Dimming effect based on inactivity
  useEffect(() => {
    if (!settings.burnInPrevention || !settings.burnInAutoDim || settings.burnInDimAfter === 0)
      return;

    const dimInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = (now - lastActivity) / 1000;

      if (timeSinceActivity >= settings.burnInDimAfter) {
        setIsDimmed(true);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(dimInterval);
  }, [settings.burnInPrevention, settings.burnInAutoDim, settings.burnInDimAfter, lastActivity]);

  // Color rotation effect
  useEffect(() => {
    if (!settings.burnInPrevention || !settings.burnInColorRotation) return;

    const colorInterval = setInterval(() => {
      setColorIndex(prevIndex => (prevIndex + 1) % colorRotationPalette.length);
    }, 60000); // Change color every minute

    return () => clearInterval(colorInterval);
  }, [settings.burnInPrevention, settings.burnInColorRotation]);

  // Size variation effect
  useEffect(() => {
    if (!settings.burnInPrevention || !settings.burnInSizeVariation) return;

    const sizeInterval = setInterval(() => {
      // Vary size between 0.95 and 1.05 (±5%)
      const variation = 0.95 + Math.random() * 0.1;
      setSizeVariation(variation);
    }, 30000); // Change size every 30 seconds

    return () => clearInterval(sizeInterval);
  }, [settings.burnInPrevention, settings.burnInSizeVariation]);

  // Get current burn-in prevention styles
  const getBurnInStyles = () => {
    if (!settings.burnInPrevention) {
      return {
        transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }],
        opacity: 1,
        color: settings.textColor,
      };
    }

    return {
      transform: [
        { translateX: settings.burnInPositionShift ? burnInOffset.x : 0 },
        { translateY: settings.burnInPositionShift ? burnInOffset.y : 0 },
        { scale: sizeVariation },
      ],
      opacity: settings.burnInAutoDim && isDimmed ? 0.6 : 1,
      color: settings.burnInColorRotation ? colorRotationPalette[colorIndex] : settings.textColor,
    };
  };

  // Get dimming styles for containers
  const getContainerBurnInStyles = () => {
    if (!settings.burnInPrevention) {
      return { opacity: 1 };
    }

    return {
      opacity: isDimmed ? 0.4 : 1,
      transform: [{ translateX: burnInOffset.x }, { translateY: burnInOffset.y }],
    };
  };

  const value = {
    burnInOffset,
    isDimmed,
    colorIndex,
    sizeVariation,
    resetActivity,
    getBurnInStyles,
    getContainerBurnInStyles,
    currentColor: settings.burnInColorRotation
      ? colorRotationPalette[colorIndex]
      : settings.textColor,
    // Force re-render when textColor changes
    textColor: settings.textColor,
  };

  return <BurnInContext.Provider value={value}>{children}</BurnInContext.Provider>;
};
