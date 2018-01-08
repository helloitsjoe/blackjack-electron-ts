const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { document } = (new JSDOM(`<!doctype html><html><body><div id="play-button"></div></body></html>`)).window;

global.document = document;
global.window = document.defaultView;

Object.keys(window).forEach(key => {
    if (!(key in global)) {
        global[key] = window[key];
    }
});