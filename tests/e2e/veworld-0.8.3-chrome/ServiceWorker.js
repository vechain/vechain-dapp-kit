(() => {
    var e = {
            4409: (e, t, r) => {
                'use strict';
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.EthereumProviderError = t.EthereumRpcError = void 0);
                const n = r(2891);
                class s extends Error {
                    constructor(e, t, r) {
                        if (!Number.isInteger(e))
                            throw new Error('"code" must be an integer.');
                        if (!t || 'string' !== typeof t)
                            throw new Error(
                                '"message" must be a nonempty string.',
                            );
                        super(t),
                            (this.code = e),
                            void 0 !== r && (this.data = r);
                    }
                    serialize() {
                        const e = { code: this.code, message: this.message };
                        return (
                            void 0 !== this.data && (e.data = this.data),
                            this.stack && (e.stack = this.stack),
                            e
                        );
                    }
                    toString() {
                        return n.default(this.serialize(), i, 2);
                    }
                }
                t.EthereumRpcError = s;
                function i(e, t) {
                    if ('[Circular]' !== t) return t;
                }
                t.EthereumProviderError = class extends s {
                    constructor(e, t, r) {
                        if (
                            !(function (e) {
                                return (
                                    Number.isInteger(e) && e >= 1e3 && e <= 4999
                                );
                            })(e)
                        )
                            throw new Error(
                                '"code" must be an integer such that: 1000 <= code <= 4999',
                            );
                        super(e, t, r);
                    }
                };
            },
            1479: (e, t) => {
                'use strict';
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.errorValues = t.errorCodes = void 0),
                    (t.errorCodes = {
                        rpc: {
                            invalidInput: -32e3,
                            resourceNotFound: -32001,
                            resourceUnavailable: -32002,
                            transactionRejected: -32003,
                            methodNotSupported: -32004,
                            limitExceeded: -32005,
                            parse: -32700,
                            invalidRequest: -32600,
                            methodNotFound: -32601,
                            invalidParams: -32602,
                            internal: -32603,
                        },
                        provider: {
                            userRejectedRequest: 4001,
                            unauthorized: 4100,
                            unsupportedMethod: 4200,
                            disconnected: 4900,
                            chainDisconnected: 4901,
                        },
                    }),
                    (t.errorValues = {
                        '-32700': {
                            standard: 'JSON RPC 2.0',
                            message:
                                'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
                        },
                        '-32600': {
                            standard: 'JSON RPC 2.0',
                            message:
                                'The JSON sent is not a valid Request object.',
                        },
                        '-32601': {
                            standard: 'JSON RPC 2.0',
                            message:
                                'The method does not exist / is not available.',
                        },
                        '-32602': {
                            standard: 'JSON RPC 2.0',
                            message: 'Invalid method parameter(s).',
                        },
                        '-32603': {
                            standard: 'JSON RPC 2.0',
                            message: 'Internal JSON-RPC error.',
                        },
                        '-32000': {
                            standard: 'EIP-1474',
                            message: 'Invalid input.',
                        },
                        '-32001': {
                            standard: 'EIP-1474',
                            message: 'Resource not found.',
                        },
                        '-32002': {
                            standard: 'EIP-1474',
                            message: 'Resource unavailable.',
                        },
                        '-32003': {
                            standard: 'EIP-1474',
                            message: 'Transaction rejected.',
                        },
                        '-32004': {
                            standard: 'EIP-1474',
                            message: 'Method not supported.',
                        },
                        '-32005': {
                            standard: 'EIP-1474',
                            message: 'Request limit exceeded.',
                        },
                        4001: {
                            standard: 'EIP-1193',
                            message: 'User rejected the request.',
                        },
                        4100: {
                            standard: 'EIP-1193',
                            message:
                                'The requested account and/or method has not been authorized by the user.',
                        },
                        4200: {
                            standard: 'EIP-1193',
                            message:
                                'The requested method is not supported by this Ethereum provider.',
                        },
                        4900: {
                            standard: 'EIP-1193',
                            message:
                                'The provider is disconnected from all chains.',
                        },
                        4901: {
                            standard: 'EIP-1193',
                            message:
                                'The provider is disconnected from the specified chain.',
                        },
                    });
            },
            1846: (e, t, r) => {
                'use strict';
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.ethErrors = void 0);
                const n = r(4409),
                    s = r(7638),
                    i = r(1479);
                function o(e, t) {
                    const [r, i] = c(t);
                    return new n.EthereumRpcError(
                        e,
                        r || s.getMessageFromCode(e),
                        i,
                    );
                }
                function a(e, t) {
                    const [r, i] = c(t);
                    return new n.EthereumProviderError(
                        e,
                        r || s.getMessageFromCode(e),
                        i,
                    );
                }
                function c(e) {
                    if (e) {
                        if ('string' === typeof e) return [e];
                        if ('object' === typeof e && !Array.isArray(e)) {
                            const { message: t, data: r } = e;
                            if (t && 'string' !== typeof t)
                                throw new Error('Must specify string message.');
                            return [t || void 0, r];
                        }
                    }
                    return [];
                }
                t.ethErrors = {
                    rpc: {
                        parse: (e) => o(i.errorCodes.rpc.parse, e),
                        invalidRequest: (e) =>
                            o(i.errorCodes.rpc.invalidRequest, e),
                        invalidParams: (e) =>
                            o(i.errorCodes.rpc.invalidParams, e),
                        methodNotFound: (e) =>
                            o(i.errorCodes.rpc.methodNotFound, e),
                        internal: (e) => o(i.errorCodes.rpc.internal, e),
                        server: (e) => {
                            if (!e || 'object' !== typeof e || Array.isArray(e))
                                throw new Error(
                                    'Ethereum RPC Server errors must provide single object argument.',
                                );
                            const { code: t } = e;
                            if (
                                !Number.isInteger(t) ||
                                t > -32005 ||
                                t < -32099
                            )
                                throw new Error(
                                    '"code" must be an integer such that: -32099 <= code <= -32005',
                                );
                            return o(t, e);
                        },
                        invalidInput: (e) =>
                            o(i.errorCodes.rpc.invalidInput, e),
                        resourceNotFound: (e) =>
                            o(i.errorCodes.rpc.resourceNotFound, e),
                        resourceUnavailable: (e) =>
                            o(i.errorCodes.rpc.resourceUnavailable, e),
                        transactionRejected: (e) =>
                            o(i.errorCodes.rpc.transactionRejected, e),
                        methodNotSupported: (e) =>
                            o(i.errorCodes.rpc.methodNotSupported, e),
                        limitExceeded: (e) =>
                            o(i.errorCodes.rpc.limitExceeded, e),
                    },
                    provider: {
                        userRejectedRequest: (e) =>
                            a(i.errorCodes.provider.userRejectedRequest, e),
                        unauthorized: (e) =>
                            a(i.errorCodes.provider.unauthorized, e),
                        unsupportedMethod: (e) =>
                            a(i.errorCodes.provider.unsupportedMethod, e),
                        disconnected: (e) =>
                            a(i.errorCodes.provider.disconnected, e),
                        chainDisconnected: (e) =>
                            a(i.errorCodes.provider.chainDisconnected, e),
                        custom: (e) => {
                            if (!e || 'object' !== typeof e || Array.isArray(e))
                                throw new Error(
                                    'Ethereum Provider custom errors must provide single object argument.',
                                );
                            const { code: t, message: r, data: s } = e;
                            if (!r || 'string' !== typeof r)
                                throw new Error(
                                    '"message" must be a nonempty string',
                                );
                            return new n.EthereumProviderError(t, r, s);
                        },
                    },
                };
            },
            8689: (e, t, r) => {
                'use strict';
                t.Zk = void 0;
                const n = r(4409);
                const s = r(7638);
                const i = r(1846);
                const o = r(1479);
                Object.defineProperty(t, 'Zk', {
                    enumerable: !0,
                    get: function () {
                        return o.errorCodes;
                    },
                });
            },
            7638: (e, t, r) => {
                'use strict';
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.serializeError =
                        t.isValidCode =
                        t.getMessageFromCode =
                        t.JSON_RPC_SERVER_ERROR_MESSAGE =
                            void 0);
                const n = r(1479),
                    s = r(4409),
                    i = n.errorCodes.rpc.internal,
                    o =
                        'Unspecified error message. This is a bug, please report it.',
                    a = { code: i, message: c(i) };
                function c(e) {
                    let r =
                        arguments.length > 1 && void 0 !== arguments[1]
                            ? arguments[1]
                            : o;
                    if (Number.isInteger(e)) {
                        const r = e.toString();
                        if (f(n.errorValues, r))
                            return n.errorValues[r].message;
                        if (l(e)) return t.JSON_RPC_SERVER_ERROR_MESSAGE;
                    }
                    return r;
                }
                function u(e) {
                    if (!Number.isInteger(e)) return !1;
                    const t = e.toString();
                    return !!n.errorValues[t] || !!l(e);
                }
                function l(e) {
                    return e >= -32099 && e <= -32e3;
                }
                function h(e) {
                    return e && 'object' === typeof e && !Array.isArray(e)
                        ? Object.assign({}, e)
                        : e;
                }
                function f(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t);
                }
                (t.JSON_RPC_SERVER_ERROR_MESSAGE = 'Unspecified server error.'),
                    (t.getMessageFromCode = c),
                    (t.isValidCode = u),
                    (t.serializeError = function (e) {
                        let {
                            fallbackError: t = a,
                            shouldIncludeStack: r = !1,
                        } =
                            arguments.length > 1 && void 0 !== arguments[1]
                                ? arguments[1]
                                : {};
                        var n, i;
                        if (
                            !t ||
                            !Number.isInteger(t.code) ||
                            'string' !== typeof t.message
                        )
                            throw new Error(
                                'Must provide fallback error with integer number code and string message.',
                            );
                        if (e instanceof s.EthereumRpcError)
                            return e.serialize();
                        const o = {};
                        if (
                            e &&
                            'object' === typeof e &&
                            !Array.isArray(e) &&
                            f(e, 'code') &&
                            u(e.code)
                        ) {
                            const t = e;
                            (o.code = t.code),
                                t.message && 'string' === typeof t.message
                                    ? ((o.message = t.message),
                                      f(t, 'data') && (o.data = t.data))
                                    : ((o.message = c(o.code)),
                                      (o.data = { originalError: h(e) }));
                        } else {
                            o.code = t.code;
                            const r =
                                null === (n = e) || void 0 === n
                                    ? void 0
                                    : n.message;
                            (o.message =
                                r && 'string' === typeof r ? r : t.message),
                                (o.data = { originalError: h(e) });
                        }
                        const l =
                            null === (i = e) || void 0 === i ? void 0 : i.stack;
                        return (
                            r &&
                                e &&
                                l &&
                                'string' === typeof l &&
                                (o.stack = l),
                            o
                        );
                    });
            },
            2891: (e) => {
                (e.exports = o),
                    (o.default = o),
                    (o.stable = l),
                    (o.stableStringify = l);
                var t = '[...]',
                    r = '[Circular]',
                    n = [],
                    s = [];
                function i() {
                    return {
                        depthLimit: Number.MAX_SAFE_INTEGER,
                        edgesLimit: Number.MAX_SAFE_INTEGER,
                    };
                }
                function o(e, t, r, o) {
                    var a;
                    'undefined' === typeof o && (o = i()),
                        c(e, '', 0, [], void 0, 0, o);
                    try {
                        a =
                            0 === s.length
                                ? JSON.stringify(e, t, r)
                                : JSON.stringify(e, f(t), r);
                    } catch (_) {
                        return JSON.stringify(
                            '[unable to serialize, circular reference is too complex to analyze]',
                        );
                    } finally {
                        for (; 0 !== n.length; ) {
                            var u = n.pop();
                            4 === u.length
                                ? Object.defineProperty(u[0], u[1], u[3])
                                : (u[0][u[1]] = u[2]);
                        }
                    }
                    return a;
                }
                function a(e, t, r, i) {
                    var o = Object.getOwnPropertyDescriptor(i, r);
                    void 0 !== o.get
                        ? o.configurable
                            ? (Object.defineProperty(i, r, { value: e }),
                              n.push([i, r, t, o]))
                            : s.push([t, r, e])
                        : ((i[r] = e), n.push([i, r, t]));
                }
                function c(e, n, s, i, o, u, l) {
                    var h;
                    if (((u += 1), 'object' === typeof e && null !== e)) {
                        for (h = 0; h < i.length; h++)
                            if (i[h] === e) return void a(r, e, n, o);
                        if (
                            'undefined' !== typeof l.depthLimit &&
                            u > l.depthLimit
                        )
                            return void a(t, e, n, o);
                        if (
                            'undefined' !== typeof l.edgesLimit &&
                            s + 1 > l.edgesLimit
                        )
                            return void a(t, e, n, o);
                        if ((i.push(e), Array.isArray(e)))
                            for (h = 0; h < e.length; h++)
                                c(e[h], h, h, i, e, u, l);
                        else {
                            var f = Object.keys(e);
                            for (h = 0; h < f.length; h++) {
                                var d = f[h];
                                c(e[d], d, h, i, e, u, l);
                            }
                        }
                        i.pop();
                    }
                }
                function u(e, t) {
                    return e < t ? -1 : e > t ? 1 : 0;
                }
                function l(e, t, r, o) {
                    'undefined' === typeof o && (o = i());
                    var a,
                        c = h(e, '', 0, [], void 0, 0, o) || e;
                    try {
                        a =
                            0 === s.length
                                ? JSON.stringify(c, t, r)
                                : JSON.stringify(c, f(t), r);
                    } catch (_) {
                        return JSON.stringify(
                            '[unable to serialize, circular reference is too complex to analyze]',
                        );
                    } finally {
                        for (; 0 !== n.length; ) {
                            var u = n.pop();
                            4 === u.length
                                ? Object.defineProperty(u[0], u[1], u[3])
                                : (u[0][u[1]] = u[2]);
                        }
                    }
                    return a;
                }
                function h(e, s, i, o, c, l, f) {
                    var d;
                    if (((l += 1), 'object' === typeof e && null !== e)) {
                        for (d = 0; d < o.length; d++)
                            if (o[d] === e) return void a(r, e, s, c);
                        try {
                            if ('function' === typeof e.toJSON) return;
                        } catch (_) {
                            return;
                        }
                        if (
                            'undefined' !== typeof f.depthLimit &&
                            l > f.depthLimit
                        )
                            return void a(t, e, s, c);
                        if (
                            'undefined' !== typeof f.edgesLimit &&
                            i + 1 > f.edgesLimit
                        )
                            return void a(t, e, s, c);
                        if ((o.push(e), Array.isArray(e)))
                            for (d = 0; d < e.length; d++)
                                h(e[d], d, d, o, e, l, f);
                        else {
                            var p = {},
                                g = Object.keys(e).sort(u);
                            for (d = 0; d < g.length; d++) {
                                var m = g[d];
                                h(e[m], m, d, o, e, l, f), (p[m] = e[m]);
                            }
                            if ('undefined' === typeof c) return p;
                            n.push([c, s, e]), (c[s] = p);
                        }
                        o.pop();
                    }
                }
                function f(e) {
                    return (
                        (e =
                            'undefined' !== typeof e
                                ? e
                                : function (e, t) {
                                      return t;
                                  }),
                        function (t, r) {
                            if (s.length > 0)
                                for (var n = 0; n < s.length; n++) {
                                    var i = s[n];
                                    if (i[1] === t && i[0] === r) {
                                        (r = i[2]), s.splice(n, 1);
                                        break;
                                    }
                                }
                            return e.call(this, t, r);
                        }
                    );
                }
            },
            4906: () => {
                'use strict';
                try {
                    self['workbox:core:6.6.0'] && _();
                } catch (e) {}
            },
            143: () => {
                'use strict';
                try {
                    self['workbox:precaching:6.6.0'] && _();
                } catch (e) {}
            },
            7713: () => {
                'use strict';
                try {
                    self['workbox:routing:6.6.0'] && _();
                } catch (e) {}
            },
            5831: () => {
                'use strict';
                try {
                    self['workbox:strategies:6.6.0'] && _();
                } catch (e) {}
            },
        },
        t = {};
    function r(n) {
        var s = t[n];
        if (void 0 !== s) return s.exports;
        var i = (t[n] = { exports: {} });
        return e[n](i, i.exports, r), i.exports;
    }
    (r.d = (e, t) => {
        for (var n in t)
            r.o(t, n) &&
                !r.o(e, n) &&
                Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
    }),
        (r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
        (r.r = (e) => {
            'undefined' !== typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(e, Symbol.toStringTag, {
                    value: 'Module',
                }),
                Object.defineProperty(e, '__esModule', { value: !0 });
        }),
        (() => {
            'use strict';
            var e = {};
            r.r(e), r.d(e, { start: () => ae });
            r(4906);
            const t = function (e) {
                let t = e;
                for (
                    var r = arguments.length,
                        n = new Array(r > 1 ? r - 1 : 0),
                        s = 1;
                    s < r;
                    s++
                )
                    n[s - 1] = arguments[s];
                return (
                    n.length > 0 && (t += ' :: '.concat(JSON.stringify(n))), t
                );
            };
            class n extends Error {
                constructor(e, r) {
                    super(t(e, r)), (this.name = e), (this.details = r);
                }
            }
            const s = {
                    googleAnalytics: 'googleAnalytics',
                    precache: 'precache-v2',
                    prefix: 'workbox',
                    runtime: 'runtime',
                    suffix:
                        'undefined' !== typeof registration
                            ? registration.scope
                            : '',
                },
                i = (e) =>
                    [s.prefix, e, s.suffix]
                        .filter((e) => e && e.length > 0)
                        .join('-'),
                o = (e) => e || i(s.precache),
                a = (e) => e || i(s.runtime);
            function c(e, t) {
                const r = t();
                return e.waitUntil(r), r;
            }
            r(143);
            function u(e) {
                if (!e)
                    throw new n('add-to-cache-list-unexpected-type', {
                        entry: e,
                    });
                if ('string' === typeof e) {
                    const t = new URL(e, location.href);
                    return { cacheKey: t.href, url: t.href };
                }
                const { revision: t, url: r } = e;
                if (!r)
                    throw new n('add-to-cache-list-unexpected-type', {
                        entry: e,
                    });
                if (!t) {
                    const e = new URL(r, location.href);
                    return { cacheKey: e.href, url: e.href };
                }
                const s = new URL(r, location.href),
                    i = new URL(r, location.href);
                return (
                    s.searchParams.set('__WB_REVISION__', t),
                    { cacheKey: s.href, url: i.href }
                );
            }
            class l {
                constructor() {
                    (this.updatedURLs = []),
                        (this.notUpdatedURLs = []),
                        (this.handlerWillStart = async (e) => {
                            let { request: t, state: r } = e;
                            r && (r.originalRequest = t);
                        }),
                        (this.cachedResponseWillBeUsed = async (e) => {
                            let { event: t, state: r, cachedResponse: n } = e;
                            if (
                                'install' === t.type &&
                                r &&
                                r.originalRequest &&
                                r.originalRequest instanceof Request
                            ) {
                                const e = r.originalRequest.url;
                                n
                                    ? this.notUpdatedURLs.push(e)
                                    : this.updatedURLs.push(e);
                            }
                            return n;
                        });
                }
            }
            class h {
                constructor(e) {
                    let { precacheController: t } = e;
                    (this.cacheKeyWillBeUsed = async (e) => {
                        let { request: t, params: r } = e;
                        const n =
                            (null === r || void 0 === r
                                ? void 0
                                : r.cacheKey) ||
                            this._precacheController.getCacheKeyForURL(t.url);
                        return n ? new Request(n, { headers: t.headers }) : t;
                    }),
                        (this._precacheController = t);
                }
            }
            let f;
            async function d(e, t) {
                let r = null;
                if (e.url) {
                    r = new URL(e.url).origin;
                }
                if (r !== self.location.origin)
                    throw new n('cross-origin-copy-response', { origin: r });
                const s = e.clone(),
                    i = {
                        headers: new Headers(s.headers),
                        status: s.status,
                        statusText: s.statusText,
                    },
                    o = t ? t(i) : i,
                    a = (function () {
                        if (void 0 === f) {
                            const t = new Response('');
                            if ('body' in t)
                                try {
                                    new Response(t.body), (f = !0);
                                } catch (e) {
                                    f = !1;
                                }
                            f = !1;
                        }
                        return f;
                    })()
                        ? s.body
                        : await s.blob();
                return new Response(a, o);
            }
            function p(e, t) {
                const r = new URL(e);
                for (const n of t) r.searchParams.delete(n);
                return r.href;
            }
            class g {
                constructor() {
                    this.promise = new Promise((e, t) => {
                        (this.resolve = e), (this.reject = t);
                    });
                }
            }
            const m = new Set();
            r(5831);
            function y(e) {
                return 'string' === typeof e ? new Request(e) : e;
            }
            class w {
                constructor(e, t) {
                    (this._cacheKeys = {}),
                        Object.assign(this, t),
                        (this.event = t.event),
                        (this._strategy = e),
                        (this._handlerDeferred = new g()),
                        (this._extendLifetimePromises = []),
                        (this._plugins = [...e.plugins]),
                        (this._pluginStateMap = new Map());
                    for (const r of this._plugins)
                        this._pluginStateMap.set(r, {});
                    this.event.waitUntil(this._handlerDeferred.promise);
                }
                async fetch(e) {
                    const { event: t } = this;
                    let r = y(e);
                    if (
                        'navigate' === r.mode &&
                        t instanceof FetchEvent &&
                        t.preloadResponse
                    ) {
                        const e = await t.preloadResponse;
                        if (e) return e;
                    }
                    const s = this.hasCallback('fetchDidFail')
                        ? r.clone()
                        : null;
                    try {
                        for (const e of this.iterateCallbacks(
                            'requestWillFetch',
                        ))
                            r = await e({ request: r.clone(), event: t });
                    } catch (o) {
                        if (o instanceof Error)
                            throw new n('plugin-error-request-will-fetch', {
                                thrownErrorMessage: o.message,
                            });
                    }
                    const i = r.clone();
                    try {
                        let e;
                        e = await fetch(
                            r,
                            'navigate' === r.mode
                                ? void 0
                                : this._strategy.fetchOptions,
                        );
                        for (const r of this.iterateCallbacks(
                            'fetchDidSucceed',
                        ))
                            e = await r({ event: t, request: i, response: e });
                        return e;
                    } catch (a) {
                        throw (
                            (s &&
                                (await this.runCallbacks('fetchDidFail', {
                                    error: a,
                                    event: t,
                                    originalRequest: s.clone(),
                                    request: i.clone(),
                                })),
                            a)
                        );
                    }
                }
                async fetchAndCachePut(e) {
                    const t = await this.fetch(e),
                        r = t.clone();
                    return this.waitUntil(this.cachePut(e, r)), t;
                }
                async cacheMatch(e) {
                    const t = y(e);
                    let r;
                    const { cacheName: n, matchOptions: s } = this._strategy,
                        i = await this.getCacheKey(t, 'read'),
                        o = Object.assign(Object.assign({}, s), {
                            cacheName: n,
                        });
                    r = await caches.match(i, o);
                    for (const a of this.iterateCallbacks(
                        'cachedResponseWillBeUsed',
                    ))
                        r =
                            (await a({
                                cacheName: n,
                                matchOptions: s,
                                cachedResponse: r,
                                request: i,
                                event: this.event,
                            })) || void 0;
                    return r;
                }
                async cachePut(e, t) {
                    const r = y(e);
                    var s;
                    await ((s = 0), new Promise((e) => setTimeout(e, s)));
                    const i = await this.getCacheKey(r, 'write');
                    if (!t)
                        throw new n('cache-put-with-no-response', {
                            url:
                                ((o = i.url),
                                new URL(String(o), location.href).href.replace(
                                    new RegExp('^'.concat(location.origin)),
                                    '',
                                )),
                        });
                    var o;
                    const a = await this._ensureResponseSafeToCache(t);
                    if (!a) return !1;
                    const { cacheName: c, matchOptions: u } = this._strategy,
                        l = await self.caches.open(c),
                        h = this.hasCallback('cacheDidUpdate'),
                        f = h
                            ? await (async function (e, t, r, n) {
                                  const s = p(t.url, r);
                                  if (t.url === s) return e.match(t, n);
                                  const i = Object.assign(
                                          Object.assign({}, n),
                                          { ignoreSearch: !0 },
                                      ),
                                      o = await e.keys(t, i);
                                  for (const a of o)
                                      if (s === p(a.url, r))
                                          return e.match(a, n);
                              })(l, i.clone(), ['__WB_REVISION__'], u)
                            : null;
                    try {
                        await l.put(i, h ? a.clone() : a);
                    } catch (d) {
                        if (d instanceof Error)
                            throw (
                                ('QuotaExceededError' === d.name &&
                                    (await (async function () {
                                        for (const e of m) await e();
                                    })()),
                                d)
                            );
                    }
                    for (const n of this.iterateCallbacks('cacheDidUpdate'))
                        await n({
                            cacheName: c,
                            oldResponse: f,
                            newResponse: a.clone(),
                            request: i,
                            event: this.event,
                        });
                    return !0;
                }
                async getCacheKey(e, t) {
                    const r = ''.concat(e.url, ' | ').concat(t);
                    if (!this._cacheKeys[r]) {
                        let n = e;
                        for (const e of this.iterateCallbacks(
                            'cacheKeyWillBeUsed',
                        ))
                            n = y(
                                await e({
                                    mode: t,
                                    request: n,
                                    event: this.event,
                                    params: this.params,
                                }),
                            );
                        this._cacheKeys[r] = n;
                    }
                    return this._cacheKeys[r];
                }
                hasCallback(e) {
                    for (const t of this._strategy.plugins)
                        if (e in t) return !0;
                    return !1;
                }
                async runCallbacks(e, t) {
                    for (const r of this.iterateCallbacks(e)) await r(t);
                }
                *iterateCallbacks(e) {
                    for (const t of this._strategy.plugins)
                        if ('function' === typeof t[e]) {
                            const r = this._pluginStateMap.get(t),
                                n = (n) => {
                                    const s = Object.assign(
                                        Object.assign({}, n),
                                        { state: r },
                                    );
                                    return t[e](s);
                                };
                            yield n;
                        }
                }
                waitUntil(e) {
                    return this._extendLifetimePromises.push(e), e;
                }
                async doneWaiting() {
                    let e;
                    for (; (e = this._extendLifetimePromises.shift()); )
                        await e;
                }
                destroy() {
                    this._handlerDeferred.resolve(null);
                }
                async _ensureResponseSafeToCache(e) {
                    let t = e,
                        r = !1;
                    for (const n of this.iterateCallbacks('cacheWillUpdate'))
                        if (
                            ((t =
                                (await n({
                                    request: this.request,
                                    response: t,
                                    event: this.event,
                                })) || void 0),
                            (r = !0),
                            !t)
                        )
                            break;
                    return r || (t && 200 !== t.status && (t = void 0)), t;
                }
            }
            class v {
                constructor() {
                    let e =
                        arguments.length > 0 && void 0 !== arguments[0]
                            ? arguments[0]
                            : {};
                    (this.cacheName = a(e.cacheName)),
                        (this.plugins = e.plugins || []),
                        (this.fetchOptions = e.fetchOptions),
                        (this.matchOptions = e.matchOptions);
                }
                handle(e) {
                    const [t] = this.handleAll(e);
                    return t;
                }
                handleAll(e) {
                    e instanceof FetchEvent &&
                        (e = { event: e, request: e.request });
                    const t = e.event,
                        r =
                            'string' === typeof e.request
                                ? new Request(e.request)
                                : e.request,
                        n = 'params' in e ? e.params : void 0,
                        s = new w(this, { event: t, request: r, params: n }),
                        i = this._getResponse(s, r, t);
                    return [i, this._awaitComplete(i, s, r, t)];
                }
                async _getResponse(e, t, r) {
                    let s;
                    await e.runCallbacks('handlerWillStart', {
                        event: r,
                        request: t,
                    });
                    try {
                        if (
                            ((s = await this._handle(t, e)),
                            !s || 'error' === s.type)
                        )
                            throw new n('no-response', { url: t.url });
                    } catch (i) {
                        if (i instanceof Error)
                            for (const n of e.iterateCallbacks(
                                'handlerDidError',
                            ))
                                if (
                                    ((s = await n({
                                        error: i,
                                        event: r,
                                        request: t,
                                    })),
                                    s)
                                )
                                    break;
                        if (!s) throw i;
                    }
                    for (const n of e.iterateCallbacks('handlerWillRespond'))
                        s = await n({ event: r, request: t, response: s });
                    return s;
                }
                async _awaitComplete(e, t, r, n) {
                    let s, i;
                    try {
                        s = await e;
                    } catch (i) {}
                    try {
                        await t.runCallbacks('handlerDidRespond', {
                            event: n,
                            request: r,
                            response: s,
                        }),
                            await t.doneWaiting();
                    } catch (o) {
                        o instanceof Error && (i = o);
                    }
                    if (
                        (await t.runCallbacks('handlerDidComplete', {
                            event: n,
                            request: r,
                            response: s,
                            error: i,
                        }),
                        t.destroy(),
                        i)
                    )
                        throw i;
                }
            }
            class b extends v {
                constructor() {
                    let e =
                        arguments.length > 0 && void 0 !== arguments[0]
                            ? arguments[0]
                            : {};
                    (e.cacheName = o(e.cacheName)),
                        super(e),
                        (this._fallbackToNetwork = !1 !== e.fallbackToNetwork),
                        this.plugins.push(
                            b.copyRedirectedCacheableResponsesPlugin,
                        );
                }
                async _handle(e, t) {
                    const r = await t.cacheMatch(e);
                    return (
                        r ||
                        (t.event && 'install' === t.event.type
                            ? await this._handleInstall(e, t)
                            : await this._handleFetch(e, t))
                    );
                }
                async _handleFetch(e, t) {
                    let r;
                    const s = t.params || {};
                    if (!this._fallbackToNetwork)
                        throw new n('missing-precache-entry', {
                            cacheName: this.cacheName,
                            url: e.url,
                        });
                    {
                        0;
                        const n = s.integrity,
                            i = e.integrity,
                            o = !i || i === n;
                        if (
                            ((r = await t.fetch(
                                new Request(e, {
                                    integrity:
                                        'no-cors' !== e.mode ? i || n : void 0,
                                }),
                            )),
                            n && o && 'no-cors' !== e.mode)
                        ) {
                            this._useDefaultCacheabilityPluginIfNeeded();
                            await t.cachePut(e, r.clone());
                            0;
                        }
                    }
                    return r;
                }
                async _handleInstall(e, t) {
                    this._useDefaultCacheabilityPluginIfNeeded();
                    const r = await t.fetch(e);
                    if (!(await t.cachePut(e, r.clone())))
                        throw new n('bad-precaching-response', {
                            url: e.url,
                            status: r.status,
                        });
                    return r;
                }
                _useDefaultCacheabilityPluginIfNeeded() {
                    let e = null,
                        t = 0;
                    for (const [r, n] of this.plugins.entries())
                        n !== b.copyRedirectedCacheableResponsesPlugin &&
                            (n === b.defaultPrecacheCacheabilityPlugin &&
                                (e = r),
                            n.cacheWillUpdate && t++);
                    0 === t
                        ? this.plugins.push(b.defaultPrecacheCacheabilityPlugin)
                        : t > 1 && null !== e && this.plugins.splice(e, 1);
                }
            }
            (b.defaultPrecacheCacheabilityPlugin = {
                async cacheWillUpdate(e) {
                    let { response: t } = e;
                    return !t || t.status >= 400 ? null : t;
                },
            }),
                (b.copyRedirectedCacheableResponsesPlugin = {
                    async cacheWillUpdate(e) {
                        let { response: t } = e;
                        return t.redirected ? await d(t) : t;
                    },
                });
            class E {
                constructor() {
                    let {
                        cacheName: e,
                        plugins: t = [],
                        fallbackToNetwork: r = !0,
                    } = arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {};
                    (this._urlsToCacheKeys = new Map()),
                        (this._urlsToCacheModes = new Map()),
                        (this._cacheKeysToIntegrities = new Map()),
                        (this._strategy = new b({
                            cacheName: o(e),
                            plugins: [
                                ...t,
                                new h({ precacheController: this }),
                            ],
                            fallbackToNetwork: r,
                        })),
                        (this.install = this.install.bind(this)),
                        (this.activate = this.activate.bind(this));
                }
                get strategy() {
                    return this._strategy;
                }
                precache(e) {
                    this.addToCacheList(e),
                        this._installAndActiveListenersAdded ||
                            (self.addEventListener('install', this.install),
                            self.addEventListener('activate', this.activate),
                            (this._installAndActiveListenersAdded = !0));
                }
                addToCacheList(e) {
                    const t = [];
                    for (const r of e) {
                        'string' === typeof r
                            ? t.push(r)
                            : r && void 0 === r.revision && t.push(r.url);
                        const { cacheKey: e, url: s } = u(r),
                            i =
                                'string' !== typeof r && r.revision
                                    ? 'reload'
                                    : 'default';
                        if (
                            this._urlsToCacheKeys.has(s) &&
                            this._urlsToCacheKeys.get(s) !== e
                        )
                            throw new n(
                                'add-to-cache-list-conflicting-entries',
                                {
                                    firstEntry: this._urlsToCacheKeys.get(s),
                                    secondEntry: e,
                                },
                            );
                        if ('string' !== typeof r && r.integrity) {
                            if (
                                this._cacheKeysToIntegrities.has(e) &&
                                this._cacheKeysToIntegrities.get(e) !==
                                    r.integrity
                            )
                                throw new n(
                                    'add-to-cache-list-conflicting-integrities',
                                    { url: s },
                                );
                            this._cacheKeysToIntegrities.set(e, r.integrity);
                        }
                        if (
                            (this._urlsToCacheKeys.set(s, e),
                            this._urlsToCacheModes.set(s, i),
                            t.length > 0)
                        ) {
                            const e =
                                'Workbox is precaching URLs without revision ' +
                                'info: '.concat(
                                    t.join(', '),
                                    '\nThis is generally NOT safe. ',
                                ) +
                                'Learn more at https://bit.ly/wb-precache';
                            console.warn(e);
                        }
                    }
                }
                install(e) {
                    return c(e, async () => {
                        const t = new l();
                        this.strategy.plugins.push(t);
                        for (const [s, i] of this._urlsToCacheKeys) {
                            const t = this._cacheKeysToIntegrities.get(i),
                                r = this._urlsToCacheModes.get(s),
                                n = new Request(s, {
                                    integrity: t,
                                    cache: r,
                                    credentials: 'same-origin',
                                });
                            await Promise.all(
                                this.strategy.handleAll({
                                    params: { cacheKey: i },
                                    request: n,
                                    event: e,
                                }),
                            );
                        }
                        const { updatedURLs: r, notUpdatedURLs: n } = t;
                        return { updatedURLs: r, notUpdatedURLs: n };
                    });
                }
                activate(e) {
                    return c(e, async () => {
                        const e = await self.caches.open(
                                this.strategy.cacheName,
                            ),
                            t = await e.keys(),
                            r = new Set(this._urlsToCacheKeys.values()),
                            n = [];
                        for (const s of t)
                            r.has(s.url) || (await e.delete(s), n.push(s.url));
                        return { deletedURLs: n };
                    });
                }
                getURLsToCacheKeys() {
                    return this._urlsToCacheKeys;
                }
                getCachedURLs() {
                    return [...this._urlsToCacheKeys.keys()];
                }
                getCacheKeyForURL(e) {
                    const t = new URL(e, location.href);
                    return this._urlsToCacheKeys.get(t.href);
                }
                getIntegrityForCacheKey(e) {
                    return this._cacheKeysToIntegrities.get(e);
                }
                async matchPrecache(e) {
                    const t = e instanceof Request ? e.url : e,
                        r = this.getCacheKeyForURL(t);
                    if (r) {
                        return (
                            await self.caches.open(this.strategy.cacheName)
                        ).match(r);
                    }
                }
                createHandlerBoundToURL(e) {
                    const t = this.getCacheKeyForURL(e);
                    if (!t) throw new n('non-precached-url', { url: e });
                    return (r) => (
                        (r.request = new Request(e)),
                        (r.params = Object.assign({ cacheKey: t }, r.params)),
                        this.strategy.handle(r)
                    );
                }
            }
            let R;
            const _ = () => (R || (R = new E()), R);
            r(7713);
            var N = r(8689);
            class O extends Error {
                constructor(e, t, r) {
                    super(),
                        (this.veWorldError = !0),
                        (this.statusCode = void 0);
                    const n = C(r) ? r : void 0;
                    (this.message =
                        (null === n || void 0 === n ? void 0 : n.message) || e),
                        (this.statusCode =
                            (null === n || void 0 === n
                                ? void 0
                                : n.statusCode) || t);
                }
                serialize() {
                    return {
                        message: this.message,
                        statusCode: this.statusCode,
                    };
                }
            }
            const C = (e) =>
                    Boolean(
                        e &&
                            e instanceof Error &&
                            'veWorldError' in e &&
                            !0 === e.veWorldError,
                    ),
                P = {
                    parse: (e, t) => new O(e, N.Zk.rpc.parse, t),
                    internal: (e, t) => new O(e, N.Zk.rpc.internal, t),
                    resourceUnavailable: (e, t) =>
                        new O(e, N.Zk.rpc.resourceUnavailable, t),
                    transactionRejected: (e, t) =>
                        new O(e, N.Zk.rpc.transactionRejected, t),
                    server: (e, t, r) => {
                        if (!Number.isInteger(e) || e > -32005 || e < -32099)
                            throw new Error(
                                '"code" must be an integer such that: -32099 <= code <= -32005',
                            );
                        return new O(t, e, r);
                    },
                    invalidRequest: (e, t) =>
                        new O(e, N.Zk.rpc.invalidRequest, t),
                    invalidParams: (e, t) =>
                        new O(e, N.Zk.rpc.invalidParams, t),
                    methodNotFound: (e, t) =>
                        new O(e, N.Zk.rpc.methodNotFound, t),
                    invalidInput: (e, t) => new O(e, N.Zk.rpc.invalidInput, t),
                    resourceNotFound: (e, t) =>
                        new O(e, N.Zk.rpc.resourceNotFound, t),
                    methodNotSupported: (e, t) =>
                        new O(e, N.Zk.rpc.methodNotSupported, t),
                    limitExceeded: (e, t) =>
                        new O(e, N.Zk.rpc.limitExceeded, t),
                    userRejectedRequest: (e, t) =>
                        new O(e, N.Zk.provider.userRejectedRequest, t),
                    unauthorized: (e, t) =>
                        new O(e, N.Zk.provider.unauthorized, t),
                    unsupportedMethod: (e, t) =>
                        new O(e, N.Zk.provider.unsupportedMethod, t),
                    disconnected: (e, t) =>
                        new O(e, N.Zk.provider.disconnected, t),
                    chainDisconnected: (e, t) =>
                        new O(e, N.Zk.provider.chainDisconnected, t),
                    custom: (e, t, r) => {
                        if (!Number.isInteger(e) || e > -32005 || e < -32099)
                            throw new Error(
                                '"code" must be an integer such that: -32099 <= code <= -32005',
                            );
                        return new O(t, e, r);
                    },
                },
                k = P;
            let S = (function (e) {
                return (e.PROD = 'PROD'), (e.DEV = 'DEV'), (e.E2E = 'E2E'), e;
            })({});
            const A = 'PROD' in S ? 'PROD' : S.PROD.valueOf(),
                I = S[A],
                T =
                    (S.PROD,
                    I === S.PROD
                        ? () => ({})
                        : function () {
                              for (
                                  var e = arguments.length,
                                      t = new Array(e),
                                      r = 0;
                                  r < e;
                                  r++
                              )
                                  t[r] = arguments[r];
                              console.debug('[DEBUG] - ', ...t);
                          }),
                U =
                    (S.PROD,
                    I === S.PROD
                        ? () => ({})
                        : function () {
                              for (
                                  var e = arguments.length,
                                      t = new Array(e),
                                      r = 0;
                                  r < e;
                                  r++
                              )
                                  t[r] = arguments[r];
                              console.info('[INFO] - ', ...t);
                          }),
                L = 'auto-unlock-key',
                q = {
                    get: async () => {
                        const e = (await chrome.storage.session.get([L]))[L];
                        if (!e)
                            throw k.unauthorized(
                                'Auto unlock key is not available',
                            );
                        return e;
                    },
                    update: async (e) => {
                        chrome.storage.session.set({ [L]: e }, () => {
                            T('Updated auto unlock key');
                        });
                    },
                    reset: async () => {
                        chrome.storage.session.remove(L, () => {
                            T('Removed the auto unlock key');
                        });
                    },
                };
            let j = (function (e) {
                return (
                    (e.UNLOCKED = 'unlocked'),
                    (e.ASK_TO_SIGN = 'ask-to-sign'),
                    e
                );
            })({});
            var x = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
                M = Math.ceil,
                D = Math.floor,
                F = '[BigNumber Error] ',
                K =
                    F +
                    'Number primitive has more than 15 significant digits: ',
                B = 1e14,
                W = 14,
                z = 9007199254740991,
                V = [
                    1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11,
                    1e12, 1e13,
                ],
                G = 1e7,
                J = 1e9;
            function Z(e) {
                var t = 0 | e;
                return e > 0 || e === t ? t : t - 1;
            }
            function H(e) {
                for (var t, r, n = 1, s = e.length, i = e[0] + ''; n < s; ) {
                    for (t = e[n++] + '', r = W - t.length; r--; t = '0' + t);
                    i += t;
                }
                for (s = i.length; 48 === i.charCodeAt(--s); );
                return i.slice(0, s + 1 || 1);
            }
            function $(e, t) {
                var r,
                    n,
                    s = e.c,
                    i = t.c,
                    o = e.s,
                    a = t.s,
                    c = e.e,
                    u = t.e;
                if (!o || !a) return null;
                if (((r = s && !s[0]), (n = i && !i[0]), r || n))
                    return r ? (n ? 0 : -a) : o;
                if (o != a) return o;
                if (((r = o < 0), (n = c == u), !s || !i))
                    return n ? 0 : !s ^ r ? 1 : -1;
                if (!n) return (c > u) ^ r ? 1 : -1;
                for (
                    a = (c = s.length) < (u = i.length) ? c : u, o = 0;
                    o < a;
                    o++
                )
                    if (s[o] != i[o]) return (s[o] > i[o]) ^ r ? 1 : -1;
                return c == u ? 0 : (c > u) ^ r ? 1 : -1;
            }
            function X(e, t, r, n) {
                if (e < t || e > r || e !== D(e))
                    throw Error(
                        F +
                            (n || 'Argument') +
                            ('number' == typeof e
                                ? e < t || e > r
                                    ? ' out of range: '
                                    : ' not an integer: '
                                : ' not a primitive number: ') +
                            String(e),
                    );
            }
            function Y(e) {
                var t = e.c.length - 1;
                return Z(e.e / W) == t && e.c[t] % 2 != 0;
            }
            function Q(e, t) {
                return (
                    (e.length > 1 ? e.charAt(0) + '.' + e.slice(1) : e) +
                    (t < 0 ? 'e' : 'e+') +
                    t
                );
            }
            function ee(e, t, r) {
                var n, s;
                if (t < 0) {
                    for (s = r + '.'; ++t; s += r);
                    e = s + e;
                } else if (++t > (n = e.length)) {
                    for (s = r, t -= n; --t; s += r);
                    e += s;
                } else t < n && (e = e.slice(0, t) + '.' + e.slice(t));
                return e;
            }
            var te = (function e(t) {
                var r,
                    n,
                    s,
                    i = (v.prototype = {
                        constructor: v,
                        toString: null,
                        valueOf: null,
                    }),
                    o = new v(1),
                    a = 20,
                    c = 4,
                    u = -7,
                    l = 21,
                    h = -1e7,
                    f = 1e7,
                    d = !1,
                    p = 1,
                    g = 0,
                    m = {
                        prefix: '',
                        groupSize: 3,
                        secondaryGroupSize: 0,
                        groupSeparator: ',',
                        decimalSeparator: '.',
                        fractionGroupSize: 0,
                        fractionGroupSeparator: '\xa0',
                        suffix: '',
                    },
                    y = '0123456789abcdefghijklmnopqrstuvwxyz',
                    w = !0;
                function v(e, t) {
                    var r,
                        i,
                        o,
                        u,
                        l,
                        d,
                        p,
                        g,
                        m = this;
                    if (!(m instanceof v)) return new v(e, t);
                    if (null == t) {
                        if (e && !0 === e._isBigNumber)
                            return (
                                (m.s = e.s),
                                void (!e.c || e.e > f
                                    ? (m.c = m.e = null)
                                    : e.e < h
                                    ? (m.c = [(m.e = 0)])
                                    : ((m.e = e.e), (m.c = e.c.slice())))
                            );
                        if ((d = 'number' == typeof e) && 0 * e == 0) {
                            if (
                                ((m.s = 1 / e < 0 ? ((e = -e), -1) : 1),
                                e === ~~e)
                            ) {
                                for (u = 0, l = e; l >= 10; l /= 10, u++);
                                return void (u > f
                                    ? (m.c = m.e = null)
                                    : ((m.e = u), (m.c = [e])));
                            }
                            g = String(e);
                        } else {
                            if (!x.test((g = String(e)))) return s(m, g, d);
                            m.s =
                                45 == g.charCodeAt(0)
                                    ? ((g = g.slice(1)), -1)
                                    : 1;
                        }
                        (u = g.indexOf('.')) > -1 && (g = g.replace('.', '')),
                            (l = g.search(/e/i)) > 0
                                ? (u < 0 && (u = l),
                                  (u += +g.slice(l + 1)),
                                  (g = g.substring(0, l)))
                                : u < 0 && (u = g.length);
                    } else {
                        if ((X(t, 2, y.length, 'Base'), 10 == t && w))
                            return _((m = new v(e)), a + m.e + 1, c);
                        if (((g = String(e)), (d = 'number' == typeof e))) {
                            if (0 * e != 0) return s(m, g, d, t);
                            if (
                                ((m.s = 1 / e < 0 ? ((g = g.slice(1)), -1) : 1),
                                v.DEBUG &&
                                    g.replace(/^0\.0*|\./, '').length > 15)
                            )
                                throw Error(K + e);
                        } else
                            m.s =
                                45 === g.charCodeAt(0)
                                    ? ((g = g.slice(1)), -1)
                                    : 1;
                        for (
                            r = y.slice(0, t), u = l = 0, p = g.length;
                            l < p;
                            l++
                        )
                            if (r.indexOf((i = g.charAt(l))) < 0) {
                                if ('.' == i) {
                                    if (l > u) {
                                        u = p;
                                        continue;
                                    }
                                } else if (
                                    !o &&
                                    ((g == g.toUpperCase() &&
                                        (g = g.toLowerCase())) ||
                                        (g == g.toLowerCase() &&
                                            (g = g.toUpperCase())))
                                ) {
                                    (o = !0), (l = -1), (u = 0);
                                    continue;
                                }
                                return s(m, String(e), d, t);
                            }
                        (d = !1),
                            (u = (g = n(g, t, 10, m.s)).indexOf('.')) > -1
                                ? (g = g.replace('.', ''))
                                : (u = g.length);
                    }
                    for (l = 0; 48 === g.charCodeAt(l); l++);
                    for (p = g.length; 48 === g.charCodeAt(--p); );
                    if ((g = g.slice(l, ++p))) {
                        if (
                            ((p -= l),
                            d && v.DEBUG && p > 15 && (e > z || e !== D(e)))
                        )
                            throw Error(K + m.s * e);
                        if ((u = u - l - 1) > f) m.c = m.e = null;
                        else if (u < h) m.c = [(m.e = 0)];
                        else {
                            if (
                                ((m.e = u),
                                (m.c = []),
                                (l = (u + 1) % W),
                                u < 0 && (l += W),
                                l < p)
                            ) {
                                for (
                                    l && m.c.push(+g.slice(0, l)), p -= W;
                                    l < p;

                                )
                                    m.c.push(+g.slice(l, (l += W)));
                                l = W - (g = g.slice(l)).length;
                            } else l -= p;
                            for (; l--; g += '0');
                            m.c.push(+g);
                        }
                    } else m.c = [(m.e = 0)];
                }
                function b(e, t, r, n) {
                    var s, i, o, a, h;
                    if ((null == r ? (r = c) : X(r, 0, 8), !e.c))
                        return e.toString();
                    if (((s = e.c[0]), (o = e.e), null == t))
                        (h = H(e.c)),
                            (h =
                                1 == n || (2 == n && (o <= u || o >= l))
                                    ? Q(h, o)
                                    : ee(h, o, '0'));
                    else if (
                        ((i = (e = _(new v(e), t, r)).e),
                        (a = (h = H(e.c)).length),
                        1 == n || (2 == n && (t <= i || i <= u)))
                    ) {
                        for (; a < t; h += '0', a++);
                        h = Q(h, i);
                    } else if (((t -= o), (h = ee(h, i, '0')), i + 1 > a)) {
                        if (--t > 0) for (h += '.'; t--; h += '0');
                    } else if ((t += i - a) > 0)
                        for (i + 1 == a && (h += '.'); t--; h += '0');
                    return e.s < 0 && s ? '-' + h : h;
                }
                function E(e, t) {
                    for (var r, n = 1, s = new v(e[0]); n < e.length; n++) {
                        if (!(r = new v(e[n])).s) {
                            s = r;
                            break;
                        }
                        t.call(s, r) && (s = r);
                    }
                    return s;
                }
                function R(e, t, r) {
                    for (var n = 1, s = t.length; !t[--s]; t.pop());
                    for (s = t[0]; s >= 10; s /= 10, n++);
                    return (
                        (r = n + r * W - 1) > f
                            ? (e.c = e.e = null)
                            : r < h
                            ? (e.c = [(e.e = 0)])
                            : ((e.e = r), (e.c = t)),
                        e
                    );
                }
                function _(e, t, r, n) {
                    var s,
                        i,
                        o,
                        a,
                        c,
                        u,
                        l,
                        d = e.c,
                        p = V;
                    if (d) {
                        e: {
                            for (s = 1, a = d[0]; a >= 10; a /= 10, s++);
                            if ((i = t - s) < 0)
                                (i += W),
                                    (o = t),
                                    (l =
                                        ((c = d[(u = 0)]) / p[s - o - 1]) % 10 |
                                        0);
                            else if ((u = M((i + 1) / W)) >= d.length) {
                                if (!n) break e;
                                for (; d.length <= u; d.push(0));
                                (c = l = 0), (s = 1), (o = (i %= W) - W + 1);
                            } else {
                                for (
                                    c = a = d[u], s = 1;
                                    a >= 10;
                                    a /= 10, s++
                                );
                                l =
                                    (o = (i %= W) - W + s) < 0
                                        ? 0
                                        : (c / p[s - o - 1]) % 10 | 0;
                            }
                            if (
                                ((n =
                                    n ||
                                    t < 0 ||
                                    null != d[u + 1] ||
                                    (o < 0 ? c : c % p[s - o - 1])),
                                (n =
                                    r < 4
                                        ? (l || n) &&
                                          (0 == r || r == (e.s < 0 ? 3 : 2))
                                        : l > 5 ||
                                          (5 == l &&
                                              (4 == r ||
                                                  n ||
                                                  (6 == r &&
                                                      (i > 0
                                                          ? o > 0
                                                              ? c / p[s - o]
                                                              : 0
                                                          : d[u - 1]) %
                                                          10 &
                                                          1) ||
                                                  r == (e.s < 0 ? 8 : 7)))),
                                t < 1 || !d[0])
                            )
                                return (
                                    (d.length = 0),
                                    n
                                        ? ((t -= e.e + 1),
                                          (d[0] = p[(W - (t % W)) % W]),
                                          (e.e = -t || 0))
                                        : (d[0] = e.e = 0),
                                    e
                                );
                            if (
                                (0 == i
                                    ? ((d.length = u), (a = 1), u--)
                                    : ((d.length = u + 1),
                                      (a = p[W - i]),
                                      (d[u] =
                                          o > 0
                                              ? D((c / p[s - o]) % p[o]) * a
                                              : 0)),
                                n)
                            )
                                for (;;) {
                                    if (0 == u) {
                                        for (
                                            i = 1, o = d[0];
                                            o >= 10;
                                            o /= 10, i++
                                        );
                                        for (
                                            o = d[0] += a, a = 1;
                                            o >= 10;
                                            o /= 10, a++
                                        );
                                        i != a &&
                                            (e.e++, d[0] == B && (d[0] = 1));
                                        break;
                                    }
                                    if (((d[u] += a), d[u] != B)) break;
                                    (d[u--] = 0), (a = 1);
                                }
                            for (i = d.length; 0 === d[--i]; d.pop());
                        }
                        e.e > f
                            ? (e.c = e.e = null)
                            : e.e < h && (e.c = [(e.e = 0)]);
                    }
                    return e;
                }
                function N(e) {
                    var t,
                        r = e.e;
                    return null === r
                        ? e.toString()
                        : ((t = H(e.c)),
                          (t = r <= u || r >= l ? Q(t, r) : ee(t, r, '0')),
                          e.s < 0 ? '-' + t : t);
                }
                return (
                    (v.clone = e),
                    (v.ROUND_UP = 0),
                    (v.ROUND_DOWN = 1),
                    (v.ROUND_CEIL = 2),
                    (v.ROUND_FLOOR = 3),
                    (v.ROUND_HALF_UP = 4),
                    (v.ROUND_HALF_DOWN = 5),
                    (v.ROUND_HALF_EVEN = 6),
                    (v.ROUND_HALF_CEIL = 7),
                    (v.ROUND_HALF_FLOOR = 8),
                    (v.EUCLID = 9),
                    (v.config = v.set =
                        function (e) {
                            var t, r;
                            if (null != e) {
                                if ('object' != typeof e)
                                    throw Error(F + 'Object expected: ' + e);
                                if (
                                    (e.hasOwnProperty((t = 'DECIMAL_PLACES')) &&
                                        (X((r = e[t]), 0, J, t), (a = r)),
                                    e.hasOwnProperty((t = 'ROUNDING_MODE')) &&
                                        (X((r = e[t]), 0, 8, t), (c = r)),
                                    e.hasOwnProperty((t = 'EXPONENTIAL_AT')) &&
                                        ((r = e[t]) && r.pop
                                            ? (X(r[0], -J, 0, t),
                                              X(r[1], 0, J, t),
                                              (u = r[0]),
                                              (l = r[1]))
                                            : (X(r, -J, J, t),
                                              (u = -(l = r < 0 ? -r : r)))),
                                    e.hasOwnProperty((t = 'RANGE')))
                                )
                                    if ((r = e[t]) && r.pop)
                                        X(r[0], -J, -1, t),
                                            X(r[1], 1, J, t),
                                            (h = r[0]),
                                            (f = r[1]);
                                    else {
                                        if ((X(r, -J, J, t), !r))
                                            throw Error(
                                                F + t + ' cannot be zero: ' + r,
                                            );
                                        h = -(f = r < 0 ? -r : r);
                                    }
                                if (e.hasOwnProperty((t = 'CRYPTO'))) {
                                    if ((r = e[t]) !== !!r)
                                        throw Error(
                                            F + t + ' not true or false: ' + r,
                                        );
                                    if (r) {
                                        if (
                                            'undefined' == typeof crypto ||
                                            !crypto ||
                                            (!crypto.getRandomValues &&
                                                !crypto.randomBytes)
                                        )
                                            throw (
                                                ((d = !r),
                                                Error(F + 'crypto unavailable'))
                                            );
                                        d = r;
                                    } else d = r;
                                }
                                if (
                                    (e.hasOwnProperty((t = 'MODULO_MODE')) &&
                                        (X((r = e[t]), 0, 9, t), (p = r)),
                                    e.hasOwnProperty((t = 'POW_PRECISION')) &&
                                        (X((r = e[t]), 0, J, t), (g = r)),
                                    e.hasOwnProperty((t = 'FORMAT')))
                                ) {
                                    if ('object' != typeof (r = e[t]))
                                        throw Error(
                                            F + t + ' not an object: ' + r,
                                        );
                                    m = r;
                                }
                                if (e.hasOwnProperty((t = 'ALPHABET'))) {
                                    if (
                                        'string' != typeof (r = e[t]) ||
                                        /^.?$|[+\-.\s]|(.).*\1/.test(r)
                                    )
                                        throw Error(F + t + ' invalid: ' + r);
                                    (w = '0123456789' == r.slice(0, 10)),
                                        (y = r);
                                }
                            }
                            return {
                                DECIMAL_PLACES: a,
                                ROUNDING_MODE: c,
                                EXPONENTIAL_AT: [u, l],
                                RANGE: [h, f],
                                CRYPTO: d,
                                MODULO_MODE: p,
                                POW_PRECISION: g,
                                FORMAT: m,
                                ALPHABET: y,
                            };
                        }),
                    (v.isBigNumber = function (e) {
                        if (!e || !0 !== e._isBigNumber) return !1;
                        if (!v.DEBUG) return !0;
                        var t,
                            r,
                            n = e.c,
                            s = e.e,
                            i = e.s;
                        e: if ('[object Array]' == {}.toString.call(n)) {
                            if (
                                (1 === i || -1 === i) &&
                                s >= -J &&
                                s <= J &&
                                s === D(s)
                            ) {
                                if (0 === n[0]) {
                                    if (0 === s && 1 === n.length) return !0;
                                    break e;
                                }
                                if (
                                    ((t = (s + 1) % W) < 1 && (t += W),
                                    String(n[0]).length == t)
                                ) {
                                    for (t = 0; t < n.length; t++)
                                        if (
                                            (r = n[t]) < 0 ||
                                            r >= B ||
                                            r !== D(r)
                                        )
                                            break e;
                                    if (0 !== r) return !0;
                                }
                            }
                        } else if (
                            null === n &&
                            null === s &&
                            (null === i || 1 === i || -1 === i)
                        )
                            return !0;
                        throw Error(F + 'Invalid BigNumber: ' + e);
                    }),
                    (v.maximum = v.max =
                        function () {
                            return E(arguments, i.lt);
                        }),
                    (v.minimum = v.min =
                        function () {
                            return E(arguments, i.gt);
                        }),
                    (v.random = (function () {
                        var e = 9007199254740992,
                            t =
                                (Math.random() * e) & 2097151
                                    ? function () {
                                          return D(Math.random() * e);
                                      }
                                    : function () {
                                          return (
                                              8388608 *
                                                  ((1073741824 *
                                                      Math.random()) |
                                                      0) +
                                              ((8388608 * Math.random()) | 0)
                                          );
                                      };
                        return function (e) {
                            var r,
                                n,
                                s,
                                i,
                                c,
                                u = 0,
                                l = [],
                                h = new v(o);
                            if (
                                (null == e ? (e = a) : X(e, 0, J),
                                (i = M(e / W)),
                                d)
                            )
                                if (crypto.getRandomValues) {
                                    for (
                                        r = crypto.getRandomValues(
                                            new Uint32Array((i *= 2)),
                                        );
                                        u < i;

                                    )
                                        (c =
                                            131072 * r[u] +
                                            (r[u + 1] >>> 11)) >= 9e15
                                            ? ((n = crypto.getRandomValues(
                                                  new Uint32Array(2),
                                              )),
                                              (r[u] = n[0]),
                                              (r[u + 1] = n[1]))
                                            : (l.push(c % 1e14), (u += 2));
                                    u = i / 2;
                                } else {
                                    if (!crypto.randomBytes)
                                        throw (
                                            ((d = !1),
                                            Error(F + 'crypto unavailable'))
                                        );
                                    for (
                                        r = crypto.randomBytes((i *= 7));
                                        u < i;

                                    )
                                        (c =
                                            281474976710656 * (31 & r[u]) +
                                            1099511627776 * r[u + 1] +
                                            4294967296 * r[u + 2] +
                                            16777216 * r[u + 3] +
                                            (r[u + 4] << 16) +
                                            (r[u + 5] << 8) +
                                            r[u + 6]) >= 9e15
                                            ? crypto.randomBytes(7).copy(r, u)
                                            : (l.push(c % 1e14), (u += 7));
                                    u = i / 7;
                                }
                            if (!d)
                                for (; u < i; )
                                    (c = t()) < 9e15 && (l[u++] = c % 1e14);
                            for (
                                i = l[--u],
                                    e %= W,
                                    i &&
                                        e &&
                                        ((c = V[W - e]), (l[u] = D(i / c) * c));
                                0 === l[u];
                                l.pop(), u--
                            );
                            if (u < 0) l = [(s = 0)];
                            else {
                                for (
                                    s = -1;
                                    0 === l[0];
                                    l.splice(0, 1), s -= W
                                );
                                for (u = 1, c = l[0]; c >= 10; c /= 10, u++);
                                u < W && (s -= W - u);
                            }
                            return (h.e = s), (h.c = l), h;
                        };
                    })()),
                    (v.sum = function () {
                        for (
                            var e = 1, t = arguments, r = new v(t[0]);
                            e < t.length;

                        )
                            r = r.plus(t[e++]);
                        return r;
                    }),
                    (n = (function () {
                        var e = '0123456789';
                        function t(e, t, r, n) {
                            for (
                                var s, i, o = [0], a = 0, c = e.length;
                                a < c;

                            ) {
                                for (i = o.length; i--; o[i] *= t);
                                for (
                                    o[0] += n.indexOf(e.charAt(a++)), s = 0;
                                    s < o.length;
                                    s++
                                )
                                    o[s] > r - 1 &&
                                        (null == o[s + 1] && (o[s + 1] = 0),
                                        (o[s + 1] += (o[s] / r) | 0),
                                        (o[s] %= r));
                            }
                            return o.reverse();
                        }
                        return function (n, s, i, o, u) {
                            var l,
                                h,
                                f,
                                d,
                                p,
                                m,
                                w,
                                b,
                                E = n.indexOf('.'),
                                R = a,
                                _ = c;
                            for (
                                E >= 0 &&
                                    ((d = g),
                                    (g = 0),
                                    (n = n.replace('.', '')),
                                    (m = (b = new v(s)).pow(n.length - E)),
                                    (g = d),
                                    (b.c = t(ee(H(m.c), m.e, '0'), 10, i, e)),
                                    (b.e = b.c.length)),
                                    f = d =
                                        (w = t(
                                            n,
                                            s,
                                            i,
                                            u ? ((l = y), e) : ((l = e), y),
                                        )).length;
                                0 == w[--d];
                                w.pop()
                            );
                            if (!w[0]) return l.charAt(0);
                            if (
                                (E < 0
                                    ? --f
                                    : ((m.c = w),
                                      (m.e = f),
                                      (m.s = o),
                                      (w = (m = r(m, b, R, _, i)).c),
                                      (p = m.r),
                                      (f = m.e)),
                                (E = w[(h = f + R + 1)]),
                                (d = i / 2),
                                (p = p || h < 0 || null != w[h + 1]),
                                (p =
                                    _ < 4
                                        ? (null != E || p) &&
                                          (0 == _ || _ == (m.s < 0 ? 3 : 2))
                                        : E > d ||
                                          (E == d &&
                                              (4 == _ ||
                                                  p ||
                                                  (6 == _ && 1 & w[h - 1]) ||
                                                  _ == (m.s < 0 ? 8 : 7)))),
                                h < 1 || !w[0])
                            )
                                n = p
                                    ? ee(l.charAt(1), -R, l.charAt(0))
                                    : l.charAt(0);
                            else {
                                if (((w.length = h), p))
                                    for (--i; ++w[--h] > i; )
                                        (w[h] = 0),
                                            h || (++f, (w = [1].concat(w)));
                                for (d = w.length; !w[--d]; );
                                for (
                                    E = 0, n = '';
                                    E <= d;
                                    n += l.charAt(w[E++])
                                );
                                n = ee(n, f, l.charAt(0));
                            }
                            return n;
                        };
                    })()),
                    (r = (function () {
                        function e(e, t, r) {
                            var n,
                                s,
                                i,
                                o,
                                a = 0,
                                c = e.length,
                                u = t % G,
                                l = (t / G) | 0;
                            for (e = e.slice(); c--; )
                                (a =
                                    (((s =
                                        u * (i = e[c] % G) +
                                        ((n =
                                            l * i + (o = (e[c] / G) | 0) * u) %
                                            G) *
                                            G +
                                        a) /
                                        r) |
                                        0) +
                                    ((n / G) | 0) +
                                    l * o),
                                    (e[c] = s % r);
                            return a && (e = [a].concat(e)), e;
                        }
                        function t(e, t, r, n) {
                            var s, i;
                            if (r != n) i = r > n ? 1 : -1;
                            else
                                for (s = i = 0; s < r; s++)
                                    if (e[s] != t[s]) {
                                        i = e[s] > t[s] ? 1 : -1;
                                        break;
                                    }
                            return i;
                        }
                        function r(e, t, r, n) {
                            for (var s = 0; r--; )
                                (e[r] -= s),
                                    (s = e[r] < t[r] ? 1 : 0),
                                    (e[r] = s * n + e[r] - t[r]);
                            for (; !e[0] && e.length > 1; e.splice(0, 1));
                        }
                        return function (n, s, i, o, a) {
                            var c,
                                u,
                                l,
                                h,
                                f,
                                d,
                                p,
                                g,
                                m,
                                y,
                                w,
                                b,
                                E,
                                R,
                                N,
                                O,
                                C,
                                P = n.s == s.s ? 1 : -1,
                                k = n.c,
                                S = s.c;
                            if (!k || !k[0] || !S || !S[0])
                                return new v(
                                    n.s && s.s && (k ? !S || k[0] != S[0] : S)
                                        ? (k && 0 == k[0]) || !S
                                            ? 0 * P
                                            : P / 0
                                        : NaN,
                                );
                            for (
                                m = (g = new v(P)).c = [],
                                    P = i + (u = n.e - s.e) + 1,
                                    a ||
                                        ((a = B),
                                        (u = Z(n.e / W) - Z(s.e / W)),
                                        (P = (P / W) | 0)),
                                    l = 0;
                                S[l] == (k[l] || 0);
                                l++
                            );
                            if ((S[l] > (k[l] || 0) && u--, P < 0))
                                m.push(1), (h = !0);
                            else {
                                for (
                                    R = k.length,
                                        O = S.length,
                                        l = 0,
                                        P += 2,
                                        (f = D(a / (S[0] + 1))) > 1 &&
                                            ((S = e(S, f, a)),
                                            (k = e(k, f, a)),
                                            (O = S.length),
                                            (R = k.length)),
                                        E = O,
                                        w = (y = k.slice(0, O)).length;
                                    w < O;
                                    y[w++] = 0
                                );
                                (C = S.slice()),
                                    (C = [0].concat(C)),
                                    (N = S[0]),
                                    S[1] >= a / 2 && N++;
                                do {
                                    if (((f = 0), (c = t(S, y, O, w)) < 0)) {
                                        if (
                                            ((b = y[0]),
                                            O != w && (b = b * a + (y[1] || 0)),
                                            (f = D(b / N)) > 1)
                                        )
                                            for (
                                                f >= a && (f = a - 1),
                                                    p = (d = e(S, f, a)).length,
                                                    w = y.length;
                                                1 == t(d, y, p, w);

                                            )
                                                f--,
                                                    r(d, O < p ? C : S, p, a),
                                                    (p = d.length),
                                                    (c = 1);
                                        else
                                            0 == f && (c = f = 1),
                                                (p = (d = S.slice()).length);
                                        if (
                                            (p < w && (d = [0].concat(d)),
                                            r(y, d, w, a),
                                            (w = y.length),
                                            -1 == c)
                                        )
                                            for (; t(S, y, O, w) < 1; )
                                                f++,
                                                    r(y, O < w ? C : S, w, a),
                                                    (w = y.length);
                                    } else 0 === c && (f++, (y = [0]));
                                    (m[l++] = f),
                                        y[0]
                                            ? (y[w++] = k[E] || 0)
                                            : ((y = [k[E]]), (w = 1));
                                } while ((E++ < R || null != y[0]) && P--);
                                (h = null != y[0]), m[0] || m.splice(0, 1);
                            }
                            if (a == B) {
                                for (l = 1, P = m[0]; P >= 10; P /= 10, l++);
                                _(g, i + (g.e = l + u * W - 1) + 1, o, h);
                            } else (g.e = u), (g.r = +h);
                            return g;
                        };
                    })()),
                    (s = (function () {
                        var e = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
                            t = /^([^.]+)\.$/,
                            r = /^\.([^.]+)$/,
                            n = /^-?(Infinity|NaN)$/,
                            s = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
                        return function (i, o, a, c) {
                            var u,
                                l = a ? o : o.replace(s, '');
                            if (n.test(l))
                                i.s = isNaN(l) ? null : l < 0 ? -1 : 1;
                            else {
                                if (
                                    !a &&
                                    ((l = l.replace(e, function (e, t, r) {
                                        return (
                                            (u =
                                                'x' == (r = r.toLowerCase())
                                                    ? 16
                                                    : 'b' == r
                                                    ? 2
                                                    : 8),
                                            c && c != u ? e : t
                                        );
                                    })),
                                    c &&
                                        ((u = c),
                                        (l = l
                                            .replace(t, '$1')
                                            .replace(r, '0.$1'))),
                                    o != l)
                                )
                                    return new v(l, u);
                                if (v.DEBUG)
                                    throw Error(
                                        F +
                                            'Not a' +
                                            (c ? ' base ' + c : '') +
                                            ' number: ' +
                                            o,
                                    );
                                i.s = null;
                            }
                            i.c = i.e = null;
                        };
                    })()),
                    (i.absoluteValue = i.abs =
                        function () {
                            var e = new v(this);
                            return e.s < 0 && (e.s = 1), e;
                        }),
                    (i.comparedTo = function (e, t) {
                        return $(this, new v(e, t));
                    }),
                    (i.decimalPlaces = i.dp =
                        function (e, t) {
                            var r,
                                n,
                                s,
                                i = this;
                            if (null != e)
                                return (
                                    X(e, 0, J),
                                    null == t ? (t = c) : X(t, 0, 8),
                                    _(new v(i), e + i.e + 1, t)
                                );
                            if (!(r = i.c)) return null;
                            if (
                                ((n = ((s = r.length - 1) - Z(this.e / W)) * W),
                                (s = r[s]))
                            )
                                for (; s % 10 == 0; s /= 10, n--);
                            return n < 0 && (n = 0), n;
                        }),
                    (i.dividedBy = i.div =
                        function (e, t) {
                            return r(this, new v(e, t), a, c);
                        }),
                    (i.dividedToIntegerBy = i.idiv =
                        function (e, t) {
                            return r(this, new v(e, t), 0, 1);
                        }),
                    (i.exponentiatedBy = i.pow =
                        function (e, t) {
                            var r,
                                n,
                                s,
                                i,
                                a,
                                u,
                                l,
                                h,
                                f = this;
                            if ((e = new v(e)).c && !e.isInteger())
                                throw Error(
                                    F + 'Exponent not an integer: ' + N(e),
                                );
                            if (
                                (null != t && (t = new v(t)),
                                (a = e.e > 14),
                                !f.c ||
                                    !f.c[0] ||
                                    (1 == f.c[0] && !f.e && 1 == f.c.length) ||
                                    !e.c ||
                                    !e.c[0])
                            )
                                return (
                                    (h = new v(
                                        Math.pow(
                                            +N(f),
                                            a ? e.s * (2 - Y(e)) : +N(e),
                                        ),
                                    )),
                                    t ? h.mod(t) : h
                                );
                            if (((u = e.s < 0), t)) {
                                if (t.c ? !t.c[0] : !t.s) return new v(NaN);
                                (n = !u && f.isInteger() && t.isInteger()) &&
                                    (f = f.mod(t));
                            } else {
                                if (
                                    e.e > 9 &&
                                    (f.e > 0 ||
                                        f.e < -1 ||
                                        (0 == f.e
                                            ? f.c[0] > 1 ||
                                              (a && f.c[1] >= 24e7)
                                            : f.c[0] < 8e13 ||
                                              (a && f.c[0] <= 9999975e7)))
                                )
                                    return (
                                        (i = f.s < 0 && Y(e) ? -0 : 0),
                                        f.e > -1 && (i = 1 / i),
                                        new v(u ? 1 / i : i)
                                    );
                                g && (i = M(g / W + 2));
                            }
                            for (
                                a
                                    ? ((r = new v(0.5)),
                                      u && (e.s = 1),
                                      (l = Y(e)))
                                    : (l = (s = Math.abs(+N(e))) % 2),
                                    h = new v(o);
                                ;

                            ) {
                                if (l) {
                                    if (!(h = h.times(f)).c) break;
                                    i
                                        ? h.c.length > i && (h.c.length = i)
                                        : n && (h = h.mod(t));
                                }
                                if (s) {
                                    if (0 === (s = D(s / 2))) break;
                                    l = s % 2;
                                } else if (
                                    (_((e = e.times(r)), e.e + 1, 1), e.e > 14)
                                )
                                    l = Y(e);
                                else {
                                    if (0 === (s = +N(e))) break;
                                    l = s % 2;
                                }
                                (f = f.times(f)),
                                    i
                                        ? f.c &&
                                          f.c.length > i &&
                                          (f.c.length = i)
                                        : n && (f = f.mod(t));
                            }
                            return n
                                ? h
                                : (u && (h = o.div(h)),
                                  t ? h.mod(t) : i ? _(h, g, c, undefined) : h);
                        }),
                    (i.integerValue = function (e) {
                        var t = new v(this);
                        return (
                            null == e ? (e = c) : X(e, 0, 8), _(t, t.e + 1, e)
                        );
                    }),
                    (i.isEqualTo = i.eq =
                        function (e, t) {
                            return 0 === $(this, new v(e, t));
                        }),
                    (i.isFinite = function () {
                        return !!this.c;
                    }),
                    (i.isGreaterThan = i.gt =
                        function (e, t) {
                            return $(this, new v(e, t)) > 0;
                        }),
                    (i.isGreaterThanOrEqualTo = i.gte =
                        function (e, t) {
                            return 1 === (t = $(this, new v(e, t))) || 0 === t;
                        }),
                    (i.isInteger = function () {
                        return !!this.c && Z(this.e / W) > this.c.length - 2;
                    }),
                    (i.isLessThan = i.lt =
                        function (e, t) {
                            return $(this, new v(e, t)) < 0;
                        }),
                    (i.isLessThanOrEqualTo = i.lte =
                        function (e, t) {
                            return -1 === (t = $(this, new v(e, t))) || 0 === t;
                        }),
                    (i.isNaN = function () {
                        return !this.s;
                    }),
                    (i.isNegative = function () {
                        return this.s < 0;
                    }),
                    (i.isPositive = function () {
                        return this.s > 0;
                    }),
                    (i.isZero = function () {
                        return !!this.c && 0 == this.c[0];
                    }),
                    (i.minus = function (e, t) {
                        var r,
                            n,
                            s,
                            i,
                            o = this,
                            a = o.s;
                        if (((t = (e = new v(e, t)).s), !a || !t))
                            return new v(NaN);
                        if (a != t) return (e.s = -t), o.plus(e);
                        var u = o.e / W,
                            l = e.e / W,
                            h = o.c,
                            f = e.c;
                        if (!u || !l) {
                            if (!h || !f)
                                return h ? ((e.s = -t), e) : new v(f ? o : NaN);
                            if (!h[0] || !f[0])
                                return f[0]
                                    ? ((e.s = -t), e)
                                    : new v(h[0] ? o : 3 == c ? -0 : 0);
                        }
                        if (
                            ((u = Z(u)),
                            (l = Z(l)),
                            (h = h.slice()),
                            (a = u - l))
                        ) {
                            for (
                                (i = a < 0)
                                    ? ((a = -a), (s = h))
                                    : ((l = u), (s = f)),
                                    s.reverse(),
                                    t = a;
                                t--;
                                s.push(0)
                            );
                            s.reverse();
                        } else
                            for (
                                n = (i = (a = h.length) < (t = f.length))
                                    ? a
                                    : t,
                                    a = t = 0;
                                t < n;
                                t++
                            )
                                if (h[t] != f[t]) {
                                    i = h[t] < f[t];
                                    break;
                                }
                        if (
                            (i && ((s = h), (h = f), (f = s), (e.s = -e.s)),
                            (t = (n = f.length) - (r = h.length)) > 0)
                        )
                            for (; t--; h[r++] = 0);
                        for (t = B - 1; n > a; ) {
                            if (h[--n] < f[n]) {
                                for (r = n; r && !h[--r]; h[r] = t);
                                --h[r], (h[n] += B);
                            }
                            h[n] -= f[n];
                        }
                        for (; 0 == h[0]; h.splice(0, 1), --l);
                        return h[0]
                            ? R(e, h, l)
                            : ((e.s = 3 == c ? -1 : 1), (e.c = [(e.e = 0)]), e);
                    }),
                    (i.modulo = i.mod =
                        function (e, t) {
                            var n,
                                s,
                                i = this;
                            return (
                                (e = new v(e, t)),
                                !i.c || !e.s || (e.c && !e.c[0])
                                    ? new v(NaN)
                                    : !e.c || (i.c && !i.c[0])
                                    ? new v(i)
                                    : (9 == p
                                          ? ((s = e.s),
                                            (e.s = 1),
                                            (n = r(i, e, 0, 3)),
                                            (e.s = s),
                                            (n.s *= s))
                                          : (n = r(i, e, 0, p)),
                                      (e = i.minus(n.times(e))).c[0] ||
                                          1 != p ||
                                          (e.s = i.s),
                                      e)
                            );
                        }),
                    (i.multipliedBy = i.times =
                        function (e, t) {
                            var r,
                                n,
                                s,
                                i,
                                o,
                                a,
                                c,
                                u,
                                l,
                                h,
                                f,
                                d,
                                p,
                                g,
                                m,
                                y = this,
                                w = y.c,
                                b = (e = new v(e, t)).c;
                            if (!w || !b || !w[0] || !b[0])
                                return (
                                    !y.s ||
                                    !e.s ||
                                    (w && !w[0] && !b) ||
                                    (b && !b[0] && !w)
                                        ? (e.c = e.e = e.s = null)
                                        : ((e.s *= y.s),
                                          w && b
                                              ? ((e.c = [0]), (e.e = 0))
                                              : (e.c = e.e = null)),
                                    e
                                );
                            for (
                                n = Z(y.e / W) + Z(e.e / W),
                                    e.s *= y.s,
                                    (c = w.length) < (h = b.length) &&
                                        ((p = w),
                                        (w = b),
                                        (b = p),
                                        (s = c),
                                        (c = h),
                                        (h = s)),
                                    s = c + h,
                                    p = [];
                                s--;
                                p.push(0)
                            );
                            for (g = B, m = G, s = h; --s >= 0; ) {
                                for (
                                    r = 0,
                                        f = b[s] % m,
                                        d = (b[s] / m) | 0,
                                        i = s + (o = c);
                                    i > s;

                                )
                                    (r =
                                        (((u =
                                            f * (u = w[--o] % m) +
                                            ((a =
                                                d * u +
                                                (l = (w[o] / m) | 0) * f) %
                                                m) *
                                                m +
                                            p[i] +
                                            r) /
                                            g) |
                                            0) +
                                        ((a / m) | 0) +
                                        d * l),
                                        (p[i--] = u % g);
                                p[i] = r;
                            }
                            return r ? ++n : p.splice(0, 1), R(e, p, n);
                        }),
                    (i.negated = function () {
                        var e = new v(this);
                        return (e.s = -e.s || null), e;
                    }),
                    (i.plus = function (e, t) {
                        var r,
                            n = this,
                            s = n.s;
                        if (((t = (e = new v(e, t)).s), !s || !t))
                            return new v(NaN);
                        if (s != t) return (e.s = -t), n.minus(e);
                        var i = n.e / W,
                            o = e.e / W,
                            a = n.c,
                            c = e.c;
                        if (!i || !o) {
                            if (!a || !c) return new v(s / 0);
                            if (!a[0] || !c[0])
                                return c[0] ? e : new v(a[0] ? n : 0 * s);
                        }
                        if (
                            ((i = Z(i)),
                            (o = Z(o)),
                            (a = a.slice()),
                            (s = i - o))
                        ) {
                            for (
                                s > 0
                                    ? ((o = i), (r = c))
                                    : ((s = -s), (r = a)),
                                    r.reverse();
                                s--;
                                r.push(0)
                            );
                            r.reverse();
                        }
                        for (
                            (s = a.length) - (t = c.length) < 0 &&
                                ((r = c), (c = a), (a = r), (t = s)),
                                s = 0;
                            t;

                        )
                            (s = ((a[--t] = a[t] + c[t] + s) / B) | 0),
                                (a[t] = B === a[t] ? 0 : a[t] % B);
                        return s && ((a = [s].concat(a)), ++o), R(e, a, o);
                    }),
                    (i.precision = i.sd =
                        function (e, t) {
                            var r,
                                n,
                                s,
                                i = this;
                            if (null != e && e !== !!e)
                                return (
                                    X(e, 1, J),
                                    null == t ? (t = c) : X(t, 0, 8),
                                    _(new v(i), e, t)
                                );
                            if (!(r = i.c)) return null;
                            if (
                                ((n = (s = r.length - 1) * W + 1), (s = r[s]))
                            ) {
                                for (; s % 10 == 0; s /= 10, n--);
                                for (s = r[0]; s >= 10; s /= 10, n++);
                            }
                            return e && i.e + 1 > n && (n = i.e + 1), n;
                        }),
                    (i.shiftedBy = function (e) {
                        return X(e, -9007199254740991, z), this.times('1e' + e);
                    }),
                    (i.squareRoot = i.sqrt =
                        function () {
                            var e,
                                t,
                                n,
                                s,
                                i,
                                o = this,
                                u = o.c,
                                l = o.s,
                                h = o.e,
                                f = a + 4,
                                d = new v('0.5');
                            if (1 !== l || !u || !u[0])
                                return new v(
                                    !l || (l < 0 && (!u || u[0]))
                                        ? NaN
                                        : u
                                        ? o
                                        : 1 / 0,
                                );
                            if (
                                (0 == (l = Math.sqrt(+N(o))) || l == 1 / 0
                                    ? (((t = H(u)).length + h) % 2 == 0 &&
                                          (t += '0'),
                                      (l = Math.sqrt(+t)),
                                      (h = Z((h + 1) / 2) - (h < 0 || h % 2)),
                                      (n = new v(
                                          (t =
                                              l == 1 / 0
                                                  ? '5e' + h
                                                  : (t =
                                                        l.toExponential()).slice(
                                                        0,
                                                        t.indexOf('e') + 1,
                                                    ) + h),
                                      )))
                                    : (n = new v(l + '')),
                                n.c[0])
                            )
                                for ((l = (h = n.e) + f) < 3 && (l = 0); ; )
                                    if (
                                        ((i = n),
                                        (n = d.times(i.plus(r(o, i, f, 1)))),
                                        H(i.c).slice(0, l) ===
                                            (t = H(n.c)).slice(0, l))
                                    ) {
                                        if (
                                            (n.e < h && --l,
                                            '9999' !=
                                                (t = t.slice(l - 3, l + 1)) &&
                                                (s || '4999' != t))
                                        ) {
                                            (+t &&
                                                (+t.slice(1) ||
                                                    '5' != t.charAt(0))) ||
                                                (_(n, n.e + a + 2, 1),
                                                (e = !n.times(n).eq(o)));
                                            break;
                                        }
                                        if (
                                            !s &&
                                            (_(i, i.e + a + 2, 0),
                                            i.times(i).eq(o))
                                        ) {
                                            n = i;
                                            break;
                                        }
                                        (f += 4), (l += 4), (s = 1);
                                    }
                            return _(n, n.e + a + 1, c, e);
                        }),
                    (i.toExponential = function (e, t) {
                        return null != e && (X(e, 0, J), e++), b(this, e, t, 1);
                    }),
                    (i.toFixed = function (e, t) {
                        return (
                            null != e && (X(e, 0, J), (e = e + this.e + 1)),
                            b(this, e, t)
                        );
                    }),
                    (i.toFormat = function (e, t, r) {
                        var n,
                            s = this;
                        if (null == r)
                            null != e && t && 'object' == typeof t
                                ? ((r = t), (t = null))
                                : e && 'object' == typeof e
                                ? ((r = e), (e = t = null))
                                : (r = m);
                        else if ('object' != typeof r)
                            throw Error(F + 'Argument not an object: ' + r);
                        if (((n = s.toFixed(e, t)), s.c)) {
                            var i,
                                o = n.split('.'),
                                a = +r.groupSize,
                                c = +r.secondaryGroupSize,
                                u = r.groupSeparator || '',
                                l = o[0],
                                h = o[1],
                                f = s.s < 0,
                                d = f ? l.slice(1) : l,
                                p = d.length;
                            if (
                                (c && ((i = a), (a = c), (c = i), (p -= i)),
                                a > 0 && p > 0)
                            ) {
                                for (
                                    i = p % a || a, l = d.substr(0, i);
                                    i < p;
                                    i += a
                                )
                                    l += u + d.substr(i, a);
                                c > 0 && (l += u + d.slice(i)),
                                    f && (l = '-' + l);
                            }
                            n = h
                                ? l +
                                  (r.decimalSeparator || '') +
                                  ((c = +r.fractionGroupSize)
                                      ? h.replace(
                                            new RegExp(
                                                '\\d{' + c + '}\\B',
                                                'g',
                                            ),
                                            '$&' +
                                                (r.fractionGroupSeparator ||
                                                    ''),
                                        )
                                      : h)
                                : l;
                        }
                        return (r.prefix || '') + n + (r.suffix || '');
                    }),
                    (i.toFraction = function (e) {
                        var t,
                            n,
                            s,
                            i,
                            a,
                            u,
                            l,
                            h,
                            d,
                            p,
                            g,
                            m,
                            y = this,
                            w = y.c;
                        if (
                            null != e &&
                            ((!(l = new v(e)).isInteger() &&
                                (l.c || 1 !== l.s)) ||
                                l.lt(o))
                        )
                            throw Error(
                                F +
                                    'Argument ' +
                                    (l.isInteger()
                                        ? 'out of range: '
                                        : 'not an integer: ') +
                                    N(l),
                            );
                        if (!w) return new v(y);
                        for (
                            t = new v(o),
                                d = n = new v(o),
                                s = h = new v(o),
                                m = H(w),
                                a = t.e = m.length - y.e - 1,
                                t.c[0] = V[(u = a % W) < 0 ? W + u : u],
                                e =
                                    !e || l.comparedTo(t) > 0
                                        ? a > 0
                                            ? t
                                            : d
                                        : l,
                                u = f,
                                f = 1 / 0,
                                l = new v(m),
                                h.c[0] = 0;
                            (p = r(l, t, 0, 1)),
                                1 != (i = n.plus(p.times(s))).comparedTo(e);

                        )
                            (n = s),
                                (s = i),
                                (d = h.plus(p.times((i = d)))),
                                (h = i),
                                (t = l.minus(p.times((i = t)))),
                                (l = i);
                        return (
                            (i = r(e.minus(n), s, 0, 1)),
                            (h = h.plus(i.times(d))),
                            (n = n.plus(i.times(s))),
                            (h.s = d.s = y.s),
                            (g =
                                r(d, s, (a *= 2), c)
                                    .minus(y)
                                    .abs()
                                    .comparedTo(r(h, n, a, c).minus(y).abs()) <
                                1
                                    ? [d, s]
                                    : [h, n]),
                            (f = u),
                            g
                        );
                    }),
                    (i.toNumber = function () {
                        return +N(this);
                    }),
                    (i.toPrecision = function (e, t) {
                        return null != e && X(e, 1, J), b(this, e, t, 2);
                    }),
                    (i.toString = function (e) {
                        var t,
                            r = this,
                            s = r.s,
                            i = r.e;
                        return (
                            null === i
                                ? s
                                    ? ((t = 'Infinity'), s < 0 && (t = '-' + t))
                                    : (t = 'NaN')
                                : (null == e
                                      ? (t =
                                            i <= u || i >= l
                                                ? Q(H(r.c), i)
                                                : ee(H(r.c), i, '0'))
                                      : 10 === e && w
                                      ? (t = ee(
                                            H(
                                                (r = _(new v(r), a + i + 1, c))
                                                    .c,
                                            ),
                                            r.e,
                                            '0',
                                        ))
                                      : (X(e, 2, y.length, 'Base'),
                                        (t = n(
                                            ee(H(r.c), i, '0'),
                                            10,
                                            e,
                                            s,
                                            !0,
                                        ))),
                                  s < 0 && r.c[0] && (t = '-' + t)),
                            t
                        );
                    }),
                    (i.valueOf = i.toJSON =
                        function () {
                            return N(this);
                        }),
                    (i._isBigNumber = !0),
                    (i[Symbol.toStringTag] = 'BigNumber'),
                    (i[Symbol.for('nodejs.util.inspect.custom')] = i.valueOf),
                    null != t && v.set(t),
                    v
                );
            })();
            new te('67000');
            const re = () => ({
                    showIncomingTxs: !1,
                    analyticsTracking: !0,
                    localWalletMode: j.ASK_TO_SIGN,
                    autoLockTimer: 15,
                }),
                ne = 'PROD' === S.E2E,
                se = re(),
                ie = (self.__WB_MANIFEST, 'auto_lock_alarm'),
                oe = async (e) => {
                    if (e.name === ie) {
                        let e = ne ? 15 : 60 * se.autoLockTimer;
                        const t = await chrome.storage.local.get('lock_timer');
                        if (
                            (t.lock_timer &&
                                'number' === typeof t.lock_timer &&
                                (e = t.lock_timer),
                            e < 0)
                        )
                            return U('Auto Logout is disabled');
                        chrome.idle.queryState(e, (t) => {
                            T(
                                'Current idle state: '
                                    .concat(t, '. Current delay: ')
                                    .concat(e, 's'),
                            ),
                                'active' !== t && q.reset();
                        });
                    }
                },
                ae = () => {
                    chrome.alarms &&
                        (chrome.alarms.create(ie, { periodInMinutes: 1 }),
                        chrome.alarms.onAlarm.addListener(oe)),
                        U('Started Auto Lock worker');
                },
                ce = e;
            self.__WB_MANIFEST;
            U('sw: Starting service worker...'),
                (self.oninstall = () => {
                    self.skipWaiting().then(() => ({}));
                }),
                ce.start(),
                U(
                    'sw: Service worker started! ' +
                        function (e) {
                            return _().createHandlerBoundToURL(e);
                        }.length,
                ),
                chrome.scripting &&
                    chrome.scripting.getRegisteredContentScripts(
                        { ids: ['VeWorldAPI'] },
                        async (e) => {
                            0 === e.length
                                ? (await chrome.scripting.registerContentScripts(
                                      [
                                          {
                                              js: ['VeWorldAPI.js'],
                                              matches: [
                                                  'http://localhost/*',
                                                  'http://127.0.0.1/*',
                                                  'https://*/*',
                                              ],
                                              runAt: 'document_start',
                                              world: 'MAIN',
                                              id: 'VeWorldAPI',
                                          },
                                      ],
                                  ),
                                  U('VeWorldAPI registered'))
                                : U('Content script already registered', e[0]);
                        },
                    );
        })();
})();
