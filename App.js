import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WaltesBoard from './components/WaltesBoard';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <WaltesBoard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
