import { useCallback } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { useTabBar } from '../contexts/TabBarContext';

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

const SettingsScreen = () => {
  const { settings, updateSettings } = useSettings();
  const { showTabBarAndResetTimer } = useTabBar();

  const handleTouch = () => {
    showTabBarAndResetTimer();
  };

  const backgroundColors = [
    { name: 'Black', value: '#000000' },
    { name: 'Dark Blue', value: '#001122' },
    { name: 'Dark Green', value: '#002200' },
    { name: 'Dark Purple', value: '#220044' },
    { name: 'Dark Red', value: '#220000' },
    { name: 'Navy', value: '#000044' },
    { name: 'Charcoal', value: '#333333' },
    { name: 'Midnight', value: '#191970' },
  ];

  const textColors = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Light Blue', value: '#87CEEB' },
    { name: 'Light Green', value: '#90EE90' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Orange', value: '#FFA500' },
    { name: 'Pink', value: '#FFB6C1' },
    { name: 'Cyan', value: '#00FFFF' },
    { name: 'Lime', value: '#00FF00' },
  ];

  const themes = [
    { name: 'Dark', value: 'dark' },
    { name: 'Light', value: 'light' },
    { name: 'Auto', value: 'auto' },
  ];

  const fontSizes = [
    { name: 'Small', value: 'small' },
    { name: 'Medium', value: 'medium' },
    { name: 'Large', value: 'large' },
    { name: 'Extra Large', value: 'xlarge' },
  ];

  const updateSetting = useCallback(
    (key, value) => {
      updateSettings({ [key]: value });
    },
    [updateSettings]
  );

  const renderColorPicker = (title, colors, currentValue, onSelect) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.colorGrid}>
        {colors.map(color => (
          <TouchableOpacity
            key={color.value}
            style={[
              styles.colorButton,
              { backgroundColor: color.value },
              currentValue === color.value && styles.selectedColor,
            ]}
            onPress={() => onSelect(color.value)}
          >
            {currentValue === color.value && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderOptionPicker = (title, options, currentValue, onSelect) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionGrid}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[styles.optionButton, currentValue === option.value && styles.selectedOption]}
            onPress={() => onSelect(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                currentValue === option.value && styles.selectedOptionText,
              ]}
            >
              {option.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSwitch = (title, value, onToggle) => (
    <View style={styles.switchRow}>
      <Text style={styles.switchTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>🎨 Appearance</Text>

          {renderColorPicker(
            'Background Color',
            backgroundColors,
            settings.backgroundColor,
            color => updateSetting('backgroundColor', color)
          )}

          {renderColorPicker('Text Color', textColors, settings.textColor, color =>
            updateSetting('textColor', color)
          )}

          {renderOptionPicker('Theme', themes, settings.theme, theme =>
            updateSetting('theme', theme)
          )}

          {renderOptionPicker('Font Size', fontSizes, settings.fontSize, size =>
            updateSetting('fontSize', size)
          )}

          {renderSwitch('Show Screen Titles', settings.showScreenTitles, value =>
            updateSetting('showScreenTitles', value)
          )}

          {renderSwitch('Auto-hide Tab Bar', settings.autoHideTabBar, value =>
            updateSetting('autoHideTabBar', value)
          )}
        </View>

        {/* Clock Settings */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>🕐 Clock Settings</Text>

          {renderOptionPicker(
            'Clock Type',
            [
              { name: 'Digital', value: 'digital' },
              { name: 'Analog', value: 'analog' },
              { name: 'World Clock', value: 'world' },
            ],
            settings.clockType,
            type => updateSetting('clockType', type)
          )}

          {renderSwitch('Show Seconds', settings.showSeconds, value =>
            updateSetting('showSeconds', value)
          )}

          {renderSwitch('24 Hour Format', settings.format24Hour, value =>
            updateSetting('format24Hour', value)
          )}

          {renderSwitch('Keep Screen Awake', settings.keepAwake, value =>
            updateSetting('keepAwake', value)
          )}
        </View>

        {/* Weather Settings */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>🌤️ Weather Settings</Text>

          {renderSwitch('Show Weather', settings.showWeather, value =>
            updateSetting('showWeather', value)
          )}

          {renderOptionPicker(
            'Temperature Unit',
            [
              { name: 'Fahrenheit', value: 'fahrenheit' },
              { name: 'Celsius', value: 'celsius' },
            ],
            settings.weatherUnit,
            unit => updateSetting('weatherUnit', unit)
          )}
        </View>

        {/* Display Settings */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>📱 Display Settings</Text>

          {renderOptionPicker(
            'Brightness',
            [
              { name: 'Auto', value: 'auto' },
              { name: 'Low', value: 'low' },
              { name: 'Medium', value: 'medium' },
              { name: 'High', value: 'high' },
            ],
            settings.brightness,
            brightness => updateSetting('brightness', brightness)
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  category: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CCCCCC',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#555555',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  switchTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
});

export default SettingsScreen;
