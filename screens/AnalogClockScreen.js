import { SafeAreaView, StyleSheet, View } from 'react-native';
import AnalogClock from '../components/AnalogClock';
import { useSettings } from '../contexts/SettingsContext';

export default function AnalogClockScreen() {
  const { settings } = useSettings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: settings.backgroundColor }]}>
      <View style={[styles.content, { backgroundColor: settings.backgroundColor }]}>
        <AnalogClock />
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
