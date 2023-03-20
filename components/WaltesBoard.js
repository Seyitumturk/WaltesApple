import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, SafeAreaView } from 'react-native';

const markedDice = require('../assets/marked-dice.png');
const unmarkedDice = require('../assets/unmarked-dice.png');
const bowlImage = require('../assets/bowl-image.png');

const bowlWidth = 200;
const bowlHeight = 200;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const generateDicePositions = () => {
  const positions = [];
  for (let i = 0; i < 6; i++) {
    positions.push({
      x: Math.random() * (screenWidth - 50),
      y: Math.random() * (screenHeight / 2 - 50),
    });
  }
  return positions;
};

function calculateScore(dice) {
  const markedDice = dice.filter((d) => d.marked).length;
  const unmarkedDice = dice.filter((d) => !d.marked).length;

  if (markedDice === 6 || unmarkedDice === 6) {
    return 5;
  } else if (markedDice === 5 && unmarkedDice === 1) {
    return 1;
  } else if (markedDice === 1 && unmarkedDice === 5) {
    return 1;
  } else {
    return 0;
  }
}


const setImageWidth = 50; 
const setImageHeight = 100; 


const WaltesBoard = () => {
  const [playerTurn, setPlayerTurn] = useState(1);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [dice, setDice] = useState([1, 2, 3, 4, 5, 6]);
  const [dicePositions, setDicePositions] = useState(generateDicePositions());

  useEffect(() => {
    setDicePositions(generateDicePositions());
  }, [dice]);

  const rollDice = () => {
    const newDice = dice.map(() => Math.ceil(Math.random() * 6));
    setDice(newDice);

    const currentScore = calculateScore(newDice);
    setScore({ ...score, [`player${playerTurn}`]: score[`player${playerTurn}`] + currentScore });

    setPlayerTurn(playerTurn === 1 ? 2 : 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.halfScreen,
          { backgroundColor: playerTurn === 2 ? 'rgba(0, 128, 0, 0.2)' : 'transparent' },
        ]}
      >
        <Text style={styles.scoreText}>
          Player 2 Score: {score.player2}
        </Text>
      </View>
      <View style={styles.bowlContainer}>
        <Image source={bowlImage} style={styles.bowlImage} />
        {dice.map((value, index) => (
          <Image
            key={index}
            source={value === 1 ? markedDice : unmarkedDice}
            style={{
              position: 'absolute',
              width: 50,
              height: 50,
              left: dicePositions[index].x,
              top: dicePositions[index].y,
            }}
          />
        ))}
      </View>
      <View
        style={[
          styles.halfScreen,
          { backgroundColor: playerTurn === 1 ? 'rgba(0, 128, 0, 0.2)' : 'transparent' },
        ]}
      >
        <Text style={styles.scoreText}>
          Player 1 Score: {score.player1}
        </Text>
      </View>
      <TouchableOpacity style={styles.rollDiceButton} onPress={rollDice}>
        <Text style={styles.rollDiceText}>Roll Dice</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  halfScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  player1: {
    backgroundColor: '#E1F5FE',
  },
  player2: {
    backgroundColor: '#FFEBEE',
  },
  bowlImage: {
    width: bowlWidth,
    height: bowlHeight
  },
  rollDiceButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    position: 'absolute',
    bottom: 10,
    zIndex: 3,
  },
  rollDiceText: {
    fontSize: 18,
    color: '#ffffff',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default WaltesBoard;

