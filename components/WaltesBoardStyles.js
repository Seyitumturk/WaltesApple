import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Update the calculations at the top
const getBowlSize = () => {
    const smallerDimension = Math.min(screenWidth, screenHeight);
    // Very slightly increase size
    const maxSafeHeight = screenHeight * 0.44; // Increased from 0.43
    const maxSafeWidth = screenWidth * 0.87;   // Increased from 0.85
    
    // Use the smaller of the two to ensure no overlap
    return Math.min(maxSafeHeight * 2, maxSafeWidth, smallerDimension * 0.87);
};

const bowlSize = getBowlSize();

// Calculate vertical position that ensures no overlap
const getVerticalOffset = () => {
    const playerAreaHeight = screenHeight * 0.27;
    const availableMiddleSpace = screenHeight - (playerAreaHeight * 2);
    // Increase the upward offset slightly
    return ((availableMiddleSpace - bowlSize) / 2) - (screenHeight * 0.025); // Increased from 0.02
};

const verticalOffset = getVerticalOffset();

const styles = StyleSheet.create({
    bowlImage: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: bowlSize,
        height: bowlSize,
        transform: [
            { translateX: -bowlSize / 2 },
            { translateY: -bowlSize / 2 + verticalOffset },
            { scale: 0.87 }  // Increased from 0.85
        ],
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    playerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginBottom: 10,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F76929', // Your brand orange
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(253, 161, 14, 0.2)', // Warm overlay
        zIndex: 1,
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
    backgroundImage: {
        opacity: 0.5,
    },
    diceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: bowlSize * 0.7,
        height: bowlSize * 0.7,
        position: 'absolute',
        top: '50%',
        left: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [
            { translateX: -(bowlSize * 0.7) / 2 },
            { translateY: -(bowlSize * 0.7) / 2 },
        ],
        zIndex: 3,
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
        zIndex: 1000000000000000,
    },
    debtRequestButton: {
        backgroundColor: '#49350D',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        marginVertical: 5,
        zIndex: 1000000000333300000,
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
        zIndex: 9999999999999999999999999999999999999999999999999999,
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
    swapIcon: {
        marginHorizontal: 10,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#D35400', // Deep orange base
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
    animatedStick: {
        position: 'absolute',
        width: 60,
        height: 60,
        left: '50%',
        top: '50%',
        zIndex: 999999,
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
        zIndex: 9999999999,
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
        bottom: '10%',
        marginTop: 0,
    },
    player2TutorialContent: {
        top: '10%',
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
        flexDirection: 'column',  // Changed from row to column to properly layout title and icons
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor: 'rgba(26, 26, 26, 0.7)',
        borderRadius: 10,
        padding: 20,
        zIndex: 1000002,
    },
    stickCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
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
        marginLeft: 8,
    },
    titleWrapper: {
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    titleBackground: {
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
    },
    stickIcon: {
        width: 60,
        height: 75,
        marginRight: 10,
    },
    generalPileTitle: {
        backgroundColor: "#BF8A1F",  // Keep the background color
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        color: 'white',  // Ensure text color is white
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    playerArea: {
        position: 'absolute',
        width: '100%',
        height: '27%', // Fixed height for player areas
        justifyContent: 'flex-end',
        zIndex: 2,
    },
    player1Area: {
        bottom: 0,
        paddingBottom: 0,
    },
    player2Area: {
        top: 0,
        paddingTop: 0,
    },
});

export default styles;
