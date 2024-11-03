import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Animated,
  Modal,
  ImageBackground,
  Image
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { knowledgeNuggets, categories } from './knowledgeNuggets';
import Svg, { Path } from 'react-native-svg';
const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width: screenWidth } = Dimensions.get('window');

const KnowledgeMap = ({ unlockedNuggets, totalPoints, onClose }) => {
  const [selectedNugget, setSelectedNugget] = useState(null);
  const [pathAnimations] = useState(
    knowledgeNuggets.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Animate paths sequentially
    const animatePaths = () => {
      const animations = pathAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          delay: index * 300,
          useNativeDriver: true,
        })
      );
      Animated.stagger(200, animations).start();
    };

    animatePaths();
  }, []);

  const renderDecorations = (index) => {
    const isLeft = index % 2 === 0;
    const xPos = isLeft ? screenWidth * 0.15 : screenWidth * 0.85;
    const yPos = Math.floor(index / 2) * 200 + 150;

    return (
      <Image
        key={`decoration-${index}`}
        source={index % 3 === 0 ? 
          require('../assets/tree.png') : 
          index % 3 === 1 ? 
            require('../assets/rock.png') : 
            require('../assets/bush.png')
        }
        style={[
          styles.decoration,
          {
            left: xPos,
            top: yPos,
            transform: [{ scale: 0.8 }]
          }
        ]}
      />
    );
  };

  const renderPath = (index) => {
    if (index === 0) return null;

    const prevNugget = knowledgeNuggets[index - 1];
    const currentNugget = knowledgeNuggets[index];
    const prevUnlocked = unlockedNuggets.includes(prevNugget.id);
    const currentUnlocked = unlockedNuggets.includes(currentNugget.id);

    const startX = (index - 1) % 2 === 0 ? screenWidth * 0.25 : screenWidth * 0.75;
    const startY = Math.floor((index - 1) / 2) * 200 + 100;
    const endX = index % 2 === 0 ? screenWidth * 0.25 : screenWidth * 0.75;
    const endY = Math.floor(index / 2) * 200 + 100;

    // Calculate control points for the curve
    const midY = (startY + endY) / 2;
    const controlPoint1X = startX + (endX - startX) * 0.25;
    const controlPoint1Y = midY + (Math.random() - 0.5) * 100;
    const controlPoint2X = startX + (endX - startX) * 0.75;
    const controlPoint2Y = midY + (Math.random() - 0.5) * 100;

    // Create SVG path
    const path = `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;

    return (
      <Animated.View
        key={`path-${index}`}
        style={[
          styles.pathContainer,
          {
            position: 'absolute',
            left: 0,
            top: 0,
            width: screenWidth,
            height: endY + 100,
            opacity: pathAnimations[index],
          }
        ]}
      >
        <Svg width={screenWidth} height={endY + 100}>
          <AnimatedPath
            d={path}
            stroke={prevUnlocked && currentUnlocked ? '#F7B329' : '#666'}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={[1, 10]}
          />
        </Svg>
        
        {/* Add small decorative elements along the path */}
        {[0.3, 0.6].map((position, i) => {
          const x = startX + (endX - startX) * position;
          const y = startY + (endY - startY) * position + 
            Math.sin(position * Math.PI) * (Math.random() * 20);
          
          return (
            <Image
              key={`path-decoration-${index}-${i}`}
              source={i % 2 === 0 ? 
                require('../assets/leaf.png') : 
                require('../assets/flower.png')
              }
              style={[
                styles.pathDecoration,
                {
                  left: x - 10,
                  top: y - 10,
                  transform: [{ rotate: `${Math.random() * 360}deg` }],
                }
              ]}
            />
          );
        })}
      </Animated.View>
    );
  };

  const renderNugget = (nugget, index, total) => {
    const isUnlocked = unlockedNuggets.includes(nugget.id);
    const row = Math.floor(index / 2);
    const isLeft = index % 2 === 0;
    
    const xPos = isLeft ? screenWidth * 0.25 : screenWidth * 0.75;
    const yPos = row * 200 + 100;

    return (
      <TouchableOpacity
        key={nugget.id}
        style={[styles.nuggetContainer, { left: xPos - 50, top: yPos - 50 }]}
        onPress={() => isUnlocked && setSelectedNugget(nugget)}
        activeOpacity={isUnlocked ? 0.7 : 1}
      >
        <ImageBackground
          source={require('../assets/wooden-texture.png')}
          style={[
            styles.nugget,
            {
              backgroundColor: isUnlocked ? categories[nugget.category] : '#444',
              opacity: isUnlocked ? 1 : 0.5,
            }
          ]}
          imageStyle={{ opacity: 0.3, borderRadius: 50 }}
        >
          <MaterialIcons 
            name={isUnlocked ? nugget.icon : 'lock'} 
            size={30} 
            color="white" 
          />
          <Text style={styles.nuggetTitle}>{nugget.title}</Text>
          <Text style={styles.pointsRequired}>
            {isUnlocked ? 'Unlocked' : `${nugget.pointsToUnlock} points`}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground 
      source={require('../assets/wooden-texture.png')} 
      style={styles.container}
      imageStyle={{ opacity: 0.1 }}
    >
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <MaterialIcons name="close" size={30} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Mi'kmaq Knowledge Journey</Text>
      <Text style={styles.points}>Total Points: {totalPoints}</Text>
      
      <ScrollView style={styles.mapContainer}>
        <View style={styles.pathsContainer}>
          {/* Render decorative elements */}
          {knowledgeNuggets.map((_, index) => renderDecorations(index))}
          
          {/* Render connecting paths */}
          {knowledgeNuggets.map((_, index) => renderPath(index))}
          
          {/* Render nuggets */}
          {knowledgeNuggets.map((nugget, index) => renderNugget(nugget, index))}
        </View>
      </ScrollView>

      <Modal
        visible={selectedNugget !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedNugget(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setSelectedNugget(null)}
            >
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
            {selectedNugget && (
              <>
                <MaterialIcons 
                  name={selectedNugget.icon} 
                  size={40} 
                  color={categories[selectedNugget.category]} 
                />
                <Text style={styles.modalTitle}>{selectedNugget.title}</Text>
                <Text style={styles.modalCategory}>{selectedNugget.category}</Text>
                <Text style={styles.modalDescription}>{selectedNugget.description}</Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 25,
  },
  title: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  points: {
    fontSize: 20,
    color: '#F7B329',
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  mapContainer: {
    flex: 1,
    marginTop: 20,
  },
  pathsContainer: {
    width: screenWidth,
    height: 1200,
    position: 'relative',
    paddingTop: 20,
  },
  pathContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  pathDecoration: {
    position: 'absolute',
    width: 20,
    height: 20,
    opacity: 0.6,
  },
  nuggetContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  nugget: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: '#F7B329',
  },
  nuggetTitle: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pointsRequired: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F7B329',
  },
  modalCloseButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 10,
  },
  modalTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  modalCategory: {
    fontSize: 16,
    color: '#F7B329',
    marginTop: 5,
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
  },
  decoration: {
    position: 'absolute',
    width: 40,
    height: 40,
    opacity: 0.6,
  },
});

export default KnowledgeMap;