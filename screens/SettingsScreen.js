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

            {renderSelectionRow(
              'Text Alignment',
              settings.clockTextAlign,
              [
                { name: 'Left', value: 'left' },
                { name: 'Center', value: 'center' },
                { name: 'Right', value: 'right' },
              ],
              align => updateSetting('clockTextAlign', align)
            )}

            {renderSettingRow(
              'Italic',
              settings.clockItalic,
              value => updateSetting('clockItalic', value),
              'Make text italic'
            )}

            {renderSettingRow(
              'Underline',
              settings.clockUnderline,
              value => updateSetting('clockUnderline', value),
              'Add underline to text'
            )}

            {renderSettingRow(
              'Strikethrough',
              settings.clockStrikethrough,
              value => updateSetting('clockStrikethrough', value),
              'Add strikethrough to text'
            )}
          </View>

          {renderSectionHeader('Text Effects')}
          <View style={styles.section}>
            <Text style={[styles.settingSubtitle, { marginBottom: 10, fontStyle: 'italic' }]}>
              Note: Effects are prioritized - Neon changes text color, others add shadows/glows
            </Text>

            {renderSettingRow(
              'Drop Shadow',
              settings.clockShadow,
              value => updateSetting('clockShadow', value),
              'Add shadow behind text (Low priority)'
            )}

            {settings.clockShadow && (
              <>
                {renderSelectionRow(
                  'Shadow Intensity',
                  settings.clockShadowIntensity,
                  [
                    { name: 'Light', value: 'light' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'Strong', value: 'strong' },
                    { name: 'Extra Strong', value: 'extrastrong' },
                  ],
                  intensity => updateSetting('clockShadowIntensity', intensity)
                )}

                {renderSelectionRow(
                  'Shadow Offset',
                  settings.clockShadowOffset,
                  [
                    { name: 'Small', value: 'small' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'Large', value: 'large' },
                    { name: 'Extra Large', value: 'extralarge' },
                  ],
                  offset => updateSetting('clockShadowOffset', offset)
                )}

                {renderColorPicker(
                  'Shadow Color',
                  settings.clockShadowColor,
                  [
                    { name: 'Black', value: '#000000' },
                    { name: 'Dark Gray', value: '#333333' },
                    { name: 'Gray', value: '#666666' },
                    { name: 'Dark Blue', value: '#001133' },
                    { name: 'Dark Red', value: '#330011' },
                    { name: 'Dark Green', value: '#003311' },
                    { name: 'Dark Purple', value: '#220033' },
                    { name: 'Dark Brown', value: '#332211' },
                  ],
                  color => updateSetting('clockShadowColor', color),
                  null,
                  false
                )}
              </>
            )}

            {renderSettingRow(
              'Glow Effect',
              settings.clockGlow,
              value => updateSetting('clockGlow', value),
              'Add glow around text (Medium priority)'
            )}

            {settings.clockGlow && (
              <>
                {renderSelectionRow(
                  'Glow Intensity',
                  settings.clockGlowIntensity,
                  [
                    { name: 'Subtle', value: 'subtle' },
                    { name: 'Light', value: 'light' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'Strong', value: 'strong' },
                    { name: 'Intense', value: 'intense' },
                  ],
                  intensity => updateSetting('clockGlowIntensity', intensity)
                )}

                {renderColorPicker(
                  'Glow Color',
                  settings.clockGlowColor,
                  [
                    { name: 'White', value: '#FFFFFF' },
                    { name: 'Blue', value: '#0080FF' },
                    { name: 'Cyan', value: '#00FFFF' },
                    { name: 'Green', value: '#00FF00' },
                    { name: 'Yellow', value: '#FFFF00' },
                    { name: 'Orange', value: '#FF8000' },
                    { name: 'Red', value: '#FF0000' },
                    { name: 'Purple', value: '#8000FF' },
                    { name: 'Pink', value: '#FF00FF' },
                  ],
                  color => updateSetting('clockGlowColor', color),
                  null,
                  false
                )}
              </>
            )}

            {renderSettingRow(
              'Outline',
              settings.clockOutline,
              value => updateSetting('clockOutline', value),
              'Add outline around text (Medium priority)'
            )}

            {settings.clockOutline && (
              <>
                {renderSelectionRow(
                  'Outline Width',
                  settings.clockOutlineWidth,
                  [
                    { name: 'Thin', value: 'thin' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'Thick', value: 'thick' },
                    { name: 'Extra Thick', value: 'extrathick' },
                  ],
                  width => updateSetting('clockOutlineWidth', width)
                )}

                {renderColorPicker(
                  'Outline Color',
                  settings.clockOutlineColor,
                  [
                    { name: 'Black', value: '#000000' },
                    { name: 'White', value: '#FFFFFF' },
                    { name: 'Gray', value: '#888888' },
                    { name: 'Blue', value: '#0080FF' },
                    { name: 'Red', value: '#FF0000' },
                    { name: 'Green', value: '#00FF00' },
                    { name: 'Yellow', value: '#FFFF00' },
                    { name: 'Purple', value: '#8000FF' },
                  ],
                  color => updateSetting('clockOutlineColor', color),
                  null,
                  false
                )}
              </>
            )}

            {renderSettingRow(
              'Gradient Text',
              settings.clockGradient,
              value => updateSetting('clockGradient', value),
              'Uses first gradient color (limited support)'
            )}

            {settings.clockGradient && (
              <>
                {renderColorPicker(
                  'Gradient Color',
                  settings.clockGradientColors[0],
                  [
                    { name: 'White', value: '#FFFFFF' },
                    { name: 'Light Blue', value: '#87CEEB' },
                    { name: 'Light Green', value: '#90EE90' },
                    { name: 'Yellow', value: '#FFFF00' },
                    { name: 'Orange', value: '#FFA500' },
                    { name: 'Pink', value: '#FFB6C1' },
                    { name: 'Cyan', value: '#00FFFF' },
                    { name: 'Silver', value: '#C0C0C0' },
                    { name: 'Gold', value: '#FFD700' },
                    { name: 'Lime', value: '#00FF00' },
                    { name: 'Coral', value: '#FF7F50' },
                    { name: 'Lavender', value: '#E6E6FA' },
                  ],
                  color =>
                    updateSetting('clockGradientColors', [color, settings.clockGradientColors[1]]),
                  null,
                  true
                )}

                {renderSelectionRow(
                  'Gradient Direction',
                  settings.clockGradientDirection,
                  [
                    { name: 'Vertical', value: 'vertical' },
                    { name: 'Horizontal', value: 'horizontal' },
                    { name: 'Diagonal', value: 'diagonal' },
                    { name: 'Radial', value: 'radial' },
                  ],
                  direction => updateSetting('clockGradientDirection', direction)
                )}
              </>
            )}

            {renderSettingRow(
              'Neon Effect',
              settings.clockNeon,
              value => updateSetting('clockNeon', value),
              'Changes text color and adds glow (Highest priority)'
            )}

            {settings.clockNeon &&
              renderColorPicker(
                'Neon Color',
                settings.clockNeonColor,
                [
                  { name: 'Electric Blue', value: '#00FFFF' },
                  { name: 'Hot Pink', value: '#FF00FF' },
                  { name: 'Neon Green', value: '#00FF00' },
                  { name: 'Electric Purple', value: '#8000FF' },
                  { name: 'Neon Orange', value: '#FF4500' },
                  { name: 'Electric Yellow', value: '#FFFF00' },
                  { name: 'Laser Red', value: '#FF0040' },
                  { name: 'Ice Blue', value: '#00BFFF' },
                  { name: 'Plasma Pink', value: '#FF69B4' },
                  { name: 'Acid Green', value: '#32CD32' },
                ],
                color => updateSetting('clockNeonColor', color),
                null,
                false
              )}

            {renderSettingRow(
              'Emboss Effect',
              settings.clockEmboss,
              value => updateSetting('clockEmboss', value),
              'Add embossed 3D effect'
            )}

            {renderSettingRow(
              'Engraved Effect',
              settings.clockEngraved,
              value => updateSetting('clockEngraved', value),
              'Add engraved 3D effect'
            )}

            {renderSettingRow(
              'Rainbow Text',
              settings.clockRainbowText,
              value => updateSetting('clockRainbowText', value),
              'Animate text with rainbow colors (Highest color priority)'
            )}
          </View>

          {renderSectionHeader('Border & Background')}
          <View style={styles.section}>
            {renderSettingRow(
              'Border',
              settings.clockBorder,
              value => updateSetting('clockBorder', value),
              'Add border around clock'
            )}

            {settings.clockBorder && (
              <>
                {renderSelectionRow(
                  'Border Width',
                  settings.clockBorderWidth,
                  [
                    { name: 'Thin', value: 'thin' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'Thick', value: 'thick' },
                    { name: 'Extra Thick', value: 'extrathick' },
                  ],
                  width => updateSetting('clockBorderWidth', width)
                )}

                {renderSelectionRow(
                  'Border Style',
                  settings.clockBorderStyle,
                  [
                    { name: 'Solid', value: 'solid' },
                    { name: 'Dashed', value: 'dashed' },
                    { name: 'Dotted', value: 'dotted' },
                    { name: 'Double', value: 'double' },
                  ],
                  style => updateSetting('clockBorderStyle', style)
                )}

                {renderSelectionRow(
                  'Border Radius',
                  settings.clockBorderRadius,
                  [
                    { name: 'None', value: 'none' },
                    { name: 'Small', value: 'small' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'Large', value: 'large' },
                    { name: 'Extra Large', value: 'extralarge' },
                    { name: 'Round', value: 'round' },
                  ],
                  radius => updateSetting('clockBorderRadius', radius)
                )}

                {renderColorPicker(
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
              </>
            )}

            {renderSettingRow(
              'Background',
              settings.clockBackground,
              value => updateSetting('clockBackground', value),
              'Add background behind clock'
            )}

            {settings.clockBackground && (
              <>
                {renderColorPicker(
                  'Background Color',
                  settings.clockBackgroundColor,
                  [
                    { name: 'Dark Transparent', value: 'rgba(0,0,0,0.3)' },
                    { name: 'Light Transparent', value: 'rgba(255,255,255,0.1)' },
                    { name: 'Blue Transparent', value: 'rgba(0,100,200,0.2)' },
                    { name: 'Red Transparent', value: 'rgba(200,0,0,0.2)' },
                    { name: 'Green Transparent', value: 'rgba(0,200,0,0.2)' },
                    { name: 'Purple Transparent', value: 'rgba(100,0,200,0.2)' },
                    { name: 'Black', value: '#000000' },
                    { name: 'White', value: '#FFFFFF' },
                  ],
                  color => updateSetting('clockBackgroundColor', color),
                  null,
                  false
                )}

                {renderSelectionRow(
                  'Background Opacity',
                  settings.clockBackgroundOpacity,
                  [
                    { name: 'Very Light', value: 'verylight' },
                    { name: 'Light', value: 'light' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'Strong', value: 'strong' },
                    { name: 'Very Strong', value: 'verystrong' },
                  ],
                  opacity => updateSetting('clockBackgroundOpacity', opacity)
                )}
              </>
            )}

            {renderSettingRow(
              'Blur Background',
              settings.clockBackgroundBlur,
              value => updateSetting('clockBackgroundBlur', value),
              'Add blur effect behind clock'
            )}
          </View>

          {renderSectionHeader('Animations')}
          <View style={styles.section}>
            {renderSettingRow(
              'Pulse Animation',
              settings.clockAnimationPulse,
              value => updateSetting('clockAnimationPulse', value),
              'Gentle pulsing animation'
            )}

            {renderSettingRow(
              'Fade Animation',
              settings.clockAnimationFade,
              value => updateSetting('clockAnimationFade', value),
              'Subtle fade in/out animation'
            )}

            {renderSettingRow(
              'Bounce Animation',
              settings.clockAnimationBounce,
              value => updateSetting('clockAnimationBounce', value),
              'Gentle bounce animation'
            )}

            {renderSettingRow(
              'Color Animation',
              settings.clockColorAnimation,
              value => updateSetting('clockColorAnimation', value),
              'Animate through different colors'
            )}
          </View>

          {renderSectionHeader('Advanced Transform')}
          <View style={styles.section}>
            {renderSelectionRow(
              'Opacity',
              settings.clockOpacity,
              [
                { name: '10%', value: 10 },
                { name: '25%', value: 25 },
                { name: '50%', value: 50 },
                { name: '75%', value: 75 },
                { name: '90%', value: 90 },
                { name: '100%', value: 100 },
              ],
              opacity => updateSetting('clockOpacity', opacity)
            )}

            {renderSelectionRow(
              'Rotation',
              settings.clockRotation,
              [
                { name: 'None', value: 0 },
                { name: '15°', value: 15 },
                { name: '30°', value: 30 },
                { name: '45°', value: 45 },
                { name: '90°', value: 90 },
                { name: '180°', value: 180 },
                { name: '270°', value: 270 },
              ],
              rotation => updateSetting('clockRotation', rotation)
            )}

            {renderSelectionRow(
              'Scale',
              settings.clockScale,
              [
                { name: '50%', value: 50 },
                { name: '75%', value: 75 },
                { name: '90%', value: 90 },
                { name: '100%', value: 100 },
                { name: '110%', value: 110 },
                { name: '125%', value: 125 },
                { name: '150%', value: 150 },
                { name: '200%', value: 200 },
              ],
              scale => updateSetting('clockScale', scale)
            )}

            {renderSelectionRow(
              'Skew',
              settings.clockSkew,
              [
                { name: 'None', value: 0 },
                { name: '5°', value: 5 },
                { name: '10°', value: 10 },
                { name: '15°', value: 15 },
                { name: '20°', value: 20 },
                { name: '-5°', value: -5 },
                { name: '-10°', value: -10 },
                { name: '-15°', value: -15 },
              ],
              skew => updateSetting('clockSkew', skew)
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
