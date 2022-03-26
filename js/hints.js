'use strict'

var gIsHint;

function askHint(elHints) {
    if (!gGame.hints || !gGame.isOn) return;
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

function useHint(idxI, idxJ) {
    hintSound.pause();
    hintSound.play();
    gIsHint = false;
    gGame.hints--
    var elHints = document.querySelector('.hints');
    var neighbors = getNeighbors(gBoard, idxI, idxJ);
    var str = 'Click For Hint \n'
    for (var i = 0; i < gGame.hints; i++) {
        str += '💡'
    }
    if (!gGame.hints) str = 'NO HINTS!'
    elHints.innerText = str;
    elHints.style.fontSize = "14px"
    elHints.style.color = "rgb(102, 25, 25)"

    showHint(true, idxI, idxJ);
    for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i].isShown || neighbors[i].isMarked) continue;
        showHint(true, neighbors[i].i, neighbors[i].j)
    }

    setTimeout(function () {
        showHint(false, idxI, idxJ);
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i].isShown || neighbors[i].isMarked) continue;
            showHint(false, neighbors[i].i, neighbors[i].j)
        }
    }, 1000)
}

function showHint(isReveal, i, j) {
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    if (isReveal) {
        elCell.classList.remove('covered');
        if (gBoard[i][j].minesAroundCount) elCell.innerText = gBoard[i][j].minesAroundCount
        else if (gBoard[i][j].isMine) elCell.innerHTML = MINE
        else elCell.innerText = EMPTY;
    } else {
        elCell.classList.add('covered');
        elCell.innerText = ''
    }
}

function markSafe() {
    if (!gGame.safes || !gGame.isOn || gLevel.isManually) return;
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
        safeSound.play();
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

