import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FireLine = ({ isVisible, player }) => {
  const fireAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fireAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fireAnim, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    return () => fireAnim.stopAnimation();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View style={[
      styles.container,
      player === 'player1' ? styles.player1Container : styles.player2Container
    ]}>
      {Array(8).fill().map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.fireIcon,
            {
              transform: [
                { scale: fireAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2]
                })},
                { translateY: fireAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, i % 2 ? -10 : 10]
                })}
              ]
            }
          ]}
        >
          <MaterialCommunityIcons 
            name="fire" 
            size={30} 
            color="#FF4500"
          />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
  },
  player1Container: {
    bottom: '100%', // Position at the top of player1's area
    transform: [{ rotate: '180deg' }],
  },
  player2Container: {
    top: '100%', // Position at the bottom of player2's area
  },
  fireIcon: {
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  }
});

export default FireLine; 