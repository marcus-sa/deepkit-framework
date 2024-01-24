//Copyright © 2018 Zeb Zhao, MIT License, see https://github.com/zebzhao/indent.js
// @ts-ignore
export const indent = (function (n) {
    function t(n, t) {
        var e,
            r = [];
        for (e = 0; e < n.length; e++) r.push(t(n[e], e, n));
        return r;
    }
    function e(n, t) {
        var e, r;
        for (e = 0; e < n.length; e++) if ((r = t(n[e], e, n))) return r;
        return !1;
    }
    function r(n, t, e) {
        if (d[n]) return d[n];
        var r = [];
        (d[n] = r), (e = e || '');
        for (var a = 0; a < t.length; a++)
            t[a].a.indexOf(n.toLowerCase()) !== -1 && e.indexOf(t[a].b) === -1 && r.push(t[a]);
        return r;
    }
    function a(n, a, o) {
        function h(n) {
            P = n.cursor;
            var t = n.rule,
                e = E + 1 + (t.c || 0);
            (n.line = e),
                Z.push(n),
                t.d && z[e]++,
                t.e && (S = r(t.e, g)),
                t.f && F.push(null),
                t.callback && t.callback(n, z, O);
        }
        function d() {
            var n = Z.pop(),
                t = n.line,
                e = n.rule;
            if (e.d) {
                var r = 'function' == typeof e.g ? e.g(b) : e.g,
                    a = r || 0 !== b.matchIndex ? 1 : 0;
                O[E + a] && O[E + a].push(t);
            }
            e.e && (S = null), e.f && F.pop(), (F[F.length - 1] = n);
        }
        function m(n, r, a) {
            n = n.substring(a, n.length);
            for (
                var l,
                    s,
                    i,
                    c = null,
                    u = n.length,
                    o = F[F.length - 1],
                    h = o ? o.rule.b : '',
                    d = t(Z, function (n) {
                        return n.rule.b;
                    }).join('\n'),
                    m = 0;
                m < r.length;
                m++
            )
                (i = r[m]),
                    (i.h &&
                        e(i.h, function (n) {
                            return d.indexOf(n) != -1;
                        })) ||
                        ((!i.i || (h && i.i.indexOf(h) !== -1)) &&
                            ((s = f(n, i.j, i)),
                            s.matchIndex != -1 &&
                                s.matchIndex < u &&
                                (!i.k || 0 === a) &&
                                ((u = s.matchIndex), (l = s), (c = i))));
            return {
                rule: c,
                relativeIndex: c ? u : -1,
                matchIndex: c ? u + a : -1,
                cursor: c ? a + l.cursor : -1,
                state: l ? l.state : {},
                lastMatch: o,
            };
        }
        function j(n, t, e, r) {
            n = n.substr(e, n.length);
            var a = t.rule,
                l = f(n, a.l, a, t.state, r),
                s = a.m ? l.cursor : l.matchIndex;
            return {
                endPatternIndex: l.endPatternIndex,
                matchIndex: l.matchIndex === -1 ? -1 : l.matchIndex + e,
                cursor: s === -1 ? -1 : s + e,
                state: l.state,
            };
        }
        n = n || '';
        var b,
            x,
            v,
            p,
            I,
            y = o && null != o.tabString ? o.tabString : '\t',
            k = n.split(/[\r]?\n/gi),
            w = k.length,
            A = s(w),
            z = s(w),
            O = l(w),
            Z = [],
            F = [null],
            E = 0,
            P = 0,
            S = null;
        for (
            o &&
            (o.debug = {
                buffers: { ignore: A, indent: z, dedent: O, active: Z },
            });
            E < w;

        ) {
            if (((v = k[E].trim()), (p = u(v) + '\r\n'), (I = Z[Z.length - 1]), (x = m(p, S || a, P)), Z.length))
                if (((b = j(p, I, P, x)), b.matchIndex === -1)) {
                    if (I.rule.n) {
                        (A[E] = 1), E++, (P = 0);
                        continue;
                    }
                } else if (I.rule.n || x.matchIndex === -1 || b.matchIndex <= x.matchIndex) {
                    d(), (P = b.cursor);
                    continue;
                }
            x.matchIndex !== -1 ? h(x) : (E++, (P = 0));
        }
        var $,
            q,
            R,
            T,
            M,
            C,
            H = 0,
            L = i(z),
            _ = s(w),
            B = [];
        for (M = 0; M < w; M++) {
            for (q = O[M], T = 0, C = 0; C < q.length; C++)
                (R = q[C]), R < 0 ? -R !== M && (_[-R]++, (T += 1)) : L[R] > 0 && (L[R]--, (T += R !== M));
            ($ = L[M]), (_[M] = $ > T ? 1 : $ < T ? $ - T : 0), (L[M] = $ > 0 ? 1 : 0);
        }
        for (M = 0; M < w; M++)
            1 === A[M - 1] && 1 === A[M]
                ? B.push(k[M])
                : ((H += _[M] || 0), B.push((H > 0 ? c(y, H) : '') + k[M].trim()));
        return B.join('\r\n');
    }
    function l(n) {
        for (var t = new Array(n), e = 0; e < n; e++) t[e] = [];
        return t;
    }
    function s(t) {
        if (n.Int16Array) return new Int16Array(t);
        for (var e = new Array(t), r = 0; r < t; r++) e[r] = 0;
        return e;
    }
    function i(n) {
        for (var t = s(n.length), e = 0; e < n.length; e++) t[e] = n[e];
        return t;
    }
    function c(n, t) {
        return new Array(t + 1).join(n);
    }
    function u(n) {
        return n.replace(/\\(u[0-9A-Za-z]{4}|u\{[0-9A-Za-z]{1,6}]\}|x[0-9A-Za-z]{2}|.)/g, '0');
    }
    function o(n, t, e) {
        var r = n.lastMatch;
        r && '=' === r.rule.b && e[n.line].push(-r.line);
    }
    function h(n, t, e, r) {
        var a;
        if (e.newline) {
            if (((a = n.search(/[;,=]?\r*\n/)), a !== -1)) return { matchIndex: a, length: 1 };
        } else
            (a = n.search(/[^\s\r\n\{\(\[]/)),
                (e.newline = a !== -1 && (a <= r.relativeIndex || r.relativeIndex === -1));
        return null;
    }
    function f(n, t, e, r, a) {
        r = r || {};
        for (var l, s, i = -1, c = 0, u = 0; u < t.length; u++)
            if (((s = t[u]), 'function' == typeof s)) {
                if ((l = s(n, e, r, a))) {
                    (i = l.matchIndex), (c = l.length);
                    break;
                }
            } else if ((l = n.match(s))) {
                (i = n.search(s)), (c = l[0].length);
                break;
            }
        return { endPatternIndex: u, matchIndex: i, cursor: i + c, state: r };
    }
    var d = {};
    String.prototype.trim ||
        (String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        });
    var m = /\r*\n/,
        j = ['tag', 'void-tags', 'html-tag'],
        g = [
            {
                a: 'js html',
                b: 'comment',
                j: [/\<\!\-\-/],
                l: [/\-\-\>/],
                n: !0,
                m: !0,
            },
            {
                a: 'html',
                b: 'doctype',
                j: [/\<\!doctype html>/i],
                l: [m],
                n: !0,
                m: !0,
            },
            {
                a: 'js html',
                b: 'void-tags',
                j: [
                    /\<(area|base|br|col|command|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)/i,
                ],
                l: [/>/],
                d: !0,
                m: !0,
            },
            {
                a: 'html',
                b: 'mode switch js',
                j: [
                    function (n) {
                        var t = /<script[\s>].*/i,
                            e = /<\/script>/i,
                            r = t.exec(n),
                            a = e.exec(n);
                        return r && (!a || a.index < r.index) ? { matchIndex: r.index, length: r[0].length } : null;
                    },
                ],
                l: [/<\/script>/i],
                e: 'js',
                m: !0,
                d: !0,
                f: !0,
            },
            {
                a: 'html',
                b: 'mode switch css',
                j: [
                    function (n) {
                        var t = /<style[\s>].*/i,
                            e = /<\/style>/i,
                            r = t.exec(n),
                            a = e.exec(n);
                        return r && (!a || a.index < r.index) ? { matchIndex: r.index, length: r[0].length } : null;
                    },
                ],
                l: [/<\/style>/i],
                e: 'css',
                m: !0,
                d: !0,
                f: !0,
            },
            {
                a: 'html',
                b: 'html-tag',
                j: [/<html[^A-Za-z0-9]/i],
                l: [/<\/html>/i],
                m: !0,
            },
            {
                a: 'js html',
                b: 'tag',
                j: [
                    function (n, t, e) {
                        var r = /<([A-Za-z][A-Za-z0-9\-\.]*)/,
                            a = n.match(r);
                        return a ? ((e.openingTag = a[1]), { matchIndex: a.index, length: a[0].length }) : null;
                    },
                ],
                l: [
                    function (n, t, e) {
                        var r = new RegExp('</' + e.openingTag + '>|\\s/>', 'i'),
                            a = n.match(r);
                        return a ? { matchIndex: a.index, length: a[0].length } : null;
                    },
                ],
                d: !0,
                m: !0,
            },
            { a: 'js', b: 'line-comment', j: [/\/\//], l: [m], n: !0 },
            {
                a: 'js css',
                b: 'block-comment',
                j: [/\/\*/],
                l: [/\*\//],
                n: !0,
                m: !0,
            },
            {
                a: 'js',
                b: 'regex',
                j: [
                    function (n, t) {
                        var e = /[(,=:[!&|?{};][\s]*\/[^\/]|^[\s]*\/[^\/]/,
                            r = n.search(e);
                        if (r != -1) {
                            r = n.indexOf('/', r);
                            var a = n.substring(r + 1),
                                l = f(a, t.l, t);
                            if (l.matchIndex != -1) {
                                a = a.substring(0, l.matchIndex);
                                try {
                                    return new RegExp(a), { matchIndex: r, length: 1 };
                                } catch (s) {
                                    return null;
                                }
                            }
                        }
                        return null;
                    },
                ],
                l: [
                    function (n) {
                        for (var t = 0, e = n.indexOf('/'); e != -1; )
                            try {
                                new RegExp(n.substring(0, e));
                                break;
                            } catch (r) {
                                (e = n.indexOf('/', t)), (t = e + 1);
                            }
                        return e === -1 ? null : { matchIndex: e, length: 1 };
                    },
                ],
                n: !0,
                m: !0,
            },
            {
                a: 'js html',
                b: 'quotes',
                h: j,
                j: [/"/],
                l: [/"/, m],
                n: !0,
                m: !0,
            },
            {
                a: 'js html',
                b: 'quotes',
                h: j,
                j: [/'/],
                l: [/'/, m],
                n: !0,
                m: !0,
            },
            { a: 'js css', b: 'string', j: [/(''|""|``)/], l: [/./, m] },
            {
                a: 'js css',
                b: 'string',
                j: [/\"(?=[^"])/],
                l: [/[^\\]\"/, m],
                n: !0,
                m: !0,
            },
            {
                a: 'js css',
                b: 'string',
                j: [/\'(?=[^'])/],
                l: [/[^\\]\'/, m],
                n: !0,
                m: !0,
            },
            {
                a: 'js css',
                b: 'string',
                j: [/\`(?=[^`])/],
                l: [/[^\\]\`/],
                n: !0,
                m: !0,
            },
            {
                a: 'js',
                b: 'if',
                j: [/^if\s*(?=\()/, /[\s]+if\s*(?=\()/],
                l: [/else[\s]+/, h, /[{;]/],
                d: !0,
            },
            {
                a: 'js',
                b: 'for|while',
                j: [/^(for|while)\s*(?=\()/],
                l: [h, /[{;]/],
                d: !0,
            },
            {
                a: 'js',
                b: 'else',
                j: [/else[\s]+/],
                l: [/if[^\w$]/, h, /[{;]/],
                d: !0,
            },
            {
                a: 'js css',
                b: 'bracket',
                j: [/\(\s*(var|let|const)?\s*/],
                l: [/\)/],
                d: !0,
                m: !0,
                f: !0,
            },
            {
                a: 'js',
                b: 'dot-chain',
                j: [/^\.[A-Za-z$_]/],
                l: [/[\.;]/, m],
                d: !0,
                k: !0,
                c: -1,
            },
            {
                a: 'js',
                b: 'dot-chain',
                j: [/\.\s*\r*\n/],
                l: [/[\.;})\]]/, /[^\s]\s*\r*\n/],
                d: !0,
            },
            {
                a: 'js css',
                b: 'array',
                j: [/\[/],
                l: [/\]/],
                d: !0,
                m: !0,
                f: !0,
            },
            {
                a: 'js css',
                b: 'block',
                j: [/\{/],
                l: [/\}/],
                d: !0,
                m: !0,
                f: !0,
            },
            {
                a: 'js',
                b: 'var/let/const',
                j: [/(var|let|const)[\s]*\r*\n/],
                l: [h],
                d: !0,
                g: !0,
            },
            {
                a: 'js',
                b: 'var/let/const',
                j: [/(var|let|const)\s+(?=[\w$])/],
                l: [/[,;=]/, h],
                d: !0,
            },
            {
                a: 'js',
                b: 'var/let/const',
                i: ['var/let/const', '='],
                j: [/,[\s]*\r*\n/],
                l: [/[,;]/, h],
                d: !0,
                callback: o,
            },
            {
                a: 'js',
                b: 'var/let/const',
                i: ['var/let/const', '='],
                j: [/^,/],
                l: [/[,;]/, h],
                k: !0,
                d: !0,
                c: -1,
                callback: o,
            },
            { a: 'js', b: 'equality', j: [/[=<>!]=(=)?/], l: [/./] },
            { a: 'js', b: '=', h: j, j: [/=/], l: [/[,;\)\]}]/, m] },
            { a: 'js', b: '?:', j: [/\?/], l: [/[:;]/], g: !0, d: !0 },
            {
                a: 'js',
                b: 'case',
                j: [/^(case|default)[\s:]/],
                l: [/break[\s;\r\n]/, /^return[\s;\r\n]/, /^case[\s]+/, /^default[\s:]/, /}/],
                g: function (n) {
                    return n.endPatternIndex <= 1;
                },
                d: !0,
                f: !0,
            },
            { a: 'js', b: 'semicolon', j: [/;/], l: [/./] },
        ];
    return {
        css: function (n, t) {
            return a(n, r('css', g), t);
        },
        js: function (n, t) {
            return a(n, r('js', g), t);
        },
        ts: function (n, t) {
            return a(n, r('js', g), t);
        },
        html: function (n, t) {
            var e = t && t.indentHtmlTag ? r('html', g, 'html-tag') : r('html', g);
            return a(n, e, t);
        },
    };
})(this);
