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

const display = (() => {

    const createGameboard = (parent) => {
        // for (let i = 0; i < 100; i++) {
        //     const square = document.createElement('div');
        //     parent.appendChild(square);
        // }
        for (let j = 0; j < 10; j++) {
            for(let k = 0; k < 10 ; k++) {
                const square = document.createElement('div');
                parent.appendChild(square);
                square.setAttribute('id',`${j},${k}`);
            }
        }
    }

    const showPlayerShips = (board) => {
        const playerSquares = document.querySelectorAll('.player-board > div');
        let i = 0;
        for (let j = 0; j < 10; j++) {
            for(let k = 0; k < 10 ; k++) {
                if (board.grid[j][k] === 'X') {
                    playerSquares[i].classList.add('player-ship');
                }
                i++;
            }
        }
    }

    const createPlayerBoard = (board) => {
        createGameboard(playerContainer);
        showPlayerShips(board);
    }

    const createAiBoard = (board) => {
        createGameboard(aiContainer);
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


class Gameboard {
    constructor() {
        this.grid = this.createGrid();
        this.ships = [];
        this.missed = [];
        this.allSunkStatus = false;
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
        // if (this.includesArray(this.missed, coord)) {
        //     return;
        // }
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




const gameloop = (() => {

    const player = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]('player');
    const playerGameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
    playerGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    playerGameboard.placeShip(4, [[1,5],[1,6],[1,7],[1,8]]);
    playerGameboard.placeShip(3, [[5,7],[6,7],[7,7]]);
    playerGameboard.placeShip(3, [[9,5],[9,6],[9,7]]);
    playerGameboard.placeShip(2, [[0,0],[0,1]]);
    _display__WEBPACK_IMPORTED_MODULE_2__["default"].createPlayerBoard(playerGameboard);
    

    const ai = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]('ai');
    const aiGameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
    aiGameboard.placeShip(5, [[5,0],[6,0],[7,0],[8,0],[9,0]]);
    aiGameboard.placeShip(4, [[3,4],[4,4],[5,4],[6,4]]);
    aiGameboard.placeShip(3, [[4,5],[5,5],[6,5]]);
    aiGameboard.placeShip(3, [[0,5],[0,6],[0,7]]);
    aiGameboard.placeShip(2, [[5,8],[5,9]]);
    _display__WEBPACK_IMPORTED_MODULE_2__["default"].createAiBoard(aiGameboard);


    // functions to add ships

    let turn = 'player';

    const play = (e) => {
        if (turn === 'player') {
            const coord = [Number(e.target.id[0]), Number(e.target.id[2])];
            player.attack(coord, aiGameboard);
            _display__WEBPACK_IMPORTED_MODULE_2__["default"].takeAttack(coord, aiGameboard, e.target);
            turn = 'ai';
        } else if (turn === 'ai') {
            // ai.randomAttack(playerGameboard);
            turn = 'player';
        }
    }

    return { play }

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
    });
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwyQkFBMkIsU0FBUztBQUNwQztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsUUFBUTtBQUNoQywyQkFBMkIsU0FBUztBQUNwQztBQUNBO0FBQ0EsNENBQTRDLEVBQUUsR0FBRyxFQUFFO0FBQ25EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsUUFBUTtBQUNoQywyQkFBMkIsU0FBUztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQSxhQUFhOztBQUViLENBQUM7O0FBRUQsaUVBQWU7Ozs7Ozs7Ozs7Ozs7OztBQ3JEVzs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixpQkFBaUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBeUIsNkNBQUk7QUFDN0Isd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHVCQUF1QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNURlO0FBQ007QUFDSjs7QUFFaEM7O0FBRUEsdUJBQXVCLCtDQUFNO0FBQzdCLGdDQUFnQyxrREFBUztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxnREFBTztBQUNYOztBQUVBLG1CQUFtQiwrQ0FBTTtBQUN6Qiw0QkFBNEIsa0RBQVM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0RBQU87OztBQUdYOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxnREFBTztBQUNuQjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhOztBQUViLENBQUM7O0FBRUQsaUVBQWU7Ozs7Ozs7Ozs7Ozs7O0FDOUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWU7Ozs7Ozs7Ozs7Ozs7O0FDOUJmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZTs7Ozs7O1VDcEJmO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0M7O0FBRWxDOztBQUVBO0FBQ0E7QUFDQSxRQUFRLGlEQUFRO0FBQ2hCLEtBQUs7QUFDTCxDQUFDLEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Rpc3BsYXkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1ib2FyZCcpO1xuY29uc3QgYWlDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWktYm9hcmQnKTtcblxuY29uc3QgZGlzcGxheSA9ICgoKSA9PiB7XG5cbiAgICBjb25zdCBjcmVhdGVHYW1lYm9hcmQgPSAocGFyZW50KSA9PiB7XG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAvLyAgICAgcGFyZW50LmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBmb3IobGV0IGsgPSAwOyBrIDwgMTAgOyBrKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgICAgICAgICAgICBzcXVhcmUuc2V0QXR0cmlidXRlKCdpZCcsYCR7an0sJHtrfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2hvd1BsYXllclNoaXBzID0gKGJvYXJkKSA9PiB7XG4gICAgICAgIGNvbnN0IHBsYXllclNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLWJvYXJkID4gZGl2Jyk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBmb3IobGV0IGsgPSAwOyBrIDwgMTAgOyBrKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9hcmQuZ3JpZFtqXVtrXSA9PT0gJ1gnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllclNxdWFyZXNbaV0uY2xhc3NMaXN0LmFkZCgncGxheWVyLXNoaXAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlUGxheWVyQm9hcmQgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgY3JlYXRlR2FtZWJvYXJkKHBsYXllckNvbnRhaW5lcik7XG4gICAgICAgIHNob3dQbGF5ZXJTaGlwcyhib2FyZCk7XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlQWlCb2FyZCA9IChib2FyZCkgPT4ge1xuICAgICAgICBjcmVhdGVHYW1lYm9hcmQoYWlDb250YWluZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHRha2VBdHRhY2sgPSAoY29vcmQsIGJvYXJkLCBkaXYpID0+IHtcbiAgICAgICAgaWYgKGJvYXJkLmluY2x1ZGVzQXJyYXkoYm9hcmQubWlzc2VkLCBjb29yZCkpIHtcbiAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyBjcmVhdGVQbGF5ZXJCb2FyZCwgY3JlYXRlQWlCb2FyZCwgdGFrZUF0dGFjayB9XG5cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGRpc3BsYXkiLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNsYXNzIEdhbWVib2FyZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ3JpZCA9IHRoaXMuY3JlYXRlR3JpZCgpO1xuICAgICAgICB0aGlzLnNoaXBzID0gW107XG4gICAgICAgIHRoaXMubWlzc2VkID0gW107XG4gICAgICAgIHRoaXMuYWxsU3Vua1N0YXR1cyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNyZWF0ZUdyaWQoKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSBuZXcgQXJyYXkoMTApO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGdyaWRbaV0gPSBuZXcgQXJyYXkoMTApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkO1xuICAgIH1cblxuICAgIHBsYWNlU2hpcChzaXplLCBhcnJPZkNvb3JkKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChzaXplKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJPZkNvb3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IGFyck9mQ29vcmRbaV07XG4gICAgICAgICAgICBzaGlwLmNvb3JkaW5hdGVzLnB1c2goY29vcmQpO1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gY29vcmRbMF07XG4gICAgICAgICAgICBjb25zdCBjb2wgPSBjb29yZFsxXTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFtyb3ddW2NvbF0gPSAnWCc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaGlwcy5wdXNoKHNoaXApO1xuICAgICAgICByZXR1cm4gc2hpcDtcbiAgICB9XG5cbiAgICBpbmNsdWRlc0FycmF5KGRhdGEsIGFycikge1xuICAgICAgICByZXR1cm4gZGF0YS5zb21lKGl0ZW0gPT4gQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtLmV2ZXJ5KChvLCBpKSA9PiBPYmplY3QuaXMoYXJyW2ldLCBvKSkpO1xuICAgIH07XG5cbiAgICByZWNlaXZlQXR0YWNrKGNvb3JkKSB7XG4gICAgICAgIC8vIGlmICh0aGlzLmluY2x1ZGVzQXJyYXkodGhpcy5taXNzZWQsIGNvb3JkKSkge1xuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG4gICAgICAgIGNvbnN0IHJvdyA9IGNvb3JkWzBdO1xuICAgICAgICBjb25zdCBjb2wgPSBjb29yZFsxXTtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZFtyb3ddW2NvbF0gPT09ICdYJyl7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0FycmF5KHRoaXMuc2hpcHNbaV0uY29vcmRpbmF0ZXMsIGNvb3JkKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoaXBzW2ldLmhpdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5ncmlkW3Jvd11bY29sXSkge1xuICAgICAgICAgICAgdGhpcy5taXNzZWQucHVzaChjb29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja0lmQWxsU3VuaygpO1xuICAgIH1cblxuICAgIGNoZWNrSWZBbGxTdW5rKCkge1xuICAgICAgICBpZiAodGhpcy5zaGlwcy5ldmVyeShpdGVtID0+IGl0ZW0uc3Vua1N0YXR1cyA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuYWxsU3Vua1N0YXR1cyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZCIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IGRpc3BsYXkgZnJvbSBcIi4vZGlzcGxheVwiO1xuXG5jb25zdCBnYW1lbG9vcCA9ICgoKSA9PiB7XG5cbiAgICBjb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKCdwbGF5ZXInKTtcbiAgICBjb25zdCBwbGF5ZXJHYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgcGxheWVyR2FtZWJvYXJkLnBsYWNlU2hpcCg1LCBbWzMsMl0sWzQsMl0sWzUsMl0sWzYsMl0sWzcsMl1dKTtcbiAgICBwbGF5ZXJHYW1lYm9hcmQucGxhY2VTaGlwKDQsIFtbMSw1XSxbMSw2XSxbMSw3XSxbMSw4XV0pO1xuICAgIHBsYXllckdhbWVib2FyZC5wbGFjZVNoaXAoMywgW1s1LDddLFs2LDddLFs3LDddXSk7XG4gICAgcGxheWVyR2FtZWJvYXJkLnBsYWNlU2hpcCgzLCBbWzksNV0sWzksNl0sWzksN11dKTtcbiAgICBwbGF5ZXJHYW1lYm9hcmQucGxhY2VTaGlwKDIsIFtbMCwwXSxbMCwxXV0pO1xuICAgIGRpc3BsYXkuY3JlYXRlUGxheWVyQm9hcmQocGxheWVyR2FtZWJvYXJkKTtcbiAgICBcblxuICAgIGNvbnN0IGFpID0gbmV3IFBsYXllcignYWknKTtcbiAgICBjb25zdCBhaUdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICBhaUdhbWVib2FyZC5wbGFjZVNoaXAoNSwgW1s1LDBdLFs2LDBdLFs3LDBdLFs4LDBdLFs5LDBdXSk7XG4gICAgYWlHYW1lYm9hcmQucGxhY2VTaGlwKDQsIFtbMyw0XSxbNCw0XSxbNSw0XSxbNiw0XV0pO1xuICAgIGFpR2FtZWJvYXJkLnBsYWNlU2hpcCgzLCBbWzQsNV0sWzUsNV0sWzYsNV1dKTtcbiAgICBhaUdhbWVib2FyZC5wbGFjZVNoaXAoMywgW1swLDVdLFswLDZdLFswLDddXSk7XG4gICAgYWlHYW1lYm9hcmQucGxhY2VTaGlwKDIsIFtbNSw4XSxbNSw5XV0pO1xuICAgIGRpc3BsYXkuY3JlYXRlQWlCb2FyZChhaUdhbWVib2FyZCk7XG5cblxuICAgIC8vIGZ1bmN0aW9ucyB0byBhZGQgc2hpcHNcblxuICAgIGxldCB0dXJuID0gJ3BsYXllcic7XG5cbiAgICBjb25zdCBwbGF5ID0gKGUpID0+IHtcbiAgICAgICAgaWYgKHR1cm4gPT09ICdwbGF5ZXInKSB7XG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IFtOdW1iZXIoZS50YXJnZXQuaWRbMF0pLCBOdW1iZXIoZS50YXJnZXQuaWRbMl0pXTtcbiAgICAgICAgICAgIHBsYXllci5hdHRhY2soY29vcmQsIGFpR2FtZWJvYXJkKTtcbiAgICAgICAgICAgIGRpc3BsYXkudGFrZUF0dGFjayhjb29yZCwgYWlHYW1lYm9hcmQsIGUudGFyZ2V0KTtcbiAgICAgICAgICAgIHR1cm4gPSAnYWknO1xuICAgICAgICB9IGVsc2UgaWYgKHR1cm4gPT09ICdhaScpIHtcbiAgICAgICAgICAgIC8vIGFpLnJhbmRvbUF0dGFjayhwbGF5ZXJHYW1lYm9hcmQpO1xuICAgICAgICAgICAgdHVybiA9ICdwbGF5ZXInO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcGxheSB9XG5cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVsb29wIiwiY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuaGl0cyA9IFtdO1xuICAgIH1cblxuICAgIGF0dGFjayhjb29yZCwgZ2FtZWJvYXJkKSB7XG4gICAgICAgIGlmIChnYW1lYm9hcmQuaW5jbHVkZXNBcnJheSh0aGlzLmhpdHMsIGNvb3JkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkKTtcbiAgICAgICAgdGhpcy5oaXRzLnB1c2goY29vcmQpO1xuICAgIH1cblxuICAgIHJhbmRvbUNvb3JkKCkge1xuICAgICAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgIGNvbnN0IGNvbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgcmV0dXJuIFtyb3csIGNvbF07XG4gICAgfVxuXG4gICAgcmFuZG9tQXR0YWNrKGdhbWVib2FyZCkge1xuICAgICAgICBsZXQgcmFuZG9tQ29vcmQgPSB0aGlzLnJhbmRvbUNvb3JkKCk7XG4gICAgICAgIHdoaWxlIChnYW1lYm9hcmQuaW5jbHVkZXNBcnJheSh0aGlzLmhpdHMsIHJhbmRvbUNvb3JkKSkge1xuICAgICAgICAgICAgcmFuZG9tQ29vcmQgPSB0aGlzLnJhbmRvbUNvb3JkKCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2socmFuZG9tQ29vcmQpO1xuICAgICAgICB0aGlzLmhpdHMucHVzaChyYW5kb21Db29yZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXIiLCJjbGFzcyBTaGlwIHtcbiAgICBjb25zdHJ1Y3RvcihzaXplKSB7XG4gICAgICAgIHRoaXMuc2hpcFNpemUgPSBzaXplO1xuICAgICAgICB0aGlzLmhpdENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5zdW5rU3RhdHVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbXTtcbiAgICB9XG5cbiAgICBoaXQoKSB7XG4gICAgICAgIHRoaXMuaGl0Q291bnQgKz0gMTtcbiAgICAgICAgdGhpcy5pc1N1bmsoKTtcbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnNoaXBTaXplID09PSB0aGlzLmhpdENvdW50KSB7XG4gICAgICAgICAgICB0aGlzLnN1bmtTdGF0dXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZ2FtZWxvb3AgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxuY29uc3QgYWlTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFpLWJvYXJkID4gZGl2Jyk7XG5cbmFpU3F1YXJlcy5mb3JFYWNoKChhaVNxdWFyZSkgPT4ge1xuICAgIGFpU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZ2FtZWxvb3AucGxheShlKTtcbiAgICB9KTtcbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==