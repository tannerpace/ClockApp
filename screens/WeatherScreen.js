import { SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import WeatherComponent from '../components/WeatherComponent';
import { useSettings } from '../contexts/SettingsContext';
import { useTabBar } from '../contexts/TabBarContext';

export default function WeatherScreen() {
  const { settings } = useSettings();
  const { showTabBarAndResetTimer } = useTabBar();

  const handleTouch = () => {
    showTabBarAndResetTimer();
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <SafeAreaView style={[styles.container, { backgroundColor: settings.backgroundColor }]}>
        <WeatherComponent />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
