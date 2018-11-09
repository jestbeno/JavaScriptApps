//Learning JavaScript - All credits to: Traversy Media: Build A Speed Typing Game In JavaScript
//https://www.youtube.com/watch?v=Yw-SYSG-028&t=1284s

window.addEventListener('load',init)

const levels ={
    easy :  5,
    medium: 3,
    hard:   2
}

const currentLevel = levels.hard;

let time = currentLevel;
let score = 0;
let isPlaying;

const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');

const words = [
    'hiperbolen',
    'kvazipodjetje',
    'oklepec',
    'oklepek',
    'oklepen',
    'oklepetati',
    'oklepiti',
    'oklepje',
    'oklepljati',
    'oklepljenec',
    'oklepljenje',
    'oklepnica',
    'oklepničar',
    'oklepnik',
    'oklepniški',
    'oklepnjača',
    'oklepnjak',
    'oklepnomehaniziran',
    'oklesanec',
    'oklesati',
      ];

function init(){
    /* show number of seconds */
    seconds.innerHTML = currentLevel;
    //load word from array
    showWord(words);
    /* start matching on word input */
    wordInput.addEventListener('input',startMatch)

    /* call countdown every second */
    setInterval(contdown,1000);
    setInterval(checkStatus,50)
}

function startMatch() {
    if (matchWords()) {
        /* console.log("match") */
        isPlaying = true;
        time = currentLevel+1;
/*         time = currentLevel + 1; */
        showWord(words);
        wordInput.value = '';
        score++;
    }
    /* if score is -1 display 0 */
    if (score ===-1){
        scoreDisplay.innerHTML = 0;
    } else {
        scoreDisplay.innerHTML = score;
    }
}

/* match currentWord to wordinput */
function matchWords() {
    if (wordInput.value === currentWord.innerHTML) {
      message.innerHTML = 'Pravilno!!!';
      return true;
    } else {
      message.innerHTML = '';
      return false;
    }
  }

/* pick random word/*  */
function showWord(wordsd){
    const randIndex = Math.floor(Math.random()* wordsd.length);
    currentWord.innerHTML = wordsd[randIndex];
}

function contdown(){
    /* make sure, time is not runned out */
    if (time>0){
        /* decrement for one second */
        time--;
    }
    else if (time === 0 ){
        /* game over */
        isPlaying = false;
    }
    timeDisplay.innerHTML = time;
}

function checkStatus(){
    if (!isPlaying && time === 0){
        message.innerHTML = 'Konec igre!!';
        score = -1;
    }
}