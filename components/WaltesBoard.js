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
  StatusBar
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

 const PlayerArea = ({ player, sticks, playerTurn, player1TotalScore = 0, player2TotalScore =0 }) => {
  const playerStyle = player === 'player1' ? styles.player1Area : styles.player2Area;

  // Rotate both piles for the top player
  const stickContainerStyle = player === 'player1' ? { transform: [{ rotate: '180deg' }] } : {};

  // Determine background color based on the player's turn
  const personalPileStyle = {
    backgroundColor: playerTurn === (player === 'player1' ? 0 : 1) ? '#016CFE' : '#FDA10E',
  };

  const totalScore = player1TotalScore + player2TotalScore;

  let player1Percentage = 0;
  let player2Percentage = 0;
  let neutralPercentage = 100; // full size to start

  if (totalScore !== 0) {
    player1Percentage = (player1TotalScore / totalScore) * 100;
    player2Percentage = (player2TotalScore / totalScore) * 100;
    neutralPercentage = 100 - (player1Percentage + player2Percentage); // remaining size
  }


  useEffect(() => {
    console.log("PlayerArea re-rendered with scores:", player1TotalScore, player2TotalScore);
  }, [player1TotalScore, player2TotalScore]);
  

  return (
    <View style={[styles.playerArea, playerStyle]}>
      <View style={[styles.stickContainer, stickContainerStyle]}>
        
        <View style={styles.generalPile}>
          {/* Add this View to represent the colored background based on scores */}
          <View style={{ position: 'absolute', flexDirection: 'row', width: '100%', height: '100%' }}>
            <View style={{ backgroundColor: 'red', flex: player1Percentage }} />
            <View style={{ backgroundColor: 'green', flex: player2Percentage }} />
            <View style={{ backgroundColor: '#D68402', flex: neutralPercentage }} />
          </View>

          {/* Existing generalPile content */}
          <CircularButton type="plain" count={sticks.general.plain} />
          <CircularButton type="notched" count={sticks.general.notched} />
          <CircularButton type="kingPin" count={sticks.general.kingPin} />
        </View>
        
        <View style={[styles.personalPile, personalPileStyle]}>
          <CircularButton type="plain" count={sticks[player].plain} />
          <CircularButton type="notched" count={sticks[player].notched} />
          <CircularButton type="kingPin" count={sticks[player].kingPin} />
        </View>
      </View>
    </View>
);

};


export default function WaltesBoard({ player1TotalScore, player2TotalScore, playerTurn, onDiceRolled, sticks, shouldRoll, setShouldRoll, setIsDiceRolling }) {
  const [dice, setDice] = useState([0, 0, 0, 0, 0, 0]);
  const [waltesText, setWaltesText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const stickAnimPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;


  const scaleAndMoveStick = () => {
    console.log('THE FUNCTION IS CALLED');
    // Start stick at the center with a scale of 0.
    stickAnimPosition.setValue({ x: 0, y: 0 });
    fadeAnim.setValue(0);
  
    // Determine the correct direction based on the player who scored.
    const direction = playerTurn === 0 ? -screenHeight * 0.35 : screenHeight * 0.35;
  
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
  const newDice = dice.map(() => (Math.random() > 0.5 ? 1 : 0));
  setDice(newDice);
  let score = onDiceRolled(newDice);
  console.log(score)


  if (score > 0) { // If a score was obtained, animate the stick
    scaleAndMoveStick();
  }

};

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
              { scale: fadeAnim }
            ],
            opacity: fadeAnim
          }
        ]}
      />

    <PlayerArea 
      player="player2" 
      sticks={sticks} 
      playerTurn={playerTurn} 
      player1TotalScore={player1TotalScore} 
      player2TotalScore={player2TotalScore} 
    />
    <PlayerArea 
      player="player1" 
      sticks={sticks} 
      playerTurn={playerTurn} 
      player1TotalScore={player1TotalScore} 
      player2TotalScore={player2TotalScore} 
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
    transform: [{ scale: 0.9}],  // You can adjust this scale as needed
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
    backgroundColor: 'orange',  // Add this line
    zIndex: -1,

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
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#D68402', // Added background color
  },
  personalPile: {
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
    width: 60,  // Adjust size as needed.
    height: 75, // Adjust size as needed.
    left: '50%',
    top: '50%',
    zIndex: 999999,
      },
  waltesTextImage: {
    position: 'absolute',
    width: 100, // Adjust width as needed
    height: 50, // Adjust height as needed
    resizeMode: 'contain', // Adjust resizing mode as needed
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  
});
