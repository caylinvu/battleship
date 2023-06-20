import Ship from "./ship";

class Gameboard {
    constructor() {
        this.grid = this.createGrid();
    }

    createGrid() {
        const grid = new Array(10);
        for (let i = 0; i < grid.length; i++) {
            grid[i] = new Array(10);
        }
        return grid;
    }

    placeShip(size, arrOfCoord) {
        const ship = new Ship(size);
        for (let i = 0; i < arrOfCoord.length; i++) {
            const coord = arrOfCoord[i];
            const row = coord[0];
            const col = coord[1];
            this.grid[row][col] = 'X';
        }
    }
}

export default Gameboard