
/*
chrome.runtime.onMessage.addListener(({type, data, error}, sender, sendResponse) => {
    type && console.log(type, data, error);

    //if (sender.frameId) return;
    if ('blz-init' == type) {
        chrome.tabs.sendMessage(sender.tab.id, {type}, {frameId: 0});
    }
    if ('blz-callback' == type) {
        setTimeout( _ => sendResponse(), 1);
        return true;
    }
    
});
*/

(() => {
    chrome.runtime.onMessage.addListener(((t, a, n) => {
        if ("fetch" === t.type && t.url)
            (async function(t, a, n="text") {
                if (e.has(t)) {
                    const a = e.get(t);
                    if (a.mode == n && (new Date).getTime() < a.validUntil)
                        return {
                            content: a.content,
                            cached: !0
                        }
                }
                const c = {
                        cache: "force-cache",
                        credentials: "omit",
                        referrer: a
                    },
                    i = await fetch(t, c);
                let o;
                switch (n) {
                case "text":
                    o = await i.text();
                    break;
                case "dataURL":
                    {
                        const e = await i.blob();
                        o = await new Promise((t => {
                            let a = new FileReader;
                            a.onload = () => t(a.result),
                            a.readAsDataURL(e)
                        }));
                        break
                    }
                }
                const s = {
                    content: o,
                    mode: n,
                    validUntil: (new Date).getTime() + 36e5
                };
                return e.set(t, s), {
                    content: o,
                    mode: n,
                    cached: !1
                }
            })(t.url, t.origin, t.mode || "text").then((e => n(e)));
        else if ("sendNativeMessage" === t.type)
            chrome.runtime.sendNativeMessage("application.id", t.payload, (function(e) {
                n({
                    response: e
                })
            }));
        else if ("notifyContentScripts" === t.type) {
            const e = t.active ? {
                active: !0,
                currentWindow: !0
            } : {};
            chrome.tabs.query(e, (function(e) {
                e.forEach((e => {
                    chrome.tabs.sendMessage(e.id, t.payload)
                }))
            }))
        }
        return !0
    }));
    const e = new Map
})();


