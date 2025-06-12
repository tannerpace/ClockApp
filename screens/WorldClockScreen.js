import { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function WorldClockScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

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

  const getTimeForTimezone = (timezone) => {
    return currentTime.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getDateForTimezone = (timezone) => {
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

    return {
      content: {
        flexDirection: isLandscape ? 'row' : 'column',
        flexWrap: isLandscape ? 'wrap' : 'nowrap',
      },
      timeZoneItem: {
        width: isLandscape ? '48%' : '100%',
        marginBottom: isLandscape ? 10 : 0,
      }
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, responsiveStyles.content]}>
        <Text style={styles.title}>World Clock</Text>
        {timeZones.map((zone, index) => (
          <View key={index} style={[styles.timeZoneItem, responsiveStyles.timeZoneItem]}>
            <View style={styles.cityInfo}>
              <Text style={styles.cityName}>{zone.name}</Text>
              <Text style={styles.cityDate}>{getDateForTimezone(zone.timezone)}</Text>
            </View>
            <Text style={styles.cityTime}>{getTimeForTimezone(zone.timezone)}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '300',
  },
  timeZoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  cityDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  cityTime: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'monospace',
    fontWeight: '300',
  },
});
