import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSettings } from '../contexts/SettingsContext';

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

const SettingsScreen = () => {
  const { settings, updateSettings } = useSettings();

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

  const updateSetting = useCallback((key, value) => {
    updateSettings({ [key]: value });
  }, [updateSettings]);

  const renderColorPicker = (title, colors, currentValue, onSelect) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.colorGrid}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color.value}
            style={[
              styles.colorButton,
              { backgroundColor: color.value },
              currentValue === color.value && styles.selectedColor,
            ]}
            onPress={() => onSelect(color.value)}
          >
            {currentValue === color.value && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderOptionPicker = (title, options, currentValue, onSelect) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionGrid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              currentValue === option.value && styles.selectedOption,
            ]}
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
            (color) => updateSetting('backgroundColor', color)
          )}

          {renderColorPicker(
            'Text Color',
            textColors,
            settings.textColor,
            (color) => updateSetting('textColor', color)
          )}

          {renderOptionPicker(
            'Theme',
            themes,
            settings.theme,
            (theme) => updateSetting('theme', theme)
          )}

          {renderOptionPicker(
            'Font Size',
            fontSizes,
            settings.fontSize,
            (size) => updateSetting('fontSize', size)
          )}
        </View>

        {/* Clock Settings */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>🕐 Clock Settings</Text>
          
          {renderSwitch(
            'Show Seconds',
            settings.showSeconds,
            (value) => updateSetting('showSeconds', value)
          )}

          {renderSwitch(
            '24 Hour Format',
            settings.format24Hour,
            (value) => updateSetting('format24Hour', value)
          )}

          {renderSwitch(
            'Keep Screen Awake',
            settings.keepAwake,
            (value) => updateSetting('keepAwake', value)
          )}
        </View>

        {/* Weather Settings */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>🌤️ Weather Settings</Text>
          
          {renderSwitch(
            'Show Weather',
            settings.showWeather,
            (value) => updateSetting('showWeather', value)
          )}

          {renderOptionPicker(
            'Temperature Unit',
            [
              { name: 'Fahrenheit', value: 'fahrenheit' },
              { name: 'Celsius', value: 'celsius' },
            ],
            settings.weatherUnit,
            (unit) => updateSetting('weatherUnit', unit)
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
            (brightness) => updateSetting('brightness', brightness)
          )}
        </View>
      </ScrollView>
    </View>
  );
};
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default SettingsScreen;
