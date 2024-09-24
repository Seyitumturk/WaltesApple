import React, { useState, useEffect, useRef } from 'react';
import {
  AppRegistry,
  Modal,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Image, // Ensure Image is imported from 'react-native'
  Alert,
  Platform
} from 'react-native';
import BackgroundVideo from './components/BackgroundVideo';
import WaltesBoard from './components/WaltesBoard';
import HomePage from './components/HomePage';
import TutorialSwiper from './components/TutorialSwiper'; // Import the TutorialSwiper component
import stickReplacementGif from './assets/switch.gif'; // Adjust the path as necessary
import { knowledgeNuggets } from './components/knowledgeNuggets';

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
  const [showReplacementGif, setShowReplacementGif] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState([]);
  const [scoringPlayer, setScoringPlayer] = useState(null);
  const [debt, setDebt] = useState({ player1: 0, player2: 0 });
  const [showTutorial, setShowTutorial] = useState(false);

  // State to keep track of once the general pile is exhausted, to calculate the certain winning conditions.
  const [successiveThrows, setSuccessiveThrows] = useState({ player1: 0, player2: 0 });
  // State to keep track of switching to "DEBT" System.
  const [isGeneralPileExhausted, setIsGeneralPileExhausted] = useState(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const [score, setScore] = useState(0); // add this line
  const [prevPlayerTurn, setPrevPlayerTurn] = useState(null);
  const playerTurnRef = useRef(playerTurn);
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
      notchedValue: 15, // Assuming each notched stick starts with a value of 15
    },
    player2: {
      plain: 0,
      notched: 0,
      kingPin: 0,
      notchedValue: 15, // Assuming each notched stick starts with a value of 15
    },
  });
  const [replacementMessage, setReplacementMessage] = useState(''); // <-- New State
  const [totalPoints, setTotalPoints] = useState(0);
  const [unlockedNuggets, setUnlockedNuggets] = useState([]);

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

  const showCustomAlert = (message, buttons = [], shouldRotate) => {
    setAlertMessage(message);
    setAlertVisible(true);

    // Update buttons to include closing the alert
    const updatedButtons = buttons.map(button => ({
      ...button,
      onPress: () => {
        button.onPress?.();
        setAlertVisible(false); // Ensure the alert is closed after the button is pressed
      }
    }));

    setAlertButtons(updatedButtons);
  };




  const checkKingPinCondition = () => {
    if (sticks.general.kingPin === 1 && sticks.general.plain === 0 && sticks.general.notched === 0) {
      setNextRollForKingPin(true); // Next score wins the kingpin
      if (!hasShownAlert) {
        setHasShownAlert(true); // Set this to true to ensure only one alert is shown
        showCustomAlert("Only King Pin left. First one to score in the next roll gets it.", [
          {
            text: 'OK',
            onPress: () => {
              setAlertVisible(false);
              setHasShownAlert(true);
            }
          }
        ]);
      }
    }
  };


  // Ensure debt mode is only activated after King Pin is won
  useEffect(() => {
    if (sticks.general.kingPin === 0 && !isGeneralPileExhausted) {
      setIsGeneralPileExhausted(true);
    }
  }, [sticks.general.kingPin]);

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
    updatePoints(score);

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
    return score;
  };

  const updatePoints = (score) => {
    const newTotalPoints = totalPoints + score;
    setTotalPoints(newTotalPoints);

    // Check for newly unlocked nuggets
    const newUnlockedNuggets = knowledgeNuggets.filter(
      nugget => nugget.pointsToUnlock <= newTotalPoints && !unlockedNuggets.includes(nugget.id)
    );

    if (newUnlockedNuggets.length > 0) {
      setUnlockedNuggets([...unlockedNuggets, ...newUnlockedNuggets.map(nugget => nugget.id)]);
      // Show an alert or some notification about newly unlocked nuggets
      showCustomAlert(`You've unlocked ${newUnlockedNuggets.length} new knowledge nugget(s)!`, [
        {
          text: 'View',
          onPress: () => setCurrentPage('nuggets')
        },
        {
          text: 'Continue Playing',
          onPress: () => setAlertVisible(false)
        }
      ]);
    }
  };

  // This function handles the notched stick replacement automatically
  const handleNotchedReplacement = (currentPlayer) => {
    let newSticks = { ...sticks };
    if (newSticks[currentPlayer].plain >= 15 && newSticks.general.notched > 0) {
      newSticks[currentPlayer].plain -= 15;
      newSticks[currentPlayer].notched++;
      newSticks.general.notched--;
      newSticks.general.plain += 15;
      setSticks(newSticks);
      setReplacementMessage('15 plain sticks are swapped with 1 notched stick'); // <-- Set the message

      setTimeout(() => setReplacementMessage(''), 3000); // Clear the message after 3 seconds
    }
  };
  const handleDebtPayment = (askingPlayer) => {
    const otherPlayer = askingPlayer === 'player1' ? 'player2' : 'player1';
    let newSticks = { ...sticks };
    let debtAmount = debt[askingPlayer];

    // Use plain sticks first
    if (newSticks[otherPlayer].plain >= debtAmount) {
      newSticks[otherPlayer].plain -= debtAmount;
      newSticks[askingPlayer].plain += debtAmount;
      debtAmount = 0;
    } else {
      debtAmount -= newSticks[otherPlayer].plain;
      newSticks[askingPlayer].plain += newSticks[otherPlayer].plain;
      newSticks[otherPlayer].plain = 0;
    }

    // Use notched sticks if there's still debt to settle
    while (debtAmount > 0 && newSticks[otherPlayer].notched > 0) {
      newSticks[otherPlayer].notched -= 1;
      newSticks[askingPlayer].notched += 1;

      // Transfer 15 plain sticks equivalent for the notched stick
      let plainSticksFromNotched = 15;

      // Transfer plain sticks from other player to cover the notched stick transfer
      if (newSticks[otherPlayer].plain >= plainSticksFromNotched) {
        newSticks[otherPlayer].plain -= plainSticksFromNotched;
        newSticks[askingPlayer].plain += plainSticksFromNotched;
      } else {
        newSticks[askingPlayer].plain += newSticks[otherPlayer].plain;
        plainSticksFromNotched -= newSticks[otherPlayer].plain;
        newSticks[otherPlayer].plain = 0;
      }

      // Adjust the debt amount based on the transfer
      debtAmount -= 15;

      // If the debtAmount becomes negative, it means there is excess plain sticks
      if (debtAmount < 0) {
        let excessPlainSticks = -debtAmount;
        debtAmount = 0;

        // Return excess plain sticks to the opponent
        if (newSticks[askingPlayer].plain >= excessPlainSticks) {
          newSticks[askingPlayer].plain -= excessPlainSticks;
          newSticks[otherPlayer].plain += excessPlainSticks;
        } else {
          newSticks[otherPlayer].plain += newSticks[askingPlayer].plain;
          newSticks[askingPlayer].plain = 0;
        }
      }
    }

    // Ensure plain sticks do not exceed the maximum count
    if (newSticks[askingPlayer].plain > 51) {
      newSticks[askingPlayer].plain = 51;
    }

    // Check if the other player is out of sticks
    if (newSticks[otherPlayer].plain === 0 && newSticks[otherPlayer].notched === 0 && newSticks[otherPlayer].kingPin === 0) {
      showGameOverAlert(`${askingPlayer} wins the game as ${otherPlayer} cannot pay the debt!`);
      return;
    }

    const newDebt = { ...debt };
    newDebt[askingPlayer] = debtAmount > 0 ? debtAmount : 0;
    setDebt(newDebt);
    setSticks(newSticks);
  };

  const triggerReplacementAnimation = () => {
    // Highlight the notched and plain sticks
    Animated.sequence([
      Animated.timing(highlightAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(highlightAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Initialize the highlight animation value
  const highlightAnim = useRef(new Animated.Value(0)).current;

  const CircularButton = ({ type, count, notchedValue, showNotchedValue }) => {
    const [animatedCount, animateCount, animatedValue] = useCountAnimation(count);

    useEffect(() => {
      if (count !== animatedCount) {
        animateCount(count);
      }
    }, [count]);

    const animatedStyle = {
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.5],
          }),
        },
      ],
      backgroundColor: highlightAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', 'yellow'],
      }),
    };

    const icons = {
      plain: plainStickIcon,
      notched: notchedStickIcon,
      kingPin: kingPinIcon,
    };

    const styles = StyleSheet.create({
      icon: {
        width: 60, // adjust the size as needed
        height: 75, // adjust the size as needed
      },
      button: {
        marginHorizontal: 10, // Added margin
      },
      countText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
      },
    });

    return (
      <View style={styles.button}>
        <Animated.Image source={icons[type]} style={[styles.icon, animatedStyle]} resizeMode="contain" />
        <Animated.Text style={[styles.countText, animatedStyle]}>
          {type === 'notched' && showNotchedValue ? `${animatedCount}/${notchedValue * count}` : animatedCount}
        </Animated.Text>
      </View>
    );
  };
  const calculateScore = (dice) => {
    const marked = dice.filter((die) => die === 1).length;
    const unmarked = 6 - marked;
    let score = 0;

    const currentPlayer = `player${playerTurn + 1}`;
    let newSticks = { ...sticks };

    if (marked === 6 || unmarked === 6) {
      setWaltesText('Super Waltes!');
      score = 5;
    } else if (marked === 5 || unmarked === 5) {
      setWaltesText('Waltes!');
      score = 1;
    } else {
      setWaltesText('');
    }

    if (nextRollForKingPin && score > 0) {
      newSticks[currentPlayer].kingPin++;
      newSticks.general.kingPin--;
      setNextRollForKingPin(false);

      showCustomAlert(`Congrats, ${currentPlayer} got the King Pin!`, [
        { text: 'OK', onPress: () => console.log('King Pin Acknowledged') }
      ]);

      if (newSticks.general.kingPin === 0) {
        setIsGeneralPileExhausted(true);
      }

      setSticks(newSticks);
      return score;
    }

    if (score > 0) {
      if (!isGeneralPileExhausted) {
        let requiredPlainSticks = 3 * score;
        let availablePlainSticks = Math.min(newSticks.general.plain, requiredPlainSticks);

        if (newSticks[currentPlayer].notchedValue < 15) {
          let neededForCompletion = 15 - newSticks[currentPlayer].notchedValue;
          let usedForCompletion = Math.min(availablePlainSticks, neededForCompletion);
          newSticks[currentPlayer].notchedValue += usedForCompletion;
          newSticks.general.plain -= usedForCompletion;
          availablePlainSticks -= usedForCompletion;
        }

        newSticks[currentPlayer].plain += availablePlainSticks;
        newSticks.general.plain -= availablePlainSticks;

        handleNotchedReplacement(currentPlayer);

        if (newSticks.general.plain === 0) {
          checkKingPinCondition();
        }

        if (newSticks[currentPlayer].plain >= 15 && newSticks.general.notched > 0) {
          newSticks[currentPlayer].plain -= 15;
          newSticks[currentPlayer].notched++;
          newSticks.general.notched--;
          newSticks.general.plain += 15;

          triggerReplacementAnimation();
        }
      } else {
        const newDebt = { ...debt };
        newDebt[currentPlayer] += score === 5 ? 15 : 3;
        setDebt(newDebt);
      }
    }

    setSticks(newSticks);
    setScores((prevScores) => {
      const newScores = [...prevScores];
      newScores[playerTurn] += score;
      return newScores;
    });

    setWaltesTimeout(setTimeout(() => setWaltesText(''), 1000));
    return score;
  };






  const showGameOverAlert = (message) => {
    showCustomAlert(message, [
      {
        text: 'OK',
        onPress: () => {
          setCurrentPage('home');
        },
      },
    ]);
  };

  // Debt mode stick handling
  const handleDebtMode = (newSticks, currentPlayer, otherPlayer, debtSticks) => {
    if (newSticks[otherPlayer].plain > 0) {
      let transfer = Math.min(debtSticks, newSticks[otherPlayer].plain);
      newSticks[otherPlayer].plain -= transfer;
      debtSticks -= transfer;
    }

    while (debtSticks > 0 && newSticks[otherPlayer].notched > 0) {
      let decrementValue = Math.min(debtSticks, newSticks[otherPlayer].notchedValue);
      newSticks[otherPlayer].notchedValue -= decrementValue;
      debtSticks -= decrementValue;

      if (newSticks[otherPlayer].notchedValue === 0) {
        newSticks[otherPlayer].notched -= 1;
        if (newSticks[otherPlayer].notched > 0) {
          newSticks[otherPlayer].notchedValue = 15;
        }
      }
    }

    if (debtSticks > 0) {
      showGameOverAlert(`${currentPlayer} wins the game as ${otherPlayer} cannot pay the debt!`);
      return;
    }

    let gainSticks = score === 5 ? 15 : 3;

    if (newSticks[currentPlayer].notchedValue < 15) {
      let neededForCompletion = 15 - newSticks[currentPlayer].notchedValue;
      let usedForCompletion = Math.min(gainSticks, neededForCompletion);
      newSticks[currentPlayer].notchedValue += usedForCompletion;
      gainSticks -= usedForCompletion;
    }

    newSticks[currentPlayer].plain += gainSticks;

    setSticks(newSticks);
  };


  // Call this function when notched sticks or king pin are transferred
  const triggerReplacementGif = () => {
    setShowReplacementGif(true);
    setTimeout(() => setShowReplacementGif(false), 5000); // Display the GIF for 5 seconds
  };

  const getTutorialText = (step) => {
    switch (step) {
      case 'scoreTracker':
        return "This is the score tracker. It shows the current score for both players.";
      case 'bowl':
        return "This is the bowl where the dice are tossed.";
      case 'player1Area':
        return "This is Player 1's area. It shows their personal pile and general pile.";
      case 'player2Area':
        return "This is Player 2's area. It shows their personal pile and general pile.";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        buttons={alertButtons}
        shouldRotate={currentPlayer === 'player1'} // Rotate for player1
      />
      <BackgroundVideo />

      {/* Help Button */}
      <TouchableOpacity style={styles.helpButton} onPress={() => setShowTutorial(true)}>
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>

      {showTutorial && (
        <View style={styles.fullScreenOverlay}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowTutorial(false)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <TutorialSwiper onFinished={() => setShowTutorial(false)} />
        </View>
      )}


      {currentPage === 'home' && <HomePage onStartGame={startGame} totalPoints={totalPoints} />}
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
            isGeneralPileExhausted={isGeneralPileExhausted}
            debt={debt}
            handleAskDebtPayment={handleDebtPayment}
            replacementMessage={replacementMessage}
            tutorialMode={showTutorial}
          />

          {showReplacementGif && (
            <View
              style={[
                styles.gifContainer,
                playerTurn === 0 ? styles.rotated : null
              ]}
            >
              <Animated.Image source={stickReplacementGif} style={styles.replacementGif} />
              <View style={styles.swapAlertBox}>
                <Text style={styles.swapAlertText}>You now have 15 plain sticks, replacing them with a notched stick.</Text>
              </View>
            </View>
          )}

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
      {currentPage === 'nuggets' && (
        <KnowledgeNuggets 
          unlockedNuggets={unlockedNuggets} 
          totalPoints={totalPoints}
          onBack={() => setCurrentPage('game')}
        />
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
  }, fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', // Semi-transparent background
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1001,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  helpButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
    backgroundColor: '#FFD700',
    borderRadius: 25,
    padding: 10,
  },
  helpButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
  },
  confettiGif: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gifContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 999999999999999,
    borderWidth: 2,
    borderColor: '#805c15',
  },
  replacementGif: {
    width: 200, // Adjust the size as needed
    height: 200,
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
  rotated: {
    transform: [{ rotate: '180deg' }],
  },
  gifContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 999,
  },
  swapAlertBox: {
    marginTop: 20, // Add space between the GIF and text
    backgroundColor: 'orange', // Example background color for the alert box
    padding: 10,
    borderRadius: 5,
  },
  swapAlertText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
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
    height: '10%',
    zIndex: 10,
  },
  bottomClickableArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '10%',
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
  swapAlertBox: {
    backgroundColor: '#FDA10E',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#805c15',
  },
  swapAlertText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
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
    borderWidth: 5, // Add border width
    borderColor: '#8B4513'
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20, // Increased font size
    fontWeight: 'bold', // Increased font weight
    color: '#6A3805' // Set the text color to wood fall color
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