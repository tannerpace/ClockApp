import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';

export default function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const { settings } = useSettings();

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

  const getResponsiveStyles = () => {
    const { width, height } = screenDimensions;
    const isLandscape = width > height;

    // Calculate available width (with padding)
    const availableWidth = width - 40; // Account for padding

    // Font size multipliers based on settings
    const fontSizeMultiplier =
      {
        small: 0.7,
        medium: 0.9,
        large: 1.1,
        xlarge: 1.3,
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

    return {
      time: {
        fontSize: Math.max(24, baseFontSize * fontSizeMultiplier),
        marginBottom: isLandscape ? 10 : 20,
        color: settings.textColor,
        // Ensure text doesn't wrap
        flexShrink: 1,
        textAlign: 'center',
      },
      greeting: {
        fontSize: Math.max(14, Math.min(20, baseFontSize * 0.3 * fontSizeMultiplier)),
        marginBottom: isLandscape ? 10 : 20,
        color: settings.textColor,
      },
      date: {
        fontSize: Math.max(12, Math.min(16, baseFontSize * 0.25 * fontSizeMultiplier)),
        color: settings.textColor,
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  // Dynamic container style based on settings
  const dynamicContainerStyle = {
    backgroundColor: settings.backgroundColor,
  };

  // Render different layouts for landscape (dock) vs portrait
  if (isLandscape) {
    // Landscape dock mode - optimize for side viewing
    return (
      <View style={[styles.landscapeContainer, dynamicContainerStyle]}>
        <View style={styles.landscapeTimeSection}>
          <Text
            style={[styles.landscapeTime, responsiveStyles.time]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.6}
          >
            {settings.showSeconds ? formatTime(currentTime) : formatTimeNoSeconds(currentTime)}
          </Text>
          <Text style={[styles.landscapeDate, responsiveStyles.date]}>
            {formatShortDate(currentTime)}
          </Text>
        </View>
        <View style={styles.landscapeInfoSection}>
          <Text style={[styles.landscapeGreeting, responsiveStyles.greeting]}>
            Good {getTimeOfDay(currentTime)}
          </Text>
        </View>
      </View>
    );
  }

  // Portrait mode - traditional layout
  return (
    <View style={[styles.container, dynamicContainerStyle]}>
      <Text style={[styles.greeting, responsiveStyles.greeting]}>
        Good {getTimeOfDay(currentTime)}
      </Text>
      <Text
        style={[styles.time, responsiveStyles.time]}
        numberOfLines={1}
        adjustsFontSizeToFit={true}
        minimumFontScale={0.5}
      >
        {settings.showSeconds ? formatTime(currentTime) : formatTimeNoSeconds(currentTime)}
      </Text>
      <Text style={[styles.date, responsiveStyles.date]}>{formatDate(currentTime)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  landscapeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 40,
  },
  landscapeTimeSection: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  landscapeInfoSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  greeting: {
    color: '#888',
    fontWeight: '300',
  },
  landscapeGreeting: {
    color: '#888',
    fontWeight: '300',
    fontSize: 16,
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
  },
});
