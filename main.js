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
        });

        // need to show ship highlighted on mouseover


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHdCQUF3QixRQUFRO0FBQ2hDLDJCQUEyQixTQUFTO0FBQ3BDO0FBQ0E7QUFDQSw0Q0FBNEMsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPO0FBQzVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixRQUFRO0FBQ2hDLDJCQUEyQixTQUFTO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSw2Q0FBNkMsd0JBQXdCO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxtQ0FBbUM7QUFDN0U7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLDBDQUEwQyxtQ0FBbUM7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCx3QkFBd0I7QUFDakY7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxhQUFhO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQixZQUFZOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBLGFBQWE7O0FBRWIsQ0FBQzs7QUFFRCxpRUFBZTs7Ozs7Ozs7Ozs7Ozs7O0FDeklXOztBQUUxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsMEJBQTBCO0FBQ3hDLGNBQWMsNkJBQTZCO0FBQzNDLGNBQWMsMEJBQTBCO0FBQ3hDLGNBQWMsNEJBQTRCO0FBQzFDLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUJBQXlCLDZDQUFJO0FBQzdCLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix1QkFBdUI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2xFZTtBQUNNO0FBQ0o7O0FBRWhDO0FBQ0E7O0FBRUE7O0FBRUEsdUJBQXVCLCtDQUFNO0FBQzdCLGdDQUFnQyxrREFBUztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxnREFBTztBQUNYOztBQUVBLG1CQUFtQiwrQ0FBTTtBQUN6Qiw0QkFBNEIsa0RBQVM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0RBQU87OztBQUdYOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksZ0RBQU87QUFDbkI7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixnREFBTztBQUMzQjtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsYUFBYTs7QUFFYixDQUFDOztBQUVELGlFQUFlOzs7Ozs7Ozs7Ozs7OztBQzVFZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWU7Ozs7Ozs7Ozs7Ozs7O0FDL0JmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZTs7Ozs7O1VDcEJmO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0M7O0FBRWxDOztBQUVBO0FBQ0E7QUFDQSxRQUFRLGlEQUFRO0FBQ2hCLFFBQVEsaURBQVE7QUFDaEIsS0FBSztBQUNMLENBQUMsRSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZGlzcGxheS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWJvYXJkJyk7XG5jb25zdCBhaUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5haS1ib2FyZCcpO1xuY29uc3QgcGxhY2VtZW50Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlbWVudC1ib2FyZCcpO1xuY29uc3Qgc2hpcFRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC10ZXh0Jyk7XG5jb25zdCBwbGFjZW1lbnRQb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcy1wb3B1cCcpO1xuY29uc3Qgcm90YXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJvdGF0ZS1idG4nKTtcblxuY29uc3QgZGlzcGxheSA9ICgoKSA9PiB7XG5cbiAgICBjb25zdCBjcmVhdGVHYW1lYm9hcmQgPSAocGFyZW50LCBzdWZmaXgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBmb3IobGV0IGsgPSAwOyBrIDwgMTAgOyBrKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgICAgICAgICAgICBzcXVhcmUuc2V0QXR0cmlidXRlKCdpZCcsYCR7an0sJHtrfSR7c3VmZml4fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2hvd1BsYXllclNoaXBzID0gKGJvYXJkKSA9PiB7XG4gICAgICAgIGNvbnN0IHBsYXllclNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLWJvYXJkID4gZGl2Jyk7XG4gICAgICAgIGNvbnN0IHBsYWNlbWVudFNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxhY2VtZW50LWJvYXJkID4gZGl2Jyk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBmb3IobGV0IGsgPSAwOyBrIDwgMTAgOyBrKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9hcmQuZ3JpZFtqXVtrXSA9PT0gJ1gnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllclNxdWFyZXNbaV0uY2xhc3NMaXN0LmFkZCgncGxheWVyLXNoaXAnKTtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50U3F1YXJlc1tpXS5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItc2hpcCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjaGVja1ZhbGlkaXR5ID0gKGJvYXJkLCBhcnJPZkNvb3JkKSA9PiB7XG4gICAgICAgIGxldCB2YWxpZGl0eSA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyT2ZDb29yZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFyck9mQ29vcmRbaV1bMF0gPiA5IHx8IGFyck9mQ29vcmRbaV1bMV0gPiA5KSB7XG4gICAgICAgICAgICAgICAgdmFsaWRpdHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYm9hcmQuZ3JpZFthcnJPZkNvb3JkW2ldWzBdXVthcnJPZkNvb3JkW2ldWzFdXSA9PT0gJ1gnKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRpdHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsaWRpdHk7XG4gICAgfVxuXG4gICAgbGV0IHNoaXBPcmllbnRhdGlvbiA9ICdob3Jpem9udGFsJztcbiAgICBcbiAgICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmIChzaGlwT3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgc2hpcE9yaWVudGF0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICAgICAgfSBlbHNlIGlmIChzaGlwT3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgIHNoaXBPcmllbnRhdGlvbiA9ICdob3Jpem9udGFsJztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgY3JlYXRlUGxheWVyQm9hcmQgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgLy8gY3JlYXRlIHBsYXllciBnYW1lYm9hcmRcbiAgICAgICAgY3JlYXRlR2FtZWJvYXJkKHBsYXllckNvbnRhaW5lciwgJycpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBwbGFjZW1lbnQgYm9hcmRcbiAgICAgICAgY3JlYXRlR2FtZWJvYXJkKHBsYWNlbWVudENvbnRhaW5lciwgJ3AnKTtcblxuXG4gICAgICAgIC8vIHBsYWNlIGluaXRpYWwgc2hpcFxuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHNoaXBUZXh0LnRleHRDb250ZW50ID0gYFBsYWNlIHlvdXIgJHtib2FyZC5zaGlwVHlwZXNbaV0ubmFtZX1gO1xuICAgICAgICBjb25zdCBwbGFjZW1lbnRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYWNlbWVudC1ib2FyZCA+IGRpdicpO1xuICAgICAgICBwbGFjZW1lbnRTcXVhcmVzLmZvckVhY2goKHBsYWNlbWVudFNxdWFyZSkgPT4ge1xuICAgICAgICAgICAgcGxhY2VtZW50U3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJPZkNvb3JkID0gW107XG4gICAgICAgICAgICAgICAgY29uc3QgY29vcmQgPSBbTnVtYmVyKGUudGFyZ2V0LmlkWzBdKSwgTnVtYmVyKGUudGFyZ2V0LmlkWzJdKV07XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gY29vcmRbMF07XG4gICAgICAgICAgICAgICAgY29uc3QgY29sID0gY29vcmRbMV07XG4gICAgICAgICAgICAgICAgYXJyT2ZDb29yZC5wdXNoKGNvb3JkKTtcbiAgICAgICAgICAgICAgICBpZiAoc2hpcE9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IGNvbCArIDE7IGogPCBjb2wgKyBib2FyZC5zaGlwVHlwZXNbaV0uc2l6ZTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0bXBDb29yZCA9IFtyb3csIGpdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyT2ZDb29yZC5wdXNoKHRtcENvb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hpcE9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSByb3cgKyAxOyBqIDwgcm93ICsgYm9hcmQuc2hpcFR5cGVzW2ldLnNpemU7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG1wQ29vcmQgPSBbaiwgY29sXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyck9mQ29vcmQucHVzaCh0bXBDb29yZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXJyT2ZDb29yZCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hlY2tWYWxpZGl0eShib2FyZCwgYXJyT2ZDb29yZCkpO1xuICAgICAgICAgICAgICAgIGlmIChjaGVja1ZhbGlkaXR5KGJvYXJkLCBhcnJPZkNvb3JkKSkge1xuICAgICAgICAgICAgICAgICAgICBib2FyZC5wbGFjZVNoaXAoYm9hcmQuc2hpcFR5cGVzW2ldLnNpemUsIGFyck9mQ29vcmQpO1xuICAgICAgICAgICAgICAgICAgICBzaG93UGxheWVyU2hpcHMoYm9hcmQpO1xuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYm9hcmQuc2hpcFR5cGVzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRQb3B1cC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNoaXBUZXh0LnRleHRDb250ZW50ID0gYFBsYWNlIHlvdXIgJHtib2FyZC5zaGlwVHlwZXNbaV0ubmFtZX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBuZWVkIHRvIHNob3cgc2hpcCBoaWdobGlnaHRlZCBvbiBtb3VzZW92ZXJcblxuXG4gICAgICAgIC8vIHBsYWNlbWVudFNxdWFyZXMuZm9yRWFjaCgocGxhY2VtZW50U3F1YXJlKSA9PiB7XG4gICAgICAgIC8vICAgICBwbGFjZW1lbnRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICAgICAgLy8gICAgICAgICBjb25zdCBjb29yZCA9IFtOdW1iZXIoZS50YXJnZXQuaWRbMF0pLCBOdW1iZXIoZS50YXJnZXQuaWRbMl0pXTtcbiAgICAgICAgLy8gICAgICAgICBjb25zdCByb3cgPSBjb29yZFswXTtcbiAgICAgICAgLy8gICAgICAgICBjb25zdCBjb2wgPSBjb29yZFsxXTtcbiAgICAgICAgLy8gICAgICAgICBmb3IgKGxldCBpID0gY29sICsgMTsgaSA8IGNvbCArIDU7IGkrKykge1xuICAgICAgICAvLyAgICAgICAgICAgICBjb25zdCB0bXBDb29yZCA9IFtyb3csIGldO1xuICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyh0bXBDb29yZCk7XG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRtcENvb3JkKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2coZGl2KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgZGl2LmZvY3VzKCk7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vIH0pO1xuXG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlQWlCb2FyZCA9ICgpID0+IHtcbiAgICAgICAgY3JlYXRlR2FtZWJvYXJkKGFpQ29udGFpbmVyLCAnJyk7XG4gICAgfVxuXG4gICAgY29uc3QgdGFrZUF0dGFjayA9IChjb29yZCwgYm9hcmQsIGRpdikgPT4ge1xuICAgICAgICBpZiAoYm9hcmQuaW5jbHVkZXNBcnJheShib2FyZC5taXNzZWQsIGNvb3JkKSkge1xuICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IGNyZWF0ZVBsYXllckJvYXJkLCBjcmVhdGVBaUJvYXJkLCB0YWtlQXR0YWNrIH1cblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheSIsImltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuY29uc3Qgc2hpcFRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC10ZXh0Jyk7XG5cbmNsYXNzIEdhbWVib2FyZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ3JpZCA9IHRoaXMuY3JlYXRlR3JpZCgpO1xuICAgICAgICB0aGlzLnNoaXBzID0gW107XG4gICAgICAgIHRoaXMubWlzc2VkID0gW107XG4gICAgICAgIHRoaXMuYWxsU3Vua1N0YXR1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNoaXBUeXBlcyA9IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ0NhcnJpZXInLCBzaXplOiA1IH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdCYXR0bGVzaGlwJywgc2l6ZTogNCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnQ3J1aXNlcicsIHNpemU6IDMgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ1N1Ym1hcmluZScsIHNpemU6IDMgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0Rlc3Ryb3llcicsIHNpemU6IDIgfVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGNyZWF0ZUdyaWQoKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSBuZXcgQXJyYXkoMTApO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGdyaWRbaV0gPSBuZXcgQXJyYXkoMTApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkO1xuICAgIH1cblxuICAgIHBsYWNlU2hpcChzaXplLCBhcnJPZkNvb3JkKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChzaXplKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJPZkNvb3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IGFyck9mQ29vcmRbaV07XG4gICAgICAgICAgICBzaGlwLmNvb3JkaW5hdGVzLnB1c2goY29vcmQpO1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gY29vcmRbMF07XG4gICAgICAgICAgICBjb25zdCBjb2wgPSBjb29yZFsxXTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFtyb3ddW2NvbF0gPSAnWCc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaGlwcy5wdXNoKHNoaXApO1xuICAgICAgICByZXR1cm4gc2hpcDtcbiAgICB9XG5cbiAgICBpbmNsdWRlc0FycmF5KGRhdGEsIGFycikge1xuICAgICAgICByZXR1cm4gZGF0YS5zb21lKGl0ZW0gPT4gQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtLmV2ZXJ5KChvLCBpKSA9PiBPYmplY3QuaXMoYXJyW2ldLCBvKSkpO1xuICAgIH07XG5cbiAgICByZWNlaXZlQXR0YWNrKGNvb3JkKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IGNvb3JkWzBdO1xuICAgICAgICBjb25zdCBjb2wgPSBjb29yZFsxXTtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZFtyb3ddW2NvbF0gPT09ICdYJyl7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0FycmF5KHRoaXMuc2hpcHNbaV0uY29vcmRpbmF0ZXMsIGNvb3JkKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoaXBzW2ldLmhpdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5ncmlkW3Jvd11bY29sXSkge1xuICAgICAgICAgICAgdGhpcy5taXNzZWQucHVzaChjb29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja0lmQWxsU3VuaygpO1xuICAgIH1cblxuICAgIGNoZWNrSWZBbGxTdW5rKCkge1xuICAgICAgICBpZiAodGhpcy5zaGlwcy5ldmVyeShpdGVtID0+IGl0ZW0uc3Vua1N0YXR1cyA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuYWxsU3Vua1N0YXR1cyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZCIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IGRpc3BsYXkgZnJvbSBcIi4vZGlzcGxheVwiO1xuXG5jb25zdCB3aW5uZXJQb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5uZXItcG9wdXAnKTtcbmNvbnN0IHdpbm5lclRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2lubmVyLXRleHQnKTtcblxuY29uc3QgZ2FtZWxvb3AgPSAoKCkgPT4ge1xuXG4gICAgY29uc3QgcGxheWVyID0gbmV3IFBsYXllcigncGxheWVyJyk7XG4gICAgY29uc3QgcGxheWVyR2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIC8vIHBsYXllckdhbWVib2FyZC5wbGFjZVNoaXAoNSwgW1szLDJdLFs0LDJdLFs1LDJdLFs2LDJdLFs3LDJdXSk7XG4gICAgLy8gcGxheWVyR2FtZWJvYXJkLnBsYWNlU2hpcCg0LCBbWzEsNV0sWzEsNl0sWzEsN10sWzEsOF1dKTtcbiAgICAvLyBwbGF5ZXJHYW1lYm9hcmQucGxhY2VTaGlwKDMsIFtbNSw3XSxbNiw3XSxbNyw3XV0pO1xuICAgIC8vIHBsYXllckdhbWVib2FyZC5wbGFjZVNoaXAoMywgW1s5LDVdLFs5LDZdLFs5LDddXSk7XG4gICAgLy8gcGxheWVyR2FtZWJvYXJkLnBsYWNlU2hpcCgyLCBbWzAsMF0sWzAsMV1dKTtcbiAgICBkaXNwbGF5LmNyZWF0ZVBsYXllckJvYXJkKHBsYXllckdhbWVib2FyZCk7XG4gICAgXG5cbiAgICBjb25zdCBhaSA9IG5ldyBQbGF5ZXIoJ2FpJyk7XG4gICAgY29uc3QgYWlHYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgYWlHYW1lYm9hcmQucGxhY2VTaGlwKDUsIFtbNSwwXSxbNiwwXSxbNywwXSxbOCwwXSxbOSwwXV0pO1xuICAgIGFpR2FtZWJvYXJkLnBsYWNlU2hpcCg0LCBbWzMsNF0sWzQsNF0sWzUsNF0sWzYsNF1dKTtcbiAgICBhaUdhbWVib2FyZC5wbGFjZVNoaXAoMywgW1s0LDVdLFs1LDVdLFs2LDVdXSk7XG4gICAgYWlHYW1lYm9hcmQucGxhY2VTaGlwKDMsIFtbMCw1XSxbMCw2XSxbMCw3XV0pO1xuICAgIGFpR2FtZWJvYXJkLnBsYWNlU2hpcCgyLCBbWzUsOF0sWzUsOV1dKTtcbiAgICBkaXNwbGF5LmNyZWF0ZUFpQm9hcmQoKTtcblxuXG4gICAgLy8gZnVuY3Rpb25zIHRvIGFkZCBzaGlwc1xuXG4gICAgbGV0IHR1cm4gPSAncGxheWVyJztcbiAgICBsZXQgd2lubmVyID0gJyc7XG5cbiAgICBjb25zdCBjaGVja1dpbm5lciA9IChwbGF5ZXJCb2FyZCwgYWlCb2FyZCkgPT4ge1xuICAgICAgICBpZiAocGxheWVyQm9hcmQuYWxsU3Vua1N0YXR1cykge1xuICAgICAgICAgICAgd2lubmVyID0gJ2FpJztcbiAgICAgICAgICAgIHdpbm5lclBvcHVwLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgd2lubmVyVGV4dC50ZXh0Q29udGVudCA9ICdUaGUgY29tcHV0ZXIgd2lucyEnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhaUJvYXJkLmFsbFN1bmtTdGF0dXMpIHtcbiAgICAgICAgICAgIHdpbm5lciA9ICdwbGF5ZXInO1xuICAgICAgICAgICAgd2lubmVyUG9wdXAuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICB3aW5uZXJUZXh0LnRleHRDb250ZW50ID0gJ0NvbmdyYXRzLCB5b3Ugd2luISc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwbGF5ID0gKGUpID0+IHtcbiAgICAgICAgaWYgKHdpbm5lcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR1cm4gPT09ICdwbGF5ZXInKSB7XG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IFtOdW1iZXIoZS50YXJnZXQuaWRbMF0pLCBOdW1iZXIoZS50YXJnZXQuaWRbMl0pXTtcbiAgICAgICAgICAgIHBsYXllci5hdHRhY2soY29vcmQsIGFpR2FtZWJvYXJkKTtcbiAgICAgICAgICAgIGRpc3BsYXkudGFrZUF0dGFjayhjb29yZCwgYWlHYW1lYm9hcmQsIGUudGFyZ2V0KTtcbiAgICAgICAgICAgIHR1cm4gPSAnYWknO1xuICAgICAgICB9IGVsc2UgaWYgKHR1cm4gPT09ICdhaScpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gYWkucmFuZG9tQXR0YWNrKHBsYXllckdhbWVib2FyZCk7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXJTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYXllci1ib2FyZCA+IGRpdicpO1xuICAgICAgICAgICAgcGxheWVyU3F1YXJlcy5mb3JFYWNoKChwbGF5ZXJTcXVhcmUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZENvb3JkID0gW051bWJlcihwbGF5ZXJTcXVhcmUuaWRbMF0pLCBOdW1iZXIocGxheWVyU3F1YXJlLmlkWzJdKV07XG4gICAgICAgICAgICAgICAgaWYgKGlkQ29vcmRbMF0gPT09IGNvb3JkWzBdICYmIGlkQ29vcmRbMV0gPT09IGNvb3JkWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXkudGFrZUF0dGFjayhjb29yZCwgcGxheWVyR2FtZWJvYXJkLCBwbGF5ZXJTcXVhcmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHVybiA9ICdwbGF5ZXInO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tXaW5uZXIocGxheWVyR2FtZWJvYXJkLCBhaUdhbWVib2FyZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcGxheSwgd2lubmVyIH1cblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZWxvb3AiLCJjbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5oaXRzID0gW107XG4gICAgfVxuXG4gICAgYXR0YWNrKGNvb3JkLCBnYW1lYm9hcmQpIHtcbiAgICAgICAgaWYgKGdhbWVib2FyZC5pbmNsdWRlc0FycmF5KHRoaXMuaGl0cywgY29vcmQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmQpO1xuICAgICAgICB0aGlzLmhpdHMucHVzaChjb29yZCk7XG4gICAgfVxuXG4gICAgcmFuZG9tQ29vcmQoKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgY29uc3QgY29sID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICByZXR1cm4gW3JvdywgY29sXTtcbiAgICB9XG5cbiAgICByYW5kb21BdHRhY2soZ2FtZWJvYXJkKSB7XG4gICAgICAgIGxldCByYW5kb21Db29yZCA9IHRoaXMucmFuZG9tQ29vcmQoKTtcbiAgICAgICAgd2hpbGUgKGdhbWVib2FyZC5pbmNsdWRlc0FycmF5KHRoaXMuaGl0cywgcmFuZG9tQ29vcmQpKSB7XG4gICAgICAgICAgICByYW5kb21Db29yZCA9IHRoaXMucmFuZG9tQ29vcmQoKTtcbiAgICAgICAgfVxuICAgICAgICBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhyYW5kb21Db29yZCk7XG4gICAgICAgIHRoaXMuaGl0cy5wdXNoKHJhbmRvbUNvb3JkKTtcbiAgICAgICAgcmV0dXJuIHJhbmRvbUNvb3JkO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyIiwiY2xhc3MgU2hpcCB7XG4gICAgY29uc3RydWN0b3Ioc2l6ZSkge1xuICAgICAgICB0aGlzLnNoaXBTaXplID0gc2l6ZTtcbiAgICAgICAgdGhpcy5oaXRDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3Vua1N0YXR1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzID0gW107XG4gICAgfVxuXG4gICAgaGl0KCkge1xuICAgICAgICB0aGlzLmhpdENvdW50ICs9IDE7XG4gICAgICAgIHRoaXMuaXNTdW5rKCk7XG4gICAgfVxuXG4gICAgaXNTdW5rKCkge1xuICAgICAgICBpZiAodGhpcy5zaGlwU2l6ZSA9PT0gdGhpcy5oaXRDb3VudCkge1xuICAgICAgICAgICAgdGhpcy5zdW5rU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcCIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWVsb29wIGZyb20gXCIuL2dhbWVsb29wXCI7XG5cbmNvbnN0IGFpU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5haS1ib2FyZCA+IGRpdicpO1xuXG5haVNxdWFyZXMuZm9yRWFjaCgoYWlTcXVhcmUpID0+IHtcbiAgICBhaVNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGdhbWVsb29wLnBsYXkoZSk7XG4gICAgICAgIGdhbWVsb29wLnBsYXkoZSk7XG4gICAgfSk7XG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=