 /*jshint -W027 */

///
const RUN_IN_FRAMES = 1;


var style = document.createElement('style');
//style.textContent = `body { background: #181a1b; }`;
style.textContent = `body { background: red; }`;
//document.documentElement.prepend(style);


window.logMark = window == top 
    ? (...args) => performance.mark(...args) 
    : () => {};


//window.console = { log() {}, error() {} };

/// Note: rn this is duplicated with inj_frame.js because of Edge bug
function blz_chrome_runtime_onMessage_addListener(callback) {
    chrome.runtime.onMessage.addListener((msg, sender) => {
        if (msg.senderFrameURL && document.URL != msg.senderFrameURL)
            return;
        callback(msg, sender);
    });
}

blz_chrome_runtime_onMessage_addListener(({type, data, error}) => {
    if (type && type == 'bg-fetch-response') {
        data = 'DATA:URL; -> ' + data.length;
    }
    if ('blz-init-ack' == type) {
        logMark('BLZ_test_msg_noop');
    }
    console.log(window == top ? 'top' : 'frame', type, data, error);
});


///


(function inj_index() {///
    "use strict";
    
    ///
    if (document.URL === 'about:blank') return; 
    if (window != top && !document.documentElement.offsetWidth) {
        if ('loading' == document.readyState) {
            window.addEventListener('DOMContentLoaded', inj_index);
            console.log('inj wait for contentLoaded', document.URL);
        } else {
          
        }
        return console.log('inj return', document.URL, document.documentElement.offsetWidth);
    }
    console.log("hi from inject", document.URL, Date.now());
    ///console.log('frame', document.documentElement.offsetWidth, document.hidden);
    ///
    
    let isMobile = navigator.userAgent.includes("mobile");
    let isFirstLevelSubFrame = (parent == top) && (self != top);
    // firstLevelSubFrame
    // Because executeScript for a frameId runs in that subframe AND all subchildren
    // we only want to send exec. requests for first level subframes 
    if (isFirstLevelSubFrame && RUN_IN_FRAMES) //&& isMobile)
        chrome.runtime.sendMessage({type: "inject-index"});

})();


