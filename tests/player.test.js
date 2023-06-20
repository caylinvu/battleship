import Player from "../src/player";
import Gameboard from "../src/gameboard";

test('constructor creates a player', () => {
    const testPlayer = new Player('player');
    expect(testPlayer).toEqual({name: 'player', hits: []});
});

test('player attacks', () => {
    const enemyGameboard = new Gameboard();
    const testPlayer = new Player('player');
    enemyGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    testPlayer.attack([3, 2], enemyGameboard);
    expect(enemyGameboard.ships[0].hitCount).toBe(1);
});

test('randomly attacks', () => {
    const enemyGameboard = new Gameboard();
    const testPlayer = new Player('player');
    enemyGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    enemyGameboard.placeShip(4, [[1,5],[1,6],[1,7],[1,8]]);
    for (let i = 0; i < 100; i++) {
        testPlayer.randomAttack(enemyGameboard);
    }
    expect(enemyGameboard.allSunkStatus).toBe(true);
});