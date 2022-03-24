'use strict'

function randomizeMines() {
    var mines = [];
    var minesCount = gLevel.mines;
    while (minesCount > 0) {
        var randomI = getRandomInt(0, gBoard.length);
        var randomJ = getRandomInt(0, gBoard[0].length);

        if (gBoard[randomI][randomJ].isMine || gBoard[randomI][randomJ].isShown) continue;

        gBoard[randomI][randomJ].isMine = true;
        mines.push({ i: randomI, j: randomJ })
        setMinesNegsCount(randomI, randomJ);
        minesCount--
    }
    for (var i = 0; i < mines.length; i++) {
        gBoard[mines[i].i][mines[i].j].minesAroundCount = 0;
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].minesAroundCount) continue;
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add(`count${gBoard[i][j].minesAroundCount}`);
        }
    }
}

function setMinesNegsCount(idxI, idxJ) {
    var negs = getNeighbors(gBoard, idxI, idxJ)
    for (var i = 0; i < negs.length; i++) {
        negs[i].minesAroundCount++
    }
}

function isBoardSet() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) return true;
        }
    }

    return false;
}