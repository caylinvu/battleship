import Gameboard from "../src/gameboard";

test('constructor creates 10x10 gameboard', () => {
    let testGameboard = new Gameboard();
    expect(testGameboard.grid).toEqual(new Array(10 * 10));
});