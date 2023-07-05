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
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUE7QUFDQSxJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsWUFBWSxpREFBUTtBQUNwQixZQUFZLGlEQUFRO0FBQ3BCLFNBQVM7QUFDVCxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsUUFBUSxpREFBUTtBQUNoQixRQUFRLGlEQUFRO0FBQ2hCLEtBQUs7QUFDTCxDQUFDLEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Rpc3BsYXkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1ib2FyZCcpO1xuY29uc3QgYWlDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWktYm9hcmQnKTtcbmNvbnN0IHBsYWNlbWVudENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZW1lbnQtYm9hcmQnKTtcbmNvbnN0IHNoaXBUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtdGV4dCcpO1xuY29uc3QgcGxhY2VtZW50UG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMtcG9wdXAnKTtcbmNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb3RhdGUtYnRuJyk7XG5cbmNvbnN0IGRpc3BsYXkgPSAoKCkgPT4ge1xuXG4gICAgY29uc3QgY3JlYXRlR2FtZWJvYXJkID0gKHBhcmVudCwgc3VmZml4KSA9PiB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgZm9yKGxldCBrID0gMDsgayA8IDEwIDsgaysrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgICAgICAgICAgICAgc3F1YXJlLnNldEF0dHJpYnV0ZSgnaWQnLGAke2p9LCR7a30ke3N1ZmZpeH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNob3dQbGF5ZXJTaGlwcyA9IChib2FyZCkgPT4ge1xuICAgICAgICBjb25zdCBwbGF5ZXJTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYXllci1ib2FyZCA+IGRpdicpO1xuICAgICAgICBjb25zdCBwbGFjZW1lbnRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYWNlbWVudC1ib2FyZCA+IGRpdicpO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgZm9yKGxldCBrID0gMDsgayA8IDEwIDsgaysrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvYXJkLmdyaWRbal1ba10gPT09ICdYJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJTcXVhcmVzW2ldLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1zaGlwJyk7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFNxdWFyZXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50U3F1YXJlc1tpXS5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItc2hpcCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjaGVja1ZhbGlkaXR5ID0gKGJvYXJkLCBhcnJPZkNvb3JkKSA9PiB7XG4gICAgICAgIGxldCB2YWxpZGl0eSA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyT2ZDb29yZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFyck9mQ29vcmRbaV1bMF0gPiA5IHx8IGFyck9mQ29vcmRbaV1bMV0gPiA5KSB7XG4gICAgICAgICAgICAgICAgdmFsaWRpdHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYm9hcmQuZ3JpZFthcnJPZkNvb3JkW2ldWzBdXVthcnJPZkNvb3JkW2ldWzFdXSA9PT0gJ1gnKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRpdHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsaWRpdHk7XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlUGxheWVyQm9hcmQgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgY3JlYXRlR2FtZWJvYXJkKHBsYXllckNvbnRhaW5lciwgJycpO1xuICAgICAgICBjcmVhdGVHYW1lYm9hcmQocGxhY2VtZW50Q29udGFpbmVyLCAncCcpO1xuXG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgc2hpcFRleHQudGV4dENvbnRlbnQgPSBgUGxhY2UgeW91ciAke2JvYXJkLnNoaXBUeXBlc1tpXS5uYW1lfWA7XG4gICAgICAgIGNvbnN0IHBsYWNlbWVudFNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxhY2VtZW50LWJvYXJkID4gZGl2Jyk7XG4gICAgICAgIGxldCBzaGlwT3JpZW50YXRpb24gPSAnaG9yaXpvbnRhbCc7XG4gICAgXG4gICAgICAgIHJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgICAgIHNoaXBPcmllbnRhdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoaXBPcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgICAgIHNoaXBPcmllbnRhdGlvbiA9ICdob3Jpem9udGFsJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGxhY2VtZW50U3F1YXJlcy5mb3JFYWNoKChwbGFjZW1lbnRTcXVhcmUpID0+IHtcbiAgICAgICAgICAgIHBsYWNlbWVudFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29vcmQgPSBbTnVtYmVyKGUudGFyZ2V0LmlkWzBdKSwgTnVtYmVyKGUudGFyZ2V0LmlkWzJdKV07XG4gICAgICAgICAgICAgICAgY29uc3QgYXJyT2ZDb29yZCA9IGJvYXJkLmNhbGN1bGF0ZUNvb3Jkcyhjb29yZCwgc2hpcE9yaWVudGF0aW9uLCBpKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tWYWxpZGl0eShib2FyZCwgYXJyT2ZDb29yZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYm9hcmQucGxhY2VTaGlwKGJvYXJkLnNoaXBUeXBlc1tpXS5zaXplLCBhcnJPZkNvb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgc2hvd1BsYXllclNoaXBzKGJvYXJkKTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWJvYXJkLnNoaXBUeXBlc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50UG9wdXAuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzaGlwVGV4dC50ZXh0Q29udGVudCA9IGBQbGFjZSB5b3VyICR7Ym9hcmQuc2hpcFR5cGVzW2ldLm5hbWV9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcGxhY2VtZW50U3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29vcmQgPSBbTnVtYmVyKGUudGFyZ2V0LmlkWzBdKSwgTnVtYmVyKGUudGFyZ2V0LmlkWzJdKV07XG4gICAgICAgICAgICAgICAgY29uc3QgYXJyT2ZDb29yZCA9IGJvYXJkLmNhbGN1bGF0ZUNvb3Jkcyhjb29yZCwgc2hpcE9yaWVudGF0aW9uLCBpKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tWYWxpZGl0eShib2FyZCwgYXJyT2ZDb29yZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhcnJPZkNvb3JkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0bXBDb29yZCA9IGFyck9mQ29vcmRbal07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHt0bXBDb29yZH1wYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnaG92ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwbGFjZW1lbnRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWJvYXJkLnNoaXBUeXBlc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGRpdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaG92ZXInKTtcbiAgICAgICAgICAgICAgICBkaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCByYW5kb21BSU9yaWVudGF0aW9uID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB0bXAgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgICAgaWYgKHRtcCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVBaUJvYXJkID0gKGJvYXJkLCBwbGF5ZXIpID0+IHtcbiAgICAgICAgY3JlYXRlR2FtZWJvYXJkKGFpQ29udGFpbmVyLCAnJyk7XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBib2FyZC5zaGlwVHlwZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGxldCByYW5kb21Db29yZCA9IHBsYXllci5yYW5kb21Db29yZCgpO1xuICAgICAgICAgICAgbGV0IGFpT3JpZW50YXRpb24gPSByYW5kb21BSU9yaWVudGF0aW9uKCk7XG4gICAgICAgICAgICBsZXQgYXJyT2ZDb29yZCA9IGJvYXJkLmNhbGN1bGF0ZUNvb3JkcyhyYW5kb21Db29yZCwgYWlPcmllbnRhdGlvbiwgaik7XG5cbiAgICAgICAgICAgIHdoaWxlICghY2hlY2tWYWxpZGl0eShib2FyZCwgYXJyT2ZDb29yZCkpIHtcbiAgICAgICAgICAgICAgICByYW5kb21Db29yZCA9IHBsYXllci5yYW5kb21Db29yZCgpO1xuICAgICAgICAgICAgICAgIGFpT3JpZW50YXRpb24gPSByYW5kb21BSU9yaWVudGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgYXJyT2ZDb29yZCA9IGJvYXJkLmNhbGN1bGF0ZUNvb3JkcyhyYW5kb21Db29yZCwgYWlPcmllbnRhdGlvbiwgaik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJvYXJkLnBsYWNlU2hpcChib2FyZC5zaGlwVHlwZXNbal0uc2l6ZSwgYXJyT2ZDb29yZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0YWtlQXR0YWNrID0gKGNvb3JkLCBib2FyZCwgZGl2KSA9PiB7XG4gICAgICAgIGlmIChib2FyZC5pbmNsdWRlc0FycmF5KGJvYXJkLm1pc3NlZCwgY29vcmQpKSB7XG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVtb3ZlRGl2cyA9ICgpID0+IHtcbiAgICAgICAgd2hpbGUgKHBsYXllckNvbnRhaW5lci5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBwbGF5ZXJDb250YWluZXIucmVtb3ZlQ2hpbGQocGxheWVyQ29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChhaUNvbnRhaW5lci5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBhaUNvbnRhaW5lci5yZW1vdmVDaGlsZChhaUNvbnRhaW5lci5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAocGxhY2VtZW50Q29udGFpbmVyLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHBsYWNlbWVudENvbnRhaW5lci5yZW1vdmVDaGlsZChwbGFjZW1lbnRDb250YWluZXIuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyBjcmVhdGVQbGF5ZXJCb2FyZCwgY3JlYXRlQWlCb2FyZCwgdGFrZUF0dGFjaywgc2hvd1BsYXllclNoaXBzLCByZW1vdmVEaXZzIH1cblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheSIsImltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ncmlkID0gdGhpcy5jcmVhdGVHcmlkKCk7XG4gICAgICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgICAgICAgdGhpcy5taXNzZWQgPSBbXTtcbiAgICAgICAgdGhpcy5hbGxTdW5rU3RhdHVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2hpcFR5cGVzID0gW1xuICAgICAgICAgICAgeyBuYW1lOiAnQ2FycmllcicsIHNpemU6IDUgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0JhdHRsZXNoaXAnLCBzaXplOiA0IH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdDcnVpc2VyJywgc2l6ZTogMyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnU3VibWFyaW5lJywgc2l6ZTogMyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnRGVzdHJveWVyJywgc2l6ZTogMiB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgY3JlYXRlR3JpZCgpIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IG5ldyBBcnJheSgxMCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZ3JpZFtpXSA9IG5ldyBBcnJheSgxMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyaWQ7XG4gICAgfVxuXG4gICAgcGxhY2VTaGlwKHNpemUsIGFyck9mQ29vcmQpIHtcbiAgICAgICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKHNpemUpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyck9mQ29vcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gYXJyT2ZDb29yZFtpXTtcbiAgICAgICAgICAgIHNoaXAuY29vcmRpbmF0ZXMucHVzaChjb29yZCk7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBjb29yZFswXTtcbiAgICAgICAgICAgIGNvbnN0IGNvbCA9IGNvb3JkWzFdO1xuICAgICAgICAgICAgdGhpcy5ncmlkW3Jvd11bY29sXSA9ICdYJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNoaXBzLnB1c2goc2hpcCk7XG4gICAgICAgIHJldHVybiBzaGlwO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUNvb3Jkcyhjb29yZCwgb3JpZW50YXRpb24sIGluYykge1xuICAgICAgICBjb25zdCBhcnJPZkNvb3JkID0gW107XG4gICAgICAgIGNvbnN0IHJvdyA9IGNvb3JkWzBdO1xuICAgICAgICBjb25zdCBjb2wgPSBjb29yZFsxXTtcbiAgICAgICAgYXJyT2ZDb29yZC5wdXNoKGNvb3JkKTtcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBjb2wgKyAxOyBqIDwgY29sICsgdGhpcy5zaGlwVHlwZXNbaW5jXS5zaXplOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0bXBDb29yZCA9IFtyb3csIGpdO1xuICAgICAgICAgICAgICAgIGFyck9mQ29vcmQucHVzaCh0bXBDb29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSByb3cgKyAxOyBqIDwgcm93ICsgdGhpcy5zaGlwVHlwZXNbaW5jXS5zaXplOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0bXBDb29yZCA9IFtqLCBjb2xdO1xuICAgICAgICAgICAgICAgIGFyck9mQ29vcmQucHVzaCh0bXBDb29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFyck9mQ29vcmQ7XG4gICAgfVxuXG4gICAgaW5jbHVkZXNBcnJheShkYXRhLCBhcnIpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuc29tZShpdGVtID0+IEFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbS5ldmVyeSgobywgaSkgPT4gT2JqZWN0LmlzKGFycltpXSwgbykpKTtcbiAgICB9O1xuXG4gICAgcmVjZWl2ZUF0dGFjayhjb29yZCkge1xuICAgICAgICBjb25zdCByb3cgPSBjb29yZFswXTtcbiAgICAgICAgY29uc3QgY29sID0gY29vcmRbMV07XG4gICAgICAgIGlmICh0aGlzLmdyaWRbcm93XVtjb2xdID09PSAnWCcpe1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNBcnJheSh0aGlzLnNoaXBzW2ldLmNvb3JkaW5hdGVzLCBjb29yZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwc1tpXS5oaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZ3JpZFtyb3ddW2NvbF0pIHtcbiAgICAgICAgICAgIHRoaXMubWlzc2VkLnB1c2goY29vcmQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlY2tJZkFsbFN1bmsoKTtcbiAgICB9XG5cbiAgICBjaGVja0lmQWxsU3VuaygpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHMuZXZlcnkoaXRlbSA9PiBpdGVtLnN1bmtTdGF0dXMgPT09IHRydWUpKSB7XG4gICAgICAgICAgICB0aGlzLmFsbFN1bmtTdGF0dXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQiLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCBkaXNwbGF5IGZyb20gXCIuL2Rpc3BsYXlcIjtcblxuY29uc3Qgd2lubmVyUG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2lubmVyLXBvcHVwJyk7XG5jb25zdCB3aW5uZXJUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lci10ZXh0Jyk7XG5jb25zdCBwbGFjZW1lbnRQb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcy1wb3B1cCcpO1xuXG5jb25zdCBnYW1lbG9vcCA9ICgoKSA9PiB7XG5cbiAgICBsZXQgcGxheWVyID0gbmV3IFBsYXllcigncGxheWVyJyk7XG4gICAgbGV0IHBsYXllckdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICBkaXNwbGF5LmNyZWF0ZVBsYXllckJvYXJkKHBsYXllckdhbWVib2FyZCk7XG4gICAgXG5cbiAgICBsZXQgYWkgPSBuZXcgUGxheWVyKCdhaScpO1xuICAgIGxldCBhaUdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICBkaXNwbGF5LmNyZWF0ZUFpQm9hcmQoYWlHYW1lYm9hcmQsIGFpKTtcblxuICAgIGxldCB0dXJuID0gJ3BsYXllcic7XG4gICAgbGV0IHdpbm5lciA9ICcnO1xuXG4gICAgY29uc3QgY2hlY2tXaW5uZXIgPSAocGxheWVyQm9hcmQsIGFpQm9hcmQpID0+IHtcbiAgICAgICAgaWYgKHBsYXllckJvYXJkLmFsbFN1bmtTdGF0dXMpIHtcbiAgICAgICAgICAgIHdpbm5lciA9ICdhaSc7XG4gICAgICAgICAgICB3aW5uZXJQb3B1cC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIHdpbm5lclRleHQudGV4dENvbnRlbnQgPSAnVGhlIGNvbXB1dGVyIHdpbnMhJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWlCb2FyZC5hbGxTdW5rU3RhdHVzKSB7XG4gICAgICAgICAgICB3aW5uZXIgPSAncGxheWVyJztcbiAgICAgICAgICAgIHdpbm5lclBvcHVwLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgd2lubmVyVGV4dC50ZXh0Q29udGVudCA9ICdDb25ncmF0cywgeW91IHdpbiEnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGxheSA9IChlKSA9PiB7XG4gICAgICAgIGlmICh3aW5uZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0dXJuID09PSAncGxheWVyJykge1xuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBbTnVtYmVyKGUudGFyZ2V0LmlkWzBdKSwgTnVtYmVyKGUudGFyZ2V0LmlkWzJdKV07XG4gICAgICAgICAgICBwbGF5ZXIuYXR0YWNrKGNvb3JkLCBhaUdhbWVib2FyZCk7XG4gICAgICAgICAgICBkaXNwbGF5LnRha2VBdHRhY2soY29vcmQsIGFpR2FtZWJvYXJkLCBlLnRhcmdldCk7XG4gICAgICAgICAgICB0dXJuID0gJ2FpJztcbiAgICAgICAgfSBlbHNlIGlmICh0dXJuID09PSAnYWknKSB7XG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IGFpLnJhbmRvbUF0dGFjayhwbGF5ZXJHYW1lYm9hcmQpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wbGF5ZXItYm9hcmQgPiBkaXYnKTtcbiAgICAgICAgICAgIHBsYXllclNxdWFyZXMuZm9yRWFjaCgocGxheWVyU3F1YXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWRDb29yZCA9IFtOdW1iZXIocGxheWVyU3F1YXJlLmlkWzBdKSwgTnVtYmVyKHBsYXllclNxdWFyZS5pZFsyXSldO1xuICAgICAgICAgICAgICAgIGlmIChpZENvb3JkWzBdID09PSBjb29yZFswXSAmJiBpZENvb3JkWzFdID09PSBjb29yZFsxXSkge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5LnRha2VBdHRhY2soY29vcmQsIHBsYXllckdhbWVib2FyZCwgcGxheWVyU3F1YXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHR1cm4gPSAncGxheWVyJztcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrV2lubmVyKHBsYXllckdhbWVib2FyZCwgYWlHYW1lYm9hcmQpO1xuICAgIH1cblxuICAgIGNvbnN0IHBsYXlBZ2FpbiA9ICgpID0+IHtcbiAgICAgICAgZGlzcGxheS5yZW1vdmVEaXZzKCk7XG5cbiAgICAgICAgcGxheWVyID0gbmV3IFBsYXllcigncGxheWVyJyk7XG4gICAgICAgIHBsYXllckdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICAgICAgZGlzcGxheS5jcmVhdGVQbGF5ZXJCb2FyZChwbGF5ZXJHYW1lYm9hcmQpO1xuXG4gICAgICAgIGFpID0gbmV3IFBsYXllcignYWknKTtcbiAgICAgICAgYWlHYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgICAgIGRpc3BsYXkuY3JlYXRlQWlCb2FyZChhaUdhbWVib2FyZCwgYWkpO1xuXG4gICAgICAgIHR1cm4gPSAncGxheWVyJztcbiAgICAgICAgd2lubmVyID0gJyc7XG5cbiAgICAgICAgd2lubmVyUG9wdXAuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgcGxhY2VtZW50UG9wdXAuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcGxheSwgd2lubmVyLCBwbGF5QWdhaW4gfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lbG9vcCIsImNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmhpdHMgPSBbXTtcbiAgICB9XG5cbiAgICBhdHRhY2soY29vcmQsIGdhbWVib2FyZCkge1xuICAgICAgICBpZiAoZ2FtZWJvYXJkLmluY2x1ZGVzQXJyYXkodGhpcy5oaXRzLCBjb29yZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZCk7XG4gICAgICAgIHRoaXMuaGl0cy5wdXNoKGNvb3JkKTtcbiAgICB9XG5cbiAgICByYW5kb21Db29yZCgpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICBjb25zdCBjb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgIHJldHVybiBbcm93LCBjb2xdO1xuICAgIH1cblxuICAgIHJhbmRvbUF0dGFjayhnYW1lYm9hcmQpIHtcbiAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gdGhpcy5yYW5kb21Db29yZCgpO1xuICAgICAgICB3aGlsZSAoZ2FtZWJvYXJkLmluY2x1ZGVzQXJyYXkodGhpcy5oaXRzLCByYW5kb21Db29yZCkpIHtcbiAgICAgICAgICAgIHJhbmRvbUNvb3JkID0gdGhpcy5yYW5kb21Db29yZCgpO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHJhbmRvbUNvb3JkKTtcbiAgICAgICAgdGhpcy5oaXRzLnB1c2gocmFuZG9tQ29vcmQpO1xuICAgICAgICByZXR1cm4gcmFuZG9tQ29vcmQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXIiLCJjbGFzcyBTaGlwIHtcbiAgICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgICAgIHRoaXMuc2hpcFNpemUgPSBzaXplO1xuICAgICAgICB0aGlzLmhpdENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5zdW5rU3RhdHVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbXTtcbiAgICB9XG5cbiAgICBoaXQoKSB7XG4gICAgICAgIHRoaXMuaGl0Q291bnQgKz0gMTtcbiAgICAgICAgdGhpcy5pc1N1bmsoKTtcbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnNoaXBTaXplID09PSB0aGlzLmhpdENvdW50KSB7XG4gICAgICAgICAgICB0aGlzLnN1bmtTdGF0dXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZ2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxubGV0IGFpU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5haS1ib2FyZCA+IGRpdicpO1xuY29uc3QgcGxheUFnYWluQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXktYWdhaW4tYnRuJyk7XG5cbnBsYXlBZ2FpbkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBnYW1lbG9vcC5wbGF5QWdhaW4oKTtcbiAgICBhaVNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWktYm9hcmQgPiBkaXYnKTtcbiAgICBhaVNxdWFyZXMuZm9yRWFjaCgoYWlTcXVhcmUpID0+IHtcbiAgICAgICAgYWlTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgZ2FtZWxvb3AucGxheShlKTtcbiAgICAgICAgICAgIGdhbWVsb29wLnBsYXkoZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG5cbmFpU3F1YXJlcy5mb3JFYWNoKChhaVNxdWFyZSkgPT4ge1xuICAgIGFpU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZ2FtZWxvb3AucGxheShlKTtcbiAgICAgICAgZ2FtZWxvb3AucGxheShlKTtcbiAgICB9KTtcbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==