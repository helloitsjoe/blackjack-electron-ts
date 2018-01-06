import Game from './Game';

const game = new Game();
const playButton = document.getElementById('playBtn');

if (playButton) {
    playButton.addEventListener('click', onPlayClick);
    
    game.initDealer();
} else {
    game.initPlayer();
}

function onPlayClick() {
    playButton.style.visibility = 'hidden';
    game.play();
}