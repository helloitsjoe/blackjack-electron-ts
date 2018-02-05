import { Game } from './Game';
import * as WS from 'ws';
// const localtunnel = require('localtunnel');

const game = new Game();
const testDOM = document.getElementById('test-dom');
const dealButton = document.getElementById('deal-button');
const infoBox = document.getElementById('info-box');

const HOST = 'localhost';
// TOSO: Make HOST dynamic using localtunnel
// In meantime, use computer's IP address
// const HOST = '192.168.0.106';
const WSS_PORT = 8081;

if (testDOM) {
    // NoOp
} else if (dealButton) {
    dealButton.addEventListener('click', onPlayClick);
    const wsServer = new WS.Server({ port: WSS_PORT });
    console.log(`Dealer: ws server listening on port ${WSS_PORT}`);

    // // TODO: Display "Loading..."

    // localtunnel(8081, {subdomain: 'blackjack'}, (err, tunnel) => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     // TODO: Clear "Loading..."
    //     console.log(`tunnel:`, tunnel.url);
        game.initDealer(wsServer);
    // });

} else {
    console.log('Player, setting up ws client');
    // Need to use web API WebSocket (not ws) to avoid CORS issues
    const ws: any = new WebSocket(`ws://${HOST}:${WSS_PORT}`);
    // const ws: any = new WebSocket(`ws://blackjack.localtunnel.me`);
    game.initPlayer(ws);
}

function onPlayClick() {
    dealButton.classList.add('hidden');
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