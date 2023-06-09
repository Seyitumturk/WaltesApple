import React, { useState, useEffect,useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
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
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const [pulseAnim, setPulseAnim] = useState(new Animated.Value(0));
  const [pulsePosition, setPulsePosition] = useState({ x: '50%', y: '75%' });

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
      setShouldRoll(true);
    }
  };

  const onDiceRolled = (dice) => {
    setIsDiceRolling(false);
    const score = calculateScore(dice);
  

    // Don't switch turns if the player scores
    if (score === 0) {
      setPlayerTurn((playerTurn + 1) % 2);
    }
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
      setScores(prevScores => {
        const newScores = [...prevScores];
        newScores[playerTurn] += score;
        return newScores;
      });
    }
  
    setWaltesTimeout(setTimeout(() => setWaltesText(''), 1000));
    return score;
  };
  

  useEffect(() => {
    Animated.timing(translateYAnim, {
      toValue: playerTurn === 0 ? 1 : -1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [playerTurn]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1, // Run the animation indefinitely
      }
    ).start();
  }, [playerTurn]);
  

  const tossTextPosition = translateYAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [screenHeight / 4, -screenHeight / 4],
  });
  
  const tossTextRotation = translateYAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  

  let transforms = [
    {
      scale: pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2],
      }),
    },
  ];
  
  if (playerTurn === 1) {
    transforms.push({ rotate: '180deg' });
  }
  return (
    <View style={styles.container}>
      <BackgroundVideo />
      {currentPage === 'home' && <HomePage onStartGame={startGame} />}
      {currentPage === 'game' && (
        <>

        
<Animated.View
  style={[
    styles.pulse,
    {
      transform: [
        {
          scale: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2],
          }),
        },
      ],
      top: playerTurn === 0 ? 0 : '50%', // If it's player 1's turn, show on top half, else on bottom half
      height: '50%', // Cover half of the screen
      width: '100%', // Cover the full width
    },
  ]}
/>

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
  backgroundColor: 'rgba(255,165,0,0.5)', // Change this color to match your design
},


});