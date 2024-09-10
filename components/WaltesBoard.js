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

import PlayerArea from './PlayerArea';

const screenWidth = Dimensions.get('window').width;
const { height: screenHeight } = Dimensions.get('window');

export default function WaltesBoard({
  player1TotalScore, player2TotalScore, playerTurn, onDiceRolled, sticks, shouldRoll,
  setShouldRoll, setIsDiceRolling, scoringPlayer, waltesText, isGeneralPileExhausted, isDiceRolling, debt, handleAskDebtPayment, replacementMessage
}) {
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

  const rollDice = () => {
    console.log("Roll Dice is Called");
    Vibration.vibrate(500);

    setIsDiceRolling(true);
    const newDice = dice.map(() => Math.random() > 0.5 ? 1 : 0);
    setDice(newDice);

    let score = onDiceRolled(newDice);
    console.log("Score: ", score);

    if (score > 0) {
      let text = score === superWaltesScore ? "Super Waltes" : "Waltes";
      setScoreText(text);

      let currentPlayer = playerTurn === 0 ? 'player1' : 'player2';
      setCurrentScoringPlayer(currentPlayer);

      console.log("Setting scoreText to: ", text);
      animateScoreText();
    } else {
      setCurrentScoringPlayer(null);
      setScoreText('');
    }

    setIsDiceRolling(false);
  };

  setTimeout(() => {
    setIsDiceRolling(false);
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
          debt={debt}
          handleAskDebtPayment={handleAskDebtPayment}
          onPileClick={handlePileClick}
          replacementMessage={replacementMessage}
          style={showTutorial ? styles.blurredArea : {}}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
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
          debt={debt}
          handleAskDebtPayment={handleAskDebtPayment}
          onPileClick={handlePileClick}
          replacementMessage={replacementMessage}
          style={showTutorial ? styles.blurredArea : {}}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
        />

        {showTutorial && (
          <>
            <View style={styles.tutorialOverlay} pointerEvents="none" />
            <View style={[styles.tutorialContent, styles.player1TutorialContent]}>
              <View style={styles.chatBox}>
                <Text style={styles.chatBoxText}>This is the Waltes bowl. Dice are tossed in here to determine the score.</Text>
                <TouchableOpacity style={styles.chatBoxButton} onPress={() => setShowTutorial(false)}>
                  <Text style={styles.chatBoxButtonText}>Got it!</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.tutorialContent, styles.player2TutorialContent]}>
              <View style={styles.chatBox}>
                <Text style={styles.chatBoxText}>This is the Waltes bowl. Dice are tossed in here to determine the score.</Text>
                <TouchableOpacity style={styles.chatBoxButton} onPress={() => setShowTutorial(false)}>
                  <Text style={styles.chatBoxButtonText}>Got it!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ImageBackground>
    </View>
  );
}
