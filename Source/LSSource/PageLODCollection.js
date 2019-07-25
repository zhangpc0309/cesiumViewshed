define(["../Core/createGuid", "../Core/defaultValue", "../Core/defined", "../Core/defineProperties", "../Core/destroyObject", "../Core/DeveloperError", "./ELoadStatus"], function (e, t, r, i, n, o, a) {
    "use strict";

    function PageLODCollection(r) {
        r = t(r, t.EMPTY_OBJECT), this._pageLODs = [], this._guid = e(), this.show = t(r.show, !0), this.destroyPrimitives = t(r.destroyPrimitives, !0)
    }

    function l(e, t) {
        return e._pageLODs.indexOf(t)
    }

    function u(e, t) {
        return 0 === t._distanceToCamera && 0 === e._distanceToCamera ? 0 : e._distanceToCamera - t._distanceToCamera
    }

    i(PageLODCollection.prototype, {
        length: {
            get: function () {
                return this._pageLODs.length
            }
        }
    });
    PageLODCollection.prototype.add = function (e) {
        var t = e._external = e._external || {};
        return (t._composites = t._composites || {})[this._guid] = {collection: this}, this._pageLODs.push(e), e
    };
    PageLODCollection.prototype.remove = function (e) {
        if (this.contains(e)) {
            var t = this._pageLODs.indexOf(e);
            if (-1 !== t) return this._pageLODs.splice(t, 1), delete e._external._composites[this._guid], this.destroyPrimitives && e.destroy(), !0
        }
        return !1
    };
    PageLODCollection.prototype.removeAndDestroy = function (e) {
        var t = this.remove(e);
        return t && !this.destroyPrimitives && e.destroy(), t
    };
    PageLODCollection.prototype.removeAll = function () {
        if (this.destroyPrimitives) for (var e = this._pageLODs, t = e.length, r = 0; r < t; ++r) e[r].destroy();
        this._pageLODs = []
    };
    PageLODCollection.prototype.contains = function (e) {
        return !!(r(e) && e._external && e._external._composites && e._external._composites[this._guid])
    };
    PageLODCollection.prototype.raise = function (e) {
        if (r(e)) {
            var t = l(this, e), i = this._pageLODs;
            if (t !== i.length - 1) {
                var n = i[t];
                i[t] = i[t + 1], i[t + 1] = n
            }
        }
    };
    PageLODCollection.prototype.raiseToTop = function (e) {
        if (r(e)) {
            var t = l(this, e), i = this._pageLODs;
            t !== i.length - 1 && (i.splice(t, 1), i.push(e))
        }
    };
    PageLODCollection.prototype.lower = function (e) {
        if (r(e)) {
            var t = l(this, e), i = this._pageLODs;
            if (0 !== t) {
                var n = i[t];
                i[t] = i[t - 1], i[t - 1] = n
            }
        }
    };
    PageLODCollection.prototype.lowerToBottom = function (e) {
        if (r(e)) {
            var t = l(this, e), i = this._pageLODs;
            0 !== t && (i.splice(t, 1), i.unshift(e))
        }
    };
    PageLODCollection.prototype.get = function (e) {
        return this._pageLODs[e]
    };
    PageLODCollection.prototype.update = function (e) {
        if (this.show) {
            e.totalMemoryUsageInBytes = 0;
            for (var t = [], r = this._pageLODs, i = 0; i < r.length; ++i) t.push(r[i]);
            t.sort(u), e._selectedTiles = [];
            for (var i = 0, n = t.length; i < n; i++) t[i].update(e);
            e._selectedTiles.sort(u);
            for (var i = 0, n = e._selectedTiles.length; i < n; i++) e._selectedTiles[i].getLoadStatus() == a.LS_UNLOAD && e._selectedTiles[i].netLoad(e);
            for (var i = 0, n = e._selectedTiles.length; i < n; i++) e._selectedTiles[i].update(e);
            for (var i = 0, n = t.length; i < n; i++) e.totalMemoryUsageInBytes > e.maximumMemoryUsage && t[n - i - 1].release(e)
        }
    };
    PageLODCollection.prototype.isDestroyed = function () {
        return !1
    };
    PageLODCollection.prototype.destroy = function () {
        return this.removeAll(), n(this)
    };

    return PageLODCollection;
});