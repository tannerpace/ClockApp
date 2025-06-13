import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { SettingsProvider } from './contexts/SettingsContext';
import AnalogClockScreen from './screens/AnalogClockScreen';
import DigitalClockScreen from './screens/DigitalClockScreen';
import SettingsScreen from './screens/SettingsScreen';
import TimerScreen from './screens/TimerScreen';
import WeatherScreen from './screens/WeatherScreen';
import WorldClockScreen from './screens/WorldClockScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Digital') {
                iconName = focused ? 'time' : 'time-outline';
              } else if (route.name === 'Analog') {
                iconName = focused ? 'stopwatch' : 'stopwatch-outline';
              } else if (route.name === 'World') {
                iconName = focused ? 'globe' : 'globe-outline';
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
          })}
        >
          <Tab.Screen
            name="Digital"
            component={DigitalClockScreen}
            options={{ title: 'Digital Clock' }}
          />
          <Tab.Screen
            name="Analog"
            component={AnalogClockScreen}
            options={{ title: 'Analog Clock' }}
          />
          <Tab.Screen
            name="World"
            component={WorldClockScreen}
            options={{ title: 'World Clock' }}
          />
          <Tab.Screen
            name="Timer"
            component={TimerScreen}
            options={{ title: 'Timer & Stopwatch' }}
          />
          <Tab.Screen name="Weather" component={WeatherScreen} options={{ title: 'Weather' }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Tab.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SettingsProvider>
  );
}
