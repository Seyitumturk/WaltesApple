import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const diceContainerSize = 150;

const styles = StyleSheet.create({
    bowlImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        transform: [{ scale: 0.83 }],
        zIndex: 1,
    },
    playerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginBottom: 10,
    },
    generalPileTitle: {
        backgroundColor: "#BF8A1F",
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    personalPileTitle: {
        backgroundColor: "#FDA10E",
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreTrackerContainer: {
        position: 'absolute',
        left: 0, // Stick to the left edge of the screen
        top: 0, // Start from the top of the screen
        bottom: 0, // Extend to the bottom of the screen
        width: 20, // Adjust the width of the score tracker
        flexDirection: 'column',
        zIndex: 10000, // Ensure it's above other elements
    },

    askButton: {
        backgroundColor: '#FDA10E',
        padding: 10,
        marginTop: 5,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#805c15',
        zIndex: 11, // Ensure it is above other elements
    },
    askButtonText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    personalPile: {
        position: 'relative', // Ensure this container can be covered by the overlay
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#D68402',
        marginBottom: -50, // Extend the background color downwards without affecting the position
        paddingBottom: 50, // Maintain the original padding if needed
    },
    backgroundImage: {
        opacity: '0.5',
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
    nonOverlappingDebtContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%', // Place it in the middle of the screen
        alignItems: 'center',
        zIndex: 10000000000000000, // Ensure it's above other components
    },
    debtRequestButton: {
        backgroundColor: '#49350D',
        padding: 10,
        borderRadius: 5,
        width: '80%', // Make buttons wider for easier access
        alignItems: 'center', // Center text inside the button
        marginVertical: 5, // Add vertical margin for spacing between buttons
        zIndex: 100000000033330000000, // Ensure it's above other components

    },
    debtRequestButtonText: {
        color: '#FDA10E',
        fontWeight: 'bold',
    },
    stickPileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 50,
        paddingBottom: 50,
    },
    boardContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    scoreIndicatorContainer: {
        position: 'absolute',
        bottom: -20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        height: 20,
        zIndex: 999999999999999999999999999999999999999999999999999999999999,
    },
    personalPileContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#F7B329',

    },
    tossOverlay: {
        position: 'absolute',
        left: 0,
        top: 0, // Adjust this to align with the top of the personal pile
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Ensure it appears above other elements
        borderTopLeftRadius: 300, // Adjust the radius value as needed
        borderTopRightRadius: 300, // Adjust the radius value as needed
        opacity: 0.7,
    },

    tossText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',  // Bright white text color
        textAlign: 'center',
        opacity: 1,  // Ensure full opacity for the text
        textShadowColor: 'rgba(0, 0, 0, 0.75)',  // Add shadow for contrast if needed
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        zIndex: 99999999, // Ensure it appears above other elements

    },

    replacementContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',  // Align elements vertically to center
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
        color: 'white',  // Use consistent white color for the text
        textAlign: 'center',
        marginHorizontal: 5,
    },
    icon: {
        width: 40,  // Make icons slightly bigger
        height: 60,  // Make icons slightly bigger
        marginHorizontal: 5,
    },
    swapIcon: {
        marginHorizontal: 10,
    },
    playerArea: {
        position: 'absolute',
        width: '100%',
        height: '50%',
        justifyContent: 'flex-end',
        zIndex: 100000000033330000000, // Ensure it's above other components
        paddingBottom: 0, // Ensure there's no padding affecting the position


    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'orange',
    },
    player1Area: {
        paddingBottom: 200,
        top: 0,
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
        backgroundColor: '#D68402',
        alignItems: 'center',  // Center content vertically

    },
    debtButtonsContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        zIndex: 10000,
        pointerEvents: 'auto',
    },

    countText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    animatedStick: {
        position: 'absolute',
        width: 60,
        height: 60,
        left: '50%',
        top: '50%',
        zIndex: 999999,
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
    textContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000000,
    },
    debtContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#805c15',
        borderRadius: 5,
        zIndex: 99999999999,
        width: '100%', // Stretch to full width
    },
    debtButton: {
        backgroundColor: '#FDA10E',
        padding: 10,
        borderRadius: 5,
        zIndex: 10001,
    },
    debtButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    debtText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 100, // Add margin for spacing
    },

    scoreText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
    topClickableArea: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '50%',
        zIndex: 10,
        pointerEvents: 'box-none',
    },
    bottomClickableArea: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '50%',
        zIndex: 10,
        pointerEvents: 'box-none',
    },
    alertBox: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    alertText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    waltesText: {
        position: 'absolute',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    blurredArea: {
        opacity: 0.2, // Make this darker (was 0.3)
    },
    tutorialOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Make this darker (was 0.5)
        zIndex: 1000000,
    },
    tutorialContent: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000002, // Ensure it's above the blurred area
    },
    player1TutorialContent: {
        bottom: '2%', // Keep at the bottom for player 1
    },
    player2TutorialContent: {
        top: '2%', // Move to the top for player 2
    },
    chatBox: {
        backgroundColor: '#1a1a1a', // Darker background
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        opacity: 1, // Ensure full opacity
    },
    chatBoxText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
        color: 'white',
    },
    chatBoxButton: {
        marginTop: 10,
    },
});

export default styles;