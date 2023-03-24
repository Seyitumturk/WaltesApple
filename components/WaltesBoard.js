import React from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import bowlImage from '../assets/bowl-image.png';

const markedDice = require('../assets/marked-dice.png');
const unmarkedDice = require('../assets/unmarked-dice.png');

export default function WaltesBoard({ playerTurn, onDiceRolled }) {
  const [dice, setDice] = React.useState([0, 0, 0, 0, 0, 0]);

  const rollDice = () => {
    const newDice = dice.map(() => (Math.random() > 0.5 ? 1 : 0));
    setDice(newDice);
    onDiceRolled(newDice);
  };

  React.useEffect(() => {
    rollDice();
  }, [playerTurn]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={bowlImage}
        resizeMode="contain"
        style={styles.bowlImage}
      >
        <View style={styles.diceContainer}>
          {dice.map((die, index) => (
            <Image
              key={index}
              source={die === 1 ? markedDice : unmarkedDice}
              style={styles.dice}
            />
          ))}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '50%',
  },
  dice: {
    width: 50,
    height: 50,
    margin: 5,
  },
});
