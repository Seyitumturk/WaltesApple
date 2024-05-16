import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Vibration,
  Text,
  Dimensions,
  StatusBar,

} from 'react-native';

import bowlImage from '../assets/bowl-image.png';
import markedDice from '../assets/marked-dice.png';
import unmarkedDice from '../assets/unmarked-dice.png';

import plainStickIcon from '../assets/plain-stick-icon.png';
import notchedStickIcon from '../assets/notched-stick-icon.png';
import kingPinIcon from '../assets/king-pin-icon.png';
import { ReloadInstructions } from 'react-native/Libraries/NewAppScreen';

const screenWidth = Dimensions.get('window').width;
const { height: screenHeight } = Dimensions.get('window');



const useCountAnimation = (initialCount) => {
  const [count, setCount] = useState(initialCount);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const animateCount = (newCount) => {
    const isSuperWaltes = Math.abs(newCount - count) > 10; // Determine if it's a Super Waltes increment
    const incrementValue = (currentValue, targetValue, duration) => {
      const adjustedDuration = isSuperWaltes ? Math.min(duration, 200) : Math.min(duration, 300); // Adjust max duration for Super Waltes

      if (currentValue < targetValue) {
        setCount(currentValue + 1);
        animatedValue.setValue(0);
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: adjustedDuration,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: adjustedDuration,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
        ]).start(() => incrementValue(currentValue + 1, targetValue, duration + (isSuperWaltes ? 20 : 50))); // Adjust step increment duration
      } else if (currentValue > targetValue) {
        setCount(currentValue - 1);
        animatedValue.setValue(0);
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: adjustedDuration,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: adjustedDuration,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
        ]).start(() => incrementValue(currentValue - 1, targetValue, duration + (isSuperWaltes ? 20 : 50))); // Adjust step increment duration
      }
    };

    incrementValue(count, newCount, 50); // Start with a base duration of 50ms
  };

  return [count, animateCount, animatedValue];
};




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
      <Image source={icons[type]} style={styles.icon} resizeMode="contain" />
      <Animated.Text style={[styles.countText, animatedStyle]}>
        {type === 'notched' && showNotchedValue ? `${animatedCount}/${notchedValue}` : animatedCount}
      </Animated.Text>
    </View>
  );
};

const PlayerArea = ({
  player,
  sticks,
  playerTurn,
  player1Style,
  player2Style,
  scoringPlayer,
  scoreText,
  opacityAnim,
  isGeneralPileExhausted,
}) => {
  const playerStyle = player === 'player1' ? styles.player1Area : styles.player2Area;

  // Rotate both piles for the top player
  const stickContainerStyle = player === 'player1' ? { transform: [{ rotate: '180deg' }] } : {};

  // Determine background color based on the player's turn
  const personalPileStyle = {
    backgroundColor: playerTurn === (player === 'player1' ? 0 : 1) ? '#49350D' : '#FDA10E',
  };

  // Animation for the score text appearance
  useEffect(() => {
    if (player === scoringPlayer) {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [player, scoringPlayer, opacityAnim, scoreText]);

  return (
    <View style={[styles.playerArea, playerStyle]}>
      <View style={[styles.stickContainer, stickContainerStyle]}>
        <View style={styles.generalPile}>
          <CircularButton type="plain" count={sticks.general.plain} />
          <CircularButton type="notched" count={sticks.general.notched} />
          <CircularButton type="kingPin" count={sticks.general.kingPin} />
        </View>

        <View style={[styles.personalPile, personalPileStyle]}>
          <CircularButton type="plain" count={sticks[player].plain} />
          <CircularButton
            type="notched"
            count={sticks[player].notched}
            notchedValue={sticks[player].notchedValue}
            showNotchedValue={isGeneralPileExhausted}
          />
          <CircularButton type="kingPin" count={sticks[player].kingPin} />

          {player === scoringPlayer && (
            <Animated.View
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: 20,
                paddingVertical: 5,
                paddingHorizontal: 10,
                opacity: opacityAnim,
                position: 'absolute',
                alignSelf: 'center',
                top: '50%',
                transform: [{ translateY: -10 }],
              }}
            >
              <Text
                style={[
                  styles.scoreTextInPile,
                  {
                    color: 'white',
                    textAlign: 'center',
                  },
                ]}
              >
                {scoreText}
              </Text>
            </Animated.View>
          )}

          <View style={styles.scoreIndicatorContainer}>
            <Animated.View style={player1Style} />
            <Animated.View style={player2Style} />
          </View>
        </View>
      </View>
    </View>
  );
};




export default function WaltesBoard({
  player1TotalScore, player2TotalScore, playerTurn, onDiceRolled, sticks, shouldRoll,
  setShouldRoll, setIsDiceRolling, scoringPlayer, waltesText, isGeneralPileExhausted
}) {
  const [dice, setDice] = useState([0, 0, 0, 0, 0, 0]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const stickAnimPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const totalScore = player1TotalScore + player2TotalScore;
  const player1ScoreWidth = useRef(new Animated.Value(50)).current; // Initialize with 50%
  const [currentScoringPlayer, setCurrentScoringPlayer] = useState(null); // Renamed to avoid conflict


  const [scoreText, setScoreText] = useState('');
  const scoreTextAnim = useRef(new Animated.ValueXY({ x: -screenWidth, y: 0 })).current;
  const [textLayout, setTextLayout] = useState({ width: 0, height: 0 });
  const [rotationAngle, setRotationAngle] = useState('0deg');
  const opacityAnim = useRef(new Animated.Value(0)).current; // Controls opacity
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // For controlling scale, starting at 0.5
  const superWaltesScore = 5; // Define this according to your game's logic

  const updateScoringPlayer = (player) => {
    setScoringPlayer(player); // 'player1' or 'player2'
  };


  useEffect(() => {
    let player1WidthPercentage = (player1TotalScore + player2TotalScore) === 0
      ? 50
      : (player1TotalScore / (player1TotalScore + player2TotalScore)) * 100;

    Animated.timing(player1ScoreWidth, {
      toValue: player1WidthPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [player1TotalScore, player2TotalScore]);

  const player1Style = {
    backgroundColor: '#0EFDA1',
    width: player1ScoreWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'], // Ensure it starts at 0% and goes up to 100%
    }),
    height: 20,
  };

  const player2Style = {
    backgroundColor: '#A10EFD',
    width: player1ScoreWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['100%', '0%'], // Inverse of player1's width
    }),
    height: 20,
  };
  // Waltes text on win 
  const onTextLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setTextLayout({ width, height });
  };

  const animateScoreText = () => {
    // First, make the text visible and move it to the center
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1, // Make the text fully visible
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0, // Move text to its final position
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Keep the text visible for 1500 milliseconds
      Animated.delay(1500),
      // Then, fade out the text and move it down slightly
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0, // Make the text fully invisible
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20, // Move text back down slightly
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };
  const scaleAndMoveStick = () => {
    console.log('THE FUNCTION IS CALLED');
    // Start stick at the center with a scale of 0.
    stickAnimPosition.setValue({ x: 0, y: 0 });
    fadeAnim.setValue(0);

    // Determine the correct direction based on the player who scored.
    const direction = playerTurn === 0 ? -screenHeight * 0.45 : screenHeight * 0.25;

    // Enlarge the stick.
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // Scale the stick up.
      Animated.timing(fadeAnim, {
        toValue: 1.5, // Adjust this value to make it grow larger
        duration: 1000, // Increase duration to make the scaling effect last longer
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // Move the stick towards the scoring player's pile while shrinking it.
      Animated.parallel([
        Animated.timing(stickAnimPosition, {
          toValue: { x: 0, y: direction },
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // Shrink the stick back to its original size.
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      // Dissolve the stick.
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rollDice = () => {
    console.log("Roll Dice is Called");
    Vibration.vibrate(500);

    setIsDiceRolling(true); // The dice have started rolling
    const newDice = dice.map(() => Math.random() > 0.5 ? 1 : 0);
    setDice(newDice);

    let score = onDiceRolled(newDice); // This function should determine if the player scored
    console.log("Score: ", score);

    if (score > 0) { // Assuming a score of 0 means no score
      let text = score === superWaltesScore ? "Super Waltes" : "Waltes";
      setScoreText(text); // Update score text based on score

      let currentPlayer = playerTurn === 0 ? 'player1' : 'player2';
      setCurrentScoringPlayer(currentPlayer); // Update scoring player only if there is a score

      console.log("Setting scoreText to: ", text);
      animateScoreText();
    } else {
      // If no score, ensure no scoring player and scoreText is displayed
      setCurrentScoringPlayer(null);
      setScoreText('');
    }

    setIsDiceRolling(false); // Reset dice rolling state
  };


  setTimeout(() => {
    setIsDiceRolling(false); // The dice have finished rolling
  }, 2000);

  const randomPosition = () => {
    const x = Math.random() * 120 - 60;
    const y = Math.random() * 120 - 60;
    return { x, y };
  };

  const diceRotation = () => {
    return Math.floor(Math.random() * 180);
  };

  useEffect(() => {
    if (shouldRoll) {
      setShouldRoll(false); // Reset shouldRoll
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(rollDice);
      });
    }
  }, [playerTurn, shouldRoll]);




  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Animated.View
        style={[
          styles.bowlImage,
          {
            transform: [
              {
                rotate: shakeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '40deg'],
                }),
              },
            ],
          },
        ]}
      >

        <ImageBackground source={bowlImage} resizeMode="contain" style={styles.bowlImage}>
          <View style={styles.diceContainer}>
            {dice.map((die, index) => {
              const position = randomPosition();
              const rotation = diceRotation();
              return (
                <View key={index}>
                  <Animated.Image
                    resizeMode="contain"
                    source={die === 1 ? markedDice : unmarkedDice}
                    style={[
                      styles.dice,
                      {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: [
                          { translateX: position.x },
                          { translateY: position.y },
                          { rotate: `${rotation}deg` },
                          { scaleX: 0.7 },
                          { scaleY: 0.7 },
                        ],
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </ImageBackground>
      </Animated.View>


      <Animated.Image
        source={require('../assets/animated-plain-stick-icon.png')}
        style={[
          styles.animatedStick,
          {
            transform: [
              ...stickAnimPosition.getTranslateTransform(),
              { rotate: playerTurn === 1 ? '0deg' : '180deg' },
              { scale: fadeAnim },
              { translateX: Animated.add(stickAnimPosition.x, -30) },
              { translateY: Animated.add(stickAnimPosition.y, -30) }
            ],
            opacity: fadeAnim
          }
        ]}
      />





      <PlayerArea
        player="player1"
        sticks={sticks}
        playerTurn={playerTurn}
        player1Style={player1Style}
        player2Style={player2Style}
        scoreText={scoreText}
        opacityAnim={opacityAnim}
        scoringPlayer={currentScoringPlayer}
        isGeneralPileExhausted={isGeneralPileExhausted}
      />

      <PlayerArea
        player="player2"
        sticks={sticks}
        playerTurn={playerTurn}
        player1Style={player1Style}
        player2Style={player2Style}
        scoreText={scoreText}
        opacityAnim={opacityAnim}
        scoringPlayer={currentScoringPlayer}
        isGeneralPileExhausted={isGeneralPileExhausted}
      />


    </View>
  );
}
const diceContainerSize = 150;

const styles = StyleSheet.create({


  bowlImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    transform: [{ scale: 0.9 }],  // You can adjust this scale as needed
    zIndex: 9999,

  },
  diceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: diceContainerSize,
    height: diceContainerSize,
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [
      { translateX: -(diceContainerSize / 2) },
      { translateY: -(diceContainerSize / 2) },
    ],
  },
  dice: {
    width: 50,
    height: 50,
    margin: 5,
  },
  stickPileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 50,
    paddingBottom: 50,
  },
  boardContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  scoreIndicatorContainer: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0, // Ensure full width utilization
    flexDirection: 'row',
    height: 20, // Match the height of the score indicators
  },
  playerArea: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    justifyContent: 'flex-end',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'orange',  // Add this line

  },
  player1Area: {
    top: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',

  },
  player2Area: {
    bottom: 15,
    alignItems: 'center',
    justifyContent: 'flex-end', // Content aligns at the bottom
  },

  stickContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end', // Add this line
    paddingBottom: 30, // You can adjust this padding as needed
    paddingTop: 30, // You can adjust this padding as needed
  },

  generalPile: {
    paddingTop: -40,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#D68402', // Added background color
  },
  personalPile: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FDA10E',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  animatedStick: {
    position: 'absolute',
    width: 60,
    height: 60,
    left: '50%',
    top: '50%',
    zIndex: 999999,

  },
  scoreTextInPile: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white', // Make sure the color contrasts well with the personal pile background
    alignSelf: 'center', // Center within the personal pile
    marginTop: 10, // Adjust as needed
    zIndex: 9999999999,

  },


  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000000, // Ensure it's on top
  },
  scoreText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center', // Ensure text is centered horizontally
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

});