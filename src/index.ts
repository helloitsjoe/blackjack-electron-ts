import Game from './Game';

const game = new Game();
const playButton = document.getElementById('play-button');
const infoBox = document.getElementById('info-box');

if (playButton) {
    playButton.addEventListener('click', onPlayClick);
    
    game.initDealer();
} else {
    game.initPlayer();
}

function onPlayClick() {
    playButton.classList.add('hidden');
    infoBox.classList.remove('hidden');
    game.play();
}