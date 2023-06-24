/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/display.js":
/*!************************!*\
  !*** ./src/display.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
        createGameboard(playerContainer, '');
        createGameboard(placementContainer, 'p');

        let i = 0;
        shipText.textContent = `Place your ${board.shipTypes[i].name}`;
        const placementSquares = document.querySelectorAll('.placement-board > div');

        placementSquares.forEach((placementSquare) => {
            placementSquare.addEventListener('click', (e) => {
                const coord = [Number(e.target.id[0]), Number(e.target.id[2])];
                const arrOfCoord = board.calculateCoords(coord, shipOrientation, i);
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
                const coord = [Number(e.target.id[0]), Number(e.target.id[2])];
                const arrOfCoord = board.calculateCoords(coord, shipOrientation, i);
                if (checkValidity(board, arrOfCoord)) {
                    for (let j = 0; j < arrOfCoord.length; j++) {
                        const tmpCoord = arrOfCoord[j];
                        const div = document.getElementById(`${tmpCoord}p`);
                        div.classList.add('hover');
                    }
                }
            });

            placementSquare.addEventListener('mouseleave', () => {
                if (!board.shipTypes[i]) {
                    return;
                }
                const divs = document.querySelectorAll('.hover');
                divs.forEach((div) => {
                    div.classList.remove('hover');
                });
            });
        });
    }

    const randomAIOrientation = () => {
        const tmp = Math.floor(Math.random() * 2);
        if (tmp === 0) {
            return 'horizontal';
        }
        return 'vertical';
    }

    const createAiBoard = (board, player) => {
        createGameboard(aiContainer, '');

        for (let j = 0; j < board.shipTypes.length; j++) {
            let randomCoord = player.randomCoord();
            let aiOrientation = randomAIOrientation();
            let arrOfCoord = board.calculateCoords(randomCoord, aiOrientation, j);

            while (!checkValidity(board, arrOfCoord)) {
                randomCoord = player.randomCoord();
                aiOrientation = randomAIOrientation();
                arrOfCoord = board.calculateCoords(randomCoord, aiOrientation, j);
            }

            board.placeShip(board.shipTypes[j].size, arrOfCoord);
        }

        // REMOVE BELOW THIS LATER
        // const aiSquares = document.querySelectorAll('.ai-board > div');
        // let i = 0;
        // for (let j = 0; j < 10; j++) {
        //     for(let k = 0; k < 10 ; k++) {
        //         if (board.grid[j][k] === 'X') {
        //             aiSquares[i].classList.add('player-ship');
        //         }
        //         i++;
        //     }
        // }
        // REMOVE ABOVE THIS LATER
    }

    const takeAttack = (coord, board, div) => {
        if (board.includesArray(board.missed, coord)) {
            div.classList.add('miss');
        } else {
            div.classList.add('hit');
        }
    }

    const removeDivs = () => {
        while (playerContainer.firstChild) {
            playerContainer.removeChild(playerContainer.firstChild);
        }
        while (aiContainer.firstChild) {
            aiContainer.removeChild(aiContainer.firstChild);
        }
        while (placementContainer.firstChild) {
            placementContainer.removeChild(placementContainer.firstChild);
        }
    }

    return { createPlayerBoard, createAiBoard, takeAttack, showPlayerShips, removeDivs }

})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (display);

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");


class Gameboard {
    constructor() {
        this.grid = this.createGrid();
        this.ships = [];
        this.missed = [];
        this.allSunkStatus = false;
        this.shipTypes = [
            { name: 'Carrier', size: 5 },
            { name: 'Battleship', size: 4 },
            { name: 'Cruiser', size: 3 },
            { name: 'Submarine', size: 3 },
            { name: 'Destroyer', size: 2 }
        ];
    }

    createGrid() {
        const grid = new Array(10);
        for (let i = 0; i < grid.length; i++) {
            grid[i] = new Array(10);
        }
        return grid;
    }

    placeShip(size, arrOfCoord) {
        const ship = new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](size);
        for (let i = 0; i < arrOfCoord.length; i++) {
            const coord = arrOfCoord[i];
            ship.coordinates.push(coord);
            const row = coord[0];
            const col = coord[1];
            this.grid[row][col] = 'X';
        }
        this.ships.push(ship);
        return ship;
    }

    calculateCoords(coord, orientation, inc) {
        const arrOfCoord = [];
        const row = coord[0];
        const col = coord[1];
        arrOfCoord.push(coord);
        if (orientation === 'horizontal') {
            for (let j = col + 1; j < col + this.shipTypes[inc].size; j++) {
                const tmpCoord = [row, j];
                arrOfCoord.push(tmpCoord);
            }
        } else if (orientation === 'vertical') {
            for (let j = row + 1; j < row + this.shipTypes[inc].size; j++) {
                const tmpCoord = [j, col];
                arrOfCoord.push(tmpCoord);
            }
        }
        return arrOfCoord;
    }

    includesArray(data, arr) {
        return data.some(item => Array.isArray(item) && item.every((o, i) => Object.is(arr[i], o)));
    };

    receiveAttack(coord) {
        const row = coord[0];
        const col = coord[1];
        if (this.grid[row][col] === 'X'){
            for (let i = 0; i < this.ships.length; i++) {
                if (this.includesArray(this.ships[i].coordinates, coord)) {
                    this.ships[i].hit();
                }
            }
        } else if (!this.grid[row][col]) {
            this.missed.push(coord);
        }
        this.checkIfAllSunk();
    }

    checkIfAllSunk() {
        if (this.ships.every(item => item.sunkStatus === true)) {
            this.allSunkStatus = true;
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);

/***/ }),

/***/ "./src/gameloop.js":
/*!*************************!*\
  !*** ./src/gameloop.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./display */ "./src/display.js");




const winnerPopup = document.querySelector('.winner-popup');
const winnerText = document.querySelector('.winner-text');
const placementPopup = document.querySelector('.place-ships-popup');

const gameloop = (() => {

    let player = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]('player');
    let playerGameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
    _display__WEBPACK_IMPORTED_MODULE_2__["default"].createPlayerBoard(playerGameboard);
    

    let ai = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]('ai');
    let aiGameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
    _display__WEBPACK_IMPORTED_MODULE_2__["default"].createAiBoard(aiGameboard, ai);

    let turn = 'player';
    let winner = '';

    const checkWinner = (playerBoard, aiBoard) => {
        if (playerBoard.allSunkStatus) {
            winner = 'ai';
            winnerPopup.style.display = 'block';
            winnerText.textContent = 'The computer wins!';
        }
        if (aiBoard.allSunkStatus) {
            winner = 'player';
            winnerPopup.style.display = 'block';
            winnerText.textContent = 'Congrats, you win!';
        }
    }

    const play = (e) => {
        if (winner) {
            return;
        }

        if (turn === 'player') {
            const coord = [Number(e.target.id[0]), Number(e.target.id[2])];
            player.attack(coord, aiGameboard);
            _display__WEBPACK_IMPORTED_MODULE_2__["default"].takeAttack(coord, aiGameboard, e.target);
            turn = 'ai';
        } else if (turn === 'ai') {
            const coord = ai.randomAttack(playerGameboard);
            const playerSquares = document.querySelectorAll('.player-board > div');
            playerSquares.forEach((playerSquare) => {
                const idCoord = [Number(playerSquare.id[0]), Number(playerSquare.id[2])];
                if (idCoord[0] === coord[0] && idCoord[1] === coord[1]) {
                    _display__WEBPACK_IMPORTED_MODULE_2__["default"].takeAttack(coord, playerGameboard, playerSquare);
                }
            });
            turn = 'player';
        }

        checkWinner(playerGameboard, aiGameboard);
    }

    const playAgain = () => {
        window.player = null;
        delete window.player;
        window.playerGameboard = null;
        delete window.playerGameboard;
        window.ai = null;
        delete window.ai;
        window.aiGameboard = null;
        delete window.aiGameboard;
        _display__WEBPACK_IMPORTED_MODULE_2__["default"].removeDivs();

        player = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]('player');
        console.log(player);
        playerGameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
        console.log(playerGameboard);
        _display__WEBPACK_IMPORTED_MODULE_2__["default"].createPlayerBoard(playerGameboard);

        ai = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]('ai');
        console.log(ai);
        aiGameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
        console.log(aiGameboard);
        _display__WEBPACK_IMPORTED_MODULE_2__["default"].createAiBoard(aiGameboard, ai);

        turn = 'player';
        winner = '';

        winnerPopup.style.display = 'none';
        placementPopup.style.display = 'block';
    }

    return { play, winner, playAgain }

})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameloop);

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Player {
    constructor(name) {
        this.name = name;
        this.hits = [];
    }

    attack(coord, gameboard) {
        if (gameboard.includesArray(this.hits, coord)) {
            return;
        }
        gameboard.receiveAttack(coord);
        this.hits.push(coord);
    }

    randomCoord() {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        return [row, col];
    }

    randomAttack(gameboard) {
        let randomCoord = this.randomCoord();
        while (gameboard.includesArray(this.hits, randomCoord)) {
            randomCoord = this.randomCoord();
        }
        gameboard.receiveAttack(randomCoord);
        this.hits.push(randomCoord);
        return randomCoord;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Ship {
    constructor(size) {
        this.shipSize = size;
        this.hitCount = 0;
        this.sunkStatus = false;
        this.coordinates = [];
    }

    hit() {
        this.hitCount += 1;
        this.isSunk();
    }

    isSunk() {
        if (this.shipSize === this.hitCount) {
            this.sunkStatus = true;
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameloop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameloop */ "./src/gameloop.js");


let aiSquares = document.querySelectorAll('.ai-board > div');
const playAgainBtn = document.querySelector('.play-again-btn');

playAgainBtn.addEventListener('click', () => {
    _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"].playAgain();
    aiSquares = document.querySelectorAll('.ai-board > div');
    aiSquares.forEach((aiSquare) => {
        aiSquare.addEventListener('click', (e) => {
            console.log(e.target);
            _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"].play(e);
            _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"].play(e);
        });
    });
});

aiSquares.forEach((aiSquare) => {
    aiSquare.addEventListener('click', (e) => {
        console.log(e.target);
        _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"].play(e);
        _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"].play(e);
    });
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtDOztBQUVsQztBQUNBOztBQUVBO0FBQ0EsSUFBSSxpREFBUTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxpREFBUTtBQUNwQixZQUFZLGlEQUFRO0FBQ3BCLFNBQVM7QUFDVCxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlEQUFRO0FBQ2hCLFFBQVEsaURBQVE7QUFDaEIsS0FBSztBQUNMLENBQUMsRSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZGlzcGxheS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWJvYXJkJyk7XG5jb25zdCBhaUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5haS1ib2FyZCcpO1xuY29uc3QgcGxhY2VtZW50Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlbWVudC1ib2FyZCcpO1xuY29uc3Qgc2hpcFRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC10ZXh0Jyk7XG5jb25zdCBwbGFjZW1lbnRQb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcy1wb3B1cCcpO1xuY29uc3Qgcm90YXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJvdGF0ZS1idG4nKTtcblxuY29uc3QgZGlzcGxheSA9ICgoKSA9PiB7XG5cbiAgICBjb25zdCBjcmVhdGVHYW1lYm9hcmQgPSAocGFyZW50LCBzdWZmaXgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBmb3IobGV0IGsgPSAwOyBrIDwgMTAgOyBrKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgICAgICAgICAgICBzcXVhcmUuc2V0QXR0cmlidXRlKCdpZCcsYCR7an0sJHtrfSR7c3VmZml4fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2hvd1BsYXllclNoaXBzID0gKGJvYXJkKSA9PiB7XG4gICAgICAgIGNvbnN0IHBsYXllclNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLWJvYXJkID4gZGl2Jyk7XG4gICAgICAgIGNvbnN0IHBsYWNlbWVudFNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxhY2VtZW50LWJvYXJkID4gZGl2Jyk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBmb3IobGV0IGsgPSAwOyBrIDwgMTAgOyBrKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9hcmQuZ3JpZFtqXVtrXSA9PT0gJ1gnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllclNxdWFyZXNbaV0uY2xhc3NMaXN0LmFkZCgncGxheWVyLXNoaXAnKTtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50U3F1YXJlc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRTcXVhcmVzW2ldLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1zaGlwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNoZWNrVmFsaWRpdHkgPSAoYm9hcmQsIGFyck9mQ29vcmQpID0+IHtcbiAgICAgICAgbGV0IHZhbGlkaXR5ID0gdHJ1ZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJPZkNvb3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYXJyT2ZDb29yZFtpXVswXSA+IDkgfHwgYXJyT2ZDb29yZFtpXVsxXSA+IDkpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGl0eSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChib2FyZC5ncmlkW2Fyck9mQ29vcmRbaV1bMF1dW2Fyck9mQ29vcmRbaV1bMV1dID09PSAnWCcpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGl0eSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWxpZGl0eTtcbiAgICB9XG5cbiAgICBsZXQgc2hpcE9yaWVudGF0aW9uID0gJ2hvcml6b250YWwnO1xuICAgIFxuICAgIHJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKHNoaXBPcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBzaGlwT3JpZW50YXRpb24gPSAndmVydGljYWwnO1xuICAgICAgICB9IGVsc2UgaWYgKHNoaXBPcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgc2hpcE9yaWVudGF0aW9uID0gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjcmVhdGVQbGF5ZXJCb2FyZCA9IChib2FyZCkgPT4ge1xuICAgICAgICBjcmVhdGVHYW1lYm9hcmQocGxheWVyQ29udGFpbmVyLCAnJyk7XG4gICAgICAgIGNyZWF0ZUdhbWVib2FyZChwbGFjZW1lbnRDb250YWluZXIsICdwJyk7XG5cbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBzaGlwVGV4dC50ZXh0Q29udGVudCA9IGBQbGFjZSB5b3VyICR7Ym9hcmQuc2hpcFR5cGVzW2ldLm5hbWV9YDtcbiAgICAgICAgY29uc3QgcGxhY2VtZW50U3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wbGFjZW1lbnQtYm9hcmQgPiBkaXYnKTtcblxuICAgICAgICBwbGFjZW1lbnRTcXVhcmVzLmZvckVhY2goKHBsYWNlbWVudFNxdWFyZSkgPT4ge1xuICAgICAgICAgICAgcGxhY2VtZW50U3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb29yZCA9IFtOdW1iZXIoZS50YXJnZXQuaWRbMF0pLCBOdW1iZXIoZS50YXJnZXQuaWRbMl0pXTtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJPZkNvb3JkID0gYm9hcmQuY2FsY3VsYXRlQ29vcmRzKGNvb3JkLCBzaGlwT3JpZW50YXRpb24sIGkpO1xuICAgICAgICAgICAgICAgIGlmIChjaGVja1ZhbGlkaXR5KGJvYXJkLCBhcnJPZkNvb3JkKSkge1xuICAgICAgICAgICAgICAgICAgICBib2FyZC5wbGFjZVNoaXAoYm9hcmQuc2hpcFR5cGVzW2ldLnNpemUsIGFyck9mQ29vcmQpO1xuICAgICAgICAgICAgICAgICAgICBzaG93UGxheWVyU2hpcHMoYm9hcmQpO1xuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYm9hcmQuc2hpcFR5cGVzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRQb3B1cC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNoaXBUZXh0LnRleHRDb250ZW50ID0gYFBsYWNlIHlvdXIgJHtib2FyZC5zaGlwVHlwZXNbaV0ubmFtZX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBwbGFjZW1lbnRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb29yZCA9IFtOdW1iZXIoZS50YXJnZXQuaWRbMF0pLCBOdW1iZXIoZS50YXJnZXQuaWRbMl0pXTtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJPZkNvb3JkID0gYm9hcmQuY2FsY3VsYXRlQ29vcmRzKGNvb3JkLCBzaGlwT3JpZW50YXRpb24sIGkpO1xuICAgICAgICAgICAgICAgIGlmIChjaGVja1ZhbGlkaXR5KGJvYXJkLCBhcnJPZkNvb3JkKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFyck9mQ29vcmQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRtcENvb3JkID0gYXJyT2ZDb29yZFtqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3RtcENvb3JkfXBgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBsYWNlbWVudFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghYm9hcmQuc2hpcFR5cGVzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZGl2cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ob3ZlcicpO1xuICAgICAgICAgICAgICAgIGRpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHJhbmRvbUFJT3JpZW50YXRpb24gPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRtcCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICAgICAgICBpZiAodG1wID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZUFpQm9hcmQgPSAoYm9hcmQsIHBsYXllcikgPT4ge1xuICAgICAgICBjcmVhdGVHYW1lYm9hcmQoYWlDb250YWluZXIsICcnKTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkLnNoaXBUeXBlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gcGxheWVyLnJhbmRvbUNvb3JkKCk7XG4gICAgICAgICAgICBsZXQgYWlPcmllbnRhdGlvbiA9IHJhbmRvbUFJT3JpZW50YXRpb24oKTtcbiAgICAgICAgICAgIGxldCBhcnJPZkNvb3JkID0gYm9hcmQuY2FsY3VsYXRlQ29vcmRzKHJhbmRvbUNvb3JkLCBhaU9yaWVudGF0aW9uLCBqKTtcblxuICAgICAgICAgICAgd2hpbGUgKCFjaGVja1ZhbGlkaXR5KGJvYXJkLCBhcnJPZkNvb3JkKSkge1xuICAgICAgICAgICAgICAgIHJhbmRvbUNvb3JkID0gcGxheWVyLnJhbmRvbUNvb3JkKCk7XG4gICAgICAgICAgICAgICAgYWlPcmllbnRhdGlvbiA9IHJhbmRvbUFJT3JpZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICBhcnJPZkNvb3JkID0gYm9hcmQuY2FsY3VsYXRlQ29vcmRzKHJhbmRvbUNvb3JkLCBhaU9yaWVudGF0aW9uLCBqKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYm9hcmQucGxhY2VTaGlwKGJvYXJkLnNoaXBUeXBlc1tqXS5zaXplLCBhcnJPZkNvb3JkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJFTU9WRSBCRUxPVyBUSElTIExBVEVSXG4gICAgICAgIC8vIGNvbnN0IGFpU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5haS1ib2FyZCA+IGRpdicpO1xuICAgICAgICAvLyBsZXQgaSA9IDA7XG4gICAgICAgIC8vIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAvLyAgICAgZm9yKGxldCBrID0gMDsgayA8IDEwIDsgaysrKSB7XG4gICAgICAgIC8vICAgICAgICAgaWYgKGJvYXJkLmdyaWRbal1ba10gPT09ICdYJykge1xuICAgICAgICAvLyAgICAgICAgICAgICBhaVNxdWFyZXNbaV0uY2xhc3NMaXN0LmFkZCgncGxheWVyLXNoaXAnKTtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgaSsrO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIFJFTU9WRSBBQk9WRSBUSElTIExBVEVSXG4gICAgfVxuXG4gICAgY29uc3QgdGFrZUF0dGFjayA9IChjb29yZCwgYm9hcmQsIGRpdikgPT4ge1xuICAgICAgICBpZiAoYm9hcmQuaW5jbHVkZXNBcnJheShib2FyZC5taXNzZWQsIGNvb3JkKSkge1xuICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlbW92ZURpdnMgPSAoKSA9PiB7XG4gICAgICAgIHdoaWxlIChwbGF5ZXJDb250YWluZXIuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgcGxheWVyQ29udGFpbmVyLnJlbW92ZUNoaWxkKHBsYXllckNvbnRhaW5lci5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoYWlDb250YWluZXIuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgYWlDb250YWluZXIucmVtb3ZlQ2hpbGQoYWlDb250YWluZXIuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHBsYWNlbWVudENvbnRhaW5lci5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBwbGFjZW1lbnRDb250YWluZXIucmVtb3ZlQ2hpbGQocGxhY2VtZW50Q29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgY3JlYXRlUGxheWVyQm9hcmQsIGNyZWF0ZUFpQm9hcmQsIHRha2VBdHRhY2ssIHNob3dQbGF5ZXJTaGlwcywgcmVtb3ZlRGl2cyB9XG5cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGRpc3BsYXkiLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNsYXNzIEdhbWVib2FyZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ3JpZCA9IHRoaXMuY3JlYXRlR3JpZCgpO1xuICAgICAgICB0aGlzLnNoaXBzID0gW107XG4gICAgICAgIHRoaXMubWlzc2VkID0gW107XG4gICAgICAgIHRoaXMuYWxsU3Vua1N0YXR1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNoaXBUeXBlcyA9IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ0NhcnJpZXInLCBzaXplOiA1IH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdCYXR0bGVzaGlwJywgc2l6ZTogNCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnQ3J1aXNlcicsIHNpemU6IDMgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ1N1Ym1hcmluZScsIHNpemU6IDMgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0Rlc3Ryb3llcicsIHNpemU6IDIgfVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGNyZWF0ZUdyaWQoKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSBuZXcgQXJyYXkoMTApO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGdyaWRbaV0gPSBuZXcgQXJyYXkoMTApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkO1xuICAgIH1cblxuICAgIHBsYWNlU2hpcChzaXplLCBhcnJPZkNvb3JkKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChzaXplKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJPZkNvb3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IGFyck9mQ29vcmRbaV07XG4gICAgICAgICAgICBzaGlwLmNvb3JkaW5hdGVzLnB1c2goY29vcmQpO1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gY29vcmRbMF07XG4gICAgICAgICAgICBjb25zdCBjb2wgPSBjb29yZFsxXTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFtyb3ddW2NvbF0gPSAnWCc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaGlwcy5wdXNoKHNoaXApO1xuICAgICAgICByZXR1cm4gc2hpcDtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVDb29yZHMoY29vcmQsIG9yaWVudGF0aW9uLCBpbmMpIHtcbiAgICAgICAgY29uc3QgYXJyT2ZDb29yZCA9IFtdO1xuICAgICAgICBjb25zdCByb3cgPSBjb29yZFswXTtcbiAgICAgICAgY29uc3QgY29sID0gY29vcmRbMV07XG4gICAgICAgIGFyck9mQ29vcmQucHVzaChjb29yZCk7XG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gY29sICsgMTsgaiA8IGNvbCArIHRoaXMuc2hpcFR5cGVzW2luY10uc2l6ZTsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG1wQ29vcmQgPSBbcm93LCBqXTtcbiAgICAgICAgICAgICAgICBhcnJPZkNvb3JkLnB1c2godG1wQ29vcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gcm93ICsgMTsgaiA8IHJvdyArIHRoaXMuc2hpcFR5cGVzW2luY10uc2l6ZTsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG1wQ29vcmQgPSBbaiwgY29sXTtcbiAgICAgICAgICAgICAgICBhcnJPZkNvb3JkLnB1c2godG1wQ29vcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJPZkNvb3JkO1xuICAgIH1cblxuICAgIGluY2x1ZGVzQXJyYXkoZGF0YSwgYXJyKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnNvbWUoaXRlbSA9PiBBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0uZXZlcnkoKG8sIGkpID0+IE9iamVjdC5pcyhhcnJbaV0sIG8pKSk7XG4gICAgfTtcblxuICAgIHJlY2VpdmVBdHRhY2soY29vcmQpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gY29vcmRbMF07XG4gICAgICAgIGNvbnN0IGNvbCA9IGNvb3JkWzFdO1xuICAgICAgICBpZiAodGhpcy5ncmlkW3Jvd11bY29sXSA9PT0gJ1gnKXtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQXJyYXkodGhpcy5zaGlwc1tpXS5jb29yZGluYXRlcywgY29vcmQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcHNbaV0uaGl0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmdyaWRbcm93XVtjb2xdKSB7XG4gICAgICAgICAgICB0aGlzLm1pc3NlZC5wdXNoKGNvb3JkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoZWNrSWZBbGxTdW5rKCk7XG4gICAgfVxuXG4gICAgY2hlY2tJZkFsbFN1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnNoaXBzLmV2ZXJ5KGl0ZW0gPT4gaXRlbS5zdW5rU3RhdHVzID09PSB0cnVlKSkge1xuICAgICAgICAgICAgdGhpcy5hbGxTdW5rU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgZGlzcGxheSBmcm9tIFwiLi9kaXNwbGF5XCI7XG5cbmNvbnN0IHdpbm5lclBvcHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lci1wb3B1cCcpO1xuY29uc3Qgd2lubmVyVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5uZXItdGV4dCcpO1xuY29uc3QgcGxhY2VtZW50UG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMtcG9wdXAnKTtcblxuY29uc3QgZ2FtZWxvb3AgPSAoKCkgPT4ge1xuXG4gICAgbGV0IHBsYXllciA9IG5ldyBQbGF5ZXIoJ3BsYXllcicpO1xuICAgIGxldCBwbGF5ZXJHYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgZGlzcGxheS5jcmVhdGVQbGF5ZXJCb2FyZChwbGF5ZXJHYW1lYm9hcmQpO1xuICAgIFxuXG4gICAgbGV0IGFpID0gbmV3IFBsYXllcignYWknKTtcbiAgICBsZXQgYWlHYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgZGlzcGxheS5jcmVhdGVBaUJvYXJkKGFpR2FtZWJvYXJkLCBhaSk7XG5cbiAgICBsZXQgdHVybiA9ICdwbGF5ZXInO1xuICAgIGxldCB3aW5uZXIgPSAnJztcblxuICAgIGNvbnN0IGNoZWNrV2lubmVyID0gKHBsYXllckJvYXJkLCBhaUJvYXJkKSA9PiB7XG4gICAgICAgIGlmIChwbGF5ZXJCb2FyZC5hbGxTdW5rU3RhdHVzKSB7XG4gICAgICAgICAgICB3aW5uZXIgPSAnYWknO1xuICAgICAgICAgICAgd2lubmVyUG9wdXAuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICB3aW5uZXJUZXh0LnRleHRDb250ZW50ID0gJ1RoZSBjb21wdXRlciB3aW5zISc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFpQm9hcmQuYWxsU3Vua1N0YXR1cykge1xuICAgICAgICAgICAgd2lubmVyID0gJ3BsYXllcic7XG4gICAgICAgICAgICB3aW5uZXJQb3B1cC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIHdpbm5lclRleHQudGV4dENvbnRlbnQgPSAnQ29uZ3JhdHMsIHlvdSB3aW4hJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHBsYXkgPSAoZSkgPT4ge1xuICAgICAgICBpZiAod2lubmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHVybiA9PT0gJ3BsYXllcicpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gW051bWJlcihlLnRhcmdldC5pZFswXSksIE51bWJlcihlLnRhcmdldC5pZFsyXSldO1xuICAgICAgICAgICAgcGxheWVyLmF0dGFjayhjb29yZCwgYWlHYW1lYm9hcmQpO1xuICAgICAgICAgICAgZGlzcGxheS50YWtlQXR0YWNrKGNvb3JkLCBhaUdhbWVib2FyZCwgZS50YXJnZXQpO1xuICAgICAgICAgICAgdHVybiA9ICdhaSc7XG4gICAgICAgIH0gZWxzZSBpZiAodHVybiA9PT0gJ2FpJykge1xuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBhaS5yYW5kb21BdHRhY2socGxheWVyR2FtZWJvYXJkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllclNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLWJvYXJkID4gZGl2Jyk7XG4gICAgICAgICAgICBwbGF5ZXJTcXVhcmVzLmZvckVhY2goKHBsYXllclNxdWFyZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkQ29vcmQgPSBbTnVtYmVyKHBsYXllclNxdWFyZS5pZFswXSksIE51bWJlcihwbGF5ZXJTcXVhcmUuaWRbMl0pXTtcbiAgICAgICAgICAgICAgICBpZiAoaWRDb29yZFswXSA9PT0gY29vcmRbMF0gJiYgaWRDb29yZFsxXSA9PT0gY29vcmRbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheS50YWtlQXR0YWNrKGNvb3JkLCBwbGF5ZXJHYW1lYm9hcmQsIHBsYXllclNxdWFyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0dXJuID0gJ3BsYXllcic7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1dpbm5lcihwbGF5ZXJHYW1lYm9hcmQsIGFpR2FtZWJvYXJkKTtcbiAgICB9XG5cbiAgICBjb25zdCBwbGF5QWdhaW4gPSAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5wbGF5ZXIgPSBudWxsO1xuICAgICAgICBkZWxldGUgd2luZG93LnBsYXllcjtcbiAgICAgICAgd2luZG93LnBsYXllckdhbWVib2FyZCA9IG51bGw7XG4gICAgICAgIGRlbGV0ZSB3aW5kb3cucGxheWVyR2FtZWJvYXJkO1xuICAgICAgICB3aW5kb3cuYWkgPSBudWxsO1xuICAgICAgICBkZWxldGUgd2luZG93LmFpO1xuICAgICAgICB3aW5kb3cuYWlHYW1lYm9hcmQgPSBudWxsO1xuICAgICAgICBkZWxldGUgd2luZG93LmFpR2FtZWJvYXJkO1xuICAgICAgICBkaXNwbGF5LnJlbW92ZURpdnMoKTtcblxuICAgICAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKCdwbGF5ZXInKTtcbiAgICAgICAgY29uc29sZS5sb2cocGxheWVyKTtcbiAgICAgICAgcGxheWVyR2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXJHYW1lYm9hcmQpO1xuICAgICAgICBkaXNwbGF5LmNyZWF0ZVBsYXllckJvYXJkKHBsYXllckdhbWVib2FyZCk7XG5cbiAgICAgICAgYWkgPSBuZXcgUGxheWVyKCdhaScpO1xuICAgICAgICBjb25zb2xlLmxvZyhhaSk7XG4gICAgICAgIGFpR2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhhaUdhbWVib2FyZCk7XG4gICAgICAgIGRpc3BsYXkuY3JlYXRlQWlCb2FyZChhaUdhbWVib2FyZCwgYWkpO1xuXG4gICAgICAgIHR1cm4gPSAncGxheWVyJztcbiAgICAgICAgd2lubmVyID0gJyc7XG5cbiAgICAgICAgd2lubmVyUG9wdXAuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgcGxhY2VtZW50UG9wdXAuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcGxheSwgd2lubmVyLCBwbGF5QWdhaW4gfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lbG9vcCIsImNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmhpdHMgPSBbXTtcbiAgICB9XG5cbiAgICBhdHRhY2soY29vcmQsIGdhbWVib2FyZCkge1xuICAgICAgICBpZiAoZ2FtZWJvYXJkLmluY2x1ZGVzQXJyYXkodGhpcy5oaXRzLCBjb29yZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZCk7XG4gICAgICAgIHRoaXMuaGl0cy5wdXNoKGNvb3JkKTtcbiAgICB9XG5cbiAgICByYW5kb21Db29yZCgpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICBjb25zdCBjb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgIHJldHVybiBbcm93LCBjb2xdO1xuICAgIH1cblxuICAgIHJhbmRvbUF0dGFjayhnYW1lYm9hcmQpIHtcbiAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gdGhpcy5yYW5kb21Db29yZCgpO1xuICAgICAgICB3aGlsZSAoZ2FtZWJvYXJkLmluY2x1ZGVzQXJyYXkodGhpcy5oaXRzLCByYW5kb21Db29yZCkpIHtcbiAgICAgICAgICAgIHJhbmRvbUNvb3JkID0gdGhpcy5yYW5kb21Db29yZCgpO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHJhbmRvbUNvb3JkKTtcbiAgICAgICAgdGhpcy5oaXRzLnB1c2gocmFuZG9tQ29vcmQpO1xuICAgICAgICByZXR1cm4gcmFuZG9tQ29vcmQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXIiLCJjbGFzcyBTaGlwIHtcbiAgICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgICAgIHRoaXMuc2hpcFNpemUgPSBzaXplO1xuICAgICAgICB0aGlzLmhpdENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5zdW5rU3RhdHVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbXTtcbiAgICB9XG5cbiAgICBoaXQoKSB7XG4gICAgICAgIHRoaXMuaGl0Q291bnQgKz0gMTtcbiAgICAgICAgdGhpcy5pc1N1bmsoKTtcbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnNoaXBTaXplID09PSB0aGlzLmhpdENvdW50KSB7XG4gICAgICAgICAgICB0aGlzLnN1bmtTdGF0dXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZ2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxubGV0IGFpU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5haS1ib2FyZCA+IGRpdicpO1xuY29uc3QgcGxheUFnYWluQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXktYWdhaW4tYnRuJyk7XG5cbnBsYXlBZ2FpbkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBnYW1lbG9vcC5wbGF5QWdhaW4oKTtcbiAgICBhaVNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWktYm9hcmQgPiBkaXYnKTtcbiAgICBhaVNxdWFyZXMuZm9yRWFjaCgoYWlTcXVhcmUpID0+IHtcbiAgICAgICAgYWlTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQpO1xuICAgICAgICAgICAgZ2FtZWxvb3AucGxheShlKTtcbiAgICAgICAgICAgIGdhbWVsb29wLnBsYXkoZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG5cbmFpU3F1YXJlcy5mb3JFYWNoKChhaVNxdWFyZSkgPT4ge1xuICAgIGFpU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQpO1xuICAgICAgICBnYW1lbG9vcC5wbGF5KGUpO1xuICAgICAgICBnYW1lbG9vcC5wbGF5KGUpO1xuICAgIH0pO1xufSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9