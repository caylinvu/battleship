import gameloop from "./gameloop";

let aiSquares = document.querySelectorAll('.ai-board > div');
const playAgainBtn = document.querySelector('.play-again-btn');

playAgainBtn.addEventListener('click', () => {
    gameloop.playAgain();
    aiSquares = document.querySelectorAll('.ai-board > div');
    aiSquares.forEach((aiSquare) => {
        aiSquare.addEventListener('click', (e) => {
            gameloop.play(e);
            gameloop.play(e);
        });
    });
});

aiSquares.forEach((aiSquare) => {
    aiSquare.addEventListener('click', (e) => {
        gameloop.play(e);
        gameloop.play(e);
    });
});

// make button click nicer

// clean up code