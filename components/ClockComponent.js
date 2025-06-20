import * as KeepAwake from 'expo-keep-awake';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';
import WorldClockComponent from './WorldClockComponent';

const ClockComponent = () => {
  const { settings } = useSettings();

  // Handle keep awake for all clock types
  useEffect(() => {
    if (settings.keepAwake) {
      KeepAwake.activateKeepAwakeAsync();
    }

    return () => {
      if (settings.keepAwake) {
        KeepAwake.deactivateKeepAwake();
      }
    };
  }, [settings.keepAwake]);

  const renderClock = () => {
    switch (settings.clockType) {
      case 'analog':
        return <AnalogClock />;
      case 'world':
        return <WorldClockComponent />;
      case 'digital':
      default:
        return <DigitalClock />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: settings.backgroundColor }]}>
      {renderClock()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ClockComponent;
