const username = document.getElementsByClassName('username');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const mytest = document.getElementById('testing');
localStorage.setItem('highscores', JSON.stringify([]));
finalScore.innerText = mostRecentScore;
console.log(typeof mostRecentScore)
let result = Number(mostRecentScore)
console.log(result)
mytest.setAttribute("value", result);