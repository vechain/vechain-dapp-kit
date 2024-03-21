(() => {
    'use strict';
    let e = (function (e) {
            return (
                (e.OPEN_IFRAME = 'OPEN_IFRAME'),
                (e.CLOSE_IFRAME = 'CLOSE_IFRAME'),
                (e.TOGGLE_IFRAME = 'TOGGLE_IFRAME'),
                (e.HEALTH_CHECK = 'HEALTH_CHECK'),
                e
            );
        })({}),
        t = (function (e) {
            return (e.MOUSEUP = 'mouseup'), (e.MOUSEMOVE = 'mousemove'), e;
        })({}),
        n = (function (e) {
            return (e.PROD = 'PROD'), (e.DEV = 'DEV'), (e.E2E = 'E2E'), e;
        })({});
    const o = () => {
            const e =
                document.documentElement.querySelector('veworld-container');
            if (null === e) throw Error('Failed to get VeWorld container');
            return e;
        },
        r = () => 'chrome-extension://'.concat(o().id, '/index.html#/');
    let i = 0,
        s = 0,
        c = 0,
        a = 0,
        d = !1,
        l = !1;
    const u = {},
        h = () => {
            const e = document.documentElement.querySelector(
                'veworld-outer-container',
            );
            if (null === e || null === e.shadowRoot)
                throw Error("Can't find VeWorld");
            const t = e.shadowRoot.querySelector('veworld-inner-container');
            if (null === t) throw Error("Can't find VeWorld");
            return t;
        },
        p = () => {
            (document.onmouseup = null),
                (document.onmousemove = null),
                (d = !1),
                (l = !1);
        },
        m = (e, t) => {
            const n = h();
            (i = c - e.clientX),
                (s = a - e.clientY),
                (c = e.clientX),
                (a = e.clientY),
                t &&
                    ((i -= n.offsetLeft),
                    (s -= n.offsetTop),
                    (c += n.offsetLeft),
                    (a += n.offsetTop)),
                (u.left = n.offsetLeft - i),
                (u.top = n.offsetTop - s),
                (n.style.top = n.offsetTop - s + 'px'),
                (n.style.left = n.offsetLeft - i + 'px');
        };
    document.addEventListener('mousemove', (e) =>
        ((e) => {
            l && m(e, !1);
        })(e),
    );
    const E = 'PROD' in n ? 'PROD' : n.PROD.valueOf(),
        f = n[E],
        g =
            (n.PROD,
            n.PROD,
            n.PROD,
            f === n.PROD
                ? () => ({})
                : function () {
                      for (
                          var e = arguments.length, t = new Array(e), n = 0;
                          n < e;
                          n++
                      )
                          t[n] = arguments[n];
                      console.info('[INFO] - ', ...t);
                  }),
        x = 'PROD' === n.E2E ? 'open' : 'open',
        w = () => {
            const e = new CSSStyleSheet();
            return (
                e.replaceSync(
                    '\nveworld-inner-container {\n  display: block;\n  position: fixed;\n  z-index: 2147483647;\n  top: 12px;\n  right: 16px;\n  width: 375px;\n  max-height: 600px;\n}',
                ),
                e
            );
        },
        L = () => {
            const e = new CSSStyleSheet();
            return (
                e.replaceSync(
                    '\niframe.popup {\n  display: block;\n  position: fixed;\n  z-index: 2147483647;\n  height: calc(100vh - 56px);\n  border: 0;\n  border-bottom-right-radius: 16px;\n  border-bottom-left-radius: 16px;\n  background: #f3f4f5;\n  box-shadow: 0px 3px 8px 0px rgba(25, 28, 31, 0.45);\n  transition: height 150ms cubic-bezier(0.15, 0.5, 0.5, 1) 0s;\n  width: 375px;\n  max-height: 600px;\n}',
                ),
                e
            );
        },
        b = () => {
            const e = o();
            if (!e.hasChildNodes()) {
                g('Opening VeWorld iFrame');
                const t = document.createElement('veworld-outer-container');
                t.id = 'veworld-outer-container';
                const n = t.attachShadow({ mode: 'open' });
                n.adoptedStyleSheets = [w()];
                const o = document.createElement('veworld-inner-container');
                o.id = 'veworld-inner-container';
                const i = o.attachShadow({ mode: x });
                i.adoptedStyleSheets = [L()];
                const s = document.createElement('div');
                s.setAttribute(
                    'style',
                    'cursor: grab; background: rgb(40 0 140); border-top-left-radius: 16px; border-top-right-radius: 16px; height: 33px;',
                ),
                    (s.id = 'external-bar');
                const E = document.createElement('button');
                E.setAttribute(
                    'style',
                    'background: none; color: inherit; border: none; padding: 0; font: inherit; cursor: pointer; outline: inherit; color: white; width: 23px; right: 15px; height: 23px; top: 5px; position: absolute;',
                ),
                    (E.innerHTML =
                        '<svg style="height: 23px;width: 23px;" focusable="false" data-icon="close-circle" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 00-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path><path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg>'),
                    E.addEventListener('click', () => {
                        v();
                    }),
                    s.appendChild(E),
                    s.addEventListener('mousedown', (e) => {
                        ((e) => {
                            (c = e.clientX), (a = e.clientY), (d = !0);
                        })(e);
                    }),
                    s.addEventListener('mouseup', () => {
                        p();
                    }),
                    s.addEventListener('mousemove', (e) => {
                        ((e) => {
                            d && ((l = !0), m(e, !1));
                        })(e);
                    }),
                    i.appendChild(s);
                const f = document.createElement('iframe');
                if (
                    ((f.src = r()),
                    (f.id = 'veworld-frame'),
                    f.setAttribute('class', 'popup'),
                    (f.allow = 'clipboard-read; clipboard-write; hid'),
                    i.appendChild(f),
                    n.appendChild(o),
                    e.appendChild(t),
                    u.top && u.left)
                ) {
                    const e = h();
                    (e.style.top = ''.concat(u.top, 'px')),
                        (e.style.left = ''.concat(u.left, 'px'));
                }
            }
        },
        v = () => {
            const e = o();
            e.hasChildNodes() &&
                (g('Closing VeWorld iFrame'), (e.innerHTML = ''));
        },
        S = {
            open: b,
            close: v,
            toggle: () => {
                o().hasChildNodes() ? v() : b();
            },
        },
        M = () => {
            try {
                return window.self !== window.top;
            } catch (e) {
                return (
                    (function () {
                        for (
                            var e = arguments.length, t = new Array(e), n = 0;
                            n < e;
                            n++
                        )
                            t[n] = arguments[n];
                        console.error('[ERROR] - ', ...t);
                    })(e),
                    !0
                );
            }
        };
    chrome.runtime.MessageSender;
    const O = {
            messageRuntime: (e, t) => {
                const n = t || (() => ({}));
                chrome.runtime.sendMessage(e, n);
            },
            messageTab: (e, t, n) => {
                const o = n || (() => ({}));
                chrome.tabs.sendMessage(e, t, o);
            },
            addListener: (e) => {
                chrome.runtime.onMessage &&
                    !chrome.runtime.onMessage.hasListener(e) &&
                    chrome.runtime.onMessage.addListener(e);
            },
            messageExtension: (e, t, n, o) => {
                const r = o || (() => ({})),
                    i = n || {};
                chrome.runtime.sendMessage(e, t, i, r);
            },
            removeListener: (e) => chrome.runtime.onMessage.removeListener(e),
            addExternalListener: (e) => {
                chrome.runtime.onMessageExternal.hasListener(e) ||
                    chrome.runtime.onMessageExternal.addListener(e);
            },
            removeExternalListener: (e) =>
                chrome.runtime.onMessageExternal.removeListener(e),
        },
        R = O,
        y = (e) => {
            try {
                return 'https:' === new URL(e).protocol;
            } catch (t) {
                return !1;
            }
        },
        C = (e) => {
            try {
                const t = new URL(e);
                return 'localhost' === t.hostname || '127.0.0.1' === t.hostname;
            } catch (t) {
                return !1;
            }
        },
        A = (e) => y(e) || C(e);
    g('Starting ContentScriptController listener...'),
        R.addListener(async (n, o, r) => {
            if (!r) throw Error('Unknown error');
            if (
                o.id &&
                ((e) =>
                    e.id === chrome.runtime.id &&
                    !M() &&
                    A(location.href) &&
                    location.origin !==
                        'chrome-extension://' + chrome.runtime.id)(o)
            )
                switch (n.type) {
                    case e.HEALTH_CHECK:
                        r();
                        break;
                    case e.TOGGLE_IFRAME:
                        S.toggle(), r();
                        break;
                    case e.OPEN_IFRAME:
                        S.open(), r();
                        break;
                    case e.CLOSE_IFRAME:
                        S.close(), r();
                        break;
                    case t.MOUSEMOVE:
                        (i = n.payload), l && m(i, !0), r({ data: 'Success' });
                        break;
                    case t.MOUSEUP:
                        p(), r();
                }
            var i;
        });
})();
