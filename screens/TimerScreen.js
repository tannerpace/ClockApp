import { useEffect, useRef, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TimerScreen() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('stopwatch'); // 'stopwatch' or 'timer'
  const [timerDuration, setTimerDuration] = useState(300); // 5 minutes default
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const intervalRef = useRef(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (mode === 'stopwatch') {
            return prevTime + 1;
          } else {
            const newTime = prevTime - 1;
            if (newTime <= 0) {
              setIsRunning(false);
              return 0;
            }
            return newTime;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'stopwatch') {
      setTime(0);
    } else {
      setTime(timerDuration);
    }
  };

  const switchMode = () => {
    setIsRunning(false);
    const newMode = mode === 'stopwatch' ? 'timer' : 'stopwatch';
    setMode(newMode);
    setTime(newMode === 'stopwatch' ? 0 : timerDuration);
  };

  const adjustTimer = (increment) => {
    if (mode === 'timer' && !isRunning) {
      const newDuration = Math.max(60, timerDuration + increment);
      setTimerDuration(newDuration);
      setTime(newDuration);
    }
  };

  const getResponsiveStyles = () => {
    const { width, height } = screenDimensions;
    const isLandscape = width > height;
    const scaleFactor = Math.min(width, height) / 400;

    return {
      content: {
        flexDirection: isLandscape ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: isLandscape ? 'space-around' : 'center',
      },
      timeDisplay: {
        fontSize: Math.max(32, Math.min(64, 64 * scaleFactor)),
        marginBottom: isLandscape ? 10 : 40,
      },
      modeSelector: {
        marginBottom: isLandscape ? 10 : 40,
      }
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'stopwatch' && styles.activeModeButton]}
            onPress={switchMode}
          >
            <Text style={[styles.modeText, mode === 'stopwatch' && styles.activeModeText]}>
              Stopwatch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'timer' && styles.activeModeButton]}
            onPress={switchMode}
          >
            <Text style={[styles.modeText, mode === 'timer' && styles.activeModeText]}>
              Timer
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.timeDisplay}>{formatTime(time)}</Text>

        {mode === 'timer' && !isRunning && (
          <View style={styles.timerControls}>
            <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTimer(-60)}>
              <Text style={styles.adjustButtonText}>-1m</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTimer(60)}>
              <Text style={styles.adjustButtonText}>+1m</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTimer(300)}>
              <Text style={styles.adjustButtonText}>+5m</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.controls}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.startButton, isRunning && styles.stopButton]}
            onPress={handleStartStop}
          >
            <Text style={styles.buttonText}>
              {isRunning ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 40,
    borderRadius: 25,
    backgroundColor: '#333',
    padding: 4,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#fff',
  },
  modeText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '300',
  },
  activeModeText: {
    color: '#000',
    fontWeight: '500',
  },
  timeDisplay: {
    fontSize: 64,
    color: '#fff',
    fontWeight: '200',
    marginBottom: 40,
    fontFamily: 'monospace',
  },
  timerControls: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 15,
  },
  adjustButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    gap: 20,
  },
  resetButton: {
    backgroundColor: '#444',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
