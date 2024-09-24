import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const diceContainerSize = 150;

const styles = StyleSheet.create({
    bowlImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1, // Ensure the bowl maintains its aspect ratio

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
        backgroundColor: '#F7B329',
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
        left: 0,
        top: 0,
        bottom: 0,
        width: 20,
        flexDirection: 'column',
        zIndex: 10000,
    }, bowlContainer: {
        flex: 1, // Take available space between PlayerAreas
        justifyContent: 'center', // Vertically center the bowl
        alignItems: 'center', // Horizontally center the bowl
        paddingHorizontal: 20, // Add padding to avoid overlapping
    },
    askButton: {
        backgroundColor: '#FDA10E',
        padding: 10,
        marginTop: 5,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#805c15',
        zIndex: 11,
    },
    askButtonText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    personalPile: {
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: "#FDA10E",
        marginBottom: -50,
        paddingBottom: 50,
    },
    backgroundImage: {
        opacity: 0.5,
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
        top: '50%',
        alignItems: 'center',
        zIndex: 10000000000000000,
    },
    debtRequestButton: {
        backgroundColor: '#49350D',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        marginVertical: 5,
        zIndex: 100000000033330000000,
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
        backgroundColor: "#FDA10E",

    },
    tossOverlay: {
        position: 'absolute',
        left: '50%',   // Center horizontally
        top: '50%',    // Center vertically
        transform: [{ translateX: -50 }, { translateY: -50 }],  // Offset to perfectly center it
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        width: 100,    // Smaller width (adjust as necessary)
        height: 120,   // Smaller height (adjust as necessary)
        borderRadius: 60,  // Make it circular/oval like a fingerprint
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent black background
        paddingVertical: 10,  // Enough padding to fit the text
        paddingHorizontal: 15,
    },
    tossText: {
        fontSize: 18,  // Adjust font size to fit in the container
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        opacity: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        zIndex: 99999999,
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
    icon: {
        width: 40,
        height: 60,
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
        zIndex: 100000000033330000000,
        paddingBottom: 0,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'orange',
    },
    player1Area: {
        paddingBottom: 190,  // Adjust this value to move it up, reduced from 200
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
        backgroundColor: '#D68402',
        alignItems: 'center',
        opacity: 1, // Ensure full opacity
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
        width: '100%',
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
        marginLeft: 100,
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
        opacity: 0.2,
    },
    tutorialContentWrapper: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000000,
        pointerEvents: 'box-none',
    },
    tutorialContent: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000002,
    },
    player1TutorialContent: {
        bottom: '10%',  // Move Player 1's tutorial content closer to the center from the bottom
        marginTop: 0,  // Remove any margin that pushes it too far up
    },
    player2TutorialContent: {
        top: '10%',  // Move Player 2's tutorial content closer to the center from the top
        transform: [{ rotate: '180deg' }],

    },
    chatBox: {
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        borderRadius: 20,
        padding: 15,
        width: '90%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    chatBoxInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    chatBoxText: {
        fontSize: 16,
        flex: 1,
        color: 'white',
        lineHeight: 22,
    },
    player1ChatBoxText: {
        transform: [{ rotate: '180deg' }],
    },
    chatBoxButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        marginLeft: 10,
    },
    player1ChatBoxButton: {
        transform: [{ rotate: '180deg' }],
    },
    tutorialStickContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor: 'rgba(26, 26, 26, 0.7)',
        borderRadius: 10,
        padding: 10,
    },
    stickIconsContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -150 }, { translateY: -50 }],
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000002,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 10,
        padding: 20,
        width: 300,
    },
    stickIcon: {
        width: 60,
        height: 75,
        marginBottom: 5,
    },
    stickCount: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    stickTotal: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
    },
});

export default styles;