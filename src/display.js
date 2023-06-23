const playerContainer = document.querySelector('.player-board');
const aiContainer = document.querySelector('.ai-board');
const placementContainer = document.querySelector('.placement-board');
const shipText = document.querySelector('.ship-text');
const placementPopup = document.querySelector('.place-ships-popup');
const rotateBtn = document.querySelector('.rotate-btn');

const display = (() => {

    const createGameboard = (parent, suffix) => {
        for (let j = 0; j < 10; j++) {
            for(let k = 0; k < 10 ; k++) {
                const square = document.createElement('div');
                parent.appendChild(square);
                square.setAttribute('id',`${j},${k}${suffix}`);
            }
        }
    }

    const showPlayerShips = (board) => {
        const playerSquares = document.querySelectorAll('.player-board > div');
        const placementSquares = document.querySelectorAll('.placement-board > div');
        let i = 0;
        for (let j = 0; j < 10; j++) {
            for(let k = 0; k < 10 ; k++) {
                if (board.grid[j][k] === 'X') {
                    playerSquares[i].classList.add('player-ship');
                    placementSquares[i].classList.remove('hover');
                    placementSquares[i].classList.add('player-ship');
                }
                i++;
            }
        }
    }

    const checkValidity = (board, arrOfCoord) => {
        let validity = true;
        for (let i = 0; i < arrOfCoord.length; i++) {
            if (arrOfCoord[i][0] > 9 || arrOfCoord[i][1] > 9) {
                validity = false;
            } else if (board.grid[arrOfCoord[i][0]][arrOfCoord[i][1]] === 'X') {
                validity = false;
            }
        }
        return validity;
    }

    let shipOrientation = 'horizontal';
    
    rotateBtn.addEventListener('click', () => {
        if (shipOrientation === 'horizontal') {
            shipOrientation = 'vertical';
        } else if (shipOrientation === 'vertical') {
            shipOrientation = 'horizontal';
        }
    });

    const createPlayerBoard = (board) => {
        // create player gameboard
        createGameboard(playerContainer, '');

        // create placement board
        createGameboard(placementContainer, 'p');


        // place initial ship
        let i = 0;
        shipText.textContent = `Place your ${board.shipTypes[i].name}`;
        const placementSquares = document.querySelectorAll('.placement-board > div');
        placementSquares.forEach((placementSquare) => {
            placementSquare.addEventListener('click', (e) => {
                const arrOfCoord = [];
                const coord = [Number(e.target.id[0]), Number(e.target.id[2])];
                const row = coord[0];
                const col = coord[1];
                arrOfCoord.push(coord);
                if (shipOrientation === 'horizontal') {
                    for (let j = col + 1; j < col + board.shipTypes[i].size; j++) {
                        const tmpCoord = [row, j];
                        arrOfCoord.push(tmpCoord);
                    }
                } else if (shipOrientation === 'vertical') {
                    for (let j = row + 1; j < row + board.shipTypes[i].size; j++) {
                        const tmpCoord = [j, col];
                        arrOfCoord.push(tmpCoord);
                    }
                }
                console.log(arrOfCoord);
                console.log(checkValidity(board, arrOfCoord));
                if (checkValidity(board, arrOfCoord)) {
                    board.placeShip(board.shipTypes[i].size, arrOfCoord);
                    showPlayerShips(board);
                    i++;
                    if (!board.shipTypes[i]) {
                        placementPopup.style.display = 'none';
                        return;
                    }
                    shipText.textContent = `Place your ${board.shipTypes[i].name}`;
                }
            });
            
            placementSquare.addEventListener('mouseover', (e) => {
                const arrOfCoord = [];
                const coord = [Number(e.target.id[0]), Number(e.target.id[2])];
                const row = coord[0];
                const col = coord[1];
                arrOfCoord.push(coord);
                if (shipOrientation === 'horizontal') {
                    for (let j = col + 1; j < col + board.shipTypes[i].size; j++) {
                        const tmpCoord = [row, j];
                        arrOfCoord.push(tmpCoord);
                    }
                } else if (shipOrientation === 'vertical') {
                    for (let j = row + 1; j < row + board.shipTypes[i].size; j++) {
                        const tmpCoord = [j, col];
                        arrOfCoord.push(tmpCoord);
                    }
                }
                if (checkValidity(board, arrOfCoord)) {
                    for (let j = 0; j < arrOfCoord.length; j++) {
                        const tmpCoord = arrOfCoord[j];
                        const div = document.getElementById(`${tmpCoord}p`);
                        div.classList.add('hover');
                    }
                }
            });

            placementSquare.addEventListener('mouseleave', (e) => {
                if (!board.shipTypes[i]) {
                    return;
                }
                const arrOfCoord = [];
                const coord = [Number(e.target.id[0]), Number(e.target.id[2])];
                const row = coord[0];
                const col = coord[1];
                arrOfCoord.push(coord);
                if (shipOrientation === 'horizontal') {
                    for (let j = col + 1; j < col + board.shipTypes[i].size; j++) {
                        const tmpCoord = [row, j];
                        arrOfCoord.push(tmpCoord);

                    }
                } else if (shipOrientation === 'vertical') {
                    for (let j = row + 1; j < row + board.shipTypes[i].size; j++) {
                        const tmpCoord = [j, col];
                        arrOfCoord.push(tmpCoord);
                    }
                }
                if (checkValidity(board, arrOfCoord)) {
                    for (let j = 0; j < arrOfCoord.length; j++) {
                        const tmpCoord = arrOfCoord[j];
                        const div = document.getElementById(`${tmpCoord}p`);
                        div.classList.remove('hover');
                    }
                }
            });
        });
    }

    const createAiBoard = () => {
        createGameboard(aiContainer, '');
    }

    const takeAttack = (coord, board, div) => {
        if (board.includesArray(board.missed, coord)) {
            div.classList.add('miss');
        } else {
            div.classList.add('hit');
        }
    }

    return { createPlayerBoard, createAiBoard, takeAttack }

})();

export default display