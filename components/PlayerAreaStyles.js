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
    animatedStick: {
        position: 'absolute',
        width: 60,
        height: 60,
        zIndex: 1000003,
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
        zIndex: 1000000,
    },

    waltesText: {
        position: 'absolute',
        bottom: -50,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        width: 200,
        left: -60,
    },

    waltesTextPlayer2: {
        bottom: 50,
        transform: [{ rotate: '180deg' }], // Fixed rotation for player 2
    },
});

export default styles;
