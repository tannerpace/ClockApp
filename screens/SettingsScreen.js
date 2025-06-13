import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useFullscreen } from '../contexts/FullscreenContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTabBar } from '../contexts/TabBarContext';

const SettingsScreen = () => {
  const { settings, updateSettings } = useSettings();
  const { showTabBarAndResetTimer } = useTabBar();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handleTouch = () => {
    showTabBarAndResetTimer();
  };

  const updateSetting = (key, value) => {
    updateSettings({ [key]: value });
  };

  // Render a clean settings row with Apple-style design
  const renderSettingRow = (title, value, onToggle, subtitle = null) => (
    <View style={styles.settingRow}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#3E3E3E', true: '#007AFF' }}
        thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
        ios_backgroundColor="#3E3E3E"
      />
    </View>
  );

  // Render a selection row with Apple-style design
  const renderSelectionRow = (title, currentValue, options, onSelect, subtitle = null) => (
    <View style={styles.selectionSection}>
      <View style={styles.selectionHeader}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionRow, index === options.length - 1 && styles.lastOptionRow]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={styles.optionText}>{option.name || option.label}</Text>
            {currentValue === option.value && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Render a color picker with visual indicators
  const renderColorPicker = (
    title,
    currentValue,
    options,
    onSelect,
    subtitle = null,
    showAsText = false
  ) => (
    <View style={styles.selectionSection}>
      <View style={styles.selectionHeader}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionRow, index === options.length - 1 && styles.lastOptionRow]}
            onPress={() => onSelect(option.value)}
          >
            <View style={styles.colorOptionContent}>
              {showAsText ? (
                <Text style={[styles.optionText, { color: option.value }]}>{option.name}</Text>
              ) : (
                <>
                  <View style={[styles.colorBlob, { backgroundColor: option.value }]} />
                  <Text style={styles.optionText}>{option.name}</Text>
                </>
              )}
            </View>
            {currentValue === option.value && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Render section header
  const renderSectionHeader = title => <Text style={styles.sectionHeader}>{title}</Text>;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: settings.backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      onTouchStart={handleTouch}
      showsVerticalScrollIndicator={false}
    >
      {/* Display Settings */}
      {renderSectionHeader('Display')}
      <View style={styles.section}>
        {renderSettingRow(
          'Immersive Mode',
          isFullscreen,
          toggleFullscreen,
          'Hide status and navigation bars'
        )}
        {renderSettingRow(
          'Keep Screen Awake',
          settings.keepAwake,
          value => updateSetting('keepAwake', value),
          'Prevent screen from sleeping'
        )}
        {renderSettingRow(
          'Glass Effect',
          settings.clockBackgroundBlur,
          value => updateSetting('clockBackgroundBlur', value),
          'Frosted glass background'
        )}
      </View>

      {/* Clock Settings */}
      {renderSectionHeader('Clock')}
      <View style={styles.section}>
        {renderSelectionRow(
          'Clock Style',
          settings.clockType,
          [
            { name: 'Digital', value: 'digital' },
            { name: 'Analog', value: 'analog' },
            { name: 'World Clock', value: 'world' },
          ],
          type => updateSetting('clockType', type)
        )}

        {renderSettingRow('Show Seconds', settings.showSeconds, value =>
          updateSetting('showSeconds', value)
        )}

        {renderSettingRow('24-Hour Format', settings.format24Hour, value =>
          updateSetting('format24Hour', value)
        )}

        {renderSelectionRow(
          'Text Size',
          settings.fontSize,
          [
            { name: 'Small', value: 'small' },
            { name: 'Medium', value: 'medium' },
            { name: 'Large', value: 'large' },
            { name: 'Extra Large', value: 'xlarge' },
            { name: 'Extra Extra Large', value: 'xxlarge' },
            { name: 'Ginormous', value: 'ginormous' },
          ],
          size => updateSetting('fontSize', size)
        )}
      </View>

      {/* Digital Clock Style - Only show when digital clock is selected */}
      {settings.clockType === 'digital' && (
        <>
          {renderSectionHeader('Digital Clock Style')}
          <View style={styles.section}>
            {renderSettingRow(
              'Border',
              settings.clockBorder,
              value => updateSetting('clockBorder', value),
              'Add border around clock'
            )}

            {settings.clockBorder &&
              renderSelectionRow(
                'Border Width',
                settings.clockBorderWidth,
                [
                  { name: 'Thin', value: 'thin' },
                  { name: 'Medium', value: 'medium' },
                  { name: 'Thick', value: 'thick' },
                ],
                width => updateSetting('clockBorderWidth', width)
              )}

            {settings.clockBorder &&
              renderColorPicker(
                'Border Color',
                settings.clockBorderColor,
                [
                  { name: 'White', value: '#FFFFFF' },
                  { name: 'Light Blue', value: '#87CEEB' },
                  { name: 'Light Green', value: '#90EE90' },
                  { name: 'Yellow', value: '#FFFF00' },
                  { name: 'Orange', value: '#FFA500' },
                  { name: 'Pink', value: '#FFB6C1' },
                  { name: 'Cyan', value: '#00FFFF' },
                  { name: 'Silver', value: '#C0C0C0' },
                ],
                color => updateSetting('clockBorderColor', color),
                null,
                false
              )}

            {renderSettingRow(
              'Drop Shadow',
              settings.clockShadow,
              value => updateSetting('clockShadow', value),
              'Add shadow behind text'
            )}

            {renderSettingRow(
              'Glow Effect',
              settings.clockGlow,
              value => updateSetting('clockGlow', value),
              'Add glow around text'
            )}

            {renderSelectionRow(
              'Font Weight',
              settings.clockFontWeight,
              [
                { name: 'Light', value: 'light' },
                { name: 'Normal', value: 'normal' },
                { name: 'Medium', value: 'medium' },
                { name: 'Bold', value: 'bold' },
                { name: 'Extra Bold', value: 'extrabold' },
              ],
              weight => updateSetting('clockFontWeight', weight)
            )}

            {renderSelectionRow(
              'Letter Spacing',
              settings.clockLetterSpacing,
              [
                { name: 'Tight', value: 'tight' },
                { name: 'Normal', value: 'normal' },
                { name: 'Wide', value: 'wide' },
                { name: 'Extra Wide', value: 'extrawide' },
              ],
              spacing => updateSetting('clockLetterSpacing', spacing)
            )}
          </View>
        </>
      )}

      {/* Weather Settings */}
      {renderSectionHeader('Weather')}
      <View style={styles.section}>
        {renderSettingRow(
          'Show Weather',
          settings.showWeather,
          value => updateSetting('showWeather', value),
          'Display weather information'
        )}
        {renderSettingRow(
          'Weather on Clock',
          settings.clockShowWeather,
          value => updateSetting('clockShowWeather', value),
          'Show weather on main clock screen'
        )}
        {renderSelectionRow(
          'Temperature Unit',
          settings.weatherUnit,
          [
            { name: 'Fahrenheit (°F)', value: 'fahrenheit' },
            { name: 'Celsius (°C)', value: 'celsius' },
          ],
          unit => updateSetting('weatherUnit', unit)
        )}
      </View>

      {/* Appearance Settings */}
      {renderSectionHeader('Appearance')}
      <View style={styles.section}>
        {renderColorPicker(
          'Background Color',
          settings.backgroundColor,
          [
            { name: 'Black', value: '#000000' },
            { name: 'Dark Blue', value: '#001122' },
            { name: 'Dark Green', value: '#002200' },
            { name: 'Dark Purple', value: '#220044' },
            { name: 'Dark Red', value: '#220000' },
            { name: 'Charcoal', value: '#333333' },
            { name: 'Navy', value: '#000044' },
            { name: 'Midnight', value: '#191970' },
            { name: 'Forest Green', value: '#001100' },
            { name: 'Deep Purple', value: '#330066' },
            { name: 'Burgundy', value: '#330011' },
            { name: 'Dark Gray', value: '#2C2C2C' },
            { name: 'Slate', value: '#1A1A2E' },
            { name: 'Dark Teal', value: '#003333' },
            { name: 'Dark Brown', value: '#332211' },
          ],
          color => updateSetting('backgroundColor', color),
          null,
          false // Show color blobs for background colors
        )}
        {renderColorPicker(
          'Text Color',
          settings.textColor,
          [
            { name: 'White', value: '#FFFFFF' },
            { name: 'Light Blue', value: '#87CEEB' },
            { name: 'Light Green', value: '#90EE90' },
            { name: 'Yellow', value: '#FFFF00' },
            { name: 'Orange', value: '#FFA500' },
            { name: 'Pink', value: '#FFB6C1' },
            { name: 'Cyan', value: '#00FFFF' },
            { name: 'Lime', value: '#00FF00' },
            { name: 'Gold', value: '#FFD700' },
            { name: 'Silver', value: '#C0C0C0' },
            { name: 'Coral', value: '#FF7F50' },
            { name: 'Lavender', value: '#E6E6FA' },
            { name: 'Mint', value: '#98FB98' },
            { name: 'Peach', value: '#FFCBA4' },
            { name: 'Sky Blue', value: '#87CEFA' },
            { name: 'Violet', value: '#DDA0DD' },
            { name: 'Aqua', value: '#00CED1' },
            { name: 'Light Orange', value: '#FFB347' },
            { name: 'Light Purple', value: '#B19CD9' },
            { name: 'Cream', value: '#F5F5DC' },
          ],
          color => updateSetting('textColor', color),
          null,
          true // Show colored text for text colors
        )}
      </View>

      {/* Screen Protection */}
      {renderSectionHeader('Screen Protection')}
      <View style={styles.section}>
        {renderSettingRow(
          'Burn-in Prevention',
          settings.burnInPrevention,
          value => updateSetting('burnInPrevention', value),
          'Protect OLED displays from burn-in'
        )}
        {settings.burnInPrevention && (
          <>
            {renderSettingRow(
              'Position Shift',
              settings.burnInPositionShift,
              value => updateSetting('burnInPositionShift', value),
              'Slightly move clock position periodically'
            )}
            {settings.burnInPositionShift &&
              renderSelectionRow(
                'Position Shift Interval',
                settings.burnInShiftInterval,
                [
                  { name: '2 minutes', value: 120 },
                  { name: '5 minutes', value: 300 },
                  { name: '10 minutes', value: 600 },
                  { name: '15 minutes', value: 900 },
                ],
                interval => updateSetting('burnInShiftInterval', interval)
              )}
            {renderSettingRow(
              'Auto Dim',
              settings.burnInAutoDim,
              value => updateSetting('burnInAutoDim', value),
              'Automatically dim display after inactivity'
            )}
            {settings.burnInAutoDim &&
              renderSelectionRow(
                'Auto-dim After',
                settings.burnInDimAfter,
                [
                  { name: '5 minutes', value: 300 },
                  { name: '10 minutes', value: 600 },
                  { name: '15 minutes', value: 900 },
                  { name: '30 minutes', value: 1800 },
                ],
                time => updateSetting('burnInDimAfter', time)
              )}
          </>
        )}
      </View>

      {/* Interface Settings */}
      {renderSectionHeader('Interface')}
      <View style={styles.section}>
        {renderSettingRow(
          'Auto-hide Navigation',
          settings.autoHideTabBar,
          value => updateSetting('autoHideTabBar', value),
          'Hide navigation bar automatically'
        )}
        {renderSettingRow(
          'Show Screen Titles',
          settings.showScreenTitles,
          value => updateSetting('showScreenTitles', value),
          'Display titles in navigation bar'
        )}
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 32,
    marginBottom: 12,
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  selectionSection: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
  },
  selectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
  },
  optionsContainer: {
    paddingLeft: 32,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
  },
  lastOptionRow: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  colorOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBlob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#38383A',
  },
  checkmark: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default SettingsScreen;
