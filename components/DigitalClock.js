import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useBurnIn } from '../contexts/BurnInContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTabBar } from '../contexts/TabBarContext';
import { useWeather } from '../contexts/WeatherContext';

export default function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const [colorAnimationIndex, setColorAnimationIndex] = useState(0);
  const { settings } = useSettings();
  const { weather, location } = useWeather();
  const { getBurnInStyles, getContainerBurnInStyles, resetActivity } = useBurnIn();
  const { showTabBarAndResetTimer } = useTabBar();

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const colorAnimIndex = useRef(0);

  // Start animations when settings change
  useEffect(() => {
    // Pulse animation
    if (settings.clockAnimationPulse) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [settings.clockAnimationPulse]);

  useEffect(() => {
    // Fade animation
    if (settings.clockAnimationFade) {
      const fadeAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      fadeAnimation.start();
      return () => fadeAnimation.stop();
    } else {
      fadeAnim.setValue(1);
    }
  }, [settings.clockAnimationFade]);

  useEffect(() => {
    // Bounce animation
    if (settings.clockAnimationBounce) {
      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.02,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0.98,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      bounceAnimation.start();
      return () => bounceAnimation.stop();
    } else {
      bounceAnim.setValue(1);
    }
  }, [settings.clockAnimationBounce]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => {
      clearInterval(timer);
      subscription?.remove();
    };
  }, [settings.keepAwake]);

  useEffect(() => {
    // Color animation timer
    if (settings.clockColorAnimation) {
      const colorTimer = setInterval(() => {
        setColorAnimationIndex(prev => (prev + 1) % 5);
      }, 2000);
      return () => clearInterval(colorTimer);
    }
  }, [settings.clockColorAnimation]);

  const formatTime = date => {
    const options = {
      hour12: !settings.format24Hour,
      hour: '2-digit',
      minute: '2-digit',
    };

    if (settings.showSeconds) {
      options.second = '2-digit';
    }

    return date.toLocaleTimeString('en-US', options);
  };

  const formatTimeNoSeconds = date => {
    return date.toLocaleTimeString('en-US', {
      hour12: !settings.format24Hour,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatShortDate = date => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeOfDay = date => {
    const hour = date.getHours();
    if (hour < 6) return 'Night';
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  // Detect if we're in landscape mode (dock mode)
  const isLandscape = screenDimensions.width > screenDimensions.height;

  // Animation styles function
  const getAnimationStyles = () => {
    let animatedTransforms = [];
    let animatedOpacity = 1;

    // Combine all active animations
    if (settings.clockAnimationPulse) {
      animatedTransforms.push({ scale: pulseAnim });
    }

    if (settings.clockAnimationBounce) {
      animatedTransforms.push({ scaleY: bounceAnim });
    }

    if (settings.clockAnimationFade) {
      animatedOpacity = fadeAnim;
    }

    return {
      transform: animatedTransforms,
      opacity: animatedOpacity,
    };
  };

  const getResponsiveStyles = () => {
    const { width, height } = screenDimensions;
    const isLandscape = width > height;

    // Calculate available width (with padding)
    const availableWidth = width - 40; // Account for padding

    // Font size multipliers based on settings
    const fontSizeMultiplier =
      {
        small: 0.8,
        medium: 1.0,
        large: 1.4,
        xlarge: 1.5,
        xxlarge: 1.8,
        ginormous: 2.2,
      }[settings.fontSize] || 0.9;

    // Base font sizes that fit within screen width
    let baseFontSize;
    if (isLandscape) {
      // Landscape mode - more conservative sizing
      baseFontSize = Math.min(48, availableWidth / 8);
    } else {
      // Portrait mode - calculate based on available width
      // Assume ~8-9 characters for "12:34 PM" or "12:34:56 PM"
      const charCount = settings.showSeconds ? 11 : 8;
      baseFontSize = Math.min(60, (availableWidth / charCount) * 1.2);
    }

    // Generate dynamic styles based on new styling options
    const getFontWeight = () => {
      const weights = {
        ultralight: '200',
        light: '300',
        normal: '400',
        medium: '600',
        bold: '800',
        extrabold: '900',
      };
      return weights[settings.clockFontWeight] || '300';
    };

    const getLetterSpacing = () => {
      const spacings = {
        tight: -1,
        normal: 0,
        wide: 2,
        extrawide: 5,
      };
      return spacings[settings.clockLetterSpacing] || 0;
    };
    const getShadowStyle = () => {
      let shadowStyle = {};

      // Priority system for shadow effects
      // Only one major shadow effect should be active at a time

      // 1. Neon effect (highest priority)
      if (settings.clockNeon) {
        return {
          textShadowColor: settings.clockNeonColor,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 25,
          elevation: 15,
        };
      }

      // 2. Glow effect
      if (settings.clockGlow) {
        const glowIntensities = {
          subtle: 5,
          light: 8,
          medium: 15,
          strong: 25,
          intense: 40,
        };

        const glowRadius = glowIntensities[settings.clockGlowIntensity] || 12;

        return {
          textShadowColor: settings.clockGlowColor,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: glowRadius,
          elevation: 8,
        };
      }

      // 3. Outline effect
      if (settings.clockOutline) {
        const outlineWidths = {
          thin: 1,
          medium: 2,
          thick: 3,
          extrathick: 4,
        };

        const outlineWidth = outlineWidths[settings.clockOutlineWidth] || 1;

        return {
          textShadowColor: settings.clockOutlineColor,
          textShadowOffset: { width: outlineWidth, height: outlineWidth },
          textShadowRadius: 0,
        };
      }

      // 4. Emboss effect
      if (settings.clockEmboss) {
        return {
          textShadowColor: 'rgba(255,255,255,0.5)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 0,
        };
      }

      // 5. Engraved effect
      if (settings.clockEngraved) {
        return {
          textShadowColor: 'rgba(0,0,0,0.8)',
          textShadowOffset: { width: -1, height: -1 },
          textShadowRadius: 0,
        };
      }

      // 6. Regular shadow (lowest priority)
      if (settings.clockShadow) {
        const intensities = {
          light: { shadowRadius: 6, shadowOpacity: 0.5 },
          medium: { shadowRadius: 10, shadowOpacity: 0.7 },
          strong: { shadowRadius: 16, shadowOpacity: 0.9 },
          extrastrong: { shadowRadius: 20, shadowOpacity: 1.0 },
        };

        const offsets = {
          small: { width: 1, height: 1 },
          medium: { width: 2, height: 2 },
          large: { width: 4, height: 4 },
          extralarge: { width: 6, height: 6 },
        };

        const shadowOffset = offsets[settings.clockShadowOffset] || { width: 2, height: 2 };

        return {
          textShadowColor: settings.clockShadowColor,
          textShadowOffset: shadowOffset,
          textShadowRadius: intensities[settings.clockShadowIntensity]?.shadowRadius || 8,
        };
      }

      return shadowStyle;
    };

    const getBorderStyle = () => {
      if (!settings.clockBorder) return {};

      const widths = {
        thin: 2,
        medium: 3,
        thick: 4,
        extrathick: 6,
      };

      const radiuses = {
        none: 0,
        small: 4,
        medium: 8,
        large: 16,
        extralarge: 24,
        round: 50,
      };

      let borderStyle = {
        borderWidth: widths[settings.clockBorderWidth] || 2,
        borderColor: settings.clockBorderColor,
        borderRadius: radiuses[settings.clockBorderRadius] || 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
      };

      // Border style (limited support in React Native)
      if (settings.clockBorderStyle === 'dashed') {
        borderStyle.borderStyle = 'dashed';
      } else if (settings.clockBorderStyle === 'dotted') {
        borderStyle.borderStyle = 'dotted';
      }

      return borderStyle;
    };

    const getBackgroundStyle = () => {
      if (!settings.clockBackground) return {};

      const opacities = {
        verylight: 0.1,
        light: 0.3,
        medium: 0.5,
        strong: 0.7,
        verystrong: 0.9,
      };

      const opacity = opacities[settings.clockBackgroundOpacity] || 0.5;

      let bgColor = settings.clockBackgroundColor || 'rgba(0,0,0,0.3)';

      // Handle opacity for solid colors
      if (bgColor && !bgColor.includes('rgba') && !bgColor.includes('hsla')) {
        // Convert hex to rgba with opacity
        const hex = bgColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        bgColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      return {
        backgroundColor: bgColor,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: settings.clockBorderRadius !== 'none' ? 12 : 0,
      };
    };

    const getTransformStyle = () => {
      let transforms = [];

      if (settings.clockRotation !== 0) {
        transforms.push({ rotate: `${settings.clockRotation}deg` });
      }

      if (settings.clockScale !== 100) {
        const scale = settings.clockScale / 100;
        transforms.push({ scale: scale });
      }

      if (settings.clockSkew !== 0) {
        transforms.push({ skewX: `${settings.clockSkew}deg` });
      }

      return transforms.length > 0 ? { transform: transforms } : {};
    };

    const getTextDecorationStyle = () => {
      let style = {};

      if (settings.clockItalic) {
        style.fontStyle = 'italic';
      }

      if (settings.clockUnderline) {
        style.textDecorationLine = 'underline';
      }

      if (settings.clockStrikethrough) {
        style.textDecorationLine = settings.clockUnderline
          ? 'underline line-through'
          : 'line-through';
      }

      return style;
    };

    const getTextColor = () => {
      // Priority system for text color effects
      // Higher priority effects override lower ones

      // 1. Neon effect (highest priority - text should match neon color)
      if (settings.clockNeon) {
        return settings.clockNeonColor;
      }

      // 2. Rainbow text
      if (settings.clockRainbowText) {
        const rainbowColors = ['#FF0000', '#FF8000', '#FFFF00', '#00FF00', '#0080FF', '#8000FF'];
        const colorIndex = Math.floor(Date.now() / 1000) % rainbowColors.length;
        return rainbowColors[colorIndex];
      }

      // 3. Color animation
      if (settings.clockColorAnimation) {
        const animationColors = ['#FFFFFF', '#87CEEB', '#90EE90', '#FFFF00', '#FFA500'];
        return animationColors[colorAnimationIndex];
      }

      // 4. Gradient text (medium priority)
      if (settings.clockGradient) {
        // React Native doesn't support text gradients natively
        // Use the first gradient color as fallback
        if (settings.clockGradientColors && settings.clockGradientColors.length > 0) {
          return settings.clockGradientColors[0];
        }
      }

      // 5. Regular text color (lowest priority)
      return settings.textColor;
    };

    const getTextAlign = () => {
      return settings.clockTextAlign || 'center';
    };

    const getOpacityValue = () => {
      return settings.clockOpacity / 100;
    };

    // Main return statement for getResponsiveStyles
    return {
      time: {
        fontSize: Math.max(24, baseFontSize * fontSizeMultiplier),
        marginBottom: isLandscape ? 10 : 20,
        color: getTextColor(),
        opacity: getOpacityValue(),
        // Ensure text doesn't wrap
        flexShrink: 1,
        textAlign: getTextAlign(),
        // Apply all styling options
        fontWeight: getFontWeight(),
        letterSpacing: getLetterSpacing(),
        ...getShadowStyle(),
        ...getTextDecorationStyle(),
        ...getTransformStyle(),
      },
      timeContainer: {
        ...getBorderStyle(),
        ...getBackgroundStyle(),
      },
      greeting: {
        fontSize: Math.max(14, Math.min(20, baseFontSize * 0.3 * fontSizeMultiplier)),
        marginBottom: isLandscape ? 10 : 20,
        color: settings.textColor,
        textAlign: 'center',
      },
      date: {
        fontSize: Math.max(12, Math.min(16, baseFontSize * 0.25 * fontSizeMultiplier)),
        color: settings.textColor,
      },
      weather: {
        fontSize: Math.max(18, Math.min(24, baseFontSize * 0.4 * fontSizeMultiplier)),
        color: settings.textColor,
        textAlign: 'center',
        opacity: 0.9,
        marginTop: isLandscape ? 5 : 15,
      },
      weatherCondition: {
        fontSize: Math.max(16, Math.min(20, baseFontSize * 0.32 * fontSizeMultiplier)),
        color: settings.textColor,
        opacity: 0.8,
        textAlign: 'center',
      },
      weatherLocation: {
        fontSize: Math.max(14, Math.min(18, baseFontSize * 0.28 * fontSizeMultiplier)),
        color: settings.textColor,
        opacity: 0.7,
        textAlign: 'center',
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  // Dynamic container style based on settings
  const dynamicContainerStyle = {
    backgroundColor: settings.backgroundColor,
  };

  // Weather helper functions
  const getWeatherTemperature = () => {
    if (!weather) return '--';

    // Try to get current temperature from observations
    if (
      weather.current?.temperature?.value !== null &&
      weather.current?.temperature?.value !== undefined
    ) {
      const tempC = weather.current.temperature.value;
      return settings.weatherUnit === 'celsius'
        ? Math.round(tempC)
        : Math.round((tempC * 9) / 5 + 32);
    }

    // Fallback to forecast temperature
    if (weather.forecast?.[0]?.temperature) {
      const temp = weather.forecast[0].temperature;
      if (settings.weatherUnit === 'celsius' && weather.forecast[0].temperatureUnit === 'F') {
        return Math.round(((temp - 32) * 5) / 9);
      }
      return temp;
    }

    return '--';
  };

  const getWeatherUnit = () => {
    return settings.weatherUnit === 'celsius' ? 'C' : 'F';
  };

  const getWeatherCondition = () => {
    if (!weather) return 'Weather unavailable';

    // Try current conditions first
    if (weather.current?.textDescription) {
      return weather.current.textDescription;
    }

    // Fallback to forecast
    if (weather.forecast?.[0]?.shortForecast) {
      return weather.forecast[0].shortForecast;
    }

    return 'Weather unavailable';
  };

  const getLocationName = () => {
    if (!location) return null;
    return location.city || location.region;
  };

  // Get burn-in prevention styles
  const burnInStyles = getBurnInStyles();
  const containerBurnInStyles = getContainerBurnInStyles();

  // Ensure text color always uses settings.textColor unless burn-in color rotation is active
  const currentTextColor = settings.burnInColorRotation ? burnInStyles.color : settings.textColor;

  // Combined touch handler for both burn-in prevention and tab bar
  const handleTouch = () => {
    resetActivity(); // Reset burn-in timers
    showTabBarAndResetTimer(); // Show tab bar
  };

  // Render different layouts for landscape (dock) vs portrait
  if (isLandscape) {
    // Landscape dock mode - centered layout with optional glass effect
    return (
      <TouchableWithoutFeedback onPress={handleTouch}>
        <View style={[styles.landscapeContainer, dynamicContainerStyle]}>
          <View
            style={[
              styles.landscapeContentContainer,
              settings.clockBackgroundBlur && styles.landscapeGlassContainer,
              containerBurnInStyles,
            ]}
          >
            <View style={styles.landscapeTimeSection}>
              <View style={responsiveStyles.timeContainer}>
                <Animated.Text
                  style={[
                    styles.landscapeTime,
                    responsiveStyles.time,
                    {
                      color: currentTextColor,
                      transform: [...burnInStyles.transform, ...getAnimationStyles().transform],
                      opacity: burnInStyles.opacity * getAnimationStyles().opacity,
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.6}
                >
                  {settings.showSeconds
                    ? formatTime(currentTime)
                    : formatTimeNoSeconds(currentTime)}
                </Animated.Text>
              </View>
              <Text
                style={[
                  styles.landscapeDate,
                  responsiveStyles.date,
                  {
                    color: currentTextColor,
                    opacity: burnInStyles.opacity,
                  },
                ]}
              >
                {formatShortDate(currentTime)}
              </Text>
            </View>

            <View style={styles.landscapeInfoSection}>
              <Text
                style={[
                  styles.landscapeGreeting,
                  responsiveStyles.greeting,
                  {
                    color: currentTextColor,
                    opacity: burnInStyles.opacity,
                  },
                ]}
              >
                Good {getTimeOfDay(currentTime)}
              </Text>
              {settings.clockShowWeather && weather && (
                <View style={styles.landscapeWeatherContainer}>
                  <Text
                    style={[
                      styles.landscapeWeather,
                      responsiveStyles.weather,
                      {
                        color: currentTextColor,
                        opacity: burnInStyles.opacity,
                      },
                    ]}
                  >
                    {getWeatherTemperature()}°{getWeatherUnit()}
                  </Text>
                  <Text
                    style={[
                      styles.landscapeWeatherCondition,
                      responsiveStyles.weatherCondition,
                      {
                        color: currentTextColor,
                        opacity: burnInStyles.opacity,
                      },
                    ]}
                  >
                    {getWeatherCondition()}
                  </Text>
                  {location && (
                    <Text
                      style={[
                        styles.landscapeWeatherLocation,
                        responsiveStyles.weatherLocation,
                        {
                          color: currentTextColor,
                          opacity: burnInStyles.opacity,
                        },
                      ]}
                    >
                      {getLocationName()}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  // Portrait mode - traditional layout
  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={[styles.container, dynamicContainerStyle]}>
        <View
          style={[
            styles.portraitContentContainer,
            settings.clockBackgroundBlur && styles.portraitGlassContainer,
            containerBurnInStyles,
          ]}
        >
          <Text
            style={[
              styles.greeting,
              responsiveStyles.greeting,
              {
                color: currentTextColor,
                opacity: burnInStyles.opacity,
              },
            ]}
          >
            Good {getTimeOfDay(currentTime)}
          </Text>
          <View style={responsiveStyles.timeContainer}>
            <Animated.Text
              style={[
                styles.time,
                responsiveStyles.time,
                {
                  color: currentTextColor,
                  transform: [...burnInStyles.transform, ...getAnimationStyles().transform],
                  opacity: burnInStyles.opacity * getAnimationStyles().opacity,
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.5}
            >
              {settings.showSeconds ? formatTime(currentTime) : formatTimeNoSeconds(currentTime)}
            </Animated.Text>
          </View>
          <Text
            style={[
              styles.date,
              responsiveStyles.date,
              {
                color: currentTextColor,
                opacity: burnInStyles.opacity,
              },
            ]}
          >
            {formatDate(currentTime)}
          </Text>
          {settings.clockShowWeather && weather && (
            <View style={styles.weatherContainer}>
              <Text
                style={[
                  styles.weather,
                  responsiveStyles.weather,
                  {
                    color: currentTextColor,
                    opacity: burnInStyles.opacity,
                  },
                ]}
              >
                {getWeatherTemperature()}°{getWeatherUnit()} • {getWeatherCondition()}
                {location && ` • ${getLocationName()}`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  portraitContentContainer: {
    padding: 35,
    width: '90%',
    alignItems: 'center',
  },
  portraitGlassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 25,
    padding: 35,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    width: '90%',
    alignItems: 'center',
  },
  landscapeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 40,
  },
  landscapeContentContainer: {
    padding: 30,
    minWidth: '80%',
    maxWidth: '90%',
    alignItems: 'center',
  },
  landscapeGlassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: '80%',
    maxWidth: '90%',
    alignItems: 'center',
  },
  landscapeTimeSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  landscapeInfoSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    color: '#888',
    fontWeight: '300',
  },
  landscapeGreeting: {
    color: '#BBB',
    fontWeight: '300',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  time: {
    color: '#fff',
    fontWeight: '200',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  landscapeTime: {
    color: '#fff',
    fontWeight: '100',
    fontFamily: 'monospace',
    fontSize: 64,
    lineHeight: 72,
  },
  date: {
    color: '#888',
    fontWeight: '300',
    textAlign: 'center',
  },
  landscapeDate: {
    color: '#888',
    fontWeight: '300',
    fontSize: 18,
    marginTop: 8,
    textAlign: 'center',
  },
  weather: {
    color: '#BBB',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 20,
    lineHeight: 26,
  },
  landscapeWeather: {
    color: '#BBB',
    fontWeight: '400',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  landscapeWeatherCondition: {
    color: '#999',
    fontWeight: '300',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 1,
    lineHeight: 24,
  },
  landscapeWeatherLocation: {
    color: '#777',
    fontWeight: '300',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 1,
  },
  weatherContainer: {
    marginTop: 15,
    width: '100%',
    // Remove height constraints that might hide content
  },
  landscapeWeatherContainer: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
