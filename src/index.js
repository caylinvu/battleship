import gameloop from "./gameloop";

const aiSquares = document.querySelectorAll('.ai-board > div');
const playAgainBtn = document.querySelector('.play-again-btn');

aiSquares.forEach((aiSquare) => {
    aiSquare.addEventListener('click', (e) => {
        gameloop.play(e);
        gameloop.play(e);
    });
});

// playAgainBtn.addEventListener('click', gameloop.playAgain);