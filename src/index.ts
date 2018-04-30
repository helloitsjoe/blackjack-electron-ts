import { Game } from './Game';
import * as WS from 'ws';
// import * as localtunnel from 'localtunnel';

const game = new Game();
const testDOM = document.getElementById('test-dom');
const dealButton = document.getElementById('deal-button');
const infoBox = document.getElementById('info-box');

// TODO: localtunnel... in meantime, use IP address
const HOST = window.location.hostname || 'localhost';
const WSS_PORT = 8081;

if (testDOM) {
    // NoOp
} else if (dealButton) {
    dealButton.addEventListener('click', onPlayClick);
    const wsServer = new WS.Server({ port: WSS_PORT });
    console.log(`Dealer: ws server listening on port ${WSS_PORT}`);

    const tryTunnel = (subdomain) => {
        // // TODO: Display "Loading..."
        // localtunnel(8081, { subdomain }, (err, tunnel) => {
        //     if (err) {
        //         console.error(err);
        //     }
        //     console.log(`tunnel:`, tunnel.url);
        //     if (tunnel.url !== `https://${subdomain}.localtunnel.me`) {
        //         tryTunnel(subdomain);
        //     } else {
        //         // TODO: Clear "Loading..."
                game.init(wsServer);
        //     }
        // });
    }

    tryTunnel('blackjack');

} else {
    console.log('Player, setting up ws client');
    // Need to use web API WebSocket (not ws) to avoid CORS issues
    const ws = new WebSocket(`ws://${HOST}:${WSS_PORT}`);
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