import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

// Fallback for when SVG is not available
export default function AnalogClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => {
      clearInterval(timer);
      subscription?.remove();
    };
  }, []);

  try {
    // Try to import SVG components
    const Svg = require('react-native-svg').default;
    const { Circle, Line, Text: SvgText } = require('react-native-svg');

    const { width, height } = screenDimensions;
    const clockSize = Math.min(width * 0.7, height * 0.6, 300);
    const centerX = clockSize / 2;
    const centerY = clockSize / 2;
    const radius = clockSize / 2 - 20;

    const getClockHands = (date) => {
      const hours = date.getHours() % 12;
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);
      const minuteAngle = (minutes * 6 - 90) * (Math.PI / 180);
      const hourAngle = ((hours * 30) + (minutes * 0.5) - 90) * (Math.PI / 180);

      return {
        hour: {
          x2: centerX + (radius * 0.5) * Math.cos(hourAngle),
          y2: centerY + (radius * 0.5) * Math.sin(hourAngle),
        },
        minute: {
          x2: centerX + (radius * 0.7) * Math.cos(minuteAngle),
          y2: centerY + (radius * 0.7) * Math.sin(minuteAngle),
        },
        second: {
          x2: centerX + (radius * 0.8) * Math.cos(secondAngle),
          y2: centerY + (radius * 0.8) * Math.sin(secondAngle),
        },
      };
    };

    const hands = getClockHands(currentTime);

    const renderHourMarkers = () => {
      const markers = [];
      for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = centerX + (radius * 0.85) * Math.cos(angle);
        const y = centerY + (radius * 0.85) * Math.sin(angle);

        markers.push(
          React.createElement(SvgText, {
            key: i,
            x: x,
            y: y + 6,
            fontSize: "16",
            fill: "#fff",
            textAnchor: "middle",
            fontWeight: "300"
          }, i.toString())
        );
      }
      return markers;
    };

    return (
      <View style={styles.container}>
        {React.createElement(Svg, {
          width: clockSize,
          height: clockSize,
          style: styles.clock
        }, [
          // Clock face
          React.createElement(Circle, {
            key: 'face',
            cx: centerX,
            cy: centerY,
            r: radius,
            fill: "none",
            stroke: "#333",
            strokeWidth: "2"
          }),

          // Hour markers
          ...renderHourMarkers(),

          // Hour hand
          React.createElement(Line, {
            key: 'hour',
            x1: centerX,
            y1: centerY,
            x2: hands.hour.x2,
            y2: hands.hour.y2,
            stroke: "#fff",
            strokeWidth: "4",
            strokeLinecap: "round"
          }),

          // Minute hand
          React.createElement(Line, {
            key: 'minute',
            x1: centerX,
            y1: centerY,
            x2: hands.minute.x2,
            y2: hands.minute.y2,
            stroke: "#fff",
            strokeWidth: "3",
            strokeLinecap: "round"
          }),

          // Second hand
          React.createElement(Line, {
            key: 'second',
            x1: centerX,
            y1: centerY,
            x2: hands.second.x2,
            y2: hands.second.y2,
            stroke: "#ff4444",
            strokeWidth: "1",
            strokeLinecap: "round"
          }),

          // Center dot
          React.createElement(Circle, {
            key: 'center',
            cx: centerX,
            cy: centerY,
            r: "4",
            fill: "#fff"
          })
        ])}
      </View>
    );
  } catch (error) {
    // Fallback when SVG is not available
    const { Text } = require('react-native');

    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };

    return (
      <View style={[styles.container, styles.fallback]}>
        <Text style={styles.fallbackText}>Analog Clock</Text>
        <Text style={styles.fallbackTime}>{formatTime(currentTime)}</Text>
        <Text style={styles.fallbackNote}>SVG not available</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clock: {
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
  fallback: {
    padding: 40,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 20,
  },
  fallbackText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  fallbackTime: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 10,
  },
  fallbackNote: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});
