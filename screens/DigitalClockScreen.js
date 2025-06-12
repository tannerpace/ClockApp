import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import DigitalClock from '../components/DigitalClock';

export default function DigitalClockScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <DigitalClock />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
