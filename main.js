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

    const createPlayerBoard = (board) => {
        createGameboard(playerContainer, '');
        createGameboard(placementContainer, 'p');

        let i = 0;
        shipText.textContent = `Place your ${board.shipTypes[i].name}`;
        const placementSquares = document.querySelectorAll('.placement-board > div');
        let shipOrientation = 'horizontal';
    
        rotateBtn.addEventListener('click', () => {
            if (shipOrientation === 'horizontal') {
                shipOrientation = 'vertical';
            } else if (shipOrientation === 'vertical') {
                shipOrientation = 'horizontal';
            }
        });

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
        _display__WEBPACK_IMPORTED_MODULE_2__["default"].removeDivs();

        player = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]('player');
        playerGameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
        _display__WEBPACK_IMPORTED_MODULE_2__["default"].createPlayerBoard(playerGameboard);

        ai = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]('ai');
        aiGameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
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
            _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"].play(e);
            _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"].play(e);
        });
    });
});

aiSquares.forEach((aiSquare) => {
    aiSquare.addEventListener('click', (e) => {
        _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"].play(e);
        _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"].play(e);
    });
});

// make UI prettier

// implement mobile view

// clean up code
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUE7QUFDQSxJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsWUFBWSxpREFBUTtBQUNwQixZQUFZLGlEQUFRO0FBQ3BCLFNBQVM7QUFDVCxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsUUFBUSxpREFBUTtBQUNoQixRQUFRLGlEQUFRO0FBQ2hCLEtBQUs7QUFDTCxDQUFDOztBQUVEOztBQUVBOztBQUVBLGdCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kaXNwbGF5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItYm9hcmQnKTtcbmNvbnN0IGFpQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFpLWJvYXJkJyk7XG5jb25zdCBwbGFjZW1lbnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2VtZW50LWJvYXJkJyk7XG5jb25zdCBzaGlwVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXRleHQnKTtcbmNvbnN0IHBsYWNlbWVudFBvcHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzLXBvcHVwJyk7XG5jb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucm90YXRlLWJ0bicpO1xuXG5jb25zdCBkaXNwbGF5ID0gKCgpID0+IHtcblxuICAgIGNvbnN0IGNyZWF0ZUdhbWVib2FyZCA9IChwYXJlbnQsIHN1ZmZpeCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGZvcihsZXQgayA9IDA7IGsgPCAxMCA7IGsrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgICAgICAgICAgICAgIHNxdWFyZS5zZXRBdHRyaWJ1dGUoJ2lkJyxgJHtqfSwke2t9JHtzdWZmaXh9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzaG93UGxheWVyU2hpcHMgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgY29uc3QgcGxheWVyU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wbGF5ZXItYm9hcmQgPiBkaXYnKTtcbiAgICAgICAgY29uc3QgcGxhY2VtZW50U3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wbGFjZW1lbnQtYm9hcmQgPiBkaXYnKTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGZvcihsZXQgayA9IDA7IGsgPCAxMCA7IGsrKykge1xuICAgICAgICAgICAgICAgIGlmIChib2FyZC5ncmlkW2pdW2tdID09PSAnWCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyU3F1YXJlc1tpXS5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItc2hpcCcpO1xuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRTcXVhcmVzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFNxdWFyZXNbaV0uY2xhc3NMaXN0LmFkZCgncGxheWVyLXNoaXAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY2hlY2tWYWxpZGl0eSA9IChib2FyZCwgYXJyT2ZDb29yZCkgPT4ge1xuICAgICAgICBsZXQgdmFsaWRpdHkgPSB0cnVlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyck9mQ29vcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhcnJPZkNvb3JkW2ldWzBdID4gOSB8fCBhcnJPZkNvb3JkW2ldWzFdID4gOSkge1xuICAgICAgICAgICAgICAgIHZhbGlkaXR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJvYXJkLmdyaWRbYXJyT2ZDb29yZFtpXVswXV1bYXJyT2ZDb29yZFtpXVsxXV0gPT09ICdYJykge1xuICAgICAgICAgICAgICAgIHZhbGlkaXR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbGlkaXR5O1xuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZVBsYXllckJvYXJkID0gKGJvYXJkKSA9PiB7XG4gICAgICAgIGNyZWF0ZUdhbWVib2FyZChwbGF5ZXJDb250YWluZXIsICcnKTtcbiAgICAgICAgY3JlYXRlR2FtZWJvYXJkKHBsYWNlbWVudENvbnRhaW5lciwgJ3AnKTtcblxuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHNoaXBUZXh0LnRleHRDb250ZW50ID0gYFBsYWNlIHlvdXIgJHtib2FyZC5zaGlwVHlwZXNbaV0ubmFtZX1gO1xuICAgICAgICBjb25zdCBwbGFjZW1lbnRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYWNlbWVudC1ib2FyZCA+IGRpdicpO1xuICAgICAgICBsZXQgc2hpcE9yaWVudGF0aW9uID0gJ2hvcml6b250YWwnO1xuICAgIFxuICAgICAgICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoc2hpcE9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgICAgICBzaGlwT3JpZW50YXRpb24gPSAndmVydGljYWwnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGlwT3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgICAgICBzaGlwT3JpZW50YXRpb24gPSAnaG9yaXpvbnRhbCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBsYWNlbWVudFNxdWFyZXMuZm9yRWFjaCgocGxhY2VtZW50U3F1YXJlKSA9PiB7XG4gICAgICAgICAgICBwbGFjZW1lbnRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gW051bWJlcihlLnRhcmdldC5pZFswXSksIE51bWJlcihlLnRhcmdldC5pZFsyXSldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFyck9mQ29vcmQgPSBib2FyZC5jYWxjdWxhdGVDb29yZHMoY29vcmQsIHNoaXBPcmllbnRhdGlvbiwgaSk7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrVmFsaWRpdHkoYm9hcmQsIGFyck9mQ29vcmQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkLnBsYWNlU2hpcChib2FyZC5zaGlwVHlwZXNbaV0uc2l6ZSwgYXJyT2ZDb29yZCk7XG4gICAgICAgICAgICAgICAgICAgIHNob3dQbGF5ZXJTaGlwcyhib2FyZCk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFib2FyZC5zaGlwVHlwZXNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFBvcHVwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2hpcFRleHQudGV4dENvbnRlbnQgPSBgUGxhY2UgeW91ciAke2JvYXJkLnNoaXBUeXBlc1tpXS5uYW1lfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBsYWNlbWVudFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gW051bWJlcihlLnRhcmdldC5pZFswXSksIE51bWJlcihlLnRhcmdldC5pZFsyXSldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFyck9mQ29vcmQgPSBib2FyZC5jYWxjdWxhdGVDb29yZHMoY29vcmQsIHNoaXBPcmllbnRhdGlvbiwgaSk7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrVmFsaWRpdHkoYm9hcmQsIGFyck9mQ29vcmQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYXJyT2ZDb29yZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG1wQ29vcmQgPSBhcnJPZkNvb3JkW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7dG1wQ29vcmR9cGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGxhY2VtZW50U3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFib2FyZC5zaGlwVHlwZXNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBkaXZzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhvdmVyJyk7XG4gICAgICAgICAgICAgICAgZGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmFuZG9tQUlPcmllbnRhdGlvbiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdG1wID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgICAgIGlmICh0bXAgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlQWlCb2FyZCA9IChib2FyZCwgcGxheWVyKSA9PiB7XG4gICAgICAgIGNyZWF0ZUdhbWVib2FyZChhaUNvbnRhaW5lciwgJycpO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmQuc2hpcFR5cGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBsZXQgcmFuZG9tQ29vcmQgPSBwbGF5ZXIucmFuZG9tQ29vcmQoKTtcbiAgICAgICAgICAgIGxldCBhaU9yaWVudGF0aW9uID0gcmFuZG9tQUlPcmllbnRhdGlvbigpO1xuICAgICAgICAgICAgbGV0IGFyck9mQ29vcmQgPSBib2FyZC5jYWxjdWxhdGVDb29yZHMocmFuZG9tQ29vcmQsIGFpT3JpZW50YXRpb24sIGopO1xuXG4gICAgICAgICAgICB3aGlsZSAoIWNoZWNrVmFsaWRpdHkoYm9hcmQsIGFyck9mQ29vcmQpKSB7XG4gICAgICAgICAgICAgICAgcmFuZG9tQ29vcmQgPSBwbGF5ZXIucmFuZG9tQ29vcmQoKTtcbiAgICAgICAgICAgICAgICBhaU9yaWVudGF0aW9uID0gcmFuZG9tQUlPcmllbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgIGFyck9mQ29vcmQgPSBib2FyZC5jYWxjdWxhdGVDb29yZHMocmFuZG9tQ29vcmQsIGFpT3JpZW50YXRpb24sIGopO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBib2FyZC5wbGFjZVNoaXAoYm9hcmQuc2hpcFR5cGVzW2pdLnNpemUsIGFyck9mQ29vcmQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdGFrZUF0dGFjayA9IChjb29yZCwgYm9hcmQsIGRpdikgPT4ge1xuICAgICAgICBpZiAoYm9hcmQuaW5jbHVkZXNBcnJheShib2FyZC5taXNzZWQsIGNvb3JkKSkge1xuICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlbW92ZURpdnMgPSAoKSA9PiB7XG4gICAgICAgIHdoaWxlIChwbGF5ZXJDb250YWluZXIuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgcGxheWVyQ29udGFpbmVyLnJlbW92ZUNoaWxkKHBsYXllckNvbnRhaW5lci5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoYWlDb250YWluZXIuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgYWlDb250YWluZXIucmVtb3ZlQ2hpbGQoYWlDb250YWluZXIuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHBsYWNlbWVudENvbnRhaW5lci5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBwbGFjZW1lbnRDb250YWluZXIucmVtb3ZlQ2hpbGQocGxhY2VtZW50Q29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgY3JlYXRlUGxheWVyQm9hcmQsIGNyZWF0ZUFpQm9hcmQsIHRha2VBdHRhY2ssIHNob3dQbGF5ZXJTaGlwcywgcmVtb3ZlRGl2cyB9XG5cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGRpc3BsYXkiLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNsYXNzIEdhbWVib2FyZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ3JpZCA9IHRoaXMuY3JlYXRlR3JpZCgpO1xuICAgICAgICB0aGlzLnNoaXBzID0gW107XG4gICAgICAgIHRoaXMubWlzc2VkID0gW107XG4gICAgICAgIHRoaXMuYWxsU3Vua1N0YXR1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNoaXBUeXBlcyA9IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ0NhcnJpZXInLCBzaXplOiA1IH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdCYXR0bGVzaGlwJywgc2l6ZTogNCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnQ3J1aXNlcicsIHNpemU6IDMgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ1N1Ym1hcmluZScsIHNpemU6IDMgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0Rlc3Ryb3llcicsIHNpemU6IDIgfVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGNyZWF0ZUdyaWQoKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSBuZXcgQXJyYXkoMTApO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGdyaWRbaV0gPSBuZXcgQXJyYXkoMTApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkO1xuICAgIH1cblxuICAgIHBsYWNlU2hpcChzaXplLCBhcnJPZkNvb3JkKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChzaXplKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJPZkNvb3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IGFyck9mQ29vcmRbaV07XG4gICAgICAgICAgICBzaGlwLmNvb3JkaW5hdGVzLnB1c2goY29vcmQpO1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gY29vcmRbMF07XG4gICAgICAgICAgICBjb25zdCBjb2wgPSBjb29yZFsxXTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFtyb3ddW2NvbF0gPSAnWCc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaGlwcy5wdXNoKHNoaXApO1xuICAgICAgICByZXR1cm4gc2hpcDtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVDb29yZHMoY29vcmQsIG9yaWVudGF0aW9uLCBpbmMpIHtcbiAgICAgICAgY29uc3QgYXJyT2ZDb29yZCA9IFtdO1xuICAgICAgICBjb25zdCByb3cgPSBjb29yZFswXTtcbiAgICAgICAgY29uc3QgY29sID0gY29vcmRbMV07XG4gICAgICAgIGFyck9mQ29vcmQucHVzaChjb29yZCk7XG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gY29sICsgMTsgaiA8IGNvbCArIHRoaXMuc2hpcFR5cGVzW2luY10uc2l6ZTsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG1wQ29vcmQgPSBbcm93LCBqXTtcbiAgICAgICAgICAgICAgICBhcnJPZkNvb3JkLnB1c2godG1wQ29vcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gcm93ICsgMTsgaiA8IHJvdyArIHRoaXMuc2hpcFR5cGVzW2luY10uc2l6ZTsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG1wQ29vcmQgPSBbaiwgY29sXTtcbiAgICAgICAgICAgICAgICBhcnJPZkNvb3JkLnB1c2godG1wQ29vcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJPZkNvb3JkO1xuICAgIH1cblxuICAgIGluY2x1ZGVzQXJyYXkoZGF0YSwgYXJyKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnNvbWUoaXRlbSA9PiBBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0uZXZlcnkoKG8sIGkpID0+IE9iamVjdC5pcyhhcnJbaV0sIG8pKSk7XG4gICAgfTtcblxuICAgIHJlY2VpdmVBdHRhY2soY29vcmQpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gY29vcmRbMF07XG4gICAgICAgIGNvbnN0IGNvbCA9IGNvb3JkWzFdO1xuICAgICAgICBpZiAodGhpcy5ncmlkW3Jvd11bY29sXSA9PT0gJ1gnKXtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQXJyYXkodGhpcy5zaGlwc1tpXS5jb29yZGluYXRlcywgY29vcmQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcHNbaV0uaGl0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmdyaWRbcm93XVtjb2xdKSB7XG4gICAgICAgICAgICB0aGlzLm1pc3NlZC5wdXNoKGNvb3JkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoZWNrSWZBbGxTdW5rKCk7XG4gICAgfVxuXG4gICAgY2hlY2tJZkFsbFN1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnNoaXBzLmV2ZXJ5KGl0ZW0gPT4gaXRlbS5zdW5rU3RhdHVzID09PSB0cnVlKSkge1xuICAgICAgICAgICAgdGhpcy5hbGxTdW5rU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgZGlzcGxheSBmcm9tIFwiLi9kaXNwbGF5XCI7XG5cbmNvbnN0IHdpbm5lclBvcHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lci1wb3B1cCcpO1xuY29uc3Qgd2lubmVyVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5uZXItdGV4dCcpO1xuY29uc3QgcGxhY2VtZW50UG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMtcG9wdXAnKTtcblxuY29uc3QgZ2FtZWxvb3AgPSAoKCkgPT4ge1xuXG4gICAgbGV0IHBsYXllciA9IG5ldyBQbGF5ZXIoJ3BsYXllcicpO1xuICAgIGxldCBwbGF5ZXJHYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgZGlzcGxheS5jcmVhdGVQbGF5ZXJCb2FyZChwbGF5ZXJHYW1lYm9hcmQpO1xuICAgIFxuXG4gICAgbGV0IGFpID0gbmV3IFBsYXllcignYWknKTtcbiAgICBsZXQgYWlHYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgZGlzcGxheS5jcmVhdGVBaUJvYXJkKGFpR2FtZWJvYXJkLCBhaSk7XG5cbiAgICBsZXQgdHVybiA9ICdwbGF5ZXInO1xuICAgIGxldCB3aW5uZXIgPSAnJztcblxuICAgIGNvbnN0IGNoZWNrV2lubmVyID0gKHBsYXllckJvYXJkLCBhaUJvYXJkKSA9PiB7XG4gICAgICAgIGlmIChwbGF5ZXJCb2FyZC5hbGxTdW5rU3RhdHVzKSB7XG4gICAgICAgICAgICB3aW5uZXIgPSAnYWknO1xuICAgICAgICAgICAgd2lubmVyUG9wdXAuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICB3aW5uZXJUZXh0LnRleHRDb250ZW50ID0gJ1RoZSBjb21wdXRlciB3aW5zISc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFpQm9hcmQuYWxsU3Vua1N0YXR1cykge1xuICAgICAgICAgICAgd2lubmVyID0gJ3BsYXllcic7XG4gICAgICAgICAgICB3aW5uZXJQb3B1cC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIHdpbm5lclRleHQudGV4dENvbnRlbnQgPSAnQ29uZ3JhdHMsIHlvdSB3aW4hJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHBsYXkgPSAoZSkgPT4ge1xuICAgICAgICBpZiAod2lubmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHVybiA9PT0gJ3BsYXllcicpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gW051bWJlcihlLnRhcmdldC5pZFswXSksIE51bWJlcihlLnRhcmdldC5pZFsyXSldO1xuICAgICAgICAgICAgcGxheWVyLmF0dGFjayhjb29yZCwgYWlHYW1lYm9hcmQpO1xuICAgICAgICAgICAgZGlzcGxheS50YWtlQXR0YWNrKGNvb3JkLCBhaUdhbWVib2FyZCwgZS50YXJnZXQpO1xuICAgICAgICAgICAgdHVybiA9ICdhaSc7XG4gICAgICAgIH0gZWxzZSBpZiAodHVybiA9PT0gJ2FpJykge1xuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBhaS5yYW5kb21BdHRhY2socGxheWVyR2FtZWJvYXJkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllclNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLWJvYXJkID4gZGl2Jyk7XG4gICAgICAgICAgICBwbGF5ZXJTcXVhcmVzLmZvckVhY2goKHBsYXllclNxdWFyZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkQ29vcmQgPSBbTnVtYmVyKHBsYXllclNxdWFyZS5pZFswXSksIE51bWJlcihwbGF5ZXJTcXVhcmUuaWRbMl0pXTtcbiAgICAgICAgICAgICAgICBpZiAoaWRDb29yZFswXSA9PT0gY29vcmRbMF0gJiYgaWRDb29yZFsxXSA9PT0gY29vcmRbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheS50YWtlQXR0YWNrKGNvb3JkLCBwbGF5ZXJHYW1lYm9hcmQsIHBsYXllclNxdWFyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0dXJuID0gJ3BsYXllcic7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1dpbm5lcihwbGF5ZXJHYW1lYm9hcmQsIGFpR2FtZWJvYXJkKTtcbiAgICB9XG5cbiAgICBjb25zdCBwbGF5QWdhaW4gPSAoKSA9PiB7XG4gICAgICAgIGRpc3BsYXkucmVtb3ZlRGl2cygpO1xuXG4gICAgICAgIHBsYXllciA9IG5ldyBQbGF5ZXIoJ3BsYXllcicpO1xuICAgICAgICBwbGF5ZXJHYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgICAgIGRpc3BsYXkuY3JlYXRlUGxheWVyQm9hcmQocGxheWVyR2FtZWJvYXJkKTtcblxuICAgICAgICBhaSA9IG5ldyBQbGF5ZXIoJ2FpJyk7XG4gICAgICAgIGFpR2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgICAgICBkaXNwbGF5LmNyZWF0ZUFpQm9hcmQoYWlHYW1lYm9hcmQsIGFpKTtcblxuICAgICAgICB0dXJuID0gJ3BsYXllcic7XG4gICAgICAgIHdpbm5lciA9ICcnO1xuXG4gICAgICAgIHdpbm5lclBvcHVwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHBsYWNlbWVudFBvcHVwLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH1cblxuICAgIHJldHVybiB7IHBsYXksIHdpbm5lciwgcGxheUFnYWluIH1cblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZWxvb3AiLCJjbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5oaXRzID0gW107XG4gICAgfVxuXG4gICAgYXR0YWNrKGNvb3JkLCBnYW1lYm9hcmQpIHtcbiAgICAgICAgaWYgKGdhbWVib2FyZC5pbmNsdWRlc0FycmF5KHRoaXMuaGl0cywgY29vcmQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmQpO1xuICAgICAgICB0aGlzLmhpdHMucHVzaChjb29yZCk7XG4gICAgfVxuXG4gICAgcmFuZG9tQ29vcmQoKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgY29uc3QgY29sID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICByZXR1cm4gW3JvdywgY29sXTtcbiAgICB9XG5cbiAgICByYW5kb21BdHRhY2soZ2FtZWJvYXJkKSB7XG4gICAgICAgIGxldCByYW5kb21Db29yZCA9IHRoaXMucmFuZG9tQ29vcmQoKTtcbiAgICAgICAgd2hpbGUgKGdhbWVib2FyZC5pbmNsdWRlc0FycmF5KHRoaXMuaGl0cywgcmFuZG9tQ29vcmQpKSB7XG4gICAgICAgICAgICByYW5kb21Db29yZCA9IHRoaXMucmFuZG9tQ29vcmQoKTtcbiAgICAgICAgfVxuICAgICAgICBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhyYW5kb21Db29yZCk7XG4gICAgICAgIHRoaXMuaGl0cy5wdXNoKHJhbmRvbUNvb3JkKTtcbiAgICAgICAgcmV0dXJuIHJhbmRvbUNvb3JkO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyIiwiY2xhc3MgU2hpcCB7XG4gICAgY29uc3RydWN0b3Ioc2l6ZSkge1xuICAgICAgICB0aGlzLnNoaXBTaXplID0gc2l6ZTtcbiAgICAgICAgdGhpcy5oaXRDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3Vua1N0YXR1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzID0gW107XG4gICAgfVxuXG4gICAgaGl0KCkge1xuICAgICAgICB0aGlzLmhpdENvdW50ICs9IDE7XG4gICAgICAgIHRoaXMuaXNTdW5rKCk7XG4gICAgfVxuXG4gICAgaXNTdW5rKCkge1xuICAgICAgICBpZiAodGhpcy5zaGlwU2l6ZSA9PT0gdGhpcy5oaXRDb3VudCkge1xuICAgICAgICAgICAgdGhpcy5zdW5rU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcCIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWVsb29wIGZyb20gXCIuL2dhbWVsb29wXCI7XG5cbmxldCBhaVNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWktYm9hcmQgPiBkaXYnKTtcbmNvbnN0IHBsYXlBZ2FpbkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5LWFnYWluLWJ0bicpO1xuXG5wbGF5QWdhaW5CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZ2FtZWxvb3AucGxheUFnYWluKCk7XG4gICAgYWlTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFpLWJvYXJkID4gZGl2Jyk7XG4gICAgYWlTcXVhcmVzLmZvckVhY2goKGFpU3F1YXJlKSA9PiB7XG4gICAgICAgIGFpU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGdhbWVsb29wLnBsYXkoZSk7XG4gICAgICAgICAgICBnYW1lbG9vcC5wbGF5KGUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG5haVNxdWFyZXMuZm9yRWFjaCgoYWlTcXVhcmUpID0+IHtcbiAgICBhaVNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGdhbWVsb29wLnBsYXkoZSk7XG4gICAgICAgIGdhbWVsb29wLnBsYXkoZSk7XG4gICAgfSk7XG59KTtcblxuLy8gbWFrZSBVSSBwcmV0dGllclxuXG4vLyBpbXBsZW1lbnQgbW9iaWxlIHZpZXdcblxuLy8gY2xlYW4gdXAgY29kZSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==