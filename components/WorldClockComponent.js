import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';

const WorldClockComponent = () => {
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
  }, []);

  const timeZones = [
    { name: 'New York', timezone: 'America/New_York' },
    { name: 'London', timezone: 'Europe/London' },
    { name: 'Paris', timezone: 'Europe/Paris' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo' },
    { name: 'Sydney', timezone: 'Australia/Sydney' },
    { name: 'Dubai', timezone: 'Asia/Dubai' },
  ];

  const getTimeForTimezone = timezone => {
    const options = {
      timeZone: timezone,
      hour12: !settings.format24Hour,
      hour: '2-digit',
      minute: '2-digit',
    };

    if (settings.showSeconds) {
      options.second = '2-digit';
    }

    return currentTime.toLocaleTimeString('en-US', options);
  };

  const getDateForTimezone = timezone => {
    return currentTime.toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getResponsiveStyles = () => {
    const { width, height } = screenDimensions;
    const isLandscape = width > height;
    const scaleFactor = Math.min(width, height) / 400;

    // Font size multipliers based on settings
    const fontSizeMultiplier =
      {
        small: 0.8,
        medium: 1.0,
        large: 1.2,
        xlarge: 1.5,
        xxlarge: 1.8,
        ginormous: 2.2,
      }[settings.fontSize] || 1.0;

    return {
      content: {
        flexDirection: isLandscape ? 'row' : 'column',
        flexWrap: isLandscape ? 'wrap' : 'nowrap',
      },
      timeZoneItem: {
        width: isLandscape ? '48%' : '100%',
        marginBottom: isLandscape ? 10 : 15,
      },
      title: {
        fontSize: Math.max(18, Math.min(24, 24 * scaleFactor * fontSizeMultiplier)),
        color: settings.textColor,
      },
      cityName: {
        fontSize: Math.max(14, Math.min(16, 16 * scaleFactor * fontSizeMultiplier)),
        color: settings.textColor,
      },
      cityTime: {
        fontSize: Math.max(16, Math.min(20, 20 * scaleFactor * fontSizeMultiplier)),
        color: settings.textColor,
      },
      cityDate: {
        fontSize: Math.max(12, Math.min(14, 14 * scaleFactor * fontSizeMultiplier)),
        color: settings.textColor,
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <View
      style={[
        styles.content,
        responsiveStyles.content,
        { backgroundColor: settings.backgroundColor },
      ]}
    >
      <Text style={[styles.title, responsiveStyles.title]}>World Clock</Text>
      {timeZones.map((zone, index) => (
        <View key={index} style={[styles.timeZoneItem, responsiveStyles.timeZoneItem]}>
          <View style={styles.cityInfo}>
            <Text style={[styles.cityName, responsiveStyles.cityName]}>{zone.name}</Text>
            <Text style={[styles.cityDate, responsiveStyles.cityDate]}>
              {getDateForTimezone(zone.timezone)}
            </Text>
          </View>
          <Text style={[styles.cityTime, responsiveStyles.cityTime]}>
            {getTimeForTimezone(zone.timezone)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#fff',
  },
  timeZoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 10,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  cityDate: {
    fontSize: 14,
    color: '#ccc',
  },
  cityTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },
});

export default WorldClockComponent;
