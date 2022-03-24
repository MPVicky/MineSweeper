'use strict'

var gIsHint;

function askHint(elHints) {
    if (!gGame.hints) return;
    if (!gStartTime) {
        elHints.innerText = 'start playing...'
        setTimeout(() => {
            elHints.innerText = 'Click For Hint \n💡💡💡'
        }, 1000);
        return;
    }
    if (!gIsHint) {
        elHints.style.fontSize = '14px'
        elHints.style.color = 'yellow'
    } else {
        elHints.style.fontSize = '13px'
        elHints.style.color = 'rgb(102, 25, 25)'
    }
    gIsHint = !gIsHint;
}

function useHint(i, j) {
    gIsHint = false;
    gGame.hints--
    var elHints = document.querySelector('.hints');
    var neighbors = getNeighbors(gBoard, i, j);
    var str = 'Click For Hint \n'
    for (var i = 0; i < gGame.hints; i++) {
        str += '💡'
    }
    if (!gGame.hints) str = 'NO HINTS!'
    elHints.innerText = str;
    elHints.style.fontSize = "14px"
    elHints.style.color = "rgb(102, 25, 25)"

    for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i].isShown || neighbors[i].isMarked) continue;
        var elCell = document.querySelector(`.cell-${neighbors[i].i}-${neighbors[i].j}`)
        elCell.classList.remove('covered');
        if (neighbors[i].minesAroundCount) elCell.innerText = neighbors[i].minesAroundCount
        else if (neighbors[i].isMine) elCell.innerText = MINE
        else elCell.innerText = EMPTY;
    }
    setTimeout(function () {
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i].isShown || neighbors[i].isMarked) continue;
            var elCell = document.querySelector(`.cell-${neighbors[i].i}-${neighbors[i].j}`)
            elCell.classList.add('covered');
            elCell.innerText = ''
        }
    }, 1000)
}

function markSafe() {
    if (!gGame.safes) return;
    var elSafe = document.querySelector('.safe');
    var safes = [];
    var safeStr;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (!cell.isShown && !cell.isMarked && !cell.isMine) safes.push(cell)
        }
    }
    gGame.safes--

    if (safes.length === 0) safeStr = 'NO SAFE PLACES...'
    else {
        var randomI = getRandomInt(0, safes.length)
        var elCell = document.querySelector(`.cell-${safes[randomI].i}-${safes[randomI].j}`)
        elCell.innerText = '⭐'
        setTimeout(() => elCell.innerText = '', 150);
        if (!gGame.safes) safeStr = 'NO SAFE CLICKS!'
        else {
            safeStr = 'Safe Clicks \n';
            for (var i = 0; i < gGame.safes; i++) {
                safeStr += '⭐'
            }
        }
    }
    elSafe.innerText = safeStr;
}

