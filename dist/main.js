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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFQSxpRUFBZTs7Ozs7Ozs7Ozs7Ozs7QUMvQmY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlOzs7Ozs7VUNwQmY7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05rQzs7QUFFbEM7O0FBRUE7QUFDQTtBQUNBLFFBQVEsaURBQVE7QUFDaEIsUUFBUSxpREFBUTtBQUNoQixLQUFLO0FBQ0wsQ0FBQyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kaXNwbGF5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItYm9hcmQnKTtcbmNvbnN0IGFpQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFpLWJvYXJkJyk7XG5jb25zdCBwbGFjZW1lbnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2VtZW50LWJvYXJkJyk7XG5jb25zdCBzaGlwVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXRleHQnKTtcbmNvbnN0IHBsYWNlbWVudFBvcHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzLXBvcHVwJyk7XG5cbmNvbnN0IGRpc3BsYXkgPSAoKCkgPT4ge1xuXG4gICAgY29uc3QgY3JlYXRlR2FtZWJvYXJkID0gKHBhcmVudCwgc3VmZml4KSA9PiB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgZm9yKGxldCBrID0gMDsgayA8IDEwIDsgaysrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgICAgICAgICAgICAgc3F1YXJlLnNldEF0dHJpYnV0ZSgnaWQnLGAke2p9LCR7a30ke3N1ZmZpeH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNob3dQbGF5ZXJTaGlwcyA9IChib2FyZCkgPT4ge1xuICAgICAgICBjb25zdCBwbGF5ZXJTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYXllci1ib2FyZCA+IGRpdicpO1xuICAgICAgICBjb25zdCBwbGFjZW1lbnRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYWNlbWVudC1ib2FyZCA+IGRpdicpO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgZm9yKGxldCBrID0gMDsgayA8IDEwIDsgaysrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvYXJkLmdyaWRbal1ba10gPT09ICdYJykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJTcXVhcmVzW2ldLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1zaGlwJyk7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFNxdWFyZXNbaV0uY2xhc3NMaXN0LmFkZCgncGxheWVyLXNoaXAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlUGxheWVyQm9hcmQgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgLy8gY3JlYXRlIHBsYXllciBnYW1lYm9hcmRcbiAgICAgICAgY3JlYXRlR2FtZWJvYXJkKHBsYXllckNvbnRhaW5lciwgJycpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBwbGFjZW1lbnQgYm9hcmRcbiAgICAgICAgY3JlYXRlR2FtZWJvYXJkKHBsYWNlbWVudENvbnRhaW5lciwgJ3AnKTtcblxuXG4gICAgICAgIC8vIHBsYWNlIGluaXRpYWwgc2hpcFxuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHNoaXBUZXh0LnRleHRDb250ZW50ID0gYFBsYWNlIHlvdXIgJHtib2FyZC5zaGlwVHlwZXNbaV0ubmFtZX1gO1xuICAgICAgICBjb25zdCBwbGFjZW1lbnRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYWNlbWVudC1ib2FyZCA+IGRpdicpO1xuICAgICAgICBwbGFjZW1lbnRTcXVhcmVzLmZvckVhY2goKHBsYWNlbWVudFNxdWFyZSkgPT4ge1xuICAgICAgICAgICAgcGxhY2VtZW50U3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJPZkNvb3JkID0gW107XG4gICAgICAgICAgICAgICAgY29uc3QgY29vcmQgPSBbTnVtYmVyKGUudGFyZ2V0LmlkWzBdKSwgTnVtYmVyKGUudGFyZ2V0LmlkWzJdKV07XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gY29vcmRbMF07XG4gICAgICAgICAgICAgICAgY29uc3QgY29sID0gY29vcmRbMV07XG4gICAgICAgICAgICAgICAgYXJyT2ZDb29yZC5wdXNoKGNvb3JkKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gY29sICsgMTsgaiA8IGNvbCArIGJvYXJkLnNoaXBUeXBlc1tpXS5zaXplOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG1wQ29vcmQgPSBbcm93LCBqXTtcbiAgICAgICAgICAgICAgICAgICAgYXJyT2ZDb29yZC5wdXNoKHRtcENvb3JkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYm9hcmQuc2hpcFR5cGVzW2ldLnNpemUpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyck9mQ29vcmQpO1xuICAgICAgICAgICAgICAgIGJvYXJkLnBsYWNlU2hpcChib2FyZC5zaGlwVHlwZXNbaV0uc2l6ZSwgYXJyT2ZDb29yZCk7XG4gICAgICAgICAgICAgICAgc2hvd1BsYXllclNoaXBzKGJvYXJkKTtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgaWYgKCFib2FyZC5zaGlwVHlwZXNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50UG9wdXAuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzaGlwVGV4dC50ZXh0Q29udGVudCA9IGBQbGFjZSB5b3VyICR7Ym9hcmQuc2hpcFR5cGVzW2ldLm5hbWV9YDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBuZWVkIHRvIG5vdCBsZXQgeW91IGlucHV0IHNoaXAgaWYgb3V0IG9mIGJvdW5kc1xuICAgICAgICAvLyBuZWVkIHRvIGFkZCBhYmlsaXR5IHRvIHJvdGF0ZVxuICAgICAgICAvLyBuZWVkIHRvIHNob3cgc2hpcCBoaWdobGlnaHRlZCBvbiBtb3VzZW92ZXJcbiAgICAgICAgLy8gbmVlZCB0byBhZGQgc2hpcCB0byBwbGFjZW1lbnQgYm9hcmQgd2hlbiBjbGlja2luZ1xuXG5cbiAgICAgICAgLy8gcGxhY2VtZW50U3F1YXJlcy5mb3JFYWNoKChwbGFjZW1lbnRTcXVhcmUpID0+IHtcbiAgICAgICAgLy8gICAgIHBsYWNlbWVudFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgICAgICAvLyAgICAgICAgIGNvbnN0IGNvb3JkID0gW051bWJlcihlLnRhcmdldC5pZFswXSksIE51bWJlcihlLnRhcmdldC5pZFsyXSldO1xuICAgICAgICAvLyAgICAgICAgIGNvbnN0IHJvdyA9IGNvb3JkWzBdO1xuICAgICAgICAvLyAgICAgICAgIGNvbnN0IGNvbCA9IGNvb3JkWzFdO1xuICAgICAgICAvLyAgICAgICAgIGZvciAobGV0IGkgPSBjb2wgKyAxOyBpIDwgY29sICsgNTsgaSsrKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbnN0IHRtcENvb3JkID0gW3JvdywgaV07XG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRtcENvb3JkKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG1wQ29vcmQpO1xuICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhkaXYpO1xuICAgICAgICAvLyAgICAgICAgICAgICBkaXYuZm9jdXMoKTtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfSk7XG5cbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVBaUJvYXJkID0gKCkgPT4ge1xuICAgICAgICBjcmVhdGVHYW1lYm9hcmQoYWlDb250YWluZXIsICcnKTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWtlQXR0YWNrID0gKGNvb3JkLCBib2FyZCwgZGl2KSA9PiB7XG4gICAgICAgIGlmIChib2FyZC5pbmNsdWRlc0FycmF5KGJvYXJkLm1pc3NlZCwgY29vcmQpKSB7XG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgY3JlYXRlUGxheWVyQm9hcmQsIGNyZWF0ZUFpQm9hcmQsIHRha2VBdHRhY2sgfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5IiwiaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5jb25zdCBzaGlwVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXRleHQnKTtcblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ncmlkID0gdGhpcy5jcmVhdGVHcmlkKCk7XG4gICAgICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgICAgICAgdGhpcy5taXNzZWQgPSBbXTtcbiAgICAgICAgdGhpcy5hbGxTdW5rU3RhdHVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2hpcFR5cGVzID0gW1xuICAgICAgICAgICAgeyBuYW1lOiAnQ2FycmllcicsIHNpemU6IDUgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0JhdHRsZXNoaXAnLCBzaXplOiA0IH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdDcnVpc2VyJywgc2l6ZTogMyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnU3VibWFyaW5lJywgc2l6ZTogMyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnRGVzdHJveWVyJywgc2l6ZTogMiB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgY3JlYXRlR3JpZCgpIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IG5ldyBBcnJheSgxMCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZ3JpZFtpXSA9IG5ldyBBcnJheSgxMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyaWQ7XG4gICAgfVxuXG4gICAgcGxhY2VTaGlwKHNpemUsIGFyck9mQ29vcmQpIHtcbiAgICAgICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKHNpemUpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyck9mQ29vcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gYXJyT2ZDb29yZFtpXTtcbiAgICAgICAgICAgIHNoaXAuY29vcmRpbmF0ZXMucHVzaChjb29yZCk7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBjb29yZFswXTtcbiAgICAgICAgICAgIGNvbnN0IGNvbCA9IGNvb3JkWzFdO1xuICAgICAgICAgICAgdGhpcy5ncmlkW3Jvd11bY29sXSA9ICdYJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNoaXBzLnB1c2goc2hpcCk7XG4gICAgICAgIHJldHVybiBzaGlwO1xuICAgIH1cblxuICAgIGluY2x1ZGVzQXJyYXkoZGF0YSwgYXJyKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnNvbWUoaXRlbSA9PiBBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0uZXZlcnkoKG8sIGkpID0+IE9iamVjdC5pcyhhcnJbaV0sIG8pKSk7XG4gICAgfTtcblxuICAgIHJlY2VpdmVBdHRhY2soY29vcmQpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gY29vcmRbMF07XG4gICAgICAgIGNvbnN0IGNvbCA9IGNvb3JkWzFdO1xuICAgICAgICBpZiAodGhpcy5ncmlkW3Jvd11bY29sXSA9PT0gJ1gnKXtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQXJyYXkodGhpcy5zaGlwc1tpXS5jb29yZGluYXRlcywgY29vcmQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcHNbaV0uaGl0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmdyaWRbcm93XVtjb2xdKSB7XG4gICAgICAgICAgICB0aGlzLm1pc3NlZC5wdXNoKGNvb3JkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoZWNrSWZBbGxTdW5rKCk7XG4gICAgfVxuXG4gICAgY2hlY2tJZkFsbFN1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnNoaXBzLmV2ZXJ5KGl0ZW0gPT4gaXRlbS5zdW5rU3RhdHVzID09PSB0cnVlKSkge1xuICAgICAgICAgICAgdGhpcy5hbGxTdW5rU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgZGlzcGxheSBmcm9tIFwiLi9kaXNwbGF5XCI7XG5cbmNvbnN0IHdpbm5lclBvcHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lci1wb3B1cCcpO1xuY29uc3Qgd2lubmVyVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5uZXItdGV4dCcpO1xuXG5jb25zdCBnYW1lbG9vcCA9ICgoKSA9PiB7XG5cbiAgICBjb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKCdwbGF5ZXInKTtcbiAgICBjb25zdCBwbGF5ZXJHYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgLy8gcGxheWVyR2FtZWJvYXJkLnBsYWNlU2hpcCg1LCBbWzMsMl0sWzQsMl0sWzUsMl0sWzYsMl0sWzcsMl1dKTtcbiAgICAvLyBwbGF5ZXJHYW1lYm9hcmQucGxhY2VTaGlwKDQsIFtbMSw1XSxbMSw2XSxbMSw3XSxbMSw4XV0pO1xuICAgIC8vIHBsYXllckdhbWVib2FyZC5wbGFjZVNoaXAoMywgW1s1LDddLFs2LDddLFs3LDddXSk7XG4gICAgLy8gcGxheWVyR2FtZWJvYXJkLnBsYWNlU2hpcCgzLCBbWzksNV0sWzksNl0sWzksN11dKTtcbiAgICAvLyBwbGF5ZXJHYW1lYm9hcmQucGxhY2VTaGlwKDIsIFtbMCwwXSxbMCwxXV0pO1xuICAgIGRpc3BsYXkuY3JlYXRlUGxheWVyQm9hcmQocGxheWVyR2FtZWJvYXJkKTtcbiAgICBcblxuICAgIGNvbnN0IGFpID0gbmV3IFBsYXllcignYWknKTtcbiAgICBjb25zdCBhaUdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICBhaUdhbWVib2FyZC5wbGFjZVNoaXAoNSwgW1s1LDBdLFs2LDBdLFs3LDBdLFs4LDBdLFs5LDBdXSk7XG4gICAgYWlHYW1lYm9hcmQucGxhY2VTaGlwKDQsIFtbMyw0XSxbNCw0XSxbNSw0XSxbNiw0XV0pO1xuICAgIGFpR2FtZWJvYXJkLnBsYWNlU2hpcCgzLCBbWzQsNV0sWzUsNV0sWzYsNV1dKTtcbiAgICBhaUdhbWVib2FyZC5wbGFjZVNoaXAoMywgW1swLDVdLFswLDZdLFswLDddXSk7XG4gICAgYWlHYW1lYm9hcmQucGxhY2VTaGlwKDIsIFtbNSw4XSxbNSw5XV0pO1xuICAgIGRpc3BsYXkuY3JlYXRlQWlCb2FyZCgpO1xuXG5cbiAgICAvLyBmdW5jdGlvbnMgdG8gYWRkIHNoaXBzXG5cbiAgICBsZXQgdHVybiA9ICdwbGF5ZXInO1xuICAgIGxldCB3aW5uZXIgPSAnJztcblxuICAgIGNvbnN0IGNoZWNrV2lubmVyID0gKHBsYXllckJvYXJkLCBhaUJvYXJkKSA9PiB7XG4gICAgICAgIGlmIChwbGF5ZXJCb2FyZC5hbGxTdW5rU3RhdHVzKSB7XG4gICAgICAgICAgICB3aW5uZXIgPSAnYWknO1xuICAgICAgICAgICAgd2lubmVyUG9wdXAuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICB3aW5uZXJUZXh0LnRleHRDb250ZW50ID0gJ1RoZSBjb21wdXRlciB3aW5zISc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFpQm9hcmQuYWxsU3Vua1N0YXR1cykge1xuICAgICAgICAgICAgd2lubmVyID0gJ3BsYXllcic7XG4gICAgICAgICAgICB3aW5uZXJQb3B1cC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIHdpbm5lclRleHQudGV4dENvbnRlbnQgPSAnQ29uZ3JhdHMsIHlvdSB3aW4hJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHBsYXkgPSAoZSkgPT4ge1xuICAgICAgICBpZiAod2lubmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHVybiA9PT0gJ3BsYXllcicpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gW051bWJlcihlLnRhcmdldC5pZFswXSksIE51bWJlcihlLnRhcmdldC5pZFsyXSldO1xuICAgICAgICAgICAgcGxheWVyLmF0dGFjayhjb29yZCwgYWlHYW1lYm9hcmQpO1xuICAgICAgICAgICAgZGlzcGxheS50YWtlQXR0YWNrKGNvb3JkLCBhaUdhbWVib2FyZCwgZS50YXJnZXQpO1xuICAgICAgICAgICAgdHVybiA9ICdhaSc7XG4gICAgICAgIH0gZWxzZSBpZiAodHVybiA9PT0gJ2FpJykge1xuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBhaS5yYW5kb21BdHRhY2socGxheWVyR2FtZWJvYXJkKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllclNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLWJvYXJkID4gZGl2Jyk7XG4gICAgICAgICAgICBwbGF5ZXJTcXVhcmVzLmZvckVhY2goKHBsYXllclNxdWFyZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkQ29vcmQgPSBbTnVtYmVyKHBsYXllclNxdWFyZS5pZFswXSksIE51bWJlcihwbGF5ZXJTcXVhcmUuaWRbMl0pXTtcbiAgICAgICAgICAgICAgICBpZiAoaWRDb29yZFswXSA9PT0gY29vcmRbMF0gJiYgaWRDb29yZFsxXSA9PT0gY29vcmRbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheS50YWtlQXR0YWNrKGNvb3JkLCBwbGF5ZXJHYW1lYm9hcmQsIHBsYXllclNxdWFyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0dXJuID0gJ3BsYXllcic7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1dpbm5lcihwbGF5ZXJHYW1lYm9hcmQsIGFpR2FtZWJvYXJkKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBwbGF5LCB3aW5uZXIgfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lbG9vcCIsImNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmhpdHMgPSBbXTtcbiAgICB9XG5cbiAgICBhdHRhY2soY29vcmQsIGdhbWVib2FyZCkge1xuICAgICAgICBpZiAoZ2FtZWJvYXJkLmluY2x1ZGVzQXJyYXkodGhpcy5oaXRzLCBjb29yZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZCk7XG4gICAgICAgIHRoaXMuaGl0cy5wdXNoKGNvb3JkKTtcbiAgICB9XG5cbiAgICByYW5kb21Db29yZCgpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICBjb25zdCBjb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgIHJldHVybiBbcm93LCBjb2xdO1xuICAgIH1cblxuICAgIHJhbmRvbUF0dGFjayhnYW1lYm9hcmQpIHtcbiAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gdGhpcy5yYW5kb21Db29yZCgpO1xuICAgICAgICB3aGlsZSAoZ2FtZWJvYXJkLmluY2x1ZGVzQXJyYXkodGhpcy5oaXRzLCByYW5kb21Db29yZCkpIHtcbiAgICAgICAgICAgIHJhbmRvbUNvb3JkID0gdGhpcy5yYW5kb21Db29yZCgpO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHJhbmRvbUNvb3JkKTtcbiAgICAgICAgdGhpcy5oaXRzLnB1c2gocmFuZG9tQ29vcmQpO1xuICAgICAgICByZXR1cm4gcmFuZG9tQ29vcmQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXIiLCJjbGFzcyBTaGlwIHtcbiAgICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgICAgIHRoaXMuc2hpcFNpemUgPSBzaXplO1xuICAgICAgICB0aGlzLmhpdENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5zdW5rU3RhdHVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbXTtcbiAgICB9XG5cbiAgICBoaXQoKSB7XG4gICAgICAgIHRoaXMuaGl0Q291bnQgKz0gMTtcbiAgICAgICAgdGhpcy5pc1N1bmsoKTtcbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnNoaXBTaXplID09PSB0aGlzLmhpdENvdW50KSB7XG4gICAgICAgICAgICB0aGlzLnN1bmtTdGF0dXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZ2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxuY29uc3QgYWlTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFpLWJvYXJkID4gZGl2Jyk7XG5cbmFpU3F1YXJlcy5mb3JFYWNoKChhaVNxdWFyZSkgPT4ge1xuICAgIGFpU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZ2FtZWxvb3AucGxheShlKTtcbiAgICAgICAgZ2FtZWxvb3AucGxheShlKTtcbiAgICB9KTtcbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==