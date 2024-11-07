var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const url = 'https://ronnedahl.github.io/riddles-api/riddles.json';
const btnRiddle = document.querySelector('#btn-riddle');
const btnAnswer = document.querySelector('#btn-answer');
const btnHintOne = document.querySelector('#btn-hintOne');
const btnHintTwo = document.querySelector('#btn-hintTwo');
const btnHintThree = document.querySelector('#btn-hintThree');
const information = document.querySelector('#information');
const riddleQuestion = document.querySelector('#riddle-question');
const riddleHintOne = document.querySelector('#riddle-hint__one');
const riddleHintTwo = document.querySelector('#riddle-hint__two');
const riddleHintThree = document.querySelector('#riddle-hint__three');
const riddleCont = document.querySelector('#riddles');
const riddleCounter = document.querySelector('#counter-riddle');
const counterScore = document.createElement('h2');
let riddlesArray = [];
let answerArray = [];
let counter = Number(JSON.parse(localStorage.getItem('counter'))) || 0;
let score = Number(JSON.parse(localStorage.getItem('score'))) || 0;
let questionCounter = 0;
let btnIsPressedHintOne = false;
let btnIsPressedHintTwo = false;
let btnIsPressedHintThree = false;
let btnIsPressedRiddle = false;
score = 80;
counter = 0;
questionCounter = 0;
counterScore.textContent = `Din nuvarande Poäng : ${score}`;
riddleCounter.appendChild(counterScore);
function fetchAllRiddles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP-fel! status: ${response.status}`);
            }
            else {
                let data = yield response.json();
                localStorage.setItem('riddles', JSON.stringify(data));
                return data;
            }
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
function riddlesSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        const storedRiddlesJSON = localStorage.getItem('riddles');
        if (storedRiddlesJSON) {
            const storedRiddles = JSON.parse(storedRiddlesJSON);
            console.log('hämtade gåtor från localstorage', storedRiddles);
            riddlesArray.push(...storedRiddles);
        }
        else {
            const data = yield fetchAllRiddles();
            riddlesArray.push(...data);
        }
    });
}
// **********knappen för att hämta Gåtorna*************
if (!riddlesArray) {
    counter = 0;
}
btnRiddle.addEventListener('click', () => {
    if (btnIsPressedRiddle) {
        return;
    }
    btnRiddle.disabled = true;
    counter++;
    questionCounter = 0;
    btnIsPressedRiddle = true;
    resetButtons();
    localStorage.setItem('score', JSON.stringify(score));
    localStorage.setItem('counter', JSON.stringify(score));
    riddlesSetup();
    if (counter - 1 < riddlesArray.length) {
        const allRiddles = riddles();
        const oneQuestion = allRiddles[counter - 1];
        riddleQuestion.textContent = oneQuestion;
        const score = Number(JSON.parse(localStorage.getItem('score')));
        counterScore.textContent = `Din nuvarande Poäng : ${score}`;
        riddleCounter.innerHTML = '';
        riddleCounter.appendChild(counterScore);
    }
    else {
        console.log('Inga flera gåtor är tillgängliga tyvärr!');
    }
});
// **********knappen för att hämta svaren*************
btnAnswer.addEventListener('click', () => {
    riddleQuestion.textContent = "";
    btnHintOne.disabled = true;
    btnHintTwo.disabled = true;
    btnHintThree.disabled = true;
    if (counter > 0 && counter - 1 < riddlesArray.length) {
        const answerQuestion = riddleAnswers();
        const oneAnswer = answerQuestion[counter - 1];
        console.log('det här är ett svar', oneAnswer);
        riddleQuestion.textContent = oneAnswer;
        localStorage.setItem('score', JSON.stringify(score));
        questionCounter = 0;
    }
    else {
        console.log('ingen gåta vald eller svar är tillgängliga!');
    }
});
// **********knapparna för att hämta ledtrådarna*************
function resetButtons() {
    btnIsPressedHintOne = false;
    btnIsPressedHintTwo = false;
    btnIsPressedHintThree = false;
    btnIsPressedRiddle = false;
    btnHintOne.disabled = false;
    btnHintTwo.disabled = false;
    btnHintThree.disabled = false;
    btnRiddle.disabled = false;
}
console.log(btnIsPressedHintOne);
btnHintOne.addEventListener('click', () => {
    if (btnIsPressedHintOne) {
        return;
    }
    btnIsPressedHintOne = true;
    btnHintOne.disabled = true;
    console.log('värdet på questioncounter nu i btnhintone', questionCounter);
    if (questionCounter === 0) {
        score -= 4;
        localStorage.setItem('score', JSON.stringify(score));
        counterScore.textContent = `Din nuvarnade Poäng : ${score}`;
    }
    if (questionCounter === 0 && counter - 1 < riddlesArray.length) {
        const riddleclueNrOne = getFirstHint(counter - 1);
        riddleQuestion.textContent = riddleclueNrOne;
    }
    else {
        information.textContent = 'Du måste trycka på första ledtråden först';
    }
    questionCounter++;
});
btnHintTwo.addEventListener('click', () => {
    riddleQuestion.textContent = "";
    if (btnIsPressedHintTwo || !btnIsPressedHintOne) {
        return;
    }
    btnIsPressedHintTwo = true;
    btnHintTwo.disabled = true;
    if (questionCounter === 1) {
        score -= 4;
        console.log('Jag hoppas att det körs nu!');
        localStorage.setItem('score', JSON.stringify(score));
        counterScore.textContent = `Din nuvarande Poäng : ${score}`;
    }
    if (questionCounter === 1 && counter - 1 < riddlesArray.length) {
        const riddleclueNrTwo = getSecondHint(counter - 1);
        riddleQuestion.textContent = riddleclueNrTwo;
    }
    questionCounter++;
});
btnHintThree.addEventListener('click', () => {
    riddleQuestion.textContent = "";
    if (btnIsPressedHintThree || !btnIsPressedHintTwo) {
        return;
    }
    btnIsPressedHintThree = true;
    btnHintThree.disabled = true;
    if (questionCounter === 2) {
        score -= 4;
        localStorage.setItem('score', JSON.stringify(score));
        counterScore.textContent = `Din nuvarande Poäng : ${score}`;
    }
    if (questionCounter === 2 && counter - 1 < riddlesArray.length) {
        const riddleclueNrThree = getThirdHint(counter - 1);
        riddleQuestion.textContent = riddleclueNrThree;
    }
    else {
        console.log('du kan inte trycka på denna ledtråd först!');
    }
});
// **********här börjar funktionerna som hanterar frågorna,svaren och ledtrådarna*******
function riddles() {
    const storedRiddlesJSON = localStorage.getItem('riddles');
    if (storedRiddlesJSON) {
        const riddlesArrayLocal = JSON.parse(storedRiddlesJSON);
        const riddles = riddlesArrayLocal.map((riddle) => riddle.question);
        riddlesArray.push(...riddlesArrayLocal);
        return riddles;
    }
}
function riddleAnswers() {
    const answers = riddlesArray.map(answer => answer.answer);
    return answers;
}
function getFirstHint(index) {
    if (riddlesArray[index] && riddlesArray[index].hints[0]) {
        return riddlesArray[index].hints[0];
    }
    else {
        return ' ingen ledtråd är tillgänglig';
    }
}
function getSecondHint(index) {
    if (riddlesArray[index] && riddlesArray[index].hints[1]) {
        return riddlesArray[index].hints[1];
    }
    else {
        return ' ingen ledtråd är tillgänglig';
    }
}
function getThirdHint(index) {
    if (riddlesArray[index] && riddlesArray[index].hints[2]) {
        return riddlesArray[index].hints[2];
    }
    else {
        return ' ingen ledtråd är tillgänglig';
    }
}
