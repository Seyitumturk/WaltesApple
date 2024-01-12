import React, { useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import Swiper from 'react-native-swiper';
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
];



const Slide = ({ source, fadeAnim }) => {
  useEffect(() => {
    // Start the fade animation when the slide is rendered
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
    // Start the radio wave animation loop
    const startAnimation = () => {
      radioWaveAnim.setValue(1); // Reset to initial value
      Animated.sequence([
        Animated.timing(radioWaveAnim, {
          toValue: 2, // Scale up
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(radioWaveAnim, {
          toValue: 1, // Scale down
          duration: 1000,
          useNativeDriver: true
        })
      ]).start(() => startAnimation()); // Loop the animation
    };

    startAnimation(); // Trigger the animation
  }, []); // Empty array ensures this effect runs only once



  const handlePress = () => {
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(onFinished);
  };

const slides = images.map((imgSrc, index) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Each slide has its own fade animation
    return (
      <Slide
        key={`slide_${index}`}
        source={imgSrc}
        fadeAnim={fadeAnim}
      />
    );
  });





  return (
    <Animated.View style={[styles.container, { opacity: fadeOutAnim }]}>
      <Swiper loop={false}>
       <View style={styles.slide}>
          <Image source={require('../assets/1.png')} style={styles.fullImage} />
          <Animated.Text style={{ ...styles.swipeText, opacity: fadeAnim }}>Swipe to see more</Animated.Text>
        </View>
         <View style={styles.slide}>
          <Image source={require('../assets/2.png')} style={styles.fullImage} />
          <Animated.Text style={{ ...styles.swipeText, opacity: fadeAnim }}>Swipe to see more</Animated.Text>
        </View>
         <View style={styles.slide}>
          <Image source={require('../assets/3.png')} style={styles.fullImage} />
          <Animated.Text style={{ ...styles.swipeText, opacity: fadeAnim }}>Swipe to see more</Animated.Text>
        </View>

         <View style={styles.slide}>
          <Image source={require('../assets/4.png')} style={styles.fullImage} />
          <Animated.Text style={{ ...styles.swipeText, opacity: fadeAnim }}>Swipe to see more</Animated.Text>
        </View>

         <View style={styles.slide}>
          <Image source={require('../assets/5.png')} style={styles.fullImage} />
          <Animated.Text style={{ ...styles.swipeText, opacity: fadeAnim }}>Swipe to see more</Animated.Text>
        </View>

         <View style={styles.slide}>
          <Image source={require('../assets/6.png')} style={styles.fullImage} />
          <Animated.Text style={{ ...styles.swipeText, opacity: fadeAnim }}>Swipe to see more</Animated.Text>
        </View>
         <View style={styles.slide}>
          <Image source={require('../assets/7.png')} style={styles.fullImage} />
          <Animated.Text style={{ ...styles.swipeText, opacity: fadeAnim }}>Swipe to see more</Animated.Text>
        </View>

       <View style={styles.slide}>
          <Image source={require('../assets/8.png')} style={styles.fullImage} />
          <Animated.Text style={{ ...styles.swipeText, opacity: fadeAnim }}>Swipe to see more</Animated.Text>
        </View>  



    <View style={styles.slide}>
          <Image source={require('../assets/9.png')} style={styles.fullImage} />
      <Animated.View
            style={[
              styles.radioWave,
              {
                transform: [{ scale: radioWaveAnim }],
                opacity: radioWaveAnim.interpolate({
                  inputRange: [1, 2],
                  outputRange: [0.5, 0]
                }),
              }
            ]}
          />
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BF8A1F', // Set your preferred background color
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    backgroundColor: '#F7B329', // Vibrant orange from your color scheme
    width: 60, // Width of the circular button
    height: 60, // Height of the circular button
    borderRadius: 30, // Half of width/height to make it circular
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center', // Center the button
    bottom: 100
  },
 buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
    radioWave: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(247,179,41, 0.3)',
    bottom: 85, // Position it behind the button
    alignSelf: 'center', // Center the wave
    zIndex: -1, // Ensure it's behind the button
  },
});

export default TutorialSwiper;
