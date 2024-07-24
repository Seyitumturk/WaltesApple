import React, { useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Animated, TouchableOpacity, Text, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const images = [
  require('../assets/1.png'),
  require('../assets/2.png'),
  require('../assets/3.png'),
  require('../assets/4.png'),
  require('../assets/5.png'),
  require('../assets/6.png'),
  require('../assets/7.png'),
  require('../assets/8.png'),
  require('../assets/9.png'),
  require('../assets/10.png'),
  require('../assets/11.png'),
  require('../assets/12.png'),
];

const Slide = ({ source, fadeAnim }) => {
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.slide}>
      <Image source={source} style={styles.fullImage} />
      <Animated.Text style={{ ...styles.swipeText, opacity: fadeAnim }}>
        Swipe to see more
      </Animated.Text>
    </View>
  );
};

const TutorialSwiper = ({ onFinished }) => {
  const fadeOutAnim = useRef(new Animated.Value(1)).current;
  const radioWaveAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      radioWaveAnim.setValue(1);
      Animated.sequence([
        Animated.timing(radioWaveAnim, {
          toValue: 2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(radioWaveAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => startAnimation());
    };

    startAnimation();
  }, [radioWaveAnim]);

  const handlePress = () => {
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(onFinished);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeOutAnim }]}>
      <Image source={require('../assets/bg.jpg')} style={styles.backgroundImage} />
      <Swiper loop={false}>
        {images.map((imgSrc, index) => (
          <View key={index} style={index === images.length - 1 ? styles.lastSlide : styles.slide}>
            <Image source={imgSrc} style={styles.fullImage} />
            <Animated.Text style={{ ...styles.swipeText, opacity: fadeAnim }}>
              Swipe to see more
            </Animated.Text>
            {index !== images.length - 1 && (
              <TouchableOpacity style={styles.skipButton} onPress={handlePress}>
                <Text style={styles.skipButtonText}>Skip</Text>
                <View style={styles.arrow} />
              </TouchableOpacity>
            )}
            {index === images.length - 1 && (
              <>
                <Animated.View
                  style={[
                    styles.radioWave,
                    {
                      transform: [{ scale: radioWaveAnim }],
                      opacity: radioWaveAnim.interpolate({
                        inputRange: [1, 2],
                        outputRange: [0.5, 0],
                      }),
                    },
                  ]}
                />
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                  <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}
      </Swiper>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BF8A1F',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transform: [{ rotate: '180deg' }],
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lastSlide: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    marginBottom: height * 0.1,
  },
  fullImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  swipeText: {
    color: '#000',
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#F7B329',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: height * 0.15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioWave: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(73, 53, 13, 0.5)',
    bottom: height * 0.15 - 20,
    alignSelf: 'center',
    zIndex: -1,
  },
  skipButton: {
    backgroundColor: '#F7B329',
    width: width * 0.3,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: height * 0.1,
    flexDirection: 'row',
  },
  skipButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  arrow: {
    width: 15,
    height: 15,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#FFF',
    transform: [{ rotate: '45deg' }],
  },
});

export default TutorialSwiper;
