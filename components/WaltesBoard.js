// WaltesBoard.js
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
  TouchableOpacity
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './WaltesBoardStyles';

import bowlImage from '../assets/bowl-image.png';
import markedDice from '../assets/marked-dice.png';
import unmarkedDice from '../assets/unmarked-dice.png';
import backgroundImage from '../assets/bg.png';
import plainStickIcon from '../assets/plain-stick-icon.png';
import markedStickIcon from '../assets/notched-stick-icon.png';

import PlayerArea from './PlayerArea';

const screenWidth = Dimensions.get('window').width;
const { height: screenHeight } = Dimensions.get('window');

export default function WaltesBoard({
  player1TotalScore, player2TotalScore, playerTurn, onDiceRolled, sticks, shouldRoll,
  setShouldRoll, setIsDiceRolling, scoringPlayer, waltesText, isGeneralPileExhausted, isDiceRolling, debt, handleAskDebtPayment, replacementMessage
}) {
  const [personalPileHeight, setPersonalPileHeight] = useState(0);
  const typingInterval = useRef(null);

  const handlePersonalPileLayout = (height) => {
    setPersonalPileHeight(height);
  };

  const [dice, setDice] = useState([0, 0, 0, 0, 0, 0]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const stickAnimPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const totalScore = player1TotalScore + player2TotalScore;
  const player1ScoreWidth = useRef(new Animated.Value(50)).current;
  const [currentScoringPlayer, setCurrentScoringPlayer] = useState(null);

  const [scoreText, setScoreText] = useState('');
  const scoreTextAnim = useRef(new Animated.ValueXY({ x: -screenWidth, y: 0 })).current;
  const [textLayout, setTextLayout] = useState({ width: 0, height: 0 });
  const [rotationAngle, setRotationAngle] = useState('0deg');
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const superWaltesScore = 5;

  const [askButtonClicked, setAskButtonClicked] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);

  const updateScoringPlayer = (player) => {
    setScoringPlayer(player);
  };

  const handlePileClick = (player) => {
    if ((player === 'player1' && playerTurn === 0) || (player === 'player2' && playerTurn === 1)) {
      if (!isDiceRolling) {
        setShouldRoll(true);
      }
    }
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
    backgroundColor: '#29B7F7',
    width: player1ScoreWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    }),
    height: 10,
  };

  const player2Style = {
    backgroundColor: '#F76929',
    width: player1ScoreWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['100%', '0%'],
    }),
    height: 10,
  };

  const onTextLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setTextLayout({ width, height });
  };

  const animateScoreText = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1500),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const scaleAndMoveStick = () => {
    console.log('THE FUNCTION IS CALLED');
    stickAnimPosition.setValue({ x: 0, y: 0 });
    fadeAnim.setValue(0);

    const direction = playerTurn === 0 ? -screenHeight * 0.45 : screenHeight * 0.25;

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1.5,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(stickAnimPosition, {
          toValue: { x: 0, y: direction },
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const [currentScore, setCurrentScore] = useState(0);

  const rollDice = () => {
    console.log("Roll Dice is Called");
    Vibration.vibrate(500);

    setIsDiceRolling(true);
    const newDice = dice.map(() => Math.random() > 0.5 ? 1 : 0);
    setDice(newDice);

    // Generate new random positions for all dice
    const newDicePositions = dice.map(() => {
      const bowlRadius = 130;
      const position = randomPositionInBowl(bowlRadius);
      const rotation = diceRotation();
      return { position, rotation };
    });
    setDicePositions(newDicePositions);

    let score = onDiceRolled(newDice);
    console.log("Score: ", score);

    if (score > 0) {
      let text = score === superWaltesScore ? "Super Waltes" : "Waltes";
      setScoreText(text);

      let currentPlayer = playerTurn === 0 ? 'player1' : 'player2';
      setCurrentScoringPlayer(currentPlayer);

      // Set the current score
      setCurrentScore(score);
      console.log("Setting current score to:", score);

      console.log("Setting scoreText to: ", text);
      animateScoreText();
    } else {
      setCurrentScoringPlayer(null);
      setScoreText('');
      setCurrentScore(0);
    }

    setIsDiceRolling(false);
  };

  setTimeout(() => {
    setIsDiceRolling(false);
  }, 2000);
  const randomPositionInBowl = (bowlRadius) => {
    // Generate a random angle between 0 and 360 degrees
    const angle = Math.random() * 2 * Math.PI;

    // Generate a random distance from the center, but keep it within the bowl's radius
    const distanceFromCenter = Math.random() * (bowlRadius - 40); // Subtract some padding to prevent the dice from touching the bowl's edge

    // Calculate the X and Y positions relative to the center of the bowl
    const x = distanceFromCenter * Math.cos(angle);
    const y = distanceFromCenter * Math.sin(angle);

    return { x, y };
  };




  const diceRotation = () => {
    return Math.floor(Math.random() * 180);
  };

  useEffect(() => {
    if (shouldRoll) {
      setShouldRoll(false);
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

  useEffect(() => {
    if (askButtonClicked) {
      console.log(`Debt payment asked by ${askButtonClicked}`);
      setAskButtonClicked(null);
    }
  }, [askButtonClicked]);

  const [tutorialStep, setTutorialStep] = useState(1);
  const totalTutorialSteps = 5; // Adjust this based on your total number of tutorial steps

  const handleTutorialNext = () => {
    if (tutorialStep < totalTutorialSteps) {
      setTutorialStep(tutorialStep + 1);
    }
  };

  const handleTutorialPrevious = () => {
    if (tutorialStep > 1) {
      setTutorialStep(prevStep => prevStep - 1);
      setTypedText('');
      
      // Reset animations based on the previous step
      if (tutorialStep === 2) {
        // Reset bowl highlight
        Animated.timing(bowlHighlightAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (tutorialStep === 3) {
        // Reset dice opacity
        diceOpacityAnims.forEach((anim) => {
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      } else if (tutorialStep > 3 && tutorialStep <= 6) {
        // Reset stick icon animations
        Animated.timing(stickIconsAnim[tutorialStep - 4], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
  };

  const [typedText, setTypedText] = useState('');
  const tutorialTexts = [
    "This is the Waltes bowl. Dice are tossed in here to determine the score.",
    "The bowl contains six dice. Three are marked on one side, and three are unmarked.",
    "Plain sticks are worth 1 point each. They are the most common type of stick in the game.",
    "Notched sticks are worth 5 points each. They are less common but more valuable than plain sticks.",
    "The King Pin is a special stick worth 5 points. There is only one King Pin in the game, making it very valuable.",
  ];

  const bowlHighlightAnim = useRef(new Animated.Value(0)).current;
  const diceOpacityAnims = useRef(dice.map(() => new Animated.Value(0))).current;
  const stickIconsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  const [dicePositions, setDicePositions] = useState([]);

  useEffect(() => {
    // Generate dice positions once
    const newDicePositions = dice.map(() => {
      const bowlRadius = 130;
      const position = randomPositionInBowl(bowlRadius);
      const rotation = diceRotation();
      return { position, rotation };
    });
    setDicePositions(newDicePositions);
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (showTutorial) {
      const textToType = tutorialTexts[tutorialStep - 1];
      let currentIndex = 0;

      // Clear any existing interval
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
      }

      setTypedText('');

      // Reveal bowl image smoothly for step 1
      if (tutorialStep === 1) {
        Animated.timing(bowlHighlightAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
      }

      // Reveal dice smoothly one by one for step 2
      if (tutorialStep === 2) {
        diceOpacityAnims.forEach((anim, index) => {
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            delay: index * 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }).start();
        });
      }

      // Reveal stick icons one at a time for steps 3, 4, and 5
      if (tutorialStep >= 3 && tutorialStep <= 5) {
        Animated.timing(stickIconsAnim[tutorialStep - 3], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }

      typingInterval.current = setInterval(() => {
        if (currentIndex < textToType.length) {
          setTypedText(prevText => prevText + textToType[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(typingInterval.current);
        }
      }, 50);

      return () => {
        if (typingInterval.current) {
          clearInterval(typingInterval.current);
        }
      };
    }
  }, [tutorialStep, showTutorial]);

  const handleNextTutorialStep = () => {
    if (tutorialStep < tutorialTexts.length) {
      setTutorialStep(prevStep => prevStep + 1);
      setTypedText('');
    } else {
      setShowTutorial(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <View style={styles.scoreTrackerContainer}>
        <Animated.View
          style={{
            backgroundColor: '#F76929',
            height: player1ScoreWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            width: 10,
          }}
        />
        <Animated.View
          style={{
            backgroundColor: '#29B7F7',
            height: player1ScoreWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['100%', '0%'],
            }),
            width: 10,
          }}
        />
      </View>

      <ImageBackground source={backgroundImage} style={styles.background} imageStyle={{ opacity: 0.1 }}>

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
          onPersonalPileLayout={handlePersonalPileLayout}
          playerTurn={playerTurn}
          player1Style={player1Style}
          player2Style={player2Style}
          scoreText={scoreText}
          opacityAnim={opacityAnim}
          scoringPlayer={currentScoringPlayer}
          isGeneralPileExhausted={isGeneralPileExhausted}
          debt={debt}
          handleAskDebtPayment={handleAskDebtPayment}
          onPileClick={handlePileClick}
          replacementMessage={replacementMessage}
          style={showTutorial ? styles.blurredArea : {}}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          generalPileHighlightAnim={stickIconsAnim[0]}
          tutorialStep={tutorialStep}
          scoreAmount={currentScoringPlayer === 'player1' ? currentScore : 0}
          totalTutorialSteps={totalTutorialSteps}
          onTutorialPrevious={handleTutorialPrevious}
        />
        <View style={styles.bowlContainer}>
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
                zIndex: showTutorial ? 1000001 : 1,
                opacity: showTutorial ? bowlHighlightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 1],
                }) : 1,
              },
            ]}
          >
            <ImageBackground source={bowlImage} resizeMode="contain" style={styles.bowlImage}>
              <View style={styles.diceContainer}>
                {dicePositions.map((dicePos, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      position: 'absolute',
                      opacity: showTutorial ? (tutorialStep === 1 ? 0 : diceOpacityAnims[index]) : 1,
                      top: '50%',
                      left: '50%',
                      transform: [
                        { translateX: dicePos.position.x },
                        { translateY: dicePos.position.y },
                        { rotate: `${dicePos.rotation}deg` },
                      ],
                    }}
                  >
                    <Animated.Image
                      resizeMode="contain"
                      source={dice[index] === 1 ? markedDice : unmarkedDice}
                      style={{
                        width: 35,
                        height: 35,
                      }}
                    />
                  </Animated.View>
                ))}
              </View>
            </ImageBackground>
          </Animated.View>
        </View>
        <PlayerArea
          player="player2"
          sticks={sticks}
          onPersonalPileLayout={handlePersonalPileLayout}
          playerTurn={playerTurn}
          player1Style={player1Style}
          player2Style={player2Style}
          scoreText={scoreText}
          opacityAnim={opacityAnim}
          scoringPlayer={currentScoringPlayer}
          isGeneralPileExhausted={isGeneralPileExhausted}
          debt={debt}
          handleAskDebtPayment={handleAskDebtPayment}
          onPileClick={handlePileClick}
          replacementMessage={replacementMessage}
          style={showTutorial ? styles.blurredArea : {}}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          generalPileHighlightAnim={stickIconsAnim[0]}
          tutorialStep={tutorialStep}
          scoreAmount={currentScoringPlayer === 'player2' ? currentScore : 0}
          totalTutorialSteps={totalTutorialSteps}
          onTutorialPrevious={handleTutorialPrevious}
        />
      </ImageBackground>

      {showTutorial && tutorialStep >= 3 && tutorialStep <= 5 && (
        <>
          <Animated.View
            style={[
              styles.stickIconsContainer,
              {
                position: 'absolute',
                top: '35%',
                left: '50%',
                transform: [{ translateX: -150 }, { translateY: -50 }, { rotate: '180deg' }],
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: 300,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: 10,
                padding: 20,
                zIndex: 1000002,
              },
            ]}
          >
            <Text style={[styles.generalPileTitle, { transform: [{ rotate: '180deg' }], marginBottom: 10 }]}>
              General Pile
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <Animated.View style={{ opacity: stickIconsAnim[0], alignItems: 'center', flex: 1 }}>
                <Image source={plainStickIcon} style={styles.stickIcon} />
                <Text style={[styles.stickCount, { transform: [{ rotate: '180deg' }] }]}>Plain</Text>
                <Text style={[styles.stickTotal, { transform: [{ rotate: '180deg' }] }]}>51</Text>
              </Animated.View>
              <Animated.View style={{ opacity: stickIconsAnim[1], alignItems: 'center', flex: 1 }}>
                <Image source={markedStickIcon} style={styles.stickIcon} />
                <Text style={[styles.stickCount, { transform: [{ rotate: '180deg' }] }]}>Notched</Text>
                <Text style={[styles.stickTotal, { transform: [{ rotate: '180deg' }] }]}>3</Text>
              </Animated.View>
              <Animated.View style={{ opacity: stickIconsAnim[2], alignItems: 'center', flex: 1 }}>
                <Image source={require('../assets/king-pin-icon.png')} style={styles.stickIcon} />
                <Text style={[styles.stickCount, { transform: [{ rotate: '180deg' }] }]}>King Pin</Text>
                <Text style={[styles.stickTotal, { transform: [{ rotate: '180deg' }] }]}>1</Text>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Repeat the same structure for Player 1's view, but without rotation */}
          <Animated.View
            style={[
              styles.stickIconsContainer,
              {
                position: 'absolute',
                bottom: '35%',
                left: '50%',
                transform: [{ translateX: -150 }, { translateY: 50 }],
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: 300,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: 10,
                padding: 20,
                zIndex: 1000002,
              },
            ]}
          >
            <Text style={[styles.generalPileTitle, { marginBottom: 10 }]}>General Pile</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <Animated.View style={{ opacity: stickIconsAnim[0], alignItems: 'center', flex: 1 }}>
                <Image source={plainStickIcon} style={styles.stickIcon} />
                <Text style={styles.stickCount}>Plain</Text>
                <Text style={styles.stickTotal}>51</Text>
              </Animated.View>
              <Animated.View style={{ opacity: stickIconsAnim[1], alignItems: 'center', flex: 1 }}>
                <Image source={markedStickIcon} style={styles.stickIcon} />
                <Text style={styles.stickCount}>Notched</Text>
                <Text style={styles.stickTotal}>3</Text>
              </Animated.View>
              <Animated.View style={{ opacity: stickIconsAnim[2], alignItems: 'center', flex: 1 }}>
                <Image source={require('../assets/king-pin-icon.png')} style={styles.stickIcon} />
                <Text style={styles.stickCount}>King Pin</Text>
                <Text style={styles.stickTotal}>1</Text>
              </Animated.View>
            </View>
          </Animated.View>
        </>
      )}

      {showTutorial && (
        <>
          {/* Player 2's Tutorial Box (Top) - Rotated 180 degrees */}
          <View
            style={[
              styles.tutorialContent,
              styles.player2TutorialContent,
              { transform: [{ rotate: '180deg' }] }
            ]}
          >
            <View style={styles.chatBox}>
              <View style={styles.chatBoxInner}>
                <Text style={styles.chatBoxText}>{typedText}</Text>
                <View style={styles.tutorialButtonsContainer}>
                  <TouchableOpacity
                    style={styles.chatBoxButton}
                    onPress={handleTutorialPrevious}
                    disabled={tutorialStep === 1}
                  >
                    <MaterialIcons name="arrow-back" size={50} color={tutorialStep === 1 ? "#A9A9A9" : "#4CAF50"} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.chatBoxButton}
                    onPress={handleNextTutorialStep}
                  >
                    <MaterialIcons name="arrow-forward" size={50} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Player 1's Tutorial Box (Bottom) - No Rotation */}
          <View
            style={[
              styles.tutorialContent,
              styles.player1TutorialContent
            ]}
          >
            <View style={styles.chatBox}>
              <View style={styles.chatBoxInner}>
                <Text style={styles.chatBoxText}>{typedText}</Text>
                <View style={styles.tutorialButtonsContainer}>
                  <TouchableOpacity
                    style={styles.chatBoxButton}
                    onPress={handleTutorialPrevious}
                    disabled={tutorialStep === 1}
                  >
                    <MaterialIcons name="arrow-back" size={50} color={tutorialStep === 1 ? "#A9A9A9" : "#4CAF50"} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.chatBoxButton}
                    onPress={handleNextTutorialStep}
                  >
                    <MaterialIcons name="arrow-forward" size={50} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </>
      )}

    </View>
  );
}