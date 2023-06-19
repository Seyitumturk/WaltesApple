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
} from 'react-native';

import bowlImage from '../assets/bowl-image.png';
import markedDice from '../assets/marked-dice.png';
import unmarkedDice from '../assets/unmarked-dice.png';

import plainStickIcon from '../assets/plain-stick-icon.png';
import notchedStickIcon from '../assets/notched-stick-icon.png';
import kingPinIcon from '../assets/king-pin-icon.png';

const { height: screenHeight } = Dimensions.get('window');

const CircularButton = ({ type, count }) => {
  const icons = {
    plain: plainStickIcon,
    notched: notchedStickIcon,
    kingPin: kingPinIcon,
  };
 
  const styles = StyleSheet.create({
    icon: {
      width: 60,    // adjust the size as needed
      height: 75,   // adjust the size as needed
    },
    button: {
      marginHorizontal: 10,  // Added margin
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
      <Text style={styles.countText}>{count}</Text>
    </View>
  );
 };

 const PlayerArea = ({ player, sticks }) => {
  const playerStyle = player === 'player1' ? styles.player1Area : styles.player2Area;

  // Rotate both piles for the top player
  const stickContainerStyle = player === 'player1' ? { transform: [{ rotate: '180deg' }] } : {};

  return (
    <View style={[styles.playerArea, playerStyle]}>
      <View style={[styles.stickContainer, stickContainerStyle]}>
        <View style={styles.generalPile}>
          <CircularButton type="plain" count={sticks.general.plain} />
          <CircularButton type="notched" count={sticks.general.notched} />
          <CircularButton type="kingPin" count={sticks.general.kingPin} />
        </View>
        <View style={styles.personalPile}>
          <CircularButton type="plain" count={sticks[player].plain} />
          <CircularButton type="notched" count={sticks[player].notched} />
          <CircularButton type="kingPin" count={sticks[player].kingPin} />
        </View>
      </View>
    </View>
  );
};


export default function WaltesBoard({ playerTurn, onDiceRolled, sticks, shouldRoll, setShouldRoll, setIsDiceRolling }) {
  const [dice, setDice] = useState([0, 0, 0, 0, 0, 0]);
  const [waltesText, setWaltesText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;


  const generalPlainCount = sticks.general.plain;
  const generalNotchedCount = sticks.general.notched;
  const generalKingPinCount = sticks.general.kingPin;


 // ...

const rollDice = () => {
  
  setIsDiceRolling(true); // The dice have started rolling
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


// ....
setTimeout(() => {
  setIsDiceRolling(false); // The dice have finished rolling
}, 2000); 

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

  const randomPosition = () => {
    const x = Math.random() * 120 - 60;
    const y = Math.random() * 120 - 60;
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
      <Animated.View
        style={[
          styles.waltesTextContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: playerTurn === 0 ? 0 : -200 },
              { rotate: playerTurn === 0 ? '0deg' : '180deg' },
            ],
          },
        ]}
      >
      </Animated.View>

      <PlayerArea player="player2" sticks={sticks} />
      <PlayerArea player="player1" sticks={sticks} />

      
</View>
  );
}
const diceContainerSize = 150;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    padding: 50,
  },
  bowlImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    transform: [{ scale: 0.9}],  // You can adjust this scale as needed

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
      { translateX: -(diceContainerSize / 2) - 30 },
      { translateY: -(diceContainerSize / 2) - 30 },
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
    zIndex: 99999,
  },
  waltesTextContainer: {
    position: 'absolute',
    zIndex: 99999,
  },
  stickText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 10,
  },
  stickTextHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
 
  stickPileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 50, // Add padding at the top
    paddingBottom: 50, // Add padding at the bottom
  },
  boardContainer: {
    flex: 1,
    flexDirection: 'column',
  },
 
  playerArea: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    justifyContent: 'flex-end',  // Align the items towards the end of the flex direction
  },
  
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  player1Area: {
    top: 0,
    alignItems: 'center',
    justifyContent: 'flex-start', // Content aligns at the top
  },
  player2Area: {
    bottom: 0,
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
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  personalPile: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    position: 'absolute',
  },
});
