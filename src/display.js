const playerContainer = document.querySelector('.player-board');
const aiContainer = document.querySelector('.ai-board');
const placementContainer = document.querySelector('.placement-board');
const shipText = document.querySelector('.ship-text');
const placementPopup = document.querySelector('.place-ships-popup');

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
                    placementSquares[i].classList.add('player-ship');
                }
                i++;
            }
        }
    }

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
                for (let j = col + 1; j < col + board.shipTypes[i].size; j++) {
                    const tmpCoord = [row, j];
                    arrOfCoord.push(tmpCoord);
                }
                console.log(board.shipTypes[i].size);
                console.log(arrOfCoord);
                board.placeShip(board.shipTypes[i].size, arrOfCoord);
                showPlayerShips(board);
                i++;
                if (!board.shipTypes[i]) {
                    placementPopup.style.display = 'none';
                    return;
                }
                shipText.textContent = `Place your ${board.shipTypes[i].name}`;
            });
        });

        // need to not let you input ship if out of bounds
        // need to add ability to rotate
        // need to show ship highlighted on mouseover
        // need to add ship to placement board when clicking


        // placementSquares.forEach((placementSquare) => {
        //     placementSquare.addEventListener('mouseover', (e) => {
        //         const coord = [Number(e.target.id[0]), Number(e.target.id[2])];
        //         const row = coord[0];
        //         const col = coord[1];
        //         for (let i = col + 1; i < col + 5; i++) {
        //             const tmpCoord = [row, i];
        //             console.log(tmpCoord);
        //             const div = document.getElementById(tmpCoord);
        //             console.log(div);
        //             div.focus();
        //         }
        //     });
        // });

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