import { Game } from './Game';
import * as WebSocket from 'ws';

const game = new Game();
const testDOM = document.getElementById('test-dom');
const playButton = document.getElementById('play-button');
const infoBox = document.getElementById('info-box');

const HOST = 'localhost';
const WSS_PORT = 8081;

if (testDOM) {
    // NoOp
} else if (playButton) {
    playButton.addEventListener('click', onPlayClick);
    const wsServer = new WebSocket.Server({ port: WSS_PORT });
    console.log(`Dealer: ws server listening on port ${WSS_PORT}`);

    game.initDealer(wsServer);
} else {
    console.log('Player, setting up ws client');
    const ws: any = new WebSocket(`ws://${HOST}:${WSS_PORT}`);

    game.initPlayer(ws);
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