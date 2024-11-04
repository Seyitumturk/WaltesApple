import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    playerArea: {
        position: 'absolute',
        width: '100%',
        height: '50%',
        justifyContent: 'flex-end',
        zIndex: 2, // Increase this value to ensure it's above the border
        paddingBottom: 0,
    },
    player1Area: {
        paddingBottom: 150,
        top: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    player2Area: {
        bottom: 0,
        paddingTop: 15,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    stickContainer: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 15,
        paddingTop: 15,
    },
    generalPile: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#F7B329',
        borderRadius: 15, // Add this to round the outer container
    },
    generalPileContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 8,
        borderRadius: 15,
    },
    generalPileTitle: {
        backgroundColor: "transparent",
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    personalPile: {
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        marginBottom: -30,
        paddingBottom: 30,
    },
    personalPileContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingVertical: 8,
    },
    personalPileTitle: {
        backgroundColor: 'transparent', // Remove background color
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginLeft: 10,
        // Remove any shadow properties if they exist
    },
    button: {
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    iconAndCountWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 40,
        height: 60,
        marginHorizontal: 5,
    },
    countText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 8,
    },
    swapIcon: {
        marginHorizontal: 10,
    },
    replacementContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    replacementTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    replacementText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginHorizontal: 5,
    },
    debtContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 5,
    },
    askButton: {
        backgroundColor: 'rgba(76, 175, 80, 0.8)', // Semi-transparent green
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginRight: 10,
    },
    askButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    debtText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    confettiOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: screenWidth,
        height: screenHeight / 2, // Adjust this if needed
        zIndex: 1000001, // Increased to be above the Waltes text
        pointerEvents: 'none', // This allows interaction with elements below
    },
    waltesTextContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000000,
    },
    waltesText: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#FFD700', // Gold color
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        fontFamily: 'Impact, Haettenschweiler, Franklin Gothic Bold, Charcoal, Helvetica Inserat, Bitstream Vera Sans Bold, Arial Black, sans serif',
    },
    // Add any other styles used in PlayerArea component

    // New styles for tutorial navigation
    tutorialNavigation: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000005, // Increase this to ensure it's above the tutorial overlay
    },
    tutorialButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tutorialButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },

    winningAnimationContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000002,
        pointerEvents: 'none',
    },

    darkCircleOverlay: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        overflow: 'hidden', // This ensures the image stays within the circle
    },

    winningIconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    winningIcon: {
        width: 80,
        height: 100,
        marginBottom: 10,
    },

    waltesText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        textAlign: 'center',
    },

    generalPileContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    replacementText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        paddingVertical: 5,
        numberOfLines: 1,
        ellipsizeMode: 'tail',
    },
    swapAnimationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        height: 60,
    },
    swapStickIcon: {
        width: 40,
        height: 60,
        marginHorizontal: 15,
    },
    swapText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    animationContainer: {
        width: '100%',
        height: 76,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    swapGroup: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    swapIconContainer: {
        marginHorizontal: 20,
    },
    swapAnimationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 15,
        padding: 15,
        marginTop: 10,
    },
    swapStickIcon: {
        width: 40,
        height: 60,
        marginHorizontal: 5,
    },
    swapText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    streakContainer: {
        position: 'absolute',
        right: 20,
        top: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 15,
        padding: 8,
        zIndex: 1000003,
    },
    streakText: {
        marginLeft: 5,
        fontWeight: 'bold',
        fontSize: 16,
    },
    superWaltesText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF4500',
        textShadowColor: 'rgba(255, 69, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        top: -25,
        zIndex: 1001,
    },
    stageNotification: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 10,
        padding: 10,
        zIndex: 1000004,
    },
    stageNotificationText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    debtModeContainer: {
        minHeight: 80, // Reduced height
        justifyContent: 'center',
        paddingVertical: 10,
    },
    debtModeContent: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    debtModeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 15,
    },
    kingPinSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    debtInfoSection: {
        flex: 1,
        alignItems: 'center',
        marginLeft: 10,
    },
    askButton: {
        backgroundColor: '#F7B329',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 5,
        width: '80%',
    },
    askButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    debtText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    kingPinNotification: {
        position: 'absolute',
        top: 100,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(218, 165, 32, 0.9)',
        borderRadius: 10,
        padding: 10,
        zIndex: 1000005,
    },
    kingPinNotificationText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});

export default styles;
