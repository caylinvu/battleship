import Gameboard from "../src/gameboard";

test('places ship at coordinates', () => {
    let testGameboard = new Gameboard();
    testGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    expect(testGameboard.grid[3][2]).toEqual('X');
});

test('pushes coordinates to ship object', () => {
    let testGameboard = new Gameboard();
    let testShip = testGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    expect(testShip.coordinates).toEqual([[3,2],[4,2],[5,2],[6,2],[7,2]]);
});

test('pushes ship to gameboard object', () => {
    let testGameboard = new Gameboard();
    testGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    expect(testGameboard.ships).toEqual([{
        shipSize: 5,
        hitCount: 0,
        sunkStatus: false,
        coordinates: [[3,2],[4,2],[5,2],[6,2],[7,2]]
    }]);
});

test('hits the correct ship', () => {
    let testGameboard = new Gameboard();
    testGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    testGameboard.receiveAttack([3,2]);
    expect(testGameboard.ships[0].hitCount).toBe(1);
});

test('records coordinates of missed shot', () => {
    let testGameboard = new Gameboard();
    testGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    testGameboard.receiveAttack([3,3]);
    expect(testGameboard.missed).toEqual([[3,3]]);
});

test('allSunkStatus changes to true if all ships are sunk', () => {
    let testGameboard = new Gameboard();
    testGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    testGameboard.placeShip(4, [[1,5],[1,6],[1,7],[1,8]]);
    for (let i = 0; i < testGameboard.ships.length; i++) {
        for (let j = 0; j < testGameboard.ships[i].shipSize; j++) {
            testGameboard.ships[i].hit();
        }
    }
    testGameboard.checkIfAllSunk();
    expect(testGameboard.allSunkStatus).toBe(true);
});