import path = require('path');
import httpServer = require('http-server');
// import express = require('express');
import WebSocket from 'ws';

export default class Server {
    
    private connections: WebSocket[] = [];
    
    constructor() {
        
    }
    
    public start() {
        // const app = express();
        const server = httpServer.createServer({root:path.join(__dirname, '../../')});
        server.listen(8080, () => {
            console.log('listening');
        });
        const wsServer = new WebSocket.Server({ port: 8081 });

        // app.use(express.static(path.join(__dirname, '../../')));

        wsServer.on('connection', (ws) => {
            ws.on('message', this.onMessage.bind(null, ws));
            ws.on('close', this.onClose.bind(null, ws));
            
            console.log('new connex bruh');
            this.connections.push(ws);
            ws.send(JSON.stringify({totalPlayers: this.connections.length}));
        });
        
        return this;
    }
    
    private onMessage(ws, data) {
        let json = JSON.parse(data);
        console.log('msg:', json.msg, 'from', json.id);
    }
    
    private onClose(ws) {
        let i;
        for (i = 0; i < this.connections.length; i++) {
            if (this.connections[i] === ws) {
                console.log('closed', i);
                break;
            }
        }
        this.connections.splice(i, 1);
    }
}