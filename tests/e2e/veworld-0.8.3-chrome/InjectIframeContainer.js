(() => {
    'use strict';
    let e = (function (e) {
        return (e.PROD = 'PROD'), (e.DEV = 'DEV'), (e.E2E = 'E2E'), e;
    })({});
    const t = 'PROD' in e ? 'PROD' : e.PROD.valueOf(),
        o = e[t],
        n =
            (e.PROD,
            e.PROD,
            e.PROD,
            o === e.PROD
                ? () => ({})
                : function () {
                      for (
                          var e = arguments.length, t = new Array(e), o = 0;
                          o < e;
                          o++
                      )
                          t[o] = arguments[o];
                      console.info('[INFO] - ', ...t);
                  });
    let r = 0,
        c = 0,
        u = 0,
        i = 0,
        l = !1,
        s = !1;
    const d = {},
        f = () => {
            (document.onmouseup = null),
                (document.onmousemove = null),
                (l = !1),
                (s = !1);
        },
        a = (e, t) => {
            const o = (() => {
                const e = document.documentElement.querySelector(
                    'veworld-outer-container',
                );
                if (null === e || null === e.shadowRoot)
                    throw Error("Can't find VeWorld");
                const t = e.shadowRoot.querySelector('veworld-inner-container');
                if (null === t) throw Error("Can't find VeWorld");
                return t;
            })();
            (r = u - e.clientX),
                (c = i - e.clientY),
                (u = e.clientX),
                (i = e.clientY),
                t &&
                    ((r -= o.offsetLeft),
                    (c -= o.offsetTop),
                    (u += o.offsetLeft),
                    (i += o.offsetTop)),
                (d.left = o.offsetLeft - r),
                (d.top = o.offsetTop - c),
                (o.style.top = o.offsetTop - c + 'px'),
                (o.style.left = o.offsetLeft - r + 'px');
        };
    document.addEventListener('mousemove', (e) =>
        ((e) => {
            s && a(e, !1);
        })(e),
    );
    const m = (e) => {
            try {
                return 'https:' === new URL(e).protocol;
            } catch (t) {
                return !1;
            }
        },
        h = (e) => {
            try {
                const t = new URL(e);
                return 'localhost' === t.hostname || '127.0.0.1' === t.hostname;
            } catch (t) {
                return !1;
            }
        },
        w = (e) => m(e) || h(e);
    n('Attempting in inject VeWorld iFrame container...');
    const R = 'veworld-container',
        E = () => {
            new MutationObserver(() => {
                if (document.body) {
                    document.documentElement.querySelector(R) ||
                        (document.body.insertAdjacentElement(
                            'afterend',
                            (() => {
                                const e = document.createElement(R);
                                return (
                                    e.setAttribute('id', chrome.runtime.id), e
                                );
                            })(),
                        ),
                        n('VeWorld iFrame container created'));
                }
            }).observe(document, {
                attributes: !0,
                childList: !0,
                subtree: !0,
            });
        };
    !(() => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return (
                (function () {
                    for (
                        var e = arguments.length, t = new Array(e), o = 0;
                        o < e;
                        o++
                    )
                        t[o] = arguments[o];
                    console.error('[ERROR] - ', ...t);
                })(e),
                !0
            );
        }
    })() &&
        w(location.href) &&
        location.origin !== 'chrome-extension://' + chrome.runtime.id &&
        (E(), document.addEventListener('mouseup', f));
})();
