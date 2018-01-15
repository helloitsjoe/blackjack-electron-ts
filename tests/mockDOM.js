const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { document } = (new JSDOM(`
<!doctype html>
<html>
<body>
    <div id="test-dom"></div>
    <div class="container" id="dealer">
        <h1>Blackjack!</h1>
        <button id="play-button">Play</button>
        <div id="dealer-box">
            <div id="card-box">
            
            </div>
            <div id="button-box" style="display: none">
                <button id="hit-button">Hit</button>
                <button id="stay-button">Stay</button>
            </div>
            <div id="info-box" class="hidden">
                <span id="label">Dealer:</span>
                <span id="score"></span>
            </div>
        </div>
    </div>
    <div class="hidden" id="end-state"></div>
</body>
</html>`)).window;

global.document = document;
global.window = document.defaultView;

Object.keys(window).forEach(key => {
    if (!(key in global)) {
        global[key] = window[key];
    }
});