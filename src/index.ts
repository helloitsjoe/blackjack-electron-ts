import Game from './Game';
import WSClient from './WSClient';

const wsClient = new WSClient('localhost', 8080);
const game = new Game(wsClient.ws);

game.play();
