const path = require('path');
const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });

const PORT = 8080;

let connections = [];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../')));

server.listen(PORT, () => {
    console.log('poop');
});

wsServer.on('connection', (ws) => {
    ws.on('message', onMessage.bind(null, ws));
    ws.on('close', onClose.bind(null, ws));
    
    connections.push(ws);
    console.log('new connex bruh');
});

function onMessage(ws, data) {
    let json = JSON.parse(data);
    console.log('msg:', json.msg, 'from', json.id);
}

function onClose(ws, data) {
    let json = JSON.parse(data);
    console.log('closed', json.id);
}