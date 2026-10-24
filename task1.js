const MIN_NUMBER = 1;
const MAX_NUMBER = 100;
const MAX_ATTEMPTS = 10;


let secretNumber;
let attempts;
let gameActive;
let guesses;


const guessForm =
    document.querySelector("#guessForm");

const guessInput =
    document.querySelector("#guessInput");

const guessButton =
    document.querySelector("#guessButton");

const restartButton =
    document.querySelector("#restartButton");

const attemptsElement =
    document.querySelector("#attempts");

const remainingElement =
    document.querySelector("#remaining");

const messageElement =
    document.querySelector("#message");

const guessHistoryElement =
    document.querySelector("#guessHistory");


function getRandomNumber() {

    return Math.floor(
        Math.random()
        * (MAX_NUMBER - MIN_NUMBER + 1)
    ) + MIN_NUMBER;

}
document.querySelector("#minNumber").textContent = MIN_NUMBER;
document.querySelector("#maxNumber").textContent = MAX_NUMBER;
document.querySelector("#maxAttempts").textContent = MAX_ATTEMPTS;

guessInput.min = MIN_NUMBER;
guessInput.max = MAX_NUMBER;
guessInput.step = 1;
guessInput.placeholder =
    MIN_NUMBER + "–" + MAX_NUMBER;

function showMessage(text, state) {

    messageElement.textContent = text;

    messageElement.classList.remove(
        "neutral",
        "higher",
        "lower",
        "error",
        "success",
        "lose"
    );

    messageElement.classList.add(state);

}


function renderStats() {

    attemptsElement.textContent =
        attempts + " / " + MAX_ATTEMPTS;

    remainingElement.textContent =
        MAX_ATTEMPTS - attempts;

}


function renderHistory() {

    guessHistoryElement.textContent = "";


    if (guesses.length === 0) {

        const emptyItem =
            document.createElement("li");

        emptyItem.classList.add(
            "empty-history"
        );

        emptyItem.textContent =
            "No guesses yet.";

        guessHistoryElement.appendChild(
            emptyItem
        );

        return;
    }


    for (const guessData of guesses) {

        const item =
            document.createElement("li");

        item.textContent =
            guessData.number
            + " "
            + guessData.symbol;

        guessHistoryElement.appendChild(
            item
        );

    }

}


function endGame() {

    gameActive = false;

    guessInput.disabled = true;
    guessButton.disabled = true;

}


function checkGuess(guess) {

    attempts++;


    if (guess === secretNumber) {

        guesses.push({
            number: guess,
            symbol: "✓"
        });

        showMessage(
            "Correct! You guessed "
            + secretNumber
            + " in "
            + attempts
            + " attempts.",
            "success"
        );

        endGame();

    } else if (guess < secretNumber) {

        guesses.push({
            number: guess,
            symbol: "↑"
        });

        showMessage(
            "Too low! Try a higher number.",
            "higher"
        );

    } else {

        guesses.push({
            number: guess,
            symbol: "↓"
        });

        showMessage(
            "Too high! Try a lower number.",
            "lower"
        );

    }


    if (
        attempts === MAX_ATTEMPTS
        &&
        guess !== secretNumber
    ) {

        showMessage(
            "Game over! The secret number was "
            + secretNumber
            + ".",
            "lose"
        );

        endGame();

    }


    renderStats();
    renderHistory();

}


function handleGuess(event) {

    event.preventDefault();


    if (!gameActive) {

        showMessage(
            "The game is over. Start a new game.",
            "error"
        );

        return;
    }


    const inputValue =
        guessInput.value.trim();


    if (inputValue === "") {

        showMessage(
            "Please enter a number.",
            "error"
        );

        return;
    }


    const guess =
        Number(inputValue);


    if (!Number.isInteger(guess)) {

        showMessage(
            "Please enter a whole number.",
            "error"
        );

        return;
    }


    const isInRange =
        guess >= MIN_NUMBER
        &&
        guess <= MAX_NUMBER;


    if (
        guess < MIN_NUMBER
        ||
        guess > MAX_NUMBER
    ) {

        showMessage(
            "Enter a number from "
            + MIN_NUMBER
            + " to "
            + MAX_NUMBER
            + ".",
            "error"
        );

        return;
    }


    if (isInRange) {

        checkGuess(guess);

    }


    guessInput.value = "";


    if (gameActive) {

        guessInput.focus();

    }

}


function restartGame() {

    secretNumber =
        getRandomNumber();

    attempts = 0;

    guesses = [];

    gameActive = true;


    guessInput.disabled = false;
    guessButton.disabled = false;


    guessInput.value = "";


    showMessage(
        "Make your first guess!",
        "neutral"
    );


    renderStats();
    renderHistory();


    guessInput.focus();

}


guessForm.addEventListener(
    "submit",
    handleGuess
);


restartButton.addEventListener(
    "click",
    restartGame
);


restartGame();