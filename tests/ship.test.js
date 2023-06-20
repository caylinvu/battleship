import Ship from "../src/ship";

test('constructor creates ship with correct length', () => {
    const testShip = new Ship(4);
    expect(testShip.shipSize).toBe(4);
});

test('hit() adds to hitCount', () => {
    const testShip = new Ship(5);
    testShip.hit();
    expect(testShip.hitCount).toBe(1);
});

test('isSunk() changes the value of sunkStatus to true if ship is sunk', () => {
    const testShip = new Ship(2);
    testShip.hit();
    testShip.hit();
    testShip.isSunk();
    expect(testShip.sunkStatus).toBe(true);
});