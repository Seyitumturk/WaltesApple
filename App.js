import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WaltesBoard from './components/WaltesBoard';

export default function App() {
  const [playerTurn, setPlayerTurn] = React.useState(0);
  const [scores, setScores] = React.useState([0, 0]);

  const handlePlayerClick = (player) => {
    setPlayerTurn((player + 1) % 2);
  };

  const onDiceRolled = (dice) => {
    const newScores = [...scores];
    newScores[playerTurn] += calculateScore(dice);
    setScores(newScores);
  };

  const calculateScore = (dice) => {
    const marked = dice.filter((die) => die === 1).length;
    const unmarked = 6 - marked;

    if (marked === 6 || unmarked === 6) {
      return 5;
    } else if (marked === 5 || unmarked === 5) {
      return 1;
    } else {
      return 0;
    }
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
      >
        <Text style={[styles.scoreText, { transform: [{ rotate: '180deg' }] }]}>
          Player 1: {scores[0]}
        </Text>
      </TouchableOpacity>
      <WaltesBoard playerTurn={playerTurn} onDiceRolled={onDiceRolled} />
      <TouchableOpacity
        style={[
          styles.background,
          playerTurn === 1 ? styles.activePlayerBackground : {},
        ]}
        activeOpacity={1}
        onPress={() => handlePlayerClick(1)}
      >
        <Text style={styles.scoreText}>Player 2: {scores[1]}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  activePlayerBackground: {
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  scoreText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
  },
});
