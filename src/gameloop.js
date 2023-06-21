import Player from "./player";
import Gameboard from "./gameboard";
import display from "./display";

const gameloop = (() => {

    const player = new Player('player');
    const playerGameboard = new Gameboard();
    playerGameboard.placeShip(5, [[3,2],[4,2],[5,2],[6,2],[7,2]]);
    playerGameboard.placeShip(4, [[1,5],[1,6],[1,7],[1,8]]);
    playerGameboard.placeShip(3, [[5,7],[6,7],[7,7]]);
    playerGameboard.placeShip(3, [[9,5],[9,6],[9,7]]);
    playerGameboard.placeShip(2, [[0,0],[0,1]]);
    display.createPlayerBoard(playerGameboard);
    

    const ai = new Player('ai');
    const aiGameboard = new Gameboard();
    aiGameboard.placeShip(5, [[5,0],[6,0],[7,0],[8,0],[9,0]]);
    aiGameboard.placeShip(4, [[3,4],[4,4],[5,4],[6,4]]);
    aiGameboard.placeShip(3, [[4,5],[5,5],[6,5]]);
    aiGameboard.placeShip(3, [[0,5],[0,6],[0,7]]);
    aiGameboard.placeShip(2, [[5,8],[5,9]]);
    display.createAiBoard(aiGameboard);


    // functions to add ships

    let turn = 'player';
    let winner = '';

    const checkWinner = (playerBoard, aiBoard) => {
        if (playerBoard.allSunkStatus) {
            console.log('ai wins!!!');
            winner = 'ai';
        }
        if (aiBoard.allSunkStatus) {
            console.log('player wins!!!');
            winner = 'player';
        }
    }

    const play = (e) => {
        if (winner) {
            return;
        }
        
        if (turn === 'player') {
            const coord = [Number(e.target.id[0]), Number(e.target.id[2])];
            player.attack(coord, aiGameboard);
            display.takeAttack(coord, aiGameboard, e.target);
            turn = 'ai';
        } else if (turn === 'ai') {
            const coord = ai.randomAttack(playerGameboard);
            const playerSquares = document.querySelectorAll('.player-board > div');
            playerSquares.forEach((playerSquare) => {
                const idCoord = [Number(playerSquare.id[0]), Number(playerSquare.id[2])];
                if (idCoord[0] === coord[0] && idCoord[1] === coord[1]) {
                    display.takeAttack(coord, playerGameboard, playerSquare);
                }
            });
            turn = 'player';
        }

        checkWinner(playerGameboard, aiGameboard);
    }

    return { play, winner }

})();

export default gameloop