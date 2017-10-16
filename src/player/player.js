const ws = new WebSocket('ws://localhost:8081');

const hitButton = document.getElementById('hit-button');
hitButton.addEventListener('click', () => {
    console.log('hit from', ws.id)
    ws.send(JSON.stringify({msg: 'HitMe', id: ws.id}));
});

ws.addEventListener('open', (msg) => {
    // console.log(msg)
    ws.send(JSON.stringify({msg: 'new player'}));
    console.log('player connected');
});
ws.addEventListener('message', (msg) => {
    const data = JSON.parse(msg.data);
    
    ws.id = data.id;
    
    console.log(data);
    if (data.msg === 'Hit') {
        console.log('hit pingback')
        addCard(data.card);
    }
});

function addCard(card) {
    const cardBox = document.getElementById('card-box');
    cardBox.innerHTML +=`<div class="card">${card.display}</div>`
}