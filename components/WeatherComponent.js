import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function WeatherComponent() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const [lastFetch, setLastFetch] = useState(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    // Only fetch if we haven't fetched in the last 10 minutes
    const now = Date.now();
    if (!lastFetch || now - lastFetch > 10 * 60 * 1000) {
      fetchWeatherData();
    }

    return () => {
      subscription?.remove();
    };
  }, []);

  const fetchLocationWithFallback = async () => {
    const locationServices = [
      {
        name: 'ipapi.co',
        url: 'https://ipapi.co/json/',
        parser: data => ({
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          region: data.region,
          country: data.country,
        }),
      },
      {
        name: 'ip-api.com',
        url: 'http://ip-api.com/json/',
        parser: data => ({
          latitude: data.lat,
          longitude: data.lon,
          city: data.city,
          region: data.regionName,
          country: data.country,
        }),
      },
      {
        name: 'ipgeolocation.io',
        url: 'https://api.ipgeolocation.io/ipgeo?apiKey=',
        parser: data => ({
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          city: data.city,
          region: data.state_prov,
          country: data.country_name,
        }),
      },
    ];

    for (const service of locationServices) {
      try {
        console.log(`Trying ${service.name}...`);

        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(service.url, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`${service.name} failed: ${response.status}`);
          continue;
        }

        const data = await response.json();
        const locationData = service.parser(data);

        if (locationData.latitude && locationData.longitude) {
          console.log(`Location from ${service.name}:`, locationData);
          return locationData;
        }
      } catch (error) {
        console.warn(`${service.name} error:`, error.message);
        continue;
      }
    }

    // If all services fail, use a default location (New York City)
    console.warn('All location services failed, using default location');
    return {
      latitude: 40.7128,
      longitude: -74.006,
      city: 'New York',
      region: 'NY',
      country: 'United States',
    };
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get location with fallback services
      const locationData = await fetchLocationWithFallback();
      setLocation(locationData);

      // Get weather data from National Weather Service
      const headers = {
        'User-Agent': 'ClockApp (newtanner29@gmail.com)',
        Accept: 'application/ld+json',
      };

      console.log(`Fetching weather for: ${locationData.latitude}, ${locationData.longitude}`);
      const pointsResponse = await fetch(
        `https://api.weather.gov/points/${locationData.latitude},${locationData.longitude}`,
        { headers }
      );

      if (!pointsResponse.ok) {
        throw new Error(
          `Failed to get grid data: ${pointsResponse.status} ${pointsResponse.statusText}`
        );
      }

      const pointsData = await pointsResponse.json();
      console.log('Points data:', pointsData);

      // Check if we have the required URLs (they're directly in the response object)
      if (!pointsData.observationStations || !pointsData.forecast) {
        console.error('Missing required URLs in points data:', pointsData);
        throw new Error('Invalid points data structure - missing required URLs');
      }

      console.log('Observation stations URL:', pointsData.observationStations);
      console.log('Forecast URL:', pointsData.forecast);

      // Get current weather and forecast
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(pointsData.observationStations, { headers }),
        fetch(pointsData.forecast, { headers }),
      ]);

      if (currentResponse.ok && forecastResponse.ok) {
        const stationsData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        console.log('Forecast data:', forecastData);
        console.log('Forecast periods:', forecastData.periods);
        console.log('Number of forecast periods:', forecastData.periods?.length);

        if (stationsData.features && stationsData.features.length > 0) {
          const stationUrl = stationsData.features[0].id;
          const observationResponse = await fetch(`${stationUrl}/observations/latest`, { headers });

          if (observationResponse.ok) {
            const observationData = await observationResponse.json();

            setWeather({
              current: observationData?.properties || null,
              forecast: forecastData?.periods || [],
              location: pointsData,
            });
          } else {
            // If observation fails, at least show forecast
            setWeather({
              current: null,
              forecast: forecastData?.periods || [],
              location: pointsData,
            });
          }
        } else {
          // If no stations, at least show forecast
          setWeather({
            current: null,
            forecast: forecastData?.periods || [],
            location: pointsData,
          });
        }
      } else {
        // If weather API fails completely, just show location
        setWeather({
          current: null,
          forecast: null,
          location: {
            relativeLocation: {
              properties: { city: locationData.city, state: locationData.region },
            },
          },
        });
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(`Weather unavailable: ${err.message}`);

      // Try to at least show location if we have it
      if (location) {
        setWeather({
          current: null,
          forecast: null,
          location: {
            relativeLocation: { properties: { city: location.city, state: location.region } },
          },
        });
      }
    } finally {
      setLoading(false);
      setLastFetch(Date.now()); // Update last fetch timestamp
    }
  };

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
  const displayTemp = tempF || weather.forecast?.[0]?.temperature;
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
                {displayTemp ? `${displayTemp}°` : '--°'}
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
              {displayTemp ? `${displayTemp}°` : '--°'}
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
          {weather.forecast.slice(0, 7).map((period, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastDay}>{period.name}</Text>
              <View style={styles.forecastDetails}>
                <Ionicons name={getWeatherIcon(period.shortForecast)} size={24} color="#007AFF" />
                <Text style={styles.forecastTemp}>
                  {period.temperature}°{period.temperatureUnit}
                </Text>
              </View>
            </View>
          ))}
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
