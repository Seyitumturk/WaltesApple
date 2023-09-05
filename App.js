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
  const [showExhaustedAlert, setShowExhaustedAlert] = useState(false);
  const hasClickedRef = useRef(false);


  
  //State to keep track of once the general pile is exhausted, to calculate the certain winning conditions. 
  const [successiveThrows, setSuccessiveThrows] = useState({ player1: 0, player2: 0 });
  //State to keep track of switching to "DEBT" System.  
  const [isGeneralPileExhausted, setIsGeneralPileExhausted] = useState(false);

  const [hasShownAlert, setHasShownAlert] = useState(false);
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
          tokenPile: 0,
          debts: 0,

        },
        player2: {
          plain: 0,
          notched: 0,
          kingPin: 0,
          tokenPile: 0,
          debts: 0,

        },
});

const startGame = () => {
    setCurrentPage('game');
  };

  const handlePlayerClick = (player) => {
    if (player === playerTurn && !isDiceRolling && !hasClickedRef.current) {
      hasClickedRef.current = true;
      setPrevPlayerTurn(playerTurn);
      setShouldRoll(true);
    }
  };
  
  useEffect(() => {
    if (isGeneralPileExhausted) {
      setShowExhaustedAlert(true);
      const timer = setTimeout(() => {
        setShowExhaustedAlert(false);
      }, 3000);
      return () => clearTimeout(timer);  // Clear the timeout if the component unmounts
    }
  }, [isGeneralPileExhausted]);
  
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
    hasClickedRef.current = false;  // Resetting hasClicked here
    return score
  };

  // Call this function wherever you update the score, passing the player and score as parameters.
  
  const calculateScore = (dice) => {
    const marked = dice.filter((die) => die === 1).length;
    const unmarked = 6 - marked;
    const newSticks = { ...sticks };
    let score = 0;
  
    const currentPlayer = `player${playerTurn + 1}`;
    const otherPlayer = `player${3 - (playerTurn + 1)}`; // Opponent
  
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
      if (newSticks.general.plain >= 3 * score) {
        newSticks[currentPlayer].plain += 3 * score;
        newSticks.general.plain -= 3 * score;
        setIsGeneralPileExhausted(false);
      } else {
        setIsGeneralPileExhausted(true);
  
        if (newSticks[otherPlayer].plain >= 3 * score) {
          newSticks[currentPlayer].plain += 3 * score;
          newSticks[otherPlayer].plain -= 3 * score;
        } else {
          newSticks[currentPlayer].plain += newSticks[otherPlayer].plain;
          newSticks[otherPlayer].plain = 0;
          // Additional logic if opponent's pile is emptied
        }
      }
  
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[playerTurn] += score;
        return newScores;
      });
    }
  
    setSticks(newSticks);
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
        >
          {showExhaustedAlert && (
            <View style={styles.alertBox}>
              <Text style={[styles.alertText, {transform: [{rotate: '180deg'}]}]}>General Pile is Exhausted, Debt Mode</Text>
            </View>
          )}
        </TouchableOpacity>

          <WaltesBoard 
            player1TotalScore={scores[0]}
            player2TotalScore={scores[1]}
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
            disabled={playerTurn !== 1 || isDiceRolling}
          >
            {showExhaustedAlert && (
              <View style={styles.alertBox}>
                <Text style={[styles.alertText, {transform: [{rotate: '180deg'}]}]}>General Pile is Exhausted, Debt Mode</Text>
              </View>
            )}
          </TouchableOpacity>

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
  alertBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center', // Center children vertically
    alignItems: 'center', // Center children horizontally
    backgroundColor: 'rgba(0,0,0,0.5)' // Example background color
  },
  alertText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff' // Example text color
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