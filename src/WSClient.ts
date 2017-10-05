export default class WSClient {
    
    public ws: any;
    
    constructor(host: string, port: number) {
        this.ws = new WebSocket(`ws://${host}:${port}`);
        this.ws.hit = this.hit.bind(this);
        this.ws.endTurn = this.endTurn.bind(this);
        this.ws.addEventListener('open', this.onOpen.bind(this));
        this.ws.addEventListener('close', this.onClose.bind(this));
        this.ws.addEventListener('message', this.onMessage.bind(this));
    }
    
    hit(position) {
        const data = JSON.stringify({ msg: 'Hit', id: position });
        this.ws.send(data);
    }
    
    endTurn(position) {
        const data = JSON.stringify({ msg: 'End Turn', id: position });
        this.ws.send(data);
    }
    
    onOpen() {
        
    }
    
    onClose() {
        
    }
    
    onMessage() {
        
    }
}