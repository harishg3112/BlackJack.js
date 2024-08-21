const deck = [];

const dealer = [];

const player = [];

const selectedRandomIndex = [];

const startingHands = new Map ();

const getRandomIndex = () => {
    return Math.floor(Math.random() * deck.length) + 0;
};

const scoreLogic = (card) => {
    if (card.value === 'Ace') return 1;
    if (card.value === 'King' || card.value === 'Queen' || card.value === 'Jack') return 10;
    return card.value;
};

const createValuesAlone = (suitName) => {

    const nameValue = ["Ace", "King", "Queen", "Jack"];

    for (let v = 2; v < 11; v++) {
        let card = { suit: suitName, value: v };
        deck.push(card);
    }

    for (let i = 0; i < nameValue.length; i++) {
        let card = { suit: suitName, value: nameValue[i] };
        deck.push(card);
    }
};

const firstHandDealing = (person,string,cardLimit) => {
    for (let i = 1 ; i >= 1 ; i++) {           
        
        if (person.length === cardLimit) break;
        
        let randomIndex = getRandomIndex();
        if (selectedRandomIndex.includes(randomIndex)) continue;
        selectedRandomIndex.push(randomIndex);

        person.push(deck[randomIndex]);           
        startingHands.set(`${string} Dealing ${cardLimit}` , deck[randomIndex])

        delete deck[randomIndex];
    }
};

const generateDeckOfCards = () => {

	const suits = ["Spades", "Clubs", "Hearts", "Diamonds"];

	for (let i = 0; i < suits.length; i++) {
		createValuesAlone(suits[i]);
	}
};

const startFirstHandDealing = () => {
    
    generateDeckOfCards();

    const firstHandDealingFormat = [
        {person : dealer, string : 'Dealer', cardLimit : 1},
        {person : player, string : 'Player', cardLimit : 1},
        {person : dealer, string : 'Dealer', cardLimit : 2},
        {person : player, string : 'Player', cardLimit : 2},
    ];

    for (let i = 0 ; i < firstHandDealingFormat.length ; i++) {

        let person = firstHandDealingFormat[i].person;
        let string = firstHandDealingFormat[i].string;
        let cardLimit = firstHandDealingFormat[i].cardLimit;

        firstHandDealing(person,string,cardLimit);
    }
};

const openingHandScore = () => {

    startFirstHandDealing();
    
    // For Player

    let a = startingHands.get('Player Dealing 1'); 
    let b = startingHands.get('Player Dealing 2');

    console.log('--------------------------')

    console.log('Staring Player Hand :', [a, b])

    console.log(`Starting Player Score : ${scoreLogic(a)+ scoreLogic(b)}`);

    // For Dealer

    let c = startingHands.get('Dealer Dealing 1');
    let d = startingHands.get('Dealer Dealing 2');

    console.log('--------------------------')

    console.log('Staring Dealer Hand :', [c, d])

    console.log(`Starting Dealer Score : ${scoreLogic(c) + scoreLogic(d)}`)

};

const playerOneCard  = (cardLimit) => {
    
    let playerScore = 0;
    
    for (let i = 1 ; i >= 1 ; i++) {           
        
        if (player.length === cardLimit) break;
        
        let randomIndex = getRandomIndex();
        if (selectedRandomIndex.includes(randomIndex)) continue;
        selectedRandomIndex.push(randomIndex);
    
        player.push(deck[randomIndex]);
        delete deck[randomIndex];
    }
    
    for (const card of player) {
        
        playerScore += scoreLogic(card);

        if (playerScore > 21) {
            return [playerScore, player, 'Player Loses'];
        }
        if (playerScore === 21) {
            return [playerScore, player,'Player Wins'];
        }
    }

    return [playerScore, player, 'Score < 21'];
};

const dealerOneCard  = (cardLimit) => {
    
    let dealerScore = 0;
    
    for (let i = 1 ; i >= 1 ; i++) {           
        
        if (dealer.length === cardLimit) break;
        
        let randomIndex = getRandomIndex();
        if (selectedRandomIndex.includes(randomIndex)) continue;
        selectedRandomIndex.push(randomIndex);
    
        dealer.push(deck[randomIndex]);
        delete deck[randomIndex];
    }

    for (const card of dealer) {
        
        dealerScore += scoreLogic(card);

        if (dealerScore > 21) {
            return [dealerScore, dealer, 'Dealer Loses'];
        }
        if (dealerScore === 21) {
            return [dealerScore, dealer, 'Dealer Wins'];
        }
    }
    return [dealerScore, dealer, 'Score < 21'];
};

const gameStart = () => {
    let i = 3;

    let playerStorage = [];

    while (true) {
        
        let [dealerScore, dealerEndingHands, dealerResult] = dealerOneCard(i);

        if (dealerScore >= 21 && i === 3) {
            let dealerResults = [dealerScore, dealerEndingHands, dealerResult];

            let playerEndingHands = [player[0], player[1]];
            let playerScore = scoreLogic(player[0]) + scoreLogic(player[1]);
            let playerResult;
            if (dealerResult === 'Dealer Loses') playerResult = 'Player Wins';
            if (dealerResult === 'Dealer Wins') playerResult = 'Player Loses';

            let playerResults = [playerScore, playerEndingHands, playerResult];

            return {dealerResults, playerResults};
        }

        if (dealerScore >= 21) {
            let dealerResults = [dealerScore, dealerEndingHands, dealerResult];
            let playerResults = playerStorage[i - 4];
            
            return {dealerResults,playerResults};
        }

        let [playerScore, playerEndingHands, playerResult] = playerOneCard(i);

        let iteratedStorage = [playerScore, playerEndingHands, playerResult]

        playerStorage.push(iteratedStorage);

        if (playerScore >= 21) {
            let playerResults = [playerScore, playerEndingHands, playerResult];
            let dealerResults = [dealerScore, dealerEndingHands, dealerResult];

            return {dealerResults,playerResults}; 
        }

        i++;
    }
};

const finalResult = () => {

    openingHandScore();

    const final = gameStart();

    let endingPlayerHand = final.playerResults[1];
    let endingPlayerScore = final.playerResults[0];

    let endingDealerHand = final.dealerResults[1];
    let endingDealerScore = final.dealerResults[0];

    let winOrLose;

    if (final.playerResults[2] === 'Player Wins') winOrLose = 'Win';
    if (final.playerResults[2] === 'Player Loses') winOrLose = 'Lose';
    if (final.playerResults[2] === 'Score < 21') {
        if (final.dealerResults[2] === 'Dealer Loses') winOrLose = 'Win';
        if (final.dealerResults[2] === 'Dealer Wins') winOrLose = 'Lose';
    }

    let result = `You ${winOrLose}! Your final score was: ${endingPlayerScore} while the dealer had ${endingDealerScore}.`;

    console.log('--------------------------------------------------------------------------------');

    console.log('Final Result ==>', result);

    console.log('--------------------------------------------------------------------------------');

    console.log('Ending Player Hand :', endingPlayerHand);
    console.log('Ending Player Score :', endingPlayerScore);

    console.log('--------------------------');

    console.log('Ending Dealer Hand :', endingDealerHand);
    console.log('Ending Dealer Score :', endingDealerScore);

    console.log('--------------------------');
};

finalResult();

console.log('Dev');