const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, '../../')));

const GAME_PORT = 8080;

app.listen(GAME_PORT, () => {
    console.log(`listening on ${GAME_PORT} for new game`);
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});
app.get('/player', (req, res) => {
    res.sendFile(path.join(__dirname, '../../player.html'));
});