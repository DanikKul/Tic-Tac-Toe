const area = document.getElementById('board');
let move = 0;
let userSymbol = '<img src="assets/cross.png" alt="" width="100px">';
let botSymbol = '<img src="assets/circle.png" alt="" width="100px">';
let checkerSymbol;
const buttonArea = document.querySelector('.button-container');
const pushArea = document.querySelector('.players');
const boardArea = document.querySelector('.board');
const winnerArea = document.querySelector('.winner');
const winnerText = document.querySelector('.winner p');
const retryBtn = document.querySelector('.winner button');
const recentGamesText = document.querySelector('.recent-games-container');
const leaderContainer = document.querySelector('.leader-container ol');
const boxHover = document.querySelectorAll('.box');
let fs = window.localStorage;
fs.setItem('Player1', '0');
fs.setItem('Player2', '0');
fs.setItem('Bot', '0');
let scores = [
    { name: 'player1', score: 0 },
    { name: 'player2', score: 0 },
    { name: 'bot', score: 0 }
];
let chose;
let winner = '';
let currentResult;
let currentText = 1;
let lastMove = move;

window.onload = fs.clear();

for (let i = 0; i < 3; i++) {
    leaderContainer.innerHTML += `<li>${scores[i].name},  wins: ${scores[i].score}</li>`;
}

boxHover.forEach(x => {
    x.addEventListener('mouseenter', function (){
        x.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    });
    x.addEventListener('mouseleave', function (){
        x.style.backgroundColor = '#816e69'
    });
});

buttonArea.addEventListener('click', e => {
    if(e.target.className === 'btn'){
        pushArea.style.transform = 'scale(0,0)';
        setTimeout(() => {
            pushArea.style.display = 'none';
            boardArea.style.display = 'flex';
            boardArea.style.transform = 'scale(1, 1)';
        }, 700);
        if(e.target.innerHTML === 'Player'){
            chose = 'Player';
        } else {
            chose = 'Bot';
        }
    }
});

function resetBoard(){
    showWinner();
    area.childNodes.forEach(x => {
        x.innerHTML = '';
    });
    lastMove = move;
    move = 0;
}

function showWinner(){
    boardArea.style.transform = 'scale(0, 0)';
    setTimeout(() => {
        boardArea.style.display = 'none';
        winnerText.innerHTML = winner;
        winnerArea.style.display = 'flex';
    }, 700);
}

retryBtn.addEventListener('click', resetGame);

function resetGame(){
    // last game
    if(currentResult !== 'Draw') {
        if (checkerSymbol === userSymbol) {
            fs.setItem(`game${currentText++}`, currentResult + `, symbol: (X)` + ', moves: ' + lastMove);
        } else {
            fs.setItem(`game${currentText++}`, currentResult + `, symbol: (O)` + ', moves: ' + lastMove);
        }
    } else {
        fs.setItem(`game${currentText++}`, currentResult);
    }
    recentGamesText.innerHTML += `<p>${fs.getItem(`game${currentText - 1}`)}</p>`;
    // leaderboard
    scores.sort((a, b) => a.score < b.score ? 1 : -1);
    leaderContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        leaderContainer.innerHTML += `<li>${scores[i].name},  wins: ${scores[i].score}</li>`;
    }
    // animation and push window
    winnerArea.style.display = 'none';
    pushArea.style.transform = 'scale(1, 1)';
    pushArea.style.display = 'flex';
}

area.addEventListener('click', e => {
    if (e.target.className === 'box') {
        if(chose === 'Player') {
            if (e.target.innerHTML === '') {
                move++;
                if (move % 2 === 1) {
                    e.target.innerHTML = userSymbol;
                    checkerSymbol = userSymbol;
                } else {
                    e.target.innerHTML = botSymbol;
                    checkerSymbol = botSymbol;
                }
                check();
            }
        } else {
            if (e.target.innerHTML === '') {
                move++;
                e.target.innerHTML = userSymbol;
                checkerSymbol = userSymbol;
                if(check() === false) {
                    move++;
                    if (move < 9) {
                        bot()
                    }
                    checkerSymbol = botSymbol;
                    check();
                }
            }
        }
    }
});

function bot() {
    const boxes = document.getElementsByClassName('box');
    let x = Math.floor(Math.random() * 8);
    while (boxes[x].innerHTML !== ''){
        x = Math.floor(Math.random() * 8);
    }
    boxes[x].innerHTML = botSymbol;
    checkerSymbol = botSymbol;
}

const check = () => {
    const boxes = document.getElementsByClassName('box');
    let winnerComb = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    for (let i = 0; i < winnerComb.length; i++) {
        if (boxes[winnerComb[i][0]].innerHTML === checkerSymbol &&
            boxes[winnerComb[i][1]].innerHTML === checkerSymbol &&
            boxes[winnerComb[i][2]].innerHTML === checkerSymbol){
            if(checkerSymbol === userSymbol){
                winner = 'Winner is Player 1';
                scores[scores.findIndex(i => i.name === 'player1')].score++;
            }
            if(checkerSymbol === botSymbol){
                if (chose === 'Player'){
                    winner = 'Winner is Player 2';
                    scores[scores.findIndex(i => i.name === 'player2')].score++;
                } else {
                    winner = 'Winner is Bot';
                    scores[scores.findIndex(i => i.name === 'bot')].score++;
                }
            }
            setTimeout(resetBoard, 1000);
            currentResult = winner;
            return true;
        }
    }
    if (move >= 9){
        winner = 'Draw';
        currentResult = winner;
        setTimeout(resetBoard, 1000);
        return true;
    }
    return false;
}