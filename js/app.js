const ANSWER_ATTRIBUTE = 'data-answer'
const CLICKED_ATTRIBUTE = 'data-clicked'
const WIN_SUM = 1000000
const ANSWER_DELAY = 2000

let allQuestions = null;

let gameState = {
    correctAnswer:3,
    indexOfQuestions:null,
    currentQuestion:null,
    totalScore: 0,
    currentScore:0
}

let totalScoreOut = document.getElementById('totalPrize')
let currentScoreOut = document.getElementById('currentPrize')
let questionText = document.getElementById('questionText')

let startBtn = document.querySelector('.start')
let skipBtn = document.querySelector('.skip')

let answersBlock = document.querySelector('.game-body')
let headerBlock = document.querySelector('.game-header')

let gameInfo = document.querySelector('.game-info')
let gameArea = document.querySelector('.game-container')

gameArea.addEventListener('click', e => {
    if (e.target.classList.contains('answer') && +e.target.getAttribute(CLICKED_ATTRIBUTE)) {
        setAnswerClicked(0)
        startBtn.setAttribute('disabled', true)
        skipBtn.setAttribute('disabled', true)
        checkingAnswer(e.target, e)
    } else if (e.target.classList.contains('start')) {
        initialisation()
    } else if (e.target.classList.contains('skip')) {
        toggleHide(skipBtn)
        setNextQuestion(allQuestions, gameState)
    } else if (e.target.classList.contains('game-info-start-btn')) {
        toggleHide(gameInfo, answersBlock, headerBlock)
        initialisation()
    }
})

function initialisation() {
    allQuestions = JSON.parse(localStorage.getItem('questions'))

    skipBtn.classList.remove('hide')
    gameState.totalScore = 0
    gameState.currentScore = 100
    setPrizes()
    setNextQuestion(allQuestions, gameState)
}

function setNextQuestion(array, state) {
    let questionIndex = Math.floor(Math.random() * Math.floor(array.length))

    state.currentQuestion = array.splice(questionIndex, 1)[0]
    state.correctAnswer = state.currentQuestion['correct']
    state.indexOfQuestions = questionIndex
    createAnswerBlock(state.currentQuestion, answersBlock)
}

function createAnswerBlock(questionEl, parentBlock) {
    parentBlock.innerHTML = ''

    if (questionEl['question']) {
        questionText.innerText = questionEl['question']

        questionEl['content'].forEach((el, index) => {
            let answerElement = document.createElement('div')
            answerElement.setAttribute('data-answer', index)
            answerElement.setAttribute(CLICKED_ATTRIBUTE, 1)
            answerElement.classList.add('answer')
            answerElement.innerHTML = `${el}`
            parentBlock.appendChild(answerElement)
        })
    } else {
        questionText.innerText = 'No questions'
    }
}

function checkingAnswer(el) {
    let answer = +el.getAttribute(ANSWER_ATTRIBUTE)
    let correct = gameState.correctAnswer

    if (answer !== correct) {
        el.style.backgroundColor = 'rgba(240, 41, 41, 0.603)'
        setTimeout(() => {
            finish()
            startBtn.removeAttribute('disabled', true)
            skipBtn.removeAttribute('disabled')
        }, ANSWER_DELAY)
    } else {
        calculatePrizes()
        setTimeout(() => {
            setNextQuestion(allQuestions, gameState)
            startBtn.removeAttribute('disabled', true)
            skipBtn.removeAttribute('disabled')
        }, ANSWER_DELAY)
    }

    document.querySelector(`div[data-answer="${correct}"]`)
        .style.backgroundColor = 'rgba(44, 224, 83, 0.603)'
}

function calculatePrizes() {
    gameState.totalScore += gameState.currentScore

    if (gameState.totalScore >= WIN_SUM) {
        finish()
    }

    gameState.currentScore *= 2
    setPrizes()
}

function finish() {
    let finishMessage = ''

    if (gameState.totalScore >= WIN_SUM) {
        finishMessage = `Congratulations! You won 1000000`
    } else {
        finishMessage = `Game over. Your prize is: ${gameState.totalScore}`
    }

    toggleHide(gameInfo, answersBlock, headerBlock)
    let titleOut = document.querySelector('.game-info-header')
    setInnerHTML(titleOut, `<h2>${finishMessage}</h2>`)
}

function setPrizes() {
    setInnerHTML(totalScoreOut, gameState.totalScore)
    setInnerHTML(currentScoreOut, gameState.currentScore)
}

function setInnerHTML(element, value) {
    element.innerHTML = value
}

function checkingRightAnsw(answer) {
    return gameState.correctAnswer === answer
}

function setAnswerClicked(value) {
    let answers = document.querySelectorAll('.answer')

    for (let i = 0; i < answers.length; i++) {
        answers[i].setAttribute(CLICKED_ATTRIBUTE, value)
    }
}

function toggleHide(...elements) {
    [...elements].forEach(el => {
        el.classList.toggle('hide');
    })
}

