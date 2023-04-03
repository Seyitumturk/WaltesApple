import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackgroundVideo from './components/BackgroundVideo';
import WaltesBoard from './components/WaltesBoard';
import HomePage from './components/HomePage';

export default function App() {
  const [playerTurn, setPlayerTurn] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [currentPage, setCurrentPage] = useState('home');
  const [waltesText, setWaltesText] = useState('');
  const [waltesTimeout, setWaltesTimeout] = useState(null);
  const [sticks, setSticks] = useState({
        general: {
          plain: 51,
          notched: 3,
          kingPin: 1,
        },
        player1: {
          plain: 0,
          notched: 0,
          kingPin: 0,
        },
        player2: {
          plain: 0,
          notched: 0,
          kingPin: 0,
        },
});

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

  const newSticks = { ...sticks };
  let score = 0;

  if (marked === 6 || unmarked === 6) {
    setWaltesText('Super Waltes!');
    score = 5;
    if (newSticks.general.kingPin > 0) {
      newSticks.general.kingPin--;
    } else {
      newSticks.general.plain -= 5 * 3;
    }
  } else if (marked === 5 || unmarked === 5) {
    setWaltesText('Waltes!');
    score = 1;
    if (newSticks.general.notched > 0) {
      newSticks.general.notched--;
    } else {
      newSticks.general.plain -= 3;
    }
  } else {
    setWaltesText('');
  }

  if (score > 0) {
    newSticks.general.plain = Math.max(newSticks.general.plain, 0);
    setSticks(newSticks);

    // Update the player's sticks
    const currentPlayer = `player${playerTurn + 1}`;
    newSticks[currentPlayer].plain += 3 * score;
    if (score === 5 && sticks.general.kingPin > 0) {
      newSticks[currentPlayer].kingPin++;
    } else if (score === 1 && sticks.general.notched > 0) {
      newSticks[currentPlayer].notched++;
    }

    // Update the scores
    const newScores = [...scores];
    newScores[playerTurn] += score;
    setScores(newScores);
  }

  setWaltesTimeout(setTimeout(() => setWaltesText(''), 1000));
  return score;
};



  useEffect(() => {
    return () => {
      if (waltesTimeout) clearTimeout(waltesTimeout);
    };
  }, [waltesTimeout]);

  return (
    <View style={styles.container}>
      <BackgroundVideo />
      <StatusBar hidden />
      {currentPage === 'home' && <HomePage onStartGame={startGame} />}
      {currentPage === 'game' && (
        <>
          <TouchableOpacity
            style={styles.background}
            activeOpacity={1}
            onPress={() => handlePlayerClick(0)}
          >
            <Text style={[styles.scoreText, styles.scoreTextPlayer1, { transform: [{ rotate: '180deg' }] }]}>
              {scores[1]}
            </Text>
          </TouchableOpacity>
          <WaltesBoard playerTurn={playerTurn} onDiceRolled={onDiceRolled} sticks={sticks} />
          <TouchableOpacity
            style={styles.background}
            activeOpacity={1}
            onPress={() => handlePlayerClick(1)}
          >
            <Text style={[styles.scoreText, styles.scoreTextPlayer2]}>
              {scores[0]}
            </Text>
          </TouchableOpacity>
          <Text style={styles.waltesText}>{waltesText}</Text>
        </>
      )}
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
  },
  scoreText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
  },
  scoreTextPlayer1: {
    alignSelf: 'center',
  },
  scoreTextPlayer2: {
    alignSelf: 'center',
  },
  waltesText: {
    position: 'absolute',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});
