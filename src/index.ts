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

export * from './Dealer';
export * from './DealerGUI';
export * from './Deck';
export * from './Game';
export * from './Player';
export * from './PlayerGUI';
export * from './WSClient';
export * from './WSServer';