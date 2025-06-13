import { SafeAreaView, StyleSheet } from 'react-native';
import ClockComponent from '../components/ClockComponent';
import { useSettings } from '../contexts/SettingsContext';

const ClockScreen = () => {
  const { settings } = useSettings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: settings.backgroundColor }]}>
      <ClockComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ClockScreen;
