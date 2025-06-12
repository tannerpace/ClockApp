import { activateKeepAwakeAsync, deactivateKeepAwakeAsync } from 'expo-keep-awake';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

export default function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    activateKeepAwakeAsync(); // Keep screen awake while clock is active

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => {
      clearInterval(timer);
      deactivateKeepAwakeAsync();
      subscription?.remove();
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeOfDay = (date) => {
    const hour = date.getHours();
    if (hour < 6) return 'Night';
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  const getResponsiveStyles = () => {
    const { width, height } = screenDimensions;
    const isLandscape = width > height;
    const scaleFactor = Math.min(width, height) / 400;
    
    return {
      time: {
        fontSize: Math.max(32, Math.min(72, 72 * scaleFactor)),
        marginBottom: isLandscape ? 10 : 20,
      },
      greeting: {
        fontSize: Math.max(16, Math.min(20, 20 * scaleFactor)),
        marginBottom: isLandscape ? 10 : 20,
      },
      date: {
        fontSize: Math.max(14, Math.min(18, 18 * scaleFactor)),
      }
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <View style={styles.container}>
      <Text style={[styles.greeting, responsiveStyles.greeting]}>Good {getTimeOfDay(currentTime)}</Text>
      <Text style={[styles.time, responsiveStyles.time]}>{formatTime(currentTime)}</Text>
      <Text style={[styles.date, responsiveStyles.date]}>{formatDate(currentTime)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  greeting: {
    color: '#888',
    fontWeight: '300',
  },
  time: {
    color: '#fff',
    fontWeight: '200',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  date: {
    color: '#888',
    fontWeight: '300',
    textAlign: 'center',
  },
});
