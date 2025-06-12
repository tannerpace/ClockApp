import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const clockSize = Math.min(width * 0.8, 300);
const centerX = clockSize / 2;
const centerY = clockSize / 2;
const radius = clockSize / 2 - 20;

export default function AnalogClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
        <SvgText
          key={i}
          x={x}
          y={y + 6}
          fontSize="16"
          fill="#fff"
          textAnchor="middle"
          fontWeight="300"
        >
          {i}
        </SvgText>
      );
    }
    return markers;
  };

  return (
    <View style={styles.container}>
      <Svg width={clockSize} height={clockSize} style={styles.clock}>
        {/* Clock face */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />
        
        {/* Hour markers */}
        {renderHourMarkers()}
        
        {/* Hour hand */}
        <Line
          x1={centerX}
          y1={centerY}
          x2={hands.hour.x2}
          y2={hands.hour.y2}
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Minute hand */}
        <Line
          x1={centerX}
          y1={centerY}
          x2={hands.minute.x2}
          y2={hands.minute.y2}
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Second hand */}
        <Line
          x1={centerX}
          y1={centerY}
          x2={hands.second.x2}
          y2={hands.second.y2}
          stroke="#ff4444"
          strokeWidth="1"
          strokeLinecap="round"
        />
        
        {/* Center dot */}
        <Circle
          cx={centerX}
          cy={centerY}
          r="4"
          fill="#fff"
        />
      </Svg>
    </View>
  );
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
});
