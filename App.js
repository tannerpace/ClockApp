import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import ClockScreen from './screens/ClockScreen';
import SettingsScreen from './screens/SettingsScreen';
import TimerScreen from './screens/TimerScreen';
import WeatherScreen from './screens/WeatherScreen';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  const { settings } = useSettings();
  if (settings === undefined) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Clock') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'Timer') {
              iconName = focused ? 'timer' : 'timer-outline';
            } else if (route.name === 'Weather') {
              iconName = focused ? 'cloud' : 'cloud-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#111',
            borderTopColor: '#333',
          },
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '300',
          },
          // Conditionally hide header titles based on settings
          headerShown: settings.showScreenTitles,
        })}
      >
        <Tab.Screen
          name="Clock"
          component={ClockScreen}
          options={{
            title: settings.showScreenTitles ? 'Clock' : '',
          }}
        />
        <Tab.Screen
          name="Timer"
          component={TimerScreen}
          options={{ title: settings.showScreenTitles ? 'Timer & Stopwatch' : '' }}
        />
        <Tab.Screen
          name="Weather"
          component={WeatherScreen}
          options={{ title: settings.showScreenTitles ? 'Weather' : '' }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: settings.showScreenTitles ? 'Settings' : '' }}
        />
      </Tab.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppNavigator />
    </SettingsProvider>
  );
}
