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

    return { createPlayerBoard, createAiBoard, takeAttack, showPlayerShips }

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


const shipText = document.querySelector('.ship-text');

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

    calculateCoords(coord, orientation, i) {
        const arrOfCoord = [];
        const row = coord[0];
        const col = coord[1];
        arrOfCoord.push(coord);
        if (orientation === 'horizontal') {
            for (let j = col + 1; j < col + this.shipTypes[i].size; j++) {
                const tmpCoord = [row, j];
                arrOfCoord.push(tmpCoord);
            }
        } else if (orientation === 'vertical') {
            for (let j = row + 1; j < row + this.shipTypes[i].size; j++) {
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

const gameloop = (() => {

    const player = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]('player');
    const playerGameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
    // playerGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    // playerGameboard.placeShip(4, [[1,5],[1,6],[1,7],[1,8]]);
    // playerGameboard.placeShip(3, [[5,7],[6,7],[7,7]]);
    // playerGameboard.placeShip(3, [[9,5],[9,6],[9,7]]);
    // playerGameboard.placeShip(2, [[0,0],[0,1]]);
    _display__WEBPACK_IMPORTED_MODULE_2__["default"].createPlayerBoard(playerGameboard);
    

    const ai = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]('ai');
    const aiGameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
    aiGameboard.placeShip(5, [[5,0],[6,0],[7,0],[8,0],[9,0]]);
    aiGameboard.placeShip(4, [[3,4],[4,4],[5,4],[6,4]]);
    aiGameboard.placeShip(3, [[4,5],[5,5],[6,5]]);
    aiGameboard.placeShip(3, [[0,5],[0,6],[0,7]]);
    aiGameboard.placeShip(2, [[5,8],[5,9]]);
    _display__WEBPACK_IMPORTED_MODULE_2__["default"].createAiBoard();


    // functions to add ships

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

    return { play, winner }

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


const aiSquares = document.querySelectorAll('.ai-board > div');

aiSquares.forEach((aiSquare) => {
    aiSquare.addEventListener('click', (e) => {
        _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"].play(e);
        _gameloop__WEBPACK_IMPORTED_MODULE_0__["default"].play(e);
    });
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QW9CLGdEQUFPO0FBQzNCO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxhQUFhOztBQUViLENBQUM7O0FBRUQsaUVBQWU7Ozs7Ozs7Ozs7Ozs7O0FDNUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZTs7Ozs7Ozs7Ozs7Ozs7QUMvQmY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlOzs7Ozs7VUNwQmY7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05rQzs7QUFFbEM7O0FBRUE7QUFDQTtBQUNBLFFBQVEsaURBQVE7QUFDaEIsUUFBUSxpREFBUTtBQUNoQixLQUFLO0FBQ0wsQ0FBQyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kaXNwbGF5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItYm9hcmQnKTtcbmNvbnN0IGFpQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFpLWJvYXJkJyk7XG5jb25zdCBwbGFjZW1lbnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2VtZW50LWJvYXJkJyk7XG5jb25zdCBzaGlwVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXRleHQnKTtcbmNvbnN0IHBsYWNlbWVudFBvcHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzLXBvcHVwJyk7XG5jb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucm90YXRlLWJ0bicpO1xuXG5jb25zdCBkaXNwbGF5ID0gKCgpID0+IHtcblxuICAgIGNvbnN0IGNyZWF0ZUdhbWVib2FyZCA9IChwYXJlbnQsIHN1ZmZpeCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGZvcihsZXQgayA9IDA7IGsgPCAxMCA7IGsrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgICAgICAgICAgICAgIHNxdWFyZS5zZXRBdHRyaWJ1dGUoJ2lkJyxgJHtqfSwke2t9JHtzdWZmaXh9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzaG93UGxheWVyU2hpcHMgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgY29uc3QgcGxheWVyU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wbGF5ZXItYm9hcmQgPiBkaXYnKTtcbiAgICAgICAgY29uc3QgcGxhY2VtZW50U3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wbGFjZW1lbnQtYm9hcmQgPiBkaXYnKTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGZvcihsZXQgayA9IDA7IGsgPCAxMCA7IGsrKykge1xuICAgICAgICAgICAgICAgIGlmIChib2FyZC5ncmlkW2pdW2tdID09PSAnWCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyU3F1YXJlc1tpXS5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItc2hpcCcpO1xuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRTcXVhcmVzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFNxdWFyZXNbaV0uY2xhc3NMaXN0LmFkZCgncGxheWVyLXNoaXAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY2hlY2tWYWxpZGl0eSA9IChib2FyZCwgYXJyT2ZDb29yZCkgPT4ge1xuICAgICAgICBsZXQgdmFsaWRpdHkgPSB0cnVlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyck9mQ29vcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhcnJPZkNvb3JkW2ldWzBdID4gOSB8fCBhcnJPZkNvb3JkW2ldWzFdID4gOSkge1xuICAgICAgICAgICAgICAgIHZhbGlkaXR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJvYXJkLmdyaWRbYXJyT2ZDb29yZFtpXVswXV1bYXJyT2ZDb29yZFtpXVsxXV0gPT09ICdYJykge1xuICAgICAgICAgICAgICAgIHZhbGlkaXR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbGlkaXR5O1xuICAgIH1cblxuICAgIGxldCBzaGlwT3JpZW50YXRpb24gPSAnaG9yaXpvbnRhbCc7XG4gICAgXG4gICAgcm90YXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAoc2hpcE9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIHNoaXBPcmllbnRhdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2hpcE9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICBzaGlwT3JpZW50YXRpb24gPSAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGNyZWF0ZVBsYXllckJvYXJkID0gKGJvYXJkKSA9PiB7XG4gICAgICAgIGNyZWF0ZUdhbWVib2FyZChwbGF5ZXJDb250YWluZXIsICcnKTtcbiAgICAgICAgY3JlYXRlR2FtZWJvYXJkKHBsYWNlbWVudENvbnRhaW5lciwgJ3AnKTtcblxuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHNoaXBUZXh0LnRleHRDb250ZW50ID0gYFBsYWNlIHlvdXIgJHtib2FyZC5zaGlwVHlwZXNbaV0ubmFtZX1gO1xuICAgICAgICBjb25zdCBwbGFjZW1lbnRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYWNlbWVudC1ib2FyZCA+IGRpdicpO1xuXG4gICAgICAgIHBsYWNlbWVudFNxdWFyZXMuZm9yRWFjaCgocGxhY2VtZW50U3F1YXJlKSA9PiB7XG4gICAgICAgICAgICBwbGFjZW1lbnRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gW051bWJlcihlLnRhcmdldC5pZFswXSksIE51bWJlcihlLnRhcmdldC5pZFsyXSldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFyck9mQ29vcmQgPSBib2FyZC5jYWxjdWxhdGVDb29yZHMoY29vcmQsIHNoaXBPcmllbnRhdGlvbiwgaSk7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrVmFsaWRpdHkoYm9hcmQsIGFyck9mQ29vcmQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkLnBsYWNlU2hpcChib2FyZC5zaGlwVHlwZXNbaV0uc2l6ZSwgYXJyT2ZDb29yZCk7XG4gICAgICAgICAgICAgICAgICAgIHNob3dQbGF5ZXJTaGlwcyhib2FyZCk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFib2FyZC5zaGlwVHlwZXNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFBvcHVwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2hpcFRleHQudGV4dENvbnRlbnQgPSBgUGxhY2UgeW91ciAke2JvYXJkLnNoaXBUeXBlc1tpXS5uYW1lfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBsYWNlbWVudFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gW051bWJlcihlLnRhcmdldC5pZFswXSksIE51bWJlcihlLnRhcmdldC5pZFsyXSldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFyck9mQ29vcmQgPSBib2FyZC5jYWxjdWxhdGVDb29yZHMoY29vcmQsIHNoaXBPcmllbnRhdGlvbiwgaSk7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrVmFsaWRpdHkoYm9hcmQsIGFyck9mQ29vcmQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYXJyT2ZDb29yZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG1wQ29vcmQgPSBhcnJPZkNvb3JkW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7dG1wQ29vcmR9cGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGxhY2VtZW50U3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFib2FyZC5zaGlwVHlwZXNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBkaXZzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhvdmVyJyk7XG4gICAgICAgICAgICAgICAgZGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlQWlCb2FyZCA9ICgpID0+IHtcbiAgICAgICAgY3JlYXRlR2FtZWJvYXJkKGFpQ29udGFpbmVyLCAnJyk7XG4gICAgfVxuXG4gICAgY29uc3QgdGFrZUF0dGFjayA9IChjb29yZCwgYm9hcmQsIGRpdikgPT4ge1xuICAgICAgICBpZiAoYm9hcmQuaW5jbHVkZXNBcnJheShib2FyZC5taXNzZWQsIGNvb3JkKSkge1xuICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IGNyZWF0ZVBsYXllckJvYXJkLCBjcmVhdGVBaUJvYXJkLCB0YWtlQXR0YWNrLCBzaG93UGxheWVyU2hpcHMgfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5IiwiaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5jb25zdCBzaGlwVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXRleHQnKTtcblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ncmlkID0gdGhpcy5jcmVhdGVHcmlkKCk7XG4gICAgICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgICAgICAgdGhpcy5taXNzZWQgPSBbXTtcbiAgICAgICAgdGhpcy5hbGxTdW5rU3RhdHVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2hpcFR5cGVzID0gW1xuICAgICAgICAgICAgeyBuYW1lOiAnQ2FycmllcicsIHNpemU6IDUgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0JhdHRsZXNoaXAnLCBzaXplOiA0IH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdDcnVpc2VyJywgc2l6ZTogMyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnU3VibWFyaW5lJywgc2l6ZTogMyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnRGVzdHJveWVyJywgc2l6ZTogMiB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgY3JlYXRlR3JpZCgpIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IG5ldyBBcnJheSgxMCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZ3JpZFtpXSA9IG5ldyBBcnJheSgxMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyaWQ7XG4gICAgfVxuXG4gICAgcGxhY2VTaGlwKHNpemUsIGFyck9mQ29vcmQpIHtcbiAgICAgICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKHNpemUpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyck9mQ29vcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gYXJyT2ZDb29yZFtpXTtcbiAgICAgICAgICAgIHNoaXAuY29vcmRpbmF0ZXMucHVzaChjb29yZCk7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBjb29yZFswXTtcbiAgICAgICAgICAgIGNvbnN0IGNvbCA9IGNvb3JkWzFdO1xuICAgICAgICAgICAgdGhpcy5ncmlkW3Jvd11bY29sXSA9ICdYJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNoaXBzLnB1c2goc2hpcCk7XG4gICAgICAgIHJldHVybiBzaGlwO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUNvb3Jkcyhjb29yZCwgb3JpZW50YXRpb24sIGkpIHtcbiAgICAgICAgY29uc3QgYXJyT2ZDb29yZCA9IFtdO1xuICAgICAgICBjb25zdCByb3cgPSBjb29yZFswXTtcbiAgICAgICAgY29uc3QgY29sID0gY29vcmRbMV07XG4gICAgICAgIGFyck9mQ29vcmQucHVzaChjb29yZCk7XG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gY29sICsgMTsgaiA8IGNvbCArIHRoaXMuc2hpcFR5cGVzW2ldLnNpemU7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRtcENvb3JkID0gW3Jvdywgal07XG4gICAgICAgICAgICAgICAgYXJyT2ZDb29yZC5wdXNoKHRtcENvb3JkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IHJvdyArIDE7IGogPCByb3cgKyB0aGlzLnNoaXBUeXBlc1tpXS5zaXplOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0bXBDb29yZCA9IFtqLCBjb2xdO1xuICAgICAgICAgICAgICAgIGFyck9mQ29vcmQucHVzaCh0bXBDb29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFyck9mQ29vcmQ7XG4gICAgfVxuXG4gICAgaW5jbHVkZXNBcnJheShkYXRhLCBhcnIpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuc29tZShpdGVtID0+IEFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbS5ldmVyeSgobywgaSkgPT4gT2JqZWN0LmlzKGFycltpXSwgbykpKTtcbiAgICB9O1xuXG4gICAgcmVjZWl2ZUF0dGFjayhjb29yZCkge1xuICAgICAgICBjb25zdCByb3cgPSBjb29yZFswXTtcbiAgICAgICAgY29uc3QgY29sID0gY29vcmRbMV07XG4gICAgICAgIGlmICh0aGlzLmdyaWRbcm93XVtjb2xdID09PSAnWCcpe1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNBcnJheSh0aGlzLnNoaXBzW2ldLmNvb3JkaW5hdGVzLCBjb29yZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwc1tpXS5oaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZ3JpZFtyb3ddW2NvbF0pIHtcbiAgICAgICAgICAgIHRoaXMubWlzc2VkLnB1c2goY29vcmQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlY2tJZkFsbFN1bmsoKTtcbiAgICB9XG5cbiAgICBjaGVja0lmQWxsU3VuaygpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHMuZXZlcnkoaXRlbSA9PiBpdGVtLnN1bmtTdGF0dXMgPT09IHRydWUpKSB7XG4gICAgICAgICAgICB0aGlzLmFsbFN1bmtTdGF0dXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQiLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCBkaXNwbGF5IGZyb20gXCIuL2Rpc3BsYXlcIjtcblxuY29uc3Qgd2lubmVyUG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2lubmVyLXBvcHVwJyk7XG5jb25zdCB3aW5uZXJUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lci10ZXh0Jyk7XG5cbmNvbnN0IGdhbWVsb29wID0gKCgpID0+IHtcblxuICAgIGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoJ3BsYXllcicpO1xuICAgIGNvbnN0IHBsYXllckdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICAvLyBwbGF5ZXJHYW1lYm9hcmQucGxhY2VTaGlwKDUsIFtbMywyXSxbNCwyXSxbNSwyXSxbNiwyXSxbNywyXV0pO1xuICAgIC8vIHBsYXllckdhbWVib2FyZC5wbGFjZVNoaXAoNCwgW1sxLDVdLFsxLDZdLFsxLDddLFsxLDhdXSk7XG4gICAgLy8gcGxheWVyR2FtZWJvYXJkLnBsYWNlU2hpcCgzLCBbWzUsN10sWzYsN10sWzcsN11dKTtcbiAgICAvLyBwbGF5ZXJHYW1lYm9hcmQucGxhY2VTaGlwKDMsIFtbOSw1XSxbOSw2XSxbOSw3XV0pO1xuICAgIC8vIHBsYXllckdhbWVib2FyZC5wbGFjZVNoaXAoMiwgW1swLDBdLFswLDFdXSk7XG4gICAgZGlzcGxheS5jcmVhdGVQbGF5ZXJCb2FyZChwbGF5ZXJHYW1lYm9hcmQpO1xuICAgIFxuXG4gICAgY29uc3QgYWkgPSBuZXcgUGxheWVyKCdhaScpO1xuICAgIGNvbnN0IGFpR2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIGFpR2FtZWJvYXJkLnBsYWNlU2hpcCg1LCBbWzUsMF0sWzYsMF0sWzcsMF0sWzgsMF0sWzksMF1dKTtcbiAgICBhaUdhbWVib2FyZC5wbGFjZVNoaXAoNCwgW1szLDRdLFs0LDRdLFs1LDRdLFs2LDRdXSk7XG4gICAgYWlHYW1lYm9hcmQucGxhY2VTaGlwKDMsIFtbNCw1XSxbNSw1XSxbNiw1XV0pO1xuICAgIGFpR2FtZWJvYXJkLnBsYWNlU2hpcCgzLCBbWzAsNV0sWzAsNl0sWzAsN11dKTtcbiAgICBhaUdhbWVib2FyZC5wbGFjZVNoaXAoMiwgW1s1LDhdLFs1LDldXSk7XG4gICAgZGlzcGxheS5jcmVhdGVBaUJvYXJkKCk7XG5cblxuICAgIC8vIGZ1bmN0aW9ucyB0byBhZGQgc2hpcHNcblxuICAgIGxldCB0dXJuID0gJ3BsYXllcic7XG4gICAgbGV0IHdpbm5lciA9ICcnO1xuXG4gICAgY29uc3QgY2hlY2tXaW5uZXIgPSAocGxheWVyQm9hcmQsIGFpQm9hcmQpID0+IHtcbiAgICAgICAgaWYgKHBsYXllckJvYXJkLmFsbFN1bmtTdGF0dXMpIHtcbiAgICAgICAgICAgIHdpbm5lciA9ICdhaSc7XG4gICAgICAgICAgICB3aW5uZXJQb3B1cC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIHdpbm5lclRleHQudGV4dENvbnRlbnQgPSAnVGhlIGNvbXB1dGVyIHdpbnMhJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWlCb2FyZC5hbGxTdW5rU3RhdHVzKSB7XG4gICAgICAgICAgICB3aW5uZXIgPSAncGxheWVyJztcbiAgICAgICAgICAgIHdpbm5lclBvcHVwLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgd2lubmVyVGV4dC50ZXh0Q29udGVudCA9ICdDb25ncmF0cywgeW91IHdpbiEnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGxheSA9IChlKSA9PiB7XG4gICAgICAgIGlmICh3aW5uZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0dXJuID09PSAncGxheWVyJykge1xuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBbTnVtYmVyKGUudGFyZ2V0LmlkWzBdKSwgTnVtYmVyKGUudGFyZ2V0LmlkWzJdKV07XG4gICAgICAgICAgICBwbGF5ZXIuYXR0YWNrKGNvb3JkLCBhaUdhbWVib2FyZCk7XG4gICAgICAgICAgICBkaXNwbGF5LnRha2VBdHRhY2soY29vcmQsIGFpR2FtZWJvYXJkLCBlLnRhcmdldCk7XG4gICAgICAgICAgICB0dXJuID0gJ2FpJztcbiAgICAgICAgfSBlbHNlIGlmICh0dXJuID09PSAnYWknKSB7XG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IGFpLnJhbmRvbUF0dGFjayhwbGF5ZXJHYW1lYm9hcmQpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wbGF5ZXItYm9hcmQgPiBkaXYnKTtcbiAgICAgICAgICAgIHBsYXllclNxdWFyZXMuZm9yRWFjaCgocGxheWVyU3F1YXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWRDb29yZCA9IFtOdW1iZXIocGxheWVyU3F1YXJlLmlkWzBdKSwgTnVtYmVyKHBsYXllclNxdWFyZS5pZFsyXSldO1xuICAgICAgICAgICAgICAgIGlmIChpZENvb3JkWzBdID09PSBjb29yZFswXSAmJiBpZENvb3JkWzFdID09PSBjb29yZFsxXSkge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5LnRha2VBdHRhY2soY29vcmQsIHBsYXllckdhbWVib2FyZCwgcGxheWVyU3F1YXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHR1cm4gPSAncGxheWVyJztcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrV2lubmVyKHBsYXllckdhbWVib2FyZCwgYWlHYW1lYm9hcmQpO1xuICAgIH1cblxuICAgIHJldHVybiB7IHBsYXksIHdpbm5lciB9XG5cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVsb29wIiwiY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuaGl0cyA9IFtdO1xuICAgIH1cblxuICAgIGF0dGFjayhjb29yZCwgZ2FtZWJvYXJkKSB7XG4gICAgICAgIGlmIChnYW1lYm9hcmQuaW5jbHVkZXNBcnJheSh0aGlzLmhpdHMsIGNvb3JkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkKTtcbiAgICAgICAgdGhpcy5oaXRzLnB1c2goY29vcmQpO1xuICAgIH1cblxuICAgIHJhbmRvbUNvb3JkKCkge1xuICAgICAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgIGNvbnN0IGNvbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgcmV0dXJuIFtyb3csIGNvbF07XG4gICAgfVxuXG4gICAgcmFuZG9tQXR0YWNrKGdhbWVib2FyZCkge1xuICAgICAgICBsZXQgcmFuZG9tQ29vcmQgPSB0aGlzLnJhbmRvbUNvb3JkKCk7XG4gICAgICAgIHdoaWxlIChnYW1lYm9hcmQuaW5jbHVkZXNBcnJheSh0aGlzLmhpdHMsIHJhbmRvbUNvb3JkKSkge1xuICAgICAgICAgICAgcmFuZG9tQ29vcmQgPSB0aGlzLnJhbmRvbUNvb3JkKCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2socmFuZG9tQ29vcmQpO1xuICAgICAgICB0aGlzLmhpdHMucHVzaChyYW5kb21Db29yZCk7XG4gICAgICAgIHJldHVybiByYW5kb21Db29yZDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllciIsImNsYXNzIFNoaXAge1xuICAgIGNvbnN0cnVjdG9yKHNpemUpIHtcbiAgICAgICAgdGhpcy5zaGlwU2l6ZSA9IHNpemU7XG4gICAgICAgIHRoaXMuaGl0Q291bnQgPSAwO1xuICAgICAgICB0aGlzLnN1bmtTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb29yZGluYXRlcyA9IFtdO1xuICAgIH1cblxuICAgIGhpdCgpIHtcbiAgICAgICAgdGhpcy5oaXRDb3VudCArPSAxO1xuICAgICAgICB0aGlzLmlzU3VuaygpO1xuICAgIH1cblxuICAgIGlzU3VuaygpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hpcFNpemUgPT09IHRoaXMuaGl0Q291bnQpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vua1N0YXR1cyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBnYW1lbG9vcCBmcm9tIFwiLi9nYW1lbG9vcFwiO1xuXG5jb25zdCBhaVNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWktYm9hcmQgPiBkaXYnKTtcblxuYWlTcXVhcmVzLmZvckVhY2goKGFpU3F1YXJlKSA9PiB7XG4gICAgYWlTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBnYW1lbG9vcC5wbGF5KGUpO1xuICAgICAgICBnYW1lbG9vcC5wbGF5KGUpO1xuICAgIH0pO1xufSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9