// INPUT
const mainInput = document.querySelector('.main-input');

// TIME
const timeCounterText = document.querySelector('.main-time');

// PARAGRAPHS
const exampleParagraph = document.querySelector('.main-input-example');
const inputParagraph = document.querySelector('.main-input-itself');

// START BUTTON
const startButton = document.querySelector('#startButton');

// SPEED OBJECT
const speedObject = {
    input: {
        inputArr: [],
    },
    exampleText: undefined,
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
            clearInterval(speedObject.interval.intervalFunction);
            speedObject.interval.intervalSecondsCounter = 0;
            speedObject.interval.intervalMinutesCounter = 0;
            speedObject.interval.intervalFunction = undefined;
            speedObject.interval.intervalState = false;
            startButton.disabled = false;
        };
    }, 1000);
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
        console.log(value, lastCharacterExample);
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
    gettingARandomParagraph();
    handlingTheTime();
    startButton.disabled = true;
    mainInput.classList.add('main-input-active');
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