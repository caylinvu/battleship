import Gameboard from "../src/gameboard";

test('places ship at coordinates', () => {
    let testGameboard = new Gameboard();
    testGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    expect(testGameboard.grid[3][2]).toEqual('X');
});