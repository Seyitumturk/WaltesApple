 import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Vibration,
} from 'react-native';

import bowlImage from '../assets/bowl-image.png';
import markedDice from '../assets/marked-dice.png';
import unmarkedDice from '../assets/unmarked-dice.png';

export default function WaltesBoard({ playerTurn, onDiceRolled }) {
  const [dice, setDice] = useState([0, 0, 0, 0, 0, 0]);
  const [waltesText, setWaltesText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const rollDice = () => {
    const newDice = dice.map(() => (Math.random() > 0.5 ? 1 : 0));
    setDice(newDice);
    const score = onDiceRolled(newDice);

    if (score > 0) {
      Vibration.vibrate(500);
      setWaltesText(score === 5 ? 'Super Waltes' : 'Waltes');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start();
        }, 1000);
      });
    }
  };

  useEffect(() => {
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
  }, [playerTurn]);

  const randomPosition = () => {
    const x = Math.random() * 60 - 30;
    const y = Math.random() * 60 - 30;
    return { x, y };
  };

  const diceRotation = () => {
    return Math.floor(Math.random() * 180);
  };

  return (
    <View style={styles.container}>


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
</View>);
}
const diceContainerSize = 150;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', 
    },
    bowlImage: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
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
        { translateX: -(diceContainerSize / 2) - 30}, // Edit "30" for moving the dice cluster right left. 
        { translateY: -(diceContainerSize / 2) - 30},
    ],
  },
    dice: {
      width: 50,
      height: 50,
      margin: 5,
    },
    waltesText: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'black',
      position: 'absolute',
    },
  });
