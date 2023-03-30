import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Video, Audio } from 'expo-av';

const HomePage = ({ onStartGame }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    if (isPlaying) {
      await sound.stopAsync();
      setIsPlaying(false);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/background-music.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/homepage-video.mp4')}
        style={styles.backgroundVideo}
        rate={1.0}
        volume={0}
        isMuted
        resizeMode="cover"
        shouldPlay
        isLooping
      />
      <Text style={styles.title}>The Game of Waltes!</Text>
      <TouchableOpacity style={styles.button} onPress={onStartGame}>
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.musicButton}
        onPress={togglePlayback}
      >
        <Text style={styles.musicButtonText}>{isPlaying ? 'Music Off' : 'Music On'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '10%',
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    transform: [{ scale: 1.14 }],
  },
  title: {
    textAlign: "center",
    fontSize: 48,
    color: 'white',
    fontFamily: 'Chalkduster',
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'orange',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 10,
    marginTop: 40,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Chalkduster',
  },
  musicButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  musicButtonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Chalkduster',
  },
});

export default HomePage;
