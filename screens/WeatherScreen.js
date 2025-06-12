import { SafeAreaView, StyleSheet } from 'react-native';
import WeatherComponent from '../components/WeatherComponent';

export default function WeatherScreen() {
  return (
    <SafeAreaView style={styles.container}>
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
