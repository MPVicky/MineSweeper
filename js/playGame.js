'use strict'

function cellClicked(elCell, i, j) {
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked || !gGame.isOn || gGame.isHold) return;
    if (gIsHint) {
        useHint(i, j);
        return;
    }
    if (!gStartTime && !gLevel.isManually) {
        gStartTime = Date.now();
        gInteval = setInterval(renderClock, 1000);
        if (gLevel.is7Boom) {
            set7BoomMines();
        } else if (!isBoardSet()) {
            gBoard[i][j].isShown = true;
            randomizeMines();
        }
    }
    if (gLevel.isManually) {
        setMine(i, j)
        return;
    }
    reveal(elCell, i, j);
    if (gBoard[i][j].isMine) handleMine(i, j);
    if (checkWin()) gameOver(true);
}


function reveal(elCell, i, j) {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    elCell.classList.remove('covered');
    if (gBoard[i][j].minesAroundCount) elCell.innerText = gBoard[i][j].minesAroundCount
    else if (gBoard[i][j].isMine) elCell.innerHTML = MINE
    else {
        elCell.innerText = EMPTY;
        expandShown(i, j)
    }
}

function cellMarked(elCell, ev, i, j) {
    ev.preventDefault();
    if (!gGame.isOn || gBoard[i][j].isShown) return;
    if (gBoard[i][j].isMarked) {
        elCell.innerText = ''
        gGame.markedCount--
        gGame.minesLeft++
    } else {
        if (!gGame.minesLeft) return;
        elCell.innerHTML = FLAG;
        gGame.markedCount++
        gGame.minesLeft--
        if (checkWin()) gameOver(true);
    }
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    document.querySelector('.mines-left').innerText = `Mines Left:\n ${gGame.minesLeft}`;
}


function checkWin() {
    if (gGame.shownCount + gGame.markedCount !== gBoard.length * gBoard[0].length) return false;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].minesAroundCount && !gBoard[i][j].isShown) return false;
        }
    }
    return true;
}


function expandShown(idxI, idxJ) {
    var negs = getNeighbors(gBoard, idxI, idxJ)
    for (var i = 0; i < negs.length; i++) {
        if (!negs[i].isMine && !negs[i].isShown && !negs[i].isMarked) {

            var elNeighborCell = document.querySelector(`.cell-${negs[i].i}-${negs[i].j}`)
            reveal(elNeighborCell, negs[i].i, negs[i].j);
        }
    }
}