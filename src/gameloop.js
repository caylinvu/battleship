import Player from "./player";
import Gameboard from "./gameboard";
import display from "./display";

const winnerPopup = document.querySelector('.winner-popup');
const winnerText = document.querySelector('.winner-text');
const placementPopup = document.querySelector('.place-ships-popup');

const gameloop = (() => {

    const player = new Player('player');
    const playerGameboard = new Gameboard();
    display.createPlayerBoard(playerGameboard);
    

    const ai = new Player('ai');
    const aiGameboard = new Gameboard();
    display.createAiBoard(aiGameboard, ai);

    let turn = 'player';
    let winner = '';

    const checkWinner = (playerBoard, aiBoard) => {
        if (playerBoard.allSunkStatus) {
            winner = 'ai';
            winnerPopup.style.display = 'block';
            winnerText.textContent = 'The computer wins!';
        }
        if (aiBoard.allSunkStatus) {
            winner = 'player';
            winnerPopup.style.display = 'block';
            winnerText.textContent = 'Congrats, you win!';
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

    // const playAgain = () => {
    //     window.player = null;
    //     delete window.player;
    //     window.playerGameboard = null;
    //     delete window.playerGameboard;
    //     window.ai = null;
    //     delete window.ai;
    //     window.aiGameboard = null;
    //     delete window.aiGameboard;
    //     display.removeDivs();

    //     player = new Player('player');
    //     console.log(player);
    //     playerGameboard = new Gameboard();
    //     console.log(playerGameboard);
    //     display.createPlayerBoard(playerGameboard);

    //     ai = new Player('ai');
    //     console.log(ai);
    //     aiGameboard = new Gameboard();
    //     console.log(aiGameboard);
    //     display.createAiBoard(aiGameboard, ai);

    //     turn = 'player';
    //     winner = '';

    //     winnerPopup.style.display = 'none';
    //     placementPopup.style.display = 'block';
    // }

    return { play, winner }

})();

export default gameloop