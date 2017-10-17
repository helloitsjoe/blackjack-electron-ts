import Game from './Game';

const game = new Game();
game.init();

const playButton = document.getElementById('playBtn');
if (playButton) {
    playButton.addEventListener('click', () => {
        playButton.style.visibility = 'hidden';
        game.play();
    });
}
