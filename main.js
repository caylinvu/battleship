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
/* harmony export */   displayAiBoard: () => (/* binding */ displayAiBoard),
/* harmony export */   displayPlayerBoard: () => (/* binding */ displayPlayerBoard)
/* harmony export */ });
const playerContainer = document.querySelector('.player-board');
const aiContainer = document.querySelector('.ai-board');

function createGameboard(parent) {
    for (let i = 0; i < 100; i++) {
        const square = document.createElement('div');
        parent.appendChild(square);
    }
}

function displayPlayerBoard(board) {
    createGameboard(playerContainer);
}

function displayAiBoard(board) {
    createGameboard(aiContainer);
}



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
    

    const ai = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]('ai');
    const aiGameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
    aiGameboard.placeShip(5, [[5,0],[6,0],[7,0],[8,0],[9,0]]);
    aiGameboard.placeShip(4, [[3,4],[4,4],[5,4],[6,4]]);
    aiGameboard.placeShip(3, [[4,5],[5,5],[6,5]]);
    aiGameboard.placeShip(3, [[0,5],[0,6],[0,7]]);
    aiGameboard.placeShip(2, [[5,8],[5,9]]);

    // functions to add ships

    (0,_display__WEBPACK_IMPORTED_MODULE_2__.displayPlayerBoard)();
    (0,_display__WEBPACK_IMPORTED_MODULE_2__.displayAiBoard)();

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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQjBCOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5Qiw2Q0FBSTtBQUM3Qix3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsdUJBQXVCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1RGU7QUFDTTtBQUMyQjs7QUFFL0Q7O0FBRUEsdUJBQXVCLCtDQUFNO0FBQzdCLGdDQUFnQyxrREFBUztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLCtDQUFNO0FBQ3pCLDRCQUE0QixrREFBUztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLElBQUksNERBQWtCO0FBQ3RCLElBQUksd0RBQWM7O0FBRWxCLENBQUM7Ozs7Ozs7OztBQVNELGlFQUFlOzs7Ozs7Ozs7Ozs7OztBQ3JDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlOzs7Ozs7Ozs7Ozs7OztBQzlCZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWU7Ozs7OztVQ3BCZjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZGlzcGxheS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVsb29wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWJvYXJkJyk7XG5jb25zdCBhaUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5haS1ib2FyZCcpO1xuXG5mdW5jdGlvbiBjcmVhdGVHYW1lYm9hcmQocGFyZW50KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5UGxheWVyQm9hcmQoYm9hcmQpIHtcbiAgICBjcmVhdGVHYW1lYm9hcmQocGxheWVyQ29udGFpbmVyKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheUFpQm9hcmQoYm9hcmQpIHtcbiAgICBjcmVhdGVHYW1lYm9hcmQoYWlDb250YWluZXIpO1xufVxuXG5leHBvcnQgeyBkaXNwbGF5UGxheWVyQm9hcmQsIGRpc3BsYXlBaUJvYXJkIH0iLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNsYXNzIEdhbWVib2FyZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ3JpZCA9IHRoaXMuY3JlYXRlR3JpZCgpO1xuICAgICAgICB0aGlzLnNoaXBzID0gW107XG4gICAgICAgIHRoaXMubWlzc2VkID0gW107XG4gICAgICAgIHRoaXMuYWxsU3Vua1N0YXR1cyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNyZWF0ZUdyaWQoKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSBuZXcgQXJyYXkoMTApO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGdyaWRbaV0gPSBuZXcgQXJyYXkoMTApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkO1xuICAgIH1cblxuICAgIHBsYWNlU2hpcChzaXplLCBhcnJPZkNvb3JkKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChzaXplKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJPZkNvb3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IGFyck9mQ29vcmRbaV07XG4gICAgICAgICAgICBzaGlwLmNvb3JkaW5hdGVzLnB1c2goY29vcmQpO1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gY29vcmRbMF07XG4gICAgICAgICAgICBjb25zdCBjb2wgPSBjb29yZFsxXTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFtyb3ddW2NvbF0gPSAnWCc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaGlwcy5wdXNoKHNoaXApO1xuICAgICAgICByZXR1cm4gc2hpcDtcbiAgICB9XG5cbiAgICBpbmNsdWRlc0FycmF5KGRhdGEsIGFycikge1xuICAgICAgICByZXR1cm4gZGF0YS5zb21lKGl0ZW0gPT4gQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtLmV2ZXJ5KChvLCBpKSA9PiBPYmplY3QuaXMoYXJyW2ldLCBvKSkpO1xuICAgIH07XG5cbiAgICByZWNlaXZlQXR0YWNrKGNvb3JkKSB7XG4gICAgICAgIC8vIGlmICh0aGlzLmluY2x1ZGVzQXJyYXkodGhpcy5taXNzZWQsIGNvb3JkKSkge1xuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG4gICAgICAgIGNvbnN0IHJvdyA9IGNvb3JkWzBdO1xuICAgICAgICBjb25zdCBjb2wgPSBjb29yZFsxXTtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZFtyb3ddW2NvbF0gPT09ICdYJyl7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0FycmF5KHRoaXMuc2hpcHNbaV0uY29vcmRpbmF0ZXMsIGNvb3JkKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoaXBzW2ldLmhpdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5ncmlkW3Jvd11bY29sXSkge1xuICAgICAgICAgICAgdGhpcy5taXNzZWQucHVzaChjb29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja0lmQWxsU3VuaygpO1xuICAgIH1cblxuICAgIGNoZWNrSWZBbGxTdW5rKCkge1xuICAgICAgICBpZiAodGhpcy5zaGlwcy5ldmVyeShpdGVtID0+IGl0ZW0uc3Vua1N0YXR1cyA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuYWxsU3Vua1N0YXR1cyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZCIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IHsgZGlzcGxheVBsYXllckJvYXJkLCBkaXNwbGF5QWlCb2FyZCB9IGZyb20gXCIuL2Rpc3BsYXlcIjtcblxuY29uc3QgZ2FtZWxvb3AgPSAoKCkgPT4ge1xuXG4gICAgY29uc3QgcGxheWVyID0gbmV3IFBsYXllcigncGxheWVyJyk7XG4gICAgY29uc3QgcGxheWVyR2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIHBsYXllckdhbWVib2FyZC5wbGFjZVNoaXAoNSwgW1szLDJdLFs0LDJdLFs1LDJdLFs2LDJdLFs3LDJdXSk7XG4gICAgcGxheWVyR2FtZWJvYXJkLnBsYWNlU2hpcCg0LCBbWzEsNV0sWzEsNl0sWzEsN10sWzEsOF1dKTtcbiAgICBwbGF5ZXJHYW1lYm9hcmQucGxhY2VTaGlwKDMsIFtbNSw3XSxbNiw3XSxbNyw3XV0pO1xuICAgIHBsYXllckdhbWVib2FyZC5wbGFjZVNoaXAoMywgW1s5LDVdLFs5LDZdLFs5LDddXSk7XG4gICAgcGxheWVyR2FtZWJvYXJkLnBsYWNlU2hpcCgyLCBbWzAsMF0sWzAsMV1dKTtcbiAgICBcblxuICAgIGNvbnN0IGFpID0gbmV3IFBsYXllcignYWknKTtcbiAgICBjb25zdCBhaUdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICBhaUdhbWVib2FyZC5wbGFjZVNoaXAoNSwgW1s1LDBdLFs2LDBdLFs3LDBdLFs4LDBdLFs5LDBdXSk7XG4gICAgYWlHYW1lYm9hcmQucGxhY2VTaGlwKDQsIFtbMyw0XSxbNCw0XSxbNSw0XSxbNiw0XV0pO1xuICAgIGFpR2FtZWJvYXJkLnBsYWNlU2hpcCgzLCBbWzQsNV0sWzUsNV0sWzYsNV1dKTtcbiAgICBhaUdhbWVib2FyZC5wbGFjZVNoaXAoMywgW1swLDVdLFswLDZdLFswLDddXSk7XG4gICAgYWlHYW1lYm9hcmQucGxhY2VTaGlwKDIsIFtbNSw4XSxbNSw5XV0pO1xuXG4gICAgLy8gZnVuY3Rpb25zIHRvIGFkZCBzaGlwc1xuXG4gICAgZGlzcGxheVBsYXllckJvYXJkKCk7XG4gICAgZGlzcGxheUFpQm9hcmQoKTtcblxufSkoKTtcblxuXG5cblxuXG5cblxuXG5leHBvcnQgZGVmYXVsdCBnYW1lbG9vcCIsImNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmhpdHMgPSBbXTtcbiAgICB9XG5cbiAgICBhdHRhY2soY29vcmQsIGdhbWVib2FyZCkge1xuICAgICAgICBpZiAoZ2FtZWJvYXJkLmluY2x1ZGVzQXJyYXkodGhpcy5oaXRzLCBjb29yZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZCk7XG4gICAgICAgIHRoaXMuaGl0cy5wdXNoKGNvb3JkKTtcbiAgICB9XG5cbiAgICByYW5kb21Db29yZCgpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICBjb25zdCBjb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgIHJldHVybiBbcm93LCBjb2xdO1xuICAgIH1cblxuICAgIHJhbmRvbUF0dGFjayhnYW1lYm9hcmQpIHtcbiAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gdGhpcy5yYW5kb21Db29yZCgpO1xuICAgICAgICB3aGlsZSAoZ2FtZWJvYXJkLmluY2x1ZGVzQXJyYXkodGhpcy5oaXRzLCByYW5kb21Db29yZCkpIHtcbiAgICAgICAgICAgIHJhbmRvbUNvb3JkID0gdGhpcy5yYW5kb21Db29yZCgpO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHJhbmRvbUNvb3JkKTtcbiAgICAgICAgdGhpcy5oaXRzLnB1c2gocmFuZG9tQ29vcmQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyIiwiY2xhc3MgU2hpcCB7XG4gICAgY29uc3RydWN0b3Ioc2l6ZSkge1xuICAgICAgICB0aGlzLnNoaXBTaXplID0gc2l6ZTtcbiAgICAgICAgdGhpcy5oaXRDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3Vua1N0YXR1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzID0gW107XG4gICAgfVxuXG4gICAgaGl0KCkge1xuICAgICAgICB0aGlzLmhpdENvdW50ICs9IDE7XG4gICAgICAgIHRoaXMuaXNTdW5rKCk7XG4gICAgfVxuXG4gICAgaXNTdW5rKCkge1xuICAgICAgICBpZiAodGhpcy5zaGlwU2l6ZSA9PT0gdGhpcy5oaXRDb3VudCkge1xuICAgICAgICAgICAgdGhpcy5zdW5rU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcCIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWVsb29wIGZyb20gXCIuL2dhbWVsb29wXCI7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9