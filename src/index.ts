import Game from './Game';

const game = new Game();

const playButton = document.getElementById('playBtn');
if (playButton) {
    playButton.addEventListener('click', () => {
        playButton.style.visibility = 'hidden';
        game.play();
    });
    
    game.initDealer();
} else {
    game.initPlayer();
}
