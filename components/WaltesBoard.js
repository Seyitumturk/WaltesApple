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
  TouchableOpacity,
} from 'react-native';

import bowlImage from '../assets/bowl-image.png';
import markedDice from '../assets/marked-dice.png';
import unmarkedDice from '../assets/unmarked-dice.png';

import plainStickIcon from '../assets/plain-stick-icon.png';
import notchedStickIcon from '../assets/notched-stick-icon.png';
import kingPinIcon from '../assets/king-pin-icon.png';


const CircularButton = ({ type, backgroundColor, count  }) => {
  const icons = {
    plain: plainStickIcon,
    notched: notchedStickIcon,
    kingPin: kingPinIcon,
  };


  const styles = StyleSheet.create({
    button: {
      width: 60,
      height: 60,
      flexDirection: 'row',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: backgroundColor || '#333',
      marginBottom: 10,
      paddingRight: 20,
    },
    icon: {
      width: '100%',
      height: '100%',
    },
  });

  return (
    <TouchableOpacity style={styles.button}>
      <Image source={icons[type]} style={styles.icon} resizeMode="contain" />
      <Text style={styles.countText}>{count}</Text>

    </TouchableOpacity>
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


// ...
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


    {/* Player 1's half */}

      
   <View style={styles.player1Container}>
      <View style={styles.generalPile}>
        <CircularButton type="plain" backgroundColor="wheat" count={generalPlainCount} />
        <CircularButton type="notched" backgroundColor="wheat" count={generalNotchedCount}/>
        <CircularButton type="kingPin" backgroundColor="wheat" count={generalKingPinCount}/>
      </View>
      <View style={styles.playerPile}>
        <CircularButton type="plain" count={sticks.player1.plain}/>
        <CircularButton type="notched" count={sticks.player1.notched} />
        <CircularButton type="kingPin" count={sticks.player1.kingPin}/>
      </View> 
    </View>

    {/* Player 2's half */}


    <View>
      <View style={[styles.player2Container, { transform: [{ rotate: '180deg' }] }]}>
        <View style={styles.generalPile}>
          <CircularButton type="plain" backgroundColor="wheat" count={generalPlainCount} />
        <CircularButton type="notched" backgroundColor="wheat" count={generalNotchedCount}/>
        <CircularButton type="kingPin" backgroundColor="wheat" count={generalKingPinCount}/>
        </View>
        <View style={styles.playerPile}>
          <CircularButton type="plain" count={sticks.player2.plain}/>
        <CircularButton type="notched" count={sticks.player2.notched} />
        <CircularButton type="kingPin" count={sticks.player2.kingPin}/>
      </View>


  </View>



</View>

    </View>
  );
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
    position: 'absolute',
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
  sticksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  stick: {
    width: 20,
    height: 80,
    marginHorizontal: 5,
    borderRadius: 5,
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

player1Container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    position: 'absolute',
    top: 290,
  },
  player2Container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    position: 'absolute',
    right: -200,
    bottom: 180,

  },
  generalPile: {
    alignItems: 'center',
    marginLeft: 20,
  },
  playerPile: {
    alignItems: 'center',
    marginRight: 20,
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    right: 5,
    bottom: 5,
  },
 content: {
    position: 'absolute',
  },
});