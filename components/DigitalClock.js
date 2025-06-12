import { activateKeepAwakeAsync, deactivateKeepAwakeAsync } from 'expo-keep-awake';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

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

  const formatTimeNoSeconds = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
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

  const formatShortDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  // Detect if we're in landscape mode (dock mode)
  const isLandscape = screenDimensions.width > screenDimensions.height;

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

  // Render different layouts for landscape (dock) vs portrait
  if (isLandscape) {
    // Landscape dock mode - optimize for side viewing
    return (
      <View style={styles.landscapeContainer}>
        <View style={styles.landscapeTimeSection}>
          <Text style={[styles.landscapeTime, responsiveStyles.time]}>{formatTimeNoSeconds(currentTime)}</Text>
          <Text style={[styles.landscapeDate, responsiveStyles.date]}>{formatShortDate(currentTime)}</Text>
        </View>
        <View style={styles.landscapeInfoSection}>
          <Text style={[styles.landscapeGreeting, responsiveStyles.greeting]}>Good {getTimeOfDay(currentTime)}</Text>
        </View>
      </View>
    );
  }

  // Portrait mode - traditional layout
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
