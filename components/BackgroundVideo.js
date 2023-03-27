// BackgroundVideo.js
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import waterVideo from '../assets/water-video.mp4';

const { width, height } = Dimensions.get('window');

export default function BackgroundVideo() {
  return (
    <Video
      source={waterVideo}
      style={styles.backgroundVideo}
      resizeMode={Video.RESIZE_MODE_COVER}
      shouldPlay
      isLooping
    />
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width,
    height,
    zIndex: -1,
    transform: [{ rotate: '90deg' }, { scale: Math.max(width / height, height / width) }],
  },
});
