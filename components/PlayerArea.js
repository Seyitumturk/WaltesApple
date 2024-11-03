import React, { useRef, useState, useEffect } from 'react';
import { Animated, Easing, Image, StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './PlayerAreaStyles';

// Add this line to get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

import plainStickIcon from '../assets/plain-stick-icon.png';
import notchedStickIcon from '../assets/notched-stick-icon.png';
import kingPinIcon from '../assets/king-pin-icon.png';
import confettiGif from '../assets/confetti.gif';

// Import the new border image
// import borderImage from '../assets/ivy_border.png'; // Commented out for now

// Define the useCountAnimation hook here
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

// CircularButton Component
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

    return (
        <View style={styles.button}>
            <View style={styles.iconWrapper}>
                {/* Align icon and count next to each other */}
                <View style={styles.iconAndCountWrapper}>
                    <Image source={icons[type]} style={styles.icon} resizeMode="contain" />
                    <Animated.Text style={[styles.countText, animatedStyle, { marginLeft: 8 }]}>
                        {type === 'notched' && showNotchedValue ? `${animatedCount}/${notchedValue * count}` : animatedCount}
                    </Animated.Text>
                </View>
            </View>
        </View>
    );
};

// Update the WinningIconAnimation component
const WinningIconAnimation = ({ iconType, player, onAnimationComplete }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const positionAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const overlayOpacityAnim = useRef(new Animated.Value(0)).current;

  const icons = {
    plain: plainStickIcon,
    notched: notchedStickIcon,
    kingPin: kingPinIcon,
  };

  useEffect(() => {
    Animated.sequence([
      // Fade in overlay
      Animated.timing(overlayOpacityAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }),
      // Initial scale and position
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(positionAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Hold
      Animated.delay(800),
      // Move to personal pile and fade out
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(positionAnim, {
          toValue: 2,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(onAnimationComplete);
  }, []);

  const translateY = positionAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      0,                                    // Start at center
      player === 'player1' ? -50 : 50,      // Move slightly up/down
      player === 'player1' ? -150 : 150,    // Move to personal pile
    ],
  });

  const isPlayer1 = player === 'player1';

  return (
    <View style={styles.winningAnimationContainer}>
      {/* Dark circular overlay with wooden texture */}
      <Animated.View 
        style={[
          styles.darkCircleOverlay,
          { opacity: overlayOpacityAnim }
        ]} 
      >
        <ImageBackground
          source={require('../assets/wooden-texture.png')}
          style={{
            width: '100%',
            height: '100%',
            transform: [{ rotate: isPlayer1 ? '180deg' : '0deg' }]  // FLIPPED THIS
          }}
          imageStyle={{
            opacity: 0.7,
            backgroundColor: 'rgba(51, 25, 0, 0.85)',
          }}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.winningIconWrapper,
          {
            transform: [
              { scale: scaleAnim },
              { translateY },
              { rotate: isPlayer1 ? '180deg' : '0deg' }  // FLIPPED THIS
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Image
          source={icons[iconType]}
          style={styles.winningIcon}
          resizeMode="contain"
        />
        <Text style={styles.waltesText}>
          Waltes!
        </Text>
      </Animated.View>
    </View>
  );
};

// PlayerArea Component
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
    debt,
    handleAskDebtPayment,
    onPileClick,
    replacementMessage,
    style,
    onPersonalPileLayout,
    tutorialStep,
    onTutorialPrevious,
    showTutorial,
    scoreAmount, // Add this prop
    generalPileHighlightAnim, // Add this prop if it's not already included
    streaks,
    showStreakAnimation,
}) => {
    const otherPlayer = player === 'player1' ? 'player2' : 'player1';

    const playerStyle = player === 'player1' 
        ? [styles.playerArea, styles.player1Area] 
        : [styles.playerArea, styles.player2Area];
    const stickContainerStyle = player === 'player1' ? { transform: [{ rotate: '180deg' }] } : {};

    const personalPileBackgroundColor = player === 'player1' ? '#F76929' : '#29B7F7';

    const personalPileStyle = {
        backgroundColor: personalPileBackgroundColor,
    };

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(1)).current;  // Start with full opacity
    const swapAnim = useRef(new Animated.Value(0)).current;  // For swapping icons
    const initialTextOpacity = useRef(new Animated.Value(1)).current;  // Start with fully visible text
    const tossTextAnim = useRef(new Animated.Value(1)).current; // Animation for toss text
    const [title, setTitle] = useState("General Pile");  // State to manage the title

    const generalPileStyle = [
        styles.generalPile,
        // Remove or adjust this to keep opacity full
        tutorialStep === 3 && {
            opacity: generalPileHighlightAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1],  // Keep the opacity at 1
            }),
            zIndex: 1000002,
        },
    ];

    // Styling for the title text with fading background on the right
    const titleStyle = {
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Transparent background
        borderTopRightRadius: 20, // Rounded corner on the right
        borderBottomRightRadius: 20,
        alignSelf: 'flex-start', // Align title to the left
        paddingLeft: 15, // Padding for the text inside
        overflow: 'hidden',
    };

    // Separate animations for scale (native) and background color (JS)
    const titleBounceAnim = useRef(new Animated.Value(1)).current;
    const titleColorAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (playerTurn === (player === 'player1' ? 0 : 1)) {
            // Native driver animation (scale)
            const bounceAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(titleBounceAnim, {
                        toValue: 1.2,
                        duration: 600,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(titleBounceAnim, {
                        toValue: 1,
                        duration: 600,
                        easing: Easing.in(Easing.cubic),
                        useNativeDriver: true,
                    }),
                ])
            );

            // JS driver animation (background color)
            const colorAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(titleColorAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: false,
                    }),
                    Animated.timing(titleColorAnim, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: false,
                    }),
                ])
            );

            bounceAnimation.start();
            colorAnimation.start();

            return () => {
                bounceAnimation.stop();
                colorAnimation.stop();
                titleBounceAnim.setValue(1);
                titleColorAnim.setValue(0);
            };
        }
    }, [playerTurn, player]);

    const slideAnim = useRef(new Animated.Value(0)).current;  // For general pile items
    const textSlideAnim = useRef(new Animated.Value(-screenWidth)).current;  // For text
    const swapIconsAnim = useRef(new Animated.Value(0)).current;  // For swapping animation

    useEffect(() => {
        if (replacementMessage) {
            // Reset positions
            slideAnim.setValue(0);
            textSlideAnim.setValue(-screenWidth);
            swapIconsAnim.setValue(0);

            Animated.sequence([
                // 1. Slide out current content to the right
                Animated.timing(slideAnim, {
                    toValue: screenWidth,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                // 2. Slide in and show the text
                Animated.timing(textSlideAnim, {
                    toValue: 0,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                // 3. Hold text for reading
                Animated.delay(3000),
                // 4. Slide out text and begin swap animation
                Animated.parallel([
                    Animated.timing(textSlideAnim, {
                        toValue: screenWidth,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    // Start swap animation as text exits
                    Animated.sequence([
                        // Fade in swap animation
                        Animated.timing(swapIconsAnim, {
                            toValue: 1,
                            duration: 800,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        // Hold the swap animation
                        Animated.delay(3000),
                        // Fade out swap animation
                        Animated.timing(swapIconsAnim, {
                            toValue: 0,
                            duration: 800,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
                // 5. Slide in original content from left
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [replacementMessage]);

    useEffect(() => {
        if (playerTurn === (player === 'player1' ? 0 : 1)) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(tossTextAnim, {
                        toValue: 1.5,
                        duration: 500,
                        easing: Easing.bounce,
                        useNativeDriver: true,
                    }),
                    Animated.timing(tossTextAnim, {
                        toValue: 1,
                        duration: 500,
                        easing: Easing.bounce,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            tossTextAnim.setValue(1); // Reset animation if it's not the player's turn
        }
    }, [playerTurn]);

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

    const [checkmarkScale] = useState(new Animated.Value(1));

    const handleCheckmarkClick = () => {
        Animated.sequence([
            Animated.timing(checkmarkScale, {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(checkmarkScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start(() => {
            onTutorialNext();
        });
    };

    const renderTutorialOverlay = () => {
        switch (tutorialStep) {
            case 'bowl':
            case 'dice':
                return (
                    <View style={styles.tutorialContentWrapper}>
                        <View style={[styles.tutorialContent, player === 'player1' ? styles.player1TutorialContent : styles.player2TutorialContent]}>
                            <TouchableOpacity
                                style={styles.chatBox}
                                onPress={handleCheckmarkClick}
                            >
                                <View style={styles.chatBoxInner}>
                                    <Text style={[styles.chatBoxText, player === 'player1' ? styles.player1ChatBoxText : styles.player2ChatBoxText]}>
                                        {tutorialStep === 'bowl' && "This is the bowl where you'll toss the dice."}
                                        {tutorialStep === 'dice' && "These are the dice you'll use to play. Tap to toss them!"}
                                    </Text>
                                    <Animated.View
                                        style={[
                                            styles.chatBoxButton,
                                            player === 'player1' ? styles.player1ChatBoxButton : styles.player2ChatBoxButton,
                                            { transform: [{ scale: checkmarkScale }] }
                                        ]}
                                    >
                                        <MaterialIcons name="check-circle" size={40} color="#4CAF50" />
                                    </Animated.View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    const [showConfetti, setShowConfetti] = useState(false);
    const waltesTextAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (player === scoringPlayer) {
            setShowConfetti(true);
            Animated.sequence([
                Animated.timing(waltesTextAnim, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.bounce,
                    useNativeDriver: true,
                }),
                Animated.timing(waltesTextAnim, {
                    toValue: 0,
                    duration: 500,
                    delay: 2000, // Keep the text visible for 2 seconds
                    easing: Easing.ease,
                    useNativeDriver: true,
                })
            ]).start();
            setTimeout(() => setShowConfetti(false), 3000);
        }
    }, [player, scoringPlayer]);

    const [tossText, setTossText] = useState('CLICK');
    const tossTextIndex = useRef(0);
    const tossTexts = ['CLICK', 'TO', 'TOSS'];

    useEffect(() => {
        if (playerTurn === (player === 'player1' ? 0 : 1)) {
            const interval = setInterval(() => {
                tossTextIndex.current = (tossTextIndex.current + 1) % tossTexts.length;
                setTossText(tossTexts[tossTextIndex.current]);
            }, 1000); // Change text every second

            return () => clearInterval(interval);
        }
    }, [playerTurn, player]);

    const generalPileRef = useRef(null);
    const personalPileRef = useRef(null);
    const playerAreaRef = useRef(null);

    const handleAskButtonClick = () => {
        console.log(`Ask button clicked for ${player}`);
        handleAskDebtPayment(player);
    };

    const personalPileTitle = playerTurn === (player === 'player1' ? 0 : 1) 
        ? "Click to Toss"
        : "Personal Pile";

    const [showWinningAnimation, setShowWinningAnimation] = useState(false);
    const [winningIconType, setWinningIconType] = useState(null);

    useEffect(() => {
        if (player === scoringPlayer && scoreAmount > 0) {
            setWinningIconType(scoreAmount === 5 ? 'notched' : 'plain');
            setShowWinningAnimation(true);
        }
    }, [player, scoringPlayer, scoreAmount]);

    const renderStreakIndicator = () => {
        const streak = streaks[player];
        if (streak < 2) return null;

        const isThreeStreak = streak === 3;
        const color = isThreeStreak ? '#FFD700' : '#FF4500';
        
        return (
            <Animated.View
                style={[
                    styles.streakContainer,
                    {
                        transform: [
                            { scale: showStreakAnimation ? 1.2 : 1 },
                            { rotate: player === 'player1' ? '180deg' : '0deg' }
                        ]
                    }
                ]}
            >
                <MaterialCommunityIcons
                    name={isThreeStreak ? "crown" : "fire"}
                    size={24}
                    color={color}
                />
                <Text style={[styles.streakText, { color }]}>
                    {isThreeStreak ? 'Kisikuiskw!' : `${streak}x`}
                </Text>
            </Animated.View>
        );
    };

    return (
        <View style={[styles.playerArea, playerStyle, style]} ref={playerAreaRef}>
            {renderStreakIndicator()}

            {showWinningAnimation && (
                <>
                    <View style={styles.darkOverlay} />
                    <WinningIconAnimation
                        iconType={winningIconType}
                        player={player}
                        onAnimationComplete={() => setShowWinningAnimation(false)}
                    />
                </>
            )}

            <View style={[styles.stickContainer, stickContainerStyle]}>
                <Animated.View style={generalPileStyle} ref={generalPileRef}>
                    <Animated.Text style={[styles.generalPileTitle, { opacity: fadeAnim }]}>
                        {title}
                    </Animated.Text>
                    <View style={styles.generalPileContainer}>
                        {replacementMessage ? (
                            <View style={styles.animationContainer}>
                                {/* Original content */}
                                <Animated.View 
                                    style={[
                                        styles.generalPileContent,
                                        {
                                            position: 'absolute',
                                            width: '100%',
                                            transform: [{ translateX: slideAnim }],
                                        }
                                    ]}
                                >
                                    <CircularButton type="plain" count={sticks.general.plain} />
                                    <CircularButton type="notched" count={sticks.general.notched} />
                                    <CircularButton type="kingPin" count={sticks.general.kingPin} />
                                </Animated.View>

                                {/* Replacement text */}
                                <Animated.View 
                                    style={[
                                        styles.replacementContainer,
                                        {
                                            position: 'absolute',
                                            width: '100%',
                                            transform: [{ translateX: textSlideAnim }],
                                        }
                                    ]}
                                >
                                    <Text style={styles.replacementText}>{replacementMessage}</Text>
                                </Animated.View>

                                {/* Swap animation */}
                                <Animated.View 
                                    style={[
                                        styles.swapAnimationContainer,
                                        {
                                            position: 'absolute',
                                            width: '100%',
                                            opacity: swapIconsAnim,
                                            transform: [{ scale: swapIconsAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.8, 1]
                                            })}],
                                        }
                                    ]}
                                >
                                    <View style={styles.swapGroup}>
                                        <Text style={styles.swapText}>15x</Text>
                                        <Image
                                            source={plainStickIcon}
                                            style={styles.swapStickIcon}
                                        />
                                    </View>
                                    
                                    <Animated.View style={[
                                        styles.swapIconContainer,
                                        {
                                            transform: [{
                                                rotate: swapIconsAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0deg', '360deg']
                                                })
                                            }]
                                        }
                                    ]}>
                                        <MaterialIcons 
                                            name="swap-horiz" 
                                            size={50}
                                            color="white" 
                                            style={styles.swapIcon}
                                        />
                                    </Animated.View>
                                    
                                    <Image
                                        source={notchedStickIcon}
                                        style={styles.swapStickIcon}
                                    />
                                </Animated.View>
                            </View>
                        ) : (
                            (!isGeneralPileExhausted || sticks.general.kingPin > 0) ? (
                                <>
                                    <CircularButton type="plain" count={sticks.general.plain} />
                                    <CircularButton type="notched" count={sticks.general.notched} />
                                    <CircularButton type="kingPin" count={sticks.general.kingPin} />
                                </>
                            ) : (
                                <View style={styles.debtContainer}>
                                    {debt[player] > 0 && (
                                        <TouchableOpacity
                                            style={styles.askButton}
                                            onPress={() => handleAskDebtPayment(player)}
                                        >
                                            <Text style={styles.askButtonText}>Ask for Payment</Text>
                                        </TouchableOpacity>
                                    )}
                                    <Text style={styles.debtText}>
                                        {debt[player] > 0 ? `Debt to collect: ${debt[player]}` : 
                                         debt[otherPlayer] > 0 ? `Debt to pay: ${debt[otherPlayer]}` : 'No debt'}
                                    </Text>
                                </View>
                            )
                        )}
                    </View>
                </Animated.View>
                <TouchableOpacity
                    style={[styles.personalPile, personalPileStyle]}
                    onPress={() => onPileClick(player)}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        onPersonalPileLayout(height);
                    }}
                    ref={personalPileRef}
                >
                    {/* Wrap the text in two Animated.View components */}
                    <Animated.View
                        style={{
                            transform: [{ scale: titleBounceAnim }],
                            zIndex: 1000005,
                            // Add margin when it's "Toss to Click"
                            marginLeft: playerTurn === (player === 'player1' ? 0 : 1) ? 25 : 0,  // Extra space for animation
                        }}
                    >
                        <Animated.View
                            style={{
                                backgroundColor: titleColorAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['#F7B329', player === 'player1' ? '#F76929' : '#29B7F7']
                                }),
                                borderRadius: 15,
                                // Adjust width to accommodate the text
                                minWidth: playerTurn === (player === 'player1' ? 0 : 1) ? 120 : 'auto',
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: playerTurn === (player === 'player1' ? 0 : 1) ? 18 : 16,
                                    paddingHorizontal: 15,
                                    paddingVertical: 8,
                                }}
                            >
                                {personalPileTitle}
                            </Text>
                        </Animated.View>
                    </Animated.View>

                    <View style={styles.personalPileContainer}>
                        <CircularButton type="plain" count={sticks[player].plain} />
                        <CircularButton
                            type="notched"
                            count={sticks[player].notched}
                            notchedValue={sticks[player].notchedValue}
                            showNotchedValue={isGeneralPileExhausted}
                        />
                        <CircularButton type="kingPin" count={sticks[player].kingPin} />
                    </View>
                </TouchableOpacity>
            </View>
            {renderTutorialOverlay()}
        </View>
    );
};

export default PlayerArea;
