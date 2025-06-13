import { SafeAreaView, StyleSheet } from 'react-native';
import WeatherComponent from '../components/WeatherComponent';
import { useSettings } from '../contexts/SettingsContext';

export default function WeatherScreen() {
  const { settings } = useSettings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: settings.backgroundColor }]}>
      <WeatherComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
