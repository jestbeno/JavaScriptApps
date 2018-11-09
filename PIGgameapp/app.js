var scores,roundScore, activePlayer, dice, gamePlaying, dokoliko;
var scores1, dice1, gamePlaying;

var zadnja = 0;
init();

//document.querySelector('#current-' + activePlayer).textContent = dice;
//document.querySelector('#current-' + activePlayer).innerHTML='<em>' + dice+'</em>' ;
//document.querySelector('.dice').style.display = 'block';

document.querySelector('.btn-roll').addEventListener('click',function(){
    if (gamePlaying){
    var dice = Math.floor(Math.random()*6)+1;
    
    
    var diceDOM = document.querySelector('.dice');
    diceDOM.style.display = 'block';
    diceDOM.src = 'dice-'+dice+'.png';
    
    if (dice === 6 && zadnja === 6){
        roundScore[activePlayer] = 0;
        document.querySelector('#score-' + activePlayer).textContent = 0;
        nextPlayer;
    } else if (dice !== 1) {
        var i = 0;
        roundScore += dice;
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
    } else {
        nextPlayer();
    }
        zadnja = dice
    }
});

function nextPlayer(){
            activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
//        if (activePlayer ===0){
//            activePlayer=1;
//        } else {
//            activePlayer=0;
//        }
        roundScore = 0;
        document.getElementById('current-0').textContent = '0';
        document.getElementById('current-1').textContent = '0';
        
//        document.querySelector('.player-0-panel').classList.remove('active');
//        document.querySelector('.player-1-panel').classList.add('active');
        document.querySelector('.player-0-panel').classList.toggle('active');
        document.querySelector('.player-1-panel').classList.toggle('active');
        
        document.querySelector('.dice').style.display = 'none';
}

document.querySelector('.btn-hold').addEventListener('click', function (){
    if (gamePlaying){


    scores[activePlayer] +=roundScore;
    document.querySelector('#score-'+activePlayer).textContent = scores[activePlayer];
    
    var input = document.querySelector('.final-score').value;
    if (input){
        var winningscore = input;
    } else {
        winningscore=20;
    }
    if (scores[activePlayer] >= winningscore ) {
        document.querySelector('#name-'+activePlayer).textContent = 'Zmagovalec';
        document.querySelector('.dice').style.display = 'none';
        document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
        document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
//        document.querySelector('.btn-roll').addEventListener('click', init);
        gamePlaying=false;
        }
    else {
        nextPlayer();     
    }
    }
});

document.querySelector('.btn-new').addEventListener('click', init)

//function dotoliko(){
//    return prompt("vnesi do koliko želiš igrat: ");
//}

function init(){
    scores = [0,0];
    activePlayer = 0;
    roundScore=0;
    gamePlaying = true;
//    dokoliko = dotoliko();
    
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.dice').style.display = 'none';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
}

