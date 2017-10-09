const ws = new WebSocket('ws://localhost:8081');

ws.addEventListener('open', (msg) => {
    console.log(msg)
    ws.send(JSON.stringify({msg: 'hi'}));
    console.log('player connected');
});
ws.addEventListener('message', (msg) => {
    console.log(JSON.parse(msg.data));
});
