import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackgroundVideo from './components/BackgroundVideo';
import WaltesBoard from './components/WaltesBoard';
import HomePage from './components/HomePage'; // Import the HomePage component

export default function App() {
  const [playerTurn, setPlayerTurn] = React.useState(0);
  const [scores, setScores] = React.useState([0, 0]);
  const [currentPage, setCurrentPage] = React.useState('home'); // Add a state to manage the current page

  const startGame = () => {
    setCurrentPage('game');
  };


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
      <BackgroundVideo />
      <StatusBar hidden />
      <TouchableOpacity
        style={styles.background}
        activeOpacity={1}
        onPress={() => handlePlayerClick(0)}
      >
        <Text style={[styles.scoreText, { transform: [{ rotate: '180deg' }] }]}>
           {scores[1]}
        </Text>
        {playerTurn === 0 && (
          <Text style={styles.hitText}>Hit!</Text>
        )}
      </TouchableOpacity>
      <WaltesBoard playerTurn={playerTurn} onDiceRolled={onDiceRolled} />
      <TouchableOpacity
        style={styles.background}
        activeOpacity={1}
        onPress={() => handlePlayerClick(1)}
      >
        <Text style={styles.scoreText}> {scores[0]}</Text>
        {playerTurn === 1 && (
          <Text style={styles.hitText}>Hit!</Text>
        )}
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
  scoreText: {
    fontSize: 54,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Chalkduster', // Choose a font according to your preference

  },
  hitText: {
    fontSize: 36,
    textAlign: 'center',
    fontFamily: 'Chalkduster', // Choose a font according to your preference
    color: 'orange',
  },
});
