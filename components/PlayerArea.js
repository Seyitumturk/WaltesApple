import React, { useRef, useState, useEffect } from 'react';
import { Animated, Easing, Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './WaltesBoardStyles';

import plainStickIcon from '../assets/plain-stick-icon.png';
import notchedStickIcon from '../assets/notched-stick-icon.png';
import kingPinIcon from '../assets/king-pin-icon.png';

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
    onTutorialNext,
    generalPileHighlightAnim
}) => {
    const playerStyle = player === 'player1' ? styles.player1Area : styles.player2Area;
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

    useEffect(() => {
        if (replacementMessage) {
            // Reset animations before starting
            fadeAnim.setValue(1); // Start with full opacity
            swapAnim.setValue(0);
            initialTextOpacity.setValue(1); // Ensure text starts visible
            setTitle(replacementMessage); // Set the title to the replacement message

            // Sequential animations for the effect
            Animated.sequence([
                // Display the initial text for 2.5 seconds
                Animated.timing(initialTextOpacity, {
                    toValue: 1,
                    duration: 2500, // Extended duration
                    useNativeDriver: true,
                }),
                Animated.timing(initialTextOpacity, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                // Start the icon swap animation
                Animated.timing(swapAnim, {
                    toValue: 1, // Move icons
                    duration: 3000, // Extended duration for smooth transition
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                // Fade out the entire animation
                Animated.timing(fadeAnim, {
                    toValue: 0, // Fade out everything
                    duration: 1000, // Smooth fade-out
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Reset title to "General Pile" after the animation completes
                setTitle("General Pile");
                fadeAnim.setValue(1); // Restore full opacity for the title
            });
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

    return (
        <View style={[styles.playerArea, playerStyle, style]}>
            <View style={[styles.stickContainer, stickContainerStyle]}>
                <Animated.View style={generalPileStyle}>
                    <Animated.Text style={[styles.generalPileTitle, titleStyle, { opacity: fadeAnim }]}>
                        {title}
                    </Animated.Text>
                    <View style={styles.generalPileContainer}>
                        {replacementMessage ? (
                            <Animated.View style={[styles.replacementContainer, { opacity: fadeAnim }]}>
                                <View style={styles.replacementTextContainer}>
                                    <Animated.View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Animated.Text style={[styles.replacementText, {
                                            transform: [{
                                                translateX: swapAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [-30, 0],
                                                }),
                                            }],
                                        }]}>
                                            15x
                                        </Animated.Text>
                                        <Animated.Image
                                            source={require('../assets/plain-stick-icon.png')}
                                            style={[styles.icon, {
                                                transform: [{
                                                    translateX: swapAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [-30, 0],
                                                    }),
                                                }],
                                            }]}
                                        />
                                        <Animated.View style={{
                                            opacity: fadeAnim,
                                            transform: [{
                                                scale: swapAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [1, 1.2],
                                                }),
                                            }],
                                        }}>
                                            <MaterialIcons name="swap-horiz" size={50} color="white" style={styles.swapIcon} />
                                        </Animated.View>
                                        <Animated.Image
                                            source={require('../assets/notched-stick-icon.png')}
                                            style={[styles.icon, {
                                                transform: [{
                                                    translateX: swapAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [30, 0],
                                                    }),
                                                }],
                                            }]}
                                        />
                                    </Animated.View>
                                </View>
                            </Animated.View>
                        ) : (
                            (!isGeneralPileExhausted || sticks.general.kingPin > 0) ? (
                                <>
                                    <CircularButton type="plain" count={sticks.general.plain} />
                                    <CircularButton type="notched" count={sticks.general.notched} />
                                    <CircularButton type="kingPin" count={sticks.general.kingPin} />
                                </>
                            ) : (
                                <View style={styles.debtContainer}>
                                    <TouchableOpacity style={styles.askButton} onPress={() => handleAskDebtPayment(player)}>
                                        <Text style={styles.askButtonText}>Ask</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.debtText}>Debt: {debt[player]}</Text>
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
                        onPersonalPileLayout(height); // Pass the height up
                    }}
                >
                    <Text style={[styles.personalPileTitle, titleStyle]}>Personal Pile</Text>

                    <View style={styles.personalPileContainer}>
                        <CircularButton type="plain" count={sticks[player].plain} />
                        <CircularButton
                            type="notched"
                            count={sticks[player].notched}
                            notchedValue={sticks[player].notchedValue}
                            showNotchedValue={isGeneralPileExhausted}
                        />
                        <CircularButton type="kingPin" count={sticks[player].kingPin} />

                        {playerTurn === (player === 'player1' ? 0 : 1) && (
                            <Animated.View style={[styles.tossOverlay, { backgroundColor: personalPileBackgroundColor }]}>
                                <Animated.Text
                                    style={[
                                        styles.tossText,
                                        {
                                            transform: [{ scale: tossTextAnim }],
                                            opacity: 1,
                                            fontWeight: 'bold',
                                        },
                                    ]}
                                >
                                    toss
                                </Animated.Text>
                            </Animated.View>
                        )}

                        {player === scoringPlayer && (
                            <>
                                <Animated.View
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        borderRadius: 20,
                                        paddingVertical: 5,
                                        paddingHorizontal: 10,
                                        opacity: opacityAnim,
                                        position: 'absolute',
                                        alignSelf: 'center',
                                        top: '50%',
                                        transform: [{ translateY: -10 }],
                                    }}
                                >
                                    <Text style={styles.scoreTextInPile}>
                                        Waltes!
                                    </Text>
                                </Animated.View>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
            {renderTutorialOverlay()}
        </View>
    );
};

export default PlayerArea;
