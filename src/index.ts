

const url = 'https://ronnedahl.github.io/riddles-api/riddles.json'
const btnRiddle = document.querySelector('#btn-riddle') as HTMLButtonElement
const btnAnswer = document.querySelector('#btn-answer') as HTMLButtonElement
const btnHintOne = document.querySelector('#btn-hintOne') as HTMLButtonElement
const btnHintTwo = document.querySelector('#btn-hintTwo') as HTMLButtonElement
const btnHintThree = document.querySelector('#btn-hintThree') as HTMLButtonElement
const information = document.querySelector('#information') as HTMLElement
const riddleQuestion = document.querySelector('#riddle-question') as HTMLElement

const riddleHintOne = document.querySelector('#riddle-hint__one') as HTMLElement
const riddleHintTwo = document.querySelector('#riddle-hint__two') as HTMLElement
const riddleHintThree = document.querySelector('#riddle-hint__three') as HTMLElement
const riddleCont = document.querySelector('#riddles') as HTMLElement
const riddleCounter = document.querySelector('#counter-riddle') as HTMLElement
const counterScore = document.createElement('h2') as HTMLElement

interface Riddles {
    question: string,
    answer: string,
    hints: string[]
}

let riddlesArray: Riddles[] = []
let answerArray: string[] = []

let counter: number = Number(JSON.parse(localStorage.getItem('counter'))) || 0
let score: number = Number(JSON.parse(localStorage.getItem('score'))) || 0

let questionCounter: number = 0
let btnIsPressedHintOne: boolean = false;
let btnIsPressedHintTwo: boolean = false;
let btnIsPressedHintThree: boolean = false;
let btnIsPressedRiddle: boolean = false

score = 80
counter = 0
questionCounter = 0

counterScore.textContent = `Din nuvarande Poäng : ${score}`
riddleCounter.appendChild(counterScore)

async function fetchAllRiddles(): Promise<Riddles[]> {

    try {
        const response: Response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP-fel! status: ${response.status}`);
        } else {
            let data: Riddles[] = await response.json()

            localStorage.setItem('riddles', JSON.stringify(data))
            return data
        }

    } catch (error) {
        console.log(error)
        return []
    }
}

async function riddlesSetup() {
    const storedRiddlesJSON = localStorage.getItem('riddles')
    if (storedRiddlesJSON) {
        const storedRiddles: Riddles[] = JSON.parse(storedRiddlesJSON)
        console.log('hämtade gåtor från localstorage', storedRiddles)
        riddlesArray.push(...storedRiddles)
    } else {

        const data = await fetchAllRiddles()
        riddlesArray.push(...data)
    }
}
// **********knappen för att hämta Gåtorna*************
if (!riddlesArray) {
     counter = 0
}
btnRiddle.addEventListener('click', () => {
    if (btnIsPressedRiddle) {
        return
    }
    btnRiddle.disabled = true
    counter++
    questionCounter = 0
    btnIsPressedRiddle = true
    resetButtons();


    localStorage.setItem('score', JSON.stringify(score))
    localStorage.setItem('counter', JSON.stringify(score))

    riddlesSetup()

    if (counter - 1 < riddlesArray.length) {

        const allRiddles: string[] = riddles()

        const oneQuestion: string = allRiddles[counter - 1]
        riddleQuestion.textContent = oneQuestion

        const score: number = Number(JSON.parse(localStorage.getItem('score')));
        counterScore.textContent = `Din nuvarande Poäng : ${score}`

        riddleCounter.innerHTML = ''
        riddleCounter.appendChild(counterScore)
    } else {

        console.log('Inga flera gåtor är tillgängliga tyvärr!')
    }
})
// **********knappen för att hämta svaren*************

btnAnswer.addEventListener('click', () => {

    riddleQuestion.textContent = ""

    btnHintOne.disabled = true
    btnHintTwo.disabled = true
    btnHintThree.disabled = true


    if (counter > 0 && counter - 1 < riddlesArray.length) {

        const answerQuestion: string[] = riddleAnswers()
        const oneAnswer = answerQuestion[counter - 1]
        console.log('det här är ett svar', oneAnswer)
        riddleQuestion.textContent = oneAnswer
        localStorage.setItem('score', JSON.stringify(score))
        questionCounter = 0
    } else {
        console.log('ingen gåta vald eller svar är tillgängliga!')
    }

})

// **********knapparna för att hämta ledtrådarna*************

function resetButtons() {
    btnIsPressedHintOne = false;
    btnIsPressedHintTwo = false;
    btnIsPressedHintThree = false;
    btnIsPressedRiddle = false

    btnHintOne.disabled = false;
    btnHintTwo.disabled = false;
    btnHintThree.disabled = false;
    btnRiddle.disabled = false;
}

console.log(btnIsPressedHintOne)
btnHintOne.addEventListener('click', () => {

    if (btnIsPressedHintOne) {
        return
    }

    btnIsPressedHintOne = true;
    btnHintOne.disabled = true

    console.log('värdet på questioncounter nu i btnhintone', questionCounter)
    if (questionCounter === 0) {

        score -= 4
        localStorage.setItem('score', JSON.stringify(score))
        counterScore.textContent = `Din nuvarnade Poäng : ${score}`
    }



    if (questionCounter === 0 && counter - 1 < riddlesArray.length) {
        const riddleclueNrOne = getFirstHint(counter - 1)
        riddleQuestion.textContent = riddleclueNrOne
    } else {
        information.textContent = 'Du måste trycka på första ledtråden först'
    }

    questionCounter++
})

btnHintTwo.addEventListener('click', () => {
    riddleQuestion.textContent = ""
    if (btnIsPressedHintTwo || !btnIsPressedHintOne) {
        return
    }

    btnIsPressedHintTwo = true
    btnHintTwo.disabled = true

    if (questionCounter === 1) {
        score -= 4
        console.log('Jag hoppas att det körs nu!')


        localStorage.setItem('score', JSON.stringify(score))
        counterScore.textContent = `Din nuvarande Poäng : ${score}`
    }
    if (questionCounter === 1 && counter - 1 < riddlesArray.length) {
        const riddleclueNrTwo = getSecondHint(counter - 1)
        riddleQuestion.textContent = riddleclueNrTwo
    }
    questionCounter++
})

btnHintThree.addEventListener('click', () => {
    riddleQuestion.textContent = ""
    if (btnIsPressedHintThree || !btnIsPressedHintTwo) {
        return
    }


    btnIsPressedHintThree = true;
    btnHintThree.disabled = true;

    if (questionCounter === 2) {
        score -= 4

        localStorage.setItem('score', JSON.stringify(score))
        counterScore.textContent = `Din nuvarande Poäng : ${score}`
    }
    if (questionCounter === 2 && counter - 1 < riddlesArray.length) {
        const riddleclueNrThree = getThirdHint(counter - 1)
        riddleQuestion.textContent = riddleclueNrThree

    } else {
        console.log('du kan inte trycka på denna ledtråd först!')
    }
})


// **********här börjar funktionerna som hanterar frågorna,svaren och ledtrådarna*******

function riddles(): string[] {
    const storedRiddlesJSON = localStorage.getItem('riddles')
    if (storedRiddlesJSON) {
        const riddlesArrayLocal: Riddles[] = JSON.parse(storedRiddlesJSON)
        const riddles: string[] = riddlesArrayLocal.map((riddle: Riddles) => riddle.question)
        riddlesArray.push(...riddlesArrayLocal)
        return riddles
    }
}

function riddleAnswers(): string[] {
    const answers = riddlesArray.map(answer => answer.answer)
    return answers
}

function getFirstHint(index: number) {
    if (riddlesArray[index] && riddlesArray[index].hints[0]) {
        return riddlesArray[index].hints[0]

    } else {
        return ' ingen ledtråd är tillgänglig'
    }
}

function getSecondHint(index: number) {
    if (riddlesArray[index] && riddlesArray[index].hints[1]) {
        return riddlesArray[index].hints[1]

    } else {
        return ' ingen ledtråd är tillgänglig'
    }

}

function getThirdHint(index: number) {
    if (riddlesArray[index] && riddlesArray[index].hints[2]) {
        return riddlesArray[index].hints[2]

    } else {
        return ' ingen ledtråd är tillgänglig'
    }
}