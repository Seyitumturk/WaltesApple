import React, { useState, useEffect, useRef } from 'react';
import { AppRegistry, Modal, Dimensions, StyleSheet, Text, TouchableOpacity, View, Animated, Easing, Alert, Platform } from 'react-native';
import BackgroundVideo from './components/BackgroundVideo';
import WaltesBoard from './components/WaltesBoard';
import HomePage from './components/HomePage';
import TutorialSwiper from './components/TutorialSwiper'; // Import the TutorialSwiper component


const CustomAlert = ({ visible, message, buttons, shouldRotate }) => {
  if (!visible) return null;

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.centeredView}>
        <View style={[styles.modalView, shouldRotate ? styles.rotated : null]}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity key={index} style={[styles.button, styles.darkerButton]} onPress={button.onPress}>
                <Text style={styles.textStyle}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};



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
  const [showKingPinAlert, setShowKingPinAlert] = useState(false);
  const [nextRollForKingPin, setNextRollForKingPin] = useState(false);
  const currentPlayer = `player${playerTurn + 1}`; // Assuming playerTurn is 0 or 1

  const [kingPinWon, setKingPinWon] = useState(false);


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [alertButtons, setAlertButtons] = useState([]);

  const [scoringPlayer, setScoringPlayer] = useState(null);


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
  const triggerAlertForExchange = (currentPlayer) => {
    const shouldRotate = currentPlayer === 'player1'; // Adjust according to your player logic
    setTimeout(() => {
      showCustomAlert(
        'Do you want to replace 15 normal sticks with a notched stick?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              setAlertVisible(false); // Close the modal
              // Handle Cancel action
            }
          },
          {
            text: 'Yes',
            onPress: () => {
              // Implement the exchange logic here
              const newSticks = { ...sticks };
              newSticks[currentPlayer].plain -= 15;
              newSticks[currentPlayer].notched += 1;
              newSticks.general.notched -= 1;
              newSticks.general.plain += 15;
              setSticks(newSticks);

              setAlertVisible(false); // Close the modal
            },
          },
        ],
        shouldRotate
      );
    }, 1000); // 2000 milliseconds delay
  };


  const showCustomAlert = (message, buttons = []) => {
    setAlertMessage(message);
    setAlertButtons(buttons);
    setAlertVisible(true);

  };

  const checkKingPinCondition = () => {
    // Check if only the King Pin is left and alert has not been shown
    if (!hasShownAlert && sticks.general.kingPin === 1 && sticks.general.plain === 0 && sticks.general.notched === 0) {
      showCustomAlert("Only King Pin left. First one to score in the next roll gets it.");
      setNextRollForKingPin(true); // Corrected this line
      setHasShownAlert(true); // Mark that the alert has been shown

      const timer = setTimeout(() => {
        setShowKingPinAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Check if King Pin has been won and general pile is exhausted
    if (sticks.general.kingPin === 0 && sticks.general.plain === 0 && sticks.general.notched === 0) {
      showCustomAlert("General pile is exhausted", [
        {
          text: 'OK',
          onPress: () => setAlertVisible(false),
        },
      ]);

      // Optionally handle notched stick replacement here
      if (sticks.general.notched > 0) {
        handleNotchedReplacement();
      }
    }
  };


  const startGame = () => {
    setCurrentPage('tutorial'); // Start with the tutorial
  };

  const onTutorialFinished = () => {
    setCurrentPage('game'); // Change to the game page
  };
  const handlePlayerClick = (player) => {
    if (player === playerTurn && !isDiceRolling && !hasClickedRef.current) {
      hasClickedRef.current = true;
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
      setScoringPlayer(null);

    } else {
      if (score > 0) {
        // Update the scoring player based on the current playerTurn
        const scoringPlayerId = `player${playerTurn + 1}`;
        setScoringPlayer(scoringPlayerId); // Update the scoring player state
        setWaltesText(score === 5 ? 'Super Waltes' : 'Waltes'); // Update the Waltes text state
        // Other logic remains the same
      }
    }
    hasClickedRef.current = false;  // Resetting hasClicked here
    return score
  };


  const handleNotchedReplacement = () => {
    let newSticks = { ...sticks };
    let notchedSticksRemaining = sticks.general.notched;

    while (notchedSticksRemaining > 0) {
      const eligiblePlayers = ["player1", "player2"].filter((player) => {
        return newSticks[player].plain >= 15;
      });

      if (eligiblePlayers.length === 0) {
        // No player is eligible for a notched stick
        break;
      }

      let selectedPlayer = null;

      if (eligiblePlayers.length === 1) {
        // Only one player is eligible
        selectedPlayer = eligiblePlayers[0];
      } else {
        // Both players are eligible, randomly select one
        selectedPlayer = eligiblePlayers[Math.floor(Math.random() * 2)];
      }

      // Exchange 15 plain sticks for 1 notched stick
      newSticks[selectedPlayer].plain -= 15;
      newSticks[selectedPlayer].notched += 1;
      notchedSticksRemaining -= 1;
      newSticks.general.notched -= 1;
      newSticks.general.plain += 15;
    }

    setSticks(newSticks);
  };



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
        // This block is modified
        setIsGeneralPileExhausted(true);

        // Add the remaining sticks from the general pile to the current player
        newSticks[currentPlayer].plain += newSticks.general.plain;

        // Calculate the sticks still needed for the score
        const debtSticks = 3 * score - newSticks.general.plain;

        // Set general pile to 0 since we've taken all remaining sticks
        newSticks.general.plain = 0;

        // Proceed to deduct the remaining required sticks from the opponent
        if (newSticks[otherPlayer].plain >= debtSticks) {
          newSticks[currentPlayer].plain += debtSticks;
          newSticks[otherPlayer].plain -= debtSticks;
        } else {
          newSticks[currentPlayer].plain += newSticks[otherPlayer].plain;
          newSticks[otherPlayer].plain = 0;
        }

        if (nextRollForKingPin) {
          // This means this roll was the 'next' roll that could win the King Pin
          // so we perform the assignment
          newSticks[currentPlayer].kingPin += 1;
          newSticks.general.kingPin -= 1;
          setNextRollForKingPin(false);  // Reset the state
          Alert.alert("Congrats", `${currentPlayer} got the King Pin!`);
        }
      }

      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[playerTurn] += score;
        return newScores;
      });

      if (newSticks[currentPlayer].plain >= 15) {
        if (newSticks.general.notched > 0) {
          triggerAlertForExchange(currentPlayer);
        }
      }
    }
    setSticks(newSticks);  // set the new stick state
    checkKingPinCondition(); // check for King Pin condition here
    setWaltesTimeout(setTimeout(() => setWaltesText(''), 1000));

    return score;
  };

  return (
    <View style={styles.container}>


      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        shouldRotate={currentPlayer === 'player1'} // Rotate for player1
        buttons={alertButtons}

      />
      <BackgroundVideo />

      {currentPage === 'home' && <HomePage onStartGame={startGame} />}

      {currentPage === 'tutorial' && <TutorialSwiper onFinished={onTutorialFinished} />}

      {currentPage === 'game' && (
        <>
          <TouchableOpacity
            style={styles.topClickableArea}
            activeOpacity={1}
            onPress={() => handlePlayerClick(0)}
            disabled={playerTurn !== 0 || isDiceRolling}
          >
            {showExhaustedAlert && (
              <View style={styles.alertBox}>
                <Text style={[styles.alertText, { transform: [{ rotate: '180deg' }] }]}>General Pile is Exhausted, Debt Mode</Text>
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
            isDiceRolling={isDiceRolling}
            scoringPlayer={scoringPlayer}
            waltesText={waltesText}

          />
          <TouchableOpacity
            style={styles.bottomClickableArea}
            activeOpacity={1}
            onPress={() => handlePlayerClick(1)}
            disabled={playerTurn !== 1 || isDiceRolling}
          >
            {showExhaustedAlert && (
              <View style={styles.alertBox}>
                <Text style={[styles.alertText, { transform: [{ rotate: '180deg' }] }]}>General Pile is Exhausted, Debt Mode</Text>
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



  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalView: {
    backgroundColor: 'orange',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  rotated: {
    transform: [{ rotate: '180deg' }]
  },
  buttonContainer: {
    flexDirection: 'row', // Place buttons next to each other
    justifyContent: 'center'
  },
  darkerButton: {
    backgroundColor: 'darkorange', // Darker orange color
    borderRadius: 10, // Rounded borders
    marginLeft: 5, // Add some space between buttons
    marginRight: 5
  },
});