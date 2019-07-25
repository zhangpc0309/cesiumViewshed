define(["../Core/BoundingSphere", "../Core/Cartesian3", "../Core/Color", "../Core/ComponentDatatype", "../Core/defaultValue", "../Core/defineProperties"], function (e, t, r, i, n, o) {
    "use strict";

    function SetSurfaceTransparency(e) {
        this._enabled = !1, this._surfaceTransparency = .3, this._scene = e
    }

    o(SetSurfaceTransparency.prototype, {
        enabled: {
            get: function () {
                return this._enabled
            }, set: function (e) {
                this._enabled = e
            }
        }, surfaceTransparency: {
            get: function () {
                return this._surfaceTransparency
            }, set: function (e) {
                this._surfaceTransparency = e
            }
        }
    });

    return SetSurfaceTransparency;
});