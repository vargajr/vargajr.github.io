'use strict';
const timeCounter = new Date(2020, 0, 0, 0, 0, 0, 0);
const clock = document.querySelector('.timeDisplay');
let clockrunner, clickNumber, foundPairs, tableLocked;
const cards = document.querySelectorAll('.card');
let firstCard, secondCard;
const cardInners = document.querySelectorAll('.card__inner');

const initialize = () =>{
    cardInners.forEach(element => element.classList.toggle('is-flipped', false));
    timeCounter.setHours(0, 0, 0, 0);
    displayTime();
    shuffle();
    clearTempStorages();
    foundPairs = 0;
    addCardEventHandlers();
}

const clearTempStorages = () => {
    clickNumber = 0;
    tableLocked = false;
    firstCard = null;
    secondCard = null;
}

// --- Timer ---
const displayTime = () => clock.innerHTML = timeCounter.toTimeString().slice(3,8);

const shuffle = () => cards.forEach(card => card.style.order = Math.floor(Math.random() * 10));

const addCardEventHandlers = () => {
    cardInners.forEach(element => element.addEventListener('click', startTimer));
    cardInners.forEach(element => element.addEventListener('click', checkTheCard));
};

const startTimer = () => {
    startTheClock();
    cardInners.forEach(element => element.removeEventListener('click', startTimer));
};

const startTheClock = () => clockrunner = setInterval(runTimer, 1000);

const runTimer = () => {
    timeCounter.setSeconds(timeCounter.getSeconds()+1);
    displayTime();
};

// --- Card checking ---
const checkTheCard = (event) => {
    if (tableLocked) {return};
    storeCardData(event);
    if (clickNumber === 2) {
        compareCards();
    }
    if (foundPairs === 5) {
        endGame();
    }

};

const storeCardData = (ev) => {
    if (clickNumber === 1) {
        secondCard = ev.currentTarget;
        secondCard.removeEventListener('click', checkTheCard);
        flipCard(secondCard);
        clickNumber = 2;
        tableLocked = true;
    };
    if (clickNumber === 0) {
        firstCard = ev.currentTarget;
        firstCard.removeEventListener('click', checkTheCard);
        flipCard(firstCard);
        clickNumber = 1;
    };
};

const flipCard = (card) => card.classList.toggle('is-flipped');

const compareCards = () => firstCard.dataset.name === secondCard.dataset.name ? foundMatch() : setTimeout(unflipNotMatchingCards, 1500);

const foundMatch = () => {
    foundPairs += 1;
    clearTempStorages();
}

const unflipNotMatchingCards = () => {
    flipCard(firstCard);
    flipCard(secondCard);
    setTimeout(restoreCardInitState, 1000);
}

const restoreCardInitState = () => {
    firstCard.addEventListener('click', checkTheCard);
    secondCard.addEventListener('click', checkTheCard);
    clearTempStorages();
}

const endGame = () => {
    stopTheClock();
    setTimeout(initialize, 5000);
}

const stopTheClock = () => clearInterval(clockrunner);

initialize();
