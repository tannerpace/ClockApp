import { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from './SettingsContext';

const WeatherContext = createContext();

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    // Only fetch weather if the user has enabled it (either for weather screen or clock)
    if (settings.showWeather || settings.clockShowWeather) {
      // Only fetch if we haven't fetched in the last 10 minutes
      const now = Date.now();
      if (!lastFetch || now - lastFetch > 10 * 60 * 1000) {
        fetchWeatherData();
      }
    }
  }, [settings.showWeather, settings.clockShowWeather]);

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

  const value = {
    weather,
    location,
    loading,
    error,
    refreshWeather: fetchWeatherData,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export default WeatherContext;
