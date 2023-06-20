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

export { displayPlayerBoard, displayAiBoard }