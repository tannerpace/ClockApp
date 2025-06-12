import { activateKeepAwakeAsync, deactivateKeepAwakeAsync } from 'expo-keep-awake';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    activateKeepAwakeAsync(); // Keep screen awake while clock is active

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      deactivateKeepAwakeAsync();
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

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good {getTimeOfDay(currentTime)}</Text>
      <Text style={styles.time}>{formatTime(currentTime)}</Text>
      <Text style={styles.date}>{formatDate(currentTime)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 20,
    color: '#888',
    marginBottom: 20,
    fontWeight: '300',
  },
  time: {
    fontSize: 72,
    color: '#fff',
    fontWeight: '200',
    marginBottom: 20,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  date: {
    fontSize: 18,
    color: '#888',
    fontWeight: '300',
    textAlign: 'center',
  },
});
