!function() {
    "use strict";
    function e(r) {
        if (!r)
            throw new Error("No options passed to Waypoint constructor");
        if (!r.element)
            throw new Error("No element option passed to Waypoint constructor");
        if (!r.handler)
            throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + t,
        this.options = e.Adapter.extend({}, e.defaults, r),
        this.element = this.options.element,
        this.adapter = new e.Adapter(this.element),
        this.callback = r.handler,
        this.axis = this.options.horizontal ? "horizontal" : "vertical",
        this.enabled = this.options.enabled,
        this.triggerPoint = null,
        this.group = e.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }),
        this.context = e.Context.findOrCreateByElement(this.options.context),
        e.offsetAliases[this.options.offset] && (this.options.offset = e.offsetAliases[this.options.offset]),
        this.group.add(this),
        this.context.add(this),
        n[this.key] = this,
        t += 1
    }
    var t = 0
      , n = {};
    e.prototype.queueTrigger = function(e) {
        this.group.queueTrigger(this, e)
    }
    ,
    e.prototype.trigger = function(e) {
        this.enabled && this.callback && this.callback.apply(this, e)
    }
    ,
    e.prototype.destroy = function() {
        this.context.remove(this),
        this.group.remove(this),
        delete n[this.key]
    }
    ,
    e.prototype.disable = function() {
        return this.enabled = !1,
        this
    }
    ,
    e.prototype.enable = function() {
        return this.context.refresh(),
        this.enabled = !0,
        this
    }
    ,
    e.prototype.next = function() {
        return this.group.next(this)
    }
    ,
    e.prototype.previous = function() {
        return this.group.previous(this)
    }
    ,
    e.invokeAll = function(e) {
        var t = [];
        for (var r in n)
            t.push(n[r]);
        for (var i = 0, a = t.length; a > i; i++)
            t[i][e]()
    }
    ,
    e.destroyAll = function() {
        e.invokeAll("destroy")
    }
    ,
    e.disableAll = function() {
        e.invokeAll("disable")
    }
    ,
    e.enableAll = function() {
        for (var t in e.Context.refreshAll(),
        n)
            n[t].enabled = !0;
        return this
    }
    ,
    e.refreshAll = function() {
        e.Context.refreshAll()
    }
    ,
    e.viewportHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight
    }
    ,
    e.viewportWidth = function() {
        return document.documentElement.clientWidth
    }
    ,
    e.adapters = [],
    e.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    },
    e.offsetAliases = {
        "bottom-in-view": function() {
            return this.context.innerHeight() - this.adapter.outerHeight()
        },
        "right-in-view": function() {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    },
    window.Waypoint = e
}(),
function() {
    "use strict";
    function e(e) {
        window.setTimeout(e, 1e3 / 60)
    }
    function t(e) {
        this.element = e,
        this.Adapter = i.Adapter,
        this.adapter = new this.Adapter(e),
        this.key = "waypoint-context-" + n,
        this.didScroll = !1,
        this.didResize = !1,
        this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        },
        this.waypoints = {
            vertical: {},
            horizontal: {}
        },
        e.waypointContextKey = this.key,
        r[e.waypointContextKey] = this,
        n += 1,
        i.windowContext || (i.windowContext = !0,
        i.windowContext = new t(window)),
        this.createThrottledScrollHandler(),
        this.createThrottledResizeHandler()
    }
    var n = 0
      , r = {}
      , i = window.Waypoint
      , a = window.onload;
    t.prototype.add = function(e) {
        var t = e.options.horizontal ? "horizontal" : "vertical";
        this.waypoints[t][e.key] = e,
        this.refresh()
    }
    ,
    t.prototype.checkEmpty = function() {
        var e = this.Adapter.isEmptyObject(this.waypoints.horizontal)
          , t = this.Adapter.isEmptyObject(this.waypoints.vertical)
          , n = this.element == this.element.window;
        e && t && !n && (this.adapter.off(".waypoints"),
        delete r[this.key])
    }
    ,
    t.prototype.createThrottledResizeHandler = function() {
        function e() {
            t.handleResize(),
            t.didResize = !1
        }
        var t = this;
        this.adapter.on("resize.waypoints", (function() {
            t.didResize || (t.didResize = !0,
            i.requestAnimationFrame(e))
        }
        ))
    }
    ,
    t.prototype.createThrottledScrollHandler = function() {
        function e() {
            t.handleScroll(),
            t.didScroll = !1
        }
        var t = this;
        this.adapter.on("scroll.waypoints", (function() {
            (!t.didScroll || i.isTouch) && (t.didScroll = !0,
            i.requestAnimationFrame(e))
        }
        ))
    }
    ,
    t.prototype.handleResize = function() {
        i.Context.refreshAll()
    }
    ,
    t.prototype.handleScroll = function() {
        var e = {}
          , t = {
            horizontal: {
                newScroll: this.adapter.scrollLeft(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left"
            },
            vertical: {
                newScroll: this.adapter.scrollTop(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up"
            }
        };
        for (var n in t) {
            var r = t[n]
              , i = r.newScroll > r.oldScroll ? r.forward : r.backward;
            for (var a in this.waypoints[n]) {
                var s = this.waypoints[n][a];
                if (null !== s.triggerPoint) {
                    var o = r.oldScroll < s.triggerPoint
                      , l = r.newScroll >= s.triggerPoint;
                    (o && l || !o && !l) && (s.queueTrigger(i),
                    e[s.group.id] = s.group)
                }
            }
        }
        for (var c in e)
            e[c].flushTriggers();
        this.oldScroll = {
            x: t.horizontal.newScroll,
            y: t.vertical.newScroll
        }
    }
    ,
    t.prototype.innerHeight = function() {
        return this.element == this.element.window ? i.viewportHeight() : this.adapter.innerHeight()
    }
    ,
    t.prototype.remove = function(e) {
        delete this.waypoints[e.axis][e.key],
        this.checkEmpty()
    }
    ,
    t.prototype.innerWidth = function() {
        return this.element == this.element.window ? i.viewportWidth() : this.adapter.innerWidth()
    }
    ,
    t.prototype.destroy = function() {
        var e = [];
        for (var t in this.waypoints)
            for (var n in this.waypoints[t])
                e.push(this.waypoints[t][n]);
        for (var r = 0, i = e.length; i > r; r++)
            e[r].destroy()
    }
    ,
    t.prototype.refresh = function() {
        var e, t = this.element == this.element.window, n = t ? void 0 : this.adapter.offset(), r = {};
        for (var a in this.handleScroll(),
        e = {
            horizontal: {
                contextOffset: t ? 0 : n.left,
                contextScroll: t ? 0 : this.oldScroll.x,
                contextDimension: this.innerWidth(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left",
                offsetProp: "left"
            },
            vertical: {
                contextOffset: t ? 0 : n.top,
                contextScroll: t ? 0 : this.oldScroll.y,
                contextDimension: this.innerHeight(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up",
                offsetProp: "top"
            }
        }) {
            var s = e[a];
            for (var o in this.waypoints[a]) {
                var l, c, u, d, p = this.waypoints[a][o], f = p.options.offset, h = p.triggerPoint, m = 0, g = null == h;
                p.element !== p.element.window && (m = p.adapter.offset()[s.offsetProp]),
                "function" == typeof f ? f = f.apply(p) : "string" == typeof f && (f = parseFloat(f),
                p.options.offset.indexOf("%") > -1 && (f = Math.ceil(s.contextDimension * f / 100))),
                l = s.contextScroll - s.contextOffset,
                p.triggerPoint = Math.floor(m + l - f),
                c = h < s.oldScroll,
                u = p.triggerPoint >= s.oldScroll,
                d = !c && !u,
                !g && (c && u) ? (p.queueTrigger(s.backward),
                r[p.group.id] = p.group) : (!g && d || g && s.oldScroll >= p.triggerPoint) && (p.queueTrigger(s.forward),
                r[p.group.id] = p.group)
            }
        }
        return i.requestAnimationFrame((function() {
            for (var e in r)
                r[e].flushTriggers()
        }
        )),
        this
    }
    ,
    t.findOrCreateByElement = function(e) {
        return t.findByElement(e) || new t(e)
    }
    ,
    t.refreshAll = function() {
        for (var e in r)
            r[e].refresh()
    }
    ,
    t.findByElement = function(e) {
        return r[e.waypointContextKey]
    }
    ,
    window.onload = function() {
        a && a(),
        t.refreshAll()
    }
    ,
    i.requestAnimationFrame = function(t) {
        (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || e).call(window, t)
    }
    ,
    i.Context = t
}(),
function() {
    "use strict";
    function e(e, t) {
        return e.triggerPoint - t.triggerPoint
    }
    function t(e, t) {
        return t.triggerPoint - e.triggerPoint
    }
    function n(e) {
        this.name = e.name,
        this.axis = e.axis,
        this.id = this.name + "-" + this.axis,
        this.waypoints = [],
        this.clearTriggerQueues(),
        r[this.axis][this.name] = this
    }
    var r = {
        vertical: {},
        horizontal: {}
    }
      , i = window.Waypoint;
    n.prototype.add = function(e) {
        this.waypoints.push(e)
    }
    ,
    n.prototype.clearTriggerQueues = function() {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        }
    }
    ,
    n.prototype.flushTriggers = function() {
        for (var n in this.triggerQueues) {
            var r = this.triggerQueues[n]
              , i = "up" === n || "left" === n;
            r.sort(i ? t : e);
            for (var a = 0, s = r.length; s > a; a += 1) {
                var o = r[a];
                (o.options.continuous || a === r.length - 1) && o.trigger([n])
            }
        }
        this.clearTriggerQueues()
    }
    ,
    n.prototype.next = function(t) {
        this.waypoints.sort(e);
        var n = i.Adapter.inArray(t, this.waypoints);
        return n === this.waypoints.length - 1 ? null : this.waypoints[n + 1]
    }
    ,
    n.prototype.previous = function(t) {
        this.waypoints.sort(e);
        var n = i.Adapter.inArray(t, this.waypoints);
        return n ? this.waypoints[n - 1] : null
    }
    ,
    n.prototype.queueTrigger = function(e, t) {
        this.triggerQueues[t].push(e)
    }
    ,
    n.prototype.remove = function(e) {
        var t = i.Adapter.inArray(e, this.waypoints);
        t > -1 && this.waypoints.splice(t, 1)
    }
    ,
    n.prototype.first = function() {
        return this.waypoints[0]
    }
    ,
    n.prototype.last = function() {
        return this.waypoints[this.waypoints.length - 1]
    }
    ,
    n.findOrCreate = function(e) {
        return r[e.axis][e.name] || new n(e)
    }
    ,
    i.Group = n
}(),
function() {
    "use strict";
    function e(e) {
        return e === e.window
    }
    function t(t) {
        return e(t) ? t : t.defaultView
    }
    function n(e) {
        this.element = e,
        this.handlers = {}
    }
    var r = window.Waypoint;
    n.prototype.innerHeight = function() {
        return e(this.element) ? this.element.innerHeight : this.element.clientHeight
    }
    ,
    n.prototype.innerWidth = function() {
        return e(this.element) ? this.element.innerWidth : this.element.clientWidth
    }
    ,
    n.prototype.off = function(e, t) {
        function n(e, t, n) {
            for (var r = 0, i = t.length - 1; i > r; r++) {
                var a = t[r];
                n && n !== a || e.removeEventListener(a)
            }
        }
        var r = e.split(".")
          , i = r[0]
          , a = r[1]
          , s = this.element;
        if (a && this.handlers[a] && i)
            n(s, this.handlers[a][i], t),
            this.handlers[a][i] = [];
        else if (i)
            for (var o in this.handlers)
                n(s, this.handlers[o][i] || [], t),
                this.handlers[o][i] = [];
        else if (a && this.handlers[a]) {
            for (var l in this.handlers[a])
                n(s, this.handlers[a][l], t);
            this.handlers[a] = {}
        }
    }
    ,
    n.prototype.offset = function() {
        if (!this.element.ownerDocument)
            return null;
        var e = this.element.ownerDocument.documentElement
          , n = t(this.element.ownerDocument)
          , r = {
            top: 0,
            left: 0
        };
        return this.element.getBoundingClientRect && (r = this.element.getBoundingClientRect()),
        {
            top: r.top + n.pageYOffset - e.clientTop,
            left: r.left + n.pageXOffset - e.clientLeft
        }
    }
    ,
    n.prototype.on = function(e, t) {
        var n = e.split(".")
          , r = n[0]
          , i = n[1] || "__default"
          , a = this.handlers[i] = this.handlers[i] || {};
        (a[r] = a[r] || []).push(t),
        this.element.addEventListener(r, t)
    }
    ,
    n.prototype.outerHeight = function(t) {
        var n, r = this.innerHeight();
        return t && !e(this.element) && (n = window.getComputedStyle(this.element),
        r += parseInt(n.marginTop, 10),
        r += parseInt(n.marginBottom, 10)),
        r
    }
    ,
    n.prototype.outerWidth = function(t) {
        var n, r = this.innerWidth();
        return t && !e(this.element) && (n = window.getComputedStyle(this.element),
        r += parseInt(n.marginLeft, 10),
        r += parseInt(n.marginRight, 10)),
        r
    }
    ,
    n.prototype.scrollLeft = function() {
        var e = t(this.element);
        return e ? e.pageXOffset : this.element.scrollLeft
    }
    ,
    n.prototype.scrollTop = function() {
        var e = t(this.element);
        return e ? e.pageYOffset : this.element.scrollTop
    }
    ,
    n.extend = function() {
        function e(e, t) {
            if ("object" == typeof e && "object" == typeof t)
                for (var n in t)
                    t.hasOwnProperty(n) && (e[n] = t[n]);
            return e
        }
        for (var t = Array.prototype.slice.call(arguments), n = 1, r = t.length; r > n; n++)
            e(t[0], t[n]);
        return t[0]
    }
    ,
    n.inArray = function(e, t, n) {
        return null == t ? -1 : t.indexOf(e, n)
    }
    ,
    n.isEmptyObject = function(e) {
        for (var t in e)
            return !1;
        return !0
    }
    ,
    r.adapters.push({
        name: "noframework",
        Adapter: n
    }),
    r.Adapter = n
}(),
function(e) {
    "use strict";
    var t;
    "function" == typeof define && define.amd ? define(["jquery"], (function(t) {
        return e(t, window, document)
    }
    )) : "object" == typeof exports ? (t = require("jquery"),
    "undefined" != typeof window ? module.exports = function(n, r) {
        return n = n || window,
        r = r || t(n),
        e(r, n, n.document)
    }
    : e(t, window, window.document)) : window.DataTable = e(jQuery, window, document)
}((function(e, t, n, r) {
    "use strict";
    function i(e) {
        var t = parseInt(e, 10);
        return !isNaN(t) && isFinite(e) ? t : null
    }
    function a(e, t, n) {
        var r = typeof e
          , i = "string" == r;
        return "number" == r || "bigint" == r || !!x(e) || (t && i && (e = T(e, t)),
        n && i && (e = e.replace(w, "")),
        !isNaN(parseFloat(e)) && isFinite(e))
    }
    function s(e, t, n) {
        var r;
        return !!x(e) || (x(r = e) || "string" == typeof r) && !!a(e.replace(v, ""), t, n) || null
    }
    function o(e, t, n, i) {
        var a = []
          , s = 0
          , o = t.length;
        if (i !== r)
            for (; s < o; s++)
                e[t[s]][n] && a.push(e[t[s]][n][i]);
        else
            for (; s < o; s++)
                a.push(e[t[s]][n]);
        return a
    }
    function l(e, t) {
        var n, i = [];
        t === r ? (t = 0,
        n = e) : (n = t,
        t = e);
        for (var a = t; a < n; a++)
            i.push(a);
        return i
    }
    function c(e) {
        for (var t = [], n = 0, r = e.length; n < r; n++)
            e[n] && t.push(e[n]);
        return t
    }
    function u(e, t) {
        return -1 !== this.indexOf(e, t = t === r ? 0 : t)
    }
    var d, p, f, h = function(t, n) {
        if (h.factory(t, n))
            return h;
        if (this instanceof h)
            return e(t).DataTable(n);
        n = t,
        this.$ = function(e, t) {
            return this.api(!0).$(e, t)
        }
        ,
        this._ = function(e, t) {
            return this.api(!0).rows(e, t).data()
        }
        ,
        this.api = function(e) {
            return new Ct(e ? st(this[d.iApiIndex]) : this)
        }
        ,
        this.fnAddData = function(t, n) {
            var i = this.api(!0);
            t = (Array.isArray(t) && (Array.isArray(t[0]) || e.isPlainObject(t[0])) ? i.rows : i.row).add(t);
            return n !== r && !n || i.draw(),
            t.flatten().toArray()
        }
        ,
        this.fnAdjustColumnSizing = function(e) {
            var t = this.api(!0).columns.adjust()
              , n = t.settings()[0]
              , i = n.oScroll;
            e === r || e ? t.draw(!1) : "" === i.sX && "" === i.sY || Re(n)
        }
        ,
        this.fnClearTable = function(e) {
            var t = this.api(!0).clear();
            e !== r && !e || t.draw()
        }
        ,
        this.fnClose = function(e) {
            this.api(!0).row(e).child.hide()
        }
        ,
        this.fnDeleteRow = function(e, t, n) {
            var i = this.api(!0)
              , a = (e = i.rows(e)).settings()[0]
              , s = a.aoData[e[0][0]];
            return e.remove(),
            t && t.call(this, a, s),
            n !== r && !n || i.draw(),
            s
        }
        ,
        this.fnDestroy = function(e) {
            this.api(!0).destroy(e)
        }
        ,
        this.fnDraw = function(e) {
            this.api(!0).draw(e)
        }
        ,
        this.fnFilter = function(e, t, n, i, a, s) {
            var o = this.api(!0);
            (null === t || t === r ? o : o.column(t)).search(e, n, i, s),
            o.draw()
        }
        ,
        this.fnGetData = function(e, t) {
            var n, i = this.api(!0);
            return e !== r ? (n = e.nodeName ? e.nodeName.toLowerCase() : "",
            t !== r || "td" == n || "th" == n ? i.cell(e, t).data() : i.row(e).data() || null) : i.data().toArray()
        }
        ,
        this.fnGetNodes = function(e) {
            var t = this.api(!0);
            return e !== r ? t.row(e).node() : t.rows().nodes().flatten().toArray()
        }
        ,
        this.fnGetPosition = function(e) {
            var t = this.api(!0)
              , n = e.nodeName.toUpperCase();
            return "TR" == n ? t.row(e).index() : "TD" == n || "TH" == n ? [(n = t.cell(e).index()).row, n.columnVisible, n.column] : null
        }
        ,
        this.fnIsOpen = function(e) {
            return this.api(!0).row(e).child.isShown()
        }
        ,
        this.fnOpen = function(e, t, n) {
            return this.api(!0).row(e).child(t, n).show().child()[0]
        }
        ,
        this.fnPageChange = function(e, t) {
            e = this.api(!0).page(e),
            t !== r && !t || e.draw(!1)
        }
        ,
        this.fnSetColumnVis = function(e, t, n) {
            e = this.api(!0).column(e).visible(t),
            n !== r && !n || e.columns.adjust().draw()
        }
        ,
        this.fnSettings = function() {
            return st(this[d.iApiIndex])
        }
        ,
        this.fnSort = function(e) {
            this.api(!0).order(e).draw()
        }
        ,
        this.fnSortListener = function(e, t, n) {
            this.api(!0).order.listener(e, t, n)
        }
        ,
        this.fnUpdate = function(e, t, n, i, a) {
            var s = this.api(!0);
            return (n === r || null === n ? s.row(t) : s.cell(t, n)).data(e),
            a !== r && !a || s.columns.adjust(),
            i !== r && !i || s.draw(),
            0
        }
        ,
        this.fnVersionCheck = d.fnVersionCheck;
        var i, a = this, s = n === r, o = this.length;
        for (i in s && (n = {}),
        this.oApi = this.internal = d.internal,
        h.ext.internal)
            i && (this[i] = Xt(i));
        return this.each((function() {
            var t = 1 < o ? ct({}, n, !0) : n
              , i = 0
              , l = this.getAttribute("id")
              , c = !1
              , u = h.defaults
              , d = e(this);
            if ("table" != this.nodeName.toLowerCase())
                ot(null, 0, "Non-table node initialisation (" + this.nodeName + ")", 2);
            else {
                L(u),
                M(u.column),
                D(u, u, !0),
                D(u.column, u.column, !0),
                D(u, e.extend(t, d.data()), !0);
                for (var p = h.settings, f = (i = 0,
                p.length); i < f; i++) {
                    var m = p[i];
                    if (m.nTable == this || m.nTHead && m.nTHead.parentNode == this || m.nTFoot && m.nTFoot.parentNode == this) {
                        var g = (t.bRetrieve !== r ? t : u).bRetrieve
                          , v = (t.bDestroy !== r ? t : u).bDestroy;
                        if (s || g)
                            return m.oInstance;
                        if (v) {
                            m.oInstance.fnDestroy();
                            break
                        }
                        return void ot(m, 0, "Cannot reinitialise DataTable", 3)
                    }
                    if (m.sTableId == this.id) {
                        p.splice(i, 1);
                        break
                    }
                }
                null !== l && "" !== l || (l = "DataTables_Table_" + h.ext._unique++,
                this.id = l);
                var b, y, w = e.extend(!0, {}, h.models.oSettings, {
                    sDestroyWidth: d[0].style.width,
                    sInstance: l,
                    sTableId: l
                }), x = (w.nTable = this,
                w.oApi = a.internal,
                w.oInit = t,
                p.push(w),
                w.oInstance = 1 === a.length ? a : d.dataTable(),
                L(t),
                A(t.oLanguage),
                t.aLengthMenu && !t.iDisplayLength && (t.iDisplayLength = (Array.isArray(t.aLengthMenu[0]) ? t.aLengthMenu[0] : t.aLengthMenu)[0]),
                t = ct(e.extend(!0, {}, u), t),
                lt(w.oFeatures, t, ["bPaginate", "bLengthChange", "bFilter", "bSort", "bSortMulti", "bInfo", "bProcessing", "bAutoWidth", "bSortClasses", "bServerSide", "bDeferRender"]),
                lt(w, t, ["asStripeClasses", "ajax", "fnServerData", "fnFormatNumber", "sServerMethod", "aaSorting", "aaSortingFixed", "aLengthMenu", "sPaginationType", "sAjaxSource", "sAjaxDataProp", "iStateDuration", "sDom", "bSortCellsTop", "iTabIndex", "fnStateLoadCallback", "fnStateSaveCallback", "renderer", "searchDelay", "rowId", ["iCookieDuration", "iStateDuration"], ["oSearch", "oPreviousSearch"], ["aoSearchCols", "aoPreSearchCols"], ["iDisplayLength", "_iDisplayLength"]]),
                lt(w.oScroll, t, [["sScrollX", "sX"], ["sScrollXInner", "sXInner"], ["sScrollY", "sY"], ["bScrollCollapse", "bCollapse"]]),
                lt(w.oLanguage, t, "fnInfoCallback"),
                dt(w, "aoDrawCallback", t.fnDrawCallback, "user"),
                dt(w, "aoServerParams", t.fnServerParams, "user"),
                dt(w, "aoStateSaveParams", t.fnStateSaveParams, "user"),
                dt(w, "aoStateLoadParams", t.fnStateLoadParams, "user"),
                dt(w, "aoStateLoaded", t.fnStateLoaded, "user"),
                dt(w, "aoRowCallback", t.fnRowCallback, "user"),
                dt(w, "aoRowCreatedCallback", t.fnCreatedRow, "user"),
                dt(w, "aoHeaderCallback", t.fnHeaderCallback, "user"),
                dt(w, "aoFooterCallback", t.fnFooterCallback, "user"),
                dt(w, "aoInitComplete", t.fnInitComplete, "user"),
                dt(w, "aoPreDrawCallback", t.fnPreDrawCallback, "user"),
                w.rowIdFn = K(t.rowId),
                P(w),
                w.oClasses), T = (e.extend(x, h.ext.classes, t.oClasses),
                d.addClass(x.sTable),
                w.iInitDisplayStart === r && (w.iInitDisplayStart = t.iDisplayStart,
                w._iDisplayStart = t.iDisplayStart),
                null !== t.iDeferLoading && (w.bDeferLoading = !0,
                l = Array.isArray(t.iDeferLoading),
                w._iRecordsDisplay = l ? t.iDeferLoading[0] : t.iDeferLoading,
                w._iRecordsTotal = l ? t.iDeferLoading[1] : t.iDeferLoading),
                w.oLanguage), S = (l = (e.extend(!0, T, t.oLanguage),
                T.sUrl ? (e.ajax({
                    dataType: "json",
                    url: T.sUrl,
                    success: function(t) {
                        D(u.oLanguage, t),
                        A(t),
                        e.extend(!0, T, t, w.oInit.oLanguage),
                        pt(w, null, "i18n", [w]),
                        Pe(w)
                    },
                    error: function() {
                        Pe(w)
                    }
                }),
                c = !0) : pt(w, null, "i18n", [w]),
                null === t.asStripeClasses && (w.asStripeClasses = [x.sStripeOdd, x.sStripeEven]),
                w.asStripeClasses),
                d.children("tbody").find("tr").eq(0)), _ = (-1 !== e.inArray(!0, e.map(l, (function(e, t) {
                    return S.hasClass(e)
                }
                ))) && (e("tbody tr", this).removeClass(l.join(" ")),
                w.asDestroyStripes = l.slice()),
                []);
                if (0 !== (l = this.getElementsByTagName("thead")).length && (ue(w.aoHeader, l[0]),
                _ = de(w)),
                null === t.aoColumns)
                    for (b = [],
                    i = 0,
                    f = _.length; i < f; i++)
                        b.push(null);
                else
                    b = t.aoColumns;
                for (i = 0,
                f = b.length; i < f; i++)
                    O(w, _ ? _[i] : null);
                B(w, t.aoColumnDefs, b, (function(e, t) {
                    N(w, e, t)
                }
                )),
                S.length && (y = function(e, t) {
                    return null !== e.getAttribute("data-" + t) ? t : null
                }
                ,
                e(S[0]).children("th, td").each((function(e, t) {
                    var n, i = w.aoColumns[e];
                    i || ot(w, 0, "Incorrect column count", 18),
                    i.mData === e && (n = y(t, "sort") || y(t, "order"),
                    t = y(t, "filter") || y(t, "search"),
                    null === n && null === t || (i.mData = {
                        _: e + ".display",
                        sort: null !== n ? e + ".@data-" + n : r,
                        type: null !== n ? e + ".@data-" + n : r,
                        filter: null !== t ? e + ".@data-" + t : r
                    },
                    i._isArrayHost = !0,
                    N(w, e)))
                }
                )));
                var C = w.oFeatures;
                l = function() {
                    if (t.aaSorting === r) {
                        var n = w.aaSorting;
                        for (i = 0,
                        f = n.length; i < f; i++)
                            n[i][1] = w.aoColumns[i].asSorting[0]
                    }
                    tt(w),
                    C.bSort && dt(w, "aoDrawCallback", (function() {
                        var t, n;
                        w.bSorted && (t = Ke(w),
                        n = {},
                        e.each(t, (function(e, t) {
                            n[t.src] = t.dir
                        }
                        )),
                        pt(w, null, "order", [w, t, n]),
                        Qe(w))
                    }
                    )),
                    dt(w, "aoDrawCallback", (function() {
                        (w.bSorted || "ssp" === mt(w) || C.bDeferRender) && tt(w)
                    }
                    ), "sc");
                    var a, s = d.children("caption").each((function() {
                        this._captionSide = e(this).css("caption-side")
                    }
                    )), o = (0 === (a = d.children("thead")).length && (a = e("<thead/>").appendTo(d)),
                    w.nTHead = a[0],
                    d.children("tbody"));
                    if (0 === (a = 0 === (a = (0 === o.length && (o = e("<tbody/>").insertAfter(a)),
                    w.nTBody = o[0],
                    d.children("tfoot"))).length && 0 < s.length && ("" !== w.oScroll.sX || "" !== w.oScroll.sY) ? e("<tfoot/>").appendTo(d) : a).length || 0 === a.children().length ? d.addClass(x.sNoFooter) : 0 < a.length && (w.nTFoot = a[0],
                    ue(w.aoFooter, w.nTFoot)),
                    t.aaData)
                        for (i = 0; i < t.aaData.length; i++)
                            W(w, t.aaData[i]);
                    else
                        !w.bDeferLoading && "dom" != mt(w) || q(w, e(w.nTBody).children("tr"));
                    w.aiDisplay = w.aiDisplayMaster.slice(),
                    !(w.bInitialised = !0) === c && Pe(w)
                }
                ;
                dt(w, "aoDrawCallback", rt, "state_save"),
                t.bStateSave ? (C.bStateSave = !0,
                it(w, 0, l)) : l()
            }
        }
        )),
        a = null,
        this
    }, m = {}, g = /[\r\n\u2028]/g, v = /<.*?>/g, b = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/, y = new RegExp("(\\" + ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\", "$", "^", "-"].join("|\\") + ")","g"), w = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi, x = function(e) {
        return !e || !0 === e || "-" === e
    }, T = function(e, t) {
        return m[t] || (m[t] = new RegExp(Se(t),"g")),
        "string" == typeof e && "." !== t ? e.replace(/\./g, "").replace(m[t], ".") : e
    }, S = function(e, t, n) {
        var i = []
          , a = 0
          , s = e.length;
        if (n !== r)
            for (; a < s; a++)
                e[a] && e[a][t] && i.push(e[a][t][n]);
        else
            for (; a < s; a++)
                e[a] && i.push(e[a][t]);
        return i
    }, _ = function(e) {
        if (function(e) {
            if (!(e.length < 2))
                for (var t = e.slice().sort(), n = t[0], r = 1, i = t.length; r < i; r++) {
                    if (t[r] === n)
                        return !1;
                    n = t[r]
                }
            return !0
        }(e))
            return e.slice();
        var t, n, r, i = [], a = e.length, s = 0;
        e: for (n = 0; n < a; n++) {
            for (t = e[n],
            r = 0; r < s; r++)
                if (i[r] === t)
                    continue e;
            i.push(t),
            s++
        }
        return i
    }, C = function(e, t) {
        if (Array.isArray(t))
            for (var n = 0; n < t.length; n++)
                C(e, t[n]);
        else
            e.push(t);
        return e
    };
    function E(t) {
        var n, r, i = {};
        e.each(t, (function(e, a) {
            (n = e.match(/^([^A-Z]+?)([A-Z])/)) && -1 !== "a aa ai ao as b fn i m o s ".indexOf(n[1] + " ") && (r = e.replace(n[0], n[2].toLowerCase()),
            i[r] = e,
            "o" === n[1] && E(t[e]))
        }
        )),
        t._hungarianMap = i
    }
    function D(t, n, i) {
        var a;
        t._hungarianMap || E(t),
        e.each(n, (function(s, o) {
            (a = t._hungarianMap[s]) === r || !i && n[a] !== r || ("o" === a.charAt(0) ? (n[a] || (n[a] = {}),
            e.extend(!0, n[a], n[s]),
            D(t[a], n[a], i)) : n[a] = n[s])
        }
        ))
    }
    function A(e) {
        var t, n = h.defaults.oLanguage, r = n.sDecimal;
        r && Nt(r),
        e && (t = e.sZeroRecords,
        !e.sEmptyTable && t && "No data available in table" === n.sEmptyTable && lt(e, e, "sZeroRecords", "sEmptyTable"),
        !e.sLoadingRecords && t && "Loading..." === n.sLoadingRecords && lt(e, e, "sZeroRecords", "sLoadingRecords"),
        e.sInfoThousands && (e.sThousands = e.sInfoThousands),
        (t = e.sDecimal) && r !== t && Nt(t))
    }
    Array.isArray || (Array.isArray = function(e) {
        return "[object Array]" === Object.prototype.toString.call(e)
    }
    ),
    Array.prototype.includes || (Array.prototype.includes = u),
    String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
    }
    ),
    String.prototype.includes || (String.prototype.includes = u),
    h.util = {
        throttle: function(e, t) {
            var n, i, a = t !== r ? t : 200;
            return function() {
                var t = this
                  , s = +new Date
                  , o = arguments;
                n && s < n + a ? (clearTimeout(i),
                i = setTimeout((function() {
                    n = r,
                    e.apply(t, o)
                }
                ), a)) : (n = s,
                e.apply(t, o))
            }
        },
        escapeRegex: function(e) {
            return e.replace(y, "\\$1")
        },
        set: function(t) {
            var n;
            return e.isPlainObject(t) ? h.util.set(t._) : null === t ? function() {}
            : "function" == typeof t ? function(e, n, r) {
                t(e, "set", n, r)
            }
            : "string" != typeof t || -1 === t.indexOf(".") && -1 === t.indexOf("[") && -1 === t.indexOf("(") ? function(e, n) {
                e[t] = n
            }
            : (n = function(e, t, i) {
                for (var a, s, o, l, c = U(i), u = (i = c[c.length - 1],
                0), d = c.length - 1; u < d; u++) {
                    if ("__proto__" === c[u] || "constructor" === c[u])
                        throw new Error("Cannot set prototype values");
                    if (a = c[u].match(G),
                    s = c[u].match(Y),
                    a) {
                        if (c[u] = c[u].replace(G, ""),
                        e[c[u]] = [],
                        (a = c.slice()).splice(0, u + 1),
                        l = a.join("."),
                        Array.isArray(t))
                            for (var p = 0, f = t.length; p < f; p++)
                                n(o = {}, t[p], l),
                                e[c[u]].push(o);
                        else
                            e[c[u]] = t;
                        return
                    }
                    s && (c[u] = c[u].replace(Y, ""),
                    e = e[c[u]](t)),
                    null !== e[c[u]] && e[c[u]] !== r || (e[c[u]] = {}),
                    e = e[c[u]]
                }
                i.match(Y) ? e[i.replace(Y, "")](t) : e[i.replace(G, "")] = t
            }
            ,
            function(e, r) {
                return n(e, r, t)
            }
            )
        },
        get: function(t) {
            var n, i;
            return e.isPlainObject(t) ? (n = {},
            e.each(t, (function(e, t) {
                t && (n[e] = h.util.get(t))
            }
            )),
            function(e, t, i, a) {
                var s = n[t] || n._;
                return s !== r ? s(e, t, i, a) : e
            }
            ) : null === t ? function(e) {
                return e
            }
            : "function" == typeof t ? function(e, n, r, i) {
                return t(e, n, r, i)
            }
            : "string" != typeof t || -1 === t.indexOf(".") && -1 === t.indexOf("[") && -1 === t.indexOf("(") ? function(e, n) {
                return e[t]
            }
            : (i = function(e, t, n) {
                var a, s, o;
                if ("" !== n)
                    for (var l = U(n), c = 0, u = l.length; c < u; c++) {
                        if (f = l[c].match(G),
                        a = l[c].match(Y),
                        f) {
                            if (l[c] = l[c].replace(G, ""),
                            "" !== l[c] && (e = e[l[c]]),
                            s = [],
                            l.splice(0, c + 1),
                            o = l.join("."),
                            Array.isArray(e))
                                for (var d = 0, p = e.length; d < p; d++)
                                    s.push(i(e[d], t, o));
                            var f = f[0].substring(1, f[0].length - 1);
                            e = "" === f ? s : s.join(f);
                            break
                        }
                        if (a)
                            l[c] = l[c].replace(Y, ""),
                            e = e[l[c]]();
                        else {
                            if (null === e || e[l[c]] === r)
                                return r;
                            e = e[l[c]]
                        }
                    }
                return e
            }
            ,
            function(e, n) {
                return i(e, n, t)
            }
            )
        }
    };
    var k = function(e, t, n) {
        e[t] !== r && (e[n] = e[t])
    };
    function L(e) {
        k(e, "ordering", "bSort"),
        k(e, "orderMulti", "bSortMulti"),
        k(e, "orderClasses", "bSortClasses"),
        k(e, "orderCellsTop", "bSortCellsTop"),
        k(e, "order", "aaSorting"),
        k(e, "orderFixed", "aaSortingFixed"),
        k(e, "paging", "bPaginate"),
        k(e, "pagingType", "sPaginationType"),
        k(e, "pageLength", "iDisplayLength"),
        k(e, "searching", "bFilter"),
        "boolean" == typeof e.sScrollX && (e.sScrollX = e.sScrollX ? "100%" : ""),
        "boolean" == typeof e.scrollX && (e.scrollX = e.scrollX ? "100%" : "");
        var t = e.aoSearchCols;
        if (t)
            for (var n = 0, r = t.length; n < r; n++)
                t[n] && D(h.models.oSearch, t[n])
    }
    function M(e) {
        k(e, "orderable", "bSortable"),
        k(e, "orderData", "aDataSort"),
        k(e, "orderSequence", "asSorting"),
        k(e, "orderDataType", "sortDataType");
        var t = e.aDataSort;
        "number" != typeof t || Array.isArray(t) || (e.aDataSort = [t])
    }
    function P(n) {
        var r, i, a, s;
        h.__browser || (h.__browser = r = {},
        s = (a = (i = e("<div/>").css({
            position: "fixed",
            top: 0,
            left: -1 * e(t).scrollLeft(),
            height: 1,
            width: 1,
            overflow: "hidden"
        }).append(e("<div/>").css({
            position: "absolute",
            top: 1,
            left: 1,
            width: 100,
            overflow: "scroll"
        }).append(e("<div/>").css({
            width: "100%",
            height: 10
        }))).appendTo("body")).children()).children(),
        r.barWidth = a[0].offsetWidth - a[0].clientWidth,
        r.bScrollOversize = 100 === s[0].offsetWidth && 100 !== a[0].clientWidth,
        r.bScrollbarLeft = 1 !== Math.round(s.offset().left),
        r.bBounding = !!i[0].getBoundingClientRect().width,
        i.remove()),
        e.extend(n.oBrowser, h.__browser),
        n.oScroll.iBarWidth = h.__browser.barWidth
    }
    function I(e, t, n, i, a, s) {
        var o, l = i, c = !1;
        for (n !== r && (o = n,
        c = !0); l !== a; )
            e.hasOwnProperty(l) && (o = c ? t(o, e[l], l, e) : e[l],
            c = !0,
            l += s);
        return o
    }
    function O(t, r) {
        var i = h.defaults.column
          , a = t.aoColumns.length;
        i = e.extend({}, h.models.oColumn, i, {
            nTh: r || n.createElement("th"),
            sTitle: i.sTitle || (r ? r.innerHTML : ""),
            aDataSort: i.aDataSort || [a],
            mData: i.mData || a,
            idx: a
        });
        (i = (t.aoColumns.push(i),
        t.aoPreSearchCols))[a] = e.extend({}, h.models.oSearch, i[a]),
        N(t, a, e(r).data())
    }
    function N(t, n, i) {
        function a(e) {
            return "string" == typeof e && -1 !== e.indexOf("@")
        }
        n = t.aoColumns[n];
        var s = t.oClasses
          , o = e(n.nTh)
          , l = (n.sWidthOrig || (n.sWidthOrig = o.attr("width") || null,
        (d = (o.attr("style") || "").match(/width:\s*(\d+[pxem%]+)/)) && (n.sWidthOrig = d[1])),
        i !== r && null !== i && (M(i),
        D(h.defaults.column, i, !0),
        i.mDataProp === r || i.mData || (i.mData = i.mDataProp),
        i.sType && (n._sManualType = i.sType),
        i.className && !i.sClass && (i.sClass = i.className),
        i.sClass && o.addClass(i.sClass),
        d = n.sClass,
        e.extend(n, i),
        lt(n, i, "sWidth", "sWidthOrig"),
        d !== n.sClass && (n.sClass = d + " " + n.sClass),
        i.iDataSort !== r && (n.aDataSort = [i.iDataSort]),
        lt(n, i, "aDataSort")),
        n.mData)
          , c = K(l)
          , u = n.mRender ? K(n.mRender) : null
          , d = (n._bAttrSrc = e.isPlainObject(l) && (a(l.sort) || a(l.type) || a(l.filter)),
        n._setter = null,
        n.fnGetData = function(e, t, n) {
            var i = c(e, t, r, n);
            return u && t ? u(i, t, e, n) : i
        }
        ,
        n.fnSetData = function(e, t, n) {
            return J(l)(e, t, n)
        }
        ,
        "number" == typeof l || n._isArrayHost || (t._rowReadObject = !0),
        t.oFeatures.bSort || (n.bSortable = !1,
        o.addClass(s.sSortableNone)),
        -1 !== e.inArray("asc", n.asSorting));
        i = -1 !== e.inArray("desc", n.asSorting);
        n.bSortable && (d || i) ? d && !i ? (n.sSortingClass = s.sSortableAsc,
        n.sSortingClassJUI = s.sSortJUIAscAllowed) : !d && i ? (n.sSortingClass = s.sSortableDesc,
        n.sSortingClassJUI = s.sSortJUIDescAllowed) : (n.sSortingClass = s.sSortable,
        n.sSortingClassJUI = s.sSortJUI) : (n.sSortingClass = s.sSortableNone,
        n.sSortingClassJUI = "")
    }
    function j(e) {
        if (!1 !== e.oFeatures.bAutoWidth) {
            var t = e.aoColumns;
            qe(e);
            for (var n = 0, r = t.length; n < r; n++)
                t[n].nTh.style.width = t[n].sWidth
        }
        var i = e.oScroll;
        "" === i.sY && "" === i.sX || Re(e),
        pt(e, null, "column-sizing", [e])
    }
    function z(e, t) {
        return "number" == typeof (e = F(e, "bVisible"))[t] ? e[t] : null
    }
    function H(t, n) {
        return t = F(t, "bVisible"),
        -1 !== (n = e.inArray(n, t)) ? n : null
    }
    function $(t) {
        var n = 0;
        return e.each(t.aoColumns, (function(t, r) {
            r.bVisible && "none" !== e(r.nTh).css("display") && n++
        }
        )),
        n
    }
    function F(t, n) {
        var r = [];
        return e.map(t.aoColumns, (function(e, t) {
            e[n] && r.push(t)
        }
        )),
        r
    }
    function R(e) {
        for (var t, n, i, a, s, o, l, c = e.aoColumns, u = e.aoData, d = h.ext.type.detect, p = 0, f = c.length; p < f; p++)
            if (l = [],
            !(s = c[p]).sType && s._sManualType)
                s.sType = s._sManualType;
            else if (!s.sType) {
                for (t = 0,
                n = d.length; t < n; t++) {
                    for (i = 0,
                    a = u.length; i < a && (l[i] === r && (l[i] = X(e, i, p, "type")),
                    (o = d[t](l[i], e)) || t === d.length - 1) && ("html" !== o || x(l[i])); i++)
                        ;
                    if (o) {
                        s.sType = o;
                        break
                    }
                }
                s.sType || (s.sType = "string")
            }
    }
    function B(t, n, i, a) {
        var s, o, l, c, u = t.aoColumns;
        if (n)
            for (s = n.length - 1; 0 <= s; s--)
                for (var d, p = (d = n[s]).target !== r ? d.target : d.targets !== r ? d.targets : d.aTargets, f = 0, h = (p = Array.isArray(p) ? p : [p]).length; f < h; f++)
                    if ("number" == typeof p[f] && 0 <= p[f]) {
                        for (; u.length <= p[f]; )
                            O(t);
                        a(p[f], d)
                    } else if ("number" == typeof p[f] && p[f] < 0)
                        a(u.length + p[f], d);
                    else if ("string" == typeof p[f])
                        for (l = 0,
                        c = u.length; l < c; l++)
                            "_all" != p[f] && !e(u[l].nTh).hasClass(p[f]) || a(l, d);
        if (i)
            for (s = 0,
            o = i.length; s < o; s++)
                a(s, i[s])
    }
    function W(t, n, i, a) {
        for (var s = t.aoData.length, o = e.extend(!0, {}, h.models.oRow, {
            src: i ? "dom" : "data",
            idx: s
        }), l = (o._aData = n,
        t.aoData.push(o),
        t.aoColumns), c = 0, u = l.length; c < u; c++)
            l[c].sType = null;
        return t.aiDisplayMaster.push(s),
        (n = t.rowIdFn(n)) !== r && (t.aIds[n] = o),
        !i && t.oFeatures.bDeferRender || re(t, s, i, a),
        s
    }
    function q(t, n) {
        var r;
        return (n = n instanceof e ? n : e(n)).map((function(e, n) {
            return r = ne(t, n),
            W(t, r.data, n, r.cells)
        }
        ))
    }
    function X(e, t, n, i) {
        "search" === i ? i = "filter" : "order" === i && (i = "sort");
        var a = e.iDraw
          , s = e.aoColumns[n]
          , o = e.aoData[t]._aData
          , l = s.sDefaultContent
          , c = s.fnGetData(o, i, {
            settings: e,
            row: t,
            col: n
        });
        if (c === r)
            return e.iDrawError != a && null === l && (ot(e, 0, "Requested unknown parameter " + ("function" == typeof s.mData ? "{function}" : "'" + s.mData + "'") + " for row " + t + ", column " + n, 4),
            e.iDrawError = a),
            l;
        if (c !== o && null !== c || null === l || i === r) {
            if ("function" == typeof c)
                return c.call(o)
        } else
            c = l;
        return null === c && "display" === i ? "" : "filter" === i && (t = h.ext.type.search)[s.sType] ? t[s.sType](c) : c
    }
    function V(e, t, n, r) {
        var i = e.aoColumns[n]
          , a = e.aoData[t]._aData;
        i.fnSetData(a, r, {
            settings: e,
            row: t,
            col: n
        })
    }
    var G = /\[.*?\]$/
      , Y = /\(\)$/;
    function U(t) {
        return e.map(t.match(/(\\.|[^\.])+/g) || [""], (function(e) {
            return e.replace(/\\\./g, ".")
        }
        ))
    }
    var K = h.util.get
      , J = h.util.set;
    function Q(e) {
        return S(e.aoData, "_aData")
    }
    function Z(e) {
        e.aoData.length = 0,
        e.aiDisplayMaster.length = 0,
        e.aiDisplay.length = 0,
        e.aIds = {}
    }
    function ee(e, t, n) {
        for (var i = -1, a = 0, s = e.length; a < s; a++)
            e[a] == t ? i = a : e[a] > t && e[a]--;
        -1 != i && n === r && e.splice(i, 1)
    }
    function te(e, t, n, i) {
        function a(n, r) {
            for (; n.childNodes.length; )
                n.removeChild(n.firstChild);
            n.innerHTML = X(e, t, r, "display")
        }
        var s, o, l = e.aoData[t];
        if ("dom" !== n && (n && "auto" !== n || "dom" !== l.src)) {
            var c = l.anCells;
            if (c)
                if (i !== r)
                    a(c[i], i);
                else
                    for (s = 0,
                    o = c.length; s < o; s++)
                        a(c[s], s)
        } else
            l._aData = ne(e, l, i, i === r ? r : l._aData).data;
        l._aSortData = null,
        l._aFilterData = null;
        var u = e.aoColumns;
        if (i !== r)
            u[i].sType = null;
        else {
            for (s = 0,
            o = u.length; s < o; s++)
                u[s].sType = null;
            ie(e, l)
        }
    }
    function ne(e, t, n, i) {
        function a(e, t) {
            var n;
            "string" == typeof e && -1 !== (n = e.indexOf("@")) && (n = e.substring(n + 1),
            J(e)(i, t.getAttribute(n)))
        }
        function s(e) {
            n !== r && n !== p || (l = f[p],
            c = e.innerHTML.trim(),
            l && l._bAttrSrc ? (J(l.mData._)(i, c),
            a(l.mData.sort, e),
            a(l.mData.type, e),
            a(l.mData.filter, e)) : h ? (l._setter || (l._setter = J(l.mData)),
            l._setter(i, c)) : i[p] = c),
            p++
        }
        var o, l, c, u = [], d = t.firstChild, p = 0, f = e.aoColumns, h = e._rowReadObject;
        if (i = i !== r ? i : h ? {} : [],
        d)
            for (; d; )
                "TD" != (o = d.nodeName.toUpperCase()) && "TH" != o || (s(d),
                u.push(d)),
                d = d.nextSibling;
        else
            for (var m = 0, g = (u = t.anCells).length; m < g; m++)
                s(u[m]);
        return (t = t.firstChild ? t : t.nTr) && (t = t.getAttribute("id")) && J(e.rowId)(i, t),
        {
            data: i,
            cells: u
        }
    }
    function re(t, r, i, a) {
        var s, o, l, c, u, d, p = t.aoData[r], f = p._aData, h = [];
        if (null === p.nTr) {
            for (s = i || n.createElement("tr"),
            p.nTr = s,
            p.anCells = h,
            s._DT_RowIndex = r,
            ie(t, p),
            c = 0,
            u = t.aoColumns.length; c < u; c++)
                l = t.aoColumns[c],
                (o = (d = !i) ? n.createElement(l.sCellType) : a[c]) || ot(t, 0, "Incorrect column count", 18),
                o._DT_CellIndex = {
                    row: r,
                    column: c
                },
                h.push(o),
                !d && (!l.mRender && l.mData === c || e.isPlainObject(l.mData) && l.mData._ === c + ".display") || (o.innerHTML = X(t, r, c, "display")),
                l.sClass && (o.className += " " + l.sClass),
                l.bVisible && !i ? s.appendChild(o) : !l.bVisible && i && o.parentNode.removeChild(o),
                l.fnCreatedCell && l.fnCreatedCell.call(t.oInstance, o, X(t, r, c), f, r, c);
            pt(t, "aoRowCreatedCallback", null, [s, f, r, h])
        }
    }
    function ie(t, n) {
        var r = n.nTr
          , i = n._aData;
        r && ((t = t.rowIdFn(i)) && (r.id = t),
        i.DT_RowClass && (t = i.DT_RowClass.split(" "),
        n.__rowc = n.__rowc ? _(n.__rowc.concat(t)) : t,
        e(r).removeClass(n.__rowc.join(" ")).addClass(i.DT_RowClass)),
        i.DT_RowAttr && e(r).attr(i.DT_RowAttr),
        i.DT_RowData && e(r).data(i.DT_RowData))
    }
    function ae(t) {
        var n, r, i, a = t.nTHead, s = t.nTFoot, o = 0 === e("th, td", a).length, l = t.oClasses, c = t.aoColumns;
        for (o && (r = e("<tr/>").appendTo(a)),
        d = 0,
        p = c.length; d < p; d++)
            i = c[d],
            n = e(i.nTh).addClass(i.sClass),
            o && n.appendTo(r),
            t.oFeatures.bSort && (n.addClass(i.sSortingClass),
            !1 !== i.bSortable && (n.attr("tabindex", t.iTabIndex).attr("aria-controls", t.sTableId),
            et(t, i.nTh, d))),
            i.sTitle != n[0].innerHTML && n.html(i.sTitle),
            ht(t, "header")(t, n, i, l);
        if (o && ue(t.aoHeader, a),
        e(a).children("tr").children("th, td").addClass(l.sHeaderTH),
        e(s).children("tr").children("th, td").addClass(l.sFooterTH),
        null !== s)
            for (var u = t.aoFooter[0], d = 0, p = u.length; d < p; d++)
                (i = c[d]) ? (i.nTf = u[d].cell,
                i.sClass && e(i.nTf).addClass(i.sClass)) : ot(t, 0, "Incorrect column count", 18)
    }
    function se(t, n, i) {
        var a, s, o, l, c, u, d, p, f, h = [], m = [], g = t.aoColumns.length;
        if (n) {
            for (i === r && (i = !1),
            a = 0,
            s = n.length; a < s; a++) {
                for (h[a] = n[a].slice(),
                h[a].nTr = n[a].nTr,
                o = g - 1; 0 <= o; o--)
                    t.aoColumns[o].bVisible || i || h[a].splice(o, 1);
                m.push([])
            }
            for (a = 0,
            s = h.length; a < s; a++) {
                if (d = h[a].nTr)
                    for (; u = d.firstChild; )
                        d.removeChild(u);
                for (o = 0,
                l = h[a].length; o < l; o++)
                    if (f = p = 1,
                    m[a][o] === r) {
                        for (d.appendChild(h[a][o].cell),
                        m[a][o] = 1; h[a + p] !== r && h[a][o].cell == h[a + p][o].cell; )
                            m[a + p][o] = 1,
                            p++;
                        for (; h[a][o + f] !== r && h[a][o].cell == h[a][o + f].cell; ) {
                            for (c = 0; c < p; c++)
                                m[a + c][o + f] = 1;
                            f++
                        }
                        e(h[a][o].cell).attr("rowspan", p).attr("colspan", f)
                    }
            }
        }
    }
    function oe(t, n) {
        i = "ssp" == mt(u = t),
        (c = u.iInitDisplayStart) !== r && -1 !== c && (u._iDisplayStart = !i && c >= u.fnRecordsDisplay() ? 0 : c,
        u.iInitDisplayStart = -1);
        var i = pt(t, "aoPreDrawCallback", "preDraw", [t]);
        if (-1 !== e.inArray(!1, i))
            $e(t, !1);
        else {
            var a = []
              , s = 0
              , o = t.asStripeClasses
              , l = o.length
              , c = t.oLanguage
              , u = "ssp" == mt(t)
              , d = t.aiDisplay
              , p = (i = t._iDisplayStart,
            t.fnDisplayEnd());
            if (t.bDrawing = !0,
            t.bDeferLoading)
                t.bDeferLoading = !1,
                t.iDraw++,
                $e(t, !1);
            else if (u) {
                if (!t.bDestroying && !n)
                    return void fe(t)
            } else
                t.iDraw++;
            if (0 !== d.length)
                for (var f = u ? t.aoData.length : p, h = u ? 0 : i; h < f; h++) {
                    var m, g = d[h], v = t.aoData[g], b = (null === v.nTr && re(t, g),
                    v.nTr);
                    0 !== l && (m = o[s % l],
                    v._sRowStripe != m && (e(b).removeClass(v._sRowStripe).addClass(m),
                    v._sRowStripe = m)),
                    pt(t, "aoRowCallback", null, [b, v._aData, s, h, g]),
                    a.push(b),
                    s++
                }
            else
                n = c.sZeroRecords,
                1 == t.iDraw && "ajax" == mt(t) ? n = c.sLoadingRecords : c.sEmptyTable && 0 === t.fnRecordsTotal() && (n = c.sEmptyTable),
                a[0] = e("<tr/>", {
                    class: l ? o[0] : ""
                }).append(e("<td />", {
                    valign: "top",
                    colSpan: $(t),
                    class: t.oClasses.sRowEmpty
                }).html(n))[0];
            pt(t, "aoHeaderCallback", "header", [e(t.nTHead).children("tr")[0], Q(t), i, p, d]),
            pt(t, "aoFooterCallback", "footer", [e(t.nTFoot).children("tr")[0], Q(t), i, p, d]),
            (u = e(t.nTBody)).children().detach(),
            u.append(e(a)),
            pt(t, "aoDrawCallback", "draw", [t]),
            t.bSorted = !1,
            t.bFiltered = !1,
            t.bDrawing = !1
        }
    }
    function le(e, t) {
        var n = (r = e.oFeatures).bSort
          , r = r.bFilter;
        n && Je(e),
        r ? be(e, e.oPreviousSearch) : e.aiDisplay = e.aiDisplayMaster.slice(),
        !0 !== t && (e._iDisplayStart = 0),
        e._drawHold = t,
        oe(e),
        e._drawHold = !1
    }
    function ce(t) {
        for (var n, r, i, a, s, o, l, c = t.oClasses, u = e(t.nTable), d = (u = e("<div/>").insertBefore(u),
        t.oFeatures), p = e("<div/>", {
            id: t.sTableId + "_wrapper",
            class: c.sWrapper + (t.nTFoot ? "" : " " + c.sNoFooter)
        }), f = (t.nHolding = u[0],
        t.nTableWrapper = p[0],
        t.nTableReinsertBefore = t.nTable.nextSibling,
        t.sDom.split("")), m = 0; m < f.length; m++) {
            if (n = null,
            "<" == (r = f[m])) {
                if (i = e("<div/>")[0],
                "'" == (a = f[m + 1]) || '"' == a) {
                    for (s = "",
                    o = 2; f[m + o] != a; )
                        s += f[m + o],
                        o++;
                    "H" == s ? s = c.sJUIHeader : "F" == s && (s = c.sJUIFooter),
                    -1 != s.indexOf(".") ? (l = s.split("."),
                    i.id = l[0].substr(1, l[0].length - 1),
                    i.className = l[1]) : "#" == s.charAt(0) ? i.id = s.substr(1, s.length - 1) : i.className = s,
                    m += o
                }
                p.append(i),
                p = e(i)
            } else if (">" == r)
                p = p.parent();
            else if ("l" == r && d.bPaginate && d.bLengthChange)
                n = Ne(t);
            else if ("f" == r && d.bFilter)
                n = ve(t);
            else if ("r" == r && d.bProcessing)
                n = He(t);
            else if ("t" == r)
                n = Fe(t);
            else if ("i" == r && d.bInfo)
                n = ke(t);
            else if ("p" == r && d.bPaginate)
                n = je(t);
            else if (0 !== h.ext.feature.length)
                for (var g = h.ext.feature, v = 0, b = g.length; v < b; v++)
                    if (r == g[v].cFeature) {
                        n = g[v].fnInit(t);
                        break
                    }
            n && ((l = t.aanFeatures)[r] || (l[r] = []),
            l[r].push(n),
            p.append(n))
        }
        u.replaceWith(p),
        t.nHolding = null
    }
    function ue(t, n) {
        var r, i, a, s, o, l, c, u, d, p, f = e(n).children("tr");
        for (t.splice(0, t.length),
        a = 0,
        l = f.length; a < l; a++)
            t.push([]);
        for (a = 0,
        l = f.length; a < l; a++)
            for (i = (r = f[a]).firstChild; i; ) {
                if ("TD" == i.nodeName.toUpperCase() || "TH" == i.nodeName.toUpperCase())
                    for (u = (u = +i.getAttribute("colspan")) && 0 !== u && 1 !== u ? u : 1,
                    d = (d = +i.getAttribute("rowspan")) && 0 !== d && 1 !== d ? d : 1,
                    c = function(e, t, n) {
                        for (var r = e[t]; r[n]; )
                            n++;
                        return n
                    }(t, a, 0),
                    p = 1 === u,
                    o = 0; o < u; o++)
                        for (s = 0; s < d; s++)
                            t[a + s][c + o] = {
                                cell: i,
                                unique: p
                            },
                            t[a + s].nTr = r;
                i = i.nextSibling
            }
    }
    function de(e, t, n) {
        var r = [];
        n || (n = e.aoHeader,
        t && ue(n = [], t));
        for (var i = 0, a = n.length; i < a; i++)
            for (var s = 0, o = n[i].length; s < o; s++)
                !n[i][s].unique || r[s] && e.bSortCellsTop || (r[s] = n[i][s].cell);
        return r
    }
    function pe(t, n, r) {
        function i(e) {
            var n = t.jqXHR ? t.jqXHR.status : null;
            (null === e || "number" == typeof n && 204 == n) && ge(t, e = {}, []),
            (n = e.error || e.sError) && ot(t, 0, n),
            t.json = e,
            pt(t, null, "xhr", [t, e, t.jqXHR]),
            r(e)
        }
        pt(t, "aoServerParams", "serverParams", [n]),
        n && Array.isArray(n) && (a = {},
        s = /(.*?)\[\]$/,
        e.each(n, (function(e, t) {
            var n = t.name.match(s);
            n ? (n = n[0],
            a[n] || (a[n] = []),
            a[n].push(t.value)) : a[t.name] = t.value
        }
        )),
        n = a);
        var a, s, o, l = t.ajax, c = t.oInstance, u = (e.isPlainObject(l) && l.data && (u = "function" == typeof (o = l.data) ? o(n, t) : o,
        n = "function" == typeof o && u ? u : e.extend(!0, n, u),
        delete l.data),
        {
            data: n,
            success: i,
            dataType: "json",
            cache: !1,
            type: t.sServerMethod,
            error: function(n, r, i) {
                var a = pt(t, null, "xhr", [t, null, t.jqXHR]);
                -1 === e.inArray(!0, a) && ("parsererror" == r ? ot(t, 0, "Invalid JSON response", 1) : 4 === n.readyState && ot(t, 0, "Ajax error", 7)),
                $e(t, !1)
            }
        });
        t.oAjaxData = n,
        pt(t, null, "preXhr", [t, n]),
        t.fnServerData ? t.fnServerData.call(c, t.sAjaxSource, e.map(n, (function(e, t) {
            return {
                name: t,
                value: e
            }
        }
        )), i, t) : t.sAjaxSource || "string" == typeof l ? t.jqXHR = e.ajax(e.extend(u, {
            url: l || t.sAjaxSource
        })) : "function" == typeof l ? t.jqXHR = l.call(c, n, i, t) : (t.jqXHR = e.ajax(e.extend(u, l)),
        l.data = o)
    }
    function fe(e) {
        e.iDraw++,
        $e(e, !0),
        pe(e, he(e), (function(t) {
            me(e, t)
        }
        ))
    }
    function he(t) {
        for (var n, r, i, a = t.aoColumns, s = a.length, o = t.oFeatures, l = t.oPreviousSearch, c = t.aoPreSearchCols, u = [], d = Ke(t), p = t._iDisplayStart, f = !1 !== o.bPaginate ? t._iDisplayLength : -1, m = function(e, t) {
            u.push({
                name: e,
                value: t
            })
        }, g = (m("sEcho", t.iDraw),
        m("iColumns", s),
        m("sColumns", S(a, "sName").join(",")),
        m("iDisplayStart", p),
        m("iDisplayLength", f),
        {
            draw: t.iDraw,
            columns: [],
            order: [],
            start: p,
            length: f,
            search: {
                value: l.sSearch,
                regex: l.bRegex
            }
        }), v = 0; v < s; v++)
            r = a[v],
            i = c[v],
            n = "function" == typeof r.mData ? "function" : r.mData,
            g.columns.push({
                data: n,
                name: r.sName,
                searchable: r.bSearchable,
                orderable: r.bSortable,
                search: {
                    value: i.sSearch,
                    regex: i.bRegex
                }
            }),
            m("mDataProp_" + v, n),
            o.bFilter && (m("sSearch_" + v, i.sSearch),
            m("bRegex_" + v, i.bRegex),
            m("bSearchable_" + v, r.bSearchable)),
            o.bSort && m("bSortable_" + v, r.bSortable);
        return o.bFilter && (m("sSearch", l.sSearch),
        m("bRegex", l.bRegex)),
        o.bSort && (e.each(d, (function(e, t) {
            g.order.push({
                column: t.col,
                dir: t.dir
            }),
            m("iSortCol_" + e, t.col),
            m("sSortDir_" + e, t.dir)
        }
        )),
        m("iSortingCols", d.length)),
        null === (p = h.ext.legacy.ajax) ? t.sAjaxSource ? u : g : p ? u : g
    }
    function me(e, t) {
        function n(e, n) {
            return t[e] !== r ? t[e] : t[n]
        }
        var i = ge(e, t)
          , a = n("sEcho", "draw")
          , s = n("iTotalRecords", "recordsTotal")
          , o = n("iTotalDisplayRecords", "recordsFiltered");
        if (a !== r) {
            if (+a < e.iDraw)
                return;
            e.iDraw = +a
        }
        i = i || [],
        Z(e),
        e._iRecordsTotal = parseInt(s, 10),
        e._iRecordsDisplay = parseInt(o, 10);
        for (var l = 0, c = i.length; l < c; l++)
            W(e, i[l]);
        e.aiDisplay = e.aiDisplayMaster.slice(),
        oe(e, !0),
        e._bInitComplete || Ie(e, t),
        $e(e, !1)
    }
    function ge(t, n, i) {
        if (t = e.isPlainObject(t.ajax) && t.ajax.dataSrc !== r ? t.ajax.dataSrc : t.sAjaxDataProp,
        !i)
            return "data" === t ? n.aaData || n[t] : "" !== t ? K(t)(n) : n;
        J(t)(n, i)
    }
    function ve(t) {
        function r(e) {
            l.f;
            var n = this.value || "";
            o.return && "Enter" !== e.key || n != o.sSearch && (be(t, {
                sSearch: n,
                bRegex: o.bRegex,
                bSmart: o.bSmart,
                bCaseInsensitive: o.bCaseInsensitive,
                return: o.return
            }),
            t._iDisplayStart = 0,
            oe(t))
        }
        var i = t.oClasses
          , a = t.sTableId
          , s = t.oLanguage
          , o = t.oPreviousSearch
          , l = t.aanFeatures
          , c = '<input type="search" class="' + i.sFilterInput + '"/>'
          , u = (u = s.sSearch).match(/_INPUT_/) ? u.replace("_INPUT_", c) : u + c
          , d = (c = e("<div/>", {
            id: l.f ? null : a + "_filter",
            class: i.sFilter
        }).append(e("<label/>").append(u)),
        i = null !== t.searchDelay ? t.searchDelay : "ssp" === mt(t) ? 400 : 0,
        e("input", c).val(o.sSearch).attr("placeholder", s.sSearchPlaceholder).on("keyup.DT search.DT input.DT paste.DT cut.DT", i ? Xe(r, i) : r).on("mouseup", (function(e) {
            setTimeout((function() {
                r.call(d[0], e)
            }
            ), 10)
        }
        )).on("keypress.DT", (function(e) {
            if (13 == e.keyCode)
                return !1
        }
        )).attr("aria-controls", a));
        return e(t.nTable).on("search.dt.DT", (function(e, r) {
            if (t === r)
                try {
                    d[0] !== n.activeElement && d.val(o.sSearch)
                } catch (e) {}
        }
        )),
        c[0]
    }
    function be(e, t, n) {
        function i(e) {
            s.sSearch = e.sSearch,
            s.bRegex = e.bRegex,
            s.bSmart = e.bSmart,
            s.bCaseInsensitive = e.bCaseInsensitive,
            s.return = e.return
        }
        function a(e) {
            return e.bEscapeRegex !== r ? !e.bEscapeRegex : e.bRegex
        }
        var s = e.oPreviousSearch
          , o = e.aoPreSearchCols;
        if (R(e),
        "ssp" != mt(e)) {
            xe(e, t.sSearch, n, a(t), t.bSmart, t.bCaseInsensitive, t.return),
            i(t);
            for (var l = 0; l < o.length; l++)
                we(e, o[l].sSearch, l, a(o[l]), o[l].bSmart, o[l].bCaseInsensitive);
            ye(e)
        } else
            i(t);
        e.bFiltered = !0,
        pt(e, null, "search", [e])
    }
    function ye(t) {
        for (var n, r, i = h.ext.search, a = t.aiDisplay, s = 0, o = i.length; s < o; s++) {
            for (var l = [], c = 0, u = a.length; c < u; c++)
                r = a[c],
                n = t.aoData[r],
                i[s](t, n._aFilterData, r, n._aData, c) && l.push(r);
            a.length = 0,
            e.merge(a, l)
        }
    }
    function we(e, t, n, r, i, a) {
        if ("" !== t) {
            for (var s, o = [], l = e.aiDisplay, c = Te(t, r, i, a), u = 0; u < l.length; u++)
                s = e.aoData[l[u]]._aFilterData[n],
                c.test(s) && o.push(l[u]);
            e.aiDisplay = o
        }
    }
    function xe(e, t, n, r, i, a) {
        var s, o, l, c = Te(t, r, i, a), u = (i = e.oPreviousSearch.sSearch,
        a = e.aiDisplayMaster,
        []);
        if (0 !== h.ext.search.length && (n = !0),
        o = Ee(e),
        t.length <= 0)
            e.aiDisplay = a.slice();
        else {
            for ((o || n || r || i.length > t.length || 0 !== t.indexOf(i) || e.bSorted) && (e.aiDisplay = a.slice()),
            s = e.aiDisplay,
            l = 0; l < s.length; l++)
                c.test(e.aoData[s[l]]._sFilterRow) && u.push(s[l]);
            e.aiDisplay = u
        }
    }
    function Te(t, n, r, i) {
        return t = n ? t : Se(t),
        r && (t = "^(?=.*?" + e.map(t.match(/"[^"]+"|[^ ]+/g) || [""], (function(e) {
            var t;
            return (e = '"' === e.charAt(0) && (t = e.match(/^"(.*)"$/)) ? t[1] : e).replace('"', "")
        }
        )).join(")(?=.*?") + ").*$"),
        new RegExp(t,i ? "i" : "")
    }
    var Se = h.util.escapeRegex
      , _e = e("<div>")[0]
      , Ce = _e.textContent !== r;
    function Ee(e) {
        for (var t, n, r, i, a, s = e.aoColumns, o = !1, l = 0, c = e.aoData.length; l < c; l++)
            if (!(a = e.aoData[l])._aFilterData) {
                for (r = [],
                t = 0,
                n = s.length; t < n; t++)
                    s[t].bSearchable ? "string" != typeof (i = null === (i = X(e, l, t, "filter")) ? "" : i) && i.toString && (i = i.toString()) : i = "",
                    i.indexOf && -1 !== i.indexOf("&") && (_e.innerHTML = i,
                    i = Ce ? _e.textContent : _e.innerText),
                    i.replace && (i = i.replace(/[\r\n\u2028]/g, "")),
                    r.push(i);
                a._aFilterData = r,
                a._sFilterRow = r.join("  "),
                o = !0
            }
        return o
    }
    function De(e) {
        return {
            search: e.sSearch,
            smart: e.bSmart,
            regex: e.bRegex,
            caseInsensitive: e.bCaseInsensitive
        }
    }
    function Ae(e) {
        return {
            sSearch: e.search,
            bSmart: e.smart,
            bRegex: e.regex,
            bCaseInsensitive: e.caseInsensitive
        }
    }
    function ke(t) {
        var n = t.sTableId
          , r = t.aanFeatures.i
          , i = e("<div/>", {
            class: t.oClasses.sInfo,
            id: r ? null : n + "_info"
        });
        return r || (t.aoDrawCallback.push({
            fn: Le,
            sName: "information"
        }),
        i.attr("role", "status").attr("aria-live", "polite"),
        e(t.nTable).attr("aria-describedby", n + "_info")),
        i[0]
    }
    function Le(t) {
        var n, r, i, a, s, o, l = t.aanFeatures.i;
        0 !== l.length && (o = t.oLanguage,
        n = t._iDisplayStart + 1,
        r = t.fnDisplayEnd(),
        i = t.fnRecordsTotal(),
        s = (a = t.fnRecordsDisplay()) ? o.sInfo : o.sInfoEmpty,
        a !== i && (s += " " + o.sInfoFiltered),
        s = Me(t, s += o.sInfoPostFix),
        null !== (o = o.fnInfoCallback) && (s = o.call(t.oInstance, t, n, r, i, a, s)),
        e(l).html(s))
    }
    function Me(e, t) {
        var n = e.fnFormatNumber
          , r = e._iDisplayStart + 1
          , i = e._iDisplayLength
          , a = e.fnRecordsDisplay()
          , s = -1 === i;
        return t.replace(/_START_/g, n.call(e, r)).replace(/_END_/g, n.call(e, e.fnDisplayEnd())).replace(/_MAX_/g, n.call(e, e.fnRecordsTotal())).replace(/_TOTAL_/g, n.call(e, a)).replace(/_PAGE_/g, n.call(e, s ? 1 : Math.ceil(r / i))).replace(/_PAGES_/g, n.call(e, s ? 1 : Math.ceil(a / i)))
    }
    function Pe(e) {
        var t, n, r, i = e.iInitDisplayStart, a = e.aoColumns, s = e.oFeatures, o = e.bDeferLoading;
        if (e.bInitialised) {
            for (ce(e),
            ae(e),
            se(e, e.aoHeader),
            se(e, e.aoFooter),
            $e(e, !0),
            s.bAutoWidth && qe(e),
            t = 0,
            n = a.length; t < n; t++)
                (r = a[t]).sWidth && (r.nTh.style.width = Ue(r.sWidth));
            pt(e, null, "preInit", [e]),
            le(e),
            "ssp" == (s = mt(e)) && !o || ("ajax" == s ? pe(e, [], (function(n) {
                var r = ge(e, n);
                for (t = 0; t < r.length; t++)
                    W(e, r[t]);
                e.iInitDisplayStart = i,
                le(e),
                $e(e, !1),
                Ie(e, n)
            }
            )) : ($e(e, !1),
            Ie(e)))
        } else
            setTimeout((function() {
                Pe(e)
            }
            ), 200)
    }
    function Ie(e, t) {
        e._bInitComplete = !0,
        (t || e.oInit.aaData) && j(e),
        pt(e, null, "plugin-init", [e, t]),
        pt(e, "aoInitComplete", "init", [e, t])
    }
    function Oe(e, t) {
        t = parseInt(t, 10),
        e._iDisplayLength = t,
        ft(e),
        pt(e, null, "length", [e, t])
    }
    function Ne(t) {
        for (var n = t.oClasses, r = t.sTableId, i = t.aLengthMenu, a = Array.isArray(i[0]), s = a ? i[0] : i, o = a ? i[1] : i, l = e("<select/>", {
            name: r + "_length",
            "aria-controls": r,
            class: n.sLengthSelect
        }), c = 0, u = s.length; c < u; c++)
            l[0][c] = new Option("number" == typeof o[c] ? t.fnFormatNumber(o[c]) : o[c],s[c]);
        var d = e("<div><label/></div>").addClass(n.sLength);
        return t.aanFeatures.l || (d[0].id = r + "_length"),
        d.children().append(t.oLanguage.sLengthMenu.replace("_MENU_", l[0].outerHTML)),
        e("select", d).val(t._iDisplayLength).on("change.DT", (function(n) {
            Oe(t, e(this).val()),
            oe(t)
        }
        )),
        e(t.nTable).on("length.dt.DT", (function(n, r, i) {
            t === r && e("select", d).val(i)
        }
        )),
        d[0]
    }
    function je(t) {
        function n(e) {
            oe(e)
        }
        var r = t.sPaginationType
          , i = h.ext.pager[r]
          , a = "function" == typeof i
          , s = (r = e("<div/>").addClass(t.oClasses.sPaging + r)[0],
        t.aanFeatures);
        return a || i.fnInit(t, r, n),
        s.p || (r.id = t.sTableId + "_paginate",
        t.aoDrawCallback.push({
            fn: function(e) {
                if (a)
                    for (var t = e._iDisplayStart, r = e._iDisplayLength, o = e.fnRecordsDisplay(), l = -1 === r, c = l ? 0 : Math.ceil(t / r), u = l ? 1 : Math.ceil(o / r), d = i(c, u), p = 0, f = s.p.length; p < f; p++)
                        ht(e, "pageButton")(e, s.p[p], p, d, c, u);
                else
                    i.fnUpdate(e, n)
            },
            sName: "pagination"
        })),
        r
    }
    function ze(e, t, n) {
        var r = e._iDisplayStart
          , i = e._iDisplayLength
          , a = (0 === (a = e.fnRecordsDisplay()) || -1 === i ? r = 0 : "number" == typeof t ? a < (r = t * i) && (r = 0) : "first" == t ? r = 0 : "previous" == t ? (r = 0 <= i ? r - i : 0) < 0 && (r = 0) : "next" == t ? r + i < a && (r += i) : "last" == t ? r = Math.floor((a - 1) / i) * i : ot(e, 0, "Unknown paging action: " + t, 5),
        e._iDisplayStart !== r);
        return e._iDisplayStart = r,
        a ? (pt(e, null, "page", [e]),
        n && oe(e)) : pt(e, null, "page-nc", [e]),
        a
    }
    function He(t) {
        return e("<div/>", {
            id: t.aanFeatures.r ? null : t.sTableId + "_processing",
            class: t.oClasses.sProcessing,
            role: "status"
        }).html(t.oLanguage.sProcessing).append("<div><div></div><div></div><div></div><div></div></div>").insertBefore(t.nTable)[0]
    }
    function $e(t, n) {
        t.oFeatures.bProcessing && e(t.aanFeatures.r).css("display", n ? "block" : "none"),
        pt(t, null, "processing", [t, n])
    }
    function Fe(t) {
        var n, r, i, a, s, o, l, c, u, d, p, f, h = e(t.nTable), m = t.oScroll;
        return "" === m.sX && "" === m.sY ? t.nTable : (n = m.sX,
        r = m.sY,
        i = t.oClasses,
        s = (a = h.children("caption")).length ? a[0]._captionSide : null,
        c = e(h[0].cloneNode(!1)),
        o = e(h[0].cloneNode(!1)),
        u = function(e) {
            return e ? Ue(e) : null
        }
        ,
        (l = h.children("tfoot")).length || (l = null),
        c = e(p = "<div/>", {
            class: i.sScrollWrapper
        }).append(e(p, {
            class: i.sScrollHead
        }).css({
            overflow: "hidden",
            position: "relative",
            border: 0,
            width: n ? u(n) : "100%"
        }).append(e(p, {
            class: i.sScrollHeadInner
        }).css({
            "box-sizing": "content-box",
            width: m.sXInner || "100%"
        }).append(c.removeAttr("id").css("margin-left", 0).append("top" === s ? a : null).append(h.children("thead"))))).append(e(p, {
            class: i.sScrollBody
        }).css({
            position: "relative",
            overflow: "auto",
            width: u(n)
        }).append(h)),
        l && c.append(e(p, {
            class: i.sScrollFoot
        }).css({
            overflow: "hidden",
            border: 0,
            width: n ? u(n) : "100%"
        }).append(e(p, {
            class: i.sScrollFootInner
        }).append(o.removeAttr("id").css("margin-left", 0).append("bottom" === s ? a : null).append(h.children("tfoot"))))),
        u = c.children(),
        d = u[0],
        p = u[1],
        f = l ? u[2] : null,
        n && e(p).on("scroll.DT", (function(e) {
            var t = this.scrollLeft;
            d.scrollLeft = t,
            l && (f.scrollLeft = t)
        }
        )),
        e(p).css("max-height", r),
        m.bCollapse || e(p).css("height", r),
        t.nScrollHead = d,
        t.nScrollBody = p,
        t.nScrollFoot = f,
        t.aoDrawCallback.push({
            fn: Re,
            sName: "scrolling"
        }),
        c[0])
    }
    function Re(n) {
        function i(e) {
            (e = e.style).paddingTop = "0",
            e.paddingBottom = "0",
            e.borderTopWidth = "0",
            e.borderBottomWidth = "0",
            e.height = 0
        }
        var a, s, o, l, c, u = (f = n.oScroll).sX, d = f.sXInner, p = f.sY, f = f.iBarWidth, h = e(n.nScrollHead), m = h[0].style, g = (v = h.children("div"))[0].style, v = v.children("table"), b = n.nScrollBody, y = e(b), w = b.style, x = e(n.nScrollFoot).children("div"), T = x.children("table"), _ = e(n.nTHead), C = e(n.nTable), E = C[0], D = E.style, A = n.nTFoot ? e(n.nTFoot) : null, k = n.oBrowser, L = k.bScrollOversize, M = (S(n.aoColumns, "nTh"),
        []), P = [], I = [], O = [], N = b.scrollHeight > b.clientHeight;
        n.scrollBarVis !== N && n.scrollBarVis !== r ? (n.scrollBarVis = N,
        j(n)) : (n.scrollBarVis = N,
        C.children("thead, tfoot").remove(),
        A && (N = A.clone().prependTo(C),
        c = A.find("tr"),
        s = N.find("tr"),
        N.find("[id]").removeAttr("id")),
        N = _.clone().prependTo(C),
        _ = _.find("tr"),
        a = N.find("tr"),
        N.find("th, td").removeAttr("tabindex"),
        N.find("[id]").removeAttr("id"),
        u || (w.width = "100%",
        h[0].style.width = "100%"),
        e.each(de(n, N), (function(e, t) {
            o = z(n, e),
            t.style.width = n.aoColumns[o].sWidth
        }
        )),
        A && Be((function(e) {
            e.style.width = ""
        }
        ), s),
        h = C.outerWidth(),
        "" === u ? (D.width = "100%",
        L && (C.find("tbody").height() > b.offsetHeight || "scroll" == y.css("overflow-y")) && (D.width = Ue(C.outerWidth() - f)),
        h = C.outerWidth()) : "" !== d && (D.width = Ue(d),
        h = C.outerWidth()),
        Be(i, a),
        Be((function(n) {
            var r = t.getComputedStyle ? t.getComputedStyle(n).width : Ue(e(n).width());
            I.push(n.innerHTML),
            M.push(r)
        }
        ), a),
        Be((function(e, t) {
            e.style.width = M[t]
        }
        ), _),
        e(a).css("height", 0),
        A && (Be(i, s),
        Be((function(t) {
            O.push(t.innerHTML),
            P.push(Ue(e(t).css("width")))
        }
        ), s),
        Be((function(e, t) {
            e.style.width = P[t]
        }
        ), c),
        e(s).height(0)),
        Be((function(e, t) {
            e.innerHTML = '<div class="dataTables_sizing">' + I[t] + "</div>",
            e.childNodes[0].style.height = "0",
            e.childNodes[0].style.overflow = "hidden",
            e.style.width = M[t]
        }
        ), a),
        A && Be((function(e, t) {
            e.innerHTML = '<div class="dataTables_sizing">' + O[t] + "</div>",
            e.childNodes[0].style.height = "0",
            e.childNodes[0].style.overflow = "hidden",
            e.style.width = P[t]
        }
        ), s),
        Math.round(C.outerWidth()) < Math.round(h) ? (l = b.scrollHeight > b.offsetHeight || "scroll" == y.css("overflow-y") ? h + f : h,
        L && (b.scrollHeight > b.offsetHeight || "scroll" == y.css("overflow-y")) && (D.width = Ue(l - f)),
        "" !== u && "" === d || ot(n, 1, "Possible column misalignment", 6)) : l = "100%",
        w.width = Ue(l),
        m.width = Ue(l),
        A && (n.nScrollFoot.style.width = Ue(l)),
        p || L && (w.height = Ue(E.offsetHeight + f)),
        N = C.outerWidth(),
        v[0].style.width = Ue(N),
        g.width = Ue(N),
        _ = C.height() > b.clientHeight || "scroll" == y.css("overflow-y"),
        g[c = "padding" + (k.bScrollbarLeft ? "Left" : "Right")] = _ ? f + "px" : "0px",
        A && (T[0].style.width = Ue(N),
        x[0].style.width = Ue(N),
        x[0].style[c] = _ ? f + "px" : "0px"),
        C.children("colgroup").insertBefore(C.children("thead")),
        y.trigger("scroll"),
        !n.bSorted && !n.bFiltered || n._drawHold || (b.scrollTop = 0))
    }
    function Be(e, t, n) {
        for (var r, i, a = 0, s = 0, o = t.length; s < o; ) {
            for (r = t[s].firstChild,
            i = n ? n[s].firstChild : null; r; )
                1 === r.nodeType && (n ? e(r, i, a) : e(r, a),
                a++),
                r = r.nextSibling,
                i = n ? i.nextSibling : null;
            s++
        }
    }
    var We = /<.*?>/g;
    function qe(n) {
        var r, i, a = n.nTable, s = n.aoColumns, o = (c = n.oScroll).sY, l = c.sX, c = c.sXInner, u = s.length, d = F(n, "bVisible"), p = e("th", n.nTHead), f = a.getAttribute("width"), h = a.parentNode, m = !1, g = n.oBrowser, v = g.bScrollOversize;
        for ((y = a.style.width) && -1 !== y.indexOf("%") && (f = y),
        S = 0; S < d.length; S++)
            null !== (r = s[d[S]]).sWidth && (r.sWidth = Ve(r.sWidthOrig, h),
            m = !0);
        if (v || !m && !l && !o && u == $(n) && u == p.length)
            for (S = 0; S < u; S++) {
                var b = z(n, S);
                null !== b && (s[b].sWidth = Ue(p.eq(S).width()))
            }
        else {
            var y, w = ((y = e(a).clone().css("visibility", "hidden").removeAttr("id")).find("tbody tr").remove(),
            e("<tr/>").appendTo(y.find("tbody")));
            for (y.find("thead, tfoot").remove(),
            y.append(e(n.nTHead).clone()).append(e(n.nTFoot).clone()),
            y.find("tfoot th, tfoot td").css("width", ""),
            p = de(n, y.find("thead")[0]),
            S = 0; S < d.length; S++)
                r = s[d[S]],
                p[S].style.width = null !== r.sWidthOrig && "" !== r.sWidthOrig ? Ue(r.sWidthOrig) : "",
                r.sWidthOrig && l && e(p[S]).append(e("<div/>").css({
                    width: r.sWidthOrig,
                    margin: 0,
                    padding: 0,
                    border: 0,
                    height: 1
                }));
            if (n.aoData.length)
                for (S = 0; S < d.length; S++)
                    r = s[i = d[S]],
                    e(Ge(n, i)).clone(!1).append(r.sContentPadding).appendTo(w);
            e("[name]", y).removeAttr("name");
            for (var x = e("<div/>").css(l || o ? {
                position: "absolute",
                top: 0,
                left: 0,
                height: 1,
                right: 0,
                overflow: "hidden"
            } : {}).append(y).appendTo(h), T = (l && c ? y.width(c) : l ? (y.css("width", "auto"),
            y.removeAttr("width"),
            y.width() < h.clientWidth && f && y.width(h.clientWidth)) : o ? y.width(h.clientWidth) : f && y.width(f),
            0), S = 0; S < d.length; S++) {
                var _, C = (_ = e(p[S])).outerWidth() - _.width();
                T += _ = g.bBounding ? Math.ceil(p[S].getBoundingClientRect().width) : _.outerWidth(),
                s[d[S]].sWidth = Ue(_ - C)
            }
            a.style.width = Ue(T),
            x.remove()
        }
        f && (a.style.width = Ue(f)),
        !f && !l || n._reszEvt || (c = function() {
            e(t).on("resize.DT-" + n.sInstance, Xe((function() {
                j(n)
            }
            )))
        }
        ,
        v ? setTimeout(c, 1e3) : c(),
        n._reszEvt = !0)
    }
    var Xe = h.util.throttle;
    function Ve(t, r) {
        return t ? (r = (t = e("<div/>").css("width", Ue(t)).appendTo(r || n.body))[0].offsetWidth,
        t.remove(),
        r) : 0
    }
    function Ge(t, n) {
        var r, i = Ye(t, n);
        return i < 0 ? null : (r = t.aoData[i]).nTr ? r.anCells[n] : e("<td/>").html(X(t, i, n, "display"))[0]
    }
    function Ye(e, t) {
        for (var n, r = -1, i = -1, a = 0, s = e.aoData.length; a < s; a++)
            (n = (n = (n = X(e, a, t, "display") + "").replace(We, "")).replace(/&nbsp;/g, " ")).length > r && (r = n.length,
            i = a);
        return i
    }
    function Ue(e) {
        return null === e ? "0px" : "number" == typeof e ? e < 0 ? "0px" : e + "px" : e.match(/\d$/) ? e + "px" : e
    }
    function Ke(t) {
        function n(t) {
            t.length && !Array.isArray(t[0]) ? g.push(t) : e.merge(g, t)
        }
        var i, a, s, o, l, c, u, d = [], p = t.aoColumns, f = t.aaSortingFixed, m = e.isPlainObject(f), g = [];
        for (Array.isArray(f) && n(f),
        m && f.pre && n(f.pre),
        n(t.aaSorting),
        m && f.post && n(f.post),
        i = 0; i < g.length; i++)
            for (s = (o = p[u = g[i][a = 0]].aDataSort).length; a < s; a++)
                c = p[l = o[a]].sType || "string",
                g[i]._idx === r && (g[i]._idx = e.inArray(g[i][1], p[l].asSorting)),
                d.push({
                    src: u,
                    col: l,
                    dir: g[i][1],
                    index: g[i]._idx,
                    type: c,
                    formatter: h.ext.type.order[c + "-pre"]
                });
        return d
    }
    function Je(e) {
        var t, n, r, i, a, s = [], o = h.ext.type.order, l = e.aoData, c = (e.aoColumns,
        0), u = e.aiDisplayMaster;
        for (R(e),
        t = 0,
        n = (a = Ke(e)).length; t < n; t++)
            (i = a[t]).formatter && c++,
            nt(e, i.col);
        if ("ssp" != mt(e) && 0 !== a.length) {
            for (t = 0,
            r = u.length; t < r; t++)
                s[u[t]] = t;
            c === a.length ? u.sort((function(e, t) {
                for (var n, r, i, o, c = a.length, u = l[e]._aSortData, d = l[t]._aSortData, p = 0; p < c; p++)
                    if (0 != (i = (n = u[(o = a[p]).col]) < (r = d[o.col]) ? -1 : r < n ? 1 : 0))
                        return "asc" === o.dir ? i : -i;
                return (n = s[e]) < (r = s[t]) ? -1 : r < n ? 1 : 0
            }
            )) : u.sort((function(e, t) {
                for (var n, r, i, c = a.length, u = l[e]._aSortData, d = l[t]._aSortData, p = 0; p < c; p++)
                    if (n = u[(i = a[p]).col],
                    r = d[i.col],
                    0 !== (i = (o[i.type + "-" + i.dir] || o["string-" + i.dir])(n, r)))
                        return i;
                return (n = s[e]) < (r = s[t]) ? -1 : r < n ? 1 : 0
            }
            ))
        }
        e.bSorted = !0
    }
    function Qe(e) {
        for (var t = e.aoColumns, n = Ke(e), r = e.oLanguage.oAria, i = 0, a = t.length; i < a; i++) {
            var s = t[i]
              , o = s.asSorting
              , l = s.ariaTitle || s.sTitle.replace(/<.*?>/g, "")
              , c = s.nTh;
            c.removeAttribute("aria-sort"),
            s = s.bSortable ? l + ("asc" === (0 < n.length && n[0].col == i && (c.setAttribute("aria-sort", "asc" == n[0].dir ? "ascending" : "descending"),
            o[n[0].index + 1]) || o[0]) ? r.sSortAscending : r.sSortDescending) : l,
            c.setAttribute("aria-label", s)
        }
    }
    function Ze(t, n, i, a) {
        function s(t, n) {
            var i = t._idx;
            return (i = i === r ? e.inArray(t[1], u) : i) + 1 < u.length ? i + 1 : n ? null : 0
        }
        var o, l = t.aoColumns[n], c = t.aaSorting, u = l.asSorting;
        "number" == typeof c[0] && (c = t.aaSorting = [c]),
        i && t.oFeatures.bSortMulti ? -1 !== (l = e.inArray(n, S(c, "0"))) ? null === (o = null === (o = s(c[l], !0)) && 1 === c.length ? 0 : o) ? c.splice(l, 1) : (c[l][1] = u[o],
        c[l]._idx = o) : (c.push([n, u[0], 0]),
        c[c.length - 1]._idx = 0) : c.length && c[0][0] == n ? (o = s(c[0]),
        c.length = 1,
        c[0][1] = u[o],
        c[0]._idx = o) : (c.length = 0,
        c.push([n, u[0]]),
        c[0]._idx = 0),
        le(t),
        "function" == typeof a && a(t)
    }
    function et(e, t, n, r) {
        var i = e.aoColumns[n];
        ut(t, {}, (function(t) {
            !1 !== i.bSortable && (e.oFeatures.bProcessing ? ($e(e, !0),
            setTimeout((function() {
                Ze(e, n, t.shiftKey, r),
                "ssp" !== mt(e) && $e(e, !1)
            }
            ), 0)) : Ze(e, n, t.shiftKey, r))
        }
        ))
    }
    function tt(t) {
        var n, r, i, a = t.aLastSort, s = t.oClasses.sSortColumn, o = Ke(t), l = t.oFeatures;
        if (l.bSort && l.bSortClasses) {
            for (n = 0,
            r = a.length; n < r; n++)
                i = a[n].src,
                e(S(t.aoData, "anCells", i)).removeClass(s + (n < 2 ? n + 1 : 3));
            for (n = 0,
            r = o.length; n < r; n++)
                i = o[n].src,
                e(S(t.aoData, "anCells", i)).addClass(s + (n < 2 ? n + 1 : 3))
        }
        t.aLastSort = o
    }
    function nt(e, t) {
        for (var n, r, i, a = e.aoColumns[t], s = h.ext.order[a.sSortDataType], o = (s && (n = s.call(e.oInstance, e, t, H(e, t))),
        h.ext.type.order[a.sType + "-pre"]), l = 0, c = e.aoData.length; l < c; l++)
            (r = e.aoData[l])._aSortData || (r._aSortData = []),
            r._aSortData[t] && !s || (i = s ? n[l] : X(e, l, t, "sort"),
            r._aSortData[t] = o ? o(i) : i)
    }
    function rt(t) {
        var n;
        t._bLoadingState || (n = {
            time: +new Date,
            start: t._iDisplayStart,
            length: t._iDisplayLength,
            order: e.extend(!0, [], t.aaSorting),
            search: De(t.oPreviousSearch),
            columns: e.map(t.aoColumns, (function(e, n) {
                return {
                    visible: e.bVisible,
                    search: De(t.aoPreSearchCols[n])
                }
            }
            ))
        },
        t.oSavedState = n,
        pt(t, "aoStateSaveParams", "stateSaveParams", [t, n]),
        t.oFeatures.bStateSave && !t.bDestroying && t.fnStateSaveCallback.call(t.oInstance, t, n))
    }
    function it(e, t, n) {
        var i;
        if (e.oFeatures.bStateSave)
            return (i = e.fnStateLoadCallback.call(e.oInstance, e, (function(t) {
                at(e, t, n)
            }
            ))) !== r && at(e, i, n),
            !0;
        n()
    }
    function at(t, n, i) {
        var a, s, o = t.aoColumns, l = (t._bLoadingState = !0,
        t._bInitComplete ? new h.Api(t) : null);
        if (n && n.time) {
            var c = pt(t, "aoStateLoadParams", "stateLoadParams", [t, n]);
            if (-1 !== e.inArray(!1, c))
                t._bLoadingState = !1;
            else if (0 < (c = t.iStateDuration) && n.time < +new Date - 1e3 * c)
                t._bLoadingState = !1;
            else if (n.columns && o.length !== n.columns.length)
                t._bLoadingState = !1;
            else {
                if (t.oLoadedState = e.extend(!0, {}, n),
                n.length !== r && (l ? l.page.len(n.length) : t._iDisplayLength = n.length),
                n.start !== r && (null === l ? (t._iDisplayStart = n.start,
                t.iInitDisplayStart = n.start) : ze(t, n.start / t._iDisplayLength)),
                n.order !== r && (t.aaSorting = [],
                e.each(n.order, (function(e, n) {
                    t.aaSorting.push(n[0] >= o.length ? [0, n[1]] : n)
                }
                ))),
                n.search !== r && e.extend(t.oPreviousSearch, Ae(n.search)),
                n.columns) {
                    for (a = 0,
                    s = n.columns.length; a < s; a++) {
                        var u = n.columns[a];
                        u.visible !== r && (l ? l.column(a).visible(u.visible, !1) : o[a].bVisible = u.visible),
                        u.search !== r && e.extend(t.aoPreSearchCols[a], Ae(u.search))
                    }
                    l && l.columns.adjust()
                }
                t._bLoadingState = !1,
                pt(t, "aoStateLoaded", "stateLoaded", [t, n])
            }
        } else
            t._bLoadingState = !1;
        i()
    }
    function st(t) {
        var n = h.settings;
        return -1 !== (t = e.inArray(t, S(n, "nTable"))) ? n[t] : null
    }
    function ot(e, n, r, i) {
        if (r = "DataTables warning: " + (e ? "table id=" + e.sTableId + " - " : "") + r,
        i && (r += ". For more information about this error, please see http://datatables.net/tn/" + i),
        n)
            t.console && console.log && console.log(r);
        else if (n = (n = h.ext).sErrMode || n.errMode,
        e && pt(e, null, "error", [e, i, r]),
        "alert" == n)
            alert(r);
        else {
            if ("throw" == n)
                throw new Error(r);
            "function" == typeof n && n(e, i, r)
        }
    }
    function lt(t, n, i, a) {
        Array.isArray(i) ? e.each(i, (function(e, r) {
            Array.isArray(r) ? lt(t, n, r[0], r[1]) : lt(t, n, r)
        }
        )) : (a === r && (a = i),
        n[i] !== r && (t[a] = n[i]))
    }
    function ct(t, n, r) {
        var i, a;
        for (a in n)
            n.hasOwnProperty(a) && (i = n[a],
            e.isPlainObject(i) ? (e.isPlainObject(t[a]) || (t[a] = {}),
            e.extend(!0, t[a], i)) : r && "data" !== a && "aaData" !== a && Array.isArray(i) ? t[a] = i.slice() : t[a] = i);
        return t
    }
    function ut(t, n, r) {
        e(t).on("click.DT", n, (function(n) {
            e(t).trigger("blur"),
            r(n)
        }
        )).on("keypress.DT", n, (function(e) {
            13 === e.which && (e.preventDefault(),
            r(e))
        }
        )).on("selectstart.DT", (function() {
            return !1
        }
        ))
    }
    function dt(e, t, n, r) {
        n && e[t].push({
            fn: n,
            sName: r
        })
    }
    function pt(t, n, r, i) {
        var a = [];
        return n && (a = e.map(t[n].slice().reverse(), (function(e, n) {
            return e.fn.apply(t.oInstance, i)
        }
        ))),
        null !== r && (n = e.Event(r + ".dt"),
        (r = e(t.nTable)).trigger(n, i),
        0 === r.parents("body").length && e("body").trigger(n, i),
        a.push(n.result)),
        a
    }
    function ft(e) {
        var t = e._iDisplayStart
          , n = e.fnDisplayEnd()
          , r = e._iDisplayLength;
        n <= t && (t = n - r),
        t -= t % r,
        e._iDisplayStart = t = -1 === r || t < 0 ? 0 : t
    }
    function ht(t, n) {
        t = t.renderer;
        var r = h.ext.renderer[n];
        return e.isPlainObject(t) && t[n] ? r[t[n]] || r._ : "string" == typeof t && r[t] || r._
    }
    function mt(e) {
        return e.oFeatures.bServerSide ? "ssp" : e.ajax || e.sAjaxSource ? "ajax" : "dom"
    }
    function gt(t, n) {
        var r;
        return Array.isArray(t) ? e.map(t, (function(e) {
            return gt(e, n)
        }
        )) : "number" == typeof t ? [n[t]] : (r = e.map(n, (function(e, t) {
            return e.nTable
        }
        )),
        e(r).filter(t).map((function(t) {
            var i = e.inArray(this, r);
            return n[i]
        }
        )).toArray())
    }
    function vt(e, t, n) {
        var r, i;
        n && (r = new Ct(e)).one("draw", (function() {
            n(r.ajax.json())
        }
        )),
        "ssp" == mt(e) ? le(e, t) : ($e(e, !0),
        (i = e.jqXHR) && 4 !== i.readyState && i.abort(),
        pe(e, [], (function(n) {
            Z(e);
            for (var r = ge(e, n), i = 0, a = r.length; i < a; i++)
                W(e, r[i]);
            le(e, t),
            $e(e, !1)
        }
        )))
    }
    function bt(e, t, n, i, a) {
        for (var s, o, l, c, u = [], p = typeof t, f = 0, h = (t = t && "string" != p && "function" != p && t.length !== r ? t : [t]).length; f < h; f++)
            for (l = 0,
            c = (o = t[f] && t[f].split && !t[f].match(/[\[\(:]/) ? t[f].split(",") : [t[f]]).length; l < c; l++)
                (s = n("string" == typeof o[l] ? o[l].trim() : o[l])) && s.length && (u = u.concat(s));
        var m = d.selector[e];
        if (m.length)
            for (f = 0,
            h = m.length; f < h; f++)
                u = m[f](i, a, u);
        return _(u)
    }
    function yt(t) {
        return (t = t || {}).filter && t.search === r && (t.search = t.filter),
        e.extend({
            search: "none",
            order: "current",
            page: "all"
        }, t)
    }
    function wt(e) {
        for (var t = 0, n = e.length; t < n; t++)
            if (0 < e[t].length)
                return e[0] = e[t],
                e[0].length = 1,
                e.length = 1,
                e.context = [e.context[t]],
                e;
        return e.length = 0,
        e
    }
    function xt(t, n) {
        var r = t.context;
        if (r.length && t.length && (s = r[0].aoData[t[0]])._details) {
            (s._detailsShow = n) ? (s._details.insertAfter(s.nTr),
            e(s.nTr).addClass("dt-hasChild")) : (s._details.detach(),
            e(s.nTr).removeClass("dt-hasChild")),
            pt(r[0], null, "childRow", [n, t.row(t[0])]);
            var i = r[0]
              , a = new Ct(i)
              , s = (n = "draw" + (s = ".dt.DT_details"),
            t = "column-sizing" + s,
            "destroy" + s)
              , o = i.aoData;
            a.off(n + " " + t + " " + s),
            S(o, "_details").length > 0 && (a.on(n, (function(e, t) {
                i === t && a.rows({
                    page: "current"
                }).eq(0).each((function(e) {
                    var t = o[e];
                    t._detailsShow && t._details.insertAfter(t.nTr)
                }
                ))
            }
            )),
            a.on(t, (function(e, t, n, r) {
                if (i === t)
                    for (var a, s = $(t), l = 0, c = o.length; l < c; l++)
                        (a = o[l])._details && a._details.children("td[colspan]").attr("colspan", s)
            }
            )),
            a.on(s, (function(e, t) {
                if (i === t)
                    for (var n = 0, r = o.length; n < r; n++)
                        o[n]._details && At(a, n)
            }
            ))),
            Dt(r)
        }
    }
    function Tt(e, t, n, r, i) {
        for (var a = [], s = 0, o = i.length; s < o; s++)
            a.push(X(e, i[s], t));
        return a
    }
    var St = []
      , _t = Array.prototype
      , Ct = function(t, n) {
        if (!(this instanceof Ct))
            return new Ct(t,n);
        function r(t) {
            var n, r, a, s;
            a = h.settings,
            s = e.map(a, (function(e, t) {
                return e.nTable
            }
            )),
            (t = t ? t.nTable && t.oApi ? [t] : t.nodeName && "table" === t.nodeName.toLowerCase() ? -1 !== (n = e.inArray(t, s)) ? [a[n]] : null : t && "function" == typeof t.settings ? t.settings().toArray() : ("string" == typeof t ? r = e(t) : t instanceof e && (r = t),
            r ? r.map((function(t) {
                return -1 !== (n = e.inArray(this, s)) ? a[n] : null
            }
            )).toArray() : void 0) : []) && i.push.apply(i, t)
        }
        var i = [];
        if (Array.isArray(t))
            for (var a = 0, s = t.length; a < s; a++)
                r(t[a]);
        else
            r(t);
        this.context = _(i),
        n && e.merge(this, n),
        this.selector = {
            rows: null,
            cols: null,
            opts: null
        },
        Ct.extend(this, this, St)
    }
      , Et = (h.Api = Ct,
    e.extend(Ct.prototype, {
        any: function() {
            return 0 !== this.count()
        },
        concat: _t.concat,
        context: [],
        count: function() {
            return this.flatten().length
        },
        each: function(e) {
            for (var t = 0, n = this.length; t < n; t++)
                e.call(this, this[t], t, this);
            return this
        },
        eq: function(e) {
            var t = this.context;
            return t.length > e ? new Ct(t[e],this[e]) : null
        },
        filter: function(e) {
            var t = [];
            if (_t.filter)
                t = _t.filter.call(this, e, this);
            else
                for (var n = 0, r = this.length; n < r; n++)
                    e.call(this, this[n], n, this) && t.push(this[n]);
            return new Ct(this.context,t)
        },
        flatten: function() {
            var e = [];
            return new Ct(this.context,e.concat.apply(e, this.toArray()))
        },
        join: _t.join,
        indexOf: _t.indexOf || function(e, t) {
            for (var n = t || 0, r = this.length; n < r; n++)
                if (this[n] === e)
                    return n;
            return -1
        }
        ,
        iterator: function(e, t, n, i) {
            var a, s, o, l, c, u, d, p, f = [], h = this.context, m = this.selector;
            for ("string" == typeof e && (i = n,
            n = t,
            t = e,
            e = !1),
            s = 0,
            o = h.length; s < o; s++) {
                var g = new Ct(h[s]);
                if ("table" === t)
                    (a = n.call(g, h[s], s)) !== r && f.push(a);
                else if ("columns" === t || "rows" === t)
                    (a = n.call(g, h[s], this[s], s)) !== r && f.push(a);
                else if ("column" === t || "column-rows" === t || "row" === t || "cell" === t)
                    for (d = this[s],
                    "column-rows" === t && (u = Et(h[s], m.opts)),
                    l = 0,
                    c = d.length; l < c; l++)
                        p = d[l],
                        (a = "cell" === t ? n.call(g, h[s], p.row, p.column, s, l) : n.call(g, h[s], p, s, l, u)) !== r && f.push(a)
            }
            return f.length || i ? ((e = (i = new Ct(h,e ? f.concat.apply([], f) : f)).selector).rows = m.rows,
            e.cols = m.cols,
            e.opts = m.opts,
            i) : this
        },
        lastIndexOf: _t.lastIndexOf || function(e, t) {
            return this.indexOf.apply(this.toArray.reverse(), arguments)
        }
        ,
        length: 0,
        map: function(e) {
            var t = [];
            if (_t.map)
                t = _t.map.call(this, e, this);
            else
                for (var n = 0, r = this.length; n < r; n++)
                    t.push(e.call(this, this[n], n));
            return new Ct(this.context,t)
        },
        pluck: function(e) {
            var t = h.util.get(e);
            return this.map((function(e) {
                return t(e)
            }
            ))
        },
        pop: _t.pop,
        push: _t.push,
        reduce: _t.reduce || function(e, t) {
            return I(this, e, t, 0, this.length, 1)
        }
        ,
        reduceRight: _t.reduceRight || function(e, t) {
            return I(this, e, t, this.length - 1, -1, -1)
        }
        ,
        reverse: _t.reverse,
        selector: null,
        shift: _t.shift,
        slice: function() {
            return new Ct(this.context,this)
        },
        sort: _t.sort,
        splice: _t.splice,
        toArray: function() {
            return _t.slice.call(this)
        },
        to$: function() {
            return e(this)
        },
        toJQuery: function() {
            return e(this)
        },
        unique: function() {
            return new Ct(this.context,_(this))
        },
        unshift: _t.unshift
    }),
    Ct.extend = function(e, t, n) {
        if (n.length && t && (t instanceof Ct || t.__dt_wrapper))
            for (var r, i = 0, a = n.length; i < a; i++)
                t[(r = n[i]).name] = "function" === r.type ? function(e, t, n) {
                    return function() {
                        var r = t.apply(e, arguments);
                        return Ct.extend(r, r, n.methodExt),
                        r
                    }
                }(e, r.val, r) : "object" === r.type ? {} : r.val,
                t[r.name].__dt_wrapper = !0,
                Ct.extend(e, t[r.name], r.propExt)
    }
    ,
    Ct.register = p = function(t, n) {
        if (Array.isArray(t))
            for (var r = 0, i = t.length; r < i; r++)
                Ct.register(t[r], n);
        else
            for (var a = t.split("."), s = St, o = 0, l = a.length; o < l; o++) {
                var c, u, d = function(e, t) {
                    for (var n = 0, r = e.length; n < r; n++)
                        if (e[n].name === t)
                            return e[n];
                    return null
                }(s, u = (c = -1 !== a[o].indexOf("()")) ? a[o].replace("()", "") : a[o]);
                d || s.push(d = {
                    name: u,
                    val: {},
                    methodExt: [],
                    propExt: [],
                    type: "object"
                }),
                o === l - 1 ? (d.val = n,
                d.type = "function" == typeof n ? "function" : e.isPlainObject(n) ? "object" : "other") : s = c ? d.methodExt : d.propExt
            }
    }
    ,
    Ct.registerPlural = f = function(e, t, n) {
        Ct.register(e, n),
        Ct.register(t, (function() {
            var e = n.apply(this, arguments);
            return e === this ? this : e instanceof Ct ? e.length ? Array.isArray(e[0]) ? new Ct(e.context,e[0]) : e[0] : r : e
        }
        ))
    }
    ,
    p("tables()", (function(e) {
        return e !== r && null !== e ? new Ct(gt(e, this.context)) : this
    }
    )),
    p("table()", (function(e) {
        var t = (e = this.tables(e)).context;
        return t.length ? new Ct(t[0]) : e
    }
    )),
    f("tables().nodes()", "table().node()", (function() {
        return this.iterator("table", (function(e) {
            return e.nTable
        }
        ), 1)
    }
    )),
    f("tables().body()", "table().body()", (function() {
        return this.iterator("table", (function(e) {
            return e.nTBody
        }
        ), 1)
    }
    )),
    f("tables().header()", "table().header()", (function() {
        return this.iterator("table", (function(e) {
            return e.nTHead
        }
        ), 1)
    }
    )),
    f("tables().footer()", "table().footer()", (function() {
        return this.iterator("table", (function(e) {
            return e.nTFoot
        }
        ), 1)
    }
    )),
    f("tables().containers()", "table().container()", (function() {
        return this.iterator("table", (function(e) {
            return e.nTableWrapper
        }
        ), 1)
    }
    )),
    p("draw()", (function(e) {
        return this.iterator("table", (function(t) {
            "page" === e ? oe(t) : le(t, !1 === (e = "string" == typeof e ? "full-hold" !== e : e))
        }
        ))
    }
    )),
    p("page()", (function(e) {
        return e === r ? this.page.info().page : this.iterator("table", (function(t) {
            ze(t, e)
        }
        ))
    }
    )),
    p("page.info()", (function(e) {
        var t, n, i, a, s;
        return 0 === this.context.length ? r : (n = (t = this.context[0])._iDisplayStart,
        i = t.oFeatures.bPaginate ? t._iDisplayLength : -1,
        a = t.fnRecordsDisplay(),
        {
            page: (s = -1 === i) ? 0 : Math.floor(n / i),
            pages: s ? 1 : Math.ceil(a / i),
            start: n,
            end: t.fnDisplayEnd(),
            length: i,
            recordsTotal: t.fnRecordsTotal(),
            recordsDisplay: a,
            serverSide: "ssp" === mt(t)
        })
    }
    )),
    p("page.len()", (function(e) {
        return e === r ? 0 !== this.context.length ? this.context[0]._iDisplayLength : r : this.iterator("table", (function(t) {
            Oe(t, e)
        }
        ))
    }
    )),
    p("ajax.json()", (function() {
        var e = this.context;
        if (0 < e.length)
            return e[0].json
    }
    )),
    p("ajax.params()", (function() {
        var e = this.context;
        if (0 < e.length)
            return e[0].oAjaxData
    }
    )),
    p("ajax.reload()", (function(e, t) {
        return this.iterator("table", (function(n) {
            vt(n, !1 === t, e)
        }
        ))
    }
    )),
    p("ajax.url()", (function(t) {
        var n = this.context;
        return t === r ? 0 === n.length ? r : (n = n[0]).ajax ? e.isPlainObject(n.ajax) ? n.ajax.url : n.ajax : n.sAjaxSource : this.iterator("table", (function(n) {
            e.isPlainObject(n.ajax) ? n.ajax.url = t : n.ajax = t
        }
        ))
    }
    )),
    p("ajax.url().load()", (function(e, t) {
        return this.iterator("table", (function(n) {
            vt(n, !1 === t, e)
        }
        ))
    }
    )),
    function(t, n) {
        var r, i = [], a = t.aiDisplay, s = t.aiDisplayMaster, o = n.search, c = n.order;
        n = n.page;
        if ("ssp" == mt(t))
            return "removed" === o ? [] : l(0, s.length);
        if ("current" == n)
            for (d = t._iDisplayStart,
            p = t.fnDisplayEnd(); d < p; d++)
                i.push(a[d]);
        else if ("current" == c || "applied" == c) {
            if ("none" == o)
                i = s.slice();
            else if ("applied" == o)
                i = a.slice();
            else if ("removed" == o) {
                for (var u = {}, d = 0, p = a.length; d < p; d++)
                    u[a[d]] = null;
                i = e.map(s, (function(e) {
                    return u.hasOwnProperty(e) ? null : e
                }
                ))
            }
        } else if ("index" == c || "original" == c)
            for (d = 0,
            p = t.aoData.length; d < p; d++)
                ("none" == o || -1 === (r = e.inArray(d, a)) && "removed" == o || 0 <= r && "applied" == o) && i.push(d);
        return i
    }
    )
      , Dt = (p("rows()", (function(t, n) {
        t === r ? t = "" : e.isPlainObject(t) && (n = t,
        t = ""),
        n = yt(n);
        var a = this.iterator("table", (function(a) {
            return bt("row", t, (function(t) {
                var n = i(t)
                  , a = s.aoData;
                if (null !== n && !l)
                    return [n];
                if (u = u || Et(s, l),
                null !== n && -1 !== e.inArray(n, u))
                    return [n];
                if (null === t || t === r || "" === t)
                    return u;
                if ("function" == typeof t)
                    return e.map(u, (function(e) {
                        var n = a[e];
                        return t(e, n._aData, n.nTr) ? e : null
                    }
                    ));
                if (t.nodeName)
                    return n = t._DT_RowIndex,
                    d = t._DT_CellIndex,
                    n !== r ? a[n] && a[n].nTr === t ? [n] : [] : d ? a[d.row] && a[d.row].nTr === t.parentNode ? [d.row] : [] : (n = e(t).closest("*[data-dt-row]")).length ? [n.data("dt-row")] : [];
                if ("string" == typeof t && "#" === t.charAt(0)) {
                    var d = s.aIds[t.replace(/^#/, "")];
                    if (d !== r)
                        return [d.idx]
                }
                return n = c(o(s.aoData, u, "nTr")),
                e(n).filter(t).map((function() {
                    return this._DT_RowIndex
                }
                )).toArray()
            }
            ), s = a, l = n);
            var s, l, u
        }
        ), 1);
        return a.selector.rows = t,
        a.selector.opts = n,
        a
    }
    )),
    p("rows().nodes()", (function() {
        return this.iterator("row", (function(e, t) {
            return e.aoData[t].nTr || r
        }
        ), 1)
    }
    )),
    p("rows().data()", (function() {
        return this.iterator(!0, "rows", (function(e, t) {
            return o(e.aoData, t, "_aData")
        }
        ), 1)
    }
    )),
    f("rows().cache()", "row().cache()", (function(e) {
        return this.iterator("row", (function(t, n) {
            return t = t.aoData[n],
            "search" === e ? t._aFilterData : t._aSortData
        }
        ), 1)
    }
    )),
    f("rows().invalidate()", "row().invalidate()", (function(e) {
        return this.iterator("row", (function(t, n) {
            te(t, n, e)
        }
        ))
    }
    )),
    f("rows().indexes()", "row().index()", (function() {
        return this.iterator("row", (function(e, t) {
            return t
        }
        ), 1)
    }
    )),
    f("rows().ids()", "row().id()", (function(e) {
        for (var t = [], n = this.context, r = 0, i = n.length; r < i; r++)
            for (var a = 0, s = this[r].length; a < s; a++) {
                var o = n[r].rowIdFn(n[r].aoData[this[r][a]]._aData);
                t.push((!0 === e ? "#" : "") + o)
            }
        return new Ct(n,t)
    }
    )),
    f("rows().remove()", "row().remove()", (function() {
        var e = this;
        return this.iterator("row", (function(t, n, i) {
            var a, s, o, l, c, u, d = t.aoData, p = d[n];
            for (d.splice(n, 1),
            a = 0,
            s = d.length; a < s; a++)
                if (u = (c = d[a]).anCells,
                null !== c.nTr && (c.nTr._DT_RowIndex = a),
                null !== u)
                    for (o = 0,
                    l = u.length; o < l; o++)
                        u[o]._DT_CellIndex.row = a;
            ee(t.aiDisplayMaster, n),
            ee(t.aiDisplay, n),
            ee(e[i], n, !1),
            0 < t._iRecordsDisplay && t._iRecordsDisplay--,
            ft(t),
            (i = t.rowIdFn(p._aData)) !== r && delete t.aIds[i]
        }
        )),
        this.iterator("table", (function(e) {
            for (var t = 0, n = e.aoData.length; t < n; t++)
                e.aoData[t].idx = t
        }
        )),
        this
    }
    )),
    p("rows.add()", (function(t) {
        var n = this.iterator("table", (function(e) {
            for (var n, r = [], i = 0, a = t.length; i < a; i++)
                (n = t[i]).nodeName && "TR" === n.nodeName.toUpperCase() ? r.push(q(e, n)[0]) : r.push(W(e, n));
            return r
        }
        ), 1)
          , r = this.rows(-1);
        return r.pop(),
        e.merge(r, n),
        r
    }
    )),
    p("row()", (function(e, t) {
        return wt(this.rows(e, t))
    }
    )),
    p("row().data()", (function(e) {
        var t, n = this.context;
        return e === r ? n.length && this.length ? n[0].aoData[this[0]]._aData : r : ((t = n[0].aoData[this[0]])._aData = e,
        Array.isArray(e) && t.nTr && t.nTr.id && J(n[0].rowId)(e, t.nTr.id),
        te(n[0], this[0], "data"),
        this)
    }
    )),
    p("row().node()", (function() {
        var e = this.context;
        return e.length && this.length && e[0].aoData[this[0]].nTr || null
    }
    )),
    p("row.add()", (function(t) {
        t instanceof e && t.length && (t = t[0]);
        var n = this.iterator("table", (function(e) {
            return t.nodeName && "TR" === t.nodeName.toUpperCase() ? q(e, t)[0] : W(e, t)
        }
        ));
        return this.row(n[0])
    }
    )),
    e(n).on("plugin-init.dt", (function(t, n) {
        var r = new Ct(n)
          , i = "stateSaveParams." + (s = "on-plugin-init")
          , a = "destroy. " + s
          , s = (r.on(i, (function(e, t, n) {
            for (var r = t.rowIdFn, i = t.aoData, a = [], s = 0; s < i.length; s++)
                i[s]._detailsShow && a.push("#" + r(i[s]._aData));
            n.childRows = a
        }
        )),
        r.on(a, (function() {
            r.off(i + " " + a)
        }
        )),
        r.state.loaded());
        s && s.childRows && r.rows(e.map(s.childRows, (function(e) {
            return e.replace(/:/g, "\\:")
        }
        ))).every((function() {
            pt(n, null, "requestChild", [this])
        }
        ))
    }
    )),
    h.util.throttle((function(e) {
        rt(e[0])
    }
    ), 500))
      , At = function(t, n) {
        var i = t.context;
        i.length && (n = i[0].aoData[n !== r ? n : t[0]]) && n._details && (n._details.remove(),
        n._detailsShow = r,
        n._details = r,
        e(n.nTr).removeClass("dt-hasChild"),
        Dt(i))
    }
      , kt = "row().child"
      , Lt = kt + "()"
      , Mt = (p(Lt, (function(t, n) {
        var i = this.context;
        return t === r ? i.length && this.length ? i[0].aoData[this[0]]._details : r : (!0 === t ? this.child.show() : !1 === t ? At(this) : i.length && this.length && function(t, n, r, i) {
            var a = [];
            (function n(r, i) {
                var s;
                if (Array.isArray(r) || r instanceof e)
                    for (var o = 0, l = r.length; o < l; o++)
                        n(r[o], i);
                else
                    r.nodeName && "tr" === r.nodeName.toLowerCase() ? a.push(r) : (s = e("<tr><td></td></tr>").addClass(i),
                    e("td", s).addClass(i).html(r)[0].colSpan = $(t),
                    a.push(s[0]))
            }
            )(r, i),
            n._details && n._details.detach(),
            n._details = e(a),
            n._detailsShow && n._details.insertAfter(n.nTr)
        }(i[0], i[0].aoData[this[0]], t, n),
        this)
    }
    )),
    p([kt + ".show()", Lt + ".show()"], (function(e) {
        return xt(this, !0),
        this
    }
    )),
    p([kt + ".hide()", Lt + ".hide()"], (function() {
        return xt(this, !1),
        this
    }
    )),
    p([kt + ".remove()", Lt + ".remove()"], (function() {
        return At(this),
        this
    }
    )),
    p(kt + ".isShown()", (function() {
        var e = this.context;
        return e.length && this.length && e[0].aoData[this[0]]._detailsShow || !1
    }
    )),
    /^([^:]+):(name|visIdx|visible)$/)
      , Pt = (p("columns()", (function(t, n) {
        t === r ? t = "" : e.isPlainObject(t) && (n = t,
        t = ""),
        n = yt(n);
        var a = this.iterator("table", (function(r) {
            return s = t,
            o = n,
            c = (a = r).aoColumns,
            u = S(c, "sName"),
            d = S(c, "nTh"),
            bt("column", s, (function(t) {
                var n, r = i(t);
                if ("" === t)
                    return l(c.length);
                if (null !== r)
                    return [0 <= r ? r : c.length + r];
                if ("function" == typeof t)
                    return n = Et(a, o),
                    e.map(c, (function(e, r) {
                        return t(r, Tt(a, r, 0, 0, n), d[r]) ? r : null
                    }
                    ));
                var s = "string" == typeof t ? t.match(Mt) : "";
                if (s)
                    switch (s[2]) {
                    case "visIdx":
                    case "visible":
                        var p, f = parseInt(s[1], 10);
                        return f < 0 ? [(p = e.map(c, (function(e, t) {
                            return e.bVisible ? t : null
                        }
                        )))[p.length + f]] : [z(a, f)];
                    case "name":
                        return e.map(u, (function(e, t) {
                            return e === s[1] ? t : null
                        }
                        ));
                    default:
                        return []
                    }
                return t.nodeName && t._DT_CellIndex ? [t._DT_CellIndex.column] : (r = e(d).filter(t).map((function() {
                    return e.inArray(this, d)
                }
                )).toArray()).length || !t.nodeName ? r : (r = e(t).closest("*[data-dt-column]")).length ? [r.data("dt-column")] : []
            }
            ), a, o);
            var a, s, o, c, u, d
        }
        ), 1);
        return a.selector.cols = t,
        a.selector.opts = n,
        a
    }
    )),
    f("columns().header()", "column().header()", (function(e, t) {
        return this.iterator("column", (function(e, t) {
            return e.aoColumns[t].nTh
        }
        ), 1)
    }
    )),
    f("columns().footer()", "column().footer()", (function(e, t) {
        return this.iterator("column", (function(e, t) {
            return e.aoColumns[t].nTf
        }
        ), 1)
    }
    )),
    f("columns().data()", "column().data()", (function() {
        return this.iterator("column-rows", Tt, 1)
    }
    )),
    f("columns().dataSrc()", "column().dataSrc()", (function() {
        return this.iterator("column", (function(e, t) {
            return e.aoColumns[t].mData
        }
        ), 1)
    }
    )),
    f("columns().cache()", "column().cache()", (function(e) {
        return this.iterator("column-rows", (function(t, n, r, i, a) {
            return o(t.aoData, a, "search" === e ? "_aFilterData" : "_aSortData", n)
        }
        ), 1)
    }
    )),
    f("columns().nodes()", "column().nodes()", (function() {
        return this.iterator("column-rows", (function(e, t, n, r, i) {
            return o(e.aoData, i, "anCells", t)
        }
        ), 1)
    }
    )),
    f("columns().visible()", "column().visible()", (function(t, n) {
        var i = this
          , a = this.iterator("column", (function(n, i) {
            if (t === r)
                return n.aoColumns[i].bVisible;
            var a, s, o = i, l = (i = t,
            n.aoColumns), c = l[o], u = n.aoData;
            if (i === r)
                c.bVisible;
            else if (c.bVisible !== i) {
                if (i)
                    for (var d = e.inArray(!0, S(l, "bVisible"), o + 1), p = 0, f = u.length; p < f; p++)
                        s = u[p].nTr,
                        a = u[p].anCells,
                        s && s.insertBefore(a[o], a[d] || null);
                else
                    e(S(n.aoData, "anCells", o)).detach();
                c.bVisible = i
            }
        }
        ));
        return t !== r && this.iterator("table", (function(a) {
            se(a, a.aoHeader),
            se(a, a.aoFooter),
            a.aiDisplay.length || e(a.nTBody).find("td[colspan]").attr("colspan", $(a)),
            rt(a),
            i.iterator("column", (function(e, r) {
                pt(e, null, "column-visibility", [e, r, t, n])
            }
            )),
            n !== r && !n || i.columns.adjust()
        }
        )),
        a
    }
    )),
    f("columns().indexes()", "column().index()", (function(e) {
        return this.iterator("column", (function(t, n) {
            return "visible" === e ? H(t, n) : n
        }
        ), 1)
    }
    )),
    p("columns.adjust()", (function() {
        return this.iterator("table", (function(e) {
            j(e)
        }
        ), 1)
    }
    )),
    p("column.index()", (function(e, t) {
        var n;
        if (0 !== this.context.length)
            return n = this.context[0],
            "fromVisible" === e || "toData" === e ? z(n, t) : "fromData" === e || "toVisible" === e ? H(n, t) : void 0
    }
    )),
    p("column()", (function(e, t) {
        return wt(this.columns(e, t))
    }
    )),
    p("cells()", (function(t, n, i) {
        var a, s, l, u, d, p, f;
        return e.isPlainObject(t) && (t.row === r ? (i = t,
        t = null) : (i = n,
        n = null)),
        e.isPlainObject(n) && (i = n,
        n = null),
        null === n || n === r ? this.iterator("table", (function(n) {
            return a = n,
            n = t,
            s = yt(i),
            g = a.aoData,
            v = Et(a, s),
            b = c(o(g, v, "anCells")),
            y = e(C([], b)),
            w = a.aoColumns.length,
            bt("cell", n, (function(t) {
                var n, i = "function" == typeof t;
                if (null === t || t === r || i) {
                    for (u = [],
                    d = 0,
                    p = v.length; d < p; d++)
                        for (l = v[d],
                        f = 0; f < w; f++)
                            h = {
                                row: l,
                                column: f
                            },
                            (!i || (m = g[l],
                            t(h, X(a, l, f), m.anCells ? m.anCells[f] : null))) && u.push(h);
                    return u
                }
                return e.isPlainObject(t) ? t.column !== r && t.row !== r && -1 !== e.inArray(t.row, v) ? [t] : [] : (n = y.filter(t).map((function(e, t) {
                    return {
                        row: t._DT_CellIndex.row,
                        column: t._DT_CellIndex.column
                    }
                }
                )).toArray()).length || !t.nodeName ? n : (m = e(t).closest("*[data-dt-row]")).length ? [{
                    row: m.data("dt-row"),
                    column: m.data("dt-column")
                }] : []
            }
            ), a, s);
            var a, s, l, u, d, p, f, h, m, g, v, b, y, w
        }
        )) : (f = i ? {
            page: i.page,
            order: i.order,
            search: i.search
        } : {},
        a = this.columns(n, f),
        s = this.rows(t, f),
        f = this.iterator("table", (function(e, t) {
            var n = [];
            for (l = 0,
            u = s[t].length; l < u; l++)
                for (d = 0,
                p = a[t].length; d < p; d++)
                    n.push({
                        row: s[t][l],
                        column: a[t][d]
                    });
            return n
        }
        ), 1),
        f = i && i.selected ? this.cells(f, i) : f,
        e.extend(f.selector, {
            cols: n,
            rows: t,
            opts: i
        }),
        f)
    }
    )),
    f("cells().nodes()", "cell().node()", (function() {
        return this.iterator("cell", (function(e, t, n) {
            return (e = e.aoData[t]) && e.anCells ? e.anCells[n] : r
        }
        ), 1)
    }
    )),
    p("cells().data()", (function() {
        return this.iterator("cell", (function(e, t, n) {
            return X(e, t, n)
        }
        ), 1)
    }
    )),
    f("cells().cache()", "cell().cache()", (function(e) {
        return e = "search" === e ? "_aFilterData" : "_aSortData",
        this.iterator("cell", (function(t, n, r) {
            return t.aoData[n][e][r]
        }
        ), 1)
    }
    )),
    f("cells().render()", "cell().render()", (function(e) {
        return this.iterator("cell", (function(t, n, r) {
            return X(t, n, r, e)
        }
        ), 1)
    }
    )),
    f("cells().indexes()", "cell().index()", (function() {
        return this.iterator("cell", (function(e, t, n) {
            return {
                row: t,
                column: n,
                columnVisible: H(e, n)
            }
        }
        ), 1)
    }
    )),
    f("cells().invalidate()", "cell().invalidate()", (function(e) {
        return this.iterator("cell", (function(t, n, r) {
            te(t, n, e, r)
        }
        ))
    }
    )),
    p("cell()", (function(e, t, n) {
        return wt(this.cells(e, t, n))
    }
    )),
    p("cell().data()", (function(e) {
        var t = this.context
          , n = this[0];
        return e === r ? t.length && n.length ? X(t[0], n[0].row, n[0].column) : r : (V(t[0], n[0].row, n[0].column, e),
        te(t[0], n[0].row, "data", n[0].column),
        this)
    }
    )),
    p("order()", (function(e, t) {
        var n = this.context;
        return e === r ? 0 !== n.length ? n[0].aaSorting : r : ("number" == typeof e ? e = [[e, t]] : e.length && !Array.isArray(e[0]) && (e = Array.prototype.slice.call(arguments)),
        this.iterator("table", (function(t) {
            t.aaSorting = e.slice()
        }
        )))
    }
    )),
    p("order.listener()", (function(e, t, n) {
        return this.iterator("table", (function(r) {
            et(r, e, t, n)
        }
        ))
    }
    )),
    p("order.fixed()", (function(t) {
        var n;
        return t ? this.iterator("table", (function(n) {
            n.aaSortingFixed = e.extend(!0, {}, t)
        }
        )) : (n = (n = this.context).length ? n[0].aaSortingFixed : r,
        Array.isArray(n) ? {
            pre: n
        } : n)
    }
    )),
    p(["columns().order()", "column().order()"], (function(t) {
        var n = this;
        return this.iterator("table", (function(r, i) {
            var a = [];
            e.each(n[i], (function(e, n) {
                a.push([n, t])
            }
            )),
            r.aaSorting = a
        }
        ))
    }
    )),
    p("search()", (function(t, n, i, a) {
        var s = this.context;
        return t === r ? 0 !== s.length ? s[0].oPreviousSearch.sSearch : r : this.iterator("table", (function(r) {
            r.oFeatures.bFilter && be(r, e.extend({}, r.oPreviousSearch, {
                sSearch: t + "",
                bRegex: null !== n && n,
                bSmart: null === i || i,
                bCaseInsensitive: null === a || a
            }), 1)
        }
        ))
    }
    )),
    f("columns().search()", "column().search()", (function(t, n, i, a) {
        return this.iterator("column", (function(s, o) {
            var l = s.aoPreSearchCols;
            if (t === r)
                return l[o].sSearch;
            s.oFeatures.bFilter && (e.extend(l[o], {
                sSearch: t + "",
                bRegex: null !== n && n,
                bSmart: null === i || i,
                bCaseInsensitive: null === a || a
            }),
            be(s, s.oPreviousSearch, 1))
        }
        ))
    }
    )),
    p("state()", (function() {
        return this.context.length ? this.context[0].oSavedState : null
    }
    )),
    p("state.clear()", (function() {
        return this.iterator("table", (function(e) {
            e.fnStateSaveCallback.call(e.oInstance, e, {})
        }
        ))
    }
    )),
    p("state.loaded()", (function() {
        return this.context.length ? this.context[0].oLoadedState : null
    }
    )),
    p("state.save()", (function() {
        return this.iterator("table", (function(e) {
            rt(e)
        }
        ))
    }
    )),
    h.use = function(r, i) {
        "lib" === i || r.fn ? e = r : "win" != i && !r.document || (n = (t = r).document)
    }
    ,
    h.factory = function(r, i) {
        var a = !1;
        return r && r.document && (n = (t = r).document),
        i && i.fn && i.fn.jquery && (e = i,
        a = !0),
        a
    }
    ,
    h.versionCheck = h.fnVersionCheck = function(e) {
        for (var t, n, r = h.version.split("."), i = e.split("."), a = 0, s = i.length; a < s; a++)
            if ((t = parseInt(r[a], 10) || 0) !== (n = parseInt(i[a], 10) || 0))
                return n < t;
        return !0
    }
    ,
    h.isDataTable = h.fnIsDataTable = function(t) {
        var n = e(t).get(0)
          , r = !1;
        return t instanceof h.Api || (e.each(h.settings, (function(t, i) {
            var a = i.nScrollHead ? e("table", i.nScrollHead)[0] : null
              , s = i.nScrollFoot ? e("table", i.nScrollFoot)[0] : null;
            i.nTable !== n && a !== n && s !== n || (r = !0)
        }
        )),
        r)
    }
    ,
    h.tables = h.fnTables = function(t) {
        var n = !1
          , r = (e.isPlainObject(t) && (n = t.api,
        t = t.visible),
        e.map(h.settings, (function(n) {
            if (!t || e(n.nTable).is(":visible"))
                return n.nTable
        }
        )));
        return n ? new Ct(r) : r
    }
    ,
    h.camelToHungarian = D,
    p("$()", (function(t, n) {
        return n = this.rows(n).nodes(),
        n = e(n),
        e([].concat(n.filter(t).toArray(), n.find(t).toArray()))
    }
    )),
    e.each(["on", "one", "off"], (function(t, n) {
        p(n + "()", (function() {
            var t = Array.prototype.slice.call(arguments)
              , r = (t[0] = e.map(t[0].split(/\s/), (function(e) {
                return e.match(/\.dt\b/) ? e : e + ".dt"
            }
            )).join(" "),
            e(this.tables().nodes()));
            return r[n].apply(r, t),
            this
        }
        ))
    }
    )),
    p("clear()", (function() {
        return this.iterator("table", (function(e) {
            Z(e)
        }
        ))
    }
    )),
    p("settings()", (function() {
        return new Ct(this.context,this.context)
    }
    )),
    p("init()", (function() {
        var e = this.context;
        return e.length ? e[0].oInit : null
    }
    )),
    p("data()", (function() {
        return this.iterator("table", (function(e) {
            return S(e.aoData, "_aData")
        }
        )).flatten()
    }
    )),
    p("destroy()", (function(n) {
        return n = n || !1,
        this.iterator("table", (function(r) {
            var i, a = r.oClasses, s = r.nTable, o = r.nTBody, l = r.nTHead, c = r.nTFoot, u = e(s), d = (o = e(o),
            e(r.nTableWrapper)), p = e.map(r.aoData, (function(e) {
                return e.nTr
            }
            ));
            r.bDestroying = !0,
            pt(r, "aoDestroyCallback", "destroy", [r]),
            n || new Ct(r).columns().visible(!0),
            d.off(".DT").find(":not(tbody *)").off(".DT"),
            e(t).off(".DT-" + r.sInstance),
            s != l.parentNode && (u.children("thead").detach(),
            u.append(l)),
            c && s != c.parentNode && (u.children("tfoot").detach(),
            u.append(c)),
            r.aaSorting = [],
            r.aaSortingFixed = [],
            tt(r),
            e(p).removeClass(r.asStripeClasses.join(" ")),
            e("th, td", l).removeClass(a.sSortable + " " + a.sSortableAsc + " " + a.sSortableDesc + " " + a.sSortableNone),
            o.children().detach(),
            o.append(p),
            c = r.nTableWrapper.parentNode,
            u[l = n ? "remove" : "detach"](),
            d[l](),
            !n && c && (c.insertBefore(s, r.nTableReinsertBefore),
            u.css("width", r.sDestroyWidth).removeClass(a.sTable),
            (i = r.asDestroyStripes.length) && o.children().each((function(t) {
                e(this).addClass(r.asDestroyStripes[t % i])
            }
            ))),
            p = e.inArray(r, h.settings);
            -1 !== p && h.settings.splice(p, 1)
        }
        ))
    }
    )),
    e.each(["column", "row", "cell"], (function(e, t) {
        p(t + "s().every()", (function(e) {
            var n = this.selector.opts
              , i = this;
            return this.iterator(t, (function(a, s, o, l, c) {
                e.call(i[t](s, "cell" === t ? o : n, "cell" === t ? n : r), s, o, l, c)
            }
            ))
        }
        ))
    }
    )),
    p("i18n()", (function(t, n, i) {
        var a = this.context[0];
        return (t = K(t)(a.oLanguage)) === r && (t = n),
        (t = i !== r && e.isPlainObject(t) ? t[i] !== r ? t[i] : t._ : t).replace("%d", i)
    }
    )),
    h.version = "1.13.4",
    h.settings = [],
    h.models = {},
    h.models.oSearch = {
        bCaseInsensitive: !0,
        sSearch: "",
        bRegex: !1,
        bSmart: !0,
        return: !1
    },
    h.models.oRow = {
        nTr: null,
        anCells: null,
        _aData: [],
        _aSortData: null,
        _aFilterData: null,
        _sFilterRow: null,
        _sRowStripe: "",
        src: null,
        idx: -1
    },
    h.models.oColumn = {
        idx: null,
        aDataSort: null,
        asSorting: null,
        bSearchable: null,
        bSortable: null,
        bVisible: null,
        _sManualType: null,
        _bAttrSrc: !1,
        fnCreatedCell: null,
        fnGetData: null,
        fnSetData: null,
        mData: null,
        mRender: null,
        nTh: null,
        nTf: null,
        sClass: null,
        sContentPadding: null,
        sDefaultContent: null,
        sName: null,
        sSortDataType: "std",
        sSortingClass: null,
        sSortingClassJUI: null,
        sTitle: null,
        sType: null,
        sWidth: null,
        sWidthOrig: null
    },
    h.defaults = {
        aaData: null,
        aaSorting: [[0, "asc"]],
        aaSortingFixed: [],
        ajax: null,
        aLengthMenu: [10, 25, 50, 100],
        aoColumns: null,
        aoColumnDefs: null,
        aoSearchCols: [],
        asStripeClasses: null,
        bAutoWidth: !0,
        bDeferRender: !1,
        bDestroy: !1,
        bFilter: !0,
        bInfo: !0,
        bLengthChange: !0,
        bPaginate: !0,
        bProcessing: !1,
        bRetrieve: !1,
        bScrollCollapse: !1,
        bServerSide: !1,
        bSort: !0,
        bSortMulti: !0,
        bSortCellsTop: !1,
        bSortClasses: !0,
        bStateSave: !1,
        fnCreatedRow: null,
        fnDrawCallback: null,
        fnFooterCallback: null,
        fnFormatNumber: function(e) {
            return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.oLanguage.sThousands)
        },
        fnHeaderCallback: null,
        fnInfoCallback: null,
        fnInitComplete: null,
        fnPreDrawCallback: null,
        fnRowCallback: null,
        fnServerData: null,
        fnServerParams: null,
        fnStateLoadCallback: function(e) {
            try {
                return JSON.parse((-1 === e.iStateDuration ? sessionStorage : localStorage).getItem("DataTables_" + e.sInstance + "_" + location.pathname))
            } catch (e) {
                return {}
            }
        },
        fnStateLoadParams: null,
        fnStateLoaded: null,
        fnStateSaveCallback: function(e, t) {
            try {
                (-1 === e.iStateDuration ? sessionStorage : localStorage).setItem("DataTables_" + e.sInstance + "_" + location.pathname, JSON.stringify(t))
            } catch (e) {}
        },
        fnStateSaveParams: null,
        iStateDuration: 7200,
        iDeferLoading: null,
        iDisplayLength: 10,
        iDisplayStart: 0,
        iTabIndex: 0,
        oClasses: {},
        oLanguage: {
            oAria: {
                sSortAscending: ": activate to sort column ascending",
                sSortDescending: ": activate to sort column descending"
            },
            oPaginate: {
                sFirst: "First",
                sLast: "Last",
                sNext: "Next",
                sPrevious: "Previous"
            },
            sEmptyTable: "No data available in table",
            sInfo: "Showing _START_ to _END_ of _TOTAL_ entries",
            sInfoEmpty: "Showing 0 to 0 of 0 entries",
            sInfoFiltered: "(filtered from _MAX_ total entries)",
            sInfoPostFix: "",
            sDecimal: "",
            sThousands: ",",
            sLengthMenu: "Show _MENU_ entries",
            sLoadingRecords: "Loading...",
            sProcessing: "",
            sSearch: "Search:",
            sSearchPlaceholder: "",
            sUrl: "",
            sZeroRecords: "No matching records found"
        },
        oSearch: e.extend({}, h.models.oSearch),
        sAjaxDataProp: "data",
        sAjaxSource: null,
        sDom: "lfrtip",
        searchDelay: null,
        sPaginationType: "simple_numbers",
        sScrollX: "",
        sScrollXInner: "",
        sScrollY: "",
        sServerMethod: "GET",
        renderer: null,
        rowId: "DT_RowId"
    },
    E(h.defaults),
    h.defaults.column = {
        aDataSort: null,
        iDataSort: -1,
        asSorting: ["asc", "desc"],
        bSearchable: !0,
        bSortable: !0,
        bVisible: !0,
        fnCreatedCell: null,
        mData: null,
        mRender: null,
        sCellType: "td",
        sClass: "",
        sContentPadding: "",
        sDefaultContent: null,
        sName: "",
        sSortDataType: "std",
        sTitle: null,
        sType: null,
        sWidth: null
    },
    E(h.defaults.column),
    h.models.oSettings = {
        oFeatures: {
            bAutoWidth: null,
            bDeferRender: null,
            bFilter: null,
            bInfo: null,
            bLengthChange: null,
            bPaginate: null,
            bProcessing: null,
            bServerSide: null,
            bSort: null,
            bSortMulti: null,
            bSortClasses: null,
            bStateSave: null
        },
        oScroll: {
            bCollapse: null,
            iBarWidth: 0,
            sX: null,
            sXInner: null,
            sY: null
        },
        oLanguage: {
            fnInfoCallback: null
        },
        oBrowser: {
            bScrollOversize: !1,
            bScrollbarLeft: !1,
            bBounding: !1,
            barWidth: 0
        },
        ajax: null,
        aanFeatures: [],
        aoData: [],
        aiDisplay: [],
        aiDisplayMaster: [],
        aIds: {},
        aoColumns: [],
        aoHeader: [],
        aoFooter: [],
        oPreviousSearch: {},
        aoPreSearchCols: [],
        aaSorting: null,
        aaSortingFixed: [],
        asStripeClasses: null,
        asDestroyStripes: [],
        sDestroyWidth: 0,
        aoRowCallback: [],
        aoHeaderCallback: [],
        aoFooterCallback: [],
        aoDrawCallback: [],
        aoRowCreatedCallback: [],
        aoPreDrawCallback: [],
        aoInitComplete: [],
        aoStateSaveParams: [],
        aoStateLoadParams: [],
        aoStateLoaded: [],
        sTableId: "",
        nTable: null,
        nTHead: null,
        nTFoot: null,
        nTBody: null,
        nTableWrapper: null,
        bDeferLoading: !1,
        bInitialised: !1,
        aoOpenRows: [],
        sDom: null,
        searchDelay: null,
        sPaginationType: "two_button",
        iStateDuration: 0,
        aoStateSave: [],
        aoStateLoad: [],
        oSavedState: null,
        oLoadedState: null,
        sAjaxSource: null,
        sAjaxDataProp: null,
        jqXHR: null,
        json: r,
        oAjaxData: r,
        fnServerData: null,
        aoServerParams: [],
        sServerMethod: null,
        fnFormatNumber: null,
        aLengthMenu: null,
        iDraw: 0,
        bDrawing: !1,
        iDrawError: -1,
        _iDisplayLength: 10,
        _iDisplayStart: 0,
        _iRecordsTotal: 0,
        _iRecordsDisplay: 0,
        oClasses: {},
        bFiltered: !1,
        bSorted: !1,
        bSortCellsTop: null,
        oInit: null,
        aoDestroyCallback: [],
        fnRecordsTotal: function() {
            return "ssp" == mt(this) ? +this._iRecordsTotal : this.aiDisplayMaster.length
        },
        fnRecordsDisplay: function() {
            return "ssp" == mt(this) ? +this._iRecordsDisplay : this.aiDisplay.length
        },
        fnDisplayEnd: function() {
            var e = this._iDisplayLength
              , t = this._iDisplayStart
              , n = t + e
              , r = this.aiDisplay.length
              , i = this.oFeatures
              , a = i.bPaginate;
            return i.bServerSide ? !1 === a || -1 === e ? t + r : Math.min(t + e, this._iRecordsDisplay) : !a || r < n || -1 === e ? r : n
        },
        oInstance: null,
        sInstance: null,
        iTabIndex: 0,
        nScrollHead: null,
        nScrollFoot: null,
        aLastSort: [],
        oPlugins: {},
        rowIdFn: null,
        rowId: null
    },
    h.ext = d = {
        buttons: {},
        classes: {},
        builder: "-source-",
        errMode: "alert",
        feature: [],
        search: [],
        selector: {
            cell: [],
            column: [],
            row: []
        },
        internal: {},
        legacy: {
            ajax: null
        },
        pager: {},
        renderer: {
            pageButton: {},
            header: {}
        },
        order: {},
        type: {
            detect: [],
            search: {},
            order: {}
        },
        _unique: 0,
        fnVersionCheck: h.fnVersionCheck,
        iApiIndex: 0,
        oJUIClasses: {},
        sVersion: h.version
    },
    e.extend(d, {
        afnFiltering: d.search,
        aTypes: d.type.detect,
        ofnSearch: d.type.search,
        oSort: d.type.order,
        afnSortData: d.order,
        aoFeatures: d.feature,
        oApi: d.internal,
        oStdClasses: d.classes,
        oPagination: d.pager
    }),
    e.extend(h.ext.classes, {
        sTable: "dataTable",
        sNoFooter: "no-footer",
        sPageButton: "paginate_button",
        sPageButtonActive: "current",
        sPageButtonDisabled: "disabled",
        sStripeOdd: "odd",
        sStripeEven: "even",
        sRowEmpty: "dataTables_empty",
        sWrapper: "dataTables_wrapper",
        sFilter: "dataTables_filter",
        sInfo: "dataTables_info",
        sPaging: "dataTables_paginate paging_",
        sLength: "dataTables_length",
        sProcessing: "dataTables_processing",
        sSortAsc: "sorting_asc",
        sSortDesc: "sorting_desc",
        sSortable: "sorting",
        sSortableAsc: "sorting_desc_disabled",
        sSortableDesc: "sorting_asc_disabled",
        sSortableNone: "sorting_disabled",
        sSortColumn: "sorting_",
        sFilterInput: "",
        sLengthSelect: "",
        sScrollWrapper: "dataTables_scroll",
        sScrollHead: "dataTables_scrollHead",
        sScrollHeadInner: "dataTables_scrollHeadInner",
        sScrollBody: "dataTables_scrollBody",
        sScrollFoot: "dataTables_scrollFoot",
        sScrollFootInner: "dataTables_scrollFootInner",
        sHeaderTH: "",
        sFooterTH: "",
        sSortJUIAsc: "",
        sSortJUIDesc: "",
        sSortJUI: "",
        sSortJUIAscAllowed: "",
        sSortJUIDescAllowed: "",
        sSortJUIWrapper: "",
        sSortIcon: "",
        sJUIHeader: "",
        sJUIFooter: ""
    }),
    h.ext.pager);
    function It(e, t) {
        var n = []
          , r = Pt.numbers_length
          , i = Math.floor(r / 2);
        return t <= r ? n = l(0, t) : e <= i ? ((n = l(0, r - 2)).push("ellipsis"),
        n.push(t - 1)) : ((t - 1 - i <= e ? n = l(t - (r - 2), t) : ((n = l(e - i + 2, e + i - 1)).push("ellipsis"),
        n.push(t - 1),
        n)).splice(0, 0, "ellipsis"),
        n.splice(0, 0, 0)),
        n.DT_el = "span",
        n
    }
    function Ot(e, t, n, r) {
        var i;
        return 0 === e || e && "-" !== e ? "number" == (i = typeof e) || "bigint" == i ? e : ((e = t ? T(e, t) : e).replace && (n && (e = e.replace(n, "")),
        r && (e = e.replace(r, ""))),
        +e) : -1 / 0
    }
    function Nt(t) {
        e.each({
            num: function(e) {
                return Ot(e, t)
            },
            "num-fmt": function(e) {
                return Ot(e, t, w)
            },
            "html-num": function(e) {
                return Ot(e, t, v)
            },
            "html-num-fmt": function(e) {
                return Ot(e, t, v, w)
            }
        }, (function(e, n) {
            d.type.order[e + t + "-pre"] = n,
            e.match(/^html\-/) && (d.type.search[e + t] = d.type.search.html)
        }
        ))
    }
    function jt(e) {
        return "string" == typeof (e = Array.isArray(e) ? e.join(",") : e) ? e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : e
    }
    function zt(e, n, r, i, a) {
        return t.moment ? e[n](a) : t.luxon ? e[r](a) : i ? e[i](a) : e
    }
    e.extend(Pt, {
        simple: function(e, t) {
            return ["previous", "next"]
        },
        full: function(e, t) {
            return ["first", "previous", "next", "last"]
        },
        numbers: function(e, t) {
            return [It(e, t)]
        },
        simple_numbers: function(e, t) {
            return ["previous", It(e, t), "next"]
        },
        full_numbers: function(e, t) {
            return ["first", "previous", It(e, t), "next", "last"]
        },
        first_last_numbers: function(e, t) {
            return ["first", It(e, t), "last"]
        },
        _numbers: It,
        numbers_length: 7
    }),
    e.extend(!0, h.ext.renderer, {
        pageButton: {
            _: function(t, i, a, s, o, l) {
                var c, u, d, p = t.oClasses, f = t.oLanguage.oPaginate, h = t.oLanguage.oAria.paginate || {};
                try {
                    d = e(i).find(n.activeElement).data("dt-idx")
                } catch (i) {}
                (function n(r, i) {
                    for (var s, d, m, g = p.sPageButtonDisabled, v = function(e) {
                        ze(t, e.data.action, !0)
                    }, b = 0, y = i.length; b < y; b++)
                        if (s = i[b],
                        Array.isArray(s)) {
                            var w = e("<" + (s.DT_el || "div") + "/>").appendTo(r);
                            n(w, s)
                        } else {
                            switch (c = null,
                            u = s,
                            d = t.iTabIndex,
                            s) {
                            case "ellipsis":
                                r.append('<span class="ellipsis">&#x2026;</span>');
                                break;
                            case "first":
                                c = f.sFirst,
                                0 === o && (d = -1,
                                u += " " + g);
                                break;
                            case "previous":
                                c = f.sPrevious,
                                0 === o && (d = -1,
                                u += " " + g);
                                break;
                            case "next":
                                c = f.sNext,
                                0 !== l && o !== l - 1 || (d = -1,
                                u += " " + g);
                                break;
                            case "last":
                                c = f.sLast,
                                0 !== l && o !== l - 1 || (d = -1,
                                u += " " + g);
                                break;
                            default:
                                c = t.fnFormatNumber(s + 1),
                                u = o === s ? p.sPageButtonActive : ""
                            }
                            null !== c && (w = t.oInit.pagingTag || "a",
                            m = -1 !== u.indexOf(g),
                            ut(e("<" + w + ">", {
                                class: p.sPageButton + " " + u,
                                "aria-controls": t.sTableId,
                                "aria-disabled": m ? "true" : null,
                                "aria-label": h[s],
                                "aria-role": "link",
                                "aria-current": u === p.sPageButtonActive ? "page" : null,
                                "data-dt-idx": s,
                                tabindex: d,
                                id: 0 === a && "string" == typeof s ? t.sTableId + "_" + s : null
                            }).html(c).appendTo(r), {
                                action: s
                            }, v))
                        }
                }
                )(e(i).empty(), s),
                d !== r && e(i).find("[data-dt-idx=" + d + "]").trigger("focus")
            }
        }
    }),
    e.extend(h.ext.type.detect, [function(e, t) {
        return a(e, t = t.oLanguage.sDecimal) ? "num" + t : null
    }
    , function(e, t) {
        var n;
        return (!e || e instanceof Date || b.test(e)) && (null !== (n = Date.parse(e)) && !isNaN(n) || x(e)) ? "date" : null
    }
    , function(e, t) {
        return a(e, t = t.oLanguage.sDecimal, !0) ? "num-fmt" + t : null
    }
    , function(e, t) {
        return s(e, t = t.oLanguage.sDecimal) ? "html-num" + t : null
    }
    , function(e, t) {
        return s(e, t = t.oLanguage.sDecimal, !0) ? "html-num-fmt" + t : null
    }
    , function(e, t) {
        return x(e) || "string" == typeof e && -1 !== e.indexOf("<") ? "html" : null
    }
    ]),
    e.extend(h.ext.type.search, {
        html: function(e) {
            return x(e) ? e : "string" == typeof e ? e.replace(g, " ").replace(v, "") : ""
        },
        string: function(e) {
            return x(e) || "string" != typeof e ? e : e.replace(g, " ")
        }
    }),
    e.extend(d.type.order, {
        "date-pre": function(e) {
            return e = Date.parse(e),
            isNaN(e) ? -1 / 0 : e
        },
        "html-pre": function(e) {
            return x(e) ? "" : e.replace ? e.replace(/<.*?>/g, "").toLowerCase() : e + ""
        },
        "string-pre": function(e) {
            return x(e) ? "" : "string" == typeof e ? e.toLowerCase() : e.toString ? e.toString() : ""
        },
        "string-asc": function(e, t) {
            return e < t ? -1 : t < e ? 1 : 0
        },
        "string-desc": function(e, t) {
            return e < t ? 1 : t < e ? -1 : 0
        }
    }),
    Nt(""),
    e.extend(!0, h.ext.renderer, {
        header: {
            _: function(t, n, r, i) {
                e(t.nTable).on("order.dt.DT", (function(e, a, s, o) {
                    t === a && (a = r.idx,
                    n.removeClass(i.sSortAsc + " " + i.sSortDesc).addClass("asc" == o[a] ? i.sSortAsc : "desc" == o[a] ? i.sSortDesc : r.sSortingClass))
                }
                ))
            },
            jqueryui: function(t, n, r, i) {
                e("<div/>").addClass(i.sSortJUIWrapper).append(n.contents()).append(e("<span/>").addClass(i.sSortIcon + " " + r.sSortingClassJUI)).appendTo(n),
                e(t.nTable).on("order.dt.DT", (function(e, a, s, o) {
                    t === a && (a = r.idx,
                    n.removeClass(i.sSortAsc + " " + i.sSortDesc).addClass("asc" == o[a] ? i.sSortAsc : "desc" == o[a] ? i.sSortDesc : r.sSortingClass),
                    n.find("span." + i.sSortIcon).removeClass(i.sSortJUIAsc + " " + i.sSortJUIDesc + " " + i.sSortJUI + " " + i.sSortJUIAscAllowed + " " + i.sSortJUIDescAllowed).addClass("asc" == o[a] ? i.sSortJUIAsc : "desc" == o[a] ? i.sSortJUIDesc : r.sSortingClassJUI))
                }
                ))
            }
        }
    });
    var Ht = !1;
    function $t(e, n, r) {
        var i;
        if (t.moment) {
            if (!(i = t.moment.utc(e, n, r, !0)).isValid())
                return null
        } else if (t.luxon) {
            if (!(i = n && "string" == typeof e ? t.luxon.DateTime.fromFormat(e, n) : t.luxon.DateTime.fromISO(e)).isValid)
                return null;
            i.setLocale(r)
        } else
            n ? (Ht || alert("DataTables warning: Formatted date without Moment.js or Luxon - https://datatables.net/tn/17"),
            Ht = !0) : i = new Date(e);
        return i
    }
    function Ft(e) {
        return function(t, n, i, a) {
            0 === arguments.length ? (i = "en",
            t = n = null) : 1 === arguments.length ? (i = "en",
            n = t,
            t = null) : 2 === arguments.length && (i = n,
            n = t,
            t = null);
            var s = "datetime-" + n;
            return h.ext.type.order[s] || (h.ext.type.detect.unshift((function(e) {
                return e === s && s
            }
            )),
            h.ext.type.order[s + "-asc"] = function(e, t) {
                return (e = e.valueOf()) === (t = t.valueOf()) ? 0 : e < t ? -1 : 1
            }
            ,
            h.ext.type.order[s + "-desc"] = function(e, t) {
                return (e = e.valueOf()) === (t = t.valueOf()) ? 0 : t < e ? -1 : 1
            }
            ),
            function(o, l) {
                var c;
                return null !== o && o !== r || (o = "--now" === a ? (c = new Date,
                new Date(Date.UTC(c.getFullYear(), c.getMonth(), c.getDate(), c.getHours(), c.getMinutes(), c.getSeconds()))) : ""),
                "type" === l ? s : "" === o ? "sort" !== l ? "" : $t("0000-01-01 00:00:00", null, i) : (null === n || t !== n || "sort" === l || "type" === l || o instanceof Date) && null !== (c = $t(o, t, i)) ? "sort" === l ? c : (o = null === n ? zt(c, "toDate", "toJSDate", "")[e]() : zt(c, "format", "toFormat", "toISOString", n),
                "display" === l ? jt(o) : o) : o
            }
        }
    }
    var Rt = ","
      , Bt = ".";
    if (Intl)
        try {
            for (var Wt = (new Intl.NumberFormat).formatToParts(100000.1), qt = 0; qt < Wt.length; qt++)
                "group" === Wt[qt].type ? Rt = Wt[qt].value : "decimal" === Wt[qt].type && (Bt = Wt[qt].value)
        } catch (f) {}
    function Xt(e) {
        return function() {
            var t = [st(this[h.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));
            return h.ext.internal[e].apply(this, t)
        }
    }
    return h.datetime = function(e, t) {
        var n = "datetime-detect-" + e;
        t = t || "en",
        h.ext.type.order[n] || (h.ext.type.detect.unshift((function(r) {
            var i = $t(r, e, t);
            return !("" !== r && !i) && n
        }
        )),
        h.ext.type.order[n + "-pre"] = function(n) {
            return $t(n, e, t) || 0
        }
        )
    }
    ,
    h.render = {
        date: Ft("toLocaleDateString"),
        datetime: Ft("toLocaleString"),
        time: Ft("toLocaleTimeString"),
        number: function(e, t, n, i, a) {
            return null !== e && e !== r || (e = Rt),
            null !== t && t !== r || (t = Bt),
            {
                display: function(r) {
                    if ("number" != typeof r && "string" != typeof r)
                        return r;
                    if ("" === r || null === r)
                        return r;
                    var s = r < 0 ? "-" : ""
                      , o = parseFloat(r);
                    return isNaN(o) ? jt(r) : (o = o.toFixed(n),
                    r = Math.abs(o),
                    o = parseInt(r, 10),
                    r = n ? t + (r - o).toFixed(n).substring(2) : "",
                    (s = 0 === o && 0 === parseFloat(r) ? "" : s) + (i || "") + o.toString().replace(/\B(?=(\d{3})+(?!\d))/g, e) + r + (a || ""))
                }
            }
        },
        text: function() {
            return {
                display: jt,
                filter: jt
            }
        }
    },
    e.extend(h.ext.internal, {
        _fnExternApiFunc: Xt,
        _fnBuildAjax: pe,
        _fnAjaxUpdate: fe,
        _fnAjaxParameters: he,
        _fnAjaxUpdateDraw: me,
        _fnAjaxDataSrc: ge,
        _fnAddColumn: O,
        _fnColumnOptions: N,
        _fnAdjustColumnSizing: j,
        _fnVisibleToColumnIndex: z,
        _fnColumnIndexToVisible: H,
        _fnVisbleColumns: $,
        _fnGetColumns: F,
        _fnColumnTypes: R,
        _fnApplyColumnDefs: B,
        _fnHungarianMap: E,
        _fnCamelToHungarian: D,
        _fnLanguageCompat: A,
        _fnBrowserDetect: P,
        _fnAddData: W,
        _fnAddTr: q,
        _fnNodeToDataIndex: function(e, t) {
            return t._DT_RowIndex !== r ? t._DT_RowIndex : null
        },
        _fnNodeToColumnIndex: function(t, n, r) {
            return e.inArray(r, t.aoData[n].anCells)
        },
        _fnGetCellData: X,
        _fnSetCellData: V,
        _fnSplitObjNotation: U,
        _fnGetObjectDataFn: K,
        _fnSetObjectDataFn: J,
        _fnGetDataMaster: Q,
        _fnClearTable: Z,
        _fnDeleteIndex: ee,
        _fnInvalidate: te,
        _fnGetRowElements: ne,
        _fnCreateTr: re,
        _fnBuildHead: ae,
        _fnDrawHead: se,
        _fnDraw: oe,
        _fnReDraw: le,
        _fnAddOptionsHtml: ce,
        _fnDetectHeader: ue,
        _fnGetUniqueThs: de,
        _fnFeatureHtmlFilter: ve,
        _fnFilterComplete: be,
        _fnFilterCustom: ye,
        _fnFilterColumn: we,
        _fnFilter: xe,
        _fnFilterCreateSearch: Te,
        _fnEscapeRegex: Se,
        _fnFilterData: Ee,
        _fnFeatureHtmlInfo: ke,
        _fnUpdateInfo: Le,
        _fnInfoMacros: Me,
        _fnInitialise: Pe,
        _fnInitComplete: Ie,
        _fnLengthChange: Oe,
        _fnFeatureHtmlLength: Ne,
        _fnFeatureHtmlPaginate: je,
        _fnPageChange: ze,
        _fnFeatureHtmlProcessing: He,
        _fnProcessingDisplay: $e,
        _fnFeatureHtmlTable: Fe,
        _fnScrollDraw: Re,
        _fnApplyToChildren: Be,
        _fnCalculateColumnWidths: qe,
        _fnThrottle: Xe,
        _fnConvertToWidth: Ve,
        _fnGetWidestNode: Ge,
        _fnGetMaxLenString: Ye,
        _fnStringToCss: Ue,
        _fnSortFlatten: Ke,
        _fnSort: Je,
        _fnSortAria: Qe,
        _fnSortListener: Ze,
        _fnSortAttachListener: et,
        _fnSortingClasses: tt,
        _fnSortData: nt,
        _fnSaveState: rt,
        _fnLoadState: it,
        _fnImplementState: at,
        _fnSettingsFromNode: st,
        _fnLog: ot,
        _fnMap: lt,
        _fnBindAction: ut,
        _fnCallbackReg: dt,
        _fnCallbackFire: pt,
        _fnLengthOverflow: ft,
        _fnRenderer: ht,
        _fnDataSource: mt,
        _fnRowAttributes: ie,
        _fnExtend: ct,
        _fnCalculateEnd: function() {}
    }),
    ((e.fn.dataTable = h).$ = e).fn.dataTableSettings = h.settings,
    e.fn.dataTableExt = h.ext,
    e.fn.DataTable = function(t) {
        return e(this).dataTable(t).api()
    }
    ,
    e.each(h, (function(t, n) {
        e.fn.DataTable[t] = n
    }
    )),
    h
}
)),
function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).Popper = {})
}(this, (function(e) {
    "use strict";
    function t(e) {
        if (null == e)
            return window;
        if ("[object Window]" !== e.toString()) {
            var t = e.ownerDocument;
            return t && t.defaultView || window
        }
        return e
    }
    function n(e) {
        return e instanceof t(e).Element || e instanceof Element
    }
    function r(e) {
        return e instanceof t(e).HTMLElement || e instanceof HTMLElement
    }
    function i(e) {
        return "undefined" != typeof ShadowRoot && (e instanceof t(e).ShadowRoot || e instanceof ShadowRoot)
    }
    var a = Math.max
      , s = Math.min
      , o = Math.round;
    function l() {
        var e = navigator.userAgentData;
        return null != e && e.brands ? e.brands.map((function(e) {
            return e.brand + "/" + e.version
        }
        )).join(" ") : navigator.userAgent
    }
    function c() {
        return !/^((?!chrome|android).)*safari/i.test(l())
    }
    function u(e, i, a) {
        void 0 === i && (i = !1),
        void 0 === a && (a = !1);
        var s = e.getBoundingClientRect()
          , l = 1
          , u = 1;
        i && r(e) && (l = e.offsetWidth > 0 && o(s.width) / e.offsetWidth || 1,
        u = e.offsetHeight > 0 && o(s.height) / e.offsetHeight || 1);
        var d = (n(e) ? t(e) : window).visualViewport
          , p = !c() && a
          , f = (s.left + (p && d ? d.offsetLeft : 0)) / l
          , h = (s.top + (p && d ? d.offsetTop : 0)) / u
          , m = s.width / l
          , g = s.height / u;
        return {
            width: m,
            height: g,
            top: h,
            right: f + m,
            bottom: h + g,
            left: f,
            x: f,
            y: h
        }
    }
    function d(e) {
        var n = t(e);
        return {
            scrollLeft: n.pageXOffset,
            scrollTop: n.pageYOffset
        }
    }
    function p(e) {
        return e ? (e.nodeName || "").toLowerCase() : null
    }
    function f(e) {
        return ((n(e) ? e.ownerDocument : e.document) || window.document).documentElement
    }
    function h(e) {
        return u(f(e)).left + d(e).scrollLeft
    }
    function m(e) {
        return t(e).getComputedStyle(e)
    }
    function g(e) {
        var t = m(e)
          , n = t.overflow
          , r = t.overflowX
          , i = t.overflowY;
        return /auto|scroll|overlay|hidden/.test(n + i + r)
    }
    function v(e, n, i) {
        void 0 === i && (i = !1);
        var a, s, l = r(n), c = r(n) && function(e) {
            var t = e.getBoundingClientRect()
              , n = o(t.width) / e.offsetWidth || 1
              , r = o(t.height) / e.offsetHeight || 1;
            return 1 !== n || 1 !== r
        }(n), m = f(n), v = u(e, c, i), b = {
            scrollLeft: 0,
            scrollTop: 0
        }, y = {
            x: 0,
            y: 0
        };
        return (l || !l && !i) && (("body" !== p(n) || g(m)) && (b = (a = n) !== t(a) && r(a) ? {
            scrollLeft: (s = a).scrollLeft,
            scrollTop: s.scrollTop
        } : d(a)),
        r(n) ? ((y = u(n, !0)).x += n.clientLeft,
        y.y += n.clientTop) : m && (y.x = h(m))),
        {
            x: v.left + b.scrollLeft - y.x,
            y: v.top + b.scrollTop - y.y,
            width: v.width,
            height: v.height
        }
    }
    function b(e) {
        var t = u(e)
          , n = e.offsetWidth
          , r = e.offsetHeight;
        return Math.abs(t.width - n) <= 1 && (n = t.width),
        Math.abs(t.height - r) <= 1 && (r = t.height),
        {
            x: e.offsetLeft,
            y: e.offsetTop,
            width: n,
            height: r
        }
    }
    function y(e) {
        return "html" === p(e) ? e : e.assignedSlot || e.parentNode || (i(e) ? e.host : null) || f(e)
    }
    function w(e) {
        return ["html", "body", "#document"].indexOf(p(e)) >= 0 ? e.ownerDocument.body : r(e) && g(e) ? e : w(y(e))
    }
    function x(e, n) {
        var r;
        void 0 === n && (n = []);
        var i = w(e)
          , a = i === (null == (r = e.ownerDocument) ? void 0 : r.body)
          , s = t(i)
          , o = a ? [s].concat(s.visualViewport || [], g(i) ? i : []) : i
          , l = n.concat(o);
        return a ? l : l.concat(x(y(o)))
    }
    function T(e) {
        return ["table", "td", "th"].indexOf(p(e)) >= 0
    }
    function S(e) {
        return r(e) && "fixed" !== m(e).position ? e.offsetParent : null
    }
    function _(e) {
        for (var n = t(e), a = S(e); a && T(a) && "static" === m(a).position; )
            a = S(a);
        return a && ("html" === p(a) || "body" === p(a) && "static" === m(a).position) ? n : a || function(e) {
            var t = /firefox/i.test(l());
            if (/Trident/i.test(l()) && r(e) && "fixed" === m(e).position)
                return null;
            var n = y(e);
            for (i(n) && (n = n.host); r(n) && ["html", "body"].indexOf(p(n)) < 0; ) {
                var a = m(n);
                if ("none" !== a.transform || "none" !== a.perspective || "paint" === a.contain || -1 !== ["transform", "perspective"].indexOf(a.willChange) || t && "filter" === a.willChange || t && a.filter && "none" !== a.filter)
                    return n;
                n = n.parentNode
            }
            return null
        }(e) || n
    }
    var C = "top"
      , E = "bottom"
      , D = "right"
      , A = "left"
      , k = "auto"
      , L = [C, E, D, A]
      , M = "start"
      , P = "end"
      , I = "viewport"
      , O = "popper"
      , N = L.reduce((function(e, t) {
        return e.concat([t + "-" + M, t + "-" + P])
    }
    ), [])
      , j = [].concat(L, [k]).reduce((function(e, t) {
        return e.concat([t, t + "-" + M, t + "-" + P])
    }
    ), [])
      , z = ["beforeRead", "read", "afterRead", "beforeMain", "main", "afterMain", "beforeWrite", "write", "afterWrite"];
    function H(e) {
        var t = new Map
          , n = new Set
          , r = [];
        function i(e) {
            n.add(e.name),
            [].concat(e.requires || [], e.requiresIfExists || []).forEach((function(e) {
                if (!n.has(e)) {
                    var r = t.get(e);
                    r && i(r)
                }
            }
            )),
            r.push(e)
        }
        return e.forEach((function(e) {
            t.set(e.name, e)
        }
        )),
        e.forEach((function(e) {
            n.has(e.name) || i(e)
        }
        )),
        r
    }
    function $(e) {
        return e.split("-")[0]
    }
    function F(e, t) {
        var n = t.getRootNode && t.getRootNode();
        if (e.contains(t))
            return !0;
        if (n && i(n)) {
            var r = t;
            do {
                if (r && e.isSameNode(r))
                    return !0;
                r = r.parentNode || r.host
            } while (r)
        }
        return !1
    }
    function R(e) {
        return Object.assign({}, e, {
            left: e.x,
            top: e.y,
            right: e.x + e.width,
            bottom: e.y + e.height
        })
    }
    function B(e, r, i) {
        return r === I ? R(function(e, n) {
            var r = t(e)
              , i = f(e)
              , a = r.visualViewport
              , s = i.clientWidth
              , o = i.clientHeight
              , l = 0
              , u = 0;
            if (a) {
                s = a.width,
                o = a.height;
                var d = c();
                (d || !d && "fixed" === n) && (l = a.offsetLeft,
                u = a.offsetTop)
            }
            return {
                width: s,
                height: o,
                x: l + h(e),
                y: u
            }
        }(e, i)) : n(r) ? function(e, t) {
            var n = u(e, !1, "fixed" === t);
            return n.top = n.top + e.clientTop,
            n.left = n.left + e.clientLeft,
            n.bottom = n.top + e.clientHeight,
            n.right = n.left + e.clientWidth,
            n.width = e.clientWidth,
            n.height = e.clientHeight,
            n.x = n.left,
            n.y = n.top,
            n
        }(r, i) : R(function(e) {
            var t, n = f(e), r = d(e), i = null == (t = e.ownerDocument) ? void 0 : t.body, s = a(n.scrollWidth, n.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), o = a(n.scrollHeight, n.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), l = -r.scrollLeft + h(e), c = -r.scrollTop;
            return "rtl" === m(i || n).direction && (l += a(n.clientWidth, i ? i.clientWidth : 0) - s),
            {
                width: s,
                height: o,
                x: l,
                y: c
            }
        }(f(e)))
    }
    function W(e, t, i, o) {
        var l = "clippingParents" === t ? function(e) {
            var t = x(y(e))
              , i = ["absolute", "fixed"].indexOf(m(e).position) >= 0 && r(e) ? _(e) : e;
            return n(i) ? t.filter((function(e) {
                return n(e) && F(e, i) && "body" !== p(e)
            }
            )) : []
        }(e) : [].concat(t)
          , c = [].concat(l, [i])
          , u = c[0]
          , d = c.reduce((function(t, n) {
            var r = B(e, n, o);
            return t.top = a(r.top, t.top),
            t.right = s(r.right, t.right),
            t.bottom = s(r.bottom, t.bottom),
            t.left = a(r.left, t.left),
            t
        }
        ), B(e, u, o));
        return d.width = d.right - d.left,
        d.height = d.bottom - d.top,
        d.x = d.left,
        d.y = d.top,
        d
    }
    function q(e) {
        return e.split("-")[1]
    }
    function X(e) {
        return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y"
    }
    function V(e) {
        var t, n = e.reference, r = e.element, i = e.placement, a = i ? $(i) : null, s = i ? q(i) : null, o = n.x + n.width / 2 - r.width / 2, l = n.y + n.height / 2 - r.height / 2;
        switch (a) {
        case C:
            t = {
                x: o,
                y: n.y - r.height
            };
            break;
        case E:
            t = {
                x: o,
                y: n.y + n.height
            };
            break;
        case D:
            t = {
                x: n.x + n.width,
                y: l
            };
            break;
        case A:
            t = {
                x: n.x - r.width,
                y: l
            };
            break;
        default:
            t = {
                x: n.x,
                y: n.y
            }
        }
        var c = a ? X(a) : null;
        if (null != c) {
            var u = "y" === c ? "height" : "width";
            switch (s) {
            case M:
                t[c] = t[c] - (n[u] / 2 - r[u] / 2);
                break;
            case P:
                t[c] = t[c] + (n[u] / 2 - r[u] / 2)
            }
        }
        return t
    }
    function G(e) {
        return Object.assign({}, {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }, e)
    }
    function Y(e, t) {
        return t.reduce((function(t, n) {
            return t[n] = e,
            t
        }
        ), {})
    }
    function U(e, t) {
        void 0 === t && (t = {});
        var r = t
          , i = r.placement
          , a = void 0 === i ? e.placement : i
          , s = r.strategy
          , o = void 0 === s ? e.strategy : s
          , l = r.boundary
          , c = void 0 === l ? "clippingParents" : l
          , d = r.rootBoundary
          , p = void 0 === d ? I : d
          , h = r.elementContext
          , m = void 0 === h ? O : h
          , g = r.altBoundary
          , v = void 0 !== g && g
          , b = r.padding
          , y = void 0 === b ? 0 : b
          , w = G("number" != typeof y ? y : Y(y, L))
          , x = m === O ? "reference" : O
          , T = e.rects.popper
          , S = e.elements[v ? x : m]
          , _ = W(n(S) ? S : S.contextElement || f(e.elements.popper), c, p, o)
          , A = u(e.elements.reference)
          , k = V({
            reference: A,
            element: T,
            strategy: "absolute",
            placement: a
        })
          , M = R(Object.assign({}, T, k))
          , P = m === O ? M : A
          , N = {
            top: _.top - P.top + w.top,
            bottom: P.bottom - _.bottom + w.bottom,
            left: _.left - P.left + w.left,
            right: P.right - _.right + w.right
        }
          , j = e.modifiersData.offset;
        if (m === O && j) {
            var z = j[a];
            Object.keys(N).forEach((function(e) {
                var t = [D, E].indexOf(e) >= 0 ? 1 : -1
                  , n = [C, E].indexOf(e) >= 0 ? "y" : "x";
                N[e] += z[n] * t
            }
            ))
        }
        return N
    }
    var K = {
        placement: "bottom",
        modifiers: [],
        strategy: "absolute"
    };
    function J() {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
            t[n] = arguments[n];
        return !t.some((function(e) {
            return !(e && "function" == typeof e.getBoundingClientRect)
        }
        ))
    }
    function Q(e) {
        void 0 === e && (e = {});
        var t = e
          , r = t.defaultModifiers
          , i = void 0 === r ? [] : r
          , a = t.defaultOptions
          , s = void 0 === a ? K : a;
        return function(e, t, r) {
            void 0 === r && (r = s);
            var a, o, l = {
                placement: "bottom",
                orderedModifiers: [],
                options: Object.assign({}, K, s),
                modifiersData: {},
                elements: {
                    reference: e,
                    popper: t
                },
                attributes: {},
                styles: {}
            }, c = [], u = !1, d = {
                state: l,
                setOptions: function(r) {
                    var a = "function" == typeof r ? r(l.options) : r;
                    p(),
                    l.options = Object.assign({}, s, l.options, a),
                    l.scrollParents = {
                        reference: n(e) ? x(e) : e.contextElement ? x(e.contextElement) : [],
                        popper: x(t)
                    };
                    var o, u, f = function(e) {
                        var t = H(e);
                        return z.reduce((function(e, n) {
                            return e.concat(t.filter((function(e) {
                                return e.phase === n
                            }
                            )))
                        }
                        ), [])
                    }((o = [].concat(i, l.options.modifiers),
                    u = o.reduce((function(e, t) {
                        var n = e[t.name];
                        return e[t.name] = n ? Object.assign({}, n, t, {
                            options: Object.assign({}, n.options, t.options),
                            data: Object.assign({}, n.data, t.data)
                        }) : t,
                        e
                    }
                    ), {}),
                    Object.keys(u).map((function(e) {
                        return u[e]
                    }
                    ))));
                    return l.orderedModifiers = f.filter((function(e) {
                        return e.enabled
                    }
                    )),
                    l.orderedModifiers.forEach((function(e) {
                        var t = e.name
                          , n = e.options
                          , r = void 0 === n ? {} : n
                          , i = e.effect;
                        if ("function" == typeof i) {
                            var a = i({
                                state: l,
                                name: t,
                                instance: d,
                                options: r
                            });
                            c.push(a || function() {}
                            )
                        }
                    }
                    )),
                    d.update()
                },
                forceUpdate: function() {
                    if (!u) {
                        var e = l.elements
                          , t = e.reference
                          , n = e.popper;
                        if (J(t, n)) {
                            l.rects = {
                                reference: v(t, _(n), "fixed" === l.options.strategy),
                                popper: b(n)
                            },
                            l.reset = !1,
                            l.placement = l.options.placement,
                            l.orderedModifiers.forEach((function(e) {
                                return l.modifiersData[e.name] = Object.assign({}, e.data)
                            }
                            ));
                            for (var r = 0; r < l.orderedModifiers.length; r++)
                                if (!0 !== l.reset) {
                                    var i = l.orderedModifiers[r]
                                      , a = i.fn
                                      , s = i.options
                                      , o = void 0 === s ? {} : s
                                      , c = i.name;
                                    "function" == typeof a && (l = a({
                                        state: l,
                                        options: o,
                                        name: c,
                                        instance: d
                                    }) || l)
                                } else
                                    l.reset = !1,
                                    r = -1
                        }
                    }
                },
                update: (a = function() {
                    return new Promise((function(e) {
                        d.forceUpdate(),
                        e(l)
                    }
                    ))
                }
                ,
                function() {
                    return o || (o = new Promise((function(e) {
                        Promise.resolve().then((function() {
                            o = void 0,
                            e(a())
                        }
                        ))
                    }
                    ))),
                    o
                }
                ),
                destroy: function() {
                    p(),
                    u = !0
                }
            };
            if (!J(e, t))
                return d;
            function p() {
                c.forEach((function(e) {
                    return e()
                }
                )),
                c = []
            }
            return d.setOptions(r).then((function(e) {
                !u && r.onFirstUpdate && r.onFirstUpdate(e)
            }
            )),
            d
        }
    }
    var Z = {
        passive: !0
    }
      , ee = {
        name: "eventListeners",
        enabled: !0,
        phase: "write",
        fn: function() {},
        effect: function(e) {
            var n = e.state
              , r = e.instance
              , i = e.options
              , a = i.scroll
              , s = void 0 === a || a
              , o = i.resize
              , l = void 0 === o || o
              , c = t(n.elements.popper)
              , u = [].concat(n.scrollParents.reference, n.scrollParents.popper);
            return s && u.forEach((function(e) {
                e.addEventListener("scroll", r.update, Z)
            }
            )),
            l && c.addEventListener("resize", r.update, Z),
            function() {
                s && u.forEach((function(e) {
                    e.removeEventListener("scroll", r.update, Z)
                }
                )),
                l && c.removeEventListener("resize", r.update, Z)
            }
        },
        data: {}
    }
      , te = {
        name: "popperOffsets",
        enabled: !0,
        phase: "read",
        fn: function(e) {
            var t = e.state
              , n = e.name;
            t.modifiersData[n] = V({
                reference: t.rects.reference,
                element: t.rects.popper,
                strategy: "absolute",
                placement: t.placement
            })
        },
        data: {}
    }
      , ne = {
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto"
    };
    function re(e) {
        var n, r = e.popper, i = e.popperRect, a = e.placement, s = e.variation, l = e.offsets, c = e.position, u = e.gpuAcceleration, d = e.adaptive, p = e.roundOffsets, h = e.isFixed, g = l.x, v = void 0 === g ? 0 : g, b = l.y, y = void 0 === b ? 0 : b, w = "function" == typeof p ? p({
            x: v,
            y: y
        }) : {
            x: v,
            y: y
        };
        v = w.x,
        y = w.y;
        var x = l.hasOwnProperty("x")
          , T = l.hasOwnProperty("y")
          , S = A
          , k = C
          , L = window;
        if (d) {
            var M = _(r)
              , I = "clientHeight"
              , O = "clientWidth";
            M === t(r) && "static" !== m(M = f(r)).position && "absolute" === c && (I = "scrollHeight",
            O = "scrollWidth"),
            (a === C || (a === A || a === D) && s === P) && (k = E,
            y -= (h && M === L && L.visualViewport ? L.visualViewport.height : M[I]) - i.height,
            y *= u ? 1 : -1),
            a !== A && (a !== C && a !== E || s !== P) || (S = D,
            v -= (h && M === L && L.visualViewport ? L.visualViewport.width : M[O]) - i.width,
            v *= u ? 1 : -1)
        }
        var N, j = Object.assign({
            position: c
        }, d && ne), z = !0 === p ? function(e) {
            var t = e.x
              , n = e.y
              , r = window.devicePixelRatio || 1;
            return {
                x: o(t * r) / r || 0,
                y: o(n * r) / r || 0
            }
        }({
            x: v,
            y: y
        }) : {
            x: v,
            y: y
        };
        return v = z.x,
        y = z.y,
        u ? Object.assign({}, j, ((N = {})[k] = T ? "0" : "",
        N[S] = x ? "0" : "",
        N.transform = (L.devicePixelRatio || 1) <= 1 ? "translate(" + v + "px, " + y + "px)" : "translate3d(" + v + "px, " + y + "px, 0)",
        N)) : Object.assign({}, j, ((n = {})[k] = T ? y + "px" : "",
        n[S] = x ? v + "px" : "",
        n.transform = "",
        n))
    }
    var ie = {
        name: "computeStyles",
        enabled: !0,
        phase: "beforeWrite",
        fn: function(e) {
            var t = e.state
              , n = e.options
              , r = n.gpuAcceleration
              , i = void 0 === r || r
              , a = n.adaptive
              , s = void 0 === a || a
              , o = n.roundOffsets
              , l = void 0 === o || o
              , c = {
                placement: $(t.placement),
                variation: q(t.placement),
                popper: t.elements.popper,
                popperRect: t.rects.popper,
                gpuAcceleration: i,
                isFixed: "fixed" === t.options.strategy
            };
            null != t.modifiersData.popperOffsets && (t.styles.popper = Object.assign({}, t.styles.popper, re(Object.assign({}, c, {
                offsets: t.modifiersData.popperOffsets,
                position: t.options.strategy,
                adaptive: s,
                roundOffsets: l
            })))),
            null != t.modifiersData.arrow && (t.styles.arrow = Object.assign({}, t.styles.arrow, re(Object.assign({}, c, {
                offsets: t.modifiersData.arrow,
                position: "absolute",
                adaptive: !1,
                roundOffsets: l
            })))),
            t.attributes.popper = Object.assign({}, t.attributes.popper, {
                "data-popper-placement": t.placement
            })
        },
        data: {}
    }
      , ae = {
        name: "applyStyles",
        enabled: !0,
        phase: "write",
        fn: function(e) {
            var t = e.state;
            Object.keys(t.elements).forEach((function(e) {
                var n = t.styles[e] || {}
                  , i = t.attributes[e] || {}
                  , a = t.elements[e];
                r(a) && p(a) && (Object.assign(a.style, n),
                Object.keys(i).forEach((function(e) {
                    var t = i[e];
                    !1 === t ? a.removeAttribute(e) : a.setAttribute(e, !0 === t ? "" : t)
                }
                )))
            }
            ))
        },
        effect: function(e) {
            var t = e.state
              , n = {
                popper: {
                    position: t.options.strategy,
                    left: "0",
                    top: "0",
                    margin: "0"
                },
                arrow: {
                    position: "absolute"
                },
                reference: {}
            };
            return Object.assign(t.elements.popper.style, n.popper),
            t.styles = n,
            t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow),
            function() {
                Object.keys(t.elements).forEach((function(e) {
                    var i = t.elements[e]
                      , a = t.attributes[e] || {}
                      , s = Object.keys(t.styles.hasOwnProperty(e) ? t.styles[e] : n[e]).reduce((function(e, t) {
                        return e[t] = "",
                        e
                    }
                    ), {});
                    r(i) && p(i) && (Object.assign(i.style, s),
                    Object.keys(a).forEach((function(e) {
                        i.removeAttribute(e)
                    }
                    )))
                }
                ))
            }
        },
        requires: ["computeStyles"]
    }
      , se = {
        name: "offset",
        enabled: !0,
        phase: "main",
        requires: ["popperOffsets"],
        fn: function(e) {
            var t = e.state
              , n = e.options
              , r = e.name
              , i = n.offset
              , a = void 0 === i ? [0, 0] : i
              , s = j.reduce((function(e, n) {
                return e[n] = function(e, t, n) {
                    var r = $(e)
                      , i = [A, C].indexOf(r) >= 0 ? -1 : 1
                      , a = "function" == typeof n ? n(Object.assign({}, t, {
                        placement: e
                    })) : n
                      , s = a[0]
                      , o = a[1];
                    return s = s || 0,
                    o = (o || 0) * i,
                    [A, D].indexOf(r) >= 0 ? {
                        x: o,
                        y: s
                    } : {
                        x: s,
                        y: o
                    }
                }(n, t.rects, a),
                e
            }
            ), {})
              , o = s[t.placement]
              , l = o.x
              , c = o.y;
            null != t.modifiersData.popperOffsets && (t.modifiersData.popperOffsets.x += l,
            t.modifiersData.popperOffsets.y += c),
            t.modifiersData[r] = s
        }
    }
      , oe = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom"
    };
    function le(e) {
        return e.replace(/left|right|bottom|top/g, (function(e) {
            return oe[e]
        }
        ))
    }
    var ce = {
        start: "end",
        end: "start"
    };
    function ue(e) {
        return e.replace(/start|end/g, (function(e) {
            return ce[e]
        }
        ))
    }
    function de(e, t) {
        void 0 === t && (t = {});
        var n = t
          , r = n.placement
          , i = n.boundary
          , a = n.rootBoundary
          , s = n.padding
          , o = n.flipVariations
          , l = n.allowedAutoPlacements
          , c = void 0 === l ? j : l
          , u = q(r)
          , d = u ? o ? N : N.filter((function(e) {
            return q(e) === u
        }
        )) : L
          , p = d.filter((function(e) {
            return c.indexOf(e) >= 0
        }
        ));
        0 === p.length && (p = d);
        var f = p.reduce((function(t, n) {
            return t[n] = U(e, {
                placement: n,
                boundary: i,
                rootBoundary: a,
                padding: s
            })[$(n)],
            t
        }
        ), {});
        return Object.keys(f).sort((function(e, t) {
            return f[e] - f[t]
        }
        ))
    }
    var pe = {
        name: "flip",
        enabled: !0,
        phase: "main",
        fn: function(e) {
            var t = e.state
              , n = e.options
              , r = e.name;
            if (!t.modifiersData[r]._skip) {
                for (var i = n.mainAxis, a = void 0 === i || i, s = n.altAxis, o = void 0 === s || s, l = n.fallbackPlacements, c = n.padding, u = n.boundary, d = n.rootBoundary, p = n.altBoundary, f = n.flipVariations, h = void 0 === f || f, m = n.allowedAutoPlacements, g = t.options.placement, v = $(g), b = l || (v !== g && h ? function(e) {
                    if ($(e) === k)
                        return [];
                    var t = le(e);
                    return [ue(e), t, ue(t)]
                }(g) : [le(g)]), y = [g].concat(b).reduce((function(e, n) {
                    return e.concat($(n) === k ? de(t, {
                        placement: n,
                        boundary: u,
                        rootBoundary: d,
                        padding: c,
                        flipVariations: h,
                        allowedAutoPlacements: m
                    }) : n)
                }
                ), []), w = t.rects.reference, x = t.rects.popper, T = new Map, S = !0, _ = y[0], L = 0; L < y.length; L++) {
                    var P = y[L]
                      , I = $(P)
                      , O = q(P) === M
                      , N = [C, E].indexOf(I) >= 0
                      , j = N ? "width" : "height"
                      , z = U(t, {
                        placement: P,
                        boundary: u,
                        rootBoundary: d,
                        altBoundary: p,
                        padding: c
                    })
                      , H = N ? O ? D : A : O ? E : C;
                    w[j] > x[j] && (H = le(H));
                    var F = le(H)
                      , R = [];
                    if (a && R.push(z[I] <= 0),
                    o && R.push(z[H] <= 0, z[F] <= 0),
                    R.every((function(e) {
                        return e
                    }
                    ))) {
                        _ = P,
                        S = !1;
                        break
                    }
                    T.set(P, R)
                }
                if (S)
                    for (var B = function(e) {
                        var t = y.find((function(t) {
                            var n = T.get(t);
                            if (n)
                                return n.slice(0, e).every((function(e) {
                                    return e
                                }
                                ))
                        }
                        ));
                        if (t)
                            return _ = t,
                            "break"
                    }, W = h ? 3 : 1; W > 0 && "break" !== B(W); W--)
                        ;
                t.placement !== _ && (t.modifiersData[r]._skip = !0,
                t.placement = _,
                t.reset = !0)
            }
        },
        requiresIfExists: ["offset"],
        data: {
            _skip: !1
        }
    };
    function fe(e, t, n) {
        return a(e, s(t, n))
    }
    var he = {
        name: "preventOverflow",
        enabled: !0,
        phase: "main",
        fn: function(e) {
            var t = e.state
              , n = e.options
              , r = e.name
              , i = n.mainAxis
              , o = void 0 === i || i
              , l = n.altAxis
              , c = void 0 !== l && l
              , u = n.boundary
              , d = n.rootBoundary
              , p = n.altBoundary
              , f = n.padding
              , h = n.tether
              , m = void 0 === h || h
              , g = n.tetherOffset
              , v = void 0 === g ? 0 : g
              , y = U(t, {
                boundary: u,
                rootBoundary: d,
                padding: f,
                altBoundary: p
            })
              , w = $(t.placement)
              , x = q(t.placement)
              , T = !x
              , S = X(w)
              , k = "x" === S ? "y" : "x"
              , L = t.modifiersData.popperOffsets
              , P = t.rects.reference
              , I = t.rects.popper
              , O = "function" == typeof v ? v(Object.assign({}, t.rects, {
                placement: t.placement
            })) : v
              , N = "number" == typeof O ? {
                mainAxis: O,
                altAxis: O
            } : Object.assign({
                mainAxis: 0,
                altAxis: 0
            }, O)
              , j = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null
              , z = {
                x: 0,
                y: 0
            };
            if (L) {
                if (o) {
                    var H, F = "y" === S ? C : A, R = "y" === S ? E : D, B = "y" === S ? "height" : "width", W = L[S], V = W + y[F], G = W - y[R], Y = m ? -I[B] / 2 : 0, K = x === M ? P[B] : I[B], J = x === M ? -I[B] : -P[B], Q = t.elements.arrow, Z = m && Q ? b(Q) : {
                        width: 0,
                        height: 0
                    }, ee = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }, te = ee[F], ne = ee[R], re = fe(0, P[B], Z[B]), ie = T ? P[B] / 2 - Y - re - te - N.mainAxis : K - re - te - N.mainAxis, ae = T ? -P[B] / 2 + Y + re + ne + N.mainAxis : J + re + ne + N.mainAxis, se = t.elements.arrow && _(t.elements.arrow), oe = se ? "y" === S ? se.clientTop || 0 : se.clientLeft || 0 : 0, le = null != (H = null == j ? void 0 : j[S]) ? H : 0, ce = W + ae - le, ue = fe(m ? s(V, W + ie - le - oe) : V, W, m ? a(G, ce) : G);
                    L[S] = ue,
                    z[S] = ue - W
                }
                if (c) {
                    var de, pe = "x" === S ? C : A, he = "x" === S ? E : D, me = L[k], ge = "y" === k ? "height" : "width", ve = me + y[pe], be = me - y[he], ye = -1 !== [C, A].indexOf(w), we = null != (de = null == j ? void 0 : j[k]) ? de : 0, xe = ye ? ve : me - P[ge] - I[ge] - we + N.altAxis, Te = ye ? me + P[ge] + I[ge] - we - N.altAxis : be, Se = m && ye ? function(e, t, n) {
                        var r = fe(e, t, n);
                        return r > n ? n : r
                    }(xe, me, Te) : fe(m ? xe : ve, me, m ? Te : be);
                    L[k] = Se,
                    z[k] = Se - me
                }
                t.modifiersData[r] = z
            }
        },
        requiresIfExists: ["offset"]
    }
      , me = {
        name: "arrow",
        enabled: !0,
        phase: "main",
        fn: function(e) {
            var t, n = e.state, r = e.name, i = e.options, a = n.elements.arrow, s = n.modifiersData.popperOffsets, o = $(n.placement), l = X(o), c = [A, D].indexOf(o) >= 0 ? "height" : "width";
            if (a && s) {
                var u = function(e, t) {
                    return G("number" != typeof (e = "function" == typeof e ? e(Object.assign({}, t.rects, {
                        placement: t.placement
                    })) : e) ? e : Y(e, L))
                }(i.padding, n)
                  , d = b(a)
                  , p = "y" === l ? C : A
                  , f = "y" === l ? E : D
                  , h = n.rects.reference[c] + n.rects.reference[l] - s[l] - n.rects.popper[c]
                  , m = s[l] - n.rects.reference[l]
                  , g = _(a)
                  , v = g ? "y" === l ? g.clientHeight || 0 : g.clientWidth || 0 : 0
                  , y = h / 2 - m / 2
                  , w = u[p]
                  , x = v - d[c] - u[f]
                  , T = v / 2 - d[c] / 2 + y
                  , S = fe(w, T, x)
                  , k = l;
                n.modifiersData[r] = ((t = {})[k] = S,
                t.centerOffset = S - T,
                t)
            }
        },
        effect: function(e) {
            var t = e.state
              , n = e.options.element
              , r = void 0 === n ? "[data-popper-arrow]" : n;
            null != r && ("string" != typeof r || (r = t.elements.popper.querySelector(r))) && F(t.elements.popper, r) && (t.elements.arrow = r)
        },
        requires: ["popperOffsets"],
        requiresIfExists: ["preventOverflow"]
    };
    function ge(e, t, n) {
        return void 0 === n && (n = {
            x: 0,
            y: 0
        }),
        {
            top: e.top - t.height - n.y,
            right: e.right - t.width + n.x,
            bottom: e.bottom - t.height + n.y,
            left: e.left - t.width - n.x
        }
    }
    function ve(e) {
        return [C, D, E, A].some((function(t) {
            return e[t] >= 0
        }
        ))
    }
    var be = {
        name: "hide",
        enabled: !0,
        phase: "main",
        requiresIfExists: ["preventOverflow"],
        fn: function(e) {
            var t = e.state
              , n = e.name
              , r = t.rects.reference
              , i = t.rects.popper
              , a = t.modifiersData.preventOverflow
              , s = U(t, {
                elementContext: "reference"
            })
              , o = U(t, {
                altBoundary: !0
            })
              , l = ge(s, r)
              , c = ge(o, i, a)
              , u = ve(l)
              , d = ve(c);
            t.modifiersData[n] = {
                referenceClippingOffsets: l,
                popperEscapeOffsets: c,
                isReferenceHidden: u,
                hasPopperEscaped: d
            },
            t.attributes.popper = Object.assign({}, t.attributes.popper, {
                "data-popper-reference-hidden": u,
                "data-popper-escaped": d
            })
        }
    }
      , ye = Q({
        defaultModifiers: [ee, te, ie, ae]
    })
      , we = [ee, te, ie, ae, se, pe, he, me, be]
      , xe = Q({
        defaultModifiers: we
    });
    e.applyStyles = ae,
    e.arrow = me,
    e.computeStyles = ie,
    e.createPopper = xe,
    e.createPopperLite = ye,
    e.defaultModifiers = we,
    e.detectOverflow = U,
    e.eventListeners = ee,
    e.flip = pe,
    e.hide = be,
    e.offset = se,
    e.popperGenerator = Q,
    e.popperOffsets = te,
    e.preventOverflow = he,
    Object.defineProperty(e, "__esModule", {
        value: !0
    })
}
)),
function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("@popperjs/core")) : "function" == typeof define && define.amd ? define(["@popperjs/core"], t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).bootstrap = t(e.Popper)
}(this, (function(e) {
    "use strict";
    const t = function(e) {
        if (e && e.__esModule)
            return e;
        const t = Object.create(null, {
            [Symbol.toStringTag]: {
                value: "Module"
            }
        });
        if (e)
            for (const n in e)
                if ("default" !== n) {
                    const r = Object.getOwnPropertyDescriptor(e, n);
                    Object.defineProperty(t, n, r.get ? r : {
                        enumerable: !0,
                        get: () => e[n]
                    })
                }
        return t.default = e,
        Object.freeze(t)
    }(e)
      , n = "transitionend"
      , r = e => {
        let t = e.getAttribute("data-bs-target");
        if (!t || "#" === t) {
            let n = e.getAttribute("href");
            if (!n || !n.includes("#") && !n.startsWith("."))
                return null;
            n.includes("#") && !n.startsWith("#") && (n = `#${n.split("#")[1]}`),
            t = n && "#" !== n ? n.trim() : null
        }
        return t
    }
      , i = e => {
        const t = r(e);
        return t && document.querySelector(t) ? t : null
    }
      , a = e => {
        const t = r(e);
        return t ? document.querySelector(t) : null
    }
      , s = e => {
        e.dispatchEvent(new Event(n))
    }
      , o = e => !(!e || "object" != typeof e) && (void 0 !== e.jquery && (e = e[0]),
    void 0 !== e.nodeType)
      , l = e => o(e) ? e.jquery ? e[0] : e : "string" == typeof e && e.length > 0 ? document.querySelector(e) : null
      , c = e => {
        if (!o(e) || 0 === e.getClientRects().length)
            return !1;
        const t = "visible" === getComputedStyle(e).getPropertyValue("visibility")
          , n = e.closest("details:not([open])");
        if (!n)
            return t;
        if (n !== e) {
            const t = e.closest("summary");
            if (t && t.parentNode !== n)
                return !1;
            if (null === t)
                return !1
        }
        return t
    }
      , u = e => !e || e.nodeType !== Node.ELEMENT_NODE || !!e.classList.contains("disabled") || (void 0 !== e.disabled ? e.disabled : e.hasAttribute("disabled") && "false" !== e.getAttribute("disabled"))
      , d = e => {
        if (!document.documentElement.attachShadow)
            return null;
        if ("function" == typeof e.getRootNode) {
            const t = e.getRootNode();
            return t instanceof ShadowRoot ? t : null
        }
        return e instanceof ShadowRoot ? e : e.parentNode ? d(e.parentNode) : null
    }
      , p = () => {}
      , f = e => {
        e.offsetHeight
    }
      , h = () => window.jQuery && !document.body.hasAttribute("data-bs-no-jquery") ? window.jQuery : null
      , m = []
      , g = () => "rtl" === document.documentElement.dir
      , v = e => {
        var t;
        t = () => {
            const t = h();
            if (t) {
                const n = e.NAME
                  , r = t.fn[n];
                t.fn[n] = e.jQueryInterface,
                t.fn[n].Constructor = e,
                t.fn[n].noConflict = () => (t.fn[n] = r,
                e.jQueryInterface)
            }
        }
        ,
        "loading" === document.readyState ? (m.length || document.addEventListener("DOMContentLoaded", ( () => {
            for (const e of m)
                e()
        }
        )),
        m.push(t)) : t()
    }
      , b = e => {
        "function" == typeof e && e()
    }
      , y = (e, t, r=!0) => {
        if (!r)
            return void b(e);
        const i = (e => {
            if (!e)
                return 0;
            let {transitionDuration: t, transitionDelay: n} = window.getComputedStyle(e);
            const r = Number.parseFloat(t)
              , i = Number.parseFloat(n);
            return r || i ? (t = t.split(",")[0],
            n = n.split(",")[0],
            1e3 * (Number.parseFloat(t) + Number.parseFloat(n))) : 0
        }
        )(t) + 5;
        let a = !1;
        const o = ({target: r}) => {
            r === t && (a = !0,
            t.removeEventListener(n, o),
            b(e))
        }
        ;
        t.addEventListener(n, o),
        setTimeout(( () => {
            a || s(t)
        }
        ), i)
    }
      , w = (e, t, n, r) => {
        const i = e.length;
        let a = e.indexOf(t);
        return -1 === a ? !n && r ? e[i - 1] : e[0] : (a += n ? 1 : -1,
        r && (a = (a + i) % i),
        e[Math.max(0, Math.min(a, i - 1))])
    }
      , x = /[^.]*(?=\..*)\.|.*/
      , T = /\..*/
      , S = /::\d+$/
      , _ = {};
    let C = 1;
    const E = {
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }
      , D = new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
    function A(e, t) {
        return t && `${t}::${C++}` || e.uidEvent || C++
    }
    function k(e) {
        const t = A(e);
        return e.uidEvent = t,
        _[t] = _[t] || {},
        _[t]
    }
    function L(e, t, n=null) {
        return Object.values(e).find((e => e.callable === t && e.delegationSelector === n))
    }
    function M(e, t, n) {
        const r = "string" == typeof t
          , i = r ? n : t || n;
        let a = N(e);
        return D.has(a) || (a = e),
        [r, i, a]
    }
    function P(e, t, n, r, i) {
        if ("string" != typeof t || !e)
            return;
        let[a,s,o] = M(t, n, r);
        if (t in E) {
            const e = e => function(t) {
                if (!t.relatedTarget || t.relatedTarget !== t.delegateTarget && !t.delegateTarget.contains(t.relatedTarget))
                    return e.call(this, t)
            }
            ;
            s = e(s)
        }
        const l = k(e)
          , c = l[o] || (l[o] = {})
          , u = L(c, s, a ? n : null);
        if (u)
            return void (u.oneOff = u.oneOff && i);
        const d = A(s, t.replace(x, ""))
          , p = a ? function(e, t, n) {
            return function r(i) {
                const a = e.querySelectorAll(t);
                for (let {target: s} = i; s && s !== this; s = s.parentNode)
                    for (const o of a)
                        if (o === s)
                            return z(i, {
                                delegateTarget: s
                            }),
                            r.oneOff && j.off(e, i.type, t, n),
                            n.apply(s, [i])
            }
        }(e, n, s) : function(e, t) {
            return function n(r) {
                return z(r, {
                    delegateTarget: e
                }),
                n.oneOff && j.off(e, r.type, t),
                t.apply(e, [r])
            }
        }(e, s);
        p.delegationSelector = a ? n : null,
        p.callable = s,
        p.oneOff = i,
        p.uidEvent = d,
        c[d] = p,
        e.addEventListener(o, p, a)
    }
    function I(e, t, n, r, i) {
        const a = L(t[n], r, i);
        a && (e.removeEventListener(n, a, Boolean(i)),
        delete t[n][a.uidEvent])
    }
    function O(e, t, n, r) {
        const i = t[n] || {};
        for (const a of Object.keys(i))
            if (a.includes(r)) {
                const r = i[a];
                I(e, t, n, r.callable, r.delegationSelector)
            }
    }
    function N(e) {
        return e = e.replace(T, ""),
        E[e] || e
    }
    const j = {
        on(e, t, n, r) {
            P(e, t, n, r, !1)
        },
        one(e, t, n, r) {
            P(e, t, n, r, !0)
        },
        off(e, t, n, r) {
            if ("string" != typeof t || !e)
                return;
            const [i,a,s] = M(t, n, r)
              , o = s !== t
              , l = k(e)
              , c = l[s] || {}
              , u = t.startsWith(".");
            if (void 0 === a) {
                if (u)
                    for (const n of Object.keys(l))
                        O(e, l, n, t.slice(1));
                for (const n of Object.keys(c)) {
                    const r = n.replace(S, "");
                    if (!o || t.includes(r)) {
                        const t = c[n];
                        I(e, l, s, t.callable, t.delegationSelector)
                    }
                }
            } else {
                if (!Object.keys(c).length)
                    return;
                I(e, l, s, a, i ? n : null)
            }
        },
        trigger(e, t, n) {
            if ("string" != typeof t || !e)
                return null;
            const r = h();
            let i = null
              , a = !0
              , s = !0
              , o = !1;
            t !== N(t) && r && (i = r.Event(t, n),
            r(e).trigger(i),
            a = !i.isPropagationStopped(),
            s = !i.isImmediatePropagationStopped(),
            o = i.isDefaultPrevented());
            let l = new Event(t,{
                bubbles: a,
                cancelable: !0
            });
            return l = z(l, n),
            o && l.preventDefault(),
            s && e.dispatchEvent(l),
            l.defaultPrevented && i && i.preventDefault(),
            l
        }
    };
    function z(e, t) {
        for (const [n,r] of Object.entries(t || {}))
            try {
                e[n] = r
            } catch (t) {
                Object.defineProperty(e, n, {
                    configurable: !0,
                    get: () => r
                })
            }
        return e
    }
    const H = new Map
      , $ = {
        set(e, t, n) {
            H.has(e) || H.set(e, new Map);
            const r = H.get(e);
            r.has(t) || 0 === r.size ? r.set(t, n) : console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(r.keys())[0]}.`)
        },
        get: (e, t) => H.has(e) && H.get(e).get(t) || null,
        remove(e, t) {
            if (!H.has(e))
                return;
            const n = H.get(e);
            n.delete(t),
            0 === n.size && H.delete(e)
        }
    };
    function F(e) {
        if ("true" === e)
            return !0;
        if ("false" === e)
            return !1;
        if (e === Number(e).toString())
            return Number(e);
        if ("" === e || "null" === e)
            return null;
        if ("string" != typeof e)
            return e;
        try {
            return JSON.parse(decodeURIComponent(e))
        } catch (t) {
            return e
        }
    }
    function R(e) {
        return e.replace(/[A-Z]/g, (e => `-${e.toLowerCase()}`))
    }
    const B = {
        setDataAttribute(e, t, n) {
            e.setAttribute(`data-bs-${R(t)}`, n)
        },
        removeDataAttribute(e, t) {
            e.removeAttribute(`data-bs-${R(t)}`)
        },
        getDataAttributes(e) {
            if (!e)
                return {};
            const t = {}
              , n = Object.keys(e.dataset).filter((e => e.startsWith("bs") && !e.startsWith("bsConfig")));
            for (const r of n) {
                let n = r.replace(/^bs/, "");
                n = n.charAt(0).toLowerCase() + n.slice(1, n.length),
                t[n] = F(e.dataset[r])
            }
            return t
        },
        getDataAttribute: (e, t) => F(e.getAttribute(`data-bs-${R(t)}`))
    };
    class W {
        static get Default() {
            return {}
        }
        static get DefaultType() {
            return {}
        }
        static get NAME() {
            throw new Error('You have to implement the static method "NAME", for each component!')
        }
        _getConfig(e) {
            return e = this._mergeConfigObj(e),
            e = this._configAfterMerge(e),
            this._typeCheckConfig(e),
            e
        }
        _configAfterMerge(e) {
            return e
        }
        _mergeConfigObj(e, t) {
            const n = o(t) ? B.getDataAttribute(t, "config") : {};
            return {
                ...this.constructor.Default,
                ..."object" == typeof n ? n : {},
                ...o(t) ? B.getDataAttributes(t) : {},
                ..."object" == typeof e ? e : {}
            }
        }
        _typeCheckConfig(e, t=this.constructor.DefaultType) {
            for (const r of Object.keys(t)) {
                const i = t[r]
                  , a = e[r]
                  , s = o(a) ? "element" : null == (n = a) ? `${n}` : Object.prototype.toString.call(n).match(/\s([a-z]+)/i)[1].toLowerCase();
                if (!new RegExp(i).test(s))
                    throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${r}" provided type "${s}" but expected type "${i}".`)
            }
            var n
        }
    }
    class q extends W {
        constructor(e, t) {
            super(),
            (e = l(e)) && (this._element = e,
            this._config = this._getConfig(t),
            $.set(this._element, this.constructor.DATA_KEY, this))
        }
        dispose() {
            $.remove(this._element, this.constructor.DATA_KEY),
            j.off(this._element, this.constructor.EVENT_KEY);
            for (const e of Object.getOwnPropertyNames(this))
                this[e] = null
        }
        _queueCallback(e, t, n=!0) {
            y(e, t, n)
        }
        _getConfig(e) {
            return e = this._mergeConfigObj(e, this._element),
            e = this._configAfterMerge(e),
            this._typeCheckConfig(e),
            e
        }
        static getInstance(e) {
            return $.get(l(e), this.DATA_KEY)
        }
        static getOrCreateInstance(e, t={}) {
            return this.getInstance(e) || new this(e,"object" == typeof t ? t : null)
        }
        static get VERSION() {
            return "5.2.3"
        }
        static get DATA_KEY() {
            return `bs.${this.NAME}`
        }
        static get EVENT_KEY() {
            return `.${this.DATA_KEY}`
        }
        static eventName(e) {
            return `${e}${this.EVENT_KEY}`
        }
    }
    const X = (e, t="hide") => {
        const n = `click.dismiss${e.EVENT_KEY}`
          , r = e.NAME;
        j.on(document, n, `[data-bs-dismiss="${r}"]`, (function(n) {
            if (["A", "AREA"].includes(this.tagName) && n.preventDefault(),
            u(this))
                return;
            const i = a(this) || this.closest(`.${r}`);
            e.getOrCreateInstance(i)[t]()
        }
        ))
    }
    ;
    class V extends q {
        static get NAME() {
            return "alert"
        }
        close() {
            if (j.trigger(this._element, "close.bs.alert").defaultPrevented)
                return;
            this._element.classList.remove("show");
            const e = this._element.classList.contains("fade");
            this._queueCallback(( () => this._destroyElement()), this._element, e)
        }
        _destroyElement() {
            this._element.remove(),
            j.trigger(this._element, "closed.bs.alert"),
            this.dispose()
        }
        static jQueryInterface(e) {
            return this.each((function() {
                const t = V.getOrCreateInstance(this);
                if ("string" == typeof e) {
                    if (void 0 === t[e] || e.startsWith("_") || "constructor" === e)
                        throw new TypeError(`No method named "${e}"`);
                    t[e](this)
                }
            }
            ))
        }
    }
    X(V, "close"),
    v(V);
    const G = '[data-bs-toggle="button"]';
    class Y extends q {
        static get NAME() {
            return "button"
        }
        toggle() {
            this._element.setAttribute("aria-pressed", this._element.classList.toggle("active"))
        }
        static jQueryInterface(e) {
            return this.each((function() {
                const t = Y.getOrCreateInstance(this);
                "toggle" === e && t[e]()
            }
            ))
        }
    }
    j.on(document, "click.bs.button.data-api", G, (e => {
        e.preventDefault();
        const t = e.target.closest(G);
        Y.getOrCreateInstance(t).toggle()
    }
    )),
    v(Y);
    const U = {
        find: (e, t=document.documentElement) => [].concat(...Element.prototype.querySelectorAll.call(t, e)),
        findOne: (e, t=document.documentElement) => Element.prototype.querySelector.call(t, e),
        children: (e, t) => [].concat(...e.children).filter((e => e.matches(t))),
        parents(e, t) {
            const n = [];
            let r = e.parentNode.closest(t);
            for (; r; )
                n.push(r),
                r = r.parentNode.closest(t);
            return n
        },
        prev(e, t) {
            let n = e.previousElementSibling;
            for (; n; ) {
                if (n.matches(t))
                    return [n];
                n = n.previousElementSibling
            }
            return []
        },
        next(e, t) {
            let n = e.nextElementSibling;
            for (; n; ) {
                if (n.matches(t))
                    return [n];
                n = n.nextElementSibling
            }
            return []
        },
        focusableChildren(e) {
            const t = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map((e => `${e}:not([tabindex^="-"])`)).join(",");
            return this.find(t, e).filter((e => !u(e) && c(e)))
        }
    }
      , K = {
        endCallback: null,
        leftCallback: null,
        rightCallback: null
    }
      , J = {
        endCallback: "(function|null)",
        leftCallback: "(function|null)",
        rightCallback: "(function|null)"
    };
    class Q extends W {
        constructor(e, t) {
            super(),
            this._element = e,
            e && Q.isSupported() && (this._config = this._getConfig(t),
            this._deltaX = 0,
            this._supportPointerEvents = Boolean(window.PointerEvent),
            this._initEvents())
        }
        static get Default() {
            return K
        }
        static get DefaultType() {
            return J
        }
        static get NAME() {
            return "swipe"
        }
        dispose() {
            j.off(this._element, ".bs.swipe")
        }
        _start(e) {
            this._supportPointerEvents ? this._eventIsPointerPenTouch(e) && (this._deltaX = e.clientX) : this._deltaX = e.touches[0].clientX
        }
        _end(e) {
            this._eventIsPointerPenTouch(e) && (this._deltaX = e.clientX - this._deltaX),
            this._handleSwipe(),
            b(this._config.endCallback)
        }
        _move(e) {
            this._deltaX = e.touches && e.touches.length > 1 ? 0 : e.touches[0].clientX - this._deltaX
        }
        _handleSwipe() {
            const e = Math.abs(this._deltaX);
            if (e <= 40)
                return;
            const t = e / this._deltaX;
            this._deltaX = 0,
            t && b(t > 0 ? this._config.rightCallback : this._config.leftCallback)
        }
        _initEvents() {
            this._supportPointerEvents ? (j.on(this._element, "pointerdown.bs.swipe", (e => this._start(e))),
            j.on(this._element, "pointerup.bs.swipe", (e => this._end(e))),
            this._element.classList.add("pointer-event")) : (j.on(this._element, "touchstart.bs.swipe", (e => this._start(e))),
            j.on(this._element, "touchmove.bs.swipe", (e => this._move(e))),
            j.on(this._element, "touchend.bs.swipe", (e => this._end(e))))
        }
        _eventIsPointerPenTouch(e) {
            return this._supportPointerEvents && ("pen" === e.pointerType || "touch" === e.pointerType)
        }
        static isSupported() {
            return "ontouchstart"in document.documentElement || navigator.maxTouchPoints > 0
        }
    }
    const Z = "next"
      , ee = "prev"
      , te = "left"
      , ne = "right"
      , re = "slid.bs.carousel"
      , ie = "carousel"
      , ae = "active"
      , se = {
        ArrowLeft: ne,
        ArrowRight: te
    }
      , oe = {
        interval: 5e3,
        keyboard: !0,
        pause: "hover",
        ride: !1,
        touch: !0,
        wrap: !0
    }
      , le = {
        interval: "(number|boolean)",
        keyboard: "boolean",
        pause: "(string|boolean)",
        ride: "(boolean|string)",
        touch: "boolean",
        wrap: "boolean"
    };
    class ce extends q {
        constructor(e, t) {
            super(e, t),
            this._interval = null,
            this._activeElement = null,
            this._isSliding = !1,
            this.touchTimeout = null,
            this._swipeHelper = null,
            this._indicatorsElement = U.findOne(".carousel-indicators", this._element),
            this._addEventListeners(),
            this._config.ride === ie && this.cycle()
        }
        static get Default() {
            return oe
        }
        static get DefaultType() {
            return le
        }
        static get NAME() {
            return "carousel"
        }
        next() {
            this._slide(Z)
        }
        nextWhenVisible() {
            !document.hidden && c(this._element) && this.next()
        }
        prev() {
            this._slide(ee)
        }
        pause() {
            this._isSliding && s(this._element),
            this._clearInterval()
        }
        cycle() {
            this._clearInterval(),
            this._updateInterval(),
            this._interval = setInterval(( () => this.nextWhenVisible()), this._config.interval)
        }
        _maybeEnableCycle() {
            this._config.ride && (this._isSliding ? j.one(this._element, re, ( () => this.cycle())) : this.cycle())
        }
        to(e) {
            const t = this._getItems();
            if (e > t.length - 1 || e < 0)
                return;
            if (this._isSliding)
                return void j.one(this._element, re, ( () => this.to(e)));
            const n = this._getItemIndex(this._getActive());
            if (n === e)
                return;
            const r = e > n ? Z : ee;
            this._slide(r, t[e])
        }
        dispose() {
            this._swipeHelper && this._swipeHelper.dispose(),
            super.dispose()
        }
        _configAfterMerge(e) {
            return e.defaultInterval = e.interval,
            e
        }
        _addEventListeners() {
            this._config.keyboard && j.on(this._element, "keydown.bs.carousel", (e => this._keydown(e))),
            "hover" === this._config.pause && (j.on(this._element, "mouseenter.bs.carousel", ( () => this.pause())),
            j.on(this._element, "mouseleave.bs.carousel", ( () => this._maybeEnableCycle()))),
            this._config.touch && Q.isSupported() && this._addTouchEventListeners()
        }
        _addTouchEventListeners() {
            for (const e of U.find(".carousel-item img", this._element))
                j.on(e, "dragstart.bs.carousel", (e => e.preventDefault()));
            const e = {
                leftCallback: () => this._slide(this._directionToOrder(te)),
                rightCallback: () => this._slide(this._directionToOrder(ne)),
                endCallback: () => {
                    "hover" === this._config.pause && (this.pause(),
                    this.touchTimeout && clearTimeout(this.touchTimeout),
                    this.touchTimeout = setTimeout(( () => this._maybeEnableCycle()), 500 + this._config.interval))
                }
            };
            this._swipeHelper = new Q(this._element,e)
        }
        _keydown(e) {
            if (/input|textarea/i.test(e.target.tagName))
                return;
            const t = se[e.key];
            t && (e.preventDefault(),
            this._slide(this._directionToOrder(t)))
        }
        _getItemIndex(e) {
            return this._getItems().indexOf(e)
        }
        _setActiveIndicatorElement(e) {
            if (!this._indicatorsElement)
                return;
            const t = U.findOne(".active", this._indicatorsElement);
            t.classList.remove(ae),
            t.removeAttribute("aria-current");
            const n = U.findOne(`[data-bs-slide-to="${e}"]`, this._indicatorsElement);
            n && (n.classList.add(ae),
            n.setAttribute("aria-current", "true"))
        }
        _updateInterval() {
            const e = this._activeElement || this._getActive();
            if (!e)
                return;
            const t = Number.parseInt(e.getAttribute("data-bs-interval"), 10);
            this._config.interval = t || this._config.defaultInterval
        }
        _slide(e, t=null) {
            if (this._isSliding)
                return;
            const n = this._getActive()
              , r = e === Z
              , i = t || w(this._getItems(), n, r, this._config.wrap);
            if (i === n)
                return;
            const a = this._getItemIndex(i)
              , s = t => j.trigger(this._element, t, {
                relatedTarget: i,
                direction: this._orderToDirection(e),
                from: this._getItemIndex(n),
                to: a
            });
            if (s("slide.bs.carousel").defaultPrevented)
                return;
            if (!n || !i)
                return;
            const o = Boolean(this._interval);
            this.pause(),
            this._isSliding = !0,
            this._setActiveIndicatorElement(a),
            this._activeElement = i;
            const l = r ? "carousel-item-start" : "carousel-item-end"
              , c = r ? "carousel-item-next" : "carousel-item-prev";
            i.classList.add(c),
            f(i),
            n.classList.add(l),
            i.classList.add(l),
            this._queueCallback(( () => {
                i.classList.remove(l, c),
                i.classList.add(ae),
                n.classList.remove(ae, c, l),
                this._isSliding = !1,
                s(re)
            }
            ), n, this._isAnimated()),
            o && this.cycle()
        }
        _isAnimated() {
            return this._element.classList.contains("slide")
        }
        _getActive() {
            return U.findOne(".active.carousel-item", this._element)
        }
        _getItems() {
            return U.find(".carousel-item", this._element)
        }
        _clearInterval() {
            this._interval && (clearInterval(this._interval),
            this._interval = null)
        }
        _directionToOrder(e) {
            return g() ? e === te ? ee : Z : e === te ? Z : ee
        }
        _orderToDirection(e) {
            return g() ? e === ee ? te : ne : e === ee ? ne : te
        }
        static jQueryInterface(e) {
            return this.each((function() {
                const t = ce.getOrCreateInstance(this, e);
                if ("number" != typeof e) {
                    if ("string" == typeof e) {
                        if (void 0 === t[e] || e.startsWith("_") || "constructor" === e)
                            throw new TypeError(`No method named "${e}"`);
                        t[e]()
                    }
                } else
                    t.to(e)
            }
            ))
        }
    }
    j.on(document, "click.bs.carousel.data-api", "[data-bs-slide], [data-bs-slide-to]", (function(e) {
        const t = a(this);
        if (!t || !t.classList.contains(ie))
            return;
        e.preventDefault();
        const n = ce.getOrCreateInstance(t)
          , r = this.getAttribute("data-bs-slide-to");
        return r ? (n.to(r),
        void n._maybeEnableCycle()) : "next" === B.getDataAttribute(this, "slide") ? (n.next(),
        void n._maybeEnableCycle()) : (n.prev(),
        void n._maybeEnableCycle())
    }
    )),
    j.on(window, "load.bs.carousel.data-api", ( () => {
        const e = U.find('[data-bs-ride="carousel"]');
        for (const t of e)
            ce.getOrCreateInstance(t)
    }
    )),
    v(ce);
    const ue = "show"
      , de = "collapse"
      , pe = "collapsing"
      , fe = '[data-bs-toggle="collapse"]'
      , he = {
        parent: null,
        toggle: !0
    }
      , me = {
        parent: "(null|element)",
        toggle: "boolean"
    };
    class ge extends q {
        constructor(e, t) {
            super(e, t),
            this._isTransitioning = !1,
            this._triggerArray = [];
            const n = U.find(fe);
            for (const e of n) {
                const t = i(e)
                  , n = U.find(t).filter((e => e === this._element));
                null !== t && n.length && this._triggerArray.push(e)
            }
            this._initializeChildren(),
            this._config.parent || this._addAriaAndCollapsedClass(this._triggerArray, this._isShown()),
            this._config.toggle && this.toggle()
        }
        static get Default() {
            return he
        }
        static get DefaultType() {
            return me
        }
        static get NAME() {
            return "collapse"
        }
        toggle() {
            this._isShown() ? this.hide() : this.show()
        }
        show() {
            if (this._isTransitioning || this._isShown())
                return;
            let e = [];
            if (this._config.parent && (e = this._getFirstLevelChildren(".collapse.show, .collapse.collapsing").filter((e => e !== this._element)).map((e => ge.getOrCreateInstance(e, {
                toggle: !1
            })))),
            e.length && e[0]._isTransitioning)
                return;
            if (j.trigger(this._element, "show.bs.collapse").defaultPrevented)
                return;
            for (const t of e)
                t.hide();
            const t = this._getDimension();
            this._element.classList.remove(de),
            this._element.classList.add(pe),
            this._element.style[t] = 0,
            this._addAriaAndCollapsedClass(this._triggerArray, !0),
            this._isTransitioning = !0;
            const n = `scroll${t[0].toUpperCase() + t.slice(1)}`;
            this._queueCallback(( () => {
                this._isTransitioning = !1,
                this._element.classList.remove(pe),
                this._element.classList.add(de, ue),
                this._element.style[t] = "",
                j.trigger(this._element, "shown.bs.collapse")
            }
            ), this._element, !0),
            this._element.style[t] = `${this._element[n]}px`
        }
        hide() {
            if (this._isTransitioning || !this._isShown())
                return;
            if (j.trigger(this._element, "hide.bs.collapse").defaultPrevented)
                return;
            const e = this._getDimension();
            this._element.style[e] = `${this._element.getBoundingClientRect()[e]}px`,
            f(this._element),
            this._element.classList.add(pe),
            this._element.classList.remove(de, ue);
            for (const e of this._triggerArray) {
                const t = a(e);
                t && !this._isShown(t) && this._addAriaAndCollapsedClass([e], !1)
            }
            this._isTransitioning = !0,
            this._element.style[e] = "",
            this._queueCallback(( () => {
                this._isTransitioning = !1,
                this._element.classList.remove(pe),
                this._element.classList.add(de),
                j.trigger(this._element, "hidden.bs.collapse")
            }
            ), this._element, !0)
        }
        _isShown(e=this._element) {
            return e.classList.contains(ue)
        }
        _configAfterMerge(e) {
            return e.toggle = Boolean(e.toggle),
            e.parent = l(e.parent),
            e
        }
        _getDimension() {
            return this._element.classList.contains("collapse-horizontal") ? "width" : "height"
        }
        _initializeChildren() {
            if (!this._config.parent)
                return;
            const e = this._getFirstLevelChildren(fe);
            for (const t of e) {
                const e = a(t);
                e && this._addAriaAndCollapsedClass([t], this._isShown(e))
            }
        }
        _getFirstLevelChildren(e) {
            const t = U.find(":scope .collapse .collapse", this._config.parent);
            return U.find(e, this._config.parent).filter((e => !t.includes(e)))
        }
        _addAriaAndCollapsedClass(e, t) {
            if (e.length)
                for (const n of e)
                    n.classList.toggle("collapsed", !t),
                    n.setAttribute("aria-expanded", t)
        }
        static jQueryInterface(e) {
            const t = {};
            return "string" == typeof e && /show|hide/.test(e) && (t.toggle = !1),
            this.each((function() {
                const n = ge.getOrCreateInstance(this, t);
                if ("string" == typeof e) {
                    if (void 0 === n[e])
                        throw new TypeError(`No method named "${e}"`);
                    n[e]()
                }
            }
            ))
        }
    }
    j.on(document, "click.bs.collapse.data-api", fe, (function(e) {
        ("A" === e.target.tagName || e.delegateTarget && "A" === e.delegateTarget.tagName) && e.preventDefault();
        const t = i(this)
          , n = U.find(t);
        for (const e of n)
            ge.getOrCreateInstance(e, {
                toggle: !1
            }).toggle()
    }
    )),
    v(ge);
    const ve = "dropdown"
      , be = "ArrowUp"
      , ye = "ArrowDown"
      , we = "click.bs.dropdown.data-api"
      , xe = "keydown.bs.dropdown.data-api"
      , Te = "show"
      , Se = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)'
      , _e = `${Se}.show`
      , Ce = ".dropdown-menu"
      , Ee = g() ? "top-end" : "top-start"
      , De = g() ? "top-start" : "top-end"
      , Ae = g() ? "bottom-end" : "bottom-start"
      , ke = g() ? "bottom-start" : "bottom-end"
      , Le = g() ? "left-start" : "right-start"
      , Me = g() ? "right-start" : "left-start"
      , Pe = {
        autoClose: !0,
        boundary: "clippingParents",
        display: "dynamic",
        offset: [0, 2],
        popperConfig: null,
        reference: "toggle"
    }
      , Ie = {
        autoClose: "(boolean|string)",
        boundary: "(string|element)",
        display: "string",
        offset: "(array|string|function)",
        popperConfig: "(null|object|function)",
        reference: "(string|element|object)"
    };
    class Oe extends q {
        constructor(e, t) {
            super(e, t),
            this._popper = null,
            this._parent = this._element.parentNode,
            this._menu = U.next(this._element, Ce)[0] || U.prev(this._element, Ce)[0] || U.findOne(Ce, this._parent),
            this._inNavbar = this._detectNavbar()
        }
        static get Default() {
            return Pe
        }
        static get DefaultType() {
            return Ie
        }
        static get NAME() {
            return ve
        }
        toggle() {
            return this._isShown() ? this.hide() : this.show()
        }
        show() {
            if (u(this._element) || this._isShown())
                return;
            const e = {
                relatedTarget: this._element
            };
            if (!j.trigger(this._element, "show.bs.dropdown", e).defaultPrevented) {
                if (this._createPopper(),
                "ontouchstart"in document.documentElement && !this._parent.closest(".navbar-nav"))
                    for (const e of [].concat(...document.body.children))
                        j.on(e, "mouseover", p);
                this._element.focus(),
                this._element.setAttribute("aria-expanded", !0),
                this._menu.classList.add(Te),
                this._element.classList.add(Te),
                j.trigger(this._element, "shown.bs.dropdown", e)
            }
        }
        hide() {
            if (u(this._element) || !this._isShown())
                return;
            const e = {
                relatedTarget: this._element
            };
            this._completeHide(e)
        }
        dispose() {
            this._popper && this._popper.destroy(),
            super.dispose()
        }
        update() {
            this._inNavbar = this._detectNavbar(),
            this._popper && this._popper.update()
        }
        _completeHide(e) {
            if (!j.trigger(this._element, "hide.bs.dropdown", e).defaultPrevented) {
                if ("ontouchstart"in document.documentElement)
                    for (const e of [].concat(...document.body.children))
                        j.off(e, "mouseover", p);
                this._popper && this._popper.destroy(),
                this._menu.classList.remove(Te),
                this._element.classList.remove(Te),
                this._element.setAttribute("aria-expanded", "false"),
                B.removeDataAttribute(this._menu, "popper"),
                j.trigger(this._element, "hidden.bs.dropdown", e)
            }
        }
        _getConfig(e) {
            if ("object" == typeof (e = super._getConfig(e)).reference && !o(e.reference) && "function" != typeof e.reference.getBoundingClientRect)
                throw new TypeError(`${ve.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
            return e
        }
        _createPopper() {
            if (void 0 === t)
                throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
            let e = this._element;
            "parent" === this._config.reference ? e = this._parent : o(this._config.reference) ? e = l(this._config.reference) : "object" == typeof this._config.reference && (e = this._config.reference);
            const n = this._getPopperConfig();
            this._popper = t.createPopper(e, this._menu, n)
        }
        _isShown() {
            return this._menu.classList.contains(Te)
        }
        _getPlacement() {
            const e = this._parent;
            if (e.classList.contains("dropend"))
                return Le;
            if (e.classList.contains("dropstart"))
                return Me;
            if (e.classList.contains("dropup-center"))
                return "top";
            if (e.classList.contains("dropdown-center"))
                return "bottom";
            const t = "end" === getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();
            return e.classList.contains("dropup") ? t ? De : Ee : t ? ke : Ae
        }
        _detectNavbar() {
            return null !== this._element.closest(".navbar")
        }
        _getOffset() {
            const {offset: e} = this._config;
            return "string" == typeof e ? e.split(",").map((e => Number.parseInt(e, 10))) : "function" == typeof e ? t => e(t, this._element) : e
        }
        _getPopperConfig() {
            const e = {
                placement: this._getPlacement(),
                modifiers: [{
                    name: "preventOverflow",
                    options: {
                        boundary: this._config.boundary
                    }
                }, {
                    name: "offset",
                    options: {
                        offset: this._getOffset()
                    }
                }]
            };
            return (this._inNavbar || "static" === this._config.display) && (B.setDataAttribute(this._menu, "popper", "static"),
            e.modifiers = [{
                name: "applyStyles",
                enabled: !1
            }]),
            {
                ...e,
                ..."function" == typeof this._config.popperConfig ? this._config.popperConfig(e) : this._config.popperConfig
            }
        }
        _selectMenuItem({key: e, target: t}) {
            const n = U.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)", this._menu).filter((e => c(e)));
            n.length && w(n, t, e === ye, !n.includes(t)).focus()
        }
        static jQueryInterface(e) {
            return this.each((function() {
                const t = Oe.getOrCreateInstance(this, e);
                if ("string" == typeof e) {
                    if (void 0 === t[e])
                        throw new TypeError(`No method named "${e}"`);
                    t[e]()
                }
            }
            ))
        }
        static clearMenus(e) {
            if (2 === e.button || "keyup" === e.type && "Tab" !== e.key)
                return;
            const t = U.find(_e);
            for (const n of t) {
                const t = Oe.getInstance(n);
                if (!t || !1 === t._config.autoClose)
                    continue;
                const r = e.composedPath()
                  , i = r.includes(t._menu);
                if (r.includes(t._element) || "inside" === t._config.autoClose && !i || "outside" === t._config.autoClose && i)
                    continue;
                if (t._menu.contains(e.target) && ("keyup" === e.type && "Tab" === e.key || /input|select|option|textarea|form/i.test(e.target.tagName)))
                    continue;
                const a = {
                    relatedTarget: t._element
                };
                "click" === e.type && (a.clickEvent = e),
                t._completeHide(a)
            }
        }
        static dataApiKeydownHandler(e) {
            const t = /input|textarea/i.test(e.target.tagName)
              , n = "Escape" === e.key
              , r = [be, ye].includes(e.key);
            if (!r && !n)
                return;
            if (t && !n)
                return;
            e.preventDefault();
            const i = this.matches(Se) ? this : U.prev(this, Se)[0] || U.next(this, Se)[0] || U.findOne(Se, e.delegateTarget.parentNode)
              , a = Oe.getOrCreateInstance(i);
            if (r)
                return e.stopPropagation(),
                a.show(),
                void a._selectMenuItem(e);
            a._isShown() && (e.stopPropagation(),
            a.hide(),
            i.focus())
        }
    }
    j.on(document, xe, Se, Oe.dataApiKeydownHandler),
    j.on(document, xe, Ce, Oe.dataApiKeydownHandler),
    j.on(document, we, Oe.clearMenus),
    j.on(document, "keyup.bs.dropdown.data-api", Oe.clearMenus),
    j.on(document, we, Se, (function(e) {
        e.preventDefault(),
        Oe.getOrCreateInstance(this).toggle()
    }
    )),
    v(Oe);
    const Ne = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top"
      , je = ".sticky-top"
      , ze = "padding-right"
      , He = "margin-right";
    class $e {
        constructor() {
            this._element = document.body
        }
        getWidth() {
            const e = document.documentElement.clientWidth;
            return Math.abs(window.innerWidth - e)
        }
        hide() {
            const e = this.getWidth();
            this._disableOverFlow(),
            this._setElementAttributes(this._element, ze, (t => t + e)),
            this._setElementAttributes(Ne, ze, (t => t + e)),
            this._setElementAttributes(je, He, (t => t - e))
        }
        reset() {
            this._resetElementAttributes(this._element, "overflow"),
            this._resetElementAttributes(this._element, ze),
            this._resetElementAttributes(Ne, ze),
            this._resetElementAttributes(je, He)
        }
        isOverflowing() {
            return this.getWidth() > 0
        }
        _disableOverFlow() {
            this._saveInitialAttribute(this._element, "overflow"),
            this._element.style.overflow = "hidden"
        }
        _setElementAttributes(e, t, n) {
            const r = this.getWidth();
            this._applyManipulationCallback(e, (e => {
                if (e !== this._element && window.innerWidth > e.clientWidth + r)
                    return;
                this._saveInitialAttribute(e, t);
                const i = window.getComputedStyle(e).getPropertyValue(t);
                e.style.setProperty(t, `${n(Number.parseFloat(i))}px`)
            }
            ))
        }
        _saveInitialAttribute(e, t) {
            const n = e.style.getPropertyValue(t);
            n && B.setDataAttribute(e, t, n)
        }
        _resetElementAttributes(e, t) {
            this._applyManipulationCallback(e, (e => {
                const n = B.getDataAttribute(e, t);
                null !== n ? (B.removeDataAttribute(e, t),
                e.style.setProperty(t, n)) : e.style.removeProperty(t)
            }
            ))
        }
        _applyManipulationCallback(e, t) {
            if (o(e))
                t(e);
            else
                for (const n of U.find(e, this._element))
                    t(n)
        }
    }
    const Fe = "show"
      , Re = "mousedown.bs.backdrop"
      , Be = {
        className: "modal-backdrop",
        clickCallback: null,
        isAnimated: !1,
        isVisible: !0,
        rootElement: "body"
    }
      , We = {
        className: "string",
        clickCallback: "(function|null)",
        isAnimated: "boolean",
        isVisible: "boolean",
        rootElement: "(element|string)"
    };
    class qe extends W {
        constructor(e) {
            super(),
            this._config = this._getConfig(e),
            this._isAppended = !1,
            this._element = null
        }
        static get Default() {
            return Be
        }
        static get DefaultType() {
            return We
        }
        static get NAME() {
            return "backdrop"
        }
        show(e) {
            if (!this._config.isVisible)
                return void b(e);
            this._append();
            const t = this._getElement();
            this._config.isAnimated && f(t),
            t.classList.add(Fe),
            this._emulateAnimation(( () => {
                b(e)
            }
            ))
        }
        hide(e) {
            this._config.isVisible ? (this._getElement().classList.remove(Fe),
            this._emulateAnimation(( () => {
                this.dispose(),
                b(e)
            }
            ))) : b(e)
        }
        dispose() {
            this._isAppended && (j.off(this._element, Re),
            this._element.remove(),
            this._isAppended = !1)
        }
        _getElement() {
            if (!this._element) {
                const e = document.createElement("div");
                e.className = this._config.className,
                this._config.isAnimated && e.classList.add("fade"),
                this._element = e
            }
            return this._element
        }
        _configAfterMerge(e) {
            return e.rootElement = l(e.rootElement),
            e
        }
        _append() {
            if (this._isAppended)
                return;
            const e = this._getElement();
            this._config.rootElement.append(e),
            j.on(e, Re, ( () => {
                b(this._config.clickCallback)
            }
            )),
            this._isAppended = !0
        }
        _emulateAnimation(e) {
            y(e, this._getElement(), this._config.isAnimated)
        }
    }
    const Xe = ".bs.focustrap"
      , Ve = "backward"
      , Ge = {
        autofocus: !0,
        trapElement: null
    }
      , Ye = {
        autofocus: "boolean",
        trapElement: "element"
    };
    class Ue extends W {
        constructor(e) {
            super(),
            this._config = this._getConfig(e),
            this._isActive = !1,
            this._lastTabNavDirection = null
        }
        static get Default() {
            return Ge
        }
        static get DefaultType() {
            return Ye
        }
        static get NAME() {
            return "focustrap"
        }
        activate() {
            this._isActive || (this._config.autofocus && this._config.trapElement.focus(),
            j.off(document, Xe),
            j.on(document, "focusin.bs.focustrap", (e => this._handleFocusin(e))),
            j.on(document, "keydown.tab.bs.focustrap", (e => this._handleKeydown(e))),
            this._isActive = !0)
        }
        deactivate() {
            this._isActive && (this._isActive = !1,
            j.off(document, Xe))
        }
        _handleFocusin(e) {
            const {trapElement: t} = this._config;
            if (e.target === document || e.target === t || t.contains(e.target))
                return;
            const n = U.focusableChildren(t);
            0 === n.length ? t.focus() : this._lastTabNavDirection === Ve ? n[n.length - 1].focus() : n[0].focus()
        }
        _handleKeydown(e) {
            "Tab" === e.key && (this._lastTabNavDirection = e.shiftKey ? Ve : "forward")
        }
    }
    const Ke = "hidden.bs.modal"
      , Je = "show.bs.modal"
      , Qe = "modal-open"
      , Ze = "show"
      , et = "modal-static"
      , tt = {
        backdrop: !0,
        focus: !0,
        keyboard: !0
    }
      , nt = {
        backdrop: "(boolean|string)",
        focus: "boolean",
        keyboard: "boolean"
    };
    class rt extends q {
        constructor(e, t) {
            super(e, t),
            this._dialog = U.findOne(".modal-dialog", this._element),
            this._backdrop = this._initializeBackDrop(),
            this._focustrap = this._initializeFocusTrap(),
            this._isShown = !1,
            this._isTransitioning = !1,
            this._scrollBar = new $e,
            this._addEventListeners()
        }
        static get Default() {
            return tt
        }
        static get DefaultType() {
            return nt
        }
        static get NAME() {
            return "modal"
        }
        toggle(e) {
            return this._isShown ? this.hide() : this.show(e)
        }
        show(e) {
            this._isShown || this._isTransitioning || j.trigger(this._element, Je, {
                relatedTarget: e
            }).defaultPrevented || (this._isShown = !0,
            this._isTransitioning = !0,
            this._scrollBar.hide(),
            document.body.classList.add(Qe),
            this._adjustDialog(),
            this._backdrop.show(( () => this._showElement(e))))
        }
        hide() {
            this._isShown && !this._isTransitioning && (j.trigger(this._element, "hide.bs.modal").defaultPrevented || (this._isShown = !1,
            this._isTransitioning = !0,
            this._focustrap.deactivate(),
            this._element.classList.remove(Ze),
            this._queueCallback(( () => this._hideModal()), this._element, this._isAnimated())))
        }
        dispose() {
            for (const e of [window, this._dialog])
                j.off(e, ".bs.modal");
            this._backdrop.dispose(),
            this._focustrap.deactivate(),
            super.dispose()
        }
        handleUpdate() {
            this._adjustDialog()
        }
        _initializeBackDrop() {
            return new qe({
                isVisible: Boolean(this._config.backdrop),
                isAnimated: this._isAnimated()
            })
        }
        _initializeFocusTrap() {
            return new Ue({
                trapElement: this._element
            })
        }
        _showElement(e) {
            document.body.contains(this._element) || document.body.append(this._element),
            this._element.style.display = "block",
            this._element.removeAttribute("aria-hidden"),
            this._element.setAttribute("aria-modal", !0),
            this._element.setAttribute("role", "dialog"),
            this._element.scrollTop = 0;
            const t = U.findOne(".modal-body", this._dialog);
            t && (t.scrollTop = 0),
            f(this._element),
            this._element.classList.add(Ze),
            this._queueCallback(( () => {
                this._config.focus && this._focustrap.activate(),
                this._isTransitioning = !1,
                j.trigger(this._element, "shown.bs.modal", {
                    relatedTarget: e
                })
            }
            ), this._dialog, this._isAnimated())
        }
        _addEventListeners() {
            j.on(this._element, "keydown.dismiss.bs.modal", (e => {
                if ("Escape" === e.key)
                    return this._config.keyboard ? (e.preventDefault(),
                    void this.hide()) : void this._triggerBackdropTransition()
            }
            )),
            j.on(window, "resize.bs.modal", ( () => {
                this._isShown && !this._isTransitioning && this._adjustDialog()
            }
            )),
            j.on(this._element, "mousedown.dismiss.bs.modal", (e => {
                j.one(this._element, "click.dismiss.bs.modal", (t => {
                    this._element === e.target && this._element === t.target && ("static" !== this._config.backdrop ? this._config.backdrop && this.hide() : this._triggerBackdropTransition())
                }
                ))
            }
            ))
        }
        _hideModal() {
            this._element.style.display = "none",
            this._element.setAttribute("aria-hidden", !0),
            this._element.removeAttribute("aria-modal"),
            this._element.removeAttribute("role"),
            this._isTransitioning = !1,
            this._backdrop.hide(( () => {
                document.body.classList.remove(Qe),
                this._resetAdjustments(),
                this._scrollBar.reset(),
                j.trigger(this._element, Ke)
            }
            ))
        }
        _isAnimated() {
            return this._element.classList.contains("fade")
        }
        _triggerBackdropTransition() {
            if (j.trigger(this._element, "hidePrevented.bs.modal").defaultPrevented)
                return;
            const e = this._element.scrollHeight > document.documentElement.clientHeight
              , t = this._element.style.overflowY;
            "hidden" === t || this._element.classList.contains(et) || (e || (this._element.style.overflowY = "hidden"),
            this._element.classList.add(et),
            this._queueCallback(( () => {
                this._element.classList.remove(et),
                this._queueCallback(( () => {
                    this._element.style.overflowY = t
                }
                ), this._dialog)
            }
            ), this._dialog),
            this._element.focus())
        }
        _adjustDialog() {
            const e = this._element.scrollHeight > document.documentElement.clientHeight
              , t = this._scrollBar.getWidth()
              , n = t > 0;
            if (n && !e) {
                const e = g() ? "paddingLeft" : "paddingRight";
                this._element.style[e] = `${t}px`
            }
            if (!n && e) {
                const e = g() ? "paddingRight" : "paddingLeft";
                this._element.style[e] = `${t}px`
            }
        }
        _resetAdjustments() {
            this._element.style.paddingLeft = "",
            this._element.style.paddingRight = ""
        }
        static jQueryInterface(e, t) {
            return this.each((function() {
                const n = rt.getOrCreateInstance(this, e);
                if ("string" == typeof e) {
                    if (void 0 === n[e])
                        throw new TypeError(`No method named "${e}"`);
                    n[e](t)
                }
            }
            ))
        }
    }
    j.on(document, "click.bs.modal.data-api", '[data-bs-toggle="modal"]', (function(e) {
        const t = a(this);
        ["A", "AREA"].includes(this.tagName) && e.preventDefault(),
        j.one(t, Je, (e => {
            e.defaultPrevented || j.one(t, Ke, ( () => {
                c(this) && this.focus()
            }
            ))
        }
        ));
        const n = U.findOne(".modal.show");
        n && rt.getInstance(n).hide(),
        rt.getOrCreateInstance(t).toggle(this)
    }
    )),
    X(rt),
    v(rt);
    const it = "show"
      , at = "showing"
      , st = "hiding"
      , ot = ".offcanvas.show"
      , lt = "hidePrevented.bs.offcanvas"
      , ct = "hidden.bs.offcanvas"
      , ut = {
        backdrop: !0,
        keyboard: !0,
        scroll: !1
    }
      , dt = {
        backdrop: "(boolean|string)",
        keyboard: "boolean",
        scroll: "boolean"
    };
    class pt extends q {
        constructor(e, t) {
            super(e, t),
            this._isShown = !1,
            this._backdrop = this._initializeBackDrop(),
            this._focustrap = this._initializeFocusTrap(),
            this._addEventListeners()
        }
        static get Default() {
            return ut
        }
        static get DefaultType() {
            return dt
        }
        static get NAME() {
            return "offcanvas"
        }
        toggle(e) {
            return this._isShown ? this.hide() : this.show(e)
        }
        show(e) {
            this._isShown || j.trigger(this._element, "show.bs.offcanvas", {
                relatedTarget: e
            }).defaultPrevented || (this._isShown = !0,
            this._backdrop.show(),
            this._config.scroll || (new $e).hide(),
            this._element.setAttribute("aria-modal", !0),
            this._element.setAttribute("role", "dialog"),
            this._element.classList.add(at),
            this._queueCallback(( () => {
                this._config.scroll && !this._config.backdrop || this._focustrap.activate(),
                this._element.classList.add(it),
                this._element.classList.remove(at),
                j.trigger(this._element, "shown.bs.offcanvas", {
                    relatedTarget: e
                })
            }
            ), this._element, !0))
        }
        hide() {
            this._isShown && (j.trigger(this._element, "hide.bs.offcanvas").defaultPrevented || (this._focustrap.deactivate(),
            this._element.blur(),
            this._isShown = !1,
            this._element.classList.add(st),
            this._backdrop.hide(),
            this._queueCallback(( () => {
                this._element.classList.remove(it, st),
                this._element.removeAttribute("aria-modal"),
                this._element.removeAttribute("role"),
                this._config.scroll || (new $e).reset(),
                j.trigger(this._element, ct)
            }
            ), this._element, !0)))
        }
        dispose() {
            this._backdrop.dispose(),
            this._focustrap.deactivate(),
            super.dispose()
        }
        _initializeBackDrop() {
            const e = Boolean(this._config.backdrop);
            return new qe({
                className: "offcanvas-backdrop",
                isVisible: e,
                isAnimated: !0,
                rootElement: this._element.parentNode,
                clickCallback: e ? () => {
                    "static" !== this._config.backdrop ? this.hide() : j.trigger(this._element, lt)
                }
                : null
            })
        }
        _initializeFocusTrap() {
            return new Ue({
                trapElement: this._element
            })
        }
        _addEventListeners() {
            j.on(this._element, "keydown.dismiss.bs.offcanvas", (e => {
                "Escape" === e.key && (this._config.keyboard ? this.hide() : j.trigger(this._element, lt))
            }
            ))
        }
        static jQueryInterface(e) {
            return this.each((function() {
                const t = pt.getOrCreateInstance(this, e);
                if ("string" == typeof e) {
                    if (void 0 === t[e] || e.startsWith("_") || "constructor" === e)
                        throw new TypeError(`No method named "${e}"`);
                    t[e](this)
                }
            }
            ))
        }
    }
    j.on(document, "click.bs.offcanvas.data-api", '[data-bs-toggle="offcanvas"]', (function(e) {
        const t = a(this);
        if (["A", "AREA"].includes(this.tagName) && e.preventDefault(),
        u(this))
            return;
        j.one(t, ct, ( () => {
            c(this) && this.focus()
        }
        ));
        const n = U.findOne(ot);
        n && n !== t && pt.getInstance(n).hide(),
        pt.getOrCreateInstance(t).toggle(this)
    }
    )),
    j.on(window, "load.bs.offcanvas.data-api", ( () => {
        for (const e of U.find(ot))
            pt.getOrCreateInstance(e).show()
    }
    )),
    j.on(window, "resize.bs.offcanvas", ( () => {
        for (const e of U.find("[aria-modal][class*=show][class*=offcanvas-]"))
            "fixed" !== getComputedStyle(e).position && pt.getOrCreateInstance(e).hide()
    }
    )),
    X(pt),
    v(pt);
    const ft = new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"])
      , ht = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i
      , mt = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i
      , gt = (e, t) => {
        const n = e.nodeName.toLowerCase();
        return t.includes(n) ? !ft.has(n) || Boolean(ht.test(e.nodeValue) || mt.test(e.nodeValue)) : t.filter((e => e instanceof RegExp)).some((e => e.test(n)))
    }
      , vt = {
        "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
        a: ["target", "href", "title", "rel"],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        div: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: ["src", "srcset", "alt", "title", "width", "height"],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: []
    }
      , bt = {
        allowList: vt,
        content: {},
        extraClass: "",
        html: !1,
        sanitize: !0,
        sanitizeFn: null,
        template: "<div></div>"
    }
      , yt = {
        allowList: "object",
        content: "object",
        extraClass: "(string|function)",
        html: "boolean",
        sanitize: "boolean",
        sanitizeFn: "(null|function)",
        template: "string"
    }
      , wt = {
        entry: "(string|element|function|null)",
        selector: "(string|element)"
    };
    class xt extends W {
        constructor(e) {
            super(),
            this._config = this._getConfig(e)
        }
        static get Default() {
            return bt
        }
        static get DefaultType() {
            return yt
        }
        static get NAME() {
            return "TemplateFactory"
        }
        getContent() {
            return Object.values(this._config.content).map((e => this._resolvePossibleFunction(e))).filter(Boolean)
        }
        hasContent() {
            return this.getContent().length > 0
        }
        changeContent(e) {
            return this._checkContent(e),
            this._config.content = {
                ...this._config.content,
                ...e
            },
            this
        }
        toHtml() {
            const e = document.createElement("div");
            e.innerHTML = this._maybeSanitize(this._config.template);
            for (const [t,n] of Object.entries(this._config.content))
                this._setContent(e, n, t);
            const t = e.children[0]
              , n = this._resolvePossibleFunction(this._config.extraClass);
            return n && t.classList.add(...n.split(" ")),
            t
        }
        _typeCheckConfig(e) {
            super._typeCheckConfig(e),
            this._checkContent(e.content)
        }
        _checkContent(e) {
            for (const [t,n] of Object.entries(e))
                super._typeCheckConfig({
                    selector: t,
                    entry: n
                }, wt)
        }
        _setContent(e, t, n) {
            const r = U.findOne(n, e);
            r && ((t = this._resolvePossibleFunction(t)) ? o(t) ? this._putElementInTemplate(l(t), r) : this._config.html ? r.innerHTML = this._maybeSanitize(t) : r.textContent = t : r.remove())
        }
        _maybeSanitize(e) {
            return this._config.sanitize ? function(e, t, n) {
                if (!e.length)
                    return e;
                if (n && "function" == typeof n)
                    return n(e);
                const r = (new window.DOMParser).parseFromString(e, "text/html")
                  , i = [].concat(...r.body.querySelectorAll("*"));
                for (const e of i) {
                    const n = e.nodeName.toLowerCase();
                    if (!Object.keys(t).includes(n)) {
                        e.remove();
                        continue
                    }
                    const r = [].concat(...e.attributes)
                      , i = [].concat(t["*"] || [], t[n] || []);
                    for (const t of r)
                        gt(t, i) || e.removeAttribute(t.nodeName)
                }
                return r.body.innerHTML
            }(e, this._config.allowList, this._config.sanitizeFn) : e
        }
        _resolvePossibleFunction(e) {
            return "function" == typeof e ? e(this) : e
        }
        _putElementInTemplate(e, t) {
            if (this._config.html)
                return t.innerHTML = "",
                void t.append(e);
            t.textContent = e.textContent
        }
    }
    const Tt = new Set(["sanitize", "allowList", "sanitizeFn"])
      , St = "fade"
      , _t = "show"
      , Ct = ".modal"
      , Et = "hide.bs.modal"
      , Dt = "hover"
      , At = "focus"
      , kt = {
        AUTO: "auto",
        TOP: "top",
        RIGHT: g() ? "left" : "right",
        BOTTOM: "bottom",
        LEFT: g() ? "right" : "left"
    }
      , Lt = {
        allowList: vt,
        animation: !0,
        boundary: "clippingParents",
        container: !1,
        customClass: "",
        delay: 0,
        fallbackPlacements: ["top", "right", "bottom", "left"],
        html: !1,
        offset: [0, 0],
        placement: "top",
        popperConfig: null,
        sanitize: !0,
        sanitizeFn: null,
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        title: "",
        trigger: "hover focus"
    }
      , Mt = {
        allowList: "object",
        animation: "boolean",
        boundary: "(string|element)",
        container: "(string|element|boolean)",
        customClass: "(string|function)",
        delay: "(number|object)",
        fallbackPlacements: "array",
        html: "boolean",
        offset: "(array|string|function)",
        placement: "(string|function)",
        popperConfig: "(null|object|function)",
        sanitize: "boolean",
        sanitizeFn: "(null|function)",
        selector: "(string|boolean)",
        template: "string",
        title: "(string|element|function)",
        trigger: "string"
    };
    class Pt extends q {
        constructor(e, n) {
            if (void 0 === t)
                throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
            super(e, n),
            this._isEnabled = !0,
            this._timeout = 0,
            this._isHovered = null,
            this._activeTrigger = {},
            this._popper = null,
            this._templateFactory = null,
            this._newContent = null,
            this.tip = null,
            this._setListeners(),
            this._config.selector || this._fixTitle()
        }
        static get Default() {
            return Lt
        }
        static get DefaultType() {
            return Mt
        }
        static get NAME() {
            return "tooltip"
        }
        enable() {
            this._isEnabled = !0
        }
        disable() {
            this._isEnabled = !1
        }
        toggleEnabled() {
            this._isEnabled = !this._isEnabled
        }
        toggle() {
            this._isEnabled && (this._activeTrigger.click = !this._activeTrigger.click,
            this._isShown() ? this._leave() : this._enter())
        }
        dispose() {
            clearTimeout(this._timeout),
            j.off(this._element.closest(Ct), Et, this._hideModalHandler),
            this._element.getAttribute("data-bs-original-title") && this._element.setAttribute("title", this._element.getAttribute("data-bs-original-title")),
            this._disposePopper(),
            super.dispose()
        }
        show() {
            if ("none" === this._element.style.display)
                throw new Error("Please use show on visible elements");
            if (!this._isWithContent() || !this._isEnabled)
                return;
            const e = j.trigger(this._element, this.constructor.eventName("show"))
              , t = (d(this._element) || this._element.ownerDocument.documentElement).contains(this._element);
            if (e.defaultPrevented || !t)
                return;
            this._disposePopper();
            const n = this._getTipElement();
            this._element.setAttribute("aria-describedby", n.getAttribute("id"));
            const {container: r} = this._config;
            if (this._element.ownerDocument.documentElement.contains(this.tip) || (r.append(n),
            j.trigger(this._element, this.constructor.eventName("inserted"))),
            this._popper = this._createPopper(n),
            n.classList.add(_t),
            "ontouchstart"in document.documentElement)
                for (const e of [].concat(...document.body.children))
                    j.on(e, "mouseover", p);
            this._queueCallback(( () => {
                j.trigger(this._element, this.constructor.eventName("shown")),
                !1 === this._isHovered && this._leave(),
                this._isHovered = !1
            }
            ), this.tip, this._isAnimated())
        }
        hide() {
            if (this._isShown() && !j.trigger(this._element, this.constructor.eventName("hide")).defaultPrevented) {
                if (this._getTipElement().classList.remove(_t),
                "ontouchstart"in document.documentElement)
                    for (const e of [].concat(...document.body.children))
                        j.off(e, "mouseover", p);
                this._activeTrigger.click = !1,
                this._activeTrigger.focus = !1,
                this._activeTrigger.hover = !1,
                this._isHovered = null,
                this._queueCallback(( () => {
                    this._isWithActiveTrigger() || (this._isHovered || this._disposePopper(),
                    this._element.removeAttribute("aria-describedby"),
                    j.trigger(this._element, this.constructor.eventName("hidden")))
                }
                ), this.tip, this._isAnimated())
            }
        }
        update() {
            this._popper && this._popper.update()
        }
        _isWithContent() {
            return Boolean(this._getTitle())
        }
        _getTipElement() {
            return this.tip || (this.tip = this._createTipElement(this._newContent || this._getContentForTemplate())),
            this.tip
        }
        _createTipElement(e) {
            const t = this._getTemplateFactory(e).toHtml();
            if (!t)
                return null;
            t.classList.remove(St, _t),
            t.classList.add(`bs-${this.constructor.NAME}-auto`);
            const n = (e => {
                do {
                    e += Math.floor(1e6 * Math.random())
                } while (document.getElementById(e));
                return e
            }
            )(this.constructor.NAME).toString();
            return t.setAttribute("id", n),
            this._isAnimated() && t.classList.add(St),
            t
        }
        setContent(e) {
            this._newContent = e,
            this._isShown() && (this._disposePopper(),
            this.show())
        }
        _getTemplateFactory(e) {
            return this._templateFactory ? this._templateFactory.changeContent(e) : this._templateFactory = new xt({
                ...this._config,
                content: e,
                extraClass: this._resolvePossibleFunction(this._config.customClass)
            }),
            this._templateFactory
        }
        _getContentForTemplate() {
            return {
                ".tooltip-inner": this._getTitle()
            }
        }
        _getTitle() {
            return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute("data-bs-original-title")
        }
        _initializeOnDelegatedTarget(e) {
            return this.constructor.getOrCreateInstance(e.delegateTarget, this._getDelegateConfig())
        }
        _isAnimated() {
            return this._config.animation || this.tip && this.tip.classList.contains(St)
        }
        _isShown() {
            return this.tip && this.tip.classList.contains(_t)
        }
        _createPopper(e) {
            const n = "function" == typeof this._config.placement ? this._config.placement.call(this, e, this._element) : this._config.placement
              , r = kt[n.toUpperCase()];
            return t.createPopper(this._element, e, this._getPopperConfig(r))
        }
        _getOffset() {
            const {offset: e} = this._config;
            return "string" == typeof e ? e.split(",").map((e => Number.parseInt(e, 10))) : "function" == typeof e ? t => e(t, this._element) : e
        }
        _resolvePossibleFunction(e) {
            return "function" == typeof e ? e.call(this._element) : e
        }
        _getPopperConfig(e) {
            const t = {
                placement: e,
                modifiers: [{
                    name: "flip",
                    options: {
                        fallbackPlacements: this._config.fallbackPlacements
                    }
                }, {
                    name: "offset",
                    options: {
                        offset: this._getOffset()
                    }
                }, {
                    name: "preventOverflow",
                    options: {
                        boundary: this._config.boundary
                    }
                }, {
                    name: "arrow",
                    options: {
                        element: `.${this.constructor.NAME}-arrow`
                    }
                }, {
                    name: "preSetPlacement",
                    enabled: !0,
                    phase: "beforeMain",
                    fn: e => {
                        this._getTipElement().setAttribute("data-popper-placement", e.state.placement)
                    }
                }]
            };
            return {
                ...t,
                ..."function" == typeof this._config.popperConfig ? this._config.popperConfig(t) : this._config.popperConfig
            }
        }
        _setListeners() {
            const e = this._config.trigger.split(" ");
            for (const t of e)
                if ("click" === t)
                    j.on(this._element, this.constructor.eventName("click"), this._config.selector, (e => {
                        this._initializeOnDelegatedTarget(e).toggle()
                    }
                    ));
                else if ("manual" !== t) {
                    const e = t === Dt ? this.constructor.eventName("mouseenter") : this.constructor.eventName("focusin")
                      , n = t === Dt ? this.constructor.eventName("mouseleave") : this.constructor.eventName("focusout");
                    j.on(this._element, e, this._config.selector, (e => {
                        const t = this._initializeOnDelegatedTarget(e);
                        t._activeTrigger["focusin" === e.type ? At : Dt] = !0,
                        t._enter()
                    }
                    )),
                    j.on(this._element, n, this._config.selector, (e => {
                        const t = this._initializeOnDelegatedTarget(e);
                        t._activeTrigger["focusout" === e.type ? At : Dt] = t._element.contains(e.relatedTarget),
                        t._leave()
                    }
                    ))
                }
            this._hideModalHandler = () => {
                this._element && this.hide()
            }
            ,
            j.on(this._element.closest(Ct), Et, this._hideModalHandler)
        }
        _fixTitle() {
            const e = this._element.getAttribute("title");
            e && (this._element.getAttribute("aria-label") || this._element.textContent.trim() || this._element.setAttribute("aria-label", e),
            this._element.setAttribute("data-bs-original-title", e),
            this._element.removeAttribute("title"))
        }
        _enter() {
            this._isShown() || this._isHovered ? this._isHovered = !0 : (this._isHovered = !0,
            this._setTimeout(( () => {
                this._isHovered && this.show()
            }
            ), this._config.delay.show))
        }
        _leave() {
            this._isWithActiveTrigger() || (this._isHovered = !1,
            this._setTimeout(( () => {
                this._isHovered || this.hide()
            }
            ), this._config.delay.hide))
        }
        _setTimeout(e, t) {
            clearTimeout(this._timeout),
            this._timeout = setTimeout(e, t)
        }
        _isWithActiveTrigger() {
            return Object.values(this._activeTrigger).includes(!0)
        }
        _getConfig(e) {
            const t = B.getDataAttributes(this._element);
            for (const e of Object.keys(t))
                Tt.has(e) && delete t[e];
            return e = {
                ...t,
                ..."object" == typeof e && e ? e : {}
            },
            e = this._mergeConfigObj(e),
            e = this._configAfterMerge(e),
            this._typeCheckConfig(e),
            e
        }
        _configAfterMerge(e) {
            return e.container = !1 === e.container ? document.body : l(e.container),
            "number" == typeof e.delay && (e.delay = {
                show: e.delay,
                hide: e.delay
            }),
            "number" == typeof e.title && (e.title = e.title.toString()),
            "number" == typeof e.content && (e.content = e.content.toString()),
            e
        }
        _getDelegateConfig() {
            const e = {};
            for (const t in this._config)
                this.constructor.Default[t] !== this._config[t] && (e[t] = this._config[t]);
            return e.selector = !1,
            e.trigger = "manual",
            e
        }
        _disposePopper() {
            this._popper && (this._popper.destroy(),
            this._popper = null),
            this.tip && (this.tip.remove(),
            this.tip = null)
        }
        static jQueryInterface(e) {
            return this.each((function() {
                const t = Pt.getOrCreateInstance(this, e);
                if ("string" == typeof e) {
                    if (void 0 === t[e])
                        throw new TypeError(`No method named "${e}"`);
                    t[e]()
                }
            }
            ))
        }
    }
    v(Pt);
    const It = {
        ...Pt.Default,
        content: "",
        offset: [0, 8],
        placement: "right",
        template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
        trigger: "click"
    }
      , Ot = {
        ...Pt.DefaultType,
        content: "(null|string|element|function)"
    };
    class Nt extends Pt {
        static get Default() {
            return It
        }
        static get DefaultType() {
            return Ot
        }
        static get NAME() {
            return "popover"
        }
        _isWithContent() {
            return this._getTitle() || this._getContent()
        }
        _getContentForTemplate() {
            return {
                ".popover-header": this._getTitle(),
                ".popover-body": this._getContent()
            }
        }
        _getContent() {
            return this._resolvePossibleFunction(this._config.content)
        }
        static jQueryInterface(e) {
            return this.each((function() {
                const t = Nt.getOrCreateInstance(this, e);
                if ("string" == typeof e) {
                    if (void 0 === t[e])
                        throw new TypeError(`No method named "${e}"`);
                    t[e]()
                }
            }
            ))
        }
    }
    v(Nt);
    const jt = "click.bs.scrollspy"
      , zt = "active"
      , Ht = "[href]"
      , $t = {
        offset: null,
        rootMargin: "0px 0px -25%",
        smoothScroll: !1,
        target: null,
        threshold: [.1, .5, 1]
    }
      , Ft = {
        offset: "(number|null)",
        rootMargin: "string",
        smoothScroll: "boolean",
        target: "element",
        threshold: "array"
    };
    class Rt extends q {
        constructor(e, t) {
            super(e, t),
            this._targetLinks = new Map,
            this._observableSections = new Map,
            this._rootElement = "visible" === getComputedStyle(this._element).overflowY ? null : this._element,
            this._activeTarget = null,
            this._observer = null,
            this._previousScrollData = {
                visibleEntryTop: 0,
                parentScrollTop: 0
            },
            this.refresh()
        }
        static get Default() {
            return $t
        }
        static get DefaultType() {
            return Ft
        }
        static get NAME() {
            return "scrollspy"
        }
        refresh() {
            this._initializeTargetsAndObservables(),
            this._maybeEnableSmoothScroll(),
            this._observer ? this._observer.disconnect() : this._observer = this._getNewObserver();
            for (const e of this._observableSections.values())
                this._observer.observe(e)
        }
        dispose() {
            this._observer.disconnect(),
            super.dispose()
        }
        _configAfterMerge(e) {
            return e.target = l(e.target) || document.body,
            e.rootMargin = e.offset ? `${e.offset}px 0px -30%` : e.rootMargin,
            "string" == typeof e.threshold && (e.threshold = e.threshold.split(",").map((e => Number.parseFloat(e)))),
            e
        }
        _maybeEnableSmoothScroll() {
            this._config.smoothScroll && (j.off(this._config.target, jt),
            j.on(this._config.target, jt, Ht, (e => {
                const t = this._observableSections.get(e.target.hash);
                if (t) {
                    e.preventDefault();
                    const n = this._rootElement || window
                      , r = t.offsetTop - this._element.offsetTop;
                    if (n.scrollTo)
                        return void n.scrollTo({
                            top: r,
                            behavior: "smooth"
                        });
                    n.scrollTop = r
                }
            }
            )))
        }
        _getNewObserver() {
            const e = {
                root: this._rootElement,
                threshold: this._config.threshold,
                rootMargin: this._config.rootMargin
            };
            return new IntersectionObserver((e => this._observerCallback(e)),e)
        }
        _observerCallback(e) {
            const t = e => this._targetLinks.get(`#${e.target.id}`)
              , n = e => {
                this._previousScrollData.visibleEntryTop = e.target.offsetTop,
                this._process(t(e))
            }
              , r = (this._rootElement || document.documentElement).scrollTop
              , i = r >= this._previousScrollData.parentScrollTop;
            this._previousScrollData.parentScrollTop = r;
            for (const a of e) {
                if (!a.isIntersecting) {
                    this._activeTarget = null,
                    this._clearActiveClass(t(a));
                    continue
                }
                const e = a.target.offsetTop >= this._previousScrollData.visibleEntryTop;
                if (i && e) {
                    if (n(a),
                    !r)
                        return
                } else
                    i || e || n(a)
            }
        }
        _initializeTargetsAndObservables() {
            this._targetLinks = new Map,
            this._observableSections = new Map;
            const e = U.find(Ht, this._config.target);
            for (const t of e) {
                if (!t.hash || u(t))
                    continue;
                const e = U.findOne(t.hash, this._element);
                c(e) && (this._targetLinks.set(t.hash, t),
                this._observableSections.set(t.hash, e))
            }
        }
        _process(e) {
            this._activeTarget !== e && (this._clearActiveClass(this._config.target),
            this._activeTarget = e,
            e.classList.add(zt),
            this._activateParents(e),
            j.trigger(this._element, "activate.bs.scrollspy", {
                relatedTarget: e
            }))
        }
        _activateParents(e) {
            if (e.classList.contains("dropdown-item"))
                U.findOne(".dropdown-toggle", e.closest(".dropdown")).classList.add(zt);
            else
                for (const t of U.parents(e, ".nav, .list-group"))
                    for (const e of U.prev(t, ".nav-link, .nav-item > .nav-link, .list-group-item"))
                        e.classList.add(zt)
        }
        _clearActiveClass(e) {
            e.classList.remove(zt);
            const t = U.find("[href].active", e);
            for (const e of t)
                e.classList.remove(zt)
        }
        static jQueryInterface(e) {
            return this.each((function() {
                const t = Rt.getOrCreateInstance(this, e);
                if ("string" == typeof e) {
                    if (void 0 === t[e] || e.startsWith("_") || "constructor" === e)
                        throw new TypeError(`No method named "${e}"`);
                    t[e]()
                }
            }
            ))
        }
    }
    j.on(window, "load.bs.scrollspy.data-api", ( () => {
        for (const e of U.find('[data-bs-spy="scroll"]'))
            Rt.getOrCreateInstance(e)
    }
    )),
    v(Rt);
    const Bt = "ArrowLeft"
      , Wt = "ArrowRight"
      , qt = "ArrowUp"
      , Xt = "ArrowDown"
      , Vt = "active"
      , Gt = "fade"
      , Yt = "show"
      , Ut = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'
      , Kt = `.nav-link:not(.dropdown-toggle), .list-group-item:not(.dropdown-toggle), [role="tab"]:not(.dropdown-toggle), ${Ut}`;
    class Jt extends q {
        constructor(e) {
            super(e),
            this._parent = this._element.closest('.list-group, .nav, [role="tablist"]'),
            this._parent && (this._setInitialAttributes(this._parent, this._getChildren()),
            j.on(this._element, "keydown.bs.tab", (e => this._keydown(e))))
        }
        static get NAME() {
            return "tab"
        }
        show() {
            const e = this._element;
            if (this._elemIsActive(e))
                return;
            const t = this._getActiveElem()
              , n = t ? j.trigger(t, "hide.bs.tab", {
                relatedTarget: e
            }) : null;
            j.trigger(e, "show.bs.tab", {
                relatedTarget: t
            }).defaultPrevented || n && n.defaultPrevented || (this._deactivate(t, e),
            this._activate(e, t))
        }
        _activate(e, t) {
            e && (e.classList.add(Vt),
            this._activate(a(e)),
            this._queueCallback(( () => {
                "tab" === e.getAttribute("role") ? (e.removeAttribute("tabindex"),
                e.setAttribute("aria-selected", !0),
                this._toggleDropDown(e, !0),
                j.trigger(e, "shown.bs.tab", {
                    relatedTarget: t
                })) : e.classList.add(Yt)
            }
            ), e, e.classList.contains(Gt)))
        }
        _deactivate(e, t) {
            e && (e.classList.remove(Vt),
            e.blur(),
            this._deactivate(a(e)),
            this._queueCallback(( () => {
                "tab" === e.getAttribute("role") ? (e.setAttribute("aria-selected", !1),
                e.setAttribute("tabindex", "-1"),
                this._toggleDropDown(e, !1),
                j.trigger(e, "hidden.bs.tab", {
                    relatedTarget: t
                })) : e.classList.remove(Yt)
            }
            ), e, e.classList.contains(Gt)))
        }
        _keydown(e) {
            if (![Bt, Wt, qt, Xt].includes(e.key))
                return;
            e.stopPropagation(),
            e.preventDefault();
            const t = [Wt, Xt].includes(e.key)
              , n = w(this._getChildren().filter((e => !u(e))), e.target, t, !0);
            n && (n.focus({
                preventScroll: !0
            }),
            Jt.getOrCreateInstance(n).show())
        }
        _getChildren() {
            return U.find(Kt, this._parent)
        }
        _getActiveElem() {
            return this._getChildren().find((e => this._elemIsActive(e))) || null
        }
        _setInitialAttributes(e, t) {
            this._setAttributeIfNotExists(e, "role", "tablist");
            for (const e of t)
                this._setInitialAttributesOnChild(e)
        }
        _setInitialAttributesOnChild(e) {
            e = this._getInnerElement(e);
            const t = this._elemIsActive(e)
              , n = this._getOuterElement(e);
            e.setAttribute("aria-selected", t),
            n !== e && this._setAttributeIfNotExists(n, "role", "presentation"),
            t || e.setAttribute("tabindex", "-1"),
            this._setAttributeIfNotExists(e, "role", "tab"),
            this._setInitialAttributesOnTargetPanel(e)
        }
        _setInitialAttributesOnTargetPanel(e) {
            const t = a(e);
            t && (this._setAttributeIfNotExists(t, "role", "tabpanel"),
            e.id && this._setAttributeIfNotExists(t, "aria-labelledby", `#${e.id}`))
        }
        _toggleDropDown(e, t) {
            const n = this._getOuterElement(e);
            if (!n.classList.contains("dropdown"))
                return;
            const r = (e, r) => {
                const i = U.findOne(e, n);
                i && i.classList.toggle(r, t)
            }
            ;
            r(".dropdown-toggle", Vt),
            r(".dropdown-menu", Yt),
            n.setAttribute("aria-expanded", t)
        }
        _setAttributeIfNotExists(e, t, n) {
            e.hasAttribute(t) || e.setAttribute(t, n)
        }
        _elemIsActive(e) {
            return e.classList.contains(Vt)
        }
        _getInnerElement(e) {
            return e.matches(Kt) ? e : U.findOne(Kt, e)
        }
        _getOuterElement(e) {
            return e.closest(".nav-item, .list-group-item") || e
        }
        static jQueryInterface(e) {
            return this.each((function() {
                const t = Jt.getOrCreateInstance(this);
                if ("string" == typeof e) {
                    if (void 0 === t[e] || e.startsWith("_") || "constructor" === e)
                        throw new TypeError(`No method named "${e}"`);
                    t[e]()
                }
            }
            ))
        }
    }
    j.on(document, "click.bs.tab", Ut, (function(e) {
        ["A", "AREA"].includes(this.tagName) && e.preventDefault(),
        u(this) || Jt.getOrCreateInstance(this).show()
    }
    )),
    j.on(window, "load.bs.tab", ( () => {
        for (const e of U.find('.active[data-bs-toggle="tab"], .active[data-bs-toggle="pill"], .active[data-bs-toggle="list"]'))
            Jt.getOrCreateInstance(e)
    }
    )),
    v(Jt);
    const Qt = "hide"
      , Zt = "show"
      , en = "showing"
      , tn = {
        animation: "boolean",
        autohide: "boolean",
        delay: "number"
    }
      , nn = {
        animation: !0,
        autohide: !0,
        delay: 5e3
    };
    class rn extends q {
        constructor(e, t) {
            super(e, t),
            this._timeout = null,
            this._hasMouseInteraction = !1,
            this._hasKeyboardInteraction = !1,
            this._setListeners()
        }
        static get Default() {
            return nn
        }
        static get DefaultType() {
            return tn
        }
        static get NAME() {
            return "toast"
        }
        show() {
            j.trigger(this._element, "show.bs.toast").defaultPrevented || (this._clearTimeout(),
            this._config.animation && this._element.classList.add("fade"),
            this._element.classList.remove(Qt),
            f(this._element),
            this._element.classList.add(Zt, en),
            this._queueCallback(( () => {
                this._element.classList.remove(en),
                j.trigger(this._element, "shown.bs.toast"),
                this._maybeScheduleHide()
            }
            ), this._element, this._config.animation))
        }
        hide() {
            this.isShown() && (j.trigger(this._element, "hide.bs.toast").defaultPrevented || (this._element.classList.add(en),
            this._queueCallback(( () => {
                this._element.classList.add(Qt),
                this._element.classList.remove(en, Zt),
                j.trigger(this._element, "hidden.bs.toast")
            }
            ), this._element, this._config.animation)))
        }
        dispose() {
            this._clearTimeout(),
            this.isShown() && this._element.classList.remove(Zt),
            super.dispose()
        }
        isShown() {
            return this._element.classList.contains(Zt)
        }
        _maybeScheduleHide() {
            this._config.autohide && (this._hasMouseInteraction || this._hasKeyboardInteraction || (this._timeout = setTimeout(( () => {
                this.hide()
            }
            ), this._config.delay)))
        }
        _onInteraction(e, t) {
            switch (e.type) {
            case "mouseover":
            case "mouseout":
                this._hasMouseInteraction = t;
                break;
            case "focusin":
            case "focusout":
                this._hasKeyboardInteraction = t
            }
            if (t)
                return void this._clearTimeout();
            const n = e.relatedTarget;
            this._element === n || this._element.contains(n) || this._maybeScheduleHide()
        }
        _setListeners() {
            j.on(this._element, "mouseover.bs.toast", (e => this._onInteraction(e, !0))),
            j.on(this._element, "mouseout.bs.toast", (e => this._onInteraction(e, !1))),
            j.on(this._element, "focusin.bs.toast", (e => this._onInteraction(e, !0))),
            j.on(this._element, "focusout.bs.toast", (e => this._onInteraction(e, !1)))
        }
        _clearTimeout() {
            clearTimeout(this._timeout),
            this._timeout = null
        }
        static jQueryInterface(e) {
            return this.each((function() {
                const t = rn.getOrCreateInstance(this, e);
                if ("string" == typeof e) {
                    if (void 0 === t[e])
                        throw new TypeError(`No method named "${e}"`);
                    t[e](this)
                }
            }
            ))
        }
    }
    return X(rn),
    v(rn),
    {
        Alert: V,
        Button: Y,
        Carousel: ce,
        Collapse: ge,
        Dropdown: Oe,
        Modal: rt,
        Offcanvas: pt,
        Popover: Nt,
        ScrollSpy: Rt,
        Tab: Jt,
        Toast: rn,
        Tooltip: Pt
    }
}
)),
function(e) {
    var t, n;
    "function" == typeof define && define.amd ? define(["jquery", "datatables.net"], (function(t) {
        return e(t, window, document)
    }
    )) : "object" == typeof exports ? (t = require("jquery"),
    n = function(e, t) {
        t.fn.dataTable || require("datatables.net")(e, t)
    }
    ,
    "undefined" != typeof window ? module.exports = function(r, i) {
        return r = r || window,
        i = i || t(r),
        n(r, i),
        e(i, 0, r.document)
    }
    : (n(window, t),
    module.exports = e(t, window, window.document))) : e(jQuery, window, document)
}((function(e, t, n, r) {
    "use strict";
    var i = e.fn.dataTable;
    return e.extend(!0, i.defaults, {
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>><'row dt-row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        renderer: "bootstrap"
    }),
    e.extend(i.ext.classes, {
        sWrapper: "dataTables_wrapper dt-bootstrap5",
        sFilterInput: "form-control form-control-sm",
        sLengthSelect: "form-select form-select-sm",
        sProcessing: "dataTables_processing card",
        sPageButton: "paginate_button page-item"
    }),
    i.ext.renderer.pageButton.bootstrap = function(t, a, s, o, l, c) {
        var u, d, p, f = new i.Api(t), h = t.oClasses, m = t.oLanguage.oPaginate, g = t.oLanguage.oAria.paginate || {};
        a = e(a);
        try {
            p = a.find(n.activeElement).data("dt-idx")
        } catch (a) {}
        var v = a.children("ul.pagination");
        v.length ? v.empty() : v = a.html("<ul/>").children("ul").addClass("pagination"),
        function n(r, i) {
            for (var a, o, p = function(t) {
                t.preventDefault(),
                e(t.currentTarget).hasClass("disabled") || f.page() == t.data.action || f.page(t.data.action).draw("page")
            }, v = 0, b = i.length; v < b; v++)
                if (a = i[v],
                Array.isArray(a))
                    n(r, a);
                else {
                    switch (d = u = "",
                    a) {
                    case "ellipsis":
                        u = "&#x2026;",
                        d = "disabled";
                        break;
                    case "first":
                        u = m.sFirst,
                        d = a + (0 < l ? "" : " disabled");
                        break;
                    case "previous":
                        u = m.sPrevious,
                        d = a + (0 < l ? "" : " disabled");
                        break;
                    case "next":
                        u = m.sNext,
                        d = a + (l < c - 1 ? "" : " disabled");
                        break;
                    case "last":
                        u = m.sLast,
                        d = a + (l < c - 1 ? "" : " disabled");
                        break;
                    default:
                        u = a + 1,
                        d = l === a ? "active" : ""
                    }
                    u && (o = -1 !== d.indexOf("disabled"),
                    o = e("<li>", {
                        class: h.sPageButton + " " + d,
                        id: 0 === s && "string" == typeof a ? t.sTableId + "_" + a : null
                    }).append(e("<a>", {
                        href: o ? null : "#",
                        "aria-controls": t.sTableId,
                        "aria-disabled": o ? "true" : null,
                        "aria-label": g[a],
                        "aria-role": "link",
                        "aria-current": "active" === d ? "page" : null,
                        "data-dt-idx": a,
                        tabindex: t.iTabIndex,
                        class: "page-link"
                    }).html(u)).appendTo(r),
                    t.oApi._fnBindAction(o, {
                        action: a
                    }, p))
                }
        }(v, o),
        p !== r && a.find("[data-dt-idx=" + p + "]").trigger("focus")
    }
    ,
    i
}
)),
function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Swiper = t()
}(this, (function() {
    "use strict";
    function e(e, t) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r)
        }
    }
    function t() {
        return (t = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ).apply(this, arguments)
    }
    function n(e) {
        return null !== e && "object" == typeof e && "constructor"in e && e.constructor === Object
    }
    function r(e, t) {
        void 0 === e && (e = {}),
        void 0 === t && (t = {}),
        Object.keys(t).forEach((function(i) {
            void 0 === e[i] ? e[i] = t[i] : n(t[i]) && n(e[i]) && Object.keys(t[i]).length > 0 && r(e[i], t[i])
        }
        ))
    }
    var i = {
        body: {},
        addEventListener: function() {},
        removeEventListener: function() {},
        activeElement: {
            blur: function() {},
            nodeName: ""
        },
        querySelector: function() {
            return null
        },
        querySelectorAll: function() {
            return []
        },
        getElementById: function() {
            return null
        },
        createEvent: function() {
            return {
                initEvent: function() {}
            }
        },
        createElement: function() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute: function() {},
                getElementsByTagName: function() {
                    return []
                }
            }
        },
        createElementNS: function() {
            return {}
        },
        importNode: function() {
            return null
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function a() {
        var e = "undefined" != typeof document ? document : {};
        return r(e, i),
        e
    }
    var s = {
        document: i,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState: function() {},
            pushState: function() {},
            go: function() {},
            back: function() {}
        },
        CustomEvent: function() {
            return this
        },
        addEventListener: function() {},
        removeEventListener: function() {},
        getComputedStyle: function() {
            return {
                getPropertyValue: function() {
                    return ""
                }
            }
        },
        Image: function() {},
        Date: function() {},
        screen: {},
        setTimeout: function() {},
        clearTimeout: function() {},
        matchMedia: function() {
            return {}
        },
        requestAnimationFrame: function(e) {
            return "undefined" == typeof setTimeout ? (e(),
            null) : setTimeout(e, 0)
        },
        cancelAnimationFrame: function(e) {
            "undefined" != typeof setTimeout && clearTimeout(e)
        }
    };
    function o() {
        var e = "undefined" != typeof window ? window : {};
        return r(e, s),
        e
    }
    function l(e) {
        return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
            return e.__proto__ || Object.getPrototypeOf(e)
        }
        )(e)
    }
    function c(e, t) {
        return (c = Object.setPrototypeOf || function(e, t) {
            return e.__proto__ = t,
            e
        }
        )(e, t)
    }
    function u(e, t, n) {
        return (u = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (e) {
                return !1
            }
        }() ? Reflect.construct : function(e, t, n) {
            var r = [null];
            r.push.apply(r, t);
            var i = new (Function.bind.apply(e, r));
            return n && c(i, n.prototype),
            i
        }
        ).apply(null, arguments)
    }
    function d(e) {
        var t = "function" == typeof Map ? new Map : void 0;
        return (d = function(e) {
            if (null === e || (n = e,
            -1 === Function.toString.call(n).indexOf("[native code]")))
                return e;
            var n;
            if ("function" != typeof e)
                throw new TypeError("Super expression must either be null or a function");
            if (void 0 !== t) {
                if (t.has(e))
                    return t.get(e);
                t.set(e, r)
            }
            function r() {
                return u(e, arguments, l(this).constructor)
            }
            return r.prototype = Object.create(e.prototype, {
                constructor: {
                    value: r,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }),
            c(r, e)
        }
        )(e)
    }
    var p = function(e) {
        var t, n;
        function r(t) {
            var n, r, i;
            return r = function(e) {
                if (void 0 === e)
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }(n = e.call.apply(e, [this].concat(t)) || this),
            i = r.__proto__,
            Object.defineProperty(r, "__proto__", {
                get: function() {
                    return i
                },
                set: function(e) {
                    i.__proto__ = e
                }
            }),
            n
        }
        return n = e,
        (t = r).prototype = Object.create(n.prototype),
        t.prototype.constructor = t,
        t.__proto__ = n,
        r
    }(d(Array));
    function f(e) {
        void 0 === e && (e = []);
        var t = [];
        return e.forEach((function(e) {
            Array.isArray(e) ? t.push.apply(t, f(e)) : t.push(e)
        }
        )),
        t
    }
    function h(e, t) {
        return Array.prototype.filter.call(e, t)
    }
    function m(e, t) {
        var n = o()
          , r = a()
          , i = [];
        if (!t && e instanceof p)
            return e;
        if (!e)
            return new p(i);
        if ("string" == typeof e) {
            var s = e.trim();
            if (s.indexOf("<") >= 0 && s.indexOf(">") >= 0) {
                var l = "div";
                0 === s.indexOf("<li") && (l = "ul"),
                0 === s.indexOf("<tr") && (l = "tbody"),
                0 !== s.indexOf("<td") && 0 !== s.indexOf("<th") || (l = "tr"),
                0 === s.indexOf("<tbody") && (l = "table"),
                0 === s.indexOf("<option") && (l = "select");
                var c = r.createElement(l);
                c.innerHTML = s;
                for (var u = 0; u < c.childNodes.length; u += 1)
                    i.push(c.childNodes[u])
            } else
                i = function(e, t) {
                    if ("string" != typeof e)
                        return [e];
                    for (var n = [], r = t.querySelectorAll(e), i = 0; i < r.length; i += 1)
                        n.push(r[i]);
                    return n
                }(e.trim(), t || r)
        } else if (e.nodeType || e === n || e === r)
            i.push(e);
        else if (Array.isArray(e)) {
            if (e instanceof p)
                return e;
            i = e
        }
        return new p(function(e) {
            for (var t = [], n = 0; n < e.length; n += 1)
                -1 === t.indexOf(e[n]) && t.push(e[n]);
            return t
        }(i))
    }
    m.fn = p.prototype;
    var g, v, b, y = {
        addClass: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                t[n] = arguments[n];
            var r = f(t.map((function(e) {
                return e.split(" ")
            }
            )));
            return this.forEach((function(e) {
                var t;
                (t = e.classList).add.apply(t, r)
            }
            )),
            this
        },
        removeClass: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                t[n] = arguments[n];
            var r = f(t.map((function(e) {
                return e.split(" ")
            }
            )));
            return this.forEach((function(e) {
                var t;
                (t = e.classList).remove.apply(t, r)
            }
            )),
            this
        },
        hasClass: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                t[n] = arguments[n];
            var r = f(t.map((function(e) {
                return e.split(" ")
            }
            )));
            return h(this, (function(e) {
                return r.filter((function(t) {
                    return e.classList.contains(t)
                }
                )).length > 0
            }
            )).length > 0
        },
        toggleClass: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                t[n] = arguments[n];
            var r = f(t.map((function(e) {
                return e.split(" ")
            }
            )));
            this.forEach((function(e) {
                r.forEach((function(t) {
                    e.classList.toggle(t)
                }
                ))
            }
            ))
        },
        attr: function(e, t) {
            if (1 === arguments.length && "string" == typeof e)
                return this[0] ? this[0].getAttribute(e) : void 0;
            for (var n = 0; n < this.length; n += 1)
                if (2 === arguments.length)
                    this[n].setAttribute(e, t);
                else
                    for (var r in e)
                        this[n][r] = e[r],
                        this[n].setAttribute(r, e[r]);
            return this
        },
        removeAttr: function(e) {
            for (var t = 0; t < this.length; t += 1)
                this[t].removeAttribute(e);
            return this
        },
        transform: function(e) {
            for (var t = 0; t < this.length; t += 1)
                this[t].style.transform = e;
            return this
        },
        transition: function(e) {
            for (var t = 0; t < this.length; t += 1)
                this[t].style.transitionDuration = "string" != typeof e ? e + "ms" : e;
            return this
        },
        on: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                t[n] = arguments[n];
            var r = t[0]
              , i = t[1]
              , a = t[2]
              , s = t[3];
            function o(e) {
                var t = e.target;
                if (t) {
                    var n = e.target.dom7EventData || [];
                    if (n.indexOf(e) < 0 && n.unshift(e),
                    m(t).is(i))
                        a.apply(t, n);
                    else
                        for (var r = m(t).parents(), s = 0; s < r.length; s += 1)
                            m(r[s]).is(i) && a.apply(r[s], n)
                }
            }
            function l(e) {
                var t = e && e.target && e.target.dom7EventData || [];
                t.indexOf(e) < 0 && t.unshift(e),
                a.apply(this, t)
            }
            "function" == typeof t[1] && (r = t[0],
            a = t[1],
            s = t[2],
            i = void 0),
            s || (s = !1);
            for (var c, u = r.split(" "), d = 0; d < this.length; d += 1) {
                var p = this[d];
                if (i)
                    for (c = 0; c < u.length; c += 1) {
                        var f = u[c];
                        p.dom7LiveListeners || (p.dom7LiveListeners = {}),
                        p.dom7LiveListeners[f] || (p.dom7LiveListeners[f] = []),
                        p.dom7LiveListeners[f].push({
                            listener: a,
                            proxyListener: o
                        }),
                        p.addEventListener(f, o, s)
                    }
                else
                    for (c = 0; c < u.length; c += 1) {
                        var h = u[c];
                        p.dom7Listeners || (p.dom7Listeners = {}),
                        p.dom7Listeners[h] || (p.dom7Listeners[h] = []),
                        p.dom7Listeners[h].push({
                            listener: a,
                            proxyListener: l
                        }),
                        p.addEventListener(h, l, s)
                    }
            }
            return this
        },
        off: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                t[n] = arguments[n];
            var r = t[0]
              , i = t[1]
              , a = t[2]
              , s = t[3];
            "function" == typeof t[1] && (r = t[0],
            a = t[1],
            s = t[2],
            i = void 0),
            s || (s = !1);
            for (var o = r.split(" "), l = 0; l < o.length; l += 1)
                for (var c = o[l], u = 0; u < this.length; u += 1) {
                    var d = this[u]
                      , p = void 0;
                    if (!i && d.dom7Listeners ? p = d.dom7Listeners[c] : i && d.dom7LiveListeners && (p = d.dom7LiveListeners[c]),
                    p && p.length)
                        for (var f = p.length - 1; f >= 0; f -= 1) {
                            var h = p[f];
                            a && h.listener === a || a && h.listener && h.listener.dom7proxy && h.listener.dom7proxy === a ? (d.removeEventListener(c, h.proxyListener, s),
                            p.splice(f, 1)) : a || (d.removeEventListener(c, h.proxyListener, s),
                            p.splice(f, 1))
                        }
                }
            return this
        },
        trigger: function() {
            for (var e = o(), t = arguments.length, n = new Array(t), r = 0; r < t; r++)
                n[r] = arguments[r];
            for (var i = n[0].split(" "), a = n[1], s = 0; s < i.length; s += 1)
                for (var l = i[s], c = 0; c < this.length; c += 1) {
                    var u = this[c];
                    if (e.CustomEvent) {
                        var d = new e.CustomEvent(l,{
                            detail: a,
                            bubbles: !0,
                            cancelable: !0
                        });
                        u.dom7EventData = n.filter((function(e, t) {
                            return t > 0
                        }
                        )),
                        u.dispatchEvent(d),
                        u.dom7EventData = [],
                        delete u.dom7EventData
                    }
                }
            return this
        },
        transitionEnd: function(e) {
            var t = this;
            return e && t.on("transitionend", (function n(r) {
                r.target === this && (e.call(this, r),
                t.off("transitionend", n))
            }
            )),
            this
        },
        outerWidth: function(e) {
            if (this.length > 0) {
                if (e) {
                    var t = this.styles();
                    return this[0].offsetWidth + parseFloat(t.getPropertyValue("margin-right")) + parseFloat(t.getPropertyValue("margin-left"))
                }
                return this[0].offsetWidth
            }
            return null
        },
        outerHeight: function(e) {
            if (this.length > 0) {
                if (e) {
                    var t = this.styles();
                    return this[0].offsetHeight + parseFloat(t.getPropertyValue("margin-top")) + parseFloat(t.getPropertyValue("margin-bottom"))
                }
                return this[0].offsetHeight
            }
            return null
        },
        styles: function() {
            var e = o();
            return this[0] ? e.getComputedStyle(this[0], null) : {}
        },
        offset: function() {
            if (this.length > 0) {
                var e = o()
                  , t = a()
                  , n = this[0]
                  , r = n.getBoundingClientRect()
                  , i = t.body
                  , s = n.clientTop || i.clientTop || 0
                  , l = n.clientLeft || i.clientLeft || 0
                  , c = n === e ? e.scrollY : n.scrollTop
                  , u = n === e ? e.scrollX : n.scrollLeft;
                return {
                    top: r.top + c - s,
                    left: r.left + u - l
                }
            }
            return null
        },
        css: function(e, t) {
            var n, r = o();
            if (1 === arguments.length) {
                if ("string" != typeof e) {
                    for (n = 0; n < this.length; n += 1)
                        for (var i in e)
                            this[n].style[i] = e[i];
                    return this
                }
                if (this[0])
                    return r.getComputedStyle(this[0], null).getPropertyValue(e)
            }
            if (2 === arguments.length && "string" == typeof e) {
                for (n = 0; n < this.length; n += 1)
                    this[n].style[e] = t;
                return this
            }
            return this
        },
        each: function(e) {
            return e ? (this.forEach((function(t, n) {
                e.apply(t, [t, n])
            }
            )),
            this) : this
        },
        html: function(e) {
            if (void 0 === e)
                return this[0] ? this[0].innerHTML : null;
            for (var t = 0; t < this.length; t += 1)
                this[t].innerHTML = e;
            return this
        },
        text: function(e) {
            if (void 0 === e)
                return this[0] ? this[0].textContent.trim() : null;
            for (var t = 0; t < this.length; t += 1)
                this[t].textContent = e;
            return this
        },
        is: function(e) {
            var t, n, r = o(), i = a(), s = this[0];
            if (!s || void 0 === e)
                return !1;
            if ("string" == typeof e) {
                if (s.matches)
                    return s.matches(e);
                if (s.webkitMatchesSelector)
                    return s.webkitMatchesSelector(e);
                if (s.msMatchesSelector)
                    return s.msMatchesSelector(e);
                for (t = m(e),
                n = 0; n < t.length; n += 1)
                    if (t[n] === s)
                        return !0;
                return !1
            }
            if (e === i)
                return s === i;
            if (e === r)
                return s === r;
            if (e.nodeType || e instanceof p) {
                for (t = e.nodeType ? [e] : e,
                n = 0; n < t.length; n += 1)
                    if (t[n] === s)
                        return !0;
                return !1
            }
            return !1
        },
        index: function() {
            var e, t = this[0];
            if (t) {
                for (e = 0; null !== (t = t.previousSibling); )
                    1 === t.nodeType && (e += 1);
                return e
            }
        },
        eq: function(e) {
            if (void 0 === e)
                return this;
            var t = this.length;
            if (e > t - 1)
                return m([]);
            if (e < 0) {
                var n = t + e;
                return m(n < 0 ? [] : [this[n]])
            }
            return m([this[e]])
        },
        append: function() {
            for (var e, t = a(), n = 0; n < arguments.length; n += 1) {
                e = n < 0 || arguments.length <= n ? void 0 : arguments[n];
                for (var r = 0; r < this.length; r += 1)
                    if ("string" == typeof e) {
                        var i = t.createElement("div");
                        for (i.innerHTML = e; i.firstChild; )
                            this[r].appendChild(i.firstChild)
                    } else if (e instanceof p)
                        for (var s = 0; s < e.length; s += 1)
                            this[r].appendChild(e[s]);
                    else
                        this[r].appendChild(e)
            }
            return this
        },
        prepend: function(e) {
            var t, n, r = a();
            for (t = 0; t < this.length; t += 1)
                if ("string" == typeof e) {
                    var i = r.createElement("div");
                    for (i.innerHTML = e,
                    n = i.childNodes.length - 1; n >= 0; n -= 1)
                        this[t].insertBefore(i.childNodes[n], this[t].childNodes[0])
                } else if (e instanceof p)
                    for (n = 0; n < e.length; n += 1)
                        this[t].insertBefore(e[n], this[t].childNodes[0]);
                else
                    this[t].insertBefore(e, this[t].childNodes[0]);
            return this
        },
        next: function(e) {
            return this.length > 0 ? e ? this[0].nextElementSibling && m(this[0].nextElementSibling).is(e) ? m([this[0].nextElementSibling]) : m([]) : this[0].nextElementSibling ? m([this[0].nextElementSibling]) : m([]) : m([])
        },
        nextAll: function(e) {
            var t = []
              , n = this[0];
            if (!n)
                return m([]);
            for (; n.nextElementSibling; ) {
                var r = n.nextElementSibling;
                e ? m(r).is(e) && t.push(r) : t.push(r),
                n = r
            }
            return m(t)
        },
        prev: function(e) {
            if (this.length > 0) {
                var t = this[0];
                return e ? t.previousElementSibling && m(t.previousElementSibling).is(e) ? m([t.previousElementSibling]) : m([]) : t.previousElementSibling ? m([t.previousElementSibling]) : m([])
            }
            return m([])
        },
        prevAll: function(e) {
            var t = []
              , n = this[0];
            if (!n)
                return m([]);
            for (; n.previousElementSibling; ) {
                var r = n.previousElementSibling;
                e ? m(r).is(e) && t.push(r) : t.push(r),
                n = r
            }
            return m(t)
        },
        parent: function(e) {
            for (var t = [], n = 0; n < this.length; n += 1)
                null !== this[n].parentNode && (e ? m(this[n].parentNode).is(e) && t.push(this[n].parentNode) : t.push(this[n].parentNode));
            return m(t)
        },
        parents: function(e) {
            for (var t = [], n = 0; n < this.length; n += 1)
                for (var r = this[n].parentNode; r; )
                    e ? m(r).is(e) && t.push(r) : t.push(r),
                    r = r.parentNode;
            return m(t)
        },
        closest: function(e) {
            var t = this;
            return void 0 === e ? m([]) : (t.is(e) || (t = t.parents(e).eq(0)),
            t)
        },
        find: function(e) {
            for (var t = [], n = 0; n < this.length; n += 1)
                for (var r = this[n].querySelectorAll(e), i = 0; i < r.length; i += 1)
                    t.push(r[i]);
            return m(t)
        },
        children: function(e) {
            for (var t = [], n = 0; n < this.length; n += 1)
                for (var r = this[n].children, i = 0; i < r.length; i += 1)
                    e && !m(r[i]).is(e) || t.push(r[i]);
            return m(t)
        },
        filter: function(e) {
            return m(h(this, e))
        },
        remove: function() {
            for (var e = 0; e < this.length; e += 1)
                this[e].parentNode && this[e].parentNode.removeChild(this[e]);
            return this
        }
    };
    function w(e, t) {
        return void 0 === t && (t = 0),
        setTimeout(e, t)
    }
    function x() {
        return Date.now()
    }
    function T(e, t) {
        void 0 === t && (t = "x");
        var n, r, i, a = o(), s = function(e) {
            var t, n = o();
            return n.getComputedStyle && (t = n.getComputedStyle(e, null)),
            !t && e.currentStyle && (t = e.currentStyle),
            t || (t = e.style),
            t
        }(e);
        return a.WebKitCSSMatrix ? ((r = s.transform || s.webkitTransform).split(",").length > 6 && (r = r.split(", ").map((function(e) {
            return e.replace(",", ".")
        }
        )).join(", ")),
        i = new a.WebKitCSSMatrix("none" === r ? "" : r)) : n = (i = s.MozTransform || s.OTransform || s.MsTransform || s.msTransform || s.transform || s.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,")).toString().split(","),
        "x" === t && (r = a.WebKitCSSMatrix ? i.m41 : 16 === n.length ? parseFloat(n[12]) : parseFloat(n[4])),
        "y" === t && (r = a.WebKitCSSMatrix ? i.m42 : 16 === n.length ? parseFloat(n[13]) : parseFloat(n[5])),
        r || 0
    }
    function S(e) {
        return "object" == typeof e && null !== e && e.constructor && "Object" === Object.prototype.toString.call(e).slice(8, -1)
    }
    function _(e) {
        return "undefined" != typeof window && void 0 !== window.HTMLElement ? e instanceof HTMLElement : e && (1 === e.nodeType || 11 === e.nodeType)
    }
    function C() {
        for (var e = Object(arguments.length <= 0 ? void 0 : arguments[0]), t = ["__proto__", "constructor", "prototype"], n = 1; n < arguments.length; n += 1) {
            var r = n < 0 || arguments.length <= n ? void 0 : arguments[n];
            if (null != r && !_(r))
                for (var i = Object.keys(Object(r)).filter((function(e) {
                    return t.indexOf(e) < 0
                }
                )), a = 0, s = i.length; a < s; a += 1) {
                    var o = i[a]
                      , l = Object.getOwnPropertyDescriptor(r, o);
                    void 0 !== l && l.enumerable && (S(e[o]) && S(r[o]) ? r[o].__swiper__ ? e[o] = r[o] : C(e[o], r[o]) : !S(e[o]) && S(r[o]) ? (e[o] = {},
                    r[o].__swiper__ ? e[o] = r[o] : C(e[o], r[o])) : e[o] = r[o])
                }
        }
        return e
    }
    function E(e, t) {
        Object.keys(t).forEach((function(n) {
            S(t[n]) && Object.keys(t[n]).forEach((function(r) {
                "function" == typeof t[n][r] && (t[n][r] = t[n][r].bind(e))
            }
            )),
            e[n] = t[n]
        }
        ))
    }
    function D(e) {
        return void 0 === e && (e = ""),
        "." + e.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".")
    }
    function A(e, t, n, r) {
        var i = a();
        return n && Object.keys(r).forEach((function(n) {
            if (!t[n] && !0 === t.auto) {
                var a = i.createElement("div");
                a.className = r[n],
                e.append(a),
                t[n] = a
            }
        }
        )),
        t
    }
    function k() {
        return g || (g = function() {
            var e = o()
              , t = a();
            return {
                touch: !!("ontouchstart"in e || e.DocumentTouch && t instanceof e.DocumentTouch),
                pointerEvents: !!e.PointerEvent && "maxTouchPoints"in e.navigator && e.navigator.maxTouchPoints >= 0,
                observer: "MutationObserver"in e || "WebkitMutationObserver"in e,
                passiveListener: function() {
                    var t = !1;
                    try {
                        var n = Object.defineProperty({}, "passive", {
                            get: function() {
                                t = !0
                            }
                        });
                        e.addEventListener("testPassiveListener", null, n)
                    } catch (e) {}
                    return t
                }(),
                gestures: "ongesturestart"in e
            }
        }()),
        g
    }
    function L(e) {
        return void 0 === e && (e = {}),
        v || (v = function(e) {
            var t = (void 0 === e ? {} : e).userAgent
              , n = k()
              , r = o()
              , i = r.navigator.platform
              , a = t || r.navigator.userAgent
              , s = {
                ios: !1,
                android: !1
            }
              , l = r.screen.width
              , c = r.screen.height
              , u = a.match(/(Android);?[\s\/]+([\d.]+)?/)
              , d = a.match(/(iPad).*OS\s([\d_]+)/)
              , p = a.match(/(iPod)(.*OS\s([\d_]+))?/)
              , f = !d && a.match(/(iPhone\sOS|iOS)\s([\d_]+)/)
              , h = "Win32" === i
              , m = "MacIntel" === i;
            return !d && m && n.touch && ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"].indexOf(l + "x" + c) >= 0 && ((d = a.match(/(Version)\/([\d.]+)/)) || (d = [0, 1, "13_0_0"]),
            m = !1),
            u && !h && (s.os = "android",
            s.android = !0),
            (d || f || p) && (s.os = "ios",
            s.ios = !0),
            s
        }(e)),
        v
    }
    function M() {
        return b || (b = function() {
            var e, t = o();
            return {
                isEdge: !!t.navigator.userAgent.match(/Edge/g),
                isSafari: (e = t.navigator.userAgent.toLowerCase(),
                e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0),
                isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(t.navigator.userAgent)
            }
        }()),
        b
    }
    Object.keys(y).forEach((function(e) {
        Object.defineProperty(m.fn, e, {
            value: y[e],
            writable: !0
        })
    }
    ));
    var P = {
        name: "resize",
        create: function() {
            var e = this;
            C(e, {
                resize: {
                    observer: null,
                    createObserver: function() {
                        e && !e.destroyed && e.initialized && (e.resize.observer = new ResizeObserver((function(t) {
                            var n = e.width
                              , r = e.height
                              , i = n
                              , a = r;
                            t.forEach((function(t) {
                                var n = t.contentBoxSize
                                  , r = t.contentRect
                                  , s = t.target;
                                s && s !== e.el || (i = r ? r.width : (n[0] || n).inlineSize,
                                a = r ? r.height : (n[0] || n).blockSize)
                            }
                            )),
                            i === n && a === r || e.resize.resizeHandler()
                        }
                        )),
                        e.resize.observer.observe(e.el))
                    },
                    removeObserver: function() {
                        e.resize.observer && e.resize.observer.unobserve && e.el && (e.resize.observer.unobserve(e.el),
                        e.resize.observer = null)
                    },
                    resizeHandler: function() {
                        e && !e.destroyed && e.initialized && (e.emit("beforeResize"),
                        e.emit("resize"))
                    },
                    orientationChangeHandler: function() {
                        e && !e.destroyed && e.initialized && e.emit("orientationchange")
                    }
                }
            })
        },
        on: {
            init: function(e) {
                var t = o();
                e.params.resizeObserver && void 0 !== o().ResizeObserver ? e.resize.createObserver() : (t.addEventListener("resize", e.resize.resizeHandler),
                t.addEventListener("orientationchange", e.resize.orientationChangeHandler))
            },
            destroy: function(e) {
                var t = o();
                e.resize.removeObserver(),
                t.removeEventListener("resize", e.resize.resizeHandler),
                t.removeEventListener("orientationchange", e.resize.orientationChangeHandler)
            }
        }
    }
      , I = {
        attach: function(e, t) {
            void 0 === t && (t = {});
            var n = o()
              , r = this
              , i = new (n.MutationObserver || n.WebkitMutationObserver)((function(e) {
                if (1 !== e.length) {
                    var t = function() {
                        r.emit("observerUpdate", e[0])
                    };
                    n.requestAnimationFrame ? n.requestAnimationFrame(t) : n.setTimeout(t, 0)
                } else
                    r.emit("observerUpdate", e[0])
            }
            ));
            i.observe(e, {
                attributes: void 0 === t.attributes || t.attributes,
                childList: void 0 === t.childList || t.childList,
                characterData: void 0 === t.characterData || t.characterData
            }),
            r.observer.observers.push(i)
        },
        init: function() {
            var e = this;
            if (e.support.observer && e.params.observer) {
                if (e.params.observeParents)
                    for (var t = e.$el.parents(), n = 0; n < t.length; n += 1)
                        e.observer.attach(t[n]);
                e.observer.attach(e.$el[0], {
                    childList: e.params.observeSlideChildren
                }),
                e.observer.attach(e.$wrapperEl[0], {
                    attributes: !1
                })
            }
        },
        destroy: function() {
            this.observer.observers.forEach((function(e) {
                e.disconnect()
            }
            )),
            this.observer.observers = []
        }
    }
      , O = {
        name: "observer",
        params: {
            observer: !1,
            observeParents: !1,
            observeSlideChildren: !1
        },
        create: function() {
            E(this, {
                observer: t({}, I, {
                    observers: []
                })
            })
        },
        on: {
            init: function(e) {
                e.observer.init()
            },
            destroy: function(e) {
                e.observer.destroy()
            }
        }
    };
    function N(e) {
        var t = this
          , n = a()
          , r = o()
          , i = t.touchEventsData
          , s = t.params
          , l = t.touches;
        if (t.enabled && (!t.animating || !s.preventInteractionOnTransition)) {
            var c = e;
            c.originalEvent && (c = c.originalEvent);
            var u = m(c.target);
            if (("wrapper" !== s.touchEventsTarget || u.closest(t.wrapperEl).length) && (i.isTouchEvent = "touchstart" === c.type,
            (i.isTouchEvent || !("which"in c) || 3 !== c.which) && !(!i.isTouchEvent && "button"in c && c.button > 0 || i.isTouched && i.isMoved))) {
                s.noSwipingClass && "" !== s.noSwipingClass && c.target && c.target.shadowRoot && e.path && e.path[0] && (u = m(e.path[0]));
                var d = s.noSwipingSelector ? s.noSwipingSelector : "." + s.noSwipingClass
                  , p = !(!c.target || !c.target.shadowRoot);
                if (s.noSwiping && (p ? function(e, t) {
                    return void 0 === t && (t = this),
                    function t(n) {
                        return n && n !== a() && n !== o() ? (n.assignedSlot && (n = n.assignedSlot),
                        n.closest(e) || t(n.getRootNode().host)) : null
                    }(t)
                }(d, c.target) : u.closest(d)[0]))
                    t.allowClick = !0;
                else if (!s.swipeHandler || u.closest(s.swipeHandler)[0]) {
                    l.currentX = "touchstart" === c.type ? c.targetTouches[0].pageX : c.pageX,
                    l.currentY = "touchstart" === c.type ? c.targetTouches[0].pageY : c.pageY;
                    var f = l.currentX
                      , h = l.currentY
                      , g = s.edgeSwipeDetection || s.iOSEdgeSwipeDetection
                      , v = s.edgeSwipeThreshold || s.iOSEdgeSwipeThreshold;
                    if (g && (f <= v || f >= r.innerWidth - v)) {
                        if ("prevent" !== g)
                            return;
                        e.preventDefault()
                    }
                    if (C(i, {
                        isTouched: !0,
                        isMoved: !1,
                        allowTouchCallbacks: !0,
                        isScrolling: void 0,
                        startMoving: void 0
                    }),
                    l.startX = f,
                    l.startY = h,
                    i.touchStartTime = x(),
                    t.allowClick = !0,
                    t.updateSize(),
                    t.swipeDirection = void 0,
                    s.threshold > 0 && (i.allowThresholdMove = !1),
                    "touchstart" !== c.type) {
                        var b = !0;
                        u.is(i.focusableElements) && (b = !1),
                        n.activeElement && m(n.activeElement).is(i.focusableElements) && n.activeElement !== u[0] && n.activeElement.blur();
                        var y = b && t.allowTouchMove && s.touchStartPreventDefault;
                        !s.touchStartForcePreventDefault && !y || u[0].isContentEditable || c.preventDefault()
                    }
                    t.emit("touchStart", c)
                }
            }
        }
    }
    function j(e) {
        var t = a()
          , n = this
          , r = n.touchEventsData
          , i = n.params
          , s = n.touches
          , o = n.rtlTranslate;
        if (n.enabled) {
            var l = e;
            if (l.originalEvent && (l = l.originalEvent),
            r.isTouched) {
                if (!r.isTouchEvent || "touchmove" === l.type) {
                    var c = "touchmove" === l.type && l.targetTouches && (l.targetTouches[0] || l.changedTouches[0])
                      , u = "touchmove" === l.type ? c.pageX : l.pageX
                      , d = "touchmove" === l.type ? c.pageY : l.pageY;
                    if (l.preventedByNestedSwiper)
                        return s.startX = u,
                        void (s.startY = d);
                    if (!n.allowTouchMove)
                        return n.allowClick = !1,
                        void (r.isTouched && (C(s, {
                            startX: u,
                            startY: d,
                            currentX: u,
                            currentY: d
                        }),
                        r.touchStartTime = x()));
                    if (r.isTouchEvent && i.touchReleaseOnEdges && !i.loop)
                        if (n.isVertical()) {
                            if (d < s.startY && n.translate <= n.maxTranslate() || d > s.startY && n.translate >= n.minTranslate())
                                return r.isTouched = !1,
                                void (r.isMoved = !1)
                        } else if (u < s.startX && n.translate <= n.maxTranslate() || u > s.startX && n.translate >= n.minTranslate())
                            return;
                    if (r.isTouchEvent && t.activeElement && l.target === t.activeElement && m(l.target).is(r.focusableElements))
                        return r.isMoved = !0,
                        void (n.allowClick = !1);
                    if (r.allowTouchCallbacks && n.emit("touchMove", l),
                    !(l.targetTouches && l.targetTouches.length > 1)) {
                        s.currentX = u,
                        s.currentY = d;
                        var p, f = s.currentX - s.startX, h = s.currentY - s.startY;
                        if (!(n.params.threshold && Math.sqrt(Math.pow(f, 2) + Math.pow(h, 2)) < n.params.threshold))
                            if (void 0 === r.isScrolling && (n.isHorizontal() && s.currentY === s.startY || n.isVertical() && s.currentX === s.startX ? r.isScrolling = !1 : f * f + h * h >= 25 && (p = 180 * Math.atan2(Math.abs(h), Math.abs(f)) / Math.PI,
                            r.isScrolling = n.isHorizontal() ? p > i.touchAngle : 90 - p > i.touchAngle)),
                            r.isScrolling && n.emit("touchMoveOpposite", l),
                            void 0 === r.startMoving && (s.currentX === s.startX && s.currentY === s.startY || (r.startMoving = !0)),
                            r.isScrolling)
                                r.isTouched = !1;
                            else if (r.startMoving) {
                                n.allowClick = !1,
                                !i.cssMode && l.cancelable && l.preventDefault(),
                                i.touchMoveStopPropagation && !i.nested && l.stopPropagation(),
                                r.isMoved || (i.loop && n.loopFix(),
                                r.startTranslate = n.getTranslate(),
                                n.setTransition(0),
                                n.animating && n.$wrapperEl.trigger("webkitTransitionEnd transitionend"),
                                r.allowMomentumBounce = !1,
                                !i.grabCursor || !0 !== n.allowSlideNext && !0 !== n.allowSlidePrev || n.setGrabCursor(!0),
                                n.emit("sliderFirstMove", l)),
                                n.emit("sliderMove", l),
                                r.isMoved = !0;
                                var g = n.isHorizontal() ? f : h;
                                s.diff = g,
                                g *= i.touchRatio,
                                o && (g = -g),
                                n.swipeDirection = g > 0 ? "prev" : "next",
                                r.currentTranslate = g + r.startTranslate;
                                var v = !0
                                  , b = i.resistanceRatio;
                                if (i.touchReleaseOnEdges && (b = 0),
                                g > 0 && r.currentTranslate > n.minTranslate() ? (v = !1,
                                i.resistance && (r.currentTranslate = n.minTranslate() - 1 + Math.pow(-n.minTranslate() + r.startTranslate + g, b))) : g < 0 && r.currentTranslate < n.maxTranslate() && (v = !1,
                                i.resistance && (r.currentTranslate = n.maxTranslate() + 1 - Math.pow(n.maxTranslate() - r.startTranslate - g, b))),
                                v && (l.preventedByNestedSwiper = !0),
                                !n.allowSlideNext && "next" === n.swipeDirection && r.currentTranslate < r.startTranslate && (r.currentTranslate = r.startTranslate),
                                !n.allowSlidePrev && "prev" === n.swipeDirection && r.currentTranslate > r.startTranslate && (r.currentTranslate = r.startTranslate),
                                n.allowSlidePrev || n.allowSlideNext || (r.currentTranslate = r.startTranslate),
                                i.threshold > 0) {
                                    if (!(Math.abs(g) > i.threshold || r.allowThresholdMove))
                                        return void (r.currentTranslate = r.startTranslate);
                                    if (!r.allowThresholdMove)
                                        return r.allowThresholdMove = !0,
                                        s.startX = s.currentX,
                                        s.startY = s.currentY,
                                        r.currentTranslate = r.startTranslate,
                                        void (s.diff = n.isHorizontal() ? s.currentX - s.startX : s.currentY - s.startY)
                                }
                                i.followFinger && !i.cssMode && ((i.freeMode || i.watchSlidesProgress || i.watchSlidesVisibility) && (n.updateActiveIndex(),
                                n.updateSlidesClasses()),
                                i.freeMode && (0 === r.velocities.length && r.velocities.push({
                                    position: s[n.isHorizontal() ? "startX" : "startY"],
                                    time: r.touchStartTime
                                }),
                                r.velocities.push({
                                    position: s[n.isHorizontal() ? "currentX" : "currentY"],
                                    time: x()
                                })),
                                n.updateProgress(r.currentTranslate),
                                n.setTranslate(r.currentTranslate))
                            }
                    }
                }
            } else
                r.startMoving && r.isScrolling && n.emit("touchMoveOpposite", l)
        }
    }
    function z(e) {
        var t = this
          , n = t.touchEventsData
          , r = t.params
          , i = t.touches
          , a = t.rtlTranslate
          , s = t.$wrapperEl
          , o = t.slidesGrid
          , l = t.snapGrid;
        if (t.enabled) {
            var c = e;
            if (c.originalEvent && (c = c.originalEvent),
            n.allowTouchCallbacks && t.emit("touchEnd", c),
            n.allowTouchCallbacks = !1,
            !n.isTouched)
                return n.isMoved && r.grabCursor && t.setGrabCursor(!1),
                n.isMoved = !1,
                void (n.startMoving = !1);
            r.grabCursor && n.isMoved && n.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
            var u, d = x(), p = d - n.touchStartTime;
            if (t.allowClick && (t.updateClickedSlide(c),
            t.emit("tap click", c),
            p < 300 && d - n.lastClickTime < 300 && t.emit("doubleTap doubleClick", c)),
            n.lastClickTime = x(),
            w((function() {
                t.destroyed || (t.allowClick = !0)
            }
            )),
            !n.isTouched || !n.isMoved || !t.swipeDirection || 0 === i.diff || n.currentTranslate === n.startTranslate)
                return n.isTouched = !1,
                n.isMoved = !1,
                void (n.startMoving = !1);
            if (n.isTouched = !1,
            n.isMoved = !1,
            n.startMoving = !1,
            u = r.followFinger ? a ? t.translate : -t.translate : -n.currentTranslate,
            !r.cssMode)
                if (r.freeMode) {
                    if (u < -t.minTranslate())
                        return void t.slideTo(t.activeIndex);
                    if (u > -t.maxTranslate())
                        return void (t.slides.length < l.length ? t.slideTo(l.length - 1) : t.slideTo(t.slides.length - 1));
                    if (r.freeModeMomentum) {
                        if (n.velocities.length > 1) {
                            var f = n.velocities.pop()
                              , h = n.velocities.pop()
                              , m = f.position - h.position
                              , g = f.time - h.time;
                            t.velocity = m / g,
                            t.velocity /= 2,
                            Math.abs(t.velocity) < r.freeModeMinimumVelocity && (t.velocity = 0),
                            (g > 150 || x() - f.time > 300) && (t.velocity = 0)
                        } else
                            t.velocity = 0;
                        t.velocity *= r.freeModeMomentumVelocityRatio,
                        n.velocities.length = 0;
                        var v = 1e3 * r.freeModeMomentumRatio
                          , b = t.velocity * v
                          , y = t.translate + b;
                        a && (y = -y);
                        var T, S, _ = !1, C = 20 * Math.abs(t.velocity) * r.freeModeMomentumBounceRatio;
                        if (y < t.maxTranslate())
                            r.freeModeMomentumBounce ? (y + t.maxTranslate() < -C && (y = t.maxTranslate() - C),
                            T = t.maxTranslate(),
                            _ = !0,
                            n.allowMomentumBounce = !0) : y = t.maxTranslate(),
                            r.loop && r.centeredSlides && (S = !0);
                        else if (y > t.minTranslate())
                            r.freeModeMomentumBounce ? (y - t.minTranslate() > C && (y = t.minTranslate() + C),
                            T = t.minTranslate(),
                            _ = !0,
                            n.allowMomentumBounce = !0) : y = t.minTranslate(),
                            r.loop && r.centeredSlides && (S = !0);
                        else if (r.freeModeSticky) {
                            for (var E, D = 0; D < l.length; D += 1)
                                if (l[D] > -y) {
                                    E = D;
                                    break
                                }
                            y = -(y = Math.abs(l[E] - y) < Math.abs(l[E - 1] - y) || "next" === t.swipeDirection ? l[E] : l[E - 1])
                        }
                        if (S && t.once("transitionEnd", (function() {
                            t.loopFix()
                        }
                        )),
                        0 !== t.velocity) {
                            if (v = a ? Math.abs((-y - t.translate) / t.velocity) : Math.abs((y - t.translate) / t.velocity),
                            r.freeModeSticky) {
                                var A = Math.abs((a ? -y : y) - t.translate)
                                  , k = t.slidesSizesGrid[t.activeIndex];
                                v = A < k ? r.speed : A < 2 * k ? 1.5 * r.speed : 2.5 * r.speed
                            }
                        } else if (r.freeModeSticky)
                            return void t.slideToClosest();
                        r.freeModeMomentumBounce && _ ? (t.updateProgress(T),
                        t.setTransition(v),
                        t.setTranslate(y),
                        t.transitionStart(!0, t.swipeDirection),
                        t.animating = !0,
                        s.transitionEnd((function() {
                            t && !t.destroyed && n.allowMomentumBounce && (t.emit("momentumBounce"),
                            t.setTransition(r.speed),
                            setTimeout((function() {
                                t.setTranslate(T),
                                s.transitionEnd((function() {
                                    t && !t.destroyed && t.transitionEnd()
                                }
                                ))
                            }
                            ), 0))
                        }
                        ))) : t.velocity ? (t.updateProgress(y),
                        t.setTransition(v),
                        t.setTranslate(y),
                        t.transitionStart(!0, t.swipeDirection),
                        t.animating || (t.animating = !0,
                        s.transitionEnd((function() {
                            t && !t.destroyed && t.transitionEnd()
                        }
                        )))) : (t.emit("_freeModeNoMomentumRelease"),
                        t.updateProgress(y)),
                        t.updateActiveIndex(),
                        t.updateSlidesClasses()
                    } else {
                        if (r.freeModeSticky)
                            return void t.slideToClosest();
                        r.freeMode && t.emit("_freeModeNoMomentumRelease")
                    }
                    (!r.freeModeMomentum || p >= r.longSwipesMs) && (t.updateProgress(),
                    t.updateActiveIndex(),
                    t.updateSlidesClasses())
                } else {
                    for (var L = 0, M = t.slidesSizesGrid[0], P = 0; P < o.length; P += P < r.slidesPerGroupSkip ? 1 : r.slidesPerGroup) {
                        var I = P < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
                        void 0 !== o[P + I] ? u >= o[P] && u < o[P + I] && (L = P,
                        M = o[P + I] - o[P]) : u >= o[P] && (L = P,
                        M = o[o.length - 1] - o[o.length - 2])
                    }
                    var O = (u - o[L]) / M
                      , N = L < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
                    if (p > r.longSwipesMs) {
                        if (!r.longSwipes)
                            return void t.slideTo(t.activeIndex);
                        "next" === t.swipeDirection && (O >= r.longSwipesRatio ? t.slideTo(L + N) : t.slideTo(L)),
                        "prev" === t.swipeDirection && (O > 1 - r.longSwipesRatio ? t.slideTo(L + N) : t.slideTo(L))
                    } else {
                        if (!r.shortSwipes)
                            return void t.slideTo(t.activeIndex);
                        !t.navigation || c.target !== t.navigation.nextEl && c.target !== t.navigation.prevEl ? ("next" === t.swipeDirection && t.slideTo(L + N),
                        "prev" === t.swipeDirection && t.slideTo(L)) : c.target === t.navigation.nextEl ? t.slideTo(L + N) : t.slideTo(L)
                    }
                }
        }
    }
    function H() {
        var e = this
          , t = e.params
          , n = e.el;
        if (!n || 0 !== n.offsetWidth) {
            t.breakpoints && e.setBreakpoint();
            var r = e.allowSlideNext
              , i = e.allowSlidePrev
              , a = e.snapGrid;
            e.allowSlideNext = !0,
            e.allowSlidePrev = !0,
            e.updateSize(),
            e.updateSlides(),
            e.updateSlidesClasses(),
            ("auto" === t.slidesPerView || t.slidesPerView > 1) && e.isEnd && !e.isBeginning && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0),
            e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.run(),
            e.allowSlidePrev = i,
            e.allowSlideNext = r,
            e.params.watchOverflow && a !== e.snapGrid && e.checkOverflow()
        }
    }
    function $(e) {
        var t = this;
        t.enabled && (t.allowClick || (t.params.preventClicks && e.preventDefault(),
        t.params.preventClicksPropagation && t.animating && (e.stopPropagation(),
        e.stopImmediatePropagation())))
    }
    function F() {
        var e = this
          , t = e.wrapperEl
          , n = e.rtlTranslate;
        if (e.enabled) {
            e.previousTranslate = e.translate,
            e.isHorizontal() ? e.translate = n ? t.scrollWidth - t.offsetWidth - t.scrollLeft : -t.scrollLeft : e.translate = -t.scrollTop,
            -0 === e.translate && (e.translate = 0),
            e.updateActiveIndex(),
            e.updateSlidesClasses();
            var r = e.maxTranslate() - e.minTranslate();
            (0 === r ? 0 : (e.translate - e.minTranslate()) / r) !== e.progress && e.updateProgress(n ? -e.translate : e.translate),
            e.emit("setTranslate", e.translate, !1)
        }
    }
    var R = !1;
    function B() {}
    var W = {
        init: !0,
        direction: "horizontal",
        touchEventsTarget: "container",
        initialSlide: 0,
        speed: 300,
        cssMode: !1,
        updateOnWindowResize: !0,
        resizeObserver: !1,
        nested: !1,
        createElements: !1,
        enabled: !0,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: !1,
        userAgent: null,
        url: null,
        edgeSwipeDetection: !1,
        edgeSwipeThreshold: 20,
        freeMode: !1,
        freeModeMomentum: !0,
        freeModeMomentumRatio: 1,
        freeModeMomentumBounce: !0,
        freeModeMomentumBounceRatio: 1,
        freeModeMomentumVelocityRatio: 1,
        freeModeSticky: !1,
        freeModeMinimumVelocity: .02,
        autoHeight: !1,
        setWrapperSize: !1,
        virtualTranslate: !1,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerColumnFill: "column",
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        centeredSlides: !1,
        centeredSlidesBounds: !1,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: !0,
        centerInsufficientSlides: !1,
        watchOverflow: !1,
        roundLengths: !1,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: !0,
        shortSwipes: !0,
        longSwipes: !0,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: !0,
        allowTouchMove: !0,
        threshold: 0,
        touchMoveStopPropagation: !1,
        touchStartPreventDefault: !0,
        touchStartForcePreventDefault: !1,
        touchReleaseOnEdges: !1,
        uniqueNavElements: !0,
        resistance: !0,
        resistanceRatio: .85,
        watchSlidesProgress: !1,
        watchSlidesVisibility: !1,
        grabCursor: !1,
        preventClicks: !0,
        preventClicksPropagation: !0,
        slideToClickedSlide: !1,
        preloadImages: !0,
        updateOnImagesReady: !0,
        loop: !1,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopFillGroupWithBlank: !1,
        loopPreventsSlide: !0,
        allowSlidePrev: !0,
        allowSlideNext: !0,
        swipeHandler: null,
        noSwiping: !0,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: !0,
        containerModifierClass: "swiper-container-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: !0,
        _emitClasses: !1
    }
      , q = {
        modular: {
            useParams: function(e) {
                var t = this;
                t.modules && Object.keys(t.modules).forEach((function(n) {
                    var r = t.modules[n];
                    r.params && C(e, r.params)
                }
                ))
            },
            useModules: function(e) {
                void 0 === e && (e = {});
                var t = this;
                t.modules && Object.keys(t.modules).forEach((function(n) {
                    var r = t.modules[n]
                      , i = e[n] || {};
                    r.on && t.on && Object.keys(r.on).forEach((function(e) {
                        t.on(e, r.on[e])
                    }
                    )),
                    r.create && r.create.bind(t)(i)
                }
                ))
            }
        },
        eventsEmitter: {
            on: function(e, t, n) {
                var r = this;
                if ("function" != typeof t)
                    return r;
                var i = n ? "unshift" : "push";
                return e.split(" ").forEach((function(e) {
                    r.eventsListeners[e] || (r.eventsListeners[e] = []),
                    r.eventsListeners[e][i](t)
                }
                )),
                r
            },
            once: function(e, t, n) {
                var r = this;
                if ("function" != typeof t)
                    return r;
                function i() {
                    r.off(e, i),
                    i.__emitterProxy && delete i.__emitterProxy;
                    for (var n = arguments.length, a = new Array(n), s = 0; s < n; s++)
                        a[s] = arguments[s];
                    t.apply(r, a)
                }
                return i.__emitterProxy = t,
                r.on(e, i, n)
            },
            onAny: function(e, t) {
                var n = this;
                if ("function" != typeof e)
                    return n;
                var r = t ? "unshift" : "push";
                return n.eventsAnyListeners.indexOf(e) < 0 && n.eventsAnyListeners[r](e),
                n
            },
            offAny: function(e) {
                var t = this;
                if (!t.eventsAnyListeners)
                    return t;
                var n = t.eventsAnyListeners.indexOf(e);
                return n >= 0 && t.eventsAnyListeners.splice(n, 1),
                t
            },
            off: function(e, t) {
                var n = this;
                return n.eventsListeners ? (e.split(" ").forEach((function(e) {
                    void 0 === t ? n.eventsListeners[e] = [] : n.eventsListeners[e] && n.eventsListeners[e].forEach((function(r, i) {
                        (r === t || r.__emitterProxy && r.__emitterProxy === t) && n.eventsListeners[e].splice(i, 1)
                    }
                    ))
                }
                )),
                n) : n
            },
            emit: function() {
                var e, t, n, r = this;
                if (!r.eventsListeners)
                    return r;
                for (var i = arguments.length, a = new Array(i), s = 0; s < i; s++)
                    a[s] = arguments[s];
                return "string" == typeof a[0] || Array.isArray(a[0]) ? (e = a[0],
                t = a.slice(1, a.length),
                n = r) : (e = a[0].events,
                t = a[0].data,
                n = a[0].context || r),
                t.unshift(n),
                (Array.isArray(e) ? e : e.split(" ")).forEach((function(e) {
                    r.eventsAnyListeners && r.eventsAnyListeners.length && r.eventsAnyListeners.forEach((function(r) {
                        r.apply(n, [e].concat(t))
                    }
                    )),
                    r.eventsListeners && r.eventsListeners[e] && r.eventsListeners[e].forEach((function(e) {
                        e.apply(n, t)
                    }
                    ))
                }
                )),
                r
            }
        },
        update: {
            updateSize: function() {
                var e, t, n = this, r = n.$el;
                e = void 0 !== n.params.width && null !== n.params.width ? n.params.width : r[0].clientWidth,
                t = void 0 !== n.params.height && null !== n.params.height ? n.params.height : r[0].clientHeight,
                0 === e && n.isHorizontal() || 0 === t && n.isVertical() || (e = e - parseInt(r.css("padding-left") || 0, 10) - parseInt(r.css("padding-right") || 0, 10),
                t = t - parseInt(r.css("padding-top") || 0, 10) - parseInt(r.css("padding-bottom") || 0, 10),
                Number.isNaN(e) && (e = 0),
                Number.isNaN(t) && (t = 0),
                C(n, {
                    width: e,
                    height: t,
                    size: n.isHorizontal() ? e : t
                }))
            },
            updateSlides: function() {
                var e = this;
                function t(t) {
                    return e.isHorizontal() ? t : {
                        width: "height",
                        "margin-top": "margin-left",
                        "margin-bottom ": "margin-right",
                        "margin-left": "margin-top",
                        "margin-right": "margin-bottom",
                        "padding-left": "padding-top",
                        "padding-right": "padding-bottom",
                        marginRight: "marginBottom"
                    }[t]
                }
                function n(e, n) {
                    return parseFloat(e.getPropertyValue(t(n)) || 0)
                }
                var r = e.params
                  , i = e.$wrapperEl
                  , a = e.size
                  , s = e.rtlTranslate
                  , o = e.wrongRTL
                  , l = e.virtual && r.virtual.enabled
                  , c = l ? e.virtual.slides.length : e.slides.length
                  , u = i.children("." + e.params.slideClass)
                  , d = l ? e.virtual.slides.length : u.length
                  , p = []
                  , f = []
                  , h = []
                  , m = r.slidesOffsetBefore;
                "function" == typeof m && (m = r.slidesOffsetBefore.call(e));
                var g = r.slidesOffsetAfter;
                "function" == typeof g && (g = r.slidesOffsetAfter.call(e));
                var v = e.snapGrid.length
                  , b = e.slidesGrid.length
                  , y = r.spaceBetween
                  , w = -m
                  , x = 0
                  , T = 0;
                if (void 0 !== a) {
                    var S, _;
                    "string" == typeof y && y.indexOf("%") >= 0 && (y = parseFloat(y.replace("%", "")) / 100 * a),
                    e.virtualSize = -y,
                    s ? u.css({
                        marginLeft: "",
                        marginBottom: "",
                        marginTop: ""
                    }) : u.css({
                        marginRight: "",
                        marginBottom: "",
                        marginTop: ""
                    }),
                    r.slidesPerColumn > 1 && (S = Math.floor(d / r.slidesPerColumn) === d / e.params.slidesPerColumn ? d : Math.ceil(d / r.slidesPerColumn) * r.slidesPerColumn,
                    "auto" !== r.slidesPerView && "row" === r.slidesPerColumnFill && (S = Math.max(S, r.slidesPerView * r.slidesPerColumn)));
                    for (var E, D, A, k = r.slidesPerColumn, L = S / k, M = Math.floor(d / r.slidesPerColumn), P = 0; P < d; P += 1) {
                        _ = 0;
                        var I = u.eq(P);
                        if (r.slidesPerColumn > 1) {
                            var O = void 0
                              , N = void 0
                              , j = void 0;
                            if ("row" === r.slidesPerColumnFill && r.slidesPerGroup > 1) {
                                var z = Math.floor(P / (r.slidesPerGroup * r.slidesPerColumn))
                                  , H = P - r.slidesPerColumn * r.slidesPerGroup * z
                                  , $ = 0 === z ? r.slidesPerGroup : Math.min(Math.ceil((d - z * k * r.slidesPerGroup) / k), r.slidesPerGroup);
                                O = (N = H - (j = Math.floor(H / $)) * $ + z * r.slidesPerGroup) + j * S / k,
                                I.css({
                                    "-webkit-box-ordinal-group": O,
                                    "-moz-box-ordinal-group": O,
                                    "-ms-flex-order": O,
                                    "-webkit-order": O,
                                    order: O
                                })
                            } else
                                "column" === r.slidesPerColumnFill ? (j = P - (N = Math.floor(P / k)) * k,
                                (N > M || N === M && j === k - 1) && (j += 1) >= k && (j = 0,
                                N += 1)) : N = P - (j = Math.floor(P / L)) * L;
                            I.css(t("margin-top"), 0 !== j ? r.spaceBetween && r.spaceBetween + "px" : "")
                        }
                        if ("none" !== I.css("display")) {
                            if ("auto" === r.slidesPerView) {
                                var F = getComputedStyle(I[0])
                                  , R = I[0].style.transform
                                  , B = I[0].style.webkitTransform;
                                if (R && (I[0].style.transform = "none"),
                                B && (I[0].style.webkitTransform = "none"),
                                r.roundLengths)
                                    _ = e.isHorizontal() ? I.outerWidth(!0) : I.outerHeight(!0);
                                else {
                                    var W = n(F, "width")
                                      , q = n(F, "padding-left")
                                      , X = n(F, "padding-right")
                                      , V = n(F, "margin-left")
                                      , G = n(F, "margin-right")
                                      , Y = F.getPropertyValue("box-sizing");
                                    if (Y && "border-box" === Y)
                                        _ = W + V + G;
                                    else {
                                        var U = I[0]
                                          , K = U.clientWidth;
                                        _ = W + q + X + V + G + (U.offsetWidth - K)
                                    }
                                }
                                R && (I[0].style.transform = R),
                                B && (I[0].style.webkitTransform = B),
                                r.roundLengths && (_ = Math.floor(_))
                            } else
                                _ = (a - (r.slidesPerView - 1) * y) / r.slidesPerView,
                                r.roundLengths && (_ = Math.floor(_)),
                                u[P] && (u[P].style[t("width")] = _ + "px");
                            u[P] && (u[P].swiperSlideSize = _),
                            h.push(_),
                            r.centeredSlides ? (w = w + _ / 2 + x / 2 + y,
                            0 === x && 0 !== P && (w = w - a / 2 - y),
                            0 === P && (w = w - a / 2 - y),
                            Math.abs(w) < .001 && (w = 0),
                            r.roundLengths && (w = Math.floor(w)),
                            T % r.slidesPerGroup == 0 && p.push(w),
                            f.push(w)) : (r.roundLengths && (w = Math.floor(w)),
                            (T - Math.min(e.params.slidesPerGroupSkip, T)) % e.params.slidesPerGroup == 0 && p.push(w),
                            f.push(w),
                            w = w + _ + y),
                            e.virtualSize += _ + y,
                            x = _,
                            T += 1
                        }
                    }
                    if (e.virtualSize = Math.max(e.virtualSize, a) + g,
                    s && o && ("slide" === r.effect || "coverflow" === r.effect) && i.css({
                        width: e.virtualSize + r.spaceBetween + "px"
                    }),
                    r.setWrapperSize && i.css(((D = {})[t("width")] = e.virtualSize + r.spaceBetween + "px",
                    D)),
                    r.slidesPerColumn > 1 && (e.virtualSize = (_ + r.spaceBetween) * S,
                    e.virtualSize = Math.ceil(e.virtualSize / r.slidesPerColumn) - r.spaceBetween,
                    i.css(((A = {})[t("width")] = e.virtualSize + r.spaceBetween + "px",
                    A)),
                    r.centeredSlides)) {
                        E = [];
                        for (var J = 0; J < p.length; J += 1) {
                            var Q = p[J];
                            r.roundLengths && (Q = Math.floor(Q)),
                            p[J] < e.virtualSize + p[0] && E.push(Q)
                        }
                        p = E
                    }
                    if (!r.centeredSlides) {
                        E = [];
                        for (var Z = 0; Z < p.length; Z += 1) {
                            var ee = p[Z];
                            r.roundLengths && (ee = Math.floor(ee)),
                            p[Z] <= e.virtualSize - a && E.push(ee)
                        }
                        p = E,
                        Math.floor(e.virtualSize - a) - Math.floor(p[p.length - 1]) > 1 && p.push(e.virtualSize - a)
                    }
                    if (0 === p.length && (p = [0]),
                    0 !== r.spaceBetween) {
                        var te, ne = e.isHorizontal() && s ? "marginLeft" : t("marginRight");
                        u.filter((function(e, t) {
                            return !r.cssMode || t !== u.length - 1
                        }
                        )).css(((te = {})[ne] = y + "px",
                        te))
                    }
                    if (r.centeredSlides && r.centeredSlidesBounds) {
                        var re = 0;
                        h.forEach((function(e) {
                            re += e + (r.spaceBetween ? r.spaceBetween : 0)
                        }
                        ));
                        var ie = (re -= r.spaceBetween) - a;
                        p = p.map((function(e) {
                            return e < 0 ? -m : e > ie ? ie + g : e
                        }
                        ))
                    }
                    if (r.centerInsufficientSlides) {
                        var ae = 0;
                        if (h.forEach((function(e) {
                            ae += e + (r.spaceBetween ? r.spaceBetween : 0)
                        }
                        )),
                        (ae -= r.spaceBetween) < a) {
                            var se = (a - ae) / 2;
                            p.forEach((function(e, t) {
                                p[t] = e - se
                            }
                            )),
                            f.forEach((function(e, t) {
                                f[t] = e + se
                            }
                            ))
                        }
                    }
                    C(e, {
                        slides: u,
                        snapGrid: p,
                        slidesGrid: f,
                        slidesSizesGrid: h
                    }),
                    d !== c && e.emit("slidesLengthChange"),
                    p.length !== v && (e.params.watchOverflow && e.checkOverflow(),
                    e.emit("snapGridLengthChange")),
                    f.length !== b && e.emit("slidesGridLengthChange"),
                    (r.watchSlidesProgress || r.watchSlidesVisibility) && e.updateSlidesOffset()
                }
            },
            updateAutoHeight: function(e) {
                var t, n = this, r = [], i = n.virtual && n.params.virtual.enabled, a = 0;
                "number" == typeof e ? n.setTransition(e) : !0 === e && n.setTransition(n.params.speed);
                var s = function(e) {
                    return i ? n.slides.filter((function(t) {
                        return parseInt(t.getAttribute("data-swiper-slide-index"), 10) === e
                    }
                    ))[0] : n.slides.eq(e)[0]
                };
                if ("auto" !== n.params.slidesPerView && n.params.slidesPerView > 1)
                    if (n.params.centeredSlides)
                        n.visibleSlides.each((function(e) {
                            r.push(e)
                        }
                        ));
                    else
                        for (t = 0; t < Math.ceil(n.params.slidesPerView); t += 1) {
                            var o = n.activeIndex + t;
                            if (o > n.slides.length && !i)
                                break;
                            r.push(s(o))
                        }
                else
                    r.push(s(n.activeIndex));
                for (t = 0; t < r.length; t += 1)
                    if (void 0 !== r[t]) {
                        var l = r[t].offsetHeight;
                        a = l > a ? l : a
                    }
                a && n.$wrapperEl.css("height", a + "px")
            },
            updateSlidesOffset: function() {
                for (var e = this.slides, t = 0; t < e.length; t += 1)
                    e[t].swiperSlideOffset = this.isHorizontal() ? e[t].offsetLeft : e[t].offsetTop
            },
            updateSlidesProgress: function(e) {
                void 0 === e && (e = this && this.translate || 0);
                var t = this
                  , n = t.params
                  , r = t.slides
                  , i = t.rtlTranslate;
                if (0 !== r.length) {
                    void 0 === r[0].swiperSlideOffset && t.updateSlidesOffset();
                    var a = -e;
                    i && (a = e),
                    r.removeClass(n.slideVisibleClass),
                    t.visibleSlidesIndexes = [],
                    t.visibleSlides = [];
                    for (var s = 0; s < r.length; s += 1) {
                        var o = r[s]
                          , l = (a + (n.centeredSlides ? t.minTranslate() : 0) - o.swiperSlideOffset) / (o.swiperSlideSize + n.spaceBetween);
                        if (n.watchSlidesVisibility || n.centeredSlides && n.autoHeight) {
                            var c = -(a - o.swiperSlideOffset)
                              , u = c + t.slidesSizesGrid[s];
                            (c >= 0 && c < t.size - 1 || u > 1 && u <= t.size || c <= 0 && u >= t.size) && (t.visibleSlides.push(o),
                            t.visibleSlidesIndexes.push(s),
                            r.eq(s).addClass(n.slideVisibleClass))
                        }
                        o.progress = i ? -l : l
                    }
                    t.visibleSlides = m(t.visibleSlides)
                }
            },
            updateProgress: function(e) {
                var t = this;
                if (void 0 === e) {
                    var n = t.rtlTranslate ? -1 : 1;
                    e = t && t.translate && t.translate * n || 0
                }
                var r = t.params
                  , i = t.maxTranslate() - t.minTranslate()
                  , a = t.progress
                  , s = t.isBeginning
                  , o = t.isEnd
                  , l = s
                  , c = o;
                0 === i ? (a = 0,
                s = !0,
                o = !0) : (s = (a = (e - t.minTranslate()) / i) <= 0,
                o = a >= 1),
                C(t, {
                    progress: a,
                    isBeginning: s,
                    isEnd: o
                }),
                (r.watchSlidesProgress || r.watchSlidesVisibility || r.centeredSlides && r.autoHeight) && t.updateSlidesProgress(e),
                s && !l && t.emit("reachBeginning toEdge"),
                o && !c && t.emit("reachEnd toEdge"),
                (l && !s || c && !o) && t.emit("fromEdge"),
                t.emit("progress", a)
            },
            updateSlidesClasses: function() {
                var e, t = this, n = t.slides, r = t.params, i = t.$wrapperEl, a = t.activeIndex, s = t.realIndex, o = t.virtual && r.virtual.enabled;
                n.removeClass(r.slideActiveClass + " " + r.slideNextClass + " " + r.slidePrevClass + " " + r.slideDuplicateActiveClass + " " + r.slideDuplicateNextClass + " " + r.slideDuplicatePrevClass),
                (e = o ? t.$wrapperEl.find("." + r.slideClass + '[data-swiper-slide-index="' + a + '"]') : n.eq(a)).addClass(r.slideActiveClass),
                r.loop && (e.hasClass(r.slideDuplicateClass) ? i.children("." + r.slideClass + ":not(." + r.slideDuplicateClass + ')[data-swiper-slide-index="' + s + '"]').addClass(r.slideDuplicateActiveClass) : i.children("." + r.slideClass + "." + r.slideDuplicateClass + '[data-swiper-slide-index="' + s + '"]').addClass(r.slideDuplicateActiveClass));
                var l = e.nextAll("." + r.slideClass).eq(0).addClass(r.slideNextClass);
                r.loop && 0 === l.length && (l = n.eq(0)).addClass(r.slideNextClass);
                var c = e.prevAll("." + r.slideClass).eq(0).addClass(r.slidePrevClass);
                r.loop && 0 === c.length && (c = n.eq(-1)).addClass(r.slidePrevClass),
                r.loop && (l.hasClass(r.slideDuplicateClass) ? i.children("." + r.slideClass + ":not(." + r.slideDuplicateClass + ')[data-swiper-slide-index="' + l.attr("data-swiper-slide-index") + '"]').addClass(r.slideDuplicateNextClass) : i.children("." + r.slideClass + "." + r.slideDuplicateClass + '[data-swiper-slide-index="' + l.attr("data-swiper-slide-index") + '"]').addClass(r.slideDuplicateNextClass),
                c.hasClass(r.slideDuplicateClass) ? i.children("." + r.slideClass + ":not(." + r.slideDuplicateClass + ')[data-swiper-slide-index="' + c.attr("data-swiper-slide-index") + '"]').addClass(r.slideDuplicatePrevClass) : i.children("." + r.slideClass + "." + r.slideDuplicateClass + '[data-swiper-slide-index="' + c.attr("data-swiper-slide-index") + '"]').addClass(r.slideDuplicatePrevClass)),
                t.emitSlidesClasses()
            },
            updateActiveIndex: function(e) {
                var t, n = this, r = n.rtlTranslate ? n.translate : -n.translate, i = n.slidesGrid, a = n.snapGrid, s = n.params, o = n.activeIndex, l = n.realIndex, c = n.snapIndex, u = e;
                if (void 0 === u) {
                    for (var d = 0; d < i.length; d += 1)
                        void 0 !== i[d + 1] ? r >= i[d] && r < i[d + 1] - (i[d + 1] - i[d]) / 2 ? u = d : r >= i[d] && r < i[d + 1] && (u = d + 1) : r >= i[d] && (u = d);
                    s.normalizeSlideIndex && (u < 0 || void 0 === u) && (u = 0)
                }
                if (a.indexOf(r) >= 0)
                    t = a.indexOf(r);
                else {
                    var p = Math.min(s.slidesPerGroupSkip, u);
                    t = p + Math.floor((u - p) / s.slidesPerGroup)
                }
                if (t >= a.length && (t = a.length - 1),
                u !== o) {
                    var f = parseInt(n.slides.eq(u).attr("data-swiper-slide-index") || u, 10);
                    C(n, {
                        snapIndex: t,
                        realIndex: f,
                        previousIndex: o,
                        activeIndex: u
                    }),
                    n.emit("activeIndexChange"),
                    n.emit("snapIndexChange"),
                    l !== f && n.emit("realIndexChange"),
                    (n.initialized || n.params.runCallbacksOnInit) && n.emit("slideChange")
                } else
                    t !== c && (n.snapIndex = t,
                    n.emit("snapIndexChange"))
            },
            updateClickedSlide: function(e) {
                var t, n = this, r = n.params, i = m(e.target).closest("." + r.slideClass)[0], a = !1;
                if (i)
                    for (var s = 0; s < n.slides.length; s += 1)
                        if (n.slides[s] === i) {
                            a = !0,
                            t = s;
                            break
                        }
                if (!i || !a)
                    return n.clickedSlide = void 0,
                    void (n.clickedIndex = void 0);
                n.clickedSlide = i,
                n.virtual && n.params.virtual.enabled ? n.clickedIndex = parseInt(m(i).attr("data-swiper-slide-index"), 10) : n.clickedIndex = t,
                r.slideToClickedSlide && void 0 !== n.clickedIndex && n.clickedIndex !== n.activeIndex && n.slideToClickedSlide()
            }
        },
        translate: {
            getTranslate: function(e) {
                void 0 === e && (e = this.isHorizontal() ? "x" : "y");
                var t = this
                  , n = t.params
                  , r = t.rtlTranslate
                  , i = t.translate
                  , a = t.$wrapperEl;
                if (n.virtualTranslate)
                    return r ? -i : i;
                if (n.cssMode)
                    return i;
                var s = T(a[0], e);
                return r && (s = -s),
                s || 0
            },
            setTranslate: function(e, t) {
                var n = this
                  , r = n.rtlTranslate
                  , i = n.params
                  , a = n.$wrapperEl
                  , s = n.wrapperEl
                  , o = n.progress
                  , l = 0
                  , c = 0;
                n.isHorizontal() ? l = r ? -e : e : c = e,
                i.roundLengths && (l = Math.floor(l),
                c = Math.floor(c)),
                i.cssMode ? s[n.isHorizontal() ? "scrollLeft" : "scrollTop"] = n.isHorizontal() ? -l : -c : i.virtualTranslate || a.transform("translate3d(" + l + "px, " + c + "px, 0px)"),
                n.previousTranslate = n.translate,
                n.translate = n.isHorizontal() ? l : c;
                var u = n.maxTranslate() - n.minTranslate();
                (0 === u ? 0 : (e - n.minTranslate()) / u) !== o && n.updateProgress(e),
                n.emit("setTranslate", n.translate, t)
            },
            minTranslate: function() {
                return -this.snapGrid[0]
            },
            maxTranslate: function() {
                return -this.snapGrid[this.snapGrid.length - 1]
            },
            translateTo: function(e, t, n, r, i) {
                void 0 === e && (e = 0),
                void 0 === t && (t = this.params.speed),
                void 0 === n && (n = !0),
                void 0 === r && (r = !0);
                var a = this
                  , s = a.params
                  , o = a.wrapperEl;
                if (a.animating && s.preventInteractionOnTransition)
                    return !1;
                var l, c = a.minTranslate(), u = a.maxTranslate();
                if (l = r && e > c ? c : r && e < u ? u : e,
                a.updateProgress(l),
                s.cssMode) {
                    var d, p = a.isHorizontal();
                    return 0 === t ? o[p ? "scrollLeft" : "scrollTop"] = -l : o.scrollTo ? o.scrollTo(((d = {})[p ? "left" : "top"] = -l,
                    d.behavior = "smooth",
                    d)) : o[p ? "scrollLeft" : "scrollTop"] = -l,
                    !0
                }
                return 0 === t ? (a.setTransition(0),
                a.setTranslate(l),
                n && (a.emit("beforeTransitionStart", t, i),
                a.emit("transitionEnd"))) : (a.setTransition(t),
                a.setTranslate(l),
                n && (a.emit("beforeTransitionStart", t, i),
                a.emit("transitionStart")),
                a.animating || (a.animating = !0,
                a.onTranslateToWrapperTransitionEnd || (a.onTranslateToWrapperTransitionEnd = function(e) {
                    a && !a.destroyed && e.target === this && (a.$wrapperEl[0].removeEventListener("transitionend", a.onTranslateToWrapperTransitionEnd),
                    a.$wrapperEl[0].removeEventListener("webkitTransitionEnd", a.onTranslateToWrapperTransitionEnd),
                    a.onTranslateToWrapperTransitionEnd = null,
                    delete a.onTranslateToWrapperTransitionEnd,
                    n && a.emit("transitionEnd"))
                }
                ),
                a.$wrapperEl[0].addEventListener("transitionend", a.onTranslateToWrapperTransitionEnd),
                a.$wrapperEl[0].addEventListener("webkitTransitionEnd", a.onTranslateToWrapperTransitionEnd))),
                !0
            }
        },
        transition: {
            setTransition: function(e, t) {
                var n = this;
                n.params.cssMode || n.$wrapperEl.transition(e),
                n.emit("setTransition", e, t)
            },
            transitionStart: function(e, t) {
                void 0 === e && (e = !0);
                var n = this
                  , r = n.activeIndex
                  , i = n.params
                  , a = n.previousIndex;
                if (!i.cssMode) {
                    i.autoHeight && n.updateAutoHeight();
                    var s = t;
                    if (s || (s = r > a ? "next" : r < a ? "prev" : "reset"),
                    n.emit("transitionStart"),
                    e && r !== a) {
                        if ("reset" === s)
                            return void n.emit("slideResetTransitionStart");
                        n.emit("slideChangeTransitionStart"),
                        "next" === s ? n.emit("slideNextTransitionStart") : n.emit("slidePrevTransitionStart")
                    }
                }
            },
            transitionEnd: function(e, t) {
                void 0 === e && (e = !0);
                var n = this
                  , r = n.activeIndex
                  , i = n.previousIndex
                  , a = n.params;
                if (n.animating = !1,
                !a.cssMode) {
                    n.setTransition(0);
                    var s = t;
                    if (s || (s = r > i ? "next" : r < i ? "prev" : "reset"),
                    n.emit("transitionEnd"),
                    e && r !== i) {
                        if ("reset" === s)
                            return void n.emit("slideResetTransitionEnd");
                        n.emit("slideChangeTransitionEnd"),
                        "next" === s ? n.emit("slideNextTransitionEnd") : n.emit("slidePrevTransitionEnd")
                    }
                }
            }
        },
        slide: {
            slideTo: function(e, t, n, r, i) {
                if (void 0 === e && (e = 0),
                void 0 === t && (t = this.params.speed),
                void 0 === n && (n = !0),
                "number" != typeof e && "string" != typeof e)
                    throw new Error("The 'index' argument cannot have type other than 'number' or 'string'. [" + typeof e + "] given.");
                if ("string" == typeof e) {
                    var a = parseInt(e, 10);
                    if (!isFinite(a))
                        throw new Error("The passed-in 'index' (string) couldn't be converted to 'number'. [" + e + "] given.");
                    e = a
                }
                var s = this
                  , o = e;
                o < 0 && (o = 0);
                var l = s.params
                  , c = s.snapGrid
                  , u = s.slidesGrid
                  , d = s.previousIndex
                  , p = s.activeIndex
                  , f = s.rtlTranslate
                  , h = s.wrapperEl
                  , m = s.enabled;
                if (s.animating && l.preventInteractionOnTransition || !m && !r && !i)
                    return !1;
                var g = Math.min(s.params.slidesPerGroupSkip, o)
                  , v = g + Math.floor((o - g) / s.params.slidesPerGroup);
                v >= c.length && (v = c.length - 1),
                (p || l.initialSlide || 0) === (d || 0) && n && s.emit("beforeSlideChangeStart");
                var b, y = -c[v];
                if (s.updateProgress(y),
                l.normalizeSlideIndex)
                    for (var w = 0; w < u.length; w += 1) {
                        var x = -Math.floor(100 * y)
                          , T = Math.floor(100 * u[w])
                          , S = Math.floor(100 * u[w + 1]);
                        void 0 !== u[w + 1] ? x >= T && x < S - (S - T) / 2 ? o = w : x >= T && x < S && (o = w + 1) : x >= T && (o = w)
                    }
                if (s.initialized && o !== p) {
                    if (!s.allowSlideNext && y < s.translate && y < s.minTranslate())
                        return !1;
                    if (!s.allowSlidePrev && y > s.translate && y > s.maxTranslate() && (p || 0) !== o)
                        return !1
                }
                if (b = o > p ? "next" : o < p ? "prev" : "reset",
                f && -y === s.translate || !f && y === s.translate)
                    return s.updateActiveIndex(o),
                    l.autoHeight && s.updateAutoHeight(),
                    s.updateSlidesClasses(),
                    "slide" !== l.effect && s.setTranslate(y),
                    "reset" !== b && (s.transitionStart(n, b),
                    s.transitionEnd(n, b)),
                    !1;
                if (l.cssMode) {
                    var _, C = s.isHorizontal(), E = -y;
                    return f && (E = h.scrollWidth - h.offsetWidth - E),
                    0 === t ? h[C ? "scrollLeft" : "scrollTop"] = E : h.scrollTo ? h.scrollTo(((_ = {})[C ? "left" : "top"] = E,
                    _.behavior = "smooth",
                    _)) : h[C ? "scrollLeft" : "scrollTop"] = E,
                    !0
                }
                return 0 === t ? (s.setTransition(0),
                s.setTranslate(y),
                s.updateActiveIndex(o),
                s.updateSlidesClasses(),
                s.emit("beforeTransitionStart", t, r),
                s.transitionStart(n, b),
                s.transitionEnd(n, b)) : (s.setTransition(t),
                s.setTranslate(y),
                s.updateActiveIndex(o),
                s.updateSlidesClasses(),
                s.emit("beforeTransitionStart", t, r),
                s.transitionStart(n, b),
                s.animating || (s.animating = !0,
                s.onSlideToWrapperTransitionEnd || (s.onSlideToWrapperTransitionEnd = function(e) {
                    s && !s.destroyed && e.target === this && (s.$wrapperEl[0].removeEventListener("transitionend", s.onSlideToWrapperTransitionEnd),
                    s.$wrapperEl[0].removeEventListener("webkitTransitionEnd", s.onSlideToWrapperTransitionEnd),
                    s.onSlideToWrapperTransitionEnd = null,
                    delete s.onSlideToWrapperTransitionEnd,
                    s.transitionEnd(n, b))
                }
                ),
                s.$wrapperEl[0].addEventListener("transitionend", s.onSlideToWrapperTransitionEnd),
                s.$wrapperEl[0].addEventListener("webkitTransitionEnd", s.onSlideToWrapperTransitionEnd))),
                !0
            },
            slideToLoop: function(e, t, n, r) {
                void 0 === e && (e = 0),
                void 0 === t && (t = this.params.speed),
                void 0 === n && (n = !0);
                var i = this
                  , a = e;
                return i.params.loop && (a += i.loopedSlides),
                i.slideTo(a, t, n, r)
            },
            slideNext: function(e, t, n) {
                void 0 === e && (e = this.params.speed),
                void 0 === t && (t = !0);
                var r = this
                  , i = r.params
                  , a = r.animating;
                if (!r.enabled)
                    return r;
                var s = r.activeIndex < i.slidesPerGroupSkip ? 1 : i.slidesPerGroup;
                if (i.loop) {
                    if (a && i.loopPreventsSlide)
                        return !1;
                    r.loopFix(),
                    r._clientLeft = r.$wrapperEl[0].clientLeft
                }
                return r.slideTo(r.activeIndex + s, e, t, n)
            },
            slidePrev: function(e, t, n) {
                void 0 === e && (e = this.params.speed),
                void 0 === t && (t = !0);
                var r = this
                  , i = r.params
                  , a = r.animating
                  , s = r.snapGrid
                  , o = r.slidesGrid
                  , l = r.rtlTranslate;
                if (!r.enabled)
                    return r;
                if (i.loop) {
                    if (a && i.loopPreventsSlide)
                        return !1;
                    r.loopFix(),
                    r._clientLeft = r.$wrapperEl[0].clientLeft
                }
                function c(e) {
                    return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e)
                }
                var u, d = c(l ? r.translate : -r.translate), p = s.map((function(e) {
                    return c(e)
                }
                )), f = s[p.indexOf(d) - 1];
                return void 0 === f && i.cssMode && s.forEach((function(e) {
                    !f && d >= e && (f = e)
                }
                )),
                void 0 !== f && (u = o.indexOf(f)) < 0 && (u = r.activeIndex - 1),
                r.slideTo(u, e, t, n)
            },
            slideReset: function(e, t, n) {
                return void 0 === e && (e = this.params.speed),
                void 0 === t && (t = !0),
                this.slideTo(this.activeIndex, e, t, n)
            },
            slideToClosest: function(e, t, n, r) {
                void 0 === e && (e = this.params.speed),
                void 0 === t && (t = !0),
                void 0 === r && (r = .5);
                var i = this
                  , a = i.activeIndex
                  , s = Math.min(i.params.slidesPerGroupSkip, a)
                  , o = s + Math.floor((a - s) / i.params.slidesPerGroup)
                  , l = i.rtlTranslate ? i.translate : -i.translate;
                if (l >= i.snapGrid[o]) {
                    var c = i.snapGrid[o];
                    l - c > (i.snapGrid[o + 1] - c) * r && (a += i.params.slidesPerGroup)
                } else {
                    var u = i.snapGrid[o - 1];
                    l - u <= (i.snapGrid[o] - u) * r && (a -= i.params.slidesPerGroup)
                }
                return a = Math.max(a, 0),
                a = Math.min(a, i.slidesGrid.length - 1),
                i.slideTo(a, e, t, n)
            },
            slideToClickedSlide: function() {
                var e, t = this, n = t.params, r = t.$wrapperEl, i = "auto" === n.slidesPerView ? t.slidesPerViewDynamic() : n.slidesPerView, a = t.clickedIndex;
                if (n.loop) {
                    if (t.animating)
                        return;
                    e = parseInt(m(t.clickedSlide).attr("data-swiper-slide-index"), 10),
                    n.centeredSlides ? a < t.loopedSlides - i / 2 || a > t.slides.length - t.loopedSlides + i / 2 ? (t.loopFix(),
                    a = r.children("." + n.slideClass + '[data-swiper-slide-index="' + e + '"]:not(.' + n.slideDuplicateClass + ")").eq(0).index(),
                    w((function() {
                        t.slideTo(a)
                    }
                    ))) : t.slideTo(a) : a > t.slides.length - i ? (t.loopFix(),
                    a = r.children("." + n.slideClass + '[data-swiper-slide-index="' + e + '"]:not(.' + n.slideDuplicateClass + ")").eq(0).index(),
                    w((function() {
                        t.slideTo(a)
                    }
                    ))) : t.slideTo(a)
                } else
                    t.slideTo(a)
            }
        },
        loop: {
            loopCreate: function() {
                var e = this
                  , t = a()
                  , n = e.params
                  , r = e.$wrapperEl;
                r.children("." + n.slideClass + "." + n.slideDuplicateClass).remove();
                var i = r.children("." + n.slideClass);
                if (n.loopFillGroupWithBlank) {
                    var s = n.slidesPerGroup - i.length % n.slidesPerGroup;
                    if (s !== n.slidesPerGroup) {
                        for (var o = 0; o < s; o += 1) {
                            var l = m(t.createElement("div")).addClass(n.slideClass + " " + n.slideBlankClass);
                            r.append(l)
                        }
                        i = r.children("." + n.slideClass)
                    }
                }
                "auto" !== n.slidesPerView || n.loopedSlides || (n.loopedSlides = i.length),
                e.loopedSlides = Math.ceil(parseFloat(n.loopedSlides || n.slidesPerView, 10)),
                e.loopedSlides += n.loopAdditionalSlides,
                e.loopedSlides > i.length && (e.loopedSlides = i.length);
                var c = []
                  , u = [];
                i.each((function(t, n) {
                    var r = m(t);
                    n < e.loopedSlides && u.push(t),
                    n < i.length && n >= i.length - e.loopedSlides && c.push(t),
                    r.attr("data-swiper-slide-index", n)
                }
                ));
                for (var d = 0; d < u.length; d += 1)
                    r.append(m(u[d].cloneNode(!0)).addClass(n.slideDuplicateClass));
                for (var p = c.length - 1; p >= 0; p -= 1)
                    r.prepend(m(c[p].cloneNode(!0)).addClass(n.slideDuplicateClass))
            },
            loopFix: function() {
                var e = this;
                e.emit("beforeLoopFix");
                var t, n = e.activeIndex, r = e.slides, i = e.loopedSlides, a = e.allowSlidePrev, s = e.allowSlideNext, o = e.snapGrid, l = e.rtlTranslate;
                e.allowSlidePrev = !0,
                e.allowSlideNext = !0;
                var c = -o[n] - e.getTranslate();
                n < i ? (t = r.length - 3 * i + n,
                t += i,
                e.slideTo(t, 0, !1, !0) && 0 !== c && e.setTranslate((l ? -e.translate : e.translate) - c)) : n >= r.length - i && (t = -r.length + n + i,
                t += i,
                e.slideTo(t, 0, !1, !0) && 0 !== c && e.setTranslate((l ? -e.translate : e.translate) - c)),
                e.allowSlidePrev = a,
                e.allowSlideNext = s,
                e.emit("loopFix")
            },
            loopDestroy: function() {
                var e = this
                  , t = e.$wrapperEl
                  , n = e.params
                  , r = e.slides;
                t.children("." + n.slideClass + "." + n.slideDuplicateClass + ",." + n.slideClass + "." + n.slideBlankClass).remove(),
                r.removeAttr("data-swiper-slide-index")
            }
        },
        grabCursor: {
            setGrabCursor: function(e) {
                var t = this;
                if (!(t.support.touch || !t.params.simulateTouch || t.params.watchOverflow && t.isLocked || t.params.cssMode)) {
                    var n = t.el;
                    n.style.cursor = "move",
                    n.style.cursor = e ? "-webkit-grabbing" : "-webkit-grab",
                    n.style.cursor = e ? "-moz-grabbin" : "-moz-grab",
                    n.style.cursor = e ? "grabbing" : "grab"
                }
            },
            unsetGrabCursor: function() {
                var e = this;
                e.support.touch || e.params.watchOverflow && e.isLocked || e.params.cssMode || (e.el.style.cursor = "")
            }
        },
        manipulation: {
            appendSlide: function(e) {
                var t = this
                  , n = t.$wrapperEl
                  , r = t.params;
                if (r.loop && t.loopDestroy(),
                "object" == typeof e && "length"in e)
                    for (var i = 0; i < e.length; i += 1)
                        e[i] && n.append(e[i]);
                else
                    n.append(e);
                r.loop && t.loopCreate(),
                r.observer && t.support.observer || t.update()
            },
            prependSlide: function(e) {
                var t = this
                  , n = t.params
                  , r = t.$wrapperEl
                  , i = t.activeIndex;
                n.loop && t.loopDestroy();
                var a = i + 1;
                if ("object" == typeof e && "length"in e) {
                    for (var s = 0; s < e.length; s += 1)
                        e[s] && r.prepend(e[s]);
                    a = i + e.length
                } else
                    r.prepend(e);
                n.loop && t.loopCreate(),
                n.observer && t.support.observer || t.update(),
                t.slideTo(a, 0, !1)
            },
            addSlide: function(e, t) {
                var n = this
                  , r = n.$wrapperEl
                  , i = n.params
                  , a = n.activeIndex;
                i.loop && (a -= n.loopedSlides,
                n.loopDestroy(),
                n.slides = r.children("." + i.slideClass));
                var s = n.slides.length;
                if (e <= 0)
                    n.prependSlide(t);
                else if (e >= s)
                    n.appendSlide(t);
                else {
                    for (var o = a > e ? a + 1 : a, l = [], c = s - 1; c >= e; c -= 1) {
                        var u = n.slides.eq(c);
                        u.remove(),
                        l.unshift(u)
                    }
                    if ("object" == typeof t && "length"in t) {
                        for (var d = 0; d < t.length; d += 1)
                            t[d] && r.append(t[d]);
                        o = a > e ? a + t.length : a
                    } else
                        r.append(t);
                    for (var p = 0; p < l.length; p += 1)
                        r.append(l[p]);
                    i.loop && n.loopCreate(),
                    i.observer && n.support.observer || n.update(),
                    i.loop ? n.slideTo(o + n.loopedSlides, 0, !1) : n.slideTo(o, 0, !1)
                }
            },
            removeSlide: function(e) {
                var t = this
                  , n = t.params
                  , r = t.$wrapperEl
                  , i = t.activeIndex;
                n.loop && (i -= t.loopedSlides,
                t.loopDestroy(),
                t.slides = r.children("." + n.slideClass));
                var a, s = i;
                if ("object" == typeof e && "length"in e) {
                    for (var o = 0; o < e.length; o += 1)
                        a = e[o],
                        t.slides[a] && t.slides.eq(a).remove(),
                        a < s && (s -= 1);
                    s = Math.max(s, 0)
                } else
                    a = e,
                    t.slides[a] && t.slides.eq(a).remove(),
                    a < s && (s -= 1),
                    s = Math.max(s, 0);
                n.loop && t.loopCreate(),
                n.observer && t.support.observer || t.update(),
                n.loop ? t.slideTo(s + t.loopedSlides, 0, !1) : t.slideTo(s, 0, !1)
            },
            removeAllSlides: function() {
                for (var e = [], t = 0; t < this.slides.length; t += 1)
                    e.push(t);
                this.removeSlide(e)
            }
        },
        events: {
            attachEvents: function() {
                var e = this
                  , t = a()
                  , n = e.params
                  , r = e.touchEvents
                  , i = e.el
                  , s = e.wrapperEl
                  , o = e.device
                  , l = e.support;
                e.onTouchStart = N.bind(e),
                e.onTouchMove = j.bind(e),
                e.onTouchEnd = z.bind(e),
                n.cssMode && (e.onScroll = F.bind(e)),
                e.onClick = $.bind(e);
                var c = !!n.nested;
                if (!l.touch && l.pointerEvents)
                    i.addEventListener(r.start, e.onTouchStart, !1),
                    t.addEventListener(r.move, e.onTouchMove, c),
                    t.addEventListener(r.end, e.onTouchEnd, !1);
                else {
                    if (l.touch) {
                        var u = !("touchstart" !== r.start || !l.passiveListener || !n.passiveListeners) && {
                            passive: !0,
                            capture: !1
                        };
                        i.addEventListener(r.start, e.onTouchStart, u),
                        i.addEventListener(r.move, e.onTouchMove, l.passiveListener ? {
                            passive: !1,
                            capture: c
                        } : c),
                        i.addEventListener(r.end, e.onTouchEnd, u),
                        r.cancel && i.addEventListener(r.cancel, e.onTouchEnd, u),
                        R || (t.addEventListener("touchstart", B),
                        R = !0)
                    }
                    (n.simulateTouch && !o.ios && !o.android || n.simulateTouch && !l.touch && o.ios) && (i.addEventListener("mousedown", e.onTouchStart, !1),
                    t.addEventListener("mousemove", e.onTouchMove, c),
                    t.addEventListener("mouseup", e.onTouchEnd, !1))
                }
                (n.preventClicks || n.preventClicksPropagation) && i.addEventListener("click", e.onClick, !0),
                n.cssMode && s.addEventListener("scroll", e.onScroll),
                n.updateOnWindowResize ? e.on(o.ios || o.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", H, !0) : e.on("observerUpdate", H, !0)
            },
            detachEvents: function() {
                var e = this
                  , t = a()
                  , n = e.params
                  , r = e.touchEvents
                  , i = e.el
                  , s = e.wrapperEl
                  , o = e.device
                  , l = e.support
                  , c = !!n.nested;
                if (!l.touch && l.pointerEvents)
                    i.removeEventListener(r.start, e.onTouchStart, !1),
                    t.removeEventListener(r.move, e.onTouchMove, c),
                    t.removeEventListener(r.end, e.onTouchEnd, !1);
                else {
                    if (l.touch) {
                        var u = !("onTouchStart" !== r.start || !l.passiveListener || !n.passiveListeners) && {
                            passive: !0,
                            capture: !1
                        };
                        i.removeEventListener(r.start, e.onTouchStart, u),
                        i.removeEventListener(r.move, e.onTouchMove, c),
                        i.removeEventListener(r.end, e.onTouchEnd, u),
                        r.cancel && i.removeEventListener(r.cancel, e.onTouchEnd, u)
                    }
                    (n.simulateTouch && !o.ios && !o.android || n.simulateTouch && !l.touch && o.ios) && (i.removeEventListener("mousedown", e.onTouchStart, !1),
                    t.removeEventListener("mousemove", e.onTouchMove, c),
                    t.removeEventListener("mouseup", e.onTouchEnd, !1))
                }
                (n.preventClicks || n.preventClicksPropagation) && i.removeEventListener("click", e.onClick, !0),
                n.cssMode && s.removeEventListener("scroll", e.onScroll),
                e.off(o.ios || o.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", H)
            }
        },
        breakpoints: {
            setBreakpoint: function() {
                var e = this
                  , t = e.activeIndex
                  , n = e.initialized
                  , r = e.loopedSlides
                  , i = void 0 === r ? 0 : r
                  , a = e.params
                  , s = e.$el
                  , o = a.breakpoints;
                if (o && (!o || 0 !== Object.keys(o).length)) {
                    var l = e.getBreakpoint(o, e.params.breakpointsBase, e.el);
                    if (l && e.currentBreakpoint !== l) {
                        var c = l in o ? o[l] : void 0;
                        c && ["slidesPerView", "spaceBetween", "slidesPerGroup", "slidesPerGroupSkip", "slidesPerColumn"].forEach((function(e) {
                            var t = c[e];
                            void 0 !== t && (c[e] = "slidesPerView" !== e || "AUTO" !== t && "auto" !== t ? "slidesPerView" === e ? parseFloat(t) : parseInt(t, 10) : "auto")
                        }
                        ));
                        var u = c || e.originalParams
                          , d = a.slidesPerColumn > 1
                          , p = u.slidesPerColumn > 1
                          , f = a.enabled;
                        d && !p ? (s.removeClass(a.containerModifierClass + "multirow " + a.containerModifierClass + "multirow-column"),
                        e.emitContainerClasses()) : !d && p && (s.addClass(a.containerModifierClass + "multirow"),
                        (u.slidesPerColumnFill && "column" === u.slidesPerColumnFill || !u.slidesPerColumnFill && "column" === a.slidesPerColumnFill) && s.addClass(a.containerModifierClass + "multirow-column"),
                        e.emitContainerClasses());
                        var h = u.direction && u.direction !== a.direction
                          , m = a.loop && (u.slidesPerView !== a.slidesPerView || h);
                        h && n && e.changeDirection(),
                        C(e.params, u);
                        var g = e.params.enabled;
                        C(e, {
                            allowTouchMove: e.params.allowTouchMove,
                            allowSlideNext: e.params.allowSlideNext,
                            allowSlidePrev: e.params.allowSlidePrev
                        }),
                        f && !g ? e.disable() : !f && g && e.enable(),
                        e.currentBreakpoint = l,
                        e.emit("_beforeBreakpoint", u),
                        m && n && (e.loopDestroy(),
                        e.loopCreate(),
                        e.updateSlides(),
                        e.slideTo(t - i + e.loopedSlides, 0, !1)),
                        e.emit("breakpoint", u)
                    }
                }
            },
            getBreakpoint: function(e, t, n) {
                if (void 0 === t && (t = "window"),
                e && ("container" !== t || n)) {
                    var r = !1
                      , i = o()
                      , a = "window" === t ? i.innerHeight : n.clientHeight
                      , s = Object.keys(e).map((function(e) {
                        if ("string" == typeof e && 0 === e.indexOf("@")) {
                            var t = parseFloat(e.substr(1));
                            return {
                                value: a * t,
                                point: e
                            }
                        }
                        return {
                            value: e,
                            point: e
                        }
                    }
                    ));
                    s.sort((function(e, t) {
                        return parseInt(e.value, 10) - parseInt(t.value, 10)
                    }
                    ));
                    for (var l = 0; l < s.length; l += 1) {
                        var c = s[l]
                          , u = c.point
                          , d = c.value;
                        "window" === t ? i.matchMedia("(min-width: " + d + "px)").matches && (r = u) : d <= n.clientWidth && (r = u)
                    }
                    return r || "max"
                }
            }
        },
        checkOverflow: {
            checkOverflow: function() {
                var e = this
                  , t = e.params
                  , n = e.isLocked
                  , r = e.slides.length > 0 && t.slidesOffsetBefore + t.spaceBetween * (e.slides.length - 1) + e.slides[0].offsetWidth * e.slides.length;
                t.slidesOffsetBefore && t.slidesOffsetAfter && r ? e.isLocked = r <= e.size : e.isLocked = 1 === e.snapGrid.length,
                e.allowSlideNext = !e.isLocked,
                e.allowSlidePrev = !e.isLocked,
                n !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock"),
                n && n !== e.isLocked && (e.isEnd = !1,
                e.navigation && e.navigation.update())
            }
        },
        classes: {
            addClasses: function() {
                var e, t, n, r = this, i = r.classNames, a = r.params, s = r.rtl, o = r.$el, l = r.device, c = r.support, u = (e = ["initialized", a.direction, {
                    "pointer-events": c.pointerEvents && !c.touch
                }, {
                    "free-mode": a.freeMode
                }, {
                    autoheight: a.autoHeight
                }, {
                    rtl: s
                }, {
                    multirow: a.slidesPerColumn > 1
                }, {
                    "multirow-column": a.slidesPerColumn > 1 && "column" === a.slidesPerColumnFill
                }, {
                    android: l.android
                }, {
                    ios: l.ios
                }, {
                    "css-mode": a.cssMode
                }],
                t = a.containerModifierClass,
                n = [],
                e.forEach((function(e) {
                    "object" == typeof e ? Object.keys(e).forEach((function(r) {
                        e[r] && n.push(t + r)
                    }
                    )) : "string" == typeof e && n.push(t + e)
                }
                )),
                n);
                i.push.apply(i, u),
                o.addClass([].concat(i).join(" ")),
                r.emitContainerClasses()
            },
            removeClasses: function() {
                var e = this
                  , t = e.$el
                  , n = e.classNames;
                t.removeClass(n.join(" ")),
                e.emitContainerClasses()
            }
        },
        images: {
            loadImage: function(e, t, n, r, i, a) {
                var s, l = o();
                function c() {
                    a && a()
                }
                m(e).parent("picture")[0] || e.complete && i ? c() : t ? ((s = new l.Image).onload = c,
                s.onerror = c,
                r && (s.sizes = r),
                n && (s.srcset = n),
                t && (s.src = t)) : c()
            },
            preloadImages: function() {
                var e = this;
                function t() {
                    null != e && e && !e.destroyed && (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1),
                    e.imagesLoaded === e.imagesToLoad.length && (e.params.updateOnImagesReady && e.update(),
                    e.emit("imagesReady")))
                }
                e.imagesToLoad = e.$el.find("img");
                for (var n = 0; n < e.imagesToLoad.length; n += 1) {
                    var r = e.imagesToLoad[n];
                    e.loadImage(r, r.currentSrc || r.getAttribute("src"), r.srcset || r.getAttribute("srcset"), r.sizes || r.getAttribute("sizes"), !0, t)
                }
            }
        }
    }
      , X = {}
      , V = function() {
        function t() {
            for (var e, n, r = arguments.length, i = new Array(r), a = 0; a < r; a++)
                i[a] = arguments[a];
            if (1 === i.length && i[0].constructor && "Object" === Object.prototype.toString.call(i[0]).slice(8, -1) ? n = i[0] : (e = i[0],
            n = i[1]),
            n || (n = {}),
            n = C({}, n),
            e && !n.el && (n.el = e),
            n.el && m(n.el).length > 1) {
                var s = [];
                return m(n.el).each((function(e) {
                    var r = C({}, n, {
                        el: e
                    });
                    s.push(new t(r))
                }
                )),
                s
            }
            var o = this;
            o.__swiper__ = !0,
            o.support = k(),
            o.device = L({
                userAgent: n.userAgent
            }),
            o.browser = M(),
            o.eventsListeners = {},
            o.eventsAnyListeners = [],
            void 0 === o.modules && (o.modules = {}),
            Object.keys(o.modules).forEach((function(e) {
                var t = o.modules[e];
                if (t.params) {
                    var r = Object.keys(t.params)[0]
                      , i = t.params[r];
                    if ("object" != typeof i || null === i)
                        return;
                    if (["navigation", "pagination", "scrollbar"].indexOf(r) >= 0 && !0 === n[r] && (n[r] = {
                        auto: !0
                    }),
                    !(r in n) || !("enabled"in i))
                        return;
                    !0 === n[r] && (n[r] = {
                        enabled: !0
                    }),
                    "object" != typeof n[r] || "enabled"in n[r] || (n[r].enabled = !0),
                    n[r] || (n[r] = {
                        enabled: !1
                    })
                }
            }
            ));
            var l, c, u = C({}, W);
            return o.useParams(u),
            o.params = C({}, u, X, n),
            o.originalParams = C({}, o.params),
            o.passedParams = C({}, n),
            o.params && o.params.on && Object.keys(o.params.on).forEach((function(e) {
                o.on(e, o.params.on[e])
            }
            )),
            o.params && o.params.onAny && o.onAny(o.params.onAny),
            o.$ = m,
            C(o, {
                enabled: o.params.enabled,
                el: e,
                classNames: [],
                slides: m(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal: function() {
                    return "horizontal" === o.params.direction
                },
                isVertical: function() {
                    return "vertical" === o.params.direction
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: !0,
                isEnd: !1,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: !1,
                allowSlideNext: o.params.allowSlideNext,
                allowSlidePrev: o.params.allowSlidePrev,
                touchEvents: (l = ["touchstart", "touchmove", "touchend", "touchcancel"],
                c = ["mousedown", "mousemove", "mouseup"],
                o.support.pointerEvents && (c = ["pointerdown", "pointermove", "pointerup"]),
                o.touchEventsTouch = {
                    start: l[0],
                    move: l[1],
                    end: l[2],
                    cancel: l[3]
                },
                o.touchEventsDesktop = {
                    start: c[0],
                    move: c[1],
                    end: c[2]
                },
                o.support.touch || !o.params.simulateTouch ? o.touchEventsTouch : o.touchEventsDesktop),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: o.params.focusableElements,
                    lastClickTime: x(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: !0,
                allowTouchMove: o.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            }),
            o.useModules(),
            o.emit("_swiper"),
            o.params.init && o.init(),
            o
        }
        var n, r, i = t.prototype;
        return i.enable = function() {
            var e = this;
            e.enabled || (e.enabled = !0,
            e.params.grabCursor && e.setGrabCursor(),
            e.emit("enable"))
        }
        ,
        i.disable = function() {
            var e = this;
            e.enabled && (e.enabled = !1,
            e.params.grabCursor && e.unsetGrabCursor(),
            e.emit("disable"))
        }
        ,
        i.setProgress = function(e, t) {
            var n = this;
            e = Math.min(Math.max(e, 0), 1);
            var r = n.minTranslate()
              , i = (n.maxTranslate() - r) * e + r;
            n.translateTo(i, void 0 === t ? 0 : t),
            n.updateActiveIndex(),
            n.updateSlidesClasses()
        }
        ,
        i.emitContainerClasses = function() {
            var e = this;
            if (e.params._emitClasses && e.el) {
                var t = e.el.className.split(" ").filter((function(t) {
                    return 0 === t.indexOf("swiper-container") || 0 === t.indexOf(e.params.containerModifierClass)
                }
                ));
                e.emit("_containerClasses", t.join(" "))
            }
        }
        ,
        i.getSlideClasses = function(e) {
            var t = this;
            return e.className.split(" ").filter((function(e) {
                return 0 === e.indexOf("swiper-slide") || 0 === e.indexOf(t.params.slideClass)
            }
            )).join(" ")
        }
        ,
        i.emitSlidesClasses = function() {
            var e = this;
            if (e.params._emitClasses && e.el) {
                var t = [];
                e.slides.each((function(n) {
                    var r = e.getSlideClasses(n);
                    t.push({
                        slideEl: n,
                        classNames: r
                    }),
                    e.emit("_slideClass", n, r)
                }
                )),
                e.emit("_slideClasses", t)
            }
        }
        ,
        i.slidesPerViewDynamic = function() {
            var e = this
              , t = e.params
              , n = e.slides
              , r = e.slidesGrid
              , i = e.size
              , a = e.activeIndex
              , s = 1;
            if (t.centeredSlides) {
                for (var o, l = n[a].swiperSlideSize, c = a + 1; c < n.length; c += 1)
                    n[c] && !o && (s += 1,
                    (l += n[c].swiperSlideSize) > i && (o = !0));
                for (var u = a - 1; u >= 0; u -= 1)
                    n[u] && !o && (s += 1,
                    (l += n[u].swiperSlideSize) > i && (o = !0))
            } else
                for (var d = a + 1; d < n.length; d += 1)
                    r[d] - r[a] < i && (s += 1);
            return s
        }
        ,
        i.update = function() {
            var e = this;
            if (e && !e.destroyed) {
                var t = e.snapGrid
                  , n = e.params;
                n.breakpoints && e.setBreakpoint(),
                e.updateSize(),
                e.updateSlides(),
                e.updateProgress(),
                e.updateSlidesClasses(),
                e.params.freeMode ? (r(),
                e.params.autoHeight && e.updateAutoHeight()) : (("auto" === e.params.slidesPerView || e.params.slidesPerView > 1) && e.isEnd && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0)) || r(),
                n.watchOverflow && t !== e.snapGrid && e.checkOverflow(),
                e.emit("update")
            }
            function r() {
                var t = e.rtlTranslate ? -1 * e.translate : e.translate
                  , n = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
                e.setTranslate(n),
                e.updateActiveIndex(),
                e.updateSlidesClasses()
            }
        }
        ,
        i.changeDirection = function(e, t) {
            void 0 === t && (t = !0);
            var n = this
              , r = n.params.direction;
            return e || (e = "horizontal" === r ? "vertical" : "horizontal"),
            e === r || "horizontal" !== e && "vertical" !== e || (n.$el.removeClass("" + n.params.containerModifierClass + r).addClass("" + n.params.containerModifierClass + e),
            n.emitContainerClasses(),
            n.params.direction = e,
            n.slides.each((function(t) {
                "vertical" === e ? t.style.width = "" : t.style.height = ""
            }
            )),
            n.emit("changeDirection"),
            t && n.update()),
            n
        }
        ,
        i.mount = function(e) {
            var t = this;
            if (t.mounted)
                return !0;
            var n = m(e || t.params.el);
            if (!(e = n[0]))
                return !1;
            e.swiper = t;
            var r = function() {
                return "." + (t.params.wrapperClass || "").trim().split(" ").join(".")
            }
              , i = function() {
                if (e && e.shadowRoot && e.shadowRoot.querySelector) {
                    var t = m(e.shadowRoot.querySelector(r()));
                    return t.children = function(e) {
                        return n.children(e)
                    }
                    ,
                    t
                }
                return n.children(r())
            }();
            if (0 === i.length && t.params.createElements) {
                var s = a().createElement("div");
                i = m(s),
                s.className = t.params.wrapperClass,
                n.append(s),
                n.children("." + t.params.slideClass).each((function(e) {
                    i.append(e)
                }
                ))
            }
            return C(t, {
                $el: n,
                el: e,
                $wrapperEl: i,
                wrapperEl: i[0],
                mounted: !0,
                rtl: "rtl" === e.dir.toLowerCase() || "rtl" === n.css("direction"),
                rtlTranslate: "horizontal" === t.params.direction && ("rtl" === e.dir.toLowerCase() || "rtl" === n.css("direction")),
                wrongRTL: "-webkit-box" === i.css("display")
            }),
            !0
        }
        ,
        i.init = function(e) {
            var t = this;
            return t.initialized || !1 === t.mount(e) || (t.emit("beforeInit"),
            t.params.breakpoints && t.setBreakpoint(),
            t.addClasses(),
            t.params.loop && t.loopCreate(),
            t.updateSize(),
            t.updateSlides(),
            t.params.watchOverflow && t.checkOverflow(),
            t.params.grabCursor && t.enabled && t.setGrabCursor(),
            t.params.preloadImages && t.preloadImages(),
            t.params.loop ? t.slideTo(t.params.initialSlide + t.loopedSlides, 0, t.params.runCallbacksOnInit, !1, !0) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0),
            t.attachEvents(),
            t.initialized = !0,
            t.emit("init"),
            t.emit("afterInit")),
            t
        }
        ,
        i.destroy = function(e, t) {
            void 0 === e && (e = !0),
            void 0 === t && (t = !0);
            var n, r = this, i = r.params, a = r.$el, s = r.$wrapperEl, o = r.slides;
            return void 0 === r.params || r.destroyed || (r.emit("beforeDestroy"),
            r.initialized = !1,
            r.detachEvents(),
            i.loop && r.loopDestroy(),
            t && (r.removeClasses(),
            a.removeAttr("style"),
            s.removeAttr("style"),
            o && o.length && o.removeClass([i.slideVisibleClass, i.slideActiveClass, i.slideNextClass, i.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index")),
            r.emit("destroy"),
            Object.keys(r.eventsListeners).forEach((function(e) {
                r.off(e)
            }
            )),
            !1 !== e && (r.$el[0].swiper = null,
            n = r,
            Object.keys(n).forEach((function(e) {
                try {
                    n[e] = null
                } catch (e) {}
                try {
                    delete n[e]
                } catch (e) {}
            }
            ))),
            r.destroyed = !0),
            null
        }
        ,
        t.extendDefaults = function(e) {
            C(X, e)
        }
        ,
        t.installModule = function(e) {
            t.prototype.modules || (t.prototype.modules = {});
            var n = e.name || Object.keys(t.prototype.modules).length + "_" + x();
            t.prototype.modules[n] = e
        }
        ,
        t.use = function(e) {
            return Array.isArray(e) ? (e.forEach((function(e) {
                return t.installModule(e)
            }
            )),
            t) : (t.installModule(e),
            t)
        }
        ,
        n = t,
        r = [{
            key: "extendedDefaults",
            get: function() {
                return X
            }
        }, {
            key: "defaults",
            get: function() {
                return W
            }
        }],
        null && e(n.prototype, null),
        r && e(n, r),
        t
    }();
    Object.keys(q).forEach((function(e) {
        Object.keys(q[e]).forEach((function(t) {
            V.prototype[t] = q[e][t]
        }
        ))
    }
    )),
    V.use([P, O]);
    var G = {
        update: function(e) {
            var t = this
              , n = t.params
              , r = n.slidesPerView
              , i = n.slidesPerGroup
              , a = n.centeredSlides
              , s = t.params.virtual
              , o = s.addSlidesBefore
              , l = s.addSlidesAfter
              , c = t.virtual
              , u = c.from
              , d = c.to
              , p = c.slides
              , f = c.slidesGrid
              , h = c.renderSlide
              , m = c.offset;
            t.updateActiveIndex();
            var g, v, b, y = t.activeIndex || 0;
            g = t.rtlTranslate ? "right" : t.isHorizontal() ? "left" : "top",
            a ? (v = Math.floor(r / 2) + i + l,
            b = Math.floor(r / 2) + i + o) : (v = r + (i - 1) + l,
            b = i + o);
            var w = Math.max((y || 0) - b, 0)
              , x = Math.min((y || 0) + v, p.length - 1)
              , T = (t.slidesGrid[w] || 0) - (t.slidesGrid[0] || 0);
            function S() {
                t.updateSlides(),
                t.updateProgress(),
                t.updateSlidesClasses(),
                t.lazy && t.params.lazy.enabled && t.lazy.load()
            }
            if (C(t.virtual, {
                from: w,
                to: x,
                offset: T,
                slidesGrid: t.slidesGrid
            }),
            u === w && d === x && !e)
                return t.slidesGrid !== f && T !== m && t.slides.css(g, T + "px"),
                void t.updateProgress();
            if (t.params.virtual.renderExternal)
                return t.params.virtual.renderExternal.call(t, {
                    offset: T,
                    from: w,
                    to: x,
                    slides: function() {
                        for (var e = [], t = w; t <= x; t += 1)
                            e.push(p[t]);
                        return e
                    }()
                }),
                void (t.params.virtual.renderExternalUpdate && S());
            var _ = []
              , E = [];
            if (e)
                t.$wrapperEl.find("." + t.params.slideClass).remove();
            else
                for (var D = u; D <= d; D += 1)
                    (D < w || D > x) && t.$wrapperEl.find("." + t.params.slideClass + '[data-swiper-slide-index="' + D + '"]').remove();
            for (var A = 0; A < p.length; A += 1)
                A >= w && A <= x && (void 0 === d || e ? E.push(A) : (A > d && E.push(A),
                A < u && _.push(A)));
            E.forEach((function(e) {
                t.$wrapperEl.append(h(p[e], e))
            }
            )),
            _.sort((function(e, t) {
                return t - e
            }
            )).forEach((function(e) {
                t.$wrapperEl.prepend(h(p[e], e))
            }
            )),
            t.$wrapperEl.children(".swiper-slide").css(g, T + "px"),
            S()
        },
        renderSlide: function(e, t) {
            var n = this
              , r = n.params.virtual;
            if (r.cache && n.virtual.cache[t])
                return n.virtual.cache[t];
            var i = r.renderSlide ? m(r.renderSlide.call(n, e, t)) : m('<div class="' + n.params.slideClass + '" data-swiper-slide-index="' + t + '">' + e + "</div>");
            return i.attr("data-swiper-slide-index") || i.attr("data-swiper-slide-index", t),
            r.cache && (n.virtual.cache[t] = i),
            i
        },
        appendSlide: function(e) {
            var t = this;
            if ("object" == typeof e && "length"in e)
                for (var n = 0; n < e.length; n += 1)
                    e[n] && t.virtual.slides.push(e[n]);
            else
                t.virtual.slides.push(e);
            t.virtual.update(!0)
        },
        prependSlide: function(e) {
            var t = this
              , n = t.activeIndex
              , r = n + 1
              , i = 1;
            if (Array.isArray(e)) {
                for (var a = 0; a < e.length; a += 1)
                    e[a] && t.virtual.slides.unshift(e[a]);
                r = n + e.length,
                i = e.length
            } else
                t.virtual.slides.unshift(e);
            if (t.params.virtual.cache) {
                var s = t.virtual.cache
                  , o = {};
                Object.keys(s).forEach((function(e) {
                    var t = s[e]
                      , n = t.attr("data-swiper-slide-index");
                    n && t.attr("data-swiper-slide-index", parseInt(n, 10) + 1),
                    o[parseInt(e, 10) + i] = t
                }
                )),
                t.virtual.cache = o
            }
            t.virtual.update(!0),
            t.slideTo(r, 0)
        },
        removeSlide: function(e) {
            var t = this;
            if (null != e) {
                var n = t.activeIndex;
                if (Array.isArray(e))
                    for (var r = e.length - 1; r >= 0; r -= 1)
                        t.virtual.slides.splice(e[r], 1),
                        t.params.virtual.cache && delete t.virtual.cache[e[r]],
                        e[r] < n && (n -= 1),
                        n = Math.max(n, 0);
                else
                    t.virtual.slides.splice(e, 1),
                    t.params.virtual.cache && delete t.virtual.cache[e],
                    e < n && (n -= 1),
                    n = Math.max(n, 0);
                t.virtual.update(!0),
                t.slideTo(n, 0)
            }
        },
        removeAllSlides: function() {
            var e = this;
            e.virtual.slides = [],
            e.params.virtual.cache && (e.virtual.cache = {}),
            e.virtual.update(!0),
            e.slideTo(0, 0)
        }
    }
      , Y = {
        name: "virtual",
        params: {
            virtual: {
                enabled: !1,
                slides: [],
                cache: !0,
                renderSlide: null,
                renderExternal: null,
                renderExternalUpdate: !0,
                addSlidesBefore: 0,
                addSlidesAfter: 0
            }
        },
        create: function() {
            E(this, {
                virtual: t({}, G, {
                    slides: this.params.virtual.slides,
                    cache: {}
                })
            })
        },
        on: {
            beforeInit: function(e) {
                if (e.params.virtual.enabled) {
                    e.classNames.push(e.params.containerModifierClass + "virtual");
                    var t = {
                        watchSlidesProgress: !0
                    };
                    C(e.params, t),
                    C(e.originalParams, t),
                    e.params.initialSlide || e.virtual.update()
                }
            },
            setTranslate: function(e) {
                e.params.virtual.enabled && e.virtual.update()
            }
        }
    }
      , U = {
        handle: function(e) {
            var t = this;
            if (t.enabled) {
                var n = o()
                  , r = a()
                  , i = t.rtlTranslate
                  , s = e;
                s.originalEvent && (s = s.originalEvent);
                var l = s.keyCode || s.charCode
                  , c = t.params.keyboard.pageUpDown
                  , u = c && 33 === l
                  , d = c && 34 === l
                  , p = 37 === l
                  , f = 39 === l
                  , h = 38 === l
                  , m = 40 === l;
                if (!t.allowSlideNext && (t.isHorizontal() && f || t.isVertical() && m || d))
                    return !1;
                if (!t.allowSlidePrev && (t.isHorizontal() && p || t.isVertical() && h || u))
                    return !1;
                if (!(s.shiftKey || s.altKey || s.ctrlKey || s.metaKey || r.activeElement && r.activeElement.nodeName && ("input" === r.activeElement.nodeName.toLowerCase() || "textarea" === r.activeElement.nodeName.toLowerCase()))) {
                    if (t.params.keyboard.onlyInViewport && (u || d || p || f || h || m)) {
                        var g = !1;
                        if (t.$el.parents("." + t.params.slideClass).length > 0 && 0 === t.$el.parents("." + t.params.slideActiveClass).length)
                            return;
                        var v = t.$el
                          , b = v[0].clientWidth
                          , y = v[0].clientHeight
                          , w = n.innerWidth
                          , x = n.innerHeight
                          , T = t.$el.offset();
                        i && (T.left -= t.$el[0].scrollLeft);
                        for (var S = [[T.left, T.top], [T.left + b, T.top], [T.left, T.top + y], [T.left + b, T.top + y]], _ = 0; _ < S.length; _ += 1) {
                            var C = S[_];
                            if (C[0] >= 0 && C[0] <= w && C[1] >= 0 && C[1] <= x) {
                                if (0 === C[0] && 0 === C[1])
                                    continue;
                                g = !0
                            }
                        }
                        if (!g)
                            return
                    }
                    t.isHorizontal() ? ((u || d || p || f) && (s.preventDefault ? s.preventDefault() : s.returnValue = !1),
                    ((d || f) && !i || (u || p) && i) && t.slideNext(),
                    ((u || p) && !i || (d || f) && i) && t.slidePrev()) : ((u || d || h || m) && (s.preventDefault ? s.preventDefault() : s.returnValue = !1),
                    (d || m) && t.slideNext(),
                    (u || h) && t.slidePrev()),
                    t.emit("keyPress", l)
                }
            }
        },
        enable: function() {
            var e = this
              , t = a();
            e.keyboard.enabled || (m(t).on("keydown", e.keyboard.handle),
            e.keyboard.enabled = !0)
        },
        disable: function() {
            var e = this
              , t = a();
            e.keyboard.enabled && (m(t).off("keydown", e.keyboard.handle),
            e.keyboard.enabled = !1)
        }
    }
      , K = {
        name: "keyboard",
        params: {
            keyboard: {
                enabled: !1,
                onlyInViewport: !0,
                pageUpDown: !0
            }
        },
        create: function() {
            E(this, {
                keyboard: t({
                    enabled: !1
                }, U)
            })
        },
        on: {
            init: function(e) {
                e.params.keyboard.enabled && e.keyboard.enable()
            },
            destroy: function(e) {
                e.keyboard.enabled && e.keyboard.disable()
            }
        }
    }
      , J = {
        lastScrollTime: x(),
        lastEventBeforeSnap: void 0,
        recentWheelEvents: [],
        event: function() {
            return o().navigator.userAgent.indexOf("firefox") > -1 ? "DOMMouseScroll" : function() {
                var e = a()
                  , t = "onwheel"
                  , n = t in e;
                if (!n) {
                    var r = e.createElement("div");
                    r.setAttribute(t, "return;"),
                    n = "function" == typeof r.onwheel
                }
                return !n && e.implementation && e.implementation.hasFeature && !0 !== e.implementation.hasFeature("", "") && (n = e.implementation.hasFeature("Events.wheel", "3.0")),
                n
            }() ? "wheel" : "mousewheel"
        },
        normalize: function(e) {
            var t = 0
              , n = 0
              , r = 0
              , i = 0;
            return "detail"in e && (n = e.detail),
            "wheelDelta"in e && (n = -e.wheelDelta / 120),
            "wheelDeltaY"in e && (n = -e.wheelDeltaY / 120),
            "wheelDeltaX"in e && (t = -e.wheelDeltaX / 120),
            "axis"in e && e.axis === e.HORIZONTAL_AXIS && (t = n,
            n = 0),
            r = 10 * t,
            i = 10 * n,
            "deltaY"in e && (i = e.deltaY),
            "deltaX"in e && (r = e.deltaX),
            e.shiftKey && !r && (r = i,
            i = 0),
            (r || i) && e.deltaMode && (1 === e.deltaMode ? (r *= 40,
            i *= 40) : (r *= 800,
            i *= 800)),
            r && !t && (t = r < 1 ? -1 : 1),
            i && !n && (n = i < 1 ? -1 : 1),
            {
                spinX: t,
                spinY: n,
                pixelX: r,
                pixelY: i
            }
        },
        handleMouseEnter: function() {
            this.enabled && (this.mouseEntered = !0)
        },
        handleMouseLeave: function() {
            this.enabled && (this.mouseEntered = !1)
        },
        handle: function(e) {
            var t = e
              , n = this;
            if (n.enabled) {
                var r = n.params.mousewheel;
                n.params.cssMode && t.preventDefault();
                var i = n.$el;
                if ("container" !== n.params.mousewheel.eventsTarget && (i = m(n.params.mousewheel.eventsTarget)),
                !n.mouseEntered && !i[0].contains(t.target) && !r.releaseOnEdges)
                    return !0;
                t.originalEvent && (t = t.originalEvent);
                var a = 0
                  , s = n.rtlTranslate ? -1 : 1
                  , o = J.normalize(t);
                if (r.forceToAxis)
                    if (n.isHorizontal()) {
                        if (!(Math.abs(o.pixelX) > Math.abs(o.pixelY)))
                            return !0;
                        a = -o.pixelX * s
                    } else {
                        if (!(Math.abs(o.pixelY) > Math.abs(o.pixelX)))
                            return !0;
                        a = -o.pixelY
                    }
                else
                    a = Math.abs(o.pixelX) > Math.abs(o.pixelY) ? -o.pixelX * s : -o.pixelY;
                if (0 === a)
                    return !0;
                r.invert && (a = -a);
                var l = n.getTranslate() + a * r.sensitivity;
                if (l >= n.minTranslate() && (l = n.minTranslate()),
                l <= n.maxTranslate() && (l = n.maxTranslate()),
                (!!n.params.loop || !(l === n.minTranslate() || l === n.maxTranslate())) && n.params.nested && t.stopPropagation(),
                n.params.freeMode) {
                    var c = {
                        time: x(),
                        delta: Math.abs(a),
                        direction: Math.sign(a)
                    }
                      , u = n.mousewheel.lastEventBeforeSnap
                      , d = u && c.time < u.time + 500 && c.delta <= u.delta && c.direction === u.direction;
                    if (!d) {
                        n.mousewheel.lastEventBeforeSnap = void 0,
                        n.params.loop && n.loopFix();
                        var p = n.getTranslate() + a * r.sensitivity
                          , f = n.isBeginning
                          , h = n.isEnd;
                        if (p >= n.minTranslate() && (p = n.minTranslate()),
                        p <= n.maxTranslate() && (p = n.maxTranslate()),
                        n.setTransition(0),
                        n.setTranslate(p),
                        n.updateProgress(),
                        n.updateActiveIndex(),
                        n.updateSlidesClasses(),
                        (!f && n.isBeginning || !h && n.isEnd) && n.updateSlidesClasses(),
                        n.params.freeModeSticky) {
                            clearTimeout(n.mousewheel.timeout),
                            n.mousewheel.timeout = void 0;
                            var g = n.mousewheel.recentWheelEvents;
                            g.length >= 15 && g.shift();
                            var v = g.length ? g[g.length - 1] : void 0
                              , b = g[0];
                            if (g.push(c),
                            v && (c.delta > v.delta || c.direction !== v.direction))
                                g.splice(0);
                            else if (g.length >= 15 && c.time - b.time < 500 && b.delta - c.delta >= 1 && c.delta <= 6) {
                                var y = a > 0 ? .8 : .2;
                                n.mousewheel.lastEventBeforeSnap = c,
                                g.splice(0),
                                n.mousewheel.timeout = w((function() {
                                    n.slideToClosest(n.params.speed, !0, void 0, y)
                                }
                                ), 0)
                            }
                            n.mousewheel.timeout || (n.mousewheel.timeout = w((function() {
                                n.mousewheel.lastEventBeforeSnap = c,
                                g.splice(0),
                                n.slideToClosest(n.params.speed, !0, void 0, .5)
                            }
                            ), 500))
                        }
                        if (d || n.emit("scroll", t),
                        n.params.autoplay && n.params.autoplayDisableOnInteraction && n.autoplay.stop(),
                        p === n.minTranslate() || p === n.maxTranslate())
                            return !0
                    }
                } else {
                    var T = {
                        time: x(),
                        delta: Math.abs(a),
                        direction: Math.sign(a),
                        raw: e
                    }
                      , S = n.mousewheel.recentWheelEvents;
                    S.length >= 2 && S.shift();
                    var _ = S.length ? S[S.length - 1] : void 0;
                    if (S.push(T),
                    _ ? (T.direction !== _.direction || T.delta > _.delta || T.time > _.time + 150) && n.mousewheel.animateSlider(T) : n.mousewheel.animateSlider(T),
                    n.mousewheel.releaseScroll(T))
                        return !0
                }
                return t.preventDefault ? t.preventDefault() : t.returnValue = !1,
                !1
            }
        },
        animateSlider: function(e) {
            var t = this
              , n = o();
            return !(this.params.mousewheel.thresholdDelta && e.delta < this.params.mousewheel.thresholdDelta || this.params.mousewheel.thresholdTime && x() - t.mousewheel.lastScrollTime < this.params.mousewheel.thresholdTime || !(e.delta >= 6 && x() - t.mousewheel.lastScrollTime < 60) && (e.direction < 0 ? t.isEnd && !t.params.loop || t.animating || (t.slideNext(),
            t.emit("scroll", e.raw)) : t.isBeginning && !t.params.loop || t.animating || (t.slidePrev(),
            t.emit("scroll", e.raw)),
            t.mousewheel.lastScrollTime = (new n.Date).getTime(),
            1))
        },
        releaseScroll: function(e) {
            var t = this
              , n = t.params.mousewheel;
            if (e.direction < 0) {
                if (t.isEnd && !t.params.loop && n.releaseOnEdges)
                    return !0
            } else if (t.isBeginning && !t.params.loop && n.releaseOnEdges)
                return !0;
            return !1
        },
        enable: function() {
            var e = this
              , t = J.event();
            if (e.params.cssMode)
                return e.wrapperEl.removeEventListener(t, e.mousewheel.handle),
                !0;
            if (!t)
                return !1;
            if (e.mousewheel.enabled)
                return !1;
            var n = e.$el;
            return "container" !== e.params.mousewheel.eventsTarget && (n = m(e.params.mousewheel.eventsTarget)),
            n.on("mouseenter", e.mousewheel.handleMouseEnter),
            n.on("mouseleave", e.mousewheel.handleMouseLeave),
            n.on(t, e.mousewheel.handle),
            e.mousewheel.enabled = !0,
            !0
        },
        disable: function() {
            var e = this
              , t = J.event();
            if (e.params.cssMode)
                return e.wrapperEl.addEventListener(t, e.mousewheel.handle),
                !0;
            if (!t)
                return !1;
            if (!e.mousewheel.enabled)
                return !1;
            var n = e.$el;
            return "container" !== e.params.mousewheel.eventsTarget && (n = m(e.params.mousewheel.eventsTarget)),
            n.off(t, e.mousewheel.handle),
            e.mousewheel.enabled = !1,
            !0
        }
    }
      , Q = {
        toggleEl: function(e, t) {
            e[t ? "addClass" : "removeClass"](this.params.navigation.disabledClass),
            e[0] && "BUTTON" === e[0].tagName && (e[0].disabled = t)
        },
        update: function() {
            var e = this
              , t = e.params.navigation
              , n = e.navigation.toggleEl;
            if (!e.params.loop) {
                var r = e.navigation
                  , i = r.$nextEl
                  , a = r.$prevEl;
                a && a.length > 0 && (e.isBeginning ? n(a, !0) : n(a, !1),
                e.params.watchOverflow && e.enabled && a[e.isLocked ? "addClass" : "removeClass"](t.lockClass)),
                i && i.length > 0 && (e.isEnd ? n(i, !0) : n(i, !1),
                e.params.watchOverflow && e.enabled && i[e.isLocked ? "addClass" : "removeClass"](t.lockClass))
            }
        },
        onPrevClick: function(e) {
            var t = this;
            e.preventDefault(),
            t.isBeginning && !t.params.loop || t.slidePrev()
        },
        onNextClick: function(e) {
            var t = this;
            e.preventDefault(),
            t.isEnd && !t.params.loop || t.slideNext()
        },
        init: function() {
            var e, t, n = this, r = n.params.navigation;
            n.params.navigation = A(n.$el, n.params.navigation, n.params.createElements, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            }),
            (r.nextEl || r.prevEl) && (r.nextEl && (e = m(r.nextEl),
            n.params.uniqueNavElements && "string" == typeof r.nextEl && e.length > 1 && 1 === n.$el.find(r.nextEl).length && (e = n.$el.find(r.nextEl))),
            r.prevEl && (t = m(r.prevEl),
            n.params.uniqueNavElements && "string" == typeof r.prevEl && t.length > 1 && 1 === n.$el.find(r.prevEl).length && (t = n.$el.find(r.prevEl))),
            e && e.length > 0 && e.on("click", n.navigation.onNextClick),
            t && t.length > 0 && t.on("click", n.navigation.onPrevClick),
            C(n.navigation, {
                $nextEl: e,
                nextEl: e && e[0],
                $prevEl: t,
                prevEl: t && t[0]
            }),
            n.enabled || (e && e.addClass(r.lockClass),
            t && t.addClass(r.lockClass)))
        },
        destroy: function() {
            var e = this
              , t = e.navigation
              , n = t.$nextEl
              , r = t.$prevEl;
            n && n.length && (n.off("click", e.navigation.onNextClick),
            n.removeClass(e.params.navigation.disabledClass)),
            r && r.length && (r.off("click", e.navigation.onPrevClick),
            r.removeClass(e.params.navigation.disabledClass))
        }
    }
      , Z = {
        update: function() {
            var e = this
              , t = e.rtl
              , n = e.params.pagination;
            if (n.el && e.pagination.el && e.pagination.$el && 0 !== e.pagination.$el.length) {
                var r, i = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.slides.length, a = e.pagination.$el, s = e.params.loop ? Math.ceil((i - 2 * e.loopedSlides) / e.params.slidesPerGroup) : e.snapGrid.length;
                if (e.params.loop ? ((r = Math.ceil((e.activeIndex - e.loopedSlides) / e.params.slidesPerGroup)) > i - 1 - 2 * e.loopedSlides && (r -= i - 2 * e.loopedSlides),
                r > s - 1 && (r -= s),
                r < 0 && "bullets" !== e.params.paginationType && (r = s + r)) : r = void 0 !== e.snapIndex ? e.snapIndex : e.activeIndex || 0,
                "bullets" === n.type && e.pagination.bullets && e.pagination.bullets.length > 0) {
                    var o, l, c, u = e.pagination.bullets;
                    if (n.dynamicBullets && (e.pagination.bulletSize = u.eq(0)[e.isHorizontal() ? "outerWidth" : "outerHeight"](!0),
                    a.css(e.isHorizontal() ? "width" : "height", e.pagination.bulletSize * (n.dynamicMainBullets + 4) + "px"),
                    n.dynamicMainBullets > 1 && void 0 !== e.previousIndex && (e.pagination.dynamicBulletIndex += r - e.previousIndex,
                    e.pagination.dynamicBulletIndex > n.dynamicMainBullets - 1 ? e.pagination.dynamicBulletIndex = n.dynamicMainBullets - 1 : e.pagination.dynamicBulletIndex < 0 && (e.pagination.dynamicBulletIndex = 0)),
                    o = r - e.pagination.dynamicBulletIndex,
                    c = ((l = o + (Math.min(u.length, n.dynamicMainBullets) - 1)) + o) / 2),
                    u.removeClass(n.bulletActiveClass + " " + n.bulletActiveClass + "-next " + n.bulletActiveClass + "-next-next " + n.bulletActiveClass + "-prev " + n.bulletActiveClass + "-prev-prev " + n.bulletActiveClass + "-main"),
                    a.length > 1)
                        u.each((function(e) {
                            var t = m(e)
                              , i = t.index();
                            i === r && t.addClass(n.bulletActiveClass),
                            n.dynamicBullets && (i >= o && i <= l && t.addClass(n.bulletActiveClass + "-main"),
                            i === o && t.prev().addClass(n.bulletActiveClass + "-prev").prev().addClass(n.bulletActiveClass + "-prev-prev"),
                            i === l && t.next().addClass(n.bulletActiveClass + "-next").next().addClass(n.bulletActiveClass + "-next-next"))
                        }
                        ));
                    else {
                        var d = u.eq(r)
                          , p = d.index();
                        if (d.addClass(n.bulletActiveClass),
                        n.dynamicBullets) {
                            for (var f = u.eq(o), h = u.eq(l), g = o; g <= l; g += 1)
                                u.eq(g).addClass(n.bulletActiveClass + "-main");
                            if (e.params.loop)
                                if (p >= u.length - n.dynamicMainBullets) {
                                    for (var v = n.dynamicMainBullets; v >= 0; v -= 1)
                                        u.eq(u.length - v).addClass(n.bulletActiveClass + "-main");
                                    u.eq(u.length - n.dynamicMainBullets - 1).addClass(n.bulletActiveClass + "-prev")
                                } else
                                    f.prev().addClass(n.bulletActiveClass + "-prev").prev().addClass(n.bulletActiveClass + "-prev-prev"),
                                    h.next().addClass(n.bulletActiveClass + "-next").next().addClass(n.bulletActiveClass + "-next-next");
                            else
                                f.prev().addClass(n.bulletActiveClass + "-prev").prev().addClass(n.bulletActiveClass + "-prev-prev"),
                                h.next().addClass(n.bulletActiveClass + "-next").next().addClass(n.bulletActiveClass + "-next-next")
                        }
                    }
                    if (n.dynamicBullets) {
                        var b = Math.min(u.length, n.dynamicMainBullets + 4)
                          , y = (e.pagination.bulletSize * b - e.pagination.bulletSize) / 2 - c * e.pagination.bulletSize
                          , w = t ? "right" : "left";
                        u.css(e.isHorizontal() ? w : "top", y + "px")
                    }
                }
                if ("fraction" === n.type && (a.find(D(n.currentClass)).text(n.formatFractionCurrent(r + 1)),
                a.find(D(n.totalClass)).text(n.formatFractionTotal(s))),
                "progressbar" === n.type) {
                    var x;
                    x = n.progressbarOpposite ? e.isHorizontal() ? "vertical" : "horizontal" : e.isHorizontal() ? "horizontal" : "vertical";
                    var T = (r + 1) / s
                      , S = 1
                      , _ = 1;
                    "horizontal" === x ? S = T : _ = T,
                    a.find(D(n.progressbarFillClass)).transform("translate3d(0,0,0) scaleX(" + S + ") scaleY(" + _ + ")").transition(e.params.speed)
                }
                "custom" === n.type && n.renderCustom ? (a.html(n.renderCustom(e, r + 1, s)),
                e.emit("paginationRender", a[0])) : e.emit("paginationUpdate", a[0]),
                e.params.watchOverflow && e.enabled && a[e.isLocked ? "addClass" : "removeClass"](n.lockClass)
            }
        },
        render: function() {
            var e = this
              , t = e.params.pagination;
            if (t.el && e.pagination.el && e.pagination.$el && 0 !== e.pagination.$el.length) {
                var n = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.slides.length
                  , r = e.pagination.$el
                  , i = "";
                if ("bullets" === t.type) {
                    var a = e.params.loop ? Math.ceil((n - 2 * e.loopedSlides) / e.params.slidesPerGroup) : e.snapGrid.length;
                    e.params.freeMode && !e.params.loop && a > n && (a = n);
                    for (var s = 0; s < a; s += 1)
                        t.renderBullet ? i += t.renderBullet.call(e, s, t.bulletClass) : i += "<" + t.bulletElement + ' class="' + t.bulletClass + '"></' + t.bulletElement + ">";
                    r.html(i),
                    e.pagination.bullets = r.find(D(t.bulletClass))
                }
                "fraction" === t.type && (i = t.renderFraction ? t.renderFraction.call(e, t.currentClass, t.totalClass) : '<span class="' + t.currentClass + '"></span> / <span class="' + t.totalClass + '"></span>',
                r.html(i)),
                "progressbar" === t.type && (i = t.renderProgressbar ? t.renderProgressbar.call(e, t.progressbarFillClass) : '<span class="' + t.progressbarFillClass + '"></span>',
                r.html(i)),
                "custom" !== t.type && e.emit("paginationRender", e.pagination.$el[0])
            }
        },
        init: function() {
            var e = this;
            e.params.pagination = A(e.$el, e.params.pagination, e.params.createElements, {
                el: "swiper-pagination"
            });
            var t = e.params.pagination;
            if (t.el) {
                var n = m(t.el);
                0 !== n.length && (e.params.uniqueNavElements && "string" == typeof t.el && n.length > 1 && (n = e.$el.find(t.el)),
                "bullets" === t.type && t.clickable && n.addClass(t.clickableClass),
                n.addClass(t.modifierClass + t.type),
                "bullets" === t.type && t.dynamicBullets && (n.addClass("" + t.modifierClass + t.type + "-dynamic"),
                e.pagination.dynamicBulletIndex = 0,
                t.dynamicMainBullets < 1 && (t.dynamicMainBullets = 1)),
                "progressbar" === t.type && t.progressbarOpposite && n.addClass(t.progressbarOppositeClass),
                t.clickable && n.on("click", D(t.bulletClass), (function(t) {
                    t.preventDefault();
                    var n = m(this).index() * e.params.slidesPerGroup;
                    e.params.loop && (n += e.loopedSlides),
                    e.slideTo(n)
                }
                )),
                C(e.pagination, {
                    $el: n,
                    el: n[0]
                }),
                e.enabled || n.addClass(t.lockClass))
            }
        },
        destroy: function() {
            var e = this
              , t = e.params.pagination;
            if (t.el && e.pagination.el && e.pagination.$el && 0 !== e.pagination.$el.length) {
                var n = e.pagination.$el;
                n.removeClass(t.hiddenClass),
                n.removeClass(t.modifierClass + t.type),
                e.pagination.bullets && e.pagination.bullets.removeClass(t.bulletActiveClass),
                t.clickable && n.off("click", D(t.bulletClass))
            }
        }
    }
      , ee = {
        setTranslate: function() {
            var e = this;
            if (e.params.scrollbar.el && e.scrollbar.el) {
                var t = e.scrollbar
                  , n = e.rtlTranslate
                  , r = e.progress
                  , i = t.dragSize
                  , a = t.trackSize
                  , s = t.$dragEl
                  , o = t.$el
                  , l = e.params.scrollbar
                  , c = i
                  , u = (a - i) * r;
                n ? (u = -u) > 0 ? (c = i - u,
                u = 0) : -u + i > a && (c = a + u) : u < 0 ? (c = i + u,
                u = 0) : u + i > a && (c = a - u),
                e.isHorizontal() ? (s.transform("translate3d(" + u + "px, 0, 0)"),
                s[0].style.width = c + "px") : (s.transform("translate3d(0px, " + u + "px, 0)"),
                s[0].style.height = c + "px"),
                l.hide && (clearTimeout(e.scrollbar.timeout),
                o[0].style.opacity = 1,
                e.scrollbar.timeout = setTimeout((function() {
                    o[0].style.opacity = 0,
                    o.transition(400)
                }
                ), 1e3))
            }
        },
        setTransition: function(e) {
            var t = this;
            t.params.scrollbar.el && t.scrollbar.el && t.scrollbar.$dragEl.transition(e)
        },
        updateSize: function() {
            var e = this;
            if (e.params.scrollbar.el && e.scrollbar.el) {
                var t = e.scrollbar
                  , n = t.$dragEl
                  , r = t.$el;
                n[0].style.width = "",
                n[0].style.height = "";
                var i, a = e.isHorizontal() ? r[0].offsetWidth : r[0].offsetHeight, s = e.size / e.virtualSize, o = s * (a / e.size);
                i = "auto" === e.params.scrollbar.dragSize ? a * s : parseInt(e.params.scrollbar.dragSize, 10),
                e.isHorizontal() ? n[0].style.width = i + "px" : n[0].style.height = i + "px",
                r[0].style.display = s >= 1 ? "none" : "",
                e.params.scrollbar.hide && (r[0].style.opacity = 0),
                C(t, {
                    trackSize: a,
                    divider: s,
                    moveDivider: o,
                    dragSize: i
                }),
                e.params.watchOverflow && e.enabled && t.$el[e.isLocked ? "addClass" : "removeClass"](e.params.scrollbar.lockClass)
            }
        },
        getPointerPosition: function(e) {
            return this.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientX : e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientY : e.clientY
        },
        setDragPosition: function(e) {
            var t, n = this, r = n.scrollbar, i = n.rtlTranslate, a = r.$el, s = r.dragSize, o = r.trackSize, l = r.dragStartPos;
            t = (r.getPointerPosition(e) - a.offset()[n.isHorizontal() ? "left" : "top"] - (null !== l ? l : s / 2)) / (o - s),
            t = Math.max(Math.min(t, 1), 0),
            i && (t = 1 - t);
            var c = n.minTranslate() + (n.maxTranslate() - n.minTranslate()) * t;
            n.updateProgress(c),
            n.setTranslate(c),
            n.updateActiveIndex(),
            n.updateSlidesClasses()
        },
        onDragStart: function(e) {
            var t = this
              , n = t.params.scrollbar
              , r = t.scrollbar
              , i = t.$wrapperEl
              , a = r.$el
              , s = r.$dragEl;
            t.scrollbar.isTouched = !0,
            t.scrollbar.dragStartPos = e.target === s[0] || e.target === s ? r.getPointerPosition(e) - e.target.getBoundingClientRect()[t.isHorizontal() ? "left" : "top"] : null,
            e.preventDefault(),
            e.stopPropagation(),
            i.transition(100),
            s.transition(100),
            r.setDragPosition(e),
            clearTimeout(t.scrollbar.dragTimeout),
            a.transition(0),
            n.hide && a.css("opacity", 1),
            t.params.cssMode && t.$wrapperEl.css("scroll-snap-type", "none"),
            t.emit("scrollbarDragStart", e)
        },
        onDragMove: function(e) {
            var t = this
              , n = t.scrollbar
              , r = t.$wrapperEl
              , i = n.$el
              , a = n.$dragEl;
            t.scrollbar.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1,
            n.setDragPosition(e),
            r.transition(0),
            i.transition(0),
            a.transition(0),
            t.emit("scrollbarDragMove", e))
        },
        onDragEnd: function(e) {
            var t = this
              , n = t.params.scrollbar
              , r = t.scrollbar
              , i = t.$wrapperEl
              , a = r.$el;
            t.scrollbar.isTouched && (t.scrollbar.isTouched = !1,
            t.params.cssMode && (t.$wrapperEl.css("scroll-snap-type", ""),
            i.transition("")),
            n.hide && (clearTimeout(t.scrollbar.dragTimeout),
            t.scrollbar.dragTimeout = w((function() {
                a.css("opacity", 0),
                a.transition(400)
            }
            ), 1e3)),
            t.emit("scrollbarDragEnd", e),
            n.snapOnRelease && t.slideToClosest())
        },
        enableDraggable: function() {
            var e = this;
            if (e.params.scrollbar.el) {
                var t = a()
                  , n = e.scrollbar
                  , r = e.touchEventsTouch
                  , i = e.touchEventsDesktop
                  , s = e.params
                  , o = e.support
                  , l = n.$el[0]
                  , c = !(!o.passiveListener || !s.passiveListeners) && {
                    passive: !1,
                    capture: !1
                }
                  , u = !(!o.passiveListener || !s.passiveListeners) && {
                    passive: !0,
                    capture: !1
                };
                l && (o.touch ? (l.addEventListener(r.start, e.scrollbar.onDragStart, c),
                l.addEventListener(r.move, e.scrollbar.onDragMove, c),
                l.addEventListener(r.end, e.scrollbar.onDragEnd, u)) : (l.addEventListener(i.start, e.scrollbar.onDragStart, c),
                t.addEventListener(i.move, e.scrollbar.onDragMove, c),
                t.addEventListener(i.end, e.scrollbar.onDragEnd, u)))
            }
        },
        disableDraggable: function() {
            var e = this;
            if (e.params.scrollbar.el) {
                var t = a()
                  , n = e.scrollbar
                  , r = e.touchEventsTouch
                  , i = e.touchEventsDesktop
                  , s = e.params
                  , o = e.support
                  , l = n.$el[0]
                  , c = !(!o.passiveListener || !s.passiveListeners) && {
                    passive: !1,
                    capture: !1
                }
                  , u = !(!o.passiveListener || !s.passiveListeners) && {
                    passive: !0,
                    capture: !1
                };
                l && (o.touch ? (l.removeEventListener(r.start, e.scrollbar.onDragStart, c),
                l.removeEventListener(r.move, e.scrollbar.onDragMove, c),
                l.removeEventListener(r.end, e.scrollbar.onDragEnd, u)) : (l.removeEventListener(i.start, e.scrollbar.onDragStart, c),
                t.removeEventListener(i.move, e.scrollbar.onDragMove, c),
                t.removeEventListener(i.end, e.scrollbar.onDragEnd, u)))
            }
        },
        init: function() {
            var e = this
              , t = e.scrollbar
              , n = e.$el;
            e.params.scrollbar = A(n, e.params.scrollbar, e.params.createElements, {
                el: "swiper-scrollbar"
            });
            var r = e.params.scrollbar;
            if (r.el) {
                var i = m(r.el);
                e.params.uniqueNavElements && "string" == typeof r.el && i.length > 1 && 1 === n.find(r.el).length && (i = n.find(r.el));
                var a = i.find("." + e.params.scrollbar.dragClass);
                0 === a.length && (a = m('<div class="' + e.params.scrollbar.dragClass + '"></div>'),
                i.append(a)),
                C(t, {
                    $el: i,
                    el: i[0],
                    $dragEl: a,
                    dragEl: a[0]
                }),
                r.draggable && t.enableDraggable(),
                i && i[e.enabled ? "removeClass" : "addClass"](e.params.scrollbar.lockClass)
            }
        },
        destroy: function() {
            this.scrollbar.disableDraggable()
        }
    }
      , te = {
        setTransform: function(e, t) {
            var n = this.rtl
              , r = m(e)
              , i = n ? -1 : 1
              , a = r.attr("data-swiper-parallax") || "0"
              , s = r.attr("data-swiper-parallax-x")
              , o = r.attr("data-swiper-parallax-y")
              , l = r.attr("data-swiper-parallax-scale")
              , c = r.attr("data-swiper-parallax-opacity");
            if (s || o ? (s = s || "0",
            o = o || "0") : this.isHorizontal() ? (s = a,
            o = "0") : (o = a,
            s = "0"),
            s = s.indexOf("%") >= 0 ? parseInt(s, 10) * t * i + "%" : s * t * i + "px",
            o = o.indexOf("%") >= 0 ? parseInt(o, 10) * t + "%" : o * t + "px",
            null != c) {
                var u = c - (c - 1) * (1 - Math.abs(t));
                r[0].style.opacity = u
            }
            if (null == l)
                r.transform("translate3d(" + s + ", " + o + ", 0px)");
            else {
                var d = l - (l - 1) * (1 - Math.abs(t));
                r.transform("translate3d(" + s + ", " + o + ", 0px) scale(" + d + ")")
            }
        },
        setTranslate: function() {
            var e = this
              , t = e.$el
              , n = e.slides
              , r = e.progress
              , i = e.snapGrid;
            t.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t) {
                e.parallax.setTransform(t, r)
            }
            )),
            n.each((function(t, n) {
                var a = t.progress;
                e.params.slidesPerGroup > 1 && "auto" !== e.params.slidesPerView && (a += Math.ceil(n / 2) - r * (i.length - 1)),
                a = Math.min(Math.max(a, -1), 1),
                m(t).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t) {
                    e.parallax.setTransform(t, a)
                }
                ))
            }
            ))
        },
        setTransition: function(e) {
            void 0 === e && (e = this.params.speed),
            this.$el.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t) {
                var n = m(t)
                  , r = parseInt(n.attr("data-swiper-parallax-duration"), 10) || e;
                0 === e && (r = 0),
                n.transition(r)
            }
            ))
        }
    }
      , ne = {
        getDistanceBetweenTouches: function(e) {
            if (e.targetTouches.length < 2)
                return 1;
            var t = e.targetTouches[0].pageX
              , n = e.targetTouches[0].pageY
              , r = e.targetTouches[1].pageX
              , i = e.targetTouches[1].pageY;
            return Math.sqrt(Math.pow(r - t, 2) + Math.pow(i - n, 2))
        },
        onGestureStart: function(e) {
            var t = this
              , n = t.support
              , r = t.params.zoom
              , i = t.zoom
              , a = i.gesture;
            if (i.fakeGestureTouched = !1,
            i.fakeGestureMoved = !1,
            !n.gestures) {
                if ("touchstart" !== e.type || "touchstart" === e.type && e.targetTouches.length < 2)
                    return;
                i.fakeGestureTouched = !0,
                a.scaleStart = ne.getDistanceBetweenTouches(e)
            }
            a.$slideEl && a.$slideEl.length || (a.$slideEl = m(e.target).closest("." + t.params.slideClass),
            0 === a.$slideEl.length && (a.$slideEl = t.slides.eq(t.activeIndex)),
            a.$imageEl = a.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),
            a.$imageWrapEl = a.$imageEl.parent("." + r.containerClass),
            a.maxRatio = a.$imageWrapEl.attr("data-swiper-zoom") || r.maxRatio,
            0 !== a.$imageWrapEl.length) ? (a.$imageEl && a.$imageEl.transition(0),
            t.zoom.isScaling = !0) : a.$imageEl = void 0
        },
        onGestureChange: function(e) {
            var t = this
              , n = t.support
              , r = t.params.zoom
              , i = t.zoom
              , a = i.gesture;
            if (!n.gestures) {
                if ("touchmove" !== e.type || "touchmove" === e.type && e.targetTouches.length < 2)
                    return;
                i.fakeGestureMoved = !0,
                a.scaleMove = ne.getDistanceBetweenTouches(e)
            }
            a.$imageEl && 0 !== a.$imageEl.length ? (n.gestures ? i.scale = e.scale * i.currentScale : i.scale = a.scaleMove / a.scaleStart * i.currentScale,
            i.scale > a.maxRatio && (i.scale = a.maxRatio - 1 + Math.pow(i.scale - a.maxRatio + 1, .5)),
            i.scale < r.minRatio && (i.scale = r.minRatio + 1 - Math.pow(r.minRatio - i.scale + 1, .5)),
            a.$imageEl.transform("translate3d(0,0,0) scale(" + i.scale + ")")) : "gesturechange" === e.type && i.onGestureStart(e)
        },
        onGestureEnd: function(e) {
            var t = this
              , n = t.device
              , r = t.support
              , i = t.params.zoom
              , a = t.zoom
              , s = a.gesture;
            if (!r.gestures) {
                if (!a.fakeGestureTouched || !a.fakeGestureMoved)
                    return;
                if ("touchend" !== e.type || "touchend" === e.type && e.changedTouches.length < 2 && !n.android)
                    return;
                a.fakeGestureTouched = !1,
                a.fakeGestureMoved = !1
            }
            s.$imageEl && 0 !== s.$imageEl.length && (a.scale = Math.max(Math.min(a.scale, s.maxRatio), i.minRatio),
            s.$imageEl.transition(t.params.speed).transform("translate3d(0,0,0) scale(" + a.scale + ")"),
            a.currentScale = a.scale,
            a.isScaling = !1,
            1 === a.scale && (s.$slideEl = void 0))
        },
        onTouchStart: function(e) {
            var t = this.device
              , n = this.zoom
              , r = n.gesture
              , i = n.image;
            r.$imageEl && 0 !== r.$imageEl.length && (i.isTouched || (t.android && e.cancelable && e.preventDefault(),
            i.isTouched = !0,
            i.touchesStart.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX,
            i.touchesStart.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY))
        },
        onTouchMove: function(e) {
            var t = this
              , n = t.zoom
              , r = n.gesture
              , i = n.image
              , a = n.velocity;
            if (r.$imageEl && 0 !== r.$imageEl.length && (t.allowClick = !1,
            i.isTouched && r.$slideEl)) {
                i.isMoved || (i.width = r.$imageEl[0].offsetWidth,
                i.height = r.$imageEl[0].offsetHeight,
                i.startX = T(r.$imageWrapEl[0], "x") || 0,
                i.startY = T(r.$imageWrapEl[0], "y") || 0,
                r.slideWidth = r.$slideEl[0].offsetWidth,
                r.slideHeight = r.$slideEl[0].offsetHeight,
                r.$imageWrapEl.transition(0));
                var s = i.width * n.scale
                  , o = i.height * n.scale;
                if (!(s < r.slideWidth && o < r.slideHeight)) {
                    if (i.minX = Math.min(r.slideWidth / 2 - s / 2, 0),
                    i.maxX = -i.minX,
                    i.minY = Math.min(r.slideHeight / 2 - o / 2, 0),
                    i.maxY = -i.minY,
                    i.touchesCurrent.x = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                    i.touchesCurrent.y = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY,
                    !i.isMoved && !n.isScaling) {
                        if (t.isHorizontal() && (Math.floor(i.minX) === Math.floor(i.startX) && i.touchesCurrent.x < i.touchesStart.x || Math.floor(i.maxX) === Math.floor(i.startX) && i.touchesCurrent.x > i.touchesStart.x))
                            return void (i.isTouched = !1);
                        if (!t.isHorizontal() && (Math.floor(i.minY) === Math.floor(i.startY) && i.touchesCurrent.y < i.touchesStart.y || Math.floor(i.maxY) === Math.floor(i.startY) && i.touchesCurrent.y > i.touchesStart.y))
                            return void (i.isTouched = !1)
                    }
                    e.cancelable && e.preventDefault(),
                    e.stopPropagation(),
                    i.isMoved = !0,
                    i.currentX = i.touchesCurrent.x - i.touchesStart.x + i.startX,
                    i.currentY = i.touchesCurrent.y - i.touchesStart.y + i.startY,
                    i.currentX < i.minX && (i.currentX = i.minX + 1 - Math.pow(i.minX - i.currentX + 1, .8)),
                    i.currentX > i.maxX && (i.currentX = i.maxX - 1 + Math.pow(i.currentX - i.maxX + 1, .8)),
                    i.currentY < i.minY && (i.currentY = i.minY + 1 - Math.pow(i.minY - i.currentY + 1, .8)),
                    i.currentY > i.maxY && (i.currentY = i.maxY - 1 + Math.pow(i.currentY - i.maxY + 1, .8)),
                    a.prevPositionX || (a.prevPositionX = i.touchesCurrent.x),
                    a.prevPositionY || (a.prevPositionY = i.touchesCurrent.y),
                    a.prevTime || (a.prevTime = Date.now()),
                    a.x = (i.touchesCurrent.x - a.prevPositionX) / (Date.now() - a.prevTime) / 2,
                    a.y = (i.touchesCurrent.y - a.prevPositionY) / (Date.now() - a.prevTime) / 2,
                    Math.abs(i.touchesCurrent.x - a.prevPositionX) < 2 && (a.x = 0),
                    Math.abs(i.touchesCurrent.y - a.prevPositionY) < 2 && (a.y = 0),
                    a.prevPositionX = i.touchesCurrent.x,
                    a.prevPositionY = i.touchesCurrent.y,
                    a.prevTime = Date.now(),
                    r.$imageWrapEl.transform("translate3d(" + i.currentX + "px, " + i.currentY + "px,0)")
                }
            }
        },
        onTouchEnd: function() {
            var e = this.zoom
              , t = e.gesture
              , n = e.image
              , r = e.velocity;
            if (t.$imageEl && 0 !== t.$imageEl.length) {
                if (!n.isTouched || !n.isMoved)
                    return n.isTouched = !1,
                    void (n.isMoved = !1);
                n.isTouched = !1,
                n.isMoved = !1;
                var i = 300
                  , a = 300
                  , s = r.x * i
                  , o = n.currentX + s
                  , l = r.y * a
                  , c = n.currentY + l;
                0 !== r.x && (i = Math.abs((o - n.currentX) / r.x)),
                0 !== r.y && (a = Math.abs((c - n.currentY) / r.y));
                var u = Math.max(i, a);
                n.currentX = o,
                n.currentY = c;
                var d = n.width * e.scale
                  , p = n.height * e.scale;
                n.minX = Math.min(t.slideWidth / 2 - d / 2, 0),
                n.maxX = -n.minX,
                n.minY = Math.min(t.slideHeight / 2 - p / 2, 0),
                n.maxY = -n.minY,
                n.currentX = Math.max(Math.min(n.currentX, n.maxX), n.minX),
                n.currentY = Math.max(Math.min(n.currentY, n.maxY), n.minY),
                t.$imageWrapEl.transition(u).transform("translate3d(" + n.currentX + "px, " + n.currentY + "px,0)")
            }
        },
        onTransitionEnd: function() {
            var e = this
              , t = e.zoom
              , n = t.gesture;
            n.$slideEl && e.previousIndex !== e.activeIndex && (n.$imageEl && n.$imageEl.transform("translate3d(0,0,0) scale(1)"),
            n.$imageWrapEl && n.$imageWrapEl.transform("translate3d(0,0,0)"),
            t.scale = 1,
            t.currentScale = 1,
            n.$slideEl = void 0,
            n.$imageEl = void 0,
            n.$imageWrapEl = void 0)
        },
        toggle: function(e) {
            var t = this.zoom;
            t.scale && 1 !== t.scale ? t.out() : t.in(e)
        },
        in: function(e) {
            var t, n, r, i, a, s, l, c, u, d, p, f, h, g, v, b, y = this, w = o(), x = y.zoom, T = y.params.zoom, S = x.gesture, _ = x.image;
            S.$slideEl || (e && e.target && (S.$slideEl = m(e.target).closest("." + y.params.slideClass)),
            S.$slideEl || (y.params.virtual && y.params.virtual.enabled && y.virtual ? S.$slideEl = y.$wrapperEl.children("." + y.params.slideActiveClass) : S.$slideEl = y.slides.eq(y.activeIndex)),
            S.$imageEl = S.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),
            S.$imageWrapEl = S.$imageEl.parent("." + T.containerClass)),
            S.$imageEl && 0 !== S.$imageEl.length && S.$imageWrapEl && 0 !== S.$imageWrapEl.length && (S.$slideEl.addClass("" + T.zoomedSlideClass),
            void 0 === _.touchesStart.x && e ? (t = "touchend" === e.type ? e.changedTouches[0].pageX : e.pageX,
            n = "touchend" === e.type ? e.changedTouches[0].pageY : e.pageY) : (t = _.touchesStart.x,
            n = _.touchesStart.y),
            x.scale = S.$imageWrapEl.attr("data-swiper-zoom") || T.maxRatio,
            x.currentScale = S.$imageWrapEl.attr("data-swiper-zoom") || T.maxRatio,
            e ? (v = S.$slideEl[0].offsetWidth,
            b = S.$slideEl[0].offsetHeight,
            r = S.$slideEl.offset().left + w.scrollX + v / 2 - t,
            i = S.$slideEl.offset().top + w.scrollY + b / 2 - n,
            l = S.$imageEl[0].offsetWidth,
            c = S.$imageEl[0].offsetHeight,
            u = l * x.scale,
            d = c * x.scale,
            h = -(p = Math.min(v / 2 - u / 2, 0)),
            g = -(f = Math.min(b / 2 - d / 2, 0)),
            (a = r * x.scale) < p && (a = p),
            a > h && (a = h),
            (s = i * x.scale) < f && (s = f),
            s > g && (s = g)) : (a = 0,
            s = 0),
            S.$imageWrapEl.transition(300).transform("translate3d(" + a + "px, " + s + "px,0)"),
            S.$imageEl.transition(300).transform("translate3d(0,0,0) scale(" + x.scale + ")"))
        },
        out: function() {
            var e = this
              , t = e.zoom
              , n = e.params.zoom
              , r = t.gesture;
            r.$slideEl || (e.params.virtual && e.params.virtual.enabled && e.virtual ? r.$slideEl = e.$wrapperEl.children("." + e.params.slideActiveClass) : r.$slideEl = e.slides.eq(e.activeIndex),
            r.$imageEl = r.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),
            r.$imageWrapEl = r.$imageEl.parent("." + n.containerClass)),
            r.$imageEl && 0 !== r.$imageEl.length && r.$imageWrapEl && 0 !== r.$imageWrapEl.length && (t.scale = 1,
            t.currentScale = 1,
            r.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"),
            r.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"),
            r.$slideEl.removeClass("" + n.zoomedSlideClass),
            r.$slideEl = void 0)
        },
        toggleGestures: function(e) {
            var t = this
              , n = t.zoom
              , r = n.slideSelector
              , i = n.passiveListener;
            t.$wrapperEl[e]("gesturestart", r, n.onGestureStart, i),
            t.$wrapperEl[e]("gesturechange", r, n.onGestureChange, i),
            t.$wrapperEl[e]("gestureend", r, n.onGestureEnd, i)
        },
        enableGestures: function() {
            this.zoom.gesturesEnabled || (this.zoom.gesturesEnabled = !0,
            this.zoom.toggleGestures("on"))
        },
        disableGestures: function() {
            this.zoom.gesturesEnabled && (this.zoom.gesturesEnabled = !1,
            this.zoom.toggleGestures("off"))
        },
        enable: function() {
            var e = this
              , t = e.support
              , n = e.zoom;
            if (!n.enabled) {
                n.enabled = !0;
                var r = !("touchstart" !== e.touchEvents.start || !t.passiveListener || !e.params.passiveListeners) && {
                    passive: !0,
                    capture: !1
                }
                  , i = !t.passiveListener || {
                    passive: !1,
                    capture: !0
                }
                  , a = "." + e.params.slideClass;
                e.zoom.passiveListener = r,
                e.zoom.slideSelector = a,
                t.gestures ? (e.$wrapperEl.on(e.touchEvents.start, e.zoom.enableGestures, r),
                e.$wrapperEl.on(e.touchEvents.end, e.zoom.disableGestures, r)) : "touchstart" === e.touchEvents.start && (e.$wrapperEl.on(e.touchEvents.start, a, n.onGestureStart, r),
                e.$wrapperEl.on(e.touchEvents.move, a, n.onGestureChange, i),
                e.$wrapperEl.on(e.touchEvents.end, a, n.onGestureEnd, r),
                e.touchEvents.cancel && e.$wrapperEl.on(e.touchEvents.cancel, a, n.onGestureEnd, r)),
                e.$wrapperEl.on(e.touchEvents.move, "." + e.params.zoom.containerClass, n.onTouchMove, i)
            }
        },
        disable: function() {
            var e = this
              , t = e.zoom;
            if (t.enabled) {
                var n = e.support;
                e.zoom.enabled = !1;
                var r = !("touchstart" !== e.touchEvents.start || !n.passiveListener || !e.params.passiveListeners) && {
                    passive: !0,
                    capture: !1
                }
                  , i = !n.passiveListener || {
                    passive: !1,
                    capture: !0
                }
                  , a = "." + e.params.slideClass;
                n.gestures ? (e.$wrapperEl.off(e.touchEvents.start, e.zoom.enableGestures, r),
                e.$wrapperEl.off(e.touchEvents.end, e.zoom.disableGestures, r)) : "touchstart" === e.touchEvents.start && (e.$wrapperEl.off(e.touchEvents.start, a, t.onGestureStart, r),
                e.$wrapperEl.off(e.touchEvents.move, a, t.onGestureChange, i),
                e.$wrapperEl.off(e.touchEvents.end, a, t.onGestureEnd, r),
                e.touchEvents.cancel && e.$wrapperEl.off(e.touchEvents.cancel, a, t.onGestureEnd, r)),
                e.$wrapperEl.off(e.touchEvents.move, "." + e.params.zoom.containerClass, t.onTouchMove, i)
            }
        }
    }
      , re = {
        loadInSlide: function(e, t) {
            void 0 === t && (t = !0);
            var n = this
              , r = n.params.lazy;
            if (void 0 !== e && 0 !== n.slides.length) {
                var i = n.virtual && n.params.virtual.enabled ? n.$wrapperEl.children("." + n.params.slideClass + '[data-swiper-slide-index="' + e + '"]') : n.slides.eq(e)
                  , a = i.find("." + r.elementClass + ":not(." + r.loadedClass + "):not(." + r.loadingClass + ")");
                !i.hasClass(r.elementClass) || i.hasClass(r.loadedClass) || i.hasClass(r.loadingClass) || a.push(i[0]),
                0 !== a.length && a.each((function(e) {
                    var a = m(e);
                    a.addClass(r.loadingClass);
                    var s = a.attr("data-background")
                      , o = a.attr("data-src")
                      , l = a.attr("data-srcset")
                      , c = a.attr("data-sizes")
                      , u = a.parent("picture");
                    n.loadImage(a[0], o || s, l, c, !1, (function() {
                        if (null != n && n && (!n || n.params) && !n.destroyed) {
                            if (s ? (a.css("background-image", 'url("' + s + '")'),
                            a.removeAttr("data-background")) : (l && (a.attr("srcset", l),
                            a.removeAttr("data-srcset")),
                            c && (a.attr("sizes", c),
                            a.removeAttr("data-sizes")),
                            u.length && u.children("source").each((function(e) {
                                var t = m(e);
                                t.attr("data-srcset") && (t.attr("srcset", t.attr("data-srcset")),
                                t.removeAttr("data-srcset"))
                            }
                            )),
                            o && (a.attr("src", o),
                            a.removeAttr("data-src"))),
                            a.addClass(r.loadedClass).removeClass(r.loadingClass),
                            i.find("." + r.preloaderClass).remove(),
                            n.params.loop && t) {
                                var e = i.attr("data-swiper-slide-index");
                                if (i.hasClass(n.params.slideDuplicateClass)) {
                                    var d = n.$wrapperEl.children('[data-swiper-slide-index="' + e + '"]:not(.' + n.params.slideDuplicateClass + ")");
                                    n.lazy.loadInSlide(d.index(), !1)
                                } else {
                                    var p = n.$wrapperEl.children("." + n.params.slideDuplicateClass + '[data-swiper-slide-index="' + e + '"]');
                                    n.lazy.loadInSlide(p.index(), !1)
                                }
                            }
                            n.emit("lazyImageReady", i[0], a[0]),
                            n.params.autoHeight && n.updateAutoHeight()
                        }
                    }
                    )),
                    n.emit("lazyImageLoad", i[0], a[0])
                }
                ))
            }
        },
        load: function() {
            var e = this
              , t = e.$wrapperEl
              , n = e.params
              , r = e.slides
              , i = e.activeIndex
              , a = e.virtual && n.virtual.enabled
              , s = n.lazy
              , o = n.slidesPerView;
            function l(e) {
                if (a) {
                    if (t.children("." + n.slideClass + '[data-swiper-slide-index="' + e + '"]').length)
                        return !0
                } else if (r[e])
                    return !0;
                return !1
            }
            function c(e) {
                return a ? m(e).attr("data-swiper-slide-index") : m(e).index()
            }
            if ("auto" === o && (o = 0),
            e.lazy.initialImageLoaded || (e.lazy.initialImageLoaded = !0),
            e.params.watchSlidesVisibility)
                t.children("." + n.slideVisibleClass).each((function(t) {
                    var n = a ? m(t).attr("data-swiper-slide-index") : m(t).index();
                    e.lazy.loadInSlide(n)
                }
                ));
            else if (o > 1)
                for (var u = i; u < i + o; u += 1)
                    l(u) && e.lazy.loadInSlide(u);
            else
                e.lazy.loadInSlide(i);
            if (s.loadPrevNext)
                if (o > 1 || s.loadPrevNextAmount && s.loadPrevNextAmount > 1) {
                    for (var d = s.loadPrevNextAmount, p = o, f = Math.min(i + p + Math.max(d, p), r.length), h = Math.max(i - Math.max(p, d), 0), g = i + o; g < f; g += 1)
                        l(g) && e.lazy.loadInSlide(g);
                    for (var v = h; v < i; v += 1)
                        l(v) && e.lazy.loadInSlide(v)
                } else {
                    var b = t.children("." + n.slideNextClass);
                    b.length > 0 && e.lazy.loadInSlide(c(b));
                    var y = t.children("." + n.slidePrevClass);
                    y.length > 0 && e.lazy.loadInSlide(c(y))
                }
        },
        checkInViewOnLoad: function() {
            var e = o()
              , t = this;
            if (t && !t.destroyed) {
                var n = t.params.lazy.scrollingElement ? m(t.params.lazy.scrollingElement) : m(e)
                  , r = n[0] === e
                  , i = r ? e.innerWidth : n[0].offsetWidth
                  , a = r ? e.innerHeight : n[0].offsetHeight
                  , s = t.$el.offset()
                  , l = !1;
                t.rtlTranslate && (s.left -= t.$el[0].scrollLeft);
                for (var c = [[s.left, s.top], [s.left + t.width, s.top], [s.left, s.top + t.height], [s.left + t.width, s.top + t.height]], u = 0; u < c.length; u += 1) {
                    var d = c[u];
                    if (d[0] >= 0 && d[0] <= i && d[1] >= 0 && d[1] <= a) {
                        if (0 === d[0] && 0 === d[1])
                            continue;
                        l = !0
                    }
                }
                var p = !("touchstart" !== t.touchEvents.start || !t.support.passiveListener || !t.params.passiveListeners) && {
                    passive: !0,
                    capture: !1
                };
                l ? (t.lazy.load(),
                n.off("scroll", t.lazy.checkInViewOnLoad, p)) : t.lazy.scrollHandlerAttached || (t.lazy.scrollHandlerAttached = !0,
                n.on("scroll", t.lazy.checkInViewOnLoad, p))
            }
        }
    }
      , ie = {
        LinearSpline: function(e, t) {
            var n, r, i, a, s;
            return this.x = e,
            this.y = t,
            this.lastIndex = e.length - 1,
            this.interpolate = function(e) {
                return e ? (s = function(e, t) {
                    for (r = -1,
                    n = e.length; n - r > 1; )
                        e[i = n + r >> 1] <= t ? r = i : n = i;
                    return n
                }(this.x, e),
                a = s - 1,
                (e - this.x[a]) * (this.y[s] - this.y[a]) / (this.x[s] - this.x[a]) + this.y[a]) : 0
            }
            ,
            this
        },
        getInterpolateFunction: function(e) {
            var t = this;
            t.controller.spline || (t.controller.spline = t.params.loop ? new ie.LinearSpline(t.slidesGrid,e.slidesGrid) : new ie.LinearSpline(t.snapGrid,e.snapGrid))
        },
        setTranslate: function(e, t) {
            var n, r, i = this, a = i.controller.control, s = i.constructor;
            function o(e) {
                var t = i.rtlTranslate ? -i.translate : i.translate;
                "slide" === i.params.controller.by && (i.controller.getInterpolateFunction(e),
                r = -i.controller.spline.interpolate(-t)),
                r && "container" !== i.params.controller.by || (n = (e.maxTranslate() - e.minTranslate()) / (i.maxTranslate() - i.minTranslate()),
                r = (t - i.minTranslate()) * n + e.minTranslate()),
                i.params.controller.inverse && (r = e.maxTranslate() - r),
                e.updateProgress(r),
                e.setTranslate(r, i),
                e.updateActiveIndex(),
                e.updateSlidesClasses()
            }
            if (Array.isArray(a))
                for (var l = 0; l < a.length; l += 1)
                    a[l] !== t && a[l]instanceof s && o(a[l]);
            else
                a instanceof s && t !== a && o(a)
        },
        setTransition: function(e, t) {
            var n, r = this, i = r.constructor, a = r.controller.control;
            function s(t) {
                t.setTransition(e, r),
                0 !== e && (t.transitionStart(),
                t.params.autoHeight && w((function() {
                    t.updateAutoHeight()
                }
                )),
                t.$wrapperEl.transitionEnd((function() {
                    a && (t.params.loop && "slide" === r.params.controller.by && t.loopFix(),
                    t.transitionEnd())
                }
                )))
            }
            if (Array.isArray(a))
                for (n = 0; n < a.length; n += 1)
                    a[n] !== t && a[n]instanceof i && s(a[n]);
            else
                a instanceof i && t !== a && s(a)
        }
    }
      , ae = {
        getRandomNumber: function(e) {
            return void 0 === e && (e = 16),
            "x".repeat(e).replace(/x/g, (function() {
                return Math.round(16 * Math.random()).toString(16)
            }
            ))
        },
        makeElFocusable: function(e) {
            return e.attr("tabIndex", "0"),
            e
        },
        makeElNotFocusable: function(e) {
            return e.attr("tabIndex", "-1"),
            e
        },
        addElRole: function(e, t) {
            return e.attr("role", t),
            e
        },
        addElRoleDescription: function(e, t) {
            return e.attr("aria-roledescription", t),
            e
        },
        addElControls: function(e, t) {
            return e.attr("aria-controls", t),
            e
        },
        addElLabel: function(e, t) {
            return e.attr("aria-label", t),
            e
        },
        addElId: function(e, t) {
            return e.attr("id", t),
            e
        },
        addElLive: function(e, t) {
            return e.attr("aria-live", t),
            e
        },
        disableEl: function(e) {
            return e.attr("aria-disabled", !0),
            e
        },
        enableEl: function(e) {
            return e.attr("aria-disabled", !1),
            e
        },
        onEnterOrSpaceKey: function(e) {
            if (13 === e.keyCode || 32 === e.keyCode) {
                var t = this
                  , n = t.params.a11y
                  , r = m(e.target);
                t.navigation && t.navigation.$nextEl && r.is(t.navigation.$nextEl) && (t.isEnd && !t.params.loop || t.slideNext(),
                t.isEnd ? t.a11y.notify(n.lastSlideMessage) : t.a11y.notify(n.nextSlideMessage)),
                t.navigation && t.navigation.$prevEl && r.is(t.navigation.$prevEl) && (t.isBeginning && !t.params.loop || t.slidePrev(),
                t.isBeginning ? t.a11y.notify(n.firstSlideMessage) : t.a11y.notify(n.prevSlideMessage)),
                t.pagination && r.is(D(t.params.pagination.bulletClass)) && r[0].click()
            }
        },
        notify: function(e) {
            var t = this.a11y.liveRegion;
            0 !== t.length && (t.html(""),
            t.html(e))
        },
        updateNavigation: function() {
            var e = this;
            if (!e.params.loop && e.navigation) {
                var t = e.navigation
                  , n = t.$nextEl
                  , r = t.$prevEl;
                r && r.length > 0 && (e.isBeginning ? (e.a11y.disableEl(r),
                e.a11y.makeElNotFocusable(r)) : (e.a11y.enableEl(r),
                e.a11y.makeElFocusable(r))),
                n && n.length > 0 && (e.isEnd ? (e.a11y.disableEl(n),
                e.a11y.makeElNotFocusable(n)) : (e.a11y.enableEl(n),
                e.a11y.makeElFocusable(n)))
            }
        },
        updatePagination: function() {
            var e = this
              , t = e.params.a11y;
            e.pagination && e.params.pagination.clickable && e.pagination.bullets && e.pagination.bullets.length && e.pagination.bullets.each((function(n) {
                var r = m(n);
                e.a11y.makeElFocusable(r),
                e.params.pagination.renderBullet || (e.a11y.addElRole(r, "button"),
                e.a11y.addElLabel(r, t.paginationBulletMessage.replace(/\{\{index\}\}/, r.index() + 1)))
            }
            ))
        },
        init: function() {
            var e = this
              , t = e.params.a11y;
            e.$el.append(e.a11y.liveRegion);
            var n = e.$el;
            t.containerRoleDescriptionMessage && e.a11y.addElRoleDescription(n, t.containerRoleDescriptionMessage),
            t.containerMessage && e.a11y.addElLabel(n, t.containerMessage);
            var r = e.$wrapperEl
              , i = r.attr("id") || "swiper-wrapper-" + e.a11y.getRandomNumber(16)
              , a = e.params.autoplay && e.params.autoplay.enabled ? "off" : "polite";
            e.a11y.addElId(r, i),
            e.a11y.addElLive(r, a),
            t.itemRoleDescriptionMessage && e.a11y.addElRoleDescription(m(e.slides), t.itemRoleDescriptionMessage),
            e.a11y.addElRole(m(e.slides), t.slideRole);
            var s, o, l = e.params.loop ? e.slides.filter((function(t) {
                return !t.classList.contains(e.params.slideDuplicateClass)
            }
            )).length : e.slides.length;
            e.slides.each((function(n, r) {
                var i = m(n)
                  , a = e.params.loop ? parseInt(i.attr("data-swiper-slide-index"), 10) : r
                  , s = t.slideLabelMessage.replace(/\{\{index\}\}/, a + 1).replace(/\{\{slidesLength\}\}/, l);
                e.a11y.addElLabel(i, s)
            }
            )),
            e.navigation && e.navigation.$nextEl && (s = e.navigation.$nextEl),
            e.navigation && e.navigation.$prevEl && (o = e.navigation.$prevEl),
            s && s.length && (e.a11y.makeElFocusable(s),
            "BUTTON" !== s[0].tagName && (e.a11y.addElRole(s, "button"),
            s.on("keydown", e.a11y.onEnterOrSpaceKey)),
            e.a11y.addElLabel(s, t.nextSlideMessage),
            e.a11y.addElControls(s, i)),
            o && o.length && (e.a11y.makeElFocusable(o),
            "BUTTON" !== o[0].tagName && (e.a11y.addElRole(o, "button"),
            o.on("keydown", e.a11y.onEnterOrSpaceKey)),
            e.a11y.addElLabel(o, t.prevSlideMessage),
            e.a11y.addElControls(o, i)),
            e.pagination && e.params.pagination.clickable && e.pagination.bullets && e.pagination.bullets.length && e.pagination.$el.on("keydown", D(e.params.pagination.bulletClass), e.a11y.onEnterOrSpaceKey)
        },
        destroy: function() {
            var e, t, n = this;
            n.a11y.liveRegion && n.a11y.liveRegion.length > 0 && n.a11y.liveRegion.remove(),
            n.navigation && n.navigation.$nextEl && (e = n.navigation.$nextEl),
            n.navigation && n.navigation.$prevEl && (t = n.navigation.$prevEl),
            e && e.off("keydown", n.a11y.onEnterOrSpaceKey),
            t && t.off("keydown", n.a11y.onEnterOrSpaceKey),
            n.pagination && n.params.pagination.clickable && n.pagination.bullets && n.pagination.bullets.length && n.pagination.$el.off("keydown", D(n.params.pagination.bulletClass), n.a11y.onEnterOrSpaceKey)
        }
    }
      , se = {
        init: function() {
            var e = this
              , t = o();
            if (e.params.history) {
                if (!t.history || !t.history.pushState)
                    return e.params.history.enabled = !1,
                    void (e.params.hashNavigation.enabled = !0);
                var n = e.history;
                n.initialized = !0,
                n.paths = se.getPathValues(e.params.url),
                (n.paths.key || n.paths.value) && (n.scrollToSlide(0, n.paths.value, e.params.runCallbacksOnInit),
                e.params.history.replaceState || t.addEventListener("popstate", e.history.setHistoryPopState))
            }
        },
        destroy: function() {
            var e = o();
            this.params.history.replaceState || e.removeEventListener("popstate", this.history.setHistoryPopState)
        },
        setHistoryPopState: function() {
            var e = this;
            e.history.paths = se.getPathValues(e.params.url),
            e.history.scrollToSlide(e.params.speed, e.history.paths.value, !1)
        },
        getPathValues: function(e) {
            var t = o()
              , n = (e ? new URL(e) : t.location).pathname.slice(1).split("/").filter((function(e) {
                return "" !== e
            }
            ))
              , r = n.length;
            return {
                key: n[r - 2],
                value: n[r - 1]
            }
        },
        setHistory: function(e, t) {
            var n = this
              , r = o();
            if (n.history.initialized && n.params.history.enabled) {
                var i;
                i = n.params.url ? new URL(n.params.url) : r.location;
                var a = n.slides.eq(t)
                  , s = se.slugify(a.attr("data-history"));
                if (n.params.history.root.length > 0) {
                    var l = n.params.history.root;
                    "/" === l[l.length - 1] && (l = l.slice(0, l.length - 1)),
                    s = l + "/" + e + "/" + s
                } else
                    i.pathname.includes(e) || (s = e + "/" + s);
                var c = r.history.state;
                c && c.value === s || (n.params.history.replaceState ? r.history.replaceState({
                    value: s
                }, null, s) : r.history.pushState({
                    value: s
                }, null, s))
            }
        },
        slugify: function(e) {
            return e.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "")
        },
        scrollToSlide: function(e, t, n) {
            var r = this;
            if (t)
                for (var i = 0, a = r.slides.length; i < a; i += 1) {
                    var s = r.slides.eq(i);
                    if (se.slugify(s.attr("data-history")) === t && !s.hasClass(r.params.slideDuplicateClass)) {
                        var o = s.index();
                        r.slideTo(o, e, n)
                    }
                }
            else
                r.slideTo(0, e, n)
        }
    }
      , oe = {
        onHashChange: function() {
            var e = this
              , t = a();
            e.emit("hashChange");
            var n = t.location.hash.replace("#", "");
            if (n !== e.slides.eq(e.activeIndex).attr("data-hash")) {
                var r = e.$wrapperEl.children("." + e.params.slideClass + '[data-hash="' + n + '"]').index();
                if (void 0 === r)
                    return;
                e.slideTo(r)
            }
        },
        setHash: function() {
            var e = this
              , t = o()
              , n = a();
            if (e.hashNavigation.initialized && e.params.hashNavigation.enabled)
                if (e.params.hashNavigation.replaceState && t.history && t.history.replaceState)
                    t.history.replaceState(null, null, "#" + e.slides.eq(e.activeIndex).attr("data-hash") || ""),
                    e.emit("hashSet");
                else {
                    var r = e.slides.eq(e.activeIndex)
                      , i = r.attr("data-hash") || r.attr("data-history");
                    n.location.hash = i || "",
                    e.emit("hashSet")
                }
        },
        init: function() {
            var e = this
              , t = a()
              , n = o();
            if (!(!e.params.hashNavigation.enabled || e.params.history && e.params.history.enabled)) {
                e.hashNavigation.initialized = !0;
                var r = t.location.hash.replace("#", "");
                if (r)
                    for (var i = 0, s = e.slides.length; i < s; i += 1) {
                        var l = e.slides.eq(i);
                        if ((l.attr("data-hash") || l.attr("data-history")) === r && !l.hasClass(e.params.slideDuplicateClass)) {
                            var c = l.index();
                            e.slideTo(c, 0, e.params.runCallbacksOnInit, !0)
                        }
                    }
                e.params.hashNavigation.watchState && m(n).on("hashchange", e.hashNavigation.onHashChange)
            }
        },
        destroy: function() {
            var e = o();
            this.params.hashNavigation.watchState && m(e).off("hashchange", this.hashNavigation.onHashChange)
        }
    }
      , le = {
        run: function() {
            var e = this
              , t = e.slides.eq(e.activeIndex)
              , n = e.params.autoplay.delay;
            t.attr("data-swiper-autoplay") && (n = t.attr("data-swiper-autoplay") || e.params.autoplay.delay),
            clearTimeout(e.autoplay.timeout),
            e.autoplay.timeout = w((function() {
                var t;
                e.params.autoplay.reverseDirection ? e.params.loop ? (e.loopFix(),
                t = e.slidePrev(e.params.speed, !0, !0),
                e.emit("autoplay")) : e.isBeginning ? e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (t = e.slideTo(e.slides.length - 1, e.params.speed, !0, !0),
                e.emit("autoplay")) : (t = e.slidePrev(e.params.speed, !0, !0),
                e.emit("autoplay")) : e.params.loop ? (e.loopFix(),
                t = e.slideNext(e.params.speed, !0, !0),
                e.emit("autoplay")) : e.isEnd ? e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (t = e.slideTo(0, e.params.speed, !0, !0),
                e.emit("autoplay")) : (t = e.slideNext(e.params.speed, !0, !0),
                e.emit("autoplay")),
                (e.params.cssMode && e.autoplay.running || !1 === t) && e.autoplay.run()
            }
            ), n)
        },
        start: function() {
            var e = this;
            return void 0 === e.autoplay.timeout && !e.autoplay.running && (e.autoplay.running = !0,
            e.emit("autoplayStart"),
            e.autoplay.run(),
            !0)
        },
        stop: function() {
            var e = this;
            return !!e.autoplay.running && void 0 !== e.autoplay.timeout && (e.autoplay.timeout && (clearTimeout(e.autoplay.timeout),
            e.autoplay.timeout = void 0),
            e.autoplay.running = !1,
            e.emit("autoplayStop"),
            !0)
        },
        pause: function(e) {
            var t = this;
            t.autoplay.running && (t.autoplay.paused || (t.autoplay.timeout && clearTimeout(t.autoplay.timeout),
            t.autoplay.paused = !0,
            0 !== e && t.params.autoplay.waitForTransition ? ["transitionend", "webkitTransitionEnd"].forEach((function(e) {
                t.$wrapperEl[0].addEventListener(e, t.autoplay.onTransitionEnd)
            }
            )) : (t.autoplay.paused = !1,
            t.autoplay.run())))
        },
        onVisibilityChange: function() {
            var e = this
              , t = a();
            "hidden" === t.visibilityState && e.autoplay.running && e.autoplay.pause(),
            "visible" === t.visibilityState && e.autoplay.paused && (e.autoplay.run(),
            e.autoplay.paused = !1)
        },
        onTransitionEnd: function(e) {
            var t = this;
            t && !t.destroyed && t.$wrapperEl && e.target === t.$wrapperEl[0] && (["transitionend", "webkitTransitionEnd"].forEach((function(e) {
                t.$wrapperEl[0].removeEventListener(e, t.autoplay.onTransitionEnd)
            }
            )),
            t.autoplay.paused = !1,
            t.autoplay.running ? t.autoplay.run() : t.autoplay.stop())
        },
        onMouseEnter: function() {
            var e = this;
            e.params.autoplay.disableOnInteraction ? e.autoplay.stop() : e.autoplay.pause(),
            ["transitionend", "webkitTransitionEnd"].forEach((function(t) {
                e.$wrapperEl[0].removeEventListener(t, e.autoplay.onTransitionEnd)
            }
            ))
        },
        onMouseLeave: function() {
            var e = this;
            e.params.autoplay.disableOnInteraction || (e.autoplay.paused = !1,
            e.autoplay.run())
        },
        attachMouseEvents: function() {
            var e = this;
            e.params.autoplay.pauseOnMouseEnter && (e.$el.on("mouseenter", e.autoplay.onMouseEnter),
            e.$el.on("mouseleave", e.autoplay.onMouseLeave))
        },
        detachMouseEvents: function() {
            var e = this;
            e.$el.off("mouseenter", e.autoplay.onMouseEnter),
            e.$el.off("mouseleave", e.autoplay.onMouseLeave)
        }
    }
      , ce = {
        setTranslate: function() {
            for (var e = this, t = e.slides, n = 0; n < t.length; n += 1) {
                var r = e.slides.eq(n)
                  , i = -r[0].swiperSlideOffset;
                e.params.virtualTranslate || (i -= e.translate);
                var a = 0;
                e.isHorizontal() || (a = i,
                i = 0);
                var s = e.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(r[0].progress), 0) : 1 + Math.min(Math.max(r[0].progress, -1), 0);
                r.css({
                    opacity: s
                }).transform("translate3d(" + i + "px, " + a + "px, 0px)")
            }
        },
        setTransition: function(e) {
            var t = this
              , n = t.slides
              , r = t.$wrapperEl;
            if (n.transition(e),
            t.params.virtualTranslate && 0 !== e) {
                var i = !1;
                n.transitionEnd((function() {
                    if (!i && t && !t.destroyed) {
                        i = !0,
                        t.animating = !1;
                        for (var e = ["webkitTransitionEnd", "transitionend"], n = 0; n < e.length; n += 1)
                            r.trigger(e[n])
                    }
                }
                ))
            }
        }
    }
      , ue = {
        setTranslate: function() {
            var e, t = this, n = t.$el, r = t.$wrapperEl, i = t.slides, a = t.width, s = t.height, o = t.rtlTranslate, l = t.size, c = t.browser, u = t.params.cubeEffect, d = t.isHorizontal(), p = t.virtual && t.params.virtual.enabled, f = 0;
            u.shadow && (d ? (0 === (e = r.find(".swiper-cube-shadow")).length && (e = m('<div class="swiper-cube-shadow"></div>'),
            r.append(e)),
            e.css({
                height: a + "px"
            })) : 0 === (e = n.find(".swiper-cube-shadow")).length && (e = m('<div class="swiper-cube-shadow"></div>'),
            n.append(e)));
            for (var h = 0; h < i.length; h += 1) {
                var g = i.eq(h)
                  , v = h;
                p && (v = parseInt(g.attr("data-swiper-slide-index"), 10));
                var b = 90 * v
                  , y = Math.floor(b / 360);
                o && (b = -b,
                y = Math.floor(-b / 360));
                var w = Math.max(Math.min(g[0].progress, 1), -1)
                  , x = 0
                  , T = 0
                  , S = 0;
                v % 4 == 0 ? (x = 4 * -y * l,
                S = 0) : (v - 1) % 4 == 0 ? (x = 0,
                S = 4 * -y * l) : (v - 2) % 4 == 0 ? (x = l + 4 * y * l,
                S = l) : (v - 3) % 4 == 0 && (x = -l,
                S = 3 * l + 4 * l * y),
                o && (x = -x),
                d || (T = x,
                x = 0);
                var _ = "rotateX(" + (d ? 0 : -b) + "deg) rotateY(" + (d ? b : 0) + "deg) translate3d(" + x + "px, " + T + "px, " + S + "px)";
                if (w <= 1 && w > -1 && (f = 90 * v + 90 * w,
                o && (f = 90 * -v - 90 * w)),
                g.transform(_),
                u.slideShadows) {
                    var C = d ? g.find(".swiper-slide-shadow-left") : g.find(".swiper-slide-shadow-top")
                      , E = d ? g.find(".swiper-slide-shadow-right") : g.find(".swiper-slide-shadow-bottom");
                    0 === C.length && (C = m('<div class="swiper-slide-shadow-' + (d ? "left" : "top") + '"></div>'),
                    g.append(C)),
                    0 === E.length && (E = m('<div class="swiper-slide-shadow-' + (d ? "right" : "bottom") + '"></div>'),
                    g.append(E)),
                    C.length && (C[0].style.opacity = Math.max(-w, 0)),
                    E.length && (E[0].style.opacity = Math.max(w, 0))
                }
            }
            if (r.css({
                "-webkit-transform-origin": "50% 50% -" + l / 2 + "px",
                "-moz-transform-origin": "50% 50% -" + l / 2 + "px",
                "-ms-transform-origin": "50% 50% -" + l / 2 + "px",
                "transform-origin": "50% 50% -" + l / 2 + "px"
            }),
            u.shadow)
                if (d)
                    e.transform("translate3d(0px, " + (a / 2 + u.shadowOffset) + "px, " + -a / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + u.shadowScale + ")");
                else {
                    var D = Math.abs(f) - 90 * Math.floor(Math.abs(f) / 90)
                      , A = 1.5 - (Math.sin(2 * D * Math.PI / 360) / 2 + Math.cos(2 * D * Math.PI / 360) / 2)
                      , k = u.shadowScale
                      , L = u.shadowScale / A
                      , M = u.shadowOffset;
                    e.transform("scale3d(" + k + ", 1, " + L + ") translate3d(0px, " + (s / 2 + M) + "px, " + -s / 2 / L + "px) rotateX(-90deg)")
                }
            var P = c.isSafari || c.isWebView ? -l / 2 : 0;
            r.transform("translate3d(0px,0," + P + "px) rotateX(" + (t.isHorizontal() ? 0 : f) + "deg) rotateY(" + (t.isHorizontal() ? -f : 0) + "deg)")
        },
        setTransition: function(e) {
            var t = this
              , n = t.$el;
            t.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
            t.params.cubeEffect.shadow && !t.isHorizontal() && n.find(".swiper-cube-shadow").transition(e)
        }
    }
      , de = {
        setTranslate: function() {
            for (var e = this, t = e.slides, n = e.rtlTranslate, r = 0; r < t.length; r += 1) {
                var i = t.eq(r)
                  , a = i[0].progress;
                e.params.flipEffect.limitRotation && (a = Math.max(Math.min(i[0].progress, 1), -1));
                var s = -180 * a
                  , o = 0
                  , l = -i[0].swiperSlideOffset
                  , c = 0;
                if (e.isHorizontal() ? n && (s = -s) : (c = l,
                l = 0,
                o = -s,
                s = 0),
                i[0].style.zIndex = -Math.abs(Math.round(a)) + t.length,
                e.params.flipEffect.slideShadows) {
                    var u = e.isHorizontal() ? i.find(".swiper-slide-shadow-left") : i.find(".swiper-slide-shadow-top")
                      , d = e.isHorizontal() ? i.find(".swiper-slide-shadow-right") : i.find(".swiper-slide-shadow-bottom");
                    0 === u.length && (u = m('<div class="swiper-slide-shadow-' + (e.isHorizontal() ? "left" : "top") + '"></div>'),
                    i.append(u)),
                    0 === d.length && (d = m('<div class="swiper-slide-shadow-' + (e.isHorizontal() ? "right" : "bottom") + '"></div>'),
                    i.append(d)),
                    u.length && (u[0].style.opacity = Math.max(-a, 0)),
                    d.length && (d[0].style.opacity = Math.max(a, 0))
                }
                i.transform("translate3d(" + l + "px, " + c + "px, 0px) rotateX(" + o + "deg) rotateY(" + s + "deg)")
            }
        },
        setTransition: function(e) {
            var t = this
              , n = t.slides
              , r = t.activeIndex
              , i = t.$wrapperEl;
            if (n.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
            t.params.virtualTranslate && 0 !== e) {
                var a = !1;
                n.eq(r).transitionEnd((function() {
                    if (!a && t && !t.destroyed) {
                        a = !0,
                        t.animating = !1;
                        for (var e = ["webkitTransitionEnd", "transitionend"], n = 0; n < e.length; n += 1)
                            i.trigger(e[n])
                    }
                }
                ))
            }
        }
    }
      , pe = {
        setTranslate: function() {
            for (var e = this, t = e.width, n = e.height, r = e.slides, i = e.slidesSizesGrid, a = e.params.coverflowEffect, s = e.isHorizontal(), o = e.translate, l = s ? t / 2 - o : n / 2 - o, c = s ? a.rotate : -a.rotate, u = a.depth, d = 0, p = r.length; d < p; d += 1) {
                var f = r.eq(d)
                  , h = i[d]
                  , g = (l - f[0].swiperSlideOffset - h / 2) / h * a.modifier
                  , v = s ? c * g : 0
                  , b = s ? 0 : c * g
                  , y = -u * Math.abs(g)
                  , w = a.stretch;
                "string" == typeof w && -1 !== w.indexOf("%") && (w = parseFloat(a.stretch) / 100 * h);
                var x = s ? 0 : w * g
                  , T = s ? w * g : 0
                  , S = 1 - (1 - a.scale) * Math.abs(g);
                Math.abs(T) < .001 && (T = 0),
                Math.abs(x) < .001 && (x = 0),
                Math.abs(y) < .001 && (y = 0),
                Math.abs(v) < .001 && (v = 0),
                Math.abs(b) < .001 && (b = 0),
                Math.abs(S) < .001 && (S = 0);
                var _ = "translate3d(" + T + "px," + x + "px," + y + "px)  rotateX(" + b + "deg) rotateY(" + v + "deg) scale(" + S + ")";
                if (f.transform(_),
                f[0].style.zIndex = 1 - Math.abs(Math.round(g)),
                a.slideShadows) {
                    var C = s ? f.find(".swiper-slide-shadow-left") : f.find(".swiper-slide-shadow-top")
                      , E = s ? f.find(".swiper-slide-shadow-right") : f.find(".swiper-slide-shadow-bottom");
                    0 === C.length && (C = m('<div class="swiper-slide-shadow-' + (s ? "left" : "top") + '"></div>'),
                    f.append(C)),
                    0 === E.length && (E = m('<div class="swiper-slide-shadow-' + (s ? "right" : "bottom") + '"></div>'),
                    f.append(E)),
                    C.length && (C[0].style.opacity = g > 0 ? g : 0),
                    E.length && (E[0].style.opacity = -g > 0 ? -g : 0)
                }
            }
        },
        setTransition: function(e) {
            this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)
        }
    }
      , fe = {
        init: function() {
            var e = this
              , t = e.params.thumbs;
            if (e.thumbs.initialized)
                return !1;
            e.thumbs.initialized = !0;
            var n = e.constructor;
            return t.swiper instanceof n ? (e.thumbs.swiper = t.swiper,
            C(e.thumbs.swiper.originalParams, {
                watchSlidesProgress: !0,
                slideToClickedSlide: !1
            }),
            C(e.thumbs.swiper.params, {
                watchSlidesProgress: !0,
                slideToClickedSlide: !1
            })) : S(t.swiper) && (e.thumbs.swiper = new n(C({}, t.swiper, {
                watchSlidesVisibility: !0,
                watchSlidesProgress: !0,
                slideToClickedSlide: !1
            })),
            e.thumbs.swiperCreated = !0),
            e.thumbs.swiper.$el.addClass(e.params.thumbs.thumbsContainerClass),
            e.thumbs.swiper.on("tap", e.thumbs.onThumbClick),
            !0
        },
        onThumbClick: function() {
            var e = this
              , t = e.thumbs.swiper;
            if (t) {
                var n = t.clickedIndex
                  , r = t.clickedSlide;
                if (!(r && m(r).hasClass(e.params.thumbs.slideThumbActiveClass) || null == n)) {
                    var i;
                    if (i = t.params.loop ? parseInt(m(t.clickedSlide).attr("data-swiper-slide-index"), 10) : n,
                    e.params.loop) {
                        var a = e.activeIndex;
                        e.slides.eq(a).hasClass(e.params.slideDuplicateClass) && (e.loopFix(),
                        e._clientLeft = e.$wrapperEl[0].clientLeft,
                        a = e.activeIndex);
                        var s = e.slides.eq(a).prevAll('[data-swiper-slide-index="' + i + '"]').eq(0).index()
                          , o = e.slides.eq(a).nextAll('[data-swiper-slide-index="' + i + '"]').eq(0).index();
                        i = void 0 === s ? o : void 0 === o ? s : o - a < a - s ? o : s
                    }
                    e.slideTo(i)
                }
            }
        },
        update: function(e) {
            var t = this
              , n = t.thumbs.swiper;
            if (n) {
                var r = "auto" === n.params.slidesPerView ? n.slidesPerViewDynamic() : n.params.slidesPerView
                  , i = t.params.thumbs.autoScrollOffset
                  , a = i && !n.params.loop;
                if (t.realIndex !== n.realIndex || a) {
                    var s, o, l = n.activeIndex;
                    if (n.params.loop) {
                        n.slides.eq(l).hasClass(n.params.slideDuplicateClass) && (n.loopFix(),
                        n._clientLeft = n.$wrapperEl[0].clientLeft,
                        l = n.activeIndex);
                        var c = n.slides.eq(l).prevAll('[data-swiper-slide-index="' + t.realIndex + '"]').eq(0).index()
                          , u = n.slides.eq(l).nextAll('[data-swiper-slide-index="' + t.realIndex + '"]').eq(0).index();
                        s = void 0 === c ? u : void 0 === u ? c : u - l == l - c ? n.params.slidesPerGroup > 1 ? u : l : u - l < l - c ? u : c,
                        o = t.activeIndex > t.previousIndex ? "next" : "prev"
                    } else
                        o = (s = t.realIndex) > t.previousIndex ? "next" : "prev";
                    a && (s += "next" === o ? i : -1 * i),
                    n.visibleSlidesIndexes && n.visibleSlidesIndexes.indexOf(s) < 0 && (n.params.centeredSlides ? s = s > l ? s - Math.floor(r / 2) + 1 : s + Math.floor(r / 2) - 1 : s > l && n.params.slidesPerGroup,
                    n.slideTo(s, e ? 0 : void 0))
                }
                var d = 1
                  , p = t.params.thumbs.slideThumbActiveClass;
                if (t.params.slidesPerView > 1 && !t.params.centeredSlides && (d = t.params.slidesPerView),
                t.params.thumbs.multipleActiveThumbs || (d = 1),
                d = Math.floor(d),
                n.slides.removeClass(p),
                n.params.loop || n.params.virtual && n.params.virtual.enabled)
                    for (var f = 0; f < d; f += 1)
                        n.$wrapperEl.children('[data-swiper-slide-index="' + (t.realIndex + f) + '"]').addClass(p);
                else
                    for (var h = 0; h < d; h += 1)
                        n.slides.eq(t.realIndex + h).addClass(p)
            }
        }
    }
      , he = [Y, K, {
        name: "mousewheel",
        params: {
            mousewheel: {
                enabled: !1,
                releaseOnEdges: !1,
                invert: !1,
                forceToAxis: !1,
                sensitivity: 1,
                eventsTarget: "container",
                thresholdDelta: null,
                thresholdTime: null
            }
        },
        create: function() {
            E(this, {
                mousewheel: {
                    enabled: !1,
                    lastScrollTime: x(),
                    lastEventBeforeSnap: void 0,
                    recentWheelEvents: [],
                    enable: J.enable,
                    disable: J.disable,
                    handle: J.handle,
                    handleMouseEnter: J.handleMouseEnter,
                    handleMouseLeave: J.handleMouseLeave,
                    animateSlider: J.animateSlider,
                    releaseScroll: J.releaseScroll
                }
            })
        },
        on: {
            init: function(e) {
                !e.params.mousewheel.enabled && e.params.cssMode && e.mousewheel.disable(),
                e.params.mousewheel.enabled && e.mousewheel.enable()
            },
            destroy: function(e) {
                e.params.cssMode && e.mousewheel.enable(),
                e.mousewheel.enabled && e.mousewheel.disable()
            }
        }
    }, {
        name: "navigation",
        params: {
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: !1,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock"
            }
        },
        create: function() {
            E(this, {
                navigation: t({}, Q)
            })
        },
        on: {
            init: function(e) {
                e.navigation.init(),
                e.navigation.update()
            },
            toEdge: function(e) {
                e.navigation.update()
            },
            fromEdge: function(e) {
                e.navigation.update()
            },
            destroy: function(e) {
                e.navigation.destroy()
            },
            "enable disable": function(e) {
                var t = e.navigation
                  , n = t.$nextEl
                  , r = t.$prevEl;
                n && n[e.enabled ? "removeClass" : "addClass"](e.params.navigation.lockClass),
                r && r[e.enabled ? "removeClass" : "addClass"](e.params.navigation.lockClass)
            },
            click: function(e, t) {
                var n = e.navigation
                  , r = n.$nextEl
                  , i = n.$prevEl
                  , a = t.target;
                if (e.params.navigation.hideOnClick && !m(a).is(i) && !m(a).is(r)) {
                    if (e.pagination && e.params.pagination && e.params.pagination.clickable && (e.pagination.el === a || e.pagination.el.contains(a)))
                        return;
                    var s;
                    r ? s = r.hasClass(e.params.navigation.hiddenClass) : i && (s = i.hasClass(e.params.navigation.hiddenClass)),
                    !0 === s ? e.emit("navigationShow") : e.emit("navigationHide"),
                    r && r.toggleClass(e.params.navigation.hiddenClass),
                    i && i.toggleClass(e.params.navigation.hiddenClass)
                }
            }
        }
    }, {
        name: "pagination",
        params: {
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: !1,
                hideOnClick: !1,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: !1,
                type: "bullets",
                dynamicBullets: !1,
                dynamicMainBullets: 1,
                formatFractionCurrent: function(e) {
                    return e
                },
                formatFractionTotal: function(e) {
                    return e
                },
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
                modifierClass: "swiper-pagination-",
                currentClass: "swiper-pagination-current",
                totalClass: "swiper-pagination-total",
                hiddenClass: "swiper-pagination-hidden",
                progressbarFillClass: "swiper-pagination-progressbar-fill",
                progressbarOppositeClass: "swiper-pagination-progressbar-opposite",
                clickableClass: "swiper-pagination-clickable",
                lockClass: "swiper-pagination-lock"
            }
        },
        create: function() {
            E(this, {
                pagination: t({
                    dynamicBulletIndex: 0
                }, Z)
            })
        },
        on: {
            init: function(e) {
                e.pagination.init(),
                e.pagination.render(),
                e.pagination.update()
            },
            activeIndexChange: function(e) {
                (e.params.loop || void 0 === e.snapIndex) && e.pagination.update()
            },
            snapIndexChange: function(e) {
                e.params.loop || e.pagination.update()
            },
            slidesLengthChange: function(e) {
                e.params.loop && (e.pagination.render(),
                e.pagination.update())
            },
            snapGridLengthChange: function(e) {
                e.params.loop || (e.pagination.render(),
                e.pagination.update())
            },
            destroy: function(e) {
                e.pagination.destroy()
            },
            "enable disable": function(e) {
                var t = e.pagination.$el;
                t && t[e.enabled ? "removeClass" : "addClass"](e.params.pagination.lockClass)
            },
            click: function(e, t) {
                var n = t.target;
                if (e.params.pagination.el && e.params.pagination.hideOnClick && e.pagination.$el.length > 0 && !m(n).hasClass(e.params.pagination.bulletClass)) {
                    if (e.navigation && (e.navigation.nextEl && n === e.navigation.nextEl || e.navigation.prevEl && n === e.navigation.prevEl))
                        return;
                    !0 === e.pagination.$el.hasClass(e.params.pagination.hiddenClass) ? e.emit("paginationShow") : e.emit("paginationHide"),
                    e.pagination.$el.toggleClass(e.params.pagination.hiddenClass)
                }
            }
        }
    }, {
        name: "scrollbar",
        params: {
            scrollbar: {
                el: null,
                dragSize: "auto",
                hide: !1,
                draggable: !1,
                snapOnRelease: !0,
                lockClass: "swiper-scrollbar-lock",
                dragClass: "swiper-scrollbar-drag"
            }
        },
        create: function() {
            E(this, {
                scrollbar: t({
                    isTouched: !1,
                    timeout: null,
                    dragTimeout: null
                }, ee)
            })
        },
        on: {
            init: function(e) {
                e.scrollbar.init(),
                e.scrollbar.updateSize(),
                e.scrollbar.setTranslate()
            },
            update: function(e) {
                e.scrollbar.updateSize()
            },
            resize: function(e) {
                e.scrollbar.updateSize()
            },
            observerUpdate: function(e) {
                e.scrollbar.updateSize()
            },
            setTranslate: function(e) {
                e.scrollbar.setTranslate()
            },
            setTransition: function(e, t) {
                e.scrollbar.setTransition(t)
            },
            "enable disable": function(e) {
                var t = e.scrollbar.$el;
                t && t[e.enabled ? "removeClass" : "addClass"](e.params.scrollbar.lockClass)
            },
            destroy: function(e) {
                e.scrollbar.destroy()
            }
        }
    }, {
        name: "parallax",
        params: {
            parallax: {
                enabled: !1
            }
        },
        create: function() {
            E(this, {
                parallax: t({}, te)
            })
        },
        on: {
            beforeInit: function(e) {
                e.params.parallax.enabled && (e.params.watchSlidesProgress = !0,
                e.originalParams.watchSlidesProgress = !0)
            },
            init: function(e) {
                e.params.parallax.enabled && e.parallax.setTranslate()
            },
            setTranslate: function(e) {
                e.params.parallax.enabled && e.parallax.setTranslate()
            },
            setTransition: function(e, t) {
                e.params.parallax.enabled && e.parallax.setTransition(t)
            }
        }
    }, {
        name: "zoom",
        params: {
            zoom: {
                enabled: !1,
                maxRatio: 3,
                minRatio: 1,
                toggle: !0,
                containerClass: "swiper-zoom-container",
                zoomedSlideClass: "swiper-slide-zoomed"
            }
        },
        create: function() {
            var e = this;
            E(e, {
                zoom: t({
                    enabled: !1,
                    scale: 1,
                    currentScale: 1,
                    isScaling: !1,
                    gesture: {
                        $slideEl: void 0,
                        slideWidth: void 0,
                        slideHeight: void 0,
                        $imageEl: void 0,
                        $imageWrapEl: void 0,
                        maxRatio: 3
                    },
                    image: {
                        isTouched: void 0,
                        isMoved: void 0,
                        currentX: void 0,
                        currentY: void 0,
                        minX: void 0,
                        minY: void 0,
                        maxX: void 0,
                        maxY: void 0,
                        width: void 0,
                        height: void 0,
                        startX: void 0,
                        startY: void 0,
                        touchesStart: {},
                        touchesCurrent: {}
                    },
                    velocity: {
                        x: void 0,
                        y: void 0,
                        prevPositionX: void 0,
                        prevPositionY: void 0,
                        prevTime: void 0
                    }
                }, ne)
            });
            var n = 1;
            Object.defineProperty(e.zoom, "scale", {
                get: function() {
                    return n
                },
                set: function(t) {
                    if (n !== t) {
                        var r = e.zoom.gesture.$imageEl ? e.zoom.gesture.$imageEl[0] : void 0
                          , i = e.zoom.gesture.$slideEl ? e.zoom.gesture.$slideEl[0] : void 0;
                        e.emit("zoomChange", t, r, i)
                    }
                    n = t
                }
            })
        },
        on: {
            init: function(e) {
                e.params.zoom.enabled && e.zoom.enable()
            },
            destroy: function(e) {
                e.zoom.disable()
            },
            touchStart: function(e, t) {
                e.zoom.enabled && e.zoom.onTouchStart(t)
            },
            touchEnd: function(e, t) {
                e.zoom.enabled && e.zoom.onTouchEnd(t)
            },
            doubleTap: function(e, t) {
                !e.animating && e.params.zoom.enabled && e.zoom.enabled && e.params.zoom.toggle && e.zoom.toggle(t)
            },
            transitionEnd: function(e) {
                e.zoom.enabled && e.params.zoom.enabled && e.zoom.onTransitionEnd()
            },
            slideChange: function(e) {
                e.zoom.enabled && e.params.zoom.enabled && e.params.cssMode && e.zoom.onTransitionEnd()
            }
        }
    }, {
        name: "lazy",
        params: {
            lazy: {
                checkInView: !1,
                enabled: !1,
                loadPrevNext: !1,
                loadPrevNextAmount: 1,
                loadOnTransitionStart: !1,
                scrollingElement: "",
                elementClass: "swiper-lazy",
                loadingClass: "swiper-lazy-loading",
                loadedClass: "swiper-lazy-loaded",
                preloaderClass: "swiper-lazy-preloader"
            }
        },
        create: function() {
            E(this, {
                lazy: t({
                    initialImageLoaded: !1
                }, re)
            })
        },
        on: {
            beforeInit: function(e) {
                e.params.lazy.enabled && e.params.preloadImages && (e.params.preloadImages = !1)
            },
            init: function(e) {
                e.params.lazy.enabled && !e.params.loop && 0 === e.params.initialSlide && (e.params.lazy.checkInView ? e.lazy.checkInViewOnLoad() : e.lazy.load())
            },
            scroll: function(e) {
                e.params.freeMode && !e.params.freeModeSticky && e.lazy.load()
            },
            "scrollbarDragMove resize _freeModeNoMomentumRelease": function(e) {
                e.params.lazy.enabled && e.lazy.load()
            },
            transitionStart: function(e) {
                e.params.lazy.enabled && (e.params.lazy.loadOnTransitionStart || !e.params.lazy.loadOnTransitionStart && !e.lazy.initialImageLoaded) && e.lazy.load()
            },
            transitionEnd: function(e) {
                e.params.lazy.enabled && !e.params.lazy.loadOnTransitionStart && e.lazy.load()
            },
            slideChange: function(e) {
                var t = e.params
                  , n = t.lazy
                  , r = t.cssMode
                  , i = t.watchSlidesVisibility
                  , a = t.watchSlidesProgress
                  , s = t.touchReleaseOnEdges
                  , o = t.resistanceRatio;
                n.enabled && (r || (i || a) && (s || 0 === o)) && e.lazy.load()
            }
        }
    }, {
        name: "controller",
        params: {
            controller: {
                control: void 0,
                inverse: !1,
                by: "slide"
            }
        },
        create: function() {
            E(this, {
                controller: t({
                    control: this.params.controller.control
                }, ie)
            })
        },
        on: {
            update: function(e) {
                e.controller.control && e.controller.spline && (e.controller.spline = void 0,
                delete e.controller.spline)
            },
            resize: function(e) {
                e.controller.control && e.controller.spline && (e.controller.spline = void 0,
                delete e.controller.spline)
            },
            observerUpdate: function(e) {
                e.controller.control && e.controller.spline && (e.controller.spline = void 0,
                delete e.controller.spline)
            },
            setTranslate: function(e, t, n) {
                e.controller.control && e.controller.setTranslate(t, n)
            },
            setTransition: function(e, t, n) {
                e.controller.control && e.controller.setTransition(t, n)
            }
        }
    }, {
        name: "a11y",
        params: {
            a11y: {
                enabled: !0,
                notificationClass: "swiper-notification",
                prevSlideMessage: "Previous slide",
                nextSlideMessage: "Next slide",
                firstSlideMessage: "This is the first slide",
                lastSlideMessage: "This is the last slide",
                paginationBulletMessage: "Go to slide {{index}}",
                slideLabelMessage: "{{index}} / {{slidesLength}}",
                containerMessage: null,
                containerRoleDescriptionMessage: null,
                itemRoleDescriptionMessage: null,
                slideRole: "group"
            }
        },
        create: function() {
            E(this, {
                a11y: t({}, ae, {
                    liveRegion: m('<span class="' + this.params.a11y.notificationClass + '" aria-live="assertive" aria-atomic="true"></span>')
                })
            })
        },
        on: {
            afterInit: function(e) {
                e.params.a11y.enabled && (e.a11y.init(),
                e.a11y.updateNavigation())
            },
            toEdge: function(e) {
                e.params.a11y.enabled && e.a11y.updateNavigation()
            },
            fromEdge: function(e) {
                e.params.a11y.enabled && e.a11y.updateNavigation()
            },
            paginationUpdate: function(e) {
                e.params.a11y.enabled && e.a11y.updatePagination()
            },
            destroy: function(e) {
                e.params.a11y.enabled && e.a11y.destroy()
            }
        }
    }, {
        name: "history",
        params: {
            history: {
                enabled: !1,
                root: "",
                replaceState: !1,
                key: "slides"
            }
        },
        create: function() {
            E(this, {
                history: t({}, se)
            })
        },
        on: {
            init: function(e) {
                e.params.history.enabled && e.history.init()
            },
            destroy: function(e) {
                e.params.history.enabled && e.history.destroy()
            },
            "transitionEnd _freeModeNoMomentumRelease": function(e) {
                e.history.initialized && e.history.setHistory(e.params.history.key, e.activeIndex)
            },
            slideChange: function(e) {
                e.history.initialized && e.params.cssMode && e.history.setHistory(e.params.history.key, e.activeIndex)
            }
        }
    }, {
        name: "hash-navigation",
        params: {
            hashNavigation: {
                enabled: !1,
                replaceState: !1,
                watchState: !1
            }
        },
        create: function() {
            E(this, {
                hashNavigation: t({
                    initialized: !1
                }, oe)
            })
        },
        on: {
            init: function(e) {
                e.params.hashNavigation.enabled && e.hashNavigation.init()
            },
            destroy: function(e) {
                e.params.hashNavigation.enabled && e.hashNavigation.destroy()
            },
            "transitionEnd _freeModeNoMomentumRelease": function(e) {
                e.hashNavigation.initialized && e.hashNavigation.setHash()
            },
            slideChange: function(e) {
                e.hashNavigation.initialized && e.params.cssMode && e.hashNavigation.setHash()
            }
        }
    }, {
        name: "autoplay",
        params: {
            autoplay: {
                enabled: !1,
                delay: 3e3,
                waitForTransition: !0,
                disableOnInteraction: !0,
                stopOnLastSlide: !1,
                reverseDirection: !1,
                pauseOnMouseEnter: !1
            }
        },
        create: function() {
            E(this, {
                autoplay: t({}, le, {
                    running: !1,
                    paused: !1
                })
            })
        },
        on: {
            init: function(e) {
                e.params.autoplay.enabled && (e.autoplay.start(),
                a().addEventListener("visibilitychange", e.autoplay.onVisibilityChange),
                e.autoplay.attachMouseEvents())
            },
            beforeTransitionStart: function(e, t, n) {
                e.autoplay.running && (n || !e.params.autoplay.disableOnInteraction ? e.autoplay.pause(t) : e.autoplay.stop())
            },
            sliderFirstMove: function(e) {
                e.autoplay.running && (e.params.autoplay.disableOnInteraction ? e.autoplay.stop() : e.autoplay.pause())
            },
            touchEnd: function(e) {
                e.params.cssMode && e.autoplay.paused && !e.params.autoplay.disableOnInteraction && e.autoplay.run()
            },
            destroy: function(e) {
                e.autoplay.detachMouseEvents(),
                e.autoplay.running && e.autoplay.stop(),
                a().removeEventListener("visibilitychange", e.autoplay.onVisibilityChange)
            }
        }
    }, {
        name: "effect-fade",
        params: {
            fadeEffect: {
                crossFade: !1
            }
        },
        create: function() {
            E(this, {
                fadeEffect: t({}, ce)
            })
        },
        on: {
            beforeInit: function(e) {
                if ("fade" === e.params.effect) {
                    e.classNames.push(e.params.containerModifierClass + "fade");
                    var t = {
                        slidesPerView: 1,
                        slidesPerColumn: 1,
                        slidesPerGroup: 1,
                        watchSlidesProgress: !0,
                        spaceBetween: 0,
                        virtualTranslate: !0
                    };
                    C(e.params, t),
                    C(e.originalParams, t)
                }
            },
            setTranslate: function(e) {
                "fade" === e.params.effect && e.fadeEffect.setTranslate()
            },
            setTransition: function(e, t) {
                "fade" === e.params.effect && e.fadeEffect.setTransition(t)
            }
        }
    }, {
        name: "effect-cube",
        params: {
            cubeEffect: {
                slideShadows: !0,
                shadow: !0,
                shadowOffset: 20,
                shadowScale: .94
            }
        },
        create: function() {
            E(this, {
                cubeEffect: t({}, ue)
            })
        },
        on: {
            beforeInit: function(e) {
                if ("cube" === e.params.effect) {
                    e.classNames.push(e.params.containerModifierClass + "cube"),
                    e.classNames.push(e.params.containerModifierClass + "3d");
                    var t = {
                        slidesPerView: 1,
                        slidesPerColumn: 1,
                        slidesPerGroup: 1,
                        watchSlidesProgress: !0,
                        resistanceRatio: 0,
                        spaceBetween: 0,
                        centeredSlides: !1,
                        virtualTranslate: !0
                    };
                    C(e.params, t),
                    C(e.originalParams, t)
                }
            },
            setTranslate: function(e) {
                "cube" === e.params.effect && e.cubeEffect.setTranslate()
            },
            setTransition: function(e, t) {
                "cube" === e.params.effect && e.cubeEffect.setTransition(t)
            }
        }
    }, {
        name: "effect-flip",
        params: {
            flipEffect: {
                slideShadows: !0,
                limitRotation: !0
            }
        },
        create: function() {
            E(this, {
                flipEffect: t({}, de)
            })
        },
        on: {
            beforeInit: function(e) {
                if ("flip" === e.params.effect) {
                    e.classNames.push(e.params.containerModifierClass + "flip"),
                    e.classNames.push(e.params.containerModifierClass + "3d");
                    var t = {
                        slidesPerView: 1,
                        slidesPerColumn: 1,
                        slidesPerGroup: 1,
                        watchSlidesProgress: !0,
                        spaceBetween: 0,
                        virtualTranslate: !0
                    };
                    C(e.params, t),
                    C(e.originalParams, t)
                }
            },
            setTranslate: function(e) {
                "flip" === e.params.effect && e.flipEffect.setTranslate()
            },
            setTransition: function(e, t) {
                "flip" === e.params.effect && e.flipEffect.setTransition(t)
            }
        }
    }, {
        name: "effect-coverflow",
        params: {
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                scale: 1,
                modifier: 1,
                slideShadows: !0
            }
        },
        create: function() {
            E(this, {
                coverflowEffect: t({}, pe)
            })
        },
        on: {
            beforeInit: function(e) {
                "coverflow" === e.params.effect && (e.classNames.push(e.params.containerModifierClass + "coverflow"),
                e.classNames.push(e.params.containerModifierClass + "3d"),
                e.params.watchSlidesProgress = !0,
                e.originalParams.watchSlidesProgress = !0)
            },
            setTranslate: function(e) {
                "coverflow" === e.params.effect && e.coverflowEffect.setTranslate()
            },
            setTransition: function(e, t) {
                "coverflow" === e.params.effect && e.coverflowEffect.setTransition(t)
            }
        }
    }, {
        name: "thumbs",
        params: {
            thumbs: {
                swiper: null,
                multipleActiveThumbs: !0,
                autoScrollOffset: 0,
                slideThumbActiveClass: "swiper-slide-thumb-active",
                thumbsContainerClass: "swiper-container-thumbs"
            }
        },
        create: function() {
            E(this, {
                thumbs: t({
                    swiper: null,
                    initialized: !1
                }, fe)
            })
        },
        on: {
            beforeInit: function(e) {
                var t = e.params.thumbs;
                t && t.swiper && (e.thumbs.init(),
                e.thumbs.update(!0))
            },
            slideChange: function(e) {
                e.thumbs.swiper && e.thumbs.update()
            },
            update: function(e) {
                e.thumbs.swiper && e.thumbs.update()
            },
            resize: function(e) {
                e.thumbs.swiper && e.thumbs.update()
            },
            observerUpdate: function(e) {
                e.thumbs.swiper && e.thumbs.update()
            },
            setTransition: function(e, t) {
                var n = e.thumbs.swiper;
                n && n.setTransition(t)
            },
            beforeDestroy: function(e) {
                var t = e.thumbs.swiper;
                t && e.thumbs.swiperCreated && t && t.destroy()
            }
        }
    }];
    return V.use(he),
    V
}
));