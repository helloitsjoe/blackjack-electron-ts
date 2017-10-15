import Game from './Game';

const game = new Game();

const playButton = document.getElementById('playBtn');
playButton.addEventListener('click', () => {
    playButton.style.visibility = 'hidden';
    game.play();
});
