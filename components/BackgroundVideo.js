import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Svg from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function BackgroundSVG() {
  return (
    <Svg
      style={styles.backgroundSVG}
      width={width}
      height={height}
    />
  );
}

const styles = StyleSheet.create({
  backgroundSVG: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width,
    height,
    zIndex: -1,
  },
});
