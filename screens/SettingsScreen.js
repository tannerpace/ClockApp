import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SettingsComponent from '../components/SettingsComponent';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({});

  const handleSettingsChange = useCallback(newSettings => {
    setSettings(newSettings);
    // You can add any additional logic here when settings change
    console.log('Settings updated:', newSettings);
  }, []);

  return (
    <View style={styles.container}>
      <SettingsComponent
        visible={true}
        onClose={() => {
          // This will be handled by navigation
        }}
        onSettingsChange={handleSettingsChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default SettingsScreen;
