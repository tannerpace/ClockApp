import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { FullscreenProvider } from './contexts/FullscreenContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { TabBarProvider, useTabBar } from './contexts/TabBarContext';
import { WeatherProvider } from './contexts/WeatherContext';
import ClockScreen from './screens/ClockScreen';
import SettingsScreen from './screens/SettingsScreen';
import TimerScreen from './screens/TimerScreen';
import WeatherScreen from './screens/WeatherScreen';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  const { settings } = useSettings();
  const { showTabBar, showTabBarAndResetTimer } = useTabBar();

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
          tabBarStyle:
            settings.autoHideTabBar && !showTabBar
              ? { display: 'none' }
              : {
                  backgroundColor: settings.backgroundColor, // Match app background
                  borderTopColor: settings.backgroundColor === '#000000' ? '#333' : '#666',
                },
          headerStyle: {
            backgroundColor: settings.backgroundColor, // Match app background
          },
          headerTintColor: settings.textColor, // Match app text color
          headerTitleStyle: {
            fontWeight: '300',
            color: settings.textColor,
          },
          // Completely hide header when titles are off
          headerShown: settings.showScreenTitles,
        })}
        screenListeners={{
          tabPress: showTabBarAndResetTimer,
          focus: showTabBarAndResetTimer,
        }}
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
      <StatusBar style="light" hidden={true} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <WeatherProvider>
        <TabBarProvider>
          <FullscreenProvider>
            <AppNavigator />
          </FullscreenProvider>
        </TabBarProvider>
      </WeatherProvider>
    </SettingsProvider>
  );
}
