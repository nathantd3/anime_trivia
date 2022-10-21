const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('answer'));
const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');
const livesText = document.getElementById('lives');
const progressBarFull = document.getElementById('progressBarFull');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let lives = 3;
let availableQuestions = [];
let questions = [];

fetch('https://opentdb.com/api.php?amount=50&category=31&difficulty=medium&type=multiple')
.then(resp => resp.json())
.then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
            question: loadedQuestion.question,
        };
        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
        answerChoices.forEach((choice, index) => {
            formattedQuestion['choice' + (index + 1)] = choice;
        });
        return formattedQuestion;
    }); 
    startGame();
})
.catch(err => console.error(err));

const MAX_QUESTIONS = 25;

function startGame(){
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
};

function getNewQuestion(){
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('/end');
    }
    questionCounter++;
    questionCounterText.innerText = questionCounter + "/" + MAX_QUESTIONS;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;

    progressBarFull.style.width = `${questionCounter / MAX_QUESTIONS * 100}%`;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if(classToApply === 'correct') {
            incrementScore(1);
        }
        else if (classToApply === 'incorrect'){
            decrementLives();
            localStorage.setItem('mostRecentScore', score);
            selectedChoice.parentElement.classList.add(classToApply);
            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
            }, 1000);
            
            if(lives == 0) {
                return window.location.assign('/end');
            }
            
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);     
    });
});

function incrementScore(num){
    score += num;
    scoreText.innerText = score;
}

function decrementLives(){
    lives -= 1;
    livesText.innerText = lives;
}