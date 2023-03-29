// components/HomePage.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomePage({ onStartGame }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waltes Game</Text>
      <TouchableOpacity style={styles.button} onPress={onStartGame}>
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
  },
});
