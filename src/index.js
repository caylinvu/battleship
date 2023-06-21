import gameloop from "./gameloop";

const aiSquares = document.querySelectorAll('.ai-board > div');

aiSquares.forEach((aiSquare) => {
    aiSquare.addEventListener('click', (e) => {
        gameloop.play(e);
        console.log(gameloop.winner);
        if (!gameloop.winner) {
            gameloop.play(e);
        }
    });
});