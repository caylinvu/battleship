const playerContainer = document.querySelector('.player-board');
const aiContainer = document.querySelector('.ai-board');

const display = (() => {

    const createGameboard = (parent) => {
        for (let i = 0; i < 100; i++) {
            const square = document.createElement('div');
            parent.appendChild(square);
        }
    }

    const playerBoard = (board) => {
        createGameboard(playerContainer);
        const squares = document.querySelectorAll('.player-board > div');

        let i = 0;
        for (let j = 0; j < 10; j++) {
            for(let k = 0; k < 10 ; k++) {
                if (board.grid[j][k] === 'X') {
                    squares[i].classList.add('player-ship');
                }
                i++;
            }
        }
    
    }

    const aiBoard = (board) => {
        createGameboard(aiContainer);
    }

    return { playerBoard, aiBoard }

})();

export default display