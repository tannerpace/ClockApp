import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { useWeather } from '../contexts/WeatherContext';

export default function WeatherComponent({ skipSettingsCheck = false }) {
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const { settings } = useSettings();
  const { weather, location, loading, error, refreshWeather } = useWeather();

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const celsiusToFahrenheit = celsius => {
    if (celsius === null || celsius === undefined) return null;
    return Math.round((celsius * 9) / 5 + 32);
  };

  const getWeatherIcon = condition => {
    if (!condition) return 'cloud-outline';

    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return 'sunny-outline';
    } else if (conditionLower.includes('cloud')) {
      return 'cloud-outline';
    } else if (conditionLower.includes('rain')) {
      return 'rainy-outline';
    } else if (conditionLower.includes('storm')) {
      return 'thunderstorm-outline';
    } else if (conditionLower.includes('snow')) {
      return 'snow-outline';
    }
    return 'cloud-outline';
  };

  const getResponsiveStyles = () => {
    const { width, height } = screenDimensions;
    const isLandscape = width > height;
    const scaleFactor = Math.min(width, height) / 400;

    return {
      temperature: {
        fontSize: Math.max(48, Math.min(72, isLandscape ? 56 : 72 * scaleFactor)),
      },
      location: {
        fontSize: Math.max(16, Math.min(20, isLandscape ? 16 : 24 * scaleFactor)),
      },
      condition: {
        fontSize: Math.max(14, Math.min(16, isLandscape ? 14 : 18 * scaleFactor)),
      },
      containerPadding: isLandscape ? 15 : 20,
      isLandscape,
    };
  };

  const responsiveStyles = getResponsiveStyles();

  // Show disabled message if weather is turned off in settings
  if (!skipSettingsCheck && !settings.showWeather) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="settings-outline" size={60} color="#8E8E93" />
        <Text style={styles.errorText}>Weather Disabled</Text>
        <Text style={styles.errorSubtext}>
          Enable weather in Settings to view weather information
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Getting weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="cloud-offline-outline" size={60} color="#FF3B30" />
        <Text style={styles.errorText}>Weather Unavailable</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="location-outline" size={60} color="#FF9500" />
        <Text style={styles.errorText}>No Weather Data</Text>
        <Text style={styles.errorSubtext}>Unable to fetch weather information</Text>
      </View>
    );
  }

  const currentTemp = weather.current?.temperature?.value;
  const tempF = celsiusToFahrenheit(currentTemp);

  // Fallback to forecast temperature if current observation isn't available
  const forecastTemp = weather.forecast?.[0]?.temperature;
  let displayTemp = tempF || forecastTemp;
  let tempUnit = 'F';

  // Convert temperature based on user settings
  if (settings.weatherUnit === 'celsius') {
    if (tempF) {
      displayTemp = Math.round(((tempF - 32) * 5) / 9);
    } else if (forecastTemp) {
      // Assume forecast is in Fahrenheit from weather.gov
      displayTemp = Math.round(((forecastTemp - 32) * 5) / 9);
    }
    tempUnit = 'C';
  }

  const condition = weather.current?.textDescription || weather.forecast?.[0]?.shortForecast;

  // Landscape dock mode - compact layout
  if (responsiveStyles.isLandscape) {
    return (
      <View style={styles.landscapeContainer}>
        <View style={styles.landscapeMainSection}>
          <View style={styles.landscapeLocationHeader}>
            <Ionicons name="location-outline" size={12} color="#8E8E93" />
            <Text style={[styles.landscapeLocationText, responsiveStyles.location]}>
              {location?.city}, {location?.region}
            </Text>
          </View>

          <View style={styles.landscapeWeatherRow}>
            <Ionicons
              name={getWeatherIcon(condition)}
              size={48}
              color="#007AFF"
              style={styles.landscapeWeatherIcon}
            />
            <View style={styles.landscapeTemperatureContainer}>
              <Text style={[styles.landscapeTemperature, responsiveStyles.temperature]}>
                {displayTemp ? `${displayTemp}°${tempUnit}` : '--°'}
              </Text>
              <Text style={[styles.landscapeCondition, responsiveStyles.condition]}>
                {condition || 'Unknown'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.landscapeDetailsSection}>
          {weather.current?.relativeHumidity?.value && (
            <View style={styles.landscapeDetailItem}>
              <Ionicons name="water-outline" size={16} color="#007AFF" />
              <Text style={styles.landscapeDetailValue}>
                {Math.round(weather.current.relativeHumidity.value)}%
              </Text>
            </View>
          )}

          {weather.current?.windSpeed?.value && (
            <View style={styles.landscapeDetailItem}>
              <Ionicons name="flag-outline" size={16} color="#007AFF" />
              <Text style={styles.landscapeDetailValue}>
                {Math.round(weather.current.windSpeed.value * 2.237)} mph
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Portrait mode - full layout
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: responsiveStyles.containerPadding }}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refreshWeather}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
    >
      {/* Main Weather Card */}
      <View style={styles.mainCard}>
        <View style={styles.locationHeader}>
          <Ionicons name="location-outline" size={16} color="#8E8E93" />
          <Text style={[styles.locationText, responsiveStyles.location]}>
            {location?.city}, {location?.region}
          </Text>
        </View>

        <View style={styles.currentWeather}>
          <Ionicons
            name={getWeatherIcon(condition)}
            size={80}
            color="#007AFF"
            style={styles.weatherIcon}
          />

          <View style={styles.temperatureContainer}>
            <Text style={[styles.temperature, responsiveStyles.temperature]}>
              {displayTemp ? `${displayTemp}°${tempUnit}` : '--°'}
            </Text>
            <Text style={[styles.condition, responsiveStyles.condition]}>
              {condition || 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Additional Details */}
        <View style={styles.detailsGrid}>
          {weather.current?.relativeHumidity?.value && (
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={20} color="#007AFF" />
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>
                {Math.round(weather.current.relativeHumidity.value)}%
              </Text>
            </View>
          )}

          {weather.current?.windSpeed?.value && (
            <View style={styles.detailItem}>
              <Ionicons name="flag-outline" size={20} color="#007AFF" />
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>
                {Math.round(weather.current.windSpeed.value * 2.237)} mph
              </Text>
            </View>
          )}

          {weather.current?.barometricPressure?.value && (
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={20} color="#007AFF" />
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>
                {Math.round(weather.current.barometricPressure.value / 100)} mb
              </Text>
            </View>
          )}

          {weather.current?.visibility?.value && (
            <View style={styles.detailItem}>
              <Ionicons name="eye-outline" size={20} color="#007AFF" />
              <Text style={styles.detailLabel}>Visibility</Text>
              <Text style={styles.detailValue}>
                {Math.round(weather.current.visibility.value / 1609)} mi
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Forecast */}
      {weather.forecast && weather.forecast.length > 0 && (
        <View style={styles.forecastCard}>
          <Text style={styles.forecastTitle}>7-Day Forecast</Text>
          {weather.forecast.slice(0, 7).map((period, index) => {
            let forecastTemp = period.temperature;
            let forecastUnit = period.temperatureUnit;

            // Convert forecast temperature based on user settings
            if (settings.weatherUnit === 'celsius' && period.temperatureUnit === 'F') {
              forecastTemp = Math.round(((period.temperature - 32) * 5) / 9);
              forecastUnit = 'C';
            } else if (settings.weatherUnit === 'fahrenheit' && period.temperatureUnit === 'C') {
              forecastTemp = Math.round((period.temperature * 9) / 5 + 32);
              forecastUnit = 'F';
            }

            return (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastDay}>{period.name}</Text>
                <View style={styles.forecastDetails}>
                  <Ionicons name={getWeatherIcon(period.shortForecast)} size={24} color="#007AFF" />
                  <Text style={styles.forecastTemp}>
                    {forecastTemp}°{forecastUnit}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  mainCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    color: '#8E8E93',
    fontSize: 24,
    fontWeight: '400',
    marginLeft: 6,
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  weatherIcon: {
    marginRight: 24,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    color: '#FFFFFF',
    fontSize: 72,
    fontWeight: '200',
    lineHeight: 80,
  },
  condition: {
    color: '#8E8E93',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  detailLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 8,
    textAlign: 'center',
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  // Landscape dock mode styles
  landscapeContainer: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  landscapeMainSection: {
    flex: 2,
    alignItems: 'flex-start',
  },
  landscapeLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  landscapeLocationText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 4,
  },
  landscapeWeatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  landscapeWeatherIcon: {
    marginRight: 16,
  },
  landscapeTemperatureContainer: {
    alignItems: 'flex-start',
  },
  landscapeTemperature: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '200',
    lineHeight: 52,
  },
  landscapeCondition: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  landscapeDetailsSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  landscapeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  landscapeDetailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  forecastCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
  },
  forecastTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  forecastDay: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  forecastDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastTemp: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    minWidth: 50,
    textAlign: 'right',
  },
});
