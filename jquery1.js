/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */
!function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    }
    : t(e)
}("undefined" != typeof window ? window : this, (function(e, t) {
    "use strict";
    var n = []
      , r = Object.getPrototypeOf
      , i = n.slice
      , a = n.flat ? function(e) {
        return n.flat.call(e)
    }
    : function(e) {
        return n.concat.apply([], e)
    }
      , s = n.push
      , o = n.indexOf
      , l = {}
      , c = l.toString
      , u = l.hasOwnProperty
      , d = u.toString
      , p = d.call(Object)
      , f = {}
      , h = function(e) {
        return "function" == typeof e && "number" != typeof e.nodeType && "function" != typeof e.item
    }
      , m = function(e) {
        return null != e && e === e.window
    }
      , g = e.document
      , v = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0
    };
    function y(e, t, n) {
        var r, i, a = (n = n || g).createElement("script");
        if (a.text = e,
        t)
            for (r in v)
                (i = t[r] || t.getAttribute && t.getAttribute(r)) && a.setAttribute(r, i);
        n.head.appendChild(a).parentNode.removeChild(a)
    }
    function b(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? l[c.call(e)] || "object" : typeof e
    }
    var w = "3.7.1"
      , x = /HTML$/i
      , S = function(e, t) {
        return new S.fn.init(e,t)
    };
    function T(e) {
        var t = !!e && "length"in e && e.length
          , n = b(e);
        return !h(e) && !m(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }
    function _(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    S.fn = S.prototype = {
        jquery: w,
        constructor: S,
        length: 0,
        toArray: function() {
            return i.call(this)
        },
        get: function(e) {
            return null == e ? i.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = S.merge(this.constructor(), e);
            return t.prevObject = this,
            t
        },
        each: function(e) {
            return S.each(this, e)
        },
        map: function(e) {
            return this.pushStack(S.map(this, (function(t, n) {
                return e.call(t, n, t)
            }
            )))
        },
        slice: function() {
            return this.pushStack(i.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        even: function() {
            return this.pushStack(S.grep(this, (function(e, t) {
                return (t + 1) % 2
            }
            )))
        },
        odd: function() {
            return this.pushStack(S.grep(this, (function(e, t) {
                return t % 2
            }
            )))
        },
        eq: function(e) {
            var t = this.length
              , n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: s,
        sort: n.sort,
        splice: n.splice
    },
    S.extend = S.fn.extend = function() {
        var e, t, n, r, i, a, s = arguments[0] || {}, o = 1, l = arguments.length, c = !1;
        for ("boolean" == typeof s && (c = s,
        s = arguments[o] || {},
        o++),
        "object" == typeof s || h(s) || (s = {}),
        o === l && (s = this,
        o--); o < l; o++)
            if (null != (e = arguments[o]))
                for (t in e)
                    r = e[t],
                    "__proto__" !== t && s !== r && (c && r && (S.isPlainObject(r) || (i = Array.isArray(r))) ? (n = s[t],
                    a = i && !Array.isArray(n) ? [] : i || S.isPlainObject(n) ? n : {},
                    i = !1,
                    s[t] = S.extend(c, a, r)) : void 0 !== r && (s[t] = r));
        return s
    }
    ,
    S.extend({
        expando: "jQuery" + (w + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            var t, n;
            return !(!e || "[object Object]" !== c.call(e)) && (!(t = r(e)) || "function" == typeof (n = u.call(t, "constructor") && t.constructor) && d.call(n) === p)
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        },
        globalEval: function(e, t, n) {
            y(e, {
                nonce: t && t.nonce
            }, n)
        },
        each: function(e, t) {
            var n, r = 0;
            if (T(e))
                for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++)
                    ;
            else
                for (r in e)
                    if (!1 === t.call(e[r], r, e[r]))
                        break;
            return e
        },
        text: function(e) {
            var t, n = "", r = 0, i = e.nodeType;
            if (!i)
                for (; t = e[r++]; )
                    n += S.text(t);
            return 1 === i || 11 === i ? e.textContent : 9 === i ? e.documentElement.textContent : 3 === i || 4 === i ? e.nodeValue : n
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (T(Object(e)) ? S.merge(n, "string" == typeof e ? [e] : e) : s.call(n, e)),
            n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : o.call(t, e, n)
        },
        isXMLDoc: function(e) {
            var t = e && e.namespaceURI
              , n = e && (e.ownerDocument || e).documentElement;
            return !x.test(t || n && n.nodeName || "HTML")
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++)
                e[i++] = t[r];
            return e.length = i,
            e
        },
        grep: function(e, t, n) {
            for (var r = [], i = 0, a = e.length, s = !n; i < a; i++)
                !t(e[i], i) !== s && r.push(e[i]);
            return r
        },
        map: function(e, t, n) {
            var r, i, s = 0, o = [];
            if (T(e))
                for (r = e.length; s < r; s++)
                    null != (i = t(e[s], s, n)) && o.push(i);
            else
                for (s in e)
                    null != (i = t(e[s], s, n)) && o.push(i);
            return a(o)
        },
        guid: 1,
        support: f
    }),
    "function" == typeof Symbol && (S.fn[Symbol.iterator] = n[Symbol.iterator]),
    S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), (function(e, t) {
        l["[object " + t + "]"] = t.toLowerCase()
    }
    ));
    var C = n.pop
      , E = n.sort
      , D = n.splice
      , A = "[\\x20\\t\\r\\n\\f]"
      , k = new RegExp("^" + A + "+|((?:^|[^\\\\])(?:\\\\.)*)" + A + "+$","g");
    S.contains = function(e, t) {
        var n = t && t.parentNode;
        return e === n || !(!n || 1 !== n.nodeType || !(e.contains ? e.contains(n) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(n)))
    }
    ;
    var M = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
    function L(e, t) {
        return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
    }
    S.escapeSelector = function(e) {
        return (e + "").replace(M, L)
    }
    ;
    var P = g
      , I = s;
    !function() {
        var t, r, a, s, l, c, d, p, h, m, g = I, v = S.expando, y = 0, b = 0, w = ee(), x = ee(), T = ee(), M = ee(), L = function(e, t) {
            return e === t && (l = !0),
            0
        }, O = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", N = "(?:\\\\[\\da-fA-F]{1,6}" + A + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", $ = "\\[" + A + "*(" + N + ")(?:" + A + "*([*^$|!~]?=)" + A + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + N + "))|)" + A + "*\\]", j = ":(" + N + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + $ + ")*)|.*)\\)|)", z = new RegExp(A + "+","g"), H = new RegExp("^" + A + "*," + A + "*"), F = new RegExp("^" + A + "*([>+~]|" + A + ")" + A + "*"), R = new RegExp(A + "|>"), B = new RegExp(j), W = new RegExp("^" + N + "$"), q = {
            ID: new RegExp("^#(" + N + ")"),
            CLASS: new RegExp("^\\.(" + N + ")"),
            TAG: new RegExp("^(" + N + "|[*])"),
            ATTR: new RegExp("^" + $),
            PSEUDO: new RegExp("^" + j),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + A + "*(even|odd|(([+-]|)(\\d*)n|)" + A + "*(?:([+-]|)" + A + "*(\\d+)|))" + A + "*\\)|)","i"),
            bool: new RegExp("^(?:" + O + ")$","i"),
            needsContext: new RegExp("^" + A + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + A + "*((?:-\\d)?\\d*)" + A + "*\\)|)(?=[^-]|$)","i")
        }, X = /^(?:input|select|textarea|button)$/i, G = /^h\d$/i, V = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Y = /[+~]/, U = new RegExp("\\\\[\\da-fA-F]{1,6}" + A + "?|\\\\([^\\r\\n\\f])","g"), K = function(e, t) {
            var n = "0x" + e.slice(1) - 65536;
            return t || (n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320))
        }, J = function() {
            le()
        }, Q = pe((function(e) {
            return !0 === e.disabled && _(e, "fieldset")
        }
        ), {
            dir: "parentNode",
            next: "legend"
        });
        try {
            g.apply(n = i.call(P.childNodes), P.childNodes),
            n[P.childNodes.length].nodeType
        } catch (e) {
            g = {
                apply: function(e, t) {
                    I.apply(e, i.call(t))
                },
                call: function(e) {
                    I.apply(e, i.call(arguments, 1))
                }
            }
        }
        function Z(e, t, n, r) {
            var i, a, s, o, l, u, d, m = t && t.ownerDocument, y = t ? t.nodeType : 9;
            if (n = n || [],
            "string" != typeof e || !e || 1 !== y && 9 !== y && 11 !== y)
                return n;
            if (!r && (le(t),
            t = t || c,
            p)) {
                if (11 !== y && (l = V.exec(e)))
                    if (i = l[1]) {
                        if (9 === y) {
                            if (!(s = t.getElementById(i)))
                                return n;
                            if (s.id === i)
                                return g.call(n, s),
                                n
                        } else if (m && (s = m.getElementById(i)) && Z.contains(t, s) && s.id === i)
                            return g.call(n, s),
                            n
                    } else {
                        if (l[2])
                            return g.apply(n, t.getElementsByTagName(e)),
                            n;
                        if ((i = l[3]) && t.getElementsByClassName)
                            return g.apply(n, t.getElementsByClassName(i)),
                            n
                    }
                if (!(M[e + " "] || h && h.test(e))) {
                    if (d = e,
                    m = t,
                    1 === y && (R.test(e) || F.test(e))) {
                        for ((m = Y.test(e) && oe(t.parentNode) || t) == t && f.scope || ((o = t.getAttribute("id")) ? o = S.escapeSelector(o) : t.setAttribute("id", o = v)),
                        a = (u = ue(e)).length; a--; )
                            u[a] = (o ? "#" + o : ":scope") + " " + de(u[a]);
                        d = u.join(",")
                    }
                    try {
                        return g.apply(n, m.querySelectorAll(d)),
                        n
                    } catch (t) {
                        M(e, !0)
                    } finally {
                        o === v && t.removeAttribute("id")
                    }
                }
            }
            return ye(e.replace(k, "$1"), t, n, r)
        }
        function ee() {
            var e = [];
            return function t(n, i) {
                return e.push(n + " ") > r.cacheLength && delete t[e.shift()],
                t[n + " "] = i
            }
        }
        function te(e) {
            return e[v] = !0,
            e
        }
        function ne(e) {
            var t = c.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                t = null
            }
        }
        function re(e) {
            return function(t) {
                return _(t, "input") && t.type === e
            }
        }
        function ie(e) {
            return function(t) {
                return (_(t, "input") || _(t, "button")) && t.type === e
            }
        }
        function ae(e) {
            return function(t) {
                return "form"in t ? t.parentNode && !1 === t.disabled ? "label"in t ? "label"in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && Q(t) === e : t.disabled === e : "label"in t && t.disabled === e
            }
        }
        function se(e) {
            return te((function(t) {
                return t = +t,
                te((function(n, r) {
                    for (var i, a = e([], n.length, t), s = a.length; s--; )
                        n[i = a[s]] && (n[i] = !(r[i] = n[i]))
                }
                ))
            }
            ))
        }
        function oe(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }
        function le(e) {
            var t, n = e ? e.ownerDocument || e : P;
            return n != c && 9 === n.nodeType && n.documentElement ? (d = (c = n).documentElement,
            p = !S.isXMLDoc(c),
            m = d.matches || d.webkitMatchesSelector || d.msMatchesSelector,
            d.msMatchesSelector && P != c && (t = c.defaultView) && t.top !== t && t.addEventListener("unload", J),
            f.getById = ne((function(e) {
                return d.appendChild(e).id = S.expando,
                !c.getElementsByName || !c.getElementsByName(S.expando).length
            }
            )),
            f.disconnectedMatch = ne((function(e) {
                return m.call(e, "*")
            }
            )),
            f.scope = ne((function() {
                return c.querySelectorAll(":scope")
            }
            )),
            f.cssHas = ne((function() {
                try {
                    return c.querySelector(":has(*,:jqfake)"),
                    !1
                } catch (e) {
                    return !0
                }
            }
            )),
            f.getById ? (r.filter.ID = function(e) {
                var t = e.replace(U, K);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ,
            r.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && p) {
                    var n = t.getElementById(e);
                    return n ? [n] : []
                }
            }
            ) : (r.filter.ID = function(e) {
                var t = e.replace(U, K);
                return function(e) {
                    var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }
            ,
            r.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && p) {
                    var n, r, i, a = t.getElementById(e);
                    if (a) {
                        if ((n = a.getAttributeNode("id")) && n.value === e)
                            return [a];
                        for (i = t.getElementsByName(e),
                        r = 0; a = i[r++]; )
                            if ((n = a.getAttributeNode("id")) && n.value === e)
                                return [a]
                    }
                    return []
                }
            }
            ),
            r.find.TAG = function(e, t) {
                return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : t.querySelectorAll(e)
            }
            ,
            r.find.CLASS = function(e, t) {
                if (void 0 !== t.getElementsByClassName && p)
                    return t.getElementsByClassName(e)
            }
            ,
            h = [],
            ne((function(e) {
                var t;
                d.appendChild(e).innerHTML = "<a id='" + v + "' href='' disabled='disabled'></a><select id='" + v + "-\r\\' disabled='disabled'><option selected=''></option></select>",
                e.querySelectorAll("[selected]").length || h.push("\\[" + A + "*(?:value|" + O + ")"),
                e.querySelectorAll("[id~=" + v + "-]").length || h.push("~="),
                e.querySelectorAll("a#" + v + "+*").length || h.push(".#.+[+~]"),
                e.querySelectorAll(":checked").length || h.push(":checked"),
                (t = c.createElement("input")).setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                d.appendChild(e).disabled = !0,
                2 !== e.querySelectorAll(":disabled").length && h.push(":enabled", ":disabled"),
                (t = c.createElement("input")).setAttribute("name", ""),
                e.appendChild(t),
                e.querySelectorAll("[name='']").length || h.push("\\[" + A + "*name" + A + "*=" + A + "*(?:''|\"\")")
            }
            )),
            f.cssHas || h.push(":has"),
            h = h.length && new RegExp(h.join("|")),
            L = function(e, t) {
                if (e === t)
                    return l = !0,
                    0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n || (1 & (n = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !f.sortDetached && t.compareDocumentPosition(e) === n ? e === c || e.ownerDocument == P && Z.contains(P, e) ? -1 : t === c || t.ownerDocument == P && Z.contains(P, t) ? 1 : s ? o.call(s, e) - o.call(s, t) : 0 : 4 & n ? -1 : 1)
            }
            ,
            c) : c
        }
        for (t in Z.matches = function(e, t) {
            return Z(e, null, null, t)
        }
        ,
        Z.matchesSelector = function(e, t) {
            if (le(e),
            p && !M[t + " "] && (!h || !h.test(t)))
                try {
                    var n = m.call(e, t);
                    if (n || f.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return n
                } catch (e) {
                    M(t, !0)
                }
            return Z(t, c, null, [e]).length > 0
        }
        ,
        Z.contains = function(e, t) {
            return (e.ownerDocument || e) != c && le(e),
            S.contains(e, t)
        }
        ,
        Z.attr = function(e, t) {
            (e.ownerDocument || e) != c && le(e);
            var n = r.attrHandle[t.toLowerCase()]
              , i = n && u.call(r.attrHandle, t.toLowerCase()) ? n(e, t, !p) : void 0;
            return void 0 !== i ? i : e.getAttribute(t)
        }
        ,
        Z.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        S.uniqueSort = function(e) {
            var t, n = [], r = 0, a = 0;
            if (l = !f.sortStable,
            s = !f.sortStable && i.call(e, 0),
            E.call(e, L),
            l) {
                for (; t = e[a++]; )
                    t === e[a] && (r = n.push(a));
                for (; r--; )
                    D.call(e, n[r], 1)
            }
            return s = null,
            e
        }
        ,
        S.fn.uniqueSort = function() {
            return this.pushStack(S.uniqueSort(i.apply(this)))
        }
        ,
        r = S.expr = {
            cacheLength: 50,
            createPseudo: te,
            match: q,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(U, K),
                    e[3] = (e[3] || e[4] || e[5] || "").replace(U, K),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || Z.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && Z.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return q.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && B.test(n) && (t = ue(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                    e[2] = n.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(U, K).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return _(e, t)
                    }
                },
                CLASS: function(e) {
                    var t = w[e + " "];
                    return t || (t = new RegExp("(^|" + A + ")" + e + "(" + A + "|$)")) && w(e, (function(e) {
                        return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                    }
                    ))
                },
                ATTR: function(e, t, n) {
                    return function(r) {
                        var i = Z.attr(r, e);
                        return null == i ? "!=" === t : !t || (i += "",
                        "=" === t ? i === n : "!=" === t ? i !== n : "^=" === t ? n && 0 === i.indexOf(n) : "*=" === t ? n && i.indexOf(n) > -1 : "$=" === t ? n && i.slice(-n.length) === n : "~=" === t ? (" " + i.replace(z, " ") + " ").indexOf(n) > -1 : "|=" === t && (i === n || i.slice(0, n.length + 1) === n + "-"))
                    }
                },
                CHILD: function(e, t, n, r, i) {
                    var a = "nth" !== e.slice(0, 3)
                      , s = "last" !== e.slice(-4)
                      , o = "of-type" === t;
                    return 1 === r && 0 === i ? function(e) {
                        return !!e.parentNode
                    }
                    : function(t, n, l) {
                        var c, u, d, p, f, h = a !== s ? "nextSibling" : "previousSibling", m = t.parentNode, g = o && t.nodeName.toLowerCase(), b = !l && !o, w = !1;
                        if (m) {
                            if (a) {
                                for (; h; ) {
                                    for (d = t; d = d[h]; )
                                        if (o ? _(d, g) : 1 === d.nodeType)
                                            return !1;
                                    f = h = "only" === e && !f && "nextSibling"
                                }
                                return !0
                            }
                            if (f = [s ? m.firstChild : m.lastChild],
                            s && b) {
                                for (w = (p = (c = (u = m[v] || (m[v] = {}))[e] || [])[0] === y && c[1]) && c[2],
                                d = p && m.childNodes[p]; d = ++p && d && d[h] || (w = p = 0) || f.pop(); )
                                    if (1 === d.nodeType && ++w && d === t) {
                                        u[e] = [y, p, w];
                                        break
                                    }
                            } else if (b && (w = p = (c = (u = t[v] || (t[v] = {}))[e] || [])[0] === y && c[1]),
                            !1 === w)
                                for (; (d = ++p && d && d[h] || (w = p = 0) || f.pop()) && (!(o ? _(d, g) : 1 === d.nodeType) || !++w || (b && ((u = d[v] || (d[v] = {}))[e] = [y, w]),
                                d !== t)); )
                                    ;
                            return (w -= i) === r || w % r == 0 && w / r >= 0
                        }
                    }
                },
                PSEUDO: function(e, t) {
                    var n, i = r.pseudos[e] || r.setFilters[e.toLowerCase()] || Z.error("unsupported pseudo: " + e);
                    return i[v] ? i(t) : i.length > 1 ? (n = [e, e, "", t],
                    r.setFilters.hasOwnProperty(e.toLowerCase()) ? te((function(e, n) {
                        for (var r, a = i(e, t), s = a.length; s--; )
                            e[r = o.call(e, a[s])] = !(n[r] = a[s])
                    }
                    )) : function(e) {
                        return i(e, 0, n)
                    }
                    ) : i
                }
            },
            pseudos: {
                not: te((function(e) {
                    var t = []
                      , n = []
                      , r = ve(e.replace(k, "$1"));
                    return r[v] ? te((function(e, t, n, i) {
                        for (var a, s = r(e, null, i, []), o = e.length; o--; )
                            (a = s[o]) && (e[o] = !(t[o] = a))
                    }
                    )) : function(e, i, a) {
                        return t[0] = e,
                        r(t, null, a, n),
                        t[0] = null,
                        !n.pop()
                    }
                }
                )),
                has: te((function(e) {
                    return function(t) {
                        return Z(e, t).length > 0
                    }
                }
                )),
                contains: te((function(e) {
                    return e = e.replace(U, K),
                    function(t) {
                        return (t.textContent || S.text(t)).indexOf(e) > -1
                    }
                }
                )),
                lang: te((function(e) {
                    return W.test(e || "") || Z.error("unsupported lang: " + e),
                    e = e.replace(U, K).toLowerCase(),
                    function(t) {
                        var n;
                        do {
                            if (n = p ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                                return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                        } while ((t = t.parentNode) && 1 === t.nodeType);
                        return !1
                    }
                }
                )),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === d
                },
                focus: function(e) {
                    return e === function() {
                        try {
                            return c.activeElement
                        } catch (e) {}
                    }() && c.hasFocus() && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: ae(!1),
                disabled: ae(!0),
                checked: function(e) {
                    return _(e, "input") && !!e.checked || _(e, "option") && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    !0 === e.selected
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !r.pseudos.empty(e)
                },
                header: function(e) {
                    return G.test(e.nodeName)
                },
                input: function(e) {
                    return X.test(e.nodeName)
                },
                button: function(e) {
                    return _(e, "input") && "button" === e.type || _(e, "button")
                },
                text: function(e) {
                    var t;
                    return _(e, "input") && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: se((function() {
                    return [0]
                }
                )),
                last: se((function(e, t) {
                    return [t - 1]
                }
                )),
                eq: se((function(e, t, n) {
                    return [n < 0 ? n + t : n]
                }
                )),
                even: se((function(e, t) {
                    for (var n = 0; n < t; n += 2)
                        e.push(n);
                    return e
                }
                )),
                odd: se((function(e, t) {
                    for (var n = 1; n < t; n += 2)
                        e.push(n);
                    return e
                }
                )),
                lt: se((function(e, t, n) {
                    var r;
                    for (r = n < 0 ? n + t : n > t ? t : n; --r >= 0; )
                        e.push(r);
                    return e
                }
                )),
                gt: se((function(e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t; )
                        e.push(r);
                    return e
                }
                ))
            }
        },
        r.pseudos.nth = r.pseudos.eq,
        {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            r.pseudos[t] = re(t);
        for (t in {
            submit: !0,
            reset: !0
        })
            r.pseudos[t] = ie(t);
        function ce() {}
        function ue(e, t) {
            var n, i, a, s, o, l, c, u = x[e + " "];
            if (u)
                return t ? 0 : u.slice(0);
            for (o = e,
            l = [],
            c = r.preFilter; o; ) {
                for (s in n && !(i = H.exec(o)) || (i && (o = o.slice(i[0].length) || o),
                l.push(a = [])),
                n = !1,
                (i = F.exec(o)) && (n = i.shift(),
                a.push({
                    value: n,
                    type: i[0].replace(k, " ")
                }),
                o = o.slice(n.length)),
                r.filter)
                    !(i = q[s].exec(o)) || c[s] && !(i = c[s](i)) || (n = i.shift(),
                    a.push({
                        value: n,
                        type: s,
                        matches: i
                    }),
                    o = o.slice(n.length));
                if (!n)
                    break
            }
            return t ? o.length : o ? Z.error(e) : x(e, l).slice(0)
        }
        function de(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++)
                r += e[t].value;
            return r
        }
        function pe(e, t, n) {
            var r = t.dir
              , i = t.next
              , a = i || r
              , s = n && "parentNode" === a
              , o = b++;
            return t.first ? function(t, n, i) {
                for (; t = t[r]; )
                    if (1 === t.nodeType || s)
                        return e(t, n, i);
                return !1
            }
            : function(t, n, l) {
                var c, u, d = [y, o];
                if (l) {
                    for (; t = t[r]; )
                        if ((1 === t.nodeType || s) && e(t, n, l))
                            return !0
                } else
                    for (; t = t[r]; )
                        if (1 === t.nodeType || s)
                            if (u = t[v] || (t[v] = {}),
                            i && _(t, i))
                                t = t[r] || t;
                            else {
                                if ((c = u[a]) && c[0] === y && c[1] === o)
                                    return d[2] = c[2];
                                if (u[a] = d,
                                d[2] = e(t, n, l))
                                    return !0
                            }
                return !1
            }
        }
        function fe(e) {
            return e.length > 1 ? function(t, n, r) {
                for (var i = e.length; i--; )
                    if (!e[i](t, n, r))
                        return !1;
                return !0
            }
            : e[0]
        }
        function he(e, t, n, r, i) {
            for (var a, s = [], o = 0, l = e.length, c = null != t; o < l; o++)
                (a = e[o]) && (n && !n(a, r, i) || (s.push(a),
                c && t.push(o)));
            return s
        }
        function me(e, t, n, r, i, a) {
            return r && !r[v] && (r = me(r)),
            i && !i[v] && (i = me(i, a)),
            te((function(a, s, l, c) {
                var u, d, p, f, h = [], m = [], v = s.length, y = a || function(e, t, n) {
                    for (var r = 0, i = t.length; r < i; r++)
                        Z(e, t[r], n);
                    return n
                }(t || "*", l.nodeType ? [l] : l, []), b = !e || !a && t ? y : he(y, h, e, l, c);
                if (n ? n(b, f = i || (a ? e : v || r) ? [] : s, l, c) : f = b,
                r)
                    for (u = he(f, m),
                    r(u, [], l, c),
                    d = u.length; d--; )
                        (p = u[d]) && (f[m[d]] = !(b[m[d]] = p));
                if (a) {
                    if (i || e) {
                        if (i) {
                            for (u = [],
                            d = f.length; d--; )
                                (p = f[d]) && u.push(b[d] = p);
                            i(null, f = [], u, c)
                        }
                        for (d = f.length; d--; )
                            (p = f[d]) && (u = i ? o.call(a, p) : h[d]) > -1 && (a[u] = !(s[u] = p))
                    }
                } else
                    f = he(f === s ? f.splice(v, f.length) : f),
                    i ? i(null, s, f, c) : g.apply(s, f)
            }
            ))
        }
        function ge(e) {
            for (var t, n, i, s = e.length, l = r.relative[e[0].type], c = l || r.relative[" "], u = l ? 1 : 0, d = pe((function(e) {
                return e === t
            }
            ), c, !0), p = pe((function(e) {
                return o.call(t, e) > -1
            }
            ), c, !0), f = [function(e, n, r) {
                var i = !l && (r || n != a) || ((t = n).nodeType ? d(e, n, r) : p(e, n, r));
                return t = null,
                i
            }
            ]; u < s; u++)
                if (n = r.relative[e[u].type])
                    f = [pe(fe(f), n)];
                else {
                    if ((n = r.filter[e[u].type].apply(null, e[u].matches))[v]) {
                        for (i = ++u; i < s && !r.relative[e[i].type]; i++)
                            ;
                        return me(u > 1 && fe(f), u > 1 && de(e.slice(0, u - 1).concat({
                            value: " " === e[u - 2].type ? "*" : ""
                        })).replace(k, "$1"), n, u < i && ge(e.slice(u, i)), i < s && ge(e = e.slice(i)), i < s && de(e))
                    }
                    f.push(n)
                }
            return fe(f)
        }
        function ve(e, t) {
            var n, i = [], s = [], o = T[e + " "];
            if (!o) {
                for (t || (t = ue(e)),
                n = t.length; n--; )
                    (o = ge(t[n]))[v] ? i.push(o) : s.push(o);
                o = T(e, function(e, t) {
                    var n = t.length > 0
                      , i = e.length > 0
                      , s = function(s, o, l, u, d) {
                        var f, h, m, v = 0, b = "0", w = s && [], x = [], T = a, _ = s || i && r.find.TAG("*", d), E = y += null == T ? 1 : Math.random() || .1, D = _.length;
                        for (d && (a = o == c || o || d); b !== D && null != (f = _[b]); b++) {
                            if (i && f) {
                                for (h = 0,
                                o || f.ownerDocument == c || (le(f),
                                l = !p); m = e[h++]; )
                                    if (m(f, o || c, l)) {
                                        g.call(u, f);
                                        break
                                    }
                                d && (y = E)
                            }
                            n && ((f = !m && f) && v--,
                            s && w.push(f))
                        }
                        if (v += b,
                        n && b !== v) {
                            for (h = 0; m = t[h++]; )
                                m(w, x, o, l);
                            if (s) {
                                if (v > 0)
                                    for (; b--; )
                                        w[b] || x[b] || (x[b] = C.call(u));
                                x = he(x)
                            }
                            g.apply(u, x),
                            d && !s && x.length > 0 && v + t.length > 1 && S.uniqueSort(u)
                        }
                        return d && (y = E,
                        a = T),
                        w
                    };
                    return n ? te(s) : s
                }(s, i)),
                o.selector = e
            }
            return o
        }
        function ye(e, t, n, i) {
            var a, s, o, l, c, u = "function" == typeof e && e, d = !i && ue(e = u.selector || e);
            if (n = n || [],
            1 === d.length) {
                if ((s = d[0] = d[0].slice(0)).length > 2 && "ID" === (o = s[0]).type && 9 === t.nodeType && p && r.relative[s[1].type]) {
                    if (!(t = (r.find.ID(o.matches[0].replace(U, K), t) || [])[0]))
                        return n;
                    u && (t = t.parentNode),
                    e = e.slice(s.shift().value.length)
                }
                for (a = q.needsContext.test(e) ? 0 : s.length; a-- && (o = s[a],
                !r.relative[l = o.type]); )
                    if ((c = r.find[l]) && (i = c(o.matches[0].replace(U, K), Y.test(s[0].type) && oe(t.parentNode) || t))) {
                        if (s.splice(a, 1),
                        !(e = i.length && de(s)))
                            return g.apply(n, i),
                            n;
                        break
                    }
            }
            return (u || ve(e, d))(i, t, !p, n, !t || Y.test(e) && oe(t.parentNode) || t),
            n
        }
        ce.prototype = r.filters = r.pseudos,
        r.setFilters = new ce,
        f.sortStable = v.split("").sort(L).join("") === v,
        le(),
        f.sortDetached = ne((function(e) {
            return 1 & e.compareDocumentPosition(c.createElement("fieldset"))
        }
        )),
        S.find = Z,
        S.expr[":"] = S.expr.pseudos,
        S.unique = S.uniqueSort,
        Z.compile = ve,
        Z.select = ye,
        Z.setDocument = le,
        Z.tokenize = ue,
        Z.escape = S.escapeSelector,
        Z.getText = S.text,
        Z.isXML = S.isXMLDoc,
        Z.selectors = S.expr,
        Z.support = S.support,
        Z.uniqueSort = S.uniqueSort
    }();
    var O = function(e, t, n) {
        for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
            if (1 === e.nodeType) {
                if (i && S(e).is(n))
                    break;
                r.push(e)
            }
        return r
    }
      , N = function(e, t) {
        for (var n = []; e; e = e.nextSibling)
            1 === e.nodeType && e !== t && n.push(e);
        return n
    }
      , $ = S.expr.match.needsContext
      , j = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function z(e, t, n) {
        return h(t) ? S.grep(e, (function(e, r) {
            return !!t.call(e, r, e) !== n
        }
        )) : t.nodeType ? S.grep(e, (function(e) {
            return e === t !== n
        }
        )) : "string" != typeof t ? S.grep(e, (function(e) {
            return o.call(t, e) > -1 !== n
        }
        )) : S.filter(t, e, n)
    }
    S.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === r.nodeType ? S.find.matchesSelector(r, e) ? [r] : [] : S.find.matches(e, S.grep(t, (function(e) {
            return 1 === e.nodeType
        }
        )))
    }
    ,
    S.fn.extend({
        find: function(e) {
            var t, n, r = this.length, i = this;
            if ("string" != typeof e)
                return this.pushStack(S(e).filter((function() {
                    for (t = 0; t < r; t++)
                        if (S.contains(i[t], this))
                            return !0
                }
                )));
            for (n = this.pushStack([]),
            t = 0; t < r; t++)
                S.find(e, i[t], n);
            return r > 1 ? S.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(z(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(z(this, e || [], !0))
        },
        is: function(e) {
            return !!z(this, "string" == typeof e && $.test(e) ? S(e) : e || [], !1).length
        }
    });
    var H, F = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (S.fn.init = function(e, t, n) {
        var r, i;
        if (!e)
            return this;
        if (n = n || H,
        "string" == typeof e) {
            if (!(r = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : F.exec(e)) || !r[1] && t)
                return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (r[1]) {
                if (t = t instanceof S ? t[0] : t,
                S.merge(this, S.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : g, !0)),
                j.test(r[1]) && S.isPlainObject(t))
                    for (r in t)
                        h(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this
            }
            return (i = g.getElementById(r[2])) && (this[0] = i,
            this.length = 1),
            this
        }
        return e.nodeType ? (this[0] = e,
        this.length = 1,
        this) : h(e) ? void 0 !== n.ready ? n.ready(e) : e(S) : S.makeArray(e, this)
    }
    ).prototype = S.fn,
    H = S(g);
    var R = /^(?:parents|prev(?:Until|All))/
      , B = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    function W(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; )
            ;
        return e
    }
    S.fn.extend({
        has: function(e) {
            var t = S(e, this)
              , n = t.length;
            return this.filter((function() {
                for (var e = 0; e < n; e++)
                    if (S.contains(this, t[e]))
                        return !0
            }
            ))
        },
        closest: function(e, t) {
            var n, r = 0, i = this.length, a = [], s = "string" != typeof e && S(e);
            if (!$.test(e))
                for (; r < i; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && S.find.matchesSelector(n, e))) {
                            a.push(n);
                            break
                        }
            return this.pushStack(a.length > 1 ? S.uniqueSort(a) : a)
        },
        index: function(e) {
            return e ? "string" == typeof e ? o.call(S(e), this[0]) : o.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    S.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return O(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return O(e, "parentNode", n)
        },
        next: function(e) {
            return W(e, "nextSibling")
        },
        prev: function(e) {
            return W(e, "previousSibling")
        },
        nextAll: function(e) {
            return O(e, "nextSibling")
        },
        prevAll: function(e) {
            return O(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return O(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return O(e, "previousSibling", n)
        },
        siblings: function(e) {
            return N((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return N(e.firstChild)
        },
        contents: function(e) {
            return null != e.contentDocument && r(e.contentDocument) ? e.contentDocument : (_(e, "template") && (e = e.content || e),
            S.merge([], e.childNodes))
        }
    }, (function(e, t) {
        S.fn[e] = function(n, r) {
            var i = S.map(this, t, n);
            return "Until" !== e.slice(-5) && (r = n),
            r && "string" == typeof r && (i = S.filter(r, i)),
            this.length > 1 && (B[e] || S.uniqueSort(i),
            R.test(e) && i.reverse()),
            this.pushStack(i)
        }
    }
    ));
    var q = /[^\x20\t\r\n\f]+/g;
    function X(e) {
        return e
    }
    function G(e) {
        throw e
    }
    function V(e, t, n, r) {
        var i;
        try {
            e && h(i = e.promise) ? i.call(e).done(t).fail(n) : e && h(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }
    S.Callbacks = function(e) {
        e = "string" == typeof e ? function(e) {
            var t = {};
            return S.each(e.match(q) || [], (function(e, n) {
                t[n] = !0
            }
            )),
            t
        }(e) : S.extend({}, e);
        var t, n, r, i, a = [], s = [], o = -1, l = function() {
            for (i = i || e.once,
            r = t = !0; s.length; o = -1)
                for (n = s.shift(); ++o < a.length; )
                    !1 === a[o].apply(n[0], n[1]) && e.stopOnFalse && (o = a.length,
                    n = !1);
            e.memory || (n = !1),
            t = !1,
            i && (a = n ? [] : "")
        }, c = {
            add: function() {
                return a && (n && !t && (o = a.length - 1,
                s.push(n)),
                function t(n) {
                    S.each(n, (function(n, r) {
                        h(r) ? e.unique && c.has(r) || a.push(r) : r && r.length && "string" !== b(r) && t(r)
                    }
                    ))
                }(arguments),
                n && !t && l()),
                this
            },
            remove: function() {
                return S.each(arguments, (function(e, t) {
                    for (var n; (n = S.inArray(t, a, n)) > -1; )
                        a.splice(n, 1),
                        n <= o && o--
                }
                )),
                this
            },
            has: function(e) {
                return e ? S.inArray(e, a) > -1 : a.length > 0
            },
            empty: function() {
                return a && (a = []),
                this
            },
            disable: function() {
                return i = s = [],
                a = n = "",
                this
            },
            disabled: function() {
                return !a
            },
            lock: function() {
                return i = s = [],
                n || t || (a = n = ""),
                this
            },
            locked: function() {
                return !!i
            },
            fireWith: function(e, n) {
                return i || (n = [e, (n = n || []).slice ? n.slice() : n],
                s.push(n),
                t || l()),
                this
            },
            fire: function() {
                return c.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!r
            }
        };
        return c
    }
    ,
    S.extend({
        Deferred: function(t) {
            var n = [["notify", "progress", S.Callbacks("memory"), S.Callbacks("memory"), 2], ["resolve", "done", S.Callbacks("once memory"), S.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", S.Callbacks("once memory"), S.Callbacks("once memory"), 1, "rejected"]]
              , r = "pending"
              , i = {
                state: function() {
                    return r
                },
                always: function() {
                    return a.done(arguments).fail(arguments),
                    this
                },
                catch: function(e) {
                    return i.then(null, e)
                },
                pipe: function() {
                    var e = arguments;
                    return S.Deferred((function(t) {
                        S.each(n, (function(n, r) {
                            var i = h(e[r[4]]) && e[r[4]];
                            a[r[1]]((function() {
                                var e = i && i.apply(this, arguments);
                                e && h(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[r[0] + "With"](this, i ? [e] : arguments)
                            }
                            ))
                        }
                        )),
                        e = null
                    }
                    )).promise()
                },
                then: function(t, r, i) {
                    var a = 0;
                    function s(t, n, r, i) {
                        return function() {
                            var o = this
                              , l = arguments
                              , c = function() {
                                var e, c;
                                if (!(t < a)) {
                                    if ((e = r.apply(o, l)) === n.promise())
                                        throw new TypeError("Thenable self-resolution");
                                    c = e && ("object" == typeof e || "function" == typeof e) && e.then,
                                    h(c) ? i ? c.call(e, s(a, n, X, i), s(a, n, G, i)) : (a++,
                                    c.call(e, s(a, n, X, i), s(a, n, G, i), s(a, n, X, n.notifyWith))) : (r !== X && (o = void 0,
                                    l = [e]),
                                    (i || n.resolveWith)(o, l))
                                }
                            }
                              , u = i ? c : function() {
                                try {
                                    c()
                                } catch (e) {
                                    S.Deferred.exceptionHook && S.Deferred.exceptionHook(e, u.error),
                                    t + 1 >= a && (r !== G && (o = void 0,
                                    l = [e]),
                                    n.rejectWith(o, l))
                                }
                            }
                            ;
                            t ? u() : (S.Deferred.getErrorHook ? u.error = S.Deferred.getErrorHook() : S.Deferred.getStackHook && (u.error = S.Deferred.getStackHook()),
                            e.setTimeout(u))
                        }
                    }
                    return S.Deferred((function(e) {
                        n[0][3].add(s(0, e, h(i) ? i : X, e.notifyWith)),
                        n[1][3].add(s(0, e, h(t) ? t : X)),
                        n[2][3].add(s(0, e, h(r) ? r : G))
                    }
                    )).promise()
                },
                promise: function(e) {
                    return null != e ? S.extend(e, i) : i
                }
            }
              , a = {};
            return S.each(n, (function(e, t) {
                var s = t[2]
                  , o = t[5];
                i[t[1]] = s.add,
                o && s.add((function() {
                    r = o
                }
                ), n[3 - e][2].disable, n[3 - e][3].disable, n[0][2].lock, n[0][3].lock),
                s.add(t[3].fire),
                a[t[0]] = function() {
                    return a[t[0] + "With"](this === a ? void 0 : this, arguments),
                    this
                }
                ,
                a[t[0] + "With"] = s.fireWith
            }
            )),
            i.promise(a),
            t && t.call(a, a),
            a
        },
        when: function(e) {
            var t = arguments.length
              , n = t
              , r = Array(n)
              , a = i.call(arguments)
              , s = S.Deferred()
              , o = function(e) {
                return function(n) {
                    r[e] = this,
                    a[e] = arguments.length > 1 ? i.call(arguments) : n,
                    --t || s.resolveWith(r, a)
                }
            };
            if (t <= 1 && (V(e, s.done(o(n)).resolve, s.reject, !t),
            "pending" === s.state() || h(a[n] && a[n].then)))
                return s.then();
            for (; n--; )
                V(a[n], o(n), s.reject);
            return s.promise()
        }
    });
    var Y = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    S.Deferred.exceptionHook = function(t, n) {
        e.console && e.console.warn && t && Y.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
    }
    ,
    S.readyException = function(t) {
        e.setTimeout((function() {
            throw t
        }
        ))
    }
    ;
    var U = S.Deferred();
    function K() {
        g.removeEventListener("DOMContentLoaded", K),
        e.removeEventListener("load", K),
        S.ready()
    }
    S.fn.ready = function(e) {
        return U.then(e).catch((function(e) {
            S.readyException(e)
        }
        )),
        this
    }
    ,
    S.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --S.readyWait : S.isReady) || (S.isReady = !0,
            !0 !== e && --S.readyWait > 0 || U.resolveWith(g, [S]))
        }
    }),
    S.ready.then = U.then,
    "complete" === g.readyState || "loading" !== g.readyState && !g.documentElement.doScroll ? e.setTimeout(S.ready) : (g.addEventListener("DOMContentLoaded", K),
    e.addEventListener("load", K));
    var J = function(e, t, n, r, i, a, s) {
        var o = 0
          , l = e.length
          , c = null == n;
        if ("object" === b(n))
            for (o in i = !0,
            n)
                J(e, t, o, n[o], !0, a, s);
        else if (void 0 !== r && (i = !0,
        h(r) || (s = !0),
        c && (s ? (t.call(e, r),
        t = null) : (c = t,
        t = function(e, t, n) {
            return c.call(S(e), n)
        }
        )),
        t))
            for (; o < l; o++)
                t(e[o], n, s ? r : r.call(e[o], o, t(e[o], n)));
        return i ? e : c ? t.call(e) : l ? t(e[0], n) : a
    }
      , Q = /^-ms-/
      , Z = /-([a-z])/g;
    function ee(e, t) {
        return t.toUpperCase()
    }
    function te(e) {
        return e.replace(Q, "ms-").replace(Z, ee)
    }
    var ne = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };
    function re() {
        this.expando = S.expando + re.uid++
    }
    re.uid = 1,
    re.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {},
            ne(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))),
            t
        },
        set: function(e, t, n) {
            var r, i = this.cache(e);
            if ("string" == typeof t)
                i[te(t)] = n;
            else
                for (r in t)
                    i[te(r)] = t[r];
            return i
        },
        get: function(e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][te(t)]
        },
        access: function(e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n),
            void 0 !== n ? n : t)
        },
        remove: function(e, t) {
            var n, r = e[this.expando];
            if (void 0 !== r) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(te) : (t = te(t))in r ? [t] : t.match(q) || []).length;
                    for (; n--; )
                        delete r[t[n]]
                }
                (void 0 === t || S.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function(e) {
            var t = e[this.expando];
            return void 0 !== t && !S.isEmptyObject(t)
        }
    };
    var ie = new re
      , ae = new re
      , se = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , oe = /[A-Z]/g;
    function le(e, t, n) {
        var r;
        if (void 0 === n && 1 === e.nodeType)
            if (r = "data-" + t.replace(oe, "-$&").toLowerCase(),
            "string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = function(e) {
                        return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : se.test(e) ? JSON.parse(e) : e)
                    }(n)
                } catch (e) {}
                ae.set(e, t, n)
            } else
                n = void 0;
        return n
    }
    S.extend({
        hasData: function(e) {
            return ae.hasData(e) || ie.hasData(e)
        },
        data: function(e, t, n) {
            return ae.access(e, t, n)
        },
        removeData: function(e, t) {
            ae.remove(e, t)
        },
        _data: function(e, t, n) {
            return ie.access(e, t, n)
        },
        _removeData: function(e, t) {
            ie.remove(e, t)
        }
    }),
    S.fn.extend({
        data: function(e, t) {
            var n, r, i, a = this[0], s = a && a.attributes;
            if (void 0 === e) {
                if (this.length && (i = ae.get(a),
                1 === a.nodeType && !ie.get(a, "hasDataAttrs"))) {
                    for (n = s.length; n--; )
                        s[n] && 0 === (r = s[n].name).indexOf("data-") && (r = te(r.slice(5)),
                        le(a, r, i[r]));
                    ie.set(a, "hasDataAttrs", !0)
                }
                return i
            }
            return "object" == typeof e ? this.each((function() {
                ae.set(this, e)
            }
            )) : J(this, (function(t) {
                var n;
                if (a && void 0 === t)
                    return void 0 !== (n = ae.get(a, e)) || void 0 !== (n = le(a, e)) ? n : void 0;
                this.each((function() {
                    ae.set(this, e, t)
                }
                ))
            }
            ), null, t, arguments.length > 1, null, !0)
        },
        removeData: function(e) {
            return this.each((function() {
                ae.remove(this, e)
            }
            ))
        }
    }),
    S.extend({
        queue: function(e, t, n) {
            var r;
            if (e)
                return t = (t || "fx") + "queue",
                r = ie.get(e, t),
                n && (!r || Array.isArray(n) ? r = ie.access(e, t, S.makeArray(n)) : r.push(n)),
                r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = S.queue(e, t)
              , r = n.length
              , i = n.shift()
              , a = S._queueHooks(e, t);
            "inprogress" === i && (i = n.shift(),
            r--),
            i && ("fx" === t && n.unshift("inprogress"),
            delete a.stop,
            i.call(e, (function() {
                S.dequeue(e, t)
            }
            ), a)),
            !r && a && a.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return ie.get(e, n) || ie.access(e, n, {
                empty: S.Callbacks("once memory").add((function() {
                    ie.remove(e, [t + "queue", n])
                }
                ))
            })
        }
    }),
    S.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e,
            e = "fx",
            n--),
            arguments.length < n ? S.queue(this[0], e) : void 0 === t ? this : this.each((function() {
                var n = S.queue(this, e, t);
                S._queueHooks(this, e),
                "fx" === e && "inprogress" !== n[0] && S.dequeue(this, e)
            }
            ))
        },
        dequeue: function(e) {
            return this.each((function() {
                S.dequeue(this, e)
            }
            ))
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1, i = S.Deferred(), a = this, s = this.length, o = function() {
                --r || i.resolveWith(a, [a])
            };
            for ("string" != typeof e && (t = e,
            e = void 0),
            e = e || "fx"; s--; )
                (n = ie.get(a[s], e + "queueHooks")) && n.empty && (r++,
                n.empty.add(o));
            return o(),
            i.promise(t)
        }
    });
    var ce = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , ue = new RegExp("^(?:([+-])=|)(" + ce + ")([a-z%]*)$","i")
      , de = ["Top", "Right", "Bottom", "Left"]
      , pe = g.documentElement
      , fe = function(e) {
        return S.contains(e.ownerDocument, e)
    }
      , he = {
        composed: !0
    };
    pe.getRootNode && (fe = function(e) {
        return S.contains(e.ownerDocument, e) || e.getRootNode(he) === e.ownerDocument
    }
    );
    var me = function(e, t) {
        return "none" === (e = t || e).style.display || "" === e.style.display && fe(e) && "none" === S.css(e, "display")
    };
    function ge(e, t, n, r) {
        var i, a, s = 20, o = r ? function() {
            return r.cur()
        }
        : function() {
            return S.css(e, t, "")
        }
        , l = o(), c = n && n[3] || (S.cssNumber[t] ? "" : "px"), u = e.nodeType && (S.cssNumber[t] || "px" !== c && +l) && ue.exec(S.css(e, t));
        if (u && u[3] !== c) {
            for (l /= 2,
            c = c || u[3],
            u = +l || 1; s--; )
                S.style(e, t, u + c),
                (1 - a) * (1 - (a = o() / l || .5)) <= 0 && (s = 0),
                u /= a;
            u *= 2,
            S.style(e, t, u + c),
            n = n || []
        }
        return n && (u = +u || +l || 0,
        i = n[1] ? u + (n[1] + 1) * n[2] : +n[2],
        r && (r.unit = c,
        r.start = u,
        r.end = i)),
        i
    }
    var ve = {};
    function ye(e) {
        var t, n = e.ownerDocument, r = e.nodeName, i = ve[r];
        return i || (t = n.body.appendChild(n.createElement(r)),
        i = S.css(t, "display"),
        t.parentNode.removeChild(t),
        "none" === i && (i = "block"),
        ve[r] = i,
        i)
    }
    function be(e, t) {
        for (var n, r, i = [], a = 0, s = e.length; a < s; a++)
            (r = e[a]).style && (n = r.style.display,
            t ? ("none" === n && (i[a] = ie.get(r, "display") || null,
            i[a] || (r.style.display = "")),
            "" === r.style.display && me(r) && (i[a] = ye(r))) : "none" !== n && (i[a] = "none",
            ie.set(r, "display", n)));
        for (a = 0; a < s; a++)
            null != i[a] && (e[a].style.display = i[a]);
        return e
    }
    S.fn.extend({
        show: function() {
            return be(this, !0)
        },
        hide: function() {
            return be(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each((function() {
                me(this) ? S(this).show() : S(this).hide()
            }
            ))
        }
    });
    var we, xe, Se = /^(?:checkbox|radio)$/i, Te = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, _e = /^$|^module$|\/(?:java|ecma)script/i;
    we = g.createDocumentFragment().appendChild(g.createElement("div")),
    (xe = g.createElement("input")).setAttribute("type", "radio"),
    xe.setAttribute("checked", "checked"),
    xe.setAttribute("name", "t"),
    we.appendChild(xe),
    f.checkClone = we.cloneNode(!0).cloneNode(!0).lastChild.checked,
    we.innerHTML = "<textarea>x</textarea>",
    f.noCloneChecked = !!we.cloneNode(!0).lastChild.defaultValue,
    we.innerHTML = "<option></option>",
    f.option = !!we.lastChild;
    var Ce = {
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    function Ee(e, t) {
        var n;
        return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [],
        void 0 === t || t && _(e, t) ? S.merge([e], n) : n
    }
    function De(e, t) {
        for (var n = 0, r = e.length; n < r; n++)
            ie.set(e[n], "globalEval", !t || ie.get(t[n], "globalEval"))
    }
    Ce.tbody = Ce.tfoot = Ce.colgroup = Ce.caption = Ce.thead,
    Ce.th = Ce.td,
    f.option || (Ce.optgroup = Ce.option = [1, "<select multiple='multiple'>", "</select>"]);
    var Ae = /<|&#?\w+;/;
    function ke(e, t, n, r, i) {
        for (var a, s, o, l, c, u, d = t.createDocumentFragment(), p = [], f = 0, h = e.length; f < h; f++)
            if ((a = e[f]) || 0 === a)
                if ("object" === b(a))
                    S.merge(p, a.nodeType ? [a] : a);
                else if (Ae.test(a)) {
                    for (s = s || d.appendChild(t.createElement("div")),
                    o = (Te.exec(a) || ["", ""])[1].toLowerCase(),
                    l = Ce[o] || Ce._default,
                    s.innerHTML = l[1] + S.htmlPrefilter(a) + l[2],
                    u = l[0]; u--; )
                        s = s.lastChild;
                    S.merge(p, s.childNodes),
                    (s = d.firstChild).textContent = ""
                } else
                    p.push(t.createTextNode(a));
        for (d.textContent = "",
        f = 0; a = p[f++]; )
            if (r && S.inArray(a, r) > -1)
                i && i.push(a);
            else if (c = fe(a),
            s = Ee(d.appendChild(a), "script"),
            c && De(s),
            n)
                for (u = 0; a = s[u++]; )
                    _e.test(a.type || "") && n.push(a);
        return d
    }
    var Me = /^([^.]*)(?:\.(.+)|)/;
    function Le() {
        return !0
    }
    function Pe() {
        return !1
    }
    function Ie(e, t, n, r, i, a) {
        var s, o;
        if ("object" == typeof t) {
            for (o in "string" != typeof n && (r = r || n,
            n = void 0),
            t)
                Ie(e, o, n, r, t[o], a);
            return e
        }
        if (null == r && null == i ? (i = n,
        r = n = void 0) : null == i && ("string" == typeof n ? (i = r,
        r = void 0) : (i = r,
        r = n,
        n = void 0)),
        !1 === i)
            i = Pe;
        else if (!i)
            return e;
        return 1 === a && (s = i,
        i = function(e) {
            return S().off(e),
            s.apply(this, arguments)
        }
        ,
        i.guid = s.guid || (s.guid = S.guid++)),
        e.each((function() {
            S.event.add(this, t, i, r, n)
        }
        ))
    }
    function Oe(e, t, n) {
        n ? (ie.set(e, t, !1),
        S.event.add(e, t, {
            namespace: !1,
            handler: function(e) {
                var n, r = ie.get(this, t);
                if (1 & e.isTrigger && this[t]) {
                    if (r)
                        (S.event.special[t] || {}).delegateType && e.stopPropagation();
                    else if (r = i.call(arguments),
                    ie.set(this, t, r),
                    this[t](),
                    n = ie.get(this, t),
                    ie.set(this, t, !1),
                    r !== n)
                        return e.stopImmediatePropagation(),
                        e.preventDefault(),
                        n
                } else
                    r && (ie.set(this, t, S.event.trigger(r[0], r.slice(1), this)),
                    e.stopPropagation(),
                    e.isImmediatePropagationStopped = Le)
            }
        })) : void 0 === ie.get(e, t) && S.event.add(e, t, Le)
    }
    S.event = {
        global: {},
        add: function(e, t, n, r, i) {
            var a, s, o, l, c, u, d, p, f, h, m, g = ie.get(e);
            if (ne(e))
                for (n.handler && (n = (a = n).handler,
                i = a.selector),
                i && S.find.matchesSelector(pe, i),
                n.guid || (n.guid = S.guid++),
                (l = g.events) || (l = g.events = Object.create(null)),
                (s = g.handle) || (s = g.handle = function(t) {
                    return void 0 !== S && S.event.triggered !== t.type ? S.event.dispatch.apply(e, arguments) : void 0
                }
                ),
                c = (t = (t || "").match(q) || [""]).length; c--; )
                    f = m = (o = Me.exec(t[c]) || [])[1],
                    h = (o[2] || "").split(".").sort(),
                    f && (d = S.event.special[f] || {},
                    f = (i ? d.delegateType : d.bindType) || f,
                    d = S.event.special[f] || {},
                    u = S.extend({
                        type: f,
                        origType: m,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && S.expr.match.needsContext.test(i),
                        namespace: h.join(".")
                    }, a),
                    (p = l[f]) || ((p = l[f] = []).delegateCount = 0,
                    d.setup && !1 !== d.setup.call(e, r, h, s) || e.addEventListener && e.addEventListener(f, s)),
                    d.add && (d.add.call(e, u),
                    u.handler.guid || (u.handler.guid = n.guid)),
                    i ? p.splice(p.delegateCount++, 0, u) : p.push(u),
                    S.event.global[f] = !0)
        },
        remove: function(e, t, n, r, i) {
            var a, s, o, l, c, u, d, p, f, h, m, g = ie.hasData(e) && ie.get(e);
            if (g && (l = g.events)) {
                for (c = (t = (t || "").match(q) || [""]).length; c--; )
                    if (f = m = (o = Me.exec(t[c]) || [])[1],
                    h = (o[2] || "").split(".").sort(),
                    f) {
                        for (d = S.event.special[f] || {},
                        p = l[f = (r ? d.delegateType : d.bindType) || f] || [],
                        o = o[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        s = a = p.length; a--; )
                            u = p[a],
                            !i && m !== u.origType || n && n.guid !== u.guid || o && !o.test(u.namespace) || r && r !== u.selector && ("**" !== r || !u.selector) || (p.splice(a, 1),
                            u.selector && p.delegateCount--,
                            d.remove && d.remove.call(e, u));
                        s && !p.length && (d.teardown && !1 !== d.teardown.call(e, h, g.handle) || S.removeEvent(e, f, g.handle),
                        delete l[f])
                    } else
                        for (f in l)
                            S.event.remove(e, f + t[c], n, r, !0);
                S.isEmptyObject(l) && ie.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, r, i, a, s, o = new Array(arguments.length), l = S.event.fix(e), c = (ie.get(this, "events") || Object.create(null))[l.type] || [], u = S.event.special[l.type] || {};
            for (o[0] = l,
            t = 1; t < arguments.length; t++)
                o[t] = arguments[t];
            if (l.delegateTarget = this,
            !u.preDispatch || !1 !== u.preDispatch.call(this, l)) {
                for (s = S.event.handlers.call(this, l, c),
                t = 0; (i = s[t++]) && !l.isPropagationStopped(); )
                    for (l.currentTarget = i.elem,
                    n = 0; (a = i.handlers[n++]) && !l.isImmediatePropagationStopped(); )
                        l.rnamespace && !1 !== a.namespace && !l.rnamespace.test(a.namespace) || (l.handleObj = a,
                        l.data = a.data,
                        void 0 !== (r = ((S.event.special[a.origType] || {}).handle || a.handler).apply(i.elem, o)) && !1 === (l.result = r) && (l.preventDefault(),
                        l.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, l),
                l.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, a, s, o = [], l = t.delegateCount, c = e.target;
            if (l && c.nodeType && !("click" === e.type && e.button >= 1))
                for (; c !== this; c = c.parentNode || this)
                    if (1 === c.nodeType && ("click" !== e.type || !0 !== c.disabled)) {
                        for (a = [],
                        s = {},
                        n = 0; n < l; n++)
                            void 0 === s[i = (r = t[n]).selector + " "] && (s[i] = r.needsContext ? S(i, this).index(c) > -1 : S.find(i, this, null, [c]).length),
                            s[i] && a.push(r);
                        a.length && o.push({
                            elem: c,
                            handlers: a
                        })
                    }
            return c = this,
            l < t.length && o.push({
                elem: c,
                handlers: t.slice(l)
            }),
            o
        },
        addProp: function(e, t) {
            Object.defineProperty(S.Event.prototype, e, {
                enumerable: !0,
                configurable: !0,
                get: h(t) ? function() {
                    if (this.originalEvent)
                        return t(this.originalEvent)
                }
                : function() {
                    if (this.originalEvent)
                        return this.originalEvent[e]
                }
                ,
                set: function(t) {
                    Object.defineProperty(this, e, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: t
                    })
                }
            })
        },
        fix: function(e) {
            return e[S.expando] ? e : new S.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(e) {
                    var t = this || e;
                    return Se.test(t.type) && t.click && _(t, "input") && Oe(t, "click", !0),
                    !1
                },
                trigger: function(e) {
                    var t = this || e;
                    return Se.test(t.type) && t.click && _(t, "input") && Oe(t, "click"),
                    !0
                },
                _default: function(e) {
                    var t = e.target;
                    return Se.test(t.type) && t.click && _(t, "input") && ie.get(t, "click") || _(t, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    },
    S.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }
    ,
    S.Event = function(e, t) {
        if (!(this instanceof S.Event))
            return new S.Event(e,t);
        e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? Le : Pe,
        this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target,
        this.currentTarget = e.currentTarget,
        this.relatedTarget = e.relatedTarget) : this.type = e,
        t && S.extend(this, t),
        this.timeStamp = e && e.timeStamp || Date.now(),
        this[S.expando] = !0
    }
    ,
    S.Event.prototype = {
        constructor: S.Event,
        isDefaultPrevented: Pe,
        isPropagationStopped: Pe,
        isImmediatePropagationStopped: Pe,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = Le,
            e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = Le,
            e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = Le,
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    S.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: !0
    }, S.event.addProp),
    S.each({
        focus: "focusin",
        blur: "focusout"
    }, (function(e, t) {
        function n(e) {
            if (g.documentMode) {
                var n = ie.get(this, "handle")
                  , r = S.event.fix(e);
                r.type = "focusin" === e.type ? "focus" : "blur",
                r.isSimulated = !0,
                n(e),
                r.target === r.currentTarget && n(r)
            } else
                S.event.simulate(t, e.target, S.event.fix(e))
        }
        S.event.special[e] = {
            setup: function() {
                var r;
                if (Oe(this, e, !0),
                !g.documentMode)
                    return !1;
                (r = ie.get(this, t)) || this.addEventListener(t, n),
                ie.set(this, t, (r || 0) + 1)
            },
            trigger: function() {
                return Oe(this, e),
                !0
            },
            teardown: function() {
                var e;
                if (!g.documentMode)
                    return !1;
                (e = ie.get(this, t) - 1) ? ie.set(this, t, e) : (this.removeEventListener(t, n),
                ie.remove(this, t))
            },
            _default: function(t) {
                return ie.get(t.target, e)
            },
            delegateType: t
        },
        S.event.special[t] = {
            setup: function() {
                var r = this.ownerDocument || this.document || this
                  , i = g.documentMode ? this : r
                  , a = ie.get(i, t);
                a || (g.documentMode ? this.addEventListener(t, n) : r.addEventListener(e, n, !0)),
                ie.set(i, t, (a || 0) + 1)
            },
            teardown: function() {
                var r = this.ownerDocument || this.document || this
                  , i = g.documentMode ? this : r
                  , a = ie.get(i, t) - 1;
                a ? ie.set(i, t, a) : (g.documentMode ? this.removeEventListener(t, n) : r.removeEventListener(e, n, !0),
                ie.remove(i, t))
            }
        }
    }
    )),
    S.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, (function(e, t) {
        S.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, r = e.relatedTarget, i = e.handleObj;
                return r && (r === this || S.contains(this, r)) || (e.type = i.origType,
                n = i.handler.apply(this, arguments),
                e.type = t),
                n
            }
        }
    }
    )),
    S.fn.extend({
        on: function(e, t, n, r) {
            return Ie(this, e, t, n, r)
        },
        one: function(e, t, n, r) {
            return Ie(this, e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj)
                return r = e.handleObj,
                S(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler),
                this;
            if ("object" == typeof e) {
                for (i in e)
                    this.off(i, t, e[i]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t,
            t = void 0),
            !1 === n && (n = Pe),
            this.each((function() {
                S.event.remove(this, e, n, t)
            }
            ))
        }
    });
    var Ne = /<script|<style|<link/i
      , $e = /checked\s*(?:[^=]|=\s*.checked.)/i
      , je = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
    function ze(e, t) {
        return _(e, "table") && _(11 !== t.nodeType ? t : t.firstChild, "tr") && S(e).children("tbody")[0] || e
    }
    function He(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
        e
    }
    function Fe(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"),
        e
    }
    function Re(e, t) {
        var n, r, i, a, s, o;
        if (1 === t.nodeType) {
            if (ie.hasData(e) && (o = ie.get(e).events))
                for (i in ie.remove(t, "handle events"),
                o)
                    for (n = 0,
                    r = o[i].length; n < r; n++)
                        S.event.add(t, i, o[i][n]);
            ae.hasData(e) && (a = ae.access(e),
            s = S.extend({}, a),
            ae.set(t, s))
        }
    }
    function Be(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && Se.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
    }
    function We(e, t, n, r) {
        t = a(t);
        var i, s, o, l, c, u, d = 0, p = e.length, m = p - 1, g = t[0], v = h(g);
        if (v || p > 1 && "string" == typeof g && !f.checkClone && $e.test(g))
            return e.each((function(i) {
                var a = e.eq(i);
                v && (t[0] = g.call(this, i, a.html())),
                We(a, t, n, r)
            }
            ));
        if (p && (s = (i = ke(t, e[0].ownerDocument, !1, e, r)).firstChild,
        1 === i.childNodes.length && (i = s),
        s || r)) {
            for (l = (o = S.map(Ee(i, "script"), He)).length; d < p; d++)
                c = i,
                d !== m && (c = S.clone(c, !0, !0),
                l && S.merge(o, Ee(c, "script"))),
                n.call(e[d], c, d);
            if (l)
                for (u = o[o.length - 1].ownerDocument,
                S.map(o, Fe),
                d = 0; d < l; d++)
                    c = o[d],
                    _e.test(c.type || "") && !ie.access(c, "globalEval") && S.contains(u, c) && (c.src && "module" !== (c.type || "").toLowerCase() ? S._evalUrl && !c.noModule && S._evalUrl(c.src, {
                        nonce: c.nonce || c.getAttribute("nonce")
                    }, u) : y(c.textContent.replace(je, ""), c, u))
        }
        return e
    }
    function qe(e, t, n) {
        for (var r, i = t ? S.filter(t, e) : e, a = 0; null != (r = i[a]); a++)
            n || 1 !== r.nodeType || S.cleanData(Ee(r)),
            r.parentNode && (n && fe(r) && De(Ee(r, "script")),
            r.parentNode.removeChild(r));
        return e
    }
    S.extend({
        htmlPrefilter: function(e) {
            return e
        },
        clone: function(e, t, n) {
            var r, i, a, s, o = e.cloneNode(!0), l = fe(e);
            if (!(f.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || S.isXMLDoc(e)))
                for (s = Ee(o),
                r = 0,
                i = (a = Ee(e)).length; r < i; r++)
                    Be(a[r], s[r]);
            if (t)
                if (n)
                    for (a = a || Ee(e),
                    s = s || Ee(o),
                    r = 0,
                    i = a.length; r < i; r++)
                        Re(a[r], s[r]);
                else
                    Re(e, o);
            return (s = Ee(o, "script")).length > 0 && De(s, !l && Ee(e, "script")),
            o
        },
        cleanData: function(e) {
            for (var t, n, r, i = S.event.special, a = 0; void 0 !== (n = e[a]); a++)
                if (ne(n)) {
                    if (t = n[ie.expando]) {
                        if (t.events)
                            for (r in t.events)
                                i[r] ? S.event.remove(n, r) : S.removeEvent(n, r, t.handle);
                        n[ie.expando] = void 0
                    }
                    n[ae.expando] && (n[ae.expando] = void 0)
                }
        }
    }),
    S.fn.extend({
        detach: function(e) {
            return qe(this, e, !0)
        },
        remove: function(e) {
            return qe(this, e)
        },
        text: function(e) {
            return J(this, (function(e) {
                return void 0 === e ? S.text(this) : this.empty().each((function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                }
                ))
            }
            ), null, e, arguments.length)
        },
        append: function() {
            return We(this, arguments, (function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || ze(this, e).appendChild(e)
            }
            ))
        },
        prepend: function() {
            return We(this, arguments, (function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = ze(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            }
            ))
        },
        before: function() {
            return We(this, arguments, (function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            }
            ))
        },
        after: function() {
            return We(this, arguments, (function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            }
            ))
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (S.cleanData(Ee(e, !1)),
                e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e,
            t = null == t ? e : t,
            this.map((function() {
                return S.clone(this, e, t)
            }
            ))
        },
        html: function(e) {
            return J(this, (function(e) {
                var t = this[0] || {}
                  , n = 0
                  , r = this.length;
                if (void 0 === e && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !Ne.test(e) && !Ce[(Te.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = S.htmlPrefilter(e);
                    try {
                        for (; n < r; n++)
                            1 === (t = this[n] || {}).nodeType && (S.cleanData(Ee(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }
            ), null, e, arguments.length)
        },
        replaceWith: function() {
            var e = [];
            return We(this, arguments, (function(t) {
                var n = this.parentNode;
                S.inArray(this, e) < 0 && (S.cleanData(Ee(this)),
                n && n.replaceChild(t, this))
            }
            ), e)
        }
    }),
    S.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, (function(e, t) {
        S.fn[e] = function(e) {
            for (var n, r = [], i = S(e), a = i.length - 1, o = 0; o <= a; o++)
                n = o === a ? this : this.clone(!0),
                S(i[o])[t](n),
                s.apply(r, n.get());
            return this.pushStack(r)
        }
    }
    ));
    var Xe = new RegExp("^(" + ce + ")(?!px)[a-z%]+$","i")
      , Ge = /^--/
      , Ve = function(t) {
        var n = t.ownerDocument.defaultView;
        return n && n.opener || (n = e),
        n.getComputedStyle(t)
    }
      , Ye = function(e, t, n) {
        var r, i, a = {};
        for (i in t)
            a[i] = e.style[i],
            e.style[i] = t[i];
        for (i in r = n.call(e),
        t)
            e.style[i] = a[i];
        return r
    }
      , Ue = new RegExp(de.join("|"),"i");
    function Ke(e, t, n) {
        var r, i, a, s, o = Ge.test(t), l = e.style;
        return (n = n || Ve(e)) && (s = n.getPropertyValue(t) || n[t],
        o && s && (s = s.replace(k, "$1") || void 0),
        "" !== s || fe(e) || (s = S.style(e, t)),
        !f.pixelBoxStyles() && Xe.test(s) && Ue.test(t) && (r = l.width,
        i = l.minWidth,
        a = l.maxWidth,
        l.minWidth = l.maxWidth = l.width = s,
        s = n.width,
        l.width = r,
        l.minWidth = i,
        l.maxWidth = a)),
        void 0 !== s ? s + "" : s
    }
    function Je(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }
    !function() {
        function t() {
            if (u) {
                c.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",
                u.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",
                pe.appendChild(c).appendChild(u);
                var t = e.getComputedStyle(u);
                r = "1%" !== t.top,
                l = 12 === n(t.marginLeft),
                u.style.right = "60%",
                s = 36 === n(t.right),
                i = 36 === n(t.width),
                u.style.position = "absolute",
                a = 12 === n(u.offsetWidth / 3),
                pe.removeChild(c),
                u = null
            }
        }
        function n(e) {
            return Math.round(parseFloat(e))
        }
        var r, i, a, s, o, l, c = g.createElement("div"), u = g.createElement("div");
        u.style && (u.style.backgroundClip = "content-box",
        u.cloneNode(!0).style.backgroundClip = "",
        f.clearCloneStyle = "content-box" === u.style.backgroundClip,
        S.extend(f, {
            boxSizingReliable: function() {
                return t(),
                i
            },
            pixelBoxStyles: function() {
                return t(),
                s
            },
            pixelPosition: function() {
                return t(),
                r
            },
            reliableMarginLeft: function() {
                return t(),
                l
            },
            scrollboxSize: function() {
                return t(),
                a
            },
            reliableTrDimensions: function() {
                var t, n, r, i;
                return null == o && (t = g.createElement("table"),
                n = g.createElement("tr"),
                r = g.createElement("div"),
                t.style.cssText = "position:absolute;left:-11111px;border-collapse:separate",
                n.style.cssText = "box-sizing:content-box;border:1px solid",
                n.style.height = "1px",
                r.style.height = "9px",
                r.style.display = "block",
                pe.appendChild(t).appendChild(n).appendChild(r),
                i = e.getComputedStyle(n),
                o = parseInt(i.height, 10) + parseInt(i.borderTopWidth, 10) + parseInt(i.borderBottomWidth, 10) === n.offsetHeight,
                pe.removeChild(t)),
                o
            }
        }))
    }();
    var Qe = ["Webkit", "Moz", "ms"]
      , Ze = g.createElement("div").style
      , et = {};
    function tt(e) {
        var t = S.cssProps[e] || et[e];
        return t || (e in Ze ? e : et[e] = function(e) {
            for (var t = e[0].toUpperCase() + e.slice(1), n = Qe.length; n--; )
                if ((e = Qe[n] + t)in Ze)
                    return e
        }(e) || e)
    }
    var nt = /^(none|table(?!-c[ea]).+)/
      , rt = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , it = {
        letterSpacing: "0",
        fontWeight: "400"
    };
    function at(e, t, n) {
        var r = ue.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
    }
    function st(e, t, n, r, i, a) {
        var s = "width" === t ? 1 : 0
          , o = 0
          , l = 0
          , c = 0;
        if (n === (r ? "border" : "content"))
            return 0;
        for (; s < 4; s += 2)
            "margin" === n && (c += S.css(e, n + de[s], !0, i)),
            r ? ("content" === n && (l -= S.css(e, "padding" + de[s], !0, i)),
            "margin" !== n && (l -= S.css(e, "border" + de[s] + "Width", !0, i))) : (l += S.css(e, "padding" + de[s], !0, i),
            "padding" !== n ? l += S.css(e, "border" + de[s] + "Width", !0, i) : o += S.css(e, "border" + de[s] + "Width", !0, i));
        return !r && a >= 0 && (l += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - a - l - o - .5)) || 0),
        l + c
    }
    function ot(e, t, n) {
        var r = Ve(e)
          , i = (!f.boxSizingReliable() || n) && "border-box" === S.css(e, "boxSizing", !1, r)
          , a = i
          , s = Ke(e, t, r)
          , o = "offset" + t[0].toUpperCase() + t.slice(1);
        if (Xe.test(s)) {
            if (!n)
                return s;
            s = "auto"
        }
        return (!f.boxSizingReliable() && i || !f.reliableTrDimensions() && _(e, "tr") || "auto" === s || !parseFloat(s) && "inline" === S.css(e, "display", !1, r)) && e.getClientRects().length && (i = "border-box" === S.css(e, "boxSizing", !1, r),
        (a = o in e) && (s = e[o])),
        (s = parseFloat(s) || 0) + st(e, t, n || (i ? "border" : "content"), a, r, s) + "px"
    }
    function lt(e, t, n, r, i) {
        return new lt.prototype.init(e,t,n,r,i)
    }
    S.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = Ke(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            aspectRatio: !0,
            borderImageSlice: !0,
            columnCount: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            scale: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0,
            fillOpacity: !0,
            floodOpacity: !0,
            stopOpacity: !0,
            strokeMiterlimit: !0,
            strokeOpacity: !0
        },
        cssProps: {},
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, a, s, o = te(t), l = Ge.test(t), c = e.style;
                if (l || (t = tt(o)),
                s = S.cssHooks[t] || S.cssHooks[o],
                void 0 === n)
                    return s && "get"in s && void 0 !== (i = s.get(e, !1, r)) ? i : c[t];
                "string" === (a = typeof n) && (i = ue.exec(n)) && i[1] && (n = ge(e, t, i),
                a = "number"),
                null != n && n == n && ("number" !== a || l || (n += i && i[3] || (S.cssNumber[o] ? "" : "px")),
                f.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (c[t] = "inherit"),
                s && "set"in s && void 0 === (n = s.set(e, n, r)) || (l ? c.setProperty(t, n) : c[t] = n))
            }
        },
        css: function(e, t, n, r) {
            var i, a, s, o = te(t);
            return Ge.test(t) || (t = tt(o)),
            (s = S.cssHooks[t] || S.cssHooks[o]) && "get"in s && (i = s.get(e, !0, n)),
            void 0 === i && (i = Ke(e, t, r)),
            "normal" === i && t in it && (i = it[t]),
            "" === n || n ? (a = parseFloat(i),
            !0 === n || isFinite(a) ? a || 0 : i) : i
        }
    }),
    S.each(["height", "width"], (function(e, t) {
        S.cssHooks[t] = {
            get: function(e, n, r) {
                if (n)
                    return !nt.test(S.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? ot(e, t, r) : Ye(e, rt, (function() {
                        return ot(e, t, r)
                    }
                    ))
            },
            set: function(e, n, r) {
                var i, a = Ve(e), s = !f.scrollboxSize() && "absolute" === a.position, o = (s || r) && "border-box" === S.css(e, "boxSizing", !1, a), l = r ? st(e, t, r, o, a) : 0;
                return o && s && (l -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(a[t]) - st(e, t, "border", !1, a) - .5)),
                l && (i = ue.exec(n)) && "px" !== (i[3] || "px") && (e.style[t] = n,
                n = S.css(e, t)),
                at(0, n, l)
            }
        }
    }
    )),
    S.cssHooks.marginLeft = Je(f.reliableMarginLeft, (function(e, t) {
        if (t)
            return (parseFloat(Ke(e, "marginLeft")) || e.getBoundingClientRect().left - Ye(e, {
                marginLeft: 0
            }, (function() {
                return e.getBoundingClientRect().left
            }
            ))) + "px"
    }
    )),
    S.each({
        margin: "",
        padding: "",
        border: "Width"
    }, (function(e, t) {
        S.cssHooks[e + t] = {
            expand: function(n) {
                for (var r = 0, i = {}, a = "string" == typeof n ? n.split(" ") : [n]; r < 4; r++)
                    i[e + de[r] + t] = a[r] || a[r - 2] || a[0];
                return i
            }
        },
        "margin" !== e && (S.cssHooks[e + t].set = at)
    }
    )),
    S.fn.extend({
        css: function(e, t) {
            return J(this, (function(e, t, n) {
                var r, i, a = {}, s = 0;
                if (Array.isArray(t)) {
                    for (r = Ve(e),
                    i = t.length; s < i; s++)
                        a[t[s]] = S.css(e, t[s], !1, r);
                    return a
                }
                return void 0 !== n ? S.style(e, t, n) : S.css(e, t)
            }
            ), e, t, arguments.length > 1)
        }
    }),
    S.Tween = lt,
    lt.prototype = {
        constructor: lt,
        init: function(e, t, n, r, i, a) {
            this.elem = e,
            this.prop = n,
            this.easing = i || S.easing._default,
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = r,
            this.unit = a || (S.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = lt.propHooks[this.prop];
            return e && e.get ? e.get(this) : lt.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = lt.propHooks[this.prop];
            return this.options.duration ? this.pos = t = S.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : lt.propHooks._default.set(this),
            this
        }
    },
    lt.prototype.init.prototype = lt.prototype,
    lt.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = S.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                S.fx.step[e.prop] ? S.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !S.cssHooks[e.prop] && null == e.elem.style[tt(e.prop)] ? e.elem[e.prop] = e.now : S.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    },
    lt.propHooks.scrollTop = lt.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    S.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    },
    S.fx = lt.prototype.init,
    S.fx.step = {};
    var ct, ut, dt = /^(?:toggle|show|hide)$/, pt = /queueHooks$/;
    function ft() {
        ut && (!1 === g.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(ft) : e.setTimeout(ft, S.fx.interval),
        S.fx.tick())
    }
    function ht() {
        return e.setTimeout((function() {
            ct = void 0
        }
        )),
        ct = Date.now()
    }
    function mt(e, t) {
        var n, r = 0, i = {
            height: e
        };
        for (t = t ? 1 : 0; r < 4; r += 2 - t)
            i["margin" + (n = de[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e),
        i
    }
    function gt(e, t, n) {
        for (var r, i = (vt.tweeners[t] || []).concat(vt.tweeners["*"]), a = 0, s = i.length; a < s; a++)
            if (r = i[a].call(n, t, e))
                return r
    }
    function vt(e, t, n) {
        var r, i, a = 0, s = vt.prefilters.length, o = S.Deferred().always((function() {
            delete l.elem
        }
        )), l = function() {
            if (i)
                return !1;
            for (var t = ct || ht(), n = Math.max(0, c.startTime + c.duration - t), r = 1 - (n / c.duration || 0), a = 0, s = c.tweens.length; a < s; a++)
                c.tweens[a].run(r);
            return o.notifyWith(e, [c, r, n]),
            r < 1 && s ? n : (s || o.notifyWith(e, [c, 1, 0]),
            o.resolveWith(e, [c]),
            !1)
        }, c = o.promise({
            elem: e,
            props: S.extend({}, t),
            opts: S.extend(!0, {
                specialEasing: {},
                easing: S.easing._default
            }, n),
            originalProperties: t,
            originalOptions: n,
            startTime: ct || ht(),
            duration: n.duration,
            tweens: [],
            createTween: function(t, n) {
                var r = S.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                return c.tweens.push(r),
                r
            },
            stop: function(t) {
                var n = 0
                  , r = t ? c.tweens.length : 0;
                if (i)
                    return this;
                for (i = !0; n < r; n++)
                    c.tweens[n].run(1);
                return t ? (o.notifyWith(e, [c, 1, 0]),
                o.resolveWith(e, [c, t])) : o.rejectWith(e, [c, t]),
                this
            }
        }), u = c.props;
        for (!function(e, t) {
            var n, r, i, a, s;
            for (n in e)
                if (i = t[r = te(n)],
                a = e[n],
                Array.isArray(a) && (i = a[1],
                a = e[n] = a[0]),
                n !== r && (e[r] = a,
                delete e[n]),
                (s = S.cssHooks[r]) && "expand"in s)
                    for (n in a = s.expand(a),
                    delete e[r],
                    a)
                        n in e || (e[n] = a[n],
                        t[n] = i);
                else
                    t[r] = i
        }(u, c.opts.specialEasing); a < s; a++)
            if (r = vt.prefilters[a].call(c, e, u, c.opts))
                return h(r.stop) && (S._queueHooks(c.elem, c.opts.queue).stop = r.stop.bind(r)),
                r;
        return S.map(u, gt, c),
        h(c.opts.start) && c.opts.start.call(e, c),
        c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always),
        S.fx.timer(S.extend(l, {
            elem: e,
            anim: c,
            queue: c.opts.queue
        })),
        c
    }
    S.Animation = S.extend(vt, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return ge(n.elem, e, ue.exec(t), n),
                n
            }
            ]
        },
        tweener: function(e, t) {
            h(e) ? (t = e,
            e = ["*"]) : e = e.match(q);
            for (var n, r = 0, i = e.length; r < i; r++)
                n = e[r],
                vt.tweeners[n] = vt.tweeners[n] || [],
                vt.tweeners[n].unshift(t)
        },
        prefilters: [function(e, t, n) {
            var r, i, a, s, o, l, c, u, d = "width"in t || "height"in t, p = this, f = {}, h = e.style, m = e.nodeType && me(e), g = ie.get(e, "fxshow");
            for (r in n.queue || (null == (s = S._queueHooks(e, "fx")).unqueued && (s.unqueued = 0,
            o = s.empty.fire,
            s.empty.fire = function() {
                s.unqueued || o()
            }
            ),
            s.unqueued++,
            p.always((function() {
                p.always((function() {
                    s.unqueued--,
                    S.queue(e, "fx").length || s.empty.fire()
                }
                ))
            }
            ))),
            t)
                if (i = t[r],
                dt.test(i)) {
                    if (delete t[r],
                    a = a || "toggle" === i,
                    i === (m ? "hide" : "show")) {
                        if ("show" !== i || !g || void 0 === g[r])
                            continue;
                        m = !0
                    }
                    f[r] = g && g[r] || S.style(e, r)
                }
            if ((l = !S.isEmptyObject(t)) || !S.isEmptyObject(f))
                for (r in d && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY],
                null == (c = g && g.display) && (c = ie.get(e, "display")),
                "none" === (u = S.css(e, "display")) && (c ? u = c : (be([e], !0),
                c = e.style.display || c,
                u = S.css(e, "display"),
                be([e]))),
                ("inline" === u || "inline-block" === u && null != c) && "none" === S.css(e, "float") && (l || (p.done((function() {
                    h.display = c
                }
                )),
                null == c && (u = h.display,
                c = "none" === u ? "" : u)),
                h.display = "inline-block")),
                n.overflow && (h.overflow = "hidden",
                p.always((function() {
                    h.overflow = n.overflow[0],
                    h.overflowX = n.overflow[1],
                    h.overflowY = n.overflow[2]
                }
                ))),
                l = !1,
                f)
                    l || (g ? "hidden"in g && (m = g.hidden) : g = ie.access(e, "fxshow", {
                        display: c
                    }),
                    a && (g.hidden = !m),
                    m && be([e], !0),
                    p.done((function() {
                        for (r in m || be([e]),
                        ie.remove(e, "fxshow"),
                        f)
                            S.style(e, r, f[r])
                    }
                    ))),
                    l = gt(m ? g[r] : 0, r, p),
                    r in g || (g[r] = l.start,
                    m && (l.end = l.start,
                    l.start = 0))
        }
        ],
        prefilter: function(e, t) {
            t ? vt.prefilters.unshift(e) : vt.prefilters.push(e)
        }
    }),
    S.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? S.extend({}, e) : {
            complete: n || !n && t || h(e) && e,
            duration: e,
            easing: n && t || t && !h(t) && t
        };
        return S.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in S.fx.speeds ? r.duration = S.fx.speeds[r.duration] : r.duration = S.fx.speeds._default),
        null != r.queue && !0 !== r.queue || (r.queue = "fx"),
        r.old = r.complete,
        r.complete = function() {
            h(r.old) && r.old.call(this),
            r.queue && S.dequeue(this, r.queue)
        }
        ,
        r
    }
    ,
    S.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(me).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(e, t, n, r) {
            var i = S.isEmptyObject(e)
              , a = S.speed(t, n, r)
              , s = function() {
                var t = vt(this, S.extend({}, e), a);
                (i || ie.get(this, "finish")) && t.stop(!0)
            };
            return s.finish = s,
            i || !1 === a.queue ? this.each(s) : this.queue(a.queue, s)
        },
        stop: function(e, t, n) {
            var r = function(e) {
                var t = e.stop;
                delete e.stop,
                t(n)
            };
            return "string" != typeof e && (n = t,
            t = e,
            e = void 0),
            t && this.queue(e || "fx", []),
            this.each((function() {
                var t = !0
                  , i = null != e && e + "queueHooks"
                  , a = S.timers
                  , s = ie.get(this);
                if (i)
                    s[i] && s[i].stop && r(s[i]);
                else
                    for (i in s)
                        s[i] && s[i].stop && pt.test(i) && r(s[i]);
                for (i = a.length; i--; )
                    a[i].elem !== this || null != e && a[i].queue !== e || (a[i].anim.stop(n),
                    t = !1,
                    a.splice(i, 1));
                !t && n || S.dequeue(this, e)
            }
            ))
        },
        finish: function(e) {
            return !1 !== e && (e = e || "fx"),
            this.each((function() {
                var t, n = ie.get(this), r = n[e + "queue"], i = n[e + "queueHooks"], a = S.timers, s = r ? r.length : 0;
                for (n.finish = !0,
                S.queue(this, e, []),
                i && i.stop && i.stop.call(this, !0),
                t = a.length; t--; )
                    a[t].elem === this && a[t].queue === e && (a[t].anim.stop(!0),
                    a.splice(t, 1));
                for (t = 0; t < s; t++)
                    r[t] && r[t].finish && r[t].finish.call(this);
                delete n.finish
            }
            ))
        }
    }),
    S.each(["toggle", "show", "hide"], (function(e, t) {
        var n = S.fn[t];
        S.fn[t] = function(e, r, i) {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(mt(t, !0), e, r, i)
        }
    }
    )),
    S.each({
        slideDown: mt("show"),
        slideUp: mt("hide"),
        slideToggle: mt("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, (function(e, t) {
        S.fn[e] = function(e, n, r) {
            return this.animate(t, e, n, r)
        }
    }
    )),
    S.timers = [],
    S.fx.tick = function() {
        var e, t = 0, n = S.timers;
        for (ct = Date.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || S.fx.stop(),
        ct = void 0
    }
    ,
    S.fx.timer = function(e) {
        S.timers.push(e),
        S.fx.start()
    }
    ,
    S.fx.interval = 13,
    S.fx.start = function() {
        ut || (ut = !0,
        ft())
    }
    ,
    S.fx.stop = function() {
        ut = null
    }
    ,
    S.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    S.fn.delay = function(t, n) {
        return t = S.fx && S.fx.speeds[t] || t,
        n = n || "fx",
        this.queue(n, (function(n, r) {
            var i = e.setTimeout(n, t);
            r.stop = function() {
                e.clearTimeout(i)
            }
        }
        ))
    }
    ,
    function() {
        var e = g.createElement("input")
          , t = g.createElement("select").appendChild(g.createElement("option"));
        e.type = "checkbox",
        f.checkOn = "" !== e.value,
        f.optSelected = t.selected,
        (e = g.createElement("input")).value = "t",
        e.type = "radio",
        f.radioValue = "t" === e.value
    }();
    var yt, bt = S.expr.attrHandle;
    S.fn.extend({
        attr: function(e, t) {
            return J(this, S.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each((function() {
                S.removeAttr(this, e)
            }
            ))
        }
    }),
    S.extend({
        attr: function(e, t, n) {
            var r, i, a = e.nodeType;
            if (3 !== a && 8 !== a && 2 !== a)
                return void 0 === e.getAttribute ? S.prop(e, t, n) : (1 === a && S.isXMLDoc(e) || (i = S.attrHooks[t.toLowerCase()] || (S.expr.match.bool.test(t) ? yt : void 0)),
                void 0 !== n ? null === n ? void S.removeAttr(e, t) : i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""),
                n) : i && "get"in i && null !== (r = i.get(e, t)) ? r : null == (r = S.find.attr(e, t)) ? void 0 : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!f.radioValue && "radio" === t && _(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t),
                        n && (e.value = n),
                        t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n, r = 0, i = t && t.match(q);
            if (i && 1 === e.nodeType)
                for (; n = i[r++]; )
                    e.removeAttribute(n)
        }
    }),
    yt = {
        set: function(e, t, n) {
            return !1 === t ? S.removeAttr(e, n) : e.setAttribute(n, n),
            n
        }
    },
    S.each(S.expr.match.bool.source.match(/\w+/g), (function(e, t) {
        var n = bt[t] || S.find.attr;
        bt[t] = function(e, t, r) {
            var i, a, s = t.toLowerCase();
            return r || (a = bt[s],
            bt[s] = i,
            i = null != n(e, t, r) ? s : null,
            bt[s] = a),
            i
        }
    }
    ));
    var wt = /^(?:input|select|textarea|button)$/i
      , xt = /^(?:a|area)$/i;
    function St(e) {
        return (e.match(q) || []).join(" ")
    }
    function Tt(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    function _t(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(q) || []
    }
    S.fn.extend({
        prop: function(e, t) {
            return J(this, S.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return this.each((function() {
                delete this[S.propFix[e] || e]
            }
            ))
        }
    }),
    S.extend({
        prop: function(e, t, n) {
            var r, i, a = e.nodeType;
            if (3 !== a && 8 !== a && 2 !== a)
                return 1 === a && S.isXMLDoc(e) || (t = S.propFix[t] || t,
                i = S.propHooks[t]),
                void 0 !== n ? i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = S.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : wt.test(e.nodeName) || xt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            for: "htmlFor",
            class: "className"
        }
    }),
    f.optSelected || (S.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
            null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex,
            t.parentNode && t.parentNode.selectedIndex)
        }
    }),
    S.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], (function() {
        S.propFix[this.toLowerCase()] = this
    }
    )),
    S.fn.extend({
        addClass: function(e) {
            var t, n, r, i, a, s;
            return h(e) ? this.each((function(t) {
                S(this).addClass(e.call(this, t, Tt(this)))
            }
            )) : (t = _t(e)).length ? this.each((function() {
                if (r = Tt(this),
                n = 1 === this.nodeType && " " + St(r) + " ") {
                    for (a = 0; a < t.length; a++)
                        i = t[a],
                        n.indexOf(" " + i + " ") < 0 && (n += i + " ");
                    s = St(n),
                    r !== s && this.setAttribute("class", s)
                }
            }
            )) : this
        },
        removeClass: function(e) {
            var t, n, r, i, a, s;
            return h(e) ? this.each((function(t) {
                S(this).removeClass(e.call(this, t, Tt(this)))
            }
            )) : arguments.length ? (t = _t(e)).length ? this.each((function() {
                if (r = Tt(this),
                n = 1 === this.nodeType && " " + St(r) + " ") {
                    for (a = 0; a < t.length; a++)
                        for (i = t[a]; n.indexOf(" " + i + " ") > -1; )
                            n = n.replace(" " + i + " ", " ");
                    s = St(n),
                    r !== s && this.setAttribute("class", s)
                }
            }
            )) : this : this.attr("class", "")
        },
        toggleClass: function(e, t) {
            var n, r, i, a, s = typeof e, o = "string" === s || Array.isArray(e);
            return h(e) ? this.each((function(n) {
                S(this).toggleClass(e.call(this, n, Tt(this), t), t)
            }
            )) : "boolean" == typeof t && o ? t ? this.addClass(e) : this.removeClass(e) : (n = _t(e),
            this.each((function() {
                if (o)
                    for (a = S(this),
                    i = 0; i < n.length; i++)
                        r = n[i],
                        a.hasClass(r) ? a.removeClass(r) : a.addClass(r);
                else
                    void 0 !== e && "boolean" !== s || ((r = Tt(this)) && ie.set(this, "__className__", r),
                    this.setAttribute && this.setAttribute("class", r || !1 === e ? "" : ie.get(this, "__className__") || ""))
            }
            )))
        },
        hasClass: function(e) {
            var t, n, r = 0;
            for (t = " " + e + " "; n = this[r++]; )
                if (1 === n.nodeType && (" " + St(Tt(n)) + " ").indexOf(t) > -1)
                    return !0;
            return !1
        }
    });
    var Ct = /\r/g;
    S.fn.extend({
        val: function(e) {
            var t, n, r, i = this[0];
            return arguments.length ? (r = h(e),
            this.each((function(n) {
                var i;
                1 === this.nodeType && (null == (i = r ? e.call(this, n, S(this).val()) : e) ? i = "" : "number" == typeof i ? i += "" : Array.isArray(i) && (i = S.map(i, (function(e) {
                    return null == e ? "" : e + ""
                }
                ))),
                (t = S.valHooks[this.type] || S.valHooks[this.nodeName.toLowerCase()]) && "set"in t && void 0 !== t.set(this, i, "value") || (this.value = i))
            }
            ))) : i ? (t = S.valHooks[i.type] || S.valHooks[i.nodeName.toLowerCase()]) && "get"in t && void 0 !== (n = t.get(i, "value")) ? n : "string" == typeof (n = i.value) ? n.replace(Ct, "") : null == n ? "" : n : void 0
        }
    }),
    S.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = S.find.attr(e, "value");
                    return null != t ? t : St(S.text(e))
                }
            },
            select: {
                get: function(e) {
                    var t, n, r, i = e.options, a = e.selectedIndex, s = "select-one" === e.type, o = s ? null : [], l = s ? a + 1 : i.length;
                    for (r = a < 0 ? l : s ? a : 0; r < l; r++)
                        if (((n = i[r]).selected || r === a) && !n.disabled && (!n.parentNode.disabled || !_(n.parentNode, "optgroup"))) {
                            if (t = S(n).val(),
                            s)
                                return t;
                            o.push(t)
                        }
                    return o
                },
                set: function(e, t) {
                    for (var n, r, i = e.options, a = S.makeArray(t), s = i.length; s--; )
                        ((r = i[s]).selected = S.inArray(S.valHooks.option.get(r), a) > -1) && (n = !0);
                    return n || (e.selectedIndex = -1),
                    a
                }
            }
        }
    }),
    S.each(["radio", "checkbox"], (function() {
        S.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t))
                    return e.checked = S.inArray(S(e).val(), t) > -1
            }
        },
        f.checkOn || (S.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    }
    ));
    var Et = e.location
      , Dt = {
        guid: Date.now()
    }
      , At = /\?/;
    S.parseXML = function(t) {
        var n, r;
        if (!t || "string" != typeof t)
            return null;
        try {
            n = (new e.DOMParser).parseFromString(t, "text/xml")
        } catch (e) {}
        return r = n && n.getElementsByTagName("parsererror")[0],
        n && !r || S.error("Invalid XML: " + (r ? S.map(r.childNodes, (function(e) {
            return e.textContent
        }
        )).join("\n") : t)),
        n
    }
    ;
    var kt = /^(?:focusinfocus|focusoutblur)$/
      , Mt = function(e) {
        e.stopPropagation()
    };
    S.extend(S.event, {
        trigger: function(t, n, r, i) {
            var a, s, o, l, c, d, p, f, v = [r || g], y = u.call(t, "type") ? t.type : t, b = u.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = f = o = r = r || g,
            3 !== r.nodeType && 8 !== r.nodeType && !kt.test(y + S.event.triggered) && (y.indexOf(".") > -1 && (b = y.split("."),
            y = b.shift(),
            b.sort()),
            c = y.indexOf(":") < 0 && "on" + y,
            (t = t[S.expando] ? t : new S.Event(y,"object" == typeof t && t)).isTrigger = i ? 2 : 3,
            t.namespace = b.join("."),
            t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + b.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            t.result = void 0,
            t.target || (t.target = r),
            n = null == n ? [t] : S.makeArray(n, [t]),
            p = S.event.special[y] || {},
            i || !p.trigger || !1 !== p.trigger.apply(r, n))) {
                if (!i && !p.noBubble && !m(r)) {
                    for (l = p.delegateType || y,
                    kt.test(l + y) || (s = s.parentNode); s; s = s.parentNode)
                        v.push(s),
                        o = s;
                    o === (r.ownerDocument || g) && v.push(o.defaultView || o.parentWindow || e)
                }
                for (a = 0; (s = v[a++]) && !t.isPropagationStopped(); )
                    f = s,
                    t.type = a > 1 ? l : p.bindType || y,
                    (d = (ie.get(s, "events") || Object.create(null))[t.type] && ie.get(s, "handle")) && d.apply(s, n),
                    (d = c && s[c]) && d.apply && ne(s) && (t.result = d.apply(s, n),
                    !1 === t.result && t.preventDefault());
                return t.type = y,
                i || t.isDefaultPrevented() || p._default && !1 !== p._default.apply(v.pop(), n) || !ne(r) || c && h(r[y]) && !m(r) && ((o = r[c]) && (r[c] = null),
                S.event.triggered = y,
                t.isPropagationStopped() && f.addEventListener(y, Mt),
                r[y](),
                t.isPropagationStopped() && f.removeEventListener(y, Mt),
                S.event.triggered = void 0,
                o && (r[c] = o)),
                t.result
            }
        },
        simulate: function(e, t, n) {
            var r = S.extend(new S.Event, n, {
                type: e,
                isSimulated: !0
            });
            S.event.trigger(r, null, t)
        }
    }),
    S.fn.extend({
        trigger: function(e, t) {
            return this.each((function() {
                S.event.trigger(e, t, this)
            }
            ))
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n)
                return S.event.trigger(e, t, n, !0)
        }
    });
    var Lt = /\[\]$/
      , Pt = /\r?\n/g
      , It = /^(?:submit|button|image|reset|file)$/i
      , Ot = /^(?:input|select|textarea|keygen)/i;
    function Nt(e, t, n, r) {
        var i;
        if (Array.isArray(t))
            S.each(t, (function(t, i) {
                n || Lt.test(e) ? r(e, i) : Nt(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, n, r)
            }
            ));
        else if (n || "object" !== b(t))
            r(e, t);
        else
            for (i in t)
                Nt(e + "[" + i + "]", t[i], n, r)
    }
    S.param = function(e, t) {
        var n, r = [], i = function(e, t) {
            var n = h(t) ? t() : t;
            r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
        };
        if (null == e)
            return "";
        if (Array.isArray(e) || e.jquery && !S.isPlainObject(e))
            S.each(e, (function() {
                i(this.name, this.value)
            }
            ));
        else
            for (n in e)
                Nt(n, e[n], t, i);
        return r.join("&")
    }
    ,
    S.fn.extend({
        serialize: function() {
            return S.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map((function() {
                var e = S.prop(this, "elements");
                return e ? S.makeArray(e) : this
            }
            )).filter((function() {
                var e = this.type;
                return this.name && !S(this).is(":disabled") && Ot.test(this.nodeName) && !It.test(e) && (this.checked || !Se.test(e))
            }
            )).map((function(e, t) {
                var n = S(this).val();
                return null == n ? null : Array.isArray(n) ? S.map(n, (function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Pt, "\r\n")
                    }
                }
                )) : {
                    name: t.name,
                    value: n.replace(Pt, "\r\n")
                }
            }
            )).get()
        }
    });
    var $t = /%20/g
      , jt = /#.*$/
      , zt = /([?&])_=[^&]*/
      , Ht = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , Ft = /^(?:GET|HEAD)$/
      , Rt = /^\/\//
      , Bt = {}
      , Wt = {}
      , qt = "*/".concat("*")
      , Xt = g.createElement("a");
    function Gt(e) {
        return function(t, n) {
            "string" != typeof t && (n = t,
            t = "*");
            var r, i = 0, a = t.toLowerCase().match(q) || [];
            if (h(n))
                for (; r = a[i++]; )
                    "+" === r[0] ? (r = r.slice(1) || "*",
                    (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
        }
    }
    function Vt(e, t, n, r) {
        var i = {}
          , a = e === Wt;
        function s(o) {
            var l;
            return i[o] = !0,
            S.each(e[o] || [], (function(e, o) {
                var c = o(t, n, r);
                return "string" != typeof c || a || i[c] ? a ? !(l = c) : void 0 : (t.dataTypes.unshift(c),
                s(c),
                !1)
            }
            )),
            l
        }
        return s(t.dataTypes[0]) || !i["*"] && s("*")
    }
    function Yt(e, t) {
        var n, r, i = S.ajaxSettings.flatOptions || {};
        for (n in t)
            void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && S.extend(!0, e, r),
        e
    }
    Xt.href = Et.href,
    S.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Et.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Et.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": qt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": S.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? Yt(Yt(e, S.ajaxSettings), t) : Yt(S.ajaxSettings, e)
        },
        ajaxPrefilter: Gt(Bt),
        ajaxTransport: Gt(Wt),
        ajax: function(t, n) {
            "object" == typeof t && (n = t,
            t = void 0),
            n = n || {};
            var r, i, a, s, o, l, c, u, d, p, f = S.ajaxSetup({}, n), h = f.context || f, m = f.context && (h.nodeType || h.jquery) ? S(h) : S.event, v = S.Deferred(), y = S.Callbacks("once memory"), b = f.statusCode || {}, w = {}, x = {}, T = "canceled", _ = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (c) {
                        if (!s)
                            for (s = {}; t = Ht.exec(a); )
                                s[t[1].toLowerCase() + " "] = (s[t[1].toLowerCase() + " "] || []).concat(t[2]);
                        t = s[e.toLowerCase() + " "]
                    }
                    return null == t ? null : t.join(", ")
                },
                getAllResponseHeaders: function() {
                    return c ? a : null
                },
                setRequestHeader: function(e, t) {
                    return null == c && (e = x[e.toLowerCase()] = x[e.toLowerCase()] || e,
                    w[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return null == c && (f.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    var t;
                    if (e)
                        if (c)
                            _.always(e[_.status]);
                        else
                            for (t in e)
                                b[t] = [b[t], e[t]];
                    return this
                },
                abort: function(e) {
                    var t = e || T;
                    return r && r.abort(t),
                    C(0, t),
                    this
                }
            };
            if (v.promise(_),
            f.url = ((t || f.url || Et.href) + "").replace(Rt, Et.protocol + "//"),
            f.type = n.method || n.type || f.method || f.type,
            f.dataTypes = (f.dataType || "*").toLowerCase().match(q) || [""],
            null == f.crossDomain) {
                l = g.createElement("a");
                try {
                    l.href = f.url,
                    l.href = l.href,
                    f.crossDomain = Xt.protocol + "//" + Xt.host != l.protocol + "//" + l.host
                } catch (e) {
                    f.crossDomain = !0
                }
            }
            if (f.data && f.processData && "string" != typeof f.data && (f.data = S.param(f.data, f.traditional)),
            Vt(Bt, f, n, _),
            c)
                return _;
            for (d in (u = S.event && f.global) && 0 == S.active++ && S.event.trigger("ajaxStart"),
            f.type = f.type.toUpperCase(),
            f.hasContent = !Ft.test(f.type),
            i = f.url.replace(jt, ""),
            f.hasContent ? f.data && f.processData && 0 === (f.contentType || "").indexOf("application/x-www-form-urlencoded") && (f.data = f.data.replace($t, "+")) : (p = f.url.slice(i.length),
            f.data && (f.processData || "string" == typeof f.data) && (i += (At.test(i) ? "&" : "?") + f.data,
            delete f.data),
            !1 === f.cache && (i = i.replace(zt, "$1"),
            p = (At.test(i) ? "&" : "?") + "_=" + Dt.guid++ + p),
            f.url = i + p),
            f.ifModified && (S.lastModified[i] && _.setRequestHeader("If-Modified-Since", S.lastModified[i]),
            S.etag[i] && _.setRequestHeader("If-None-Match", S.etag[i])),
            (f.data && f.hasContent && !1 !== f.contentType || n.contentType) && _.setRequestHeader("Content-Type", f.contentType),
            _.setRequestHeader("Accept", f.dataTypes[0] && f.accepts[f.dataTypes[0]] ? f.accepts[f.dataTypes[0]] + ("*" !== f.dataTypes[0] ? ", " + qt + "; q=0.01" : "") : f.accepts["*"]),
            f.headers)
                _.setRequestHeader(d, f.headers[d]);
            if (f.beforeSend && (!1 === f.beforeSend.call(h, _, f) || c))
                return _.abort();
            if (T = "abort",
            y.add(f.complete),
            _.done(f.success),
            _.fail(f.error),
            r = Vt(Wt, f, n, _)) {
                if (_.readyState = 1,
                u && m.trigger("ajaxSend", [_, f]),
                c)
                    return _;
                f.async && f.timeout > 0 && (o = e.setTimeout((function() {
                    _.abort("timeout")
                }
                ), f.timeout));
                try {
                    c = !1,
                    r.send(w, C)
                } catch (e) {
                    if (c)
                        throw e;
                    C(-1, e)
                }
            } else
                C(-1, "No Transport");
            function C(t, n, s, l) {
                var d, p, g, w, x, T = n;
                c || (c = !0,
                o && e.clearTimeout(o),
                r = void 0,
                a = l || "",
                _.readyState = t > 0 ? 4 : 0,
                d = t >= 200 && t < 300 || 304 === t,
                s && (w = function(e, t, n) {
                    for (var r, i, a, s, o = e.contents, l = e.dataTypes; "*" === l[0]; )
                        l.shift(),
                        void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (r)
                        for (i in o)
                            if (o[i] && o[i].test(r)) {
                                l.unshift(i);
                                break
                            }
                    if (l[0]in n)
                        a = l[0];
                    else {
                        for (i in n) {
                            if (!l[0] || e.converters[i + " " + l[0]]) {
                                a = i;
                                break
                            }
                            s || (s = i)
                        }
                        a = a || s
                    }
                    if (a)
                        return a !== l[0] && l.unshift(a),
                        n[a]
                }(f, _, s)),
                !d && S.inArray("script", f.dataTypes) > -1 && S.inArray("json", f.dataTypes) < 0 && (f.converters["text script"] = function() {}
                ),
                w = function(e, t, n, r) {
                    var i, a, s, o, l, c = {}, u = e.dataTypes.slice();
                    if (u[1])
                        for (s in e.converters)
                            c[s.toLowerCase()] = e.converters[s];
                    for (a = u.shift(); a; )
                        if (e.responseFields[a] && (n[e.responseFields[a]] = t),
                        !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                        l = a,
                        a = u.shift())
                            if ("*" === a)
                                a = l;
                            else if ("*" !== l && l !== a) {
                                if (!(s = c[l + " " + a] || c["* " + a]))
                                    for (i in c)
                                        if ((o = i.split(" "))[1] === a && (s = c[l + " " + o[0]] || c["* " + o[0]])) {
                                            !0 === s ? s = c[i] : !0 !== c[i] && (a = o[0],
                                            u.unshift(o[1]));
                                            break
                                        }
                                if (!0 !== s)
                                    if (s && e.throws)
                                        t = s(t);
                                    else
                                        try {
                                            t = s(t)
                                        } catch (e) {
                                            return {
                                                state: "parsererror",
                                                error: s ? e : "No conversion from " + l + " to " + a
                                            }
                                        }
                            }
                    return {
                        state: "success",
                        data: t
                    }
                }(f, w, _, d),
                d ? (f.ifModified && ((x = _.getResponseHeader("Last-Modified")) && (S.lastModified[i] = x),
                (x = _.getResponseHeader("etag")) && (S.etag[i] = x)),
                204 === t || "HEAD" === f.type ? T = "nocontent" : 304 === t ? T = "notmodified" : (T = w.state,
                p = w.data,
                d = !(g = w.error))) : (g = T,
                !t && T || (T = "error",
                t < 0 && (t = 0))),
                _.status = t,
                _.statusText = (n || T) + "",
                d ? v.resolveWith(h, [p, T, _]) : v.rejectWith(h, [_, T, g]),
                _.statusCode(b),
                b = void 0,
                u && m.trigger(d ? "ajaxSuccess" : "ajaxError", [_, f, d ? p : g]),
                y.fireWith(h, [_, T]),
                u && (m.trigger("ajaxComplete", [_, f]),
                --S.active || S.event.trigger("ajaxStop")))
            }
            return _
        },
        getJSON: function(e, t, n) {
            return S.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return S.get(e, void 0, t, "script")
        }
    }),
    S.each(["get", "post"], (function(e, t) {
        S[t] = function(e, n, r, i) {
            return h(n) && (i = i || r,
            r = n,
            n = void 0),
            S.ajax(S.extend({
                url: e,
                type: t,
                dataType: i,
                data: n,
                success: r
            }, S.isPlainObject(e) && e))
        }
    }
    )),
    S.ajaxPrefilter((function(e) {
        var t;
        for (t in e.headers)
            "content-type" === t.toLowerCase() && (e.contentType = e.headers[t] || "")
    }
    )),
    S._evalUrl = function(e, t, n) {
        return S.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: {
                "text script": function() {}
            },
            dataFilter: function(e) {
                S.globalEval(e, t, n)
            }
        })
    }
    ,
    S.fn.extend({
        wrapAll: function(e) {
            var t;
            return this[0] && (h(e) && (e = e.call(this[0])),
            t = S(e, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && t.insertBefore(this[0]),
            t.map((function() {
                for (var e = this; e.firstElementChild; )
                    e = e.firstElementChild;
                return e
            }
            )).append(this)),
            this
        },
        wrapInner: function(e) {
            return h(e) ? this.each((function(t) {
                S(this).wrapInner(e.call(this, t))
            }
            )) : this.each((function() {
                var t = S(this)
                  , n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            }
            ))
        },
        wrap: function(e) {
            var t = h(e);
            return this.each((function(n) {
                S(this).wrapAll(t ? e.call(this, n) : e)
            }
            ))
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each((function() {
                S(this).replaceWith(this.childNodes)
            }
            )),
            this
        }
    }),
    S.expr.pseudos.hidden = function(e) {
        return !S.expr.pseudos.visible(e)
    }
    ,
    S.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }
    ,
    S.ajaxSettings.xhr = function() {
        try {
            return new e.XMLHttpRequest
        } catch (e) {}
    }
    ;
    var Ut = {
        0: 200,
        1223: 204
    }
      , Kt = S.ajaxSettings.xhr();
    f.cors = !!Kt && "withCredentials"in Kt,
    f.ajax = Kt = !!Kt,
    S.ajaxTransport((function(t) {
        var n, r;
        if (f.cors || Kt && !t.crossDomain)
            return {
                send: function(i, a) {
                    var s, o = t.xhr();
                    if (o.open(t.type, t.url, t.async, t.username, t.password),
                    t.xhrFields)
                        for (s in t.xhrFields)
                            o[s] = t.xhrFields[s];
                    for (s in t.mimeType && o.overrideMimeType && o.overrideMimeType(t.mimeType),
                    t.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest"),
                    i)
                        o.setRequestHeader(s, i[s]);
                    n = function(e) {
                        return function() {
                            n && (n = r = o.onload = o.onerror = o.onabort = o.ontimeout = o.onreadystatechange = null,
                            "abort" === e ? o.abort() : "error" === e ? "number" != typeof o.status ? a(0, "error") : a(o.status, o.statusText) : a(Ut[o.status] || o.status, o.statusText, "text" !== (o.responseType || "text") || "string" != typeof o.responseText ? {
                                binary: o.response
                            } : {
                                text: o.responseText
                            }, o.getAllResponseHeaders()))
                        }
                    }
                    ,
                    o.onload = n(),
                    r = o.onerror = o.ontimeout = n("error"),
                    void 0 !== o.onabort ? o.onabort = r : o.onreadystatechange = function() {
                        4 === o.readyState && e.setTimeout((function() {
                            n && r()
                        }
                        ))
                    }
                    ,
                    n = n("abort");
                    try {
                        o.send(t.hasContent && t.data || null)
                    } catch (e) {
                        if (n)
                            throw e
                    }
                },
                abort: function() {
                    n && n()
                }
            }
    }
    )),
    S.ajaxPrefilter((function(e) {
        e.crossDomain && (e.contents.script = !1)
    }
    )),
    S.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return S.globalEval(e),
                e
            }
        }
    }),
    S.ajaxPrefilter("script", (function(e) {
        void 0 === e.cache && (e.cache = !1),
        e.crossDomain && (e.type = "GET")
    }
    )),
    S.ajaxTransport("script", (function(e) {
        var t, n;
        if (e.crossDomain || e.scriptAttrs)
            return {
                send: function(r, i) {
                    t = S("<script>").attr(e.scriptAttrs || {}).prop({
                        charset: e.scriptCharset,
                        src: e.url
                    }).on("load error", n = function(e) {
                        t.remove(),
                        n = null,
                        e && i("error" === e.type ? 404 : 200, e.type)
                    }
                    ),
                    g.head.appendChild(t[0])
                },
                abort: function() {
                    n && n()
                }
            }
    }
    ));
    var Jt, Qt = [], Zt = /(=)\?(?=&|$)|\?\?/;
    S.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Qt.pop() || S.expando + "_" + Dt.guid++;
            return this[e] = !0,
            e
        }
    }),
    S.ajaxPrefilter("json jsonp", (function(t, n, r) {
        var i, a, s, o = !1 !== t.jsonp && (Zt.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && Zt.test(t.data) && "data");
        if (o || "jsonp" === t.dataTypes[0])
            return i = t.jsonpCallback = h(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
            o ? t[o] = t[o].replace(Zt, "$1" + i) : !1 !== t.jsonp && (t.url += (At.test(t.url) ? "&" : "?") + t.jsonp + "=" + i),
            t.converters["script json"] = function() {
                return s || S.error(i + " was not called"),
                s[0]
            }
            ,
            t.dataTypes[0] = "json",
            a = e[i],
            e[i] = function() {
                s = arguments
            }
            ,
            r.always((function() {
                void 0 === a ? S(e).removeProp(i) : e[i] = a,
                t[i] && (t.jsonpCallback = n.jsonpCallback,
                Qt.push(i)),
                s && h(a) && a(s[0]),
                s = a = void 0
            }
            )),
            "script"
    }
    )),
    f.createHTMLDocument = ((Jt = g.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>",
    2 === Jt.childNodes.length),
    S.parseHTML = function(e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t,
        t = !1),
        t || (f.createHTMLDocument ? ((r = (t = g.implementation.createHTMLDocument("")).createElement("base")).href = g.location.href,
        t.head.appendChild(r)) : t = g),
        a = !n && [],
        (i = j.exec(e)) ? [t.createElement(i[1])] : (i = ke([e], t, a),
        a && a.length && S(a).remove(),
        S.merge([], i.childNodes)));
        var r, i, a
    }
    ,
    S.fn.load = function(e, t, n) {
        var r, i, a, s = this, o = e.indexOf(" ");
        return o > -1 && (r = St(e.slice(o)),
        e = e.slice(0, o)),
        h(t) ? (n = t,
        t = void 0) : t && "object" == typeof t && (i = "POST"),
        s.length > 0 && S.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done((function(e) {
            a = arguments,
            s.html(r ? S("<div>").append(S.parseHTML(e)).find(r) : e)
        }
        )).always(n && function(e, t) {
            s.each((function() {
                n.apply(this, a || [e.responseText, t, e])
            }
            ))
        }
        ),
        this
    }
    ,
    S.expr.pseudos.animated = function(e) {
        return S.grep(S.timers, (function(t) {
            return e === t.elem
        }
        )).length
    }
    ,
    S.offset = {
        setOffset: function(e, t, n) {
            var r, i, a, s, o, l, c = S.css(e, "position"), u = S(e), d = {};
            "static" === c && (e.style.position = "relative"),
            o = u.offset(),
            a = S.css(e, "top"),
            l = S.css(e, "left"),
            ("absolute" === c || "fixed" === c) && (a + l).indexOf("auto") > -1 ? (s = (r = u.position()).top,
            i = r.left) : (s = parseFloat(a) || 0,
            i = parseFloat(l) || 0),
            h(t) && (t = t.call(e, n, S.extend({}, o))),
            null != t.top && (d.top = t.top - o.top + s),
            null != t.left && (d.left = t.left - o.left + i),
            "using"in t ? t.using.call(e, d) : u.css(d)
        }
    },
    S.fn.extend({
        offset: function(e) {
            if (arguments.length)
                return void 0 === e ? this : this.each((function(t) {
                    S.offset.setOffset(this, e, t)
                }
                ));
            var t, n, r = this[0];
            return r ? r.getClientRects().length ? (t = r.getBoundingClientRect(),
            n = r.ownerDocument.defaultView,
            {
                top: t.top + n.pageYOffset,
                left: t.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n, r = this[0], i = {
                    top: 0,
                    left: 0
                };
                if ("fixed" === S.css(r, "position"))
                    t = r.getBoundingClientRect();
                else {
                    for (t = this.offset(),
                    n = r.ownerDocument,
                    e = r.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === S.css(e, "position"); )
                        e = e.parentNode;
                    e && e !== r && 1 === e.nodeType && ((i = S(e).offset()).top += S.css(e, "borderTopWidth", !0),
                    i.left += S.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - i.top - S.css(r, "marginTop", !0),
                    left: t.left - i.left - S.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map((function() {
                for (var e = this.offsetParent; e && "static" === S.css(e, "position"); )
                    e = e.offsetParent;
                return e || pe
            }
            ))
        }
    }),
    S.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, (function(e, t) {
        var n = "pageYOffset" === t;
        S.fn[e] = function(r) {
            return J(this, (function(e, r, i) {
                var a;
                if (m(e) ? a = e : 9 === e.nodeType && (a = e.defaultView),
                void 0 === i)
                    return a ? a[t] : e[r];
                a ? a.scrollTo(n ? a.pageXOffset : i, n ? i : a.pageYOffset) : e[r] = i
            }
            ), e, r, arguments.length)
        }
    }
    )),
    S.each(["top", "left"], (function(e, t) {
        S.cssHooks[t] = Je(f.pixelPosition, (function(e, n) {
            if (n)
                return n = Ke(e, t),
                Xe.test(n) ? S(e).position()[t] + "px" : n
        }
        ))
    }
    )),
    S.each({
        Height: "height",
        Width: "width"
    }, (function(e, t) {
        S.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, (function(n, r) {
            S.fn[r] = function(i, a) {
                var s = arguments.length && (n || "boolean" != typeof i)
                  , o = n || (!0 === i || !0 === a ? "margin" : "border");
                return J(this, (function(t, n, i) {
                    var a;
                    return m(t) ? 0 === r.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (a = t.documentElement,
                    Math.max(t.body["scroll" + e], a["scroll" + e], t.body["offset" + e], a["offset" + e], a["client" + e])) : void 0 === i ? S.css(t, n, o) : S.style(t, n, i, o)
                }
                ), t, s ? i : void 0, s)
            }
        }
        ))
    }
    )),
    S.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], (function(e, t) {
        S.fn[t] = function(e) {
            return this.on(t, e)
        }
    }
    )),
    S.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        },
        hover: function(e, t) {
            return this.on("mouseenter", e).on("mouseleave", t || e)
        }
    }),
    S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), (function(e, t) {
        S.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }
    ));
    var en = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
    S.proxy = function(e, t) {
        var n, r, a;
        if ("string" == typeof t && (n = e[t],
        t = e,
        e = n),
        h(e))
            return r = i.call(arguments, 2),
            a = function() {
                return e.apply(t || this, r.concat(i.call(arguments)))
            }
            ,
            a.guid = e.guid = e.guid || S.guid++,
            a
    }
    ,
    S.holdReady = function(e) {
        e ? S.readyWait++ : S.ready(!0)
    }
    ,
    S.isArray = Array.isArray,
    S.parseJSON = JSON.parse,
    S.nodeName = _,
    S.isFunction = h,
    S.isWindow = m,
    S.camelCase = te,
    S.type = b,
    S.now = Date.now,
    S.isNumeric = function(e) {
        var t = S.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }
    ,
    S.trim = function(e) {
        return null == e ? "" : (e + "").replace(en, "$1")
    }
    ,
    "function" == typeof define && define.amd && define("jquery", [], (function() {
        return S
    }
    ));
    var tn = e.jQuery
      , nn = e.$;
    return S.noConflict = function(t) {
        return e.$ === S && (e.$ = nn),
        t && e.jQuery === S && (e.jQuery = tn),
        S
    }
    ,
    void 0 === t && (e.jQuery = e.$ = S),
    S
}
));
var jq37 = jQuery.noConflict(true);
