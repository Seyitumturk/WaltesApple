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
        paddingBottom: 190,
        top: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    player2Area: {
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    stickContainer: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 30,
        paddingTop: 30,
    },
    generalPile: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#F7B329',
    },
    generalPileContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 10, // Add vertical padding
    },
    generalPileTitle: {
        backgroundColor: "#BF8A1F",
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    personalPile: {
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        marginBottom: -50,
        paddingBottom: 50,
    },
    personalPileContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',  // Add this to allow absolute positioning of children
        paddingVertical: 10, // Add vertical padding
    },
    personalPileTitle: {
        backgroundColor: '#F7B329',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
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
    tossOverlay: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -20 }],
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    tossTextContainer: {
        padding: 10,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
        width: 100, // Set a fixed width to accommodate the longest word
        alignItems: 'center', // Center the text horizontally
    },
    tossText: {
        fontSize: 24,
        color: '#fff',
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        textAlign: 'center', // Center the text
    },
    scoreTextInPile: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        marginTop: 10,
        zIndex: 9999999999,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
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
});

export default styles;
