import { SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import WeatherComponent from '../components/WeatherComponent';
import { useSettings } from '../contexts/SettingsContext';
import { useTabBar } from '../contexts/TabBarContext';

export default function WeatherScreen() {
  const { settings } = useSettings();
  const { showTabBarAndResetTimer } = useTabBar();

  const handleTouch = () => {
    showTabBarAndResetTimer();
  };

  // Use View instead of SafeAreaView when titles are hidden for better centering
  const Container = settings.showScreenTitles ? SafeAreaView : View;

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <Container style={[styles.container, { backgroundColor: settings.backgroundColor }]}>
        <WeatherComponent />
      </Container>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
