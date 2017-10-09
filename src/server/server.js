const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const express = require('express');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../../')));
app.use(express.static(path.join(__dirname, '../player')));

const GAME_PORT = 8080;
const WSS_PORT = 8081;

const wsServer = new WebSocket.Server({ port: WSS_PORT });
app.listen(GAME_PORT, () => {
    console.log(`listening on ${GAME_PORT} for new game`);
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});
app.get('/player', (req, res) => {
    res.sendFile(path.join(__dirname, '../player/index.html'));
});

let connections = [];

wsServer.on('connection', (ws) => {
    ws.on('message', onMessage.bind(null, ws));
    ws.on('close', onClose.bind(null, ws));
    
    console.log('new connex bruh');
    connections.push(ws);
    ws.send(JSON.stringify({totalPlayers: connections.length}));
});

function onMessage(ws, data) {
    let json = JSON.parse(data);
    console.log('msg:', json.msg, 'from', json.id);
}

function onClose(ws) {
    let i;
    for (i = 0; i < connections.length; i++) {
        if (connections[i] === ws) {
            console.log('closed', i);
            break;
        }
    }
    connections.splice(i, 1);
}