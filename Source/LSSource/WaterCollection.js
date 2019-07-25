define([
    "../Core/defaultValue",
    "../Core/defineProperties"
], function (e, defineProperties) {

        "use strict";

        function WaterCollection(e) {
            this._water = [];
            this._scene = e;
        }

        defineProperties(WaterCollection.prototype, {
            length: {
                get: function () {
                    return this._water.length
                }
            }
        });
        WaterCollection.prototype.add = function (e) {
            this._water.push(e);
            this._scene.primitives.add(e);
        };
        WaterCollection.prototype.remove = function (e) {
            var t = this._water.indexOf(e);
            -1 !== t && this._water.splice(t, 1);
            this._scene.primitives.remove(e);
        };

    return WaterCollection;
});