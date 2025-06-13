import { SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import ClockComponent from '../components/ClockComponent';
import { useSettings } from '../contexts/SettingsContext';
import { useTabBar } from '../contexts/TabBarContext';

const ClockScreen = () => {
  const { settings } = useSettings();
  const { showTabBarAndResetTimer } = useTabBar();

  const handleTouch = () => {
    showTabBarAndResetTimer();
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <SafeAreaView style={[styles.container, { backgroundColor: settings.backgroundColor }]}>
        <ClockComponent />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ClockScreen;
