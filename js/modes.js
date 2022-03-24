'use strict'

function is7Boom(elBtn) {
    gLevel.is7Boom = !gLevel.is7Boom
    if (gLevel.isManually) {
        gLevel.isManually = false;
        gLevel.manuallyMinesCount = 0;
        var elManuallyBtn = document.querySelector('.man-mode')
        elManuallyBtn.style.borderWidth = '2px'
        elManuallyBtn.style.color = 'darkgreen'
    }

    init(gLevel.size, gLevel.mines);
    if (gLevel.is7Boom) {
        elBtn.style.borderWidth = '3px'
        elBtn.style.color = 'darkgoldenrod'
    } else {
        elBtn.style.borderWidth = '2px'
        elBtn.style.color = 'darkgreen'
    }
}

function set7BoomMines() {
    var mines = [];
    var boomsCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            boomsCount++
            if (boomsCount !== 7) continue;
            boomsCount = 0;
            gBoard[i][j].isMine = true;
            mines.push({ i, j })
            setMinesNegsCount(i, j);
        }
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

function setManuallyMode(elBtn) {
    if (gLevel.is7Boom) {
        gLevel.is7Boom = false;
        var el7BoomBtn = document.querySelector('.boom')
        el7BoomBtn.style.borderWidth = '2px'
        el7BoomBtn.style.color = 'darkgreen'
    }

    init(gLevel.size, gLevel.mines);
    if (!gLevel.isManually) {
        gLevel.manuallyMinesCount = gLevel.mines;
        gLevel.manuallyMinesStart = gLevel.mines;
        elBtn.style.borderWidth = '3px'
        elBtn.style.color = 'darkgoldenrod'
        var elMsg = document.querySelector('.msg');
        elMsg.innerText = `${gLevel.manuallyMinesCount} mines left`
        elMsg.style.color = 'brown'
        elMsg.classList.remove('hidden')
    } else {
        gLevel.manuallyMinesCount = 0;
        gLevel.manuallyMinesStart = 0;
        elBtn.style.borderWidth = '2px'
        elBtn.style.color = 'darkgreen'
        document.querySelector('.msg').classList.add('hidden')
    }
    gLevel.isManually = !gLevel.isManually;
}

function setMine(idxI, idxJ) {
    if (gLevel.manuallyMinesStart !== gLevel.mines) {
        init(gLevel.size, gLevel.mines);
        gLevel.isManually = false;
        var elBtn = document.querySelector('.man-mode');
        setManuallyMode(elBtn);
    }
    if (gLevel.manuallyMinesCount) {
        gBoard[idxI][idxJ].isMine = true;
        var elCell = document.querySelector(`.cell-${idxI}-${idxJ}`)
        elCell.innerText = MINE;
        gLevel.manuallyMinesCount--
        showMsg(gLevel.manuallyMinesCount);
    }

    if (!gLevel.manuallyMinesCount) {
        gGame.isHold = true;
        setManuallyMines()
        setTimeout(removeInnerText, 500)
        gLevel.isManually = false;
        var elBtn = document.querySelector('.man-mode')
        elBtn.style.borderWidth = '2px'
        elBtn.style.color = 'darkgreen'
        setTimeout(() => document.querySelector('.msg').classList.add('hidden'), 500)
    }

}

function setManuallyMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMine) continue;
            setMinesNegsCount(i, j);
        }
    }

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].minesAroundCount = 0;
            } else if (gBoard[i][j].minesAroundCount) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add(`count${gBoard[i][j].minesAroundCount}`);
            }
        }
    }
}

function removeInnerText() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            elCell.innerText = '';
        }
    }
    gGame.isHold = false
}

function showMsg(mines) {
    var elMsg = document.querySelector('.msg');
    elMsg.innerText = `${mines} mines left`
    elMsg.style.color = 'brown'
    elMsg.classList.remove('hidden')
}