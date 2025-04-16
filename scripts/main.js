// INPUT
const mainInput = document.querySelector('.main-input');

// TIME
const timeCounterText = document.querySelector('.main-time');

// PARAGRAPHS
const exampleParagraph = document.querySelector('.main-input-example');
const inputParagraph = document.querySelector('.main-input-itself');
let exampleParagraphPusher = 0;
let exampleParagraphIdentifier = 70;

// START BUTTON
const startButton = document.querySelector('#startButton');

// RESULT
const resultContainer = document.querySelector('.main-result');
const wpmText = document.querySelector('#wpmText');
const accuracyText = document.querySelector('#accuracyText');

// SPEED OBJECT
const speedObject = {
    input: {
        inputArr: [],
    },
    exampleText: '',
    exampleTextLength: 0,
    interval: {
        intervalSecondsCounter: 0,
        intervalMinutesCounter: 0,
        intervalFunction: undefined,
        intervalState: false,
    },
};

// GETTING A RANDOM PARAGRAPH

async function gettingARandomParagraph() {
    try {
        const request = new Request('../data/data.json');

        const response = await fetch(request);

        if (!response.ok) {
            throw new Error(response.status);
        };

        const data = await response.json();

        displayTheRandomParagraph(data);
    } catch(e) {
        console.error(e);
        console.error(e.name);
        console.error(e.message);
    };
};

// DISPLAY THE RANDOM PARAGRAPH

function displayTheRandomParagraph(paragraph) {
    speedObject.exampleText = paragraph.paragraphs[Math.floor(Math.random() * paragraph.paragraphs.length)];
    speedObject.exampleTextLength = speedObject.exampleText.length;
    exampleParagraph.textContent = speedObject.exampleText;
};

// HANDLING THE TIME

function handlingTheTime() {
    speedObject.interval.intervalState = true;
    speedObject.interval.intervalFunction = setInterval(() => {
        if (speedObject.interval.intervalSecondsCounter < 59) {
            speedObject.interval.intervalSecondsCounter++;
            const seconds = String(speedObject.interval.intervalSecondsCounter).padStart(2, 0);
            const minutes = String(speedObject.interval.intervalMinutesCounter).padStart(2, 0);
            timeCounterText.textContent = `${minutes}:${seconds}`;
        } else {
            speedObject.interval.intervalSecondsCounter = 0;
            const seconds = String(speedObject.interval.intervalSecondsCounter).padStart(2, 0);
            const minutes = String(speedObject.interval.intervalMinutesCounter).padStart(2, 0);
            timeCounterText.textContent = `${minutes}:${seconds}`;
            
            speedObject.interval.intervalMinutesCounter++;
            const minutesText = String(speedObject.interval.intervalMinutesCounter).padStart(2, 0);
            timeCounterText.textContent = `${minutesText}:${seconds}`;

        };
        if (speedObject.interval.intervalMinutesCounter === 4 && speedObject.interval.intervalSecondsCounter === 59) {
            clearTheInterval();
            speedObject.interval.intervalMinutesCounter = 5;
            speedObject.interval.intervalSecondsCounter = 0;
            const seconds = String(speedObject.interval.intervalSecondsCounter).padStart(2, 0);
            const minutes = String(speedObject.interval.intervalMinutesCounter).padStart(2, 0);
            timeCounterText.textContent = `${minutes}:${seconds}`;
            calculateTheSpeed();
            resettingTheProperties();
        };
    }, 1000);
};

function clearTheInterval() {
    clearInterval(speedObject.interval.intervalFunction);
};

// RESETTING THE PROPERTIES

function resettingTheProperties() {
    speedObject.interval.intervalSecondsCounter = 0;
    speedObject.interval.intervalMinutesCounter = 0;
    speedObject.interval.intervalFunction = undefined;
    speedObject.interval.intervalState = false;
    speedObject.input.inputArr = [];
    startButton.disabled = false;
};

// ENTERING AN INPUT

function enteringAnInput(value) {
    speedObject.input.inputArr.push(value);
    
    const inputParagraphChild = document.createElement('span');
    inputParagraphChild.textContent = value;
    inputParagraph.appendChild(inputParagraphChild);

    // HANDLING THE WRONG CHARACTER
    const lastTypedCharacterInputIndex = speedObject.input.inputArr.lastIndexOf(speedObject.input.inputArr[speedObject.input.inputArr.length - 1]);
    const lastCharacterExample = speedObject.exampleText[lastTypedCharacterInputIndex];

    if (value !== lastCharacterExample) {
        inputParagraphChild.classList.add('wrong-character');
    };

    if (speedObject.input.inputArr.length === exampleParagraphIdentifier) {
        exampleParagraphPusher -= 48;
        exampleParagraph.style.transform = `translateY(${exampleParagraphPusher}px)`;
        inputParagraph.style.transform = `translateY(${exampleParagraphPusher}px)`;
        exampleParagraphIdentifier +=70;
    };

    // CHECKING IF THE INPUT'S LENGTH IS EQUAL TO THE LENGTH OF THE EXAMPLE TEXT'S LENGTH
    if (speedObject.input.inputArr.length === speedObject.exampleTextLength) {
        clearTheInterval();
        calculateTheSpeed();
        resettingTheProperties();
    };
};

// REMOVING A CHARACTER

function removingACharacter() {
    if (speedObject.input.inputArr.length > 0) {
        speedObject.input.inputArr.pop();
        inputParagraph.lastElementChild.parentNode.removeChild(inputParagraph.lastElementChild);
    };
};

// START THE GAME

function startTheGame() {
    resultContainer.classList.remove('main-result-active');
    exampleParagraph.style.transform = 'none';
    inputParagraph.style.transform = 'none';
    inputParagraph.innerHTML = '';
    exampleParagraph.textContent = '';
    gettingARandomParagraph();
    handlingTheTime();
    startButton.disabled = true;
    mainInput.classList.add('main-input-active');
};

// CALCULATE THE SPEED

function calculateTheSpeed() {
    let accuracyCounter = 0;
    const time = Number(`${speedObject.interval.intervalMinutesCounter}.${speedObject.interval.intervalSecondsCounter}`);
    const words = speedObject.exampleTextLength / 5;
    const WPM = String(words / time);
    const readyWPM = WPM.slice(0, WPM.indexOf('.', '') + 3);
    for (let i = 0; i < speedObject.exampleTextLength; i++) {
        if (speedObject.exampleText[i] !== speedObject.input.inputArr[i]) {
            accuracyCounter++;
        };
    };
    const accuracy = String(((speedObject.exampleTextLength - accuracyCounter) / speedObject.exampleTextLength) * 100);
    const readyAccuracy = accuracy.slice(0, accuracy.indexOf('.', '') + 3);
    
    resultContainer.classList.add('main-result-active');
    wpmText.textContent = `WPM: ${readyWPM}`;
    accuracyText.textContent = `Accuracy: ${readyAccuracy}%`;
};

// INITIALIZING THE BUTTONS
startButton.addEventListener('click', startTheGame);
window.addEventListener('keydown', e => {
    if (speedObject.interval.intervalState === true) {
        // ENTERING AN INPUT
        const allowedCharacters = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM.,?!\'" ';
        if (allowedCharacters.includes(e.key)) {
            enteringAnInput(e.key);
        };

        // REMOVING A CHARACTER
        if (e.key === 'Backspace') {
            removingACharacter();
        };
    };
});