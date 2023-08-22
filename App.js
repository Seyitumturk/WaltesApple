import React, { useState, useEffect,useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import BackgroundVideo from './components/BackgroundVideo';
import WaltesBoard from './components/WaltesBoard';
import HomePage from './components/HomePage';

export default function App() {
  const [playerTurn, setPlayerTurn] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [currentPage, setCurrentPage] = useState('home');
  const [waltesText, setWaltesText] = useState('');
  const [waltesTimeout, setWaltesTimeout] = useState(null);
  const [shouldRoll, setShouldRoll] = useState(false);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const translateYAnim = useRef(new Animated.Value(0)).current;
  

  const [score, setScore] = useState(0); // add this line

  const [prevPlayerTurn, setPrevPlayerTurn] = useState(null);
  const playerTurnRef = useRef(playerTurn)

  const [isWaltesVisible, setIsWaltesVisible] = useState(false);
  
  

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
    if (player === playerTurn && !isDiceRolling) {
      setPrevPlayerTurn(playerTurn);
      setShouldRoll(true);
    }
  };


  const onDiceRolled = (dice) => {
    setIsDiceRolling(false);
    const score = calculateScore(dice);

    // Don't switch turns if the player scores
    if (score === 0) {
      setPlayerTurn((playerTurn + 1) % 2);
    } else {
      if (score > 0) {
        setWaltesText(score === 5 ? 'Super Waltes' : 'Waltes');
      }
      playerTurnRef.current = prevPlayerTurn; // This line might not be necessary since the player doesn't switch turns.
    }
    return score
  };

  // Call this function wherever you update the score, passing the player and score as parameters.
  
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
    
    // If player scores 

    if (score > 0) {

      setScore(score);

 
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
      setScores(prevScores => {
        const newScores = [...prevScores];
        newScores[playerTurn] += score;
        return newScores;
      });
    }
  
    setWaltesTimeout(setTimeout(() => setWaltesText(''), 1000));
    return score;

  };


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
            disabled={playerTurn !== 0 || isDiceRolling} // Disable the button when it's not the player's turn or when the dice are rolling
          />
          <WaltesBoard 
            playerTurn={playerTurn} 
            onDiceRolled={onDiceRolled} 
            sticks={sticks} 
            shouldRoll={shouldRoll} 
            setShouldRoll={setShouldRoll} 
            setIsDiceRolling={setIsDiceRolling} 
            isDiceRolling={isDiceRolling} // Pass isDiceRolling as a prop to the WaltesBoard component
          />
          <TouchableOpacity
            style={styles.bottomClickableArea}
            activeOpacity={1}
            onPress={() => handlePlayerClick(1)}
            disabled={playerTurn !== 1 || isDiceRolling} // Disable the button when it's not the player's turn or when the dice are rolling
          />

          {isWaltesVisible && (
            <Animated.Text
              style={[
                styles.waltesText,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              {waltesText}
            </Animated.Text>
          )}
          
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '50%',
  zIndex: 10,
},
bottomClickableArea: {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: '50%',
  zIndex: 10, 
},
tossText: {
  fontSize: 32,
  fontWeight: 'bold',
  color: 'orange', // This is a hex code for brown
  position: 'absolute',
  top: '50%',
  left: '50%',
  zIndex: 999,
  width: '100%',
  textAlign: 'center',
  fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',

},

pulse: {
  position: 'absolute',
  backgroundColor: 'black', // Change this color to match your design
  opacity: 0.2, 
},


});