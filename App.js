import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import WaltesBoard from './components/WaltesBoard';
import { ShakeEventExpo } from './components/ShakeEventExpo';

export default function App() {
  const [playerTurn, setPlayerTurn] = React.useState(0);

  React.useEffect(() => {
    ShakeEventExpo.addListener(() => {
      handlePlayerClick(playerTurn);
    });

    return () => {
      ShakeEventExpo.removeListener();
    };
  }, [playerTurn]);

  const handlePlayerClick = (player) => {
    setPlayerTurn((player + 1) % 2);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <TouchableOpacity
        style={[
          styles.background,
          playerTurn === 0 ? styles.activePlayerBackground : {},
        ]}
        activeOpacity={1}
        onPress={() => handlePlayerClick(0)}
      />
      <WaltesBoard playerTurn={playerTurn} />
      <TouchableOpacity
        style={[
          styles.background,
          playerTurn === 1 ? styles.activePlayerBackground : {},
        ]}
        activeOpacity={1}
        onPress={() => handlePlayerClick(1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  background: {
    flex: 1,
  },
  activePlayerBackground: {
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
});
