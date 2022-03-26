'use strict'

// const MINE = '💥'
const MINE = '<img src="img/mine.png" width="17">'
const FLAG = '<img src="img/flag1.png" width="17">'
const EMPTY = ' '


const winSound = new Audio('audio/winSound.wav');
const loseSound = new Audio('audio/loseSound.wav');
const hintSound = new Audio('audio/hintSound.wav');
const safeSound = new Audio('audio/safeSound.wav');
const mineTouchSound = new Audio('audio/mineTouchSound.wav');

var gBoard;

var gLevel = {
    size: 4,
    mines: 3,
    is7Boom: false,
    isManually: false,
    manuallyMinesCount: 0,
    manuallyMinesStart: 0,
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    lives: 3,
    minesLeft: null,
    hints: 3,
    safes: 3,
    isHold: false,
}

var gStartTime;
var gInteval;

function init(size = 4, mines = 3) {
    document.querySelector('.lives').innerText = 'Lives: \n 🧡🧡🧡'
    document.querySelector('.min').innerText = '00'
    document.querySelector('.sec').innerText = '00'
    document.querySelector('.hints').innerText = 'Click For Hint \n💡💡💡'
    document.querySelector('.safe').innerText = '  Safe Clicks \n⭐⭐⭐'
    document.querySelector('.msg').classList.add('hidden')
    document.querySelector('.smiley').src = 'img/smiley.png'
    gGame.minesLeft = mines;
    document.querySelector('.mines-left').innerText = `Mines Left: \n ${gGame.minesLeft}`;
    if (gInteval) clearInterval(gInteval);
    gInteval = null;
    gIsHint = false;
    gStartTime = null;
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.lives = 3;
    gGame.hints = 3;
    gGame.safes = 3;
    gLevel.size = size;
    gLevel.mines = mines;
    var bestTime = localStorage.getItem('bestTime');
    if (bestTime) showBestTime(bestTime)
    if (gLevel.isManually) showMsg(mines);
    gBoard = buildBoard();
    renderBoard()
    // console.log(gBoard);
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        var row = [];
        for (var j = 0; j < gLevel.size; j++) {
            var cell = {
                i,
                j,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            row.push(cell);
        }
        board.push(row)
    }
    return board
}

function renderBoard() {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            var className = 'cell cell-' + i + '-' + j + '  covered';
            // var className = 'cell cell-' + i + '-' + j + ' count' + gBoard[i][j].minesAroundCount;
            strHTML += '<td oncontextmenu="cellMarked(this, event,' + i + ',' + j + ')" onclick="cellClicked(this,' + i + ',' + j + ')" class="' + className + '"> ' + '' + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';

    var elContainer = document.querySelector('.table-container')
    elContainer.innerHTML = strHTML;
}


function renderClock() {
    var timeDiff = Date.now() - gStartTime;
    var currTime = new Date(timeDiff);
    document.querySelector('.min').innerText = `${pad(currTime.getMinutes())}`
    document.querySelector('.sec').innerText = `${pad(currTime.getSeconds())}`
}


function gameOver(isWin) {
    gGame.isOn = false;
    clearInterval(gInteval);
    gInteval = null;
    var elEndMsg = document.querySelector('.msg')
    var elSmiley = document.querySelector('.smiley')
    //WIN:
    if (isWin) {
        winSound.play();
        var minStr = document.querySelector('.min').innerText
        var secStr = document.querySelector('.sec').innerText
        var timeUnits = minStr === '00' ? 'seconds' : 'minutes'
        elEndMsg.innerText = `YOU WON! You did it in ${minStr}:${secStr} ${timeUnits}!`
        elEndMsg.style.color = 'lightgreen'
        elSmiley.src = 'img/win.png'

        var bestTime = localStorage.getItem('bestTime')
        var currTime = +minStr * 60 * 1000 + +secStr * 1000
        if (currTime < bestTime || !bestTime) {
            localStorage.setItem('bestTime', `${currTime}`)
            showBestTime(currTime)
        }
        else showBestTime(bestTime)

    } else {
        //LOSE:
        loseSound.play();
        document.querySelector('.lives').innerText = 'Lives:\n 💔';
        elEndMsg.innerText = 'YOU LOST... TRY AGAIN!'
        elEndMsg.style.color = 'red'
        elSmiley.src = 'img/sad.png'
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                if (gBoard[i][j].isMarked) {
                    gGame.markedCount--
                    gGame.minesLeft++
                }
                if (gBoard[i][j].isMine) {
                    reveal(elCell, i, j);
                }
            }
        }

    }
    elEndMsg.classList.remove('hidden')
}

function showBestTime(ms) {
    var minutes = parseInt(ms / 1000 / 60)
    var seconds = (ms - (minutes * 60 * 1000)) / 1000
    var minStr = minutes < 10 ? '0' + minutes : minutes
    var secStr = seconds < 10 ? '0' + seconds : seconds
    var elBestTime = document.querySelector('.best')
    elBestTime.innerText = `Best Time: ${minStr}:${secStr}`
    elBestTime.classList.remove('hidden');
}

function smileyClick() {
    init(gLevel.size, gLevel.mines);
}


