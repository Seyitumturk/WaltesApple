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
  } else if (marked === 5 || unmarked === 5) {
    setWaltesText('Waltes!');
    score = 1;
  } else {
    setWaltesText('');
  }

  if (score > 0) {
    // Update the player's sticks
    const currentPlayer = `player${playerTurn + 1}`;
    newSticks[currentPlayer].plain += 3 * score;
    newSticks.general.plain -= 3 * score; // Decrement plain sticks count in the general pile

    // Exchange 15 plain sticks for a notched stick, if available and if the player has enough sticks
    if (newSticks[currentPlayer].plain >= 15 && newSticks.general.notched > 0) {
      newSticks.general.notched--;
      newSticks[currentPlayer].notched++;
      newSticks[currentPlayer].plain -= 15;

      // Decrement total sticks count
      newSticks.general.totalSticks -= 15;
    }

    // Exchange 3 notched sticks for the kingpin, if available and if the player has enough notched sticks
    if (newSticks[currentPlayer].notched >= 3 && newSticks.general.kingPin > 0) {
      newSticks.general.kingPin--;
      newSticks[currentPlayer].kingPin++;
      newSticks[currentPlayer].notched -= 3;

      // Decrement total sticks count
      newSticks.general.totalSticks -= 9;
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
      {currentPage === 'home' && <HomePage onStartGame={startGame} />}
      {currentPage === 'game' && (
        <>
          <TouchableOpacity
      style={styles.topClickableArea}
      activeOpacity={1}
      onPress={() => handlePlayerClick(0)}
    />
    <WaltesBoard playerTurn={playerTurn} onDiceRolled={onDiceRolled} sticks={sticks} />
    <TouchableOpacity
      style={styles.bottomClickableArea}
      activeOpacity={1}
      onPress={() => handlePlayerClick(1)}
    />
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

container: {
  flex: 1,
  flexDirection: 'column',
},
topClickableArea: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the opacity as needed
   zIndex: 10
},
bottomClickableArea: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the opacity as needed
   zIndex: 10, 
},

});
