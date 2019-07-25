define([
    "./SceneMode"
], function (
    SceneMode
) {
    "use strict";

    function t() {
        for (var SceneMode = navigator.userAgent, t = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"), r = !0, i = 0; i < t.length; i++) if (e.indexOf(t[i]) > 0) {
            r = !1;
            break
        }
        return r
    }

    function FrameState(context, i, n) {
        this.context = context;
        this.commandList = [];
        this.shadowMaps = [];

        //新增
        this.viewshed3ds = [];
        this.water = [];
        this.pit = [];
        this.pitOnModel = [];
        this._setSurfaceTransparency = void 0;

        this.brdfLutGenerator = void 0;
        this.environmentMap = void 0;
        this.mode = SceneMode.SCENE3D;
        this.morphTime = SceneMode.getMorphTime(e.SCENE3D);
        this.frameNumber = 0;
        this.time = void 0;
        this.jobScheduler = n;
        this.mapProjection = void 0;
        this.camera = void 0;
        this.cullingVolume = void 0;
        this.occluder = void 0;
        this.maximumScreenSpaceError = void 0;

        //新增
        this.isPC = t();
        this.isPC ? this.maximumMemoryUsage = 536870912 : this.maximumMemoryUsage = 104857600;
        this.totalMemoryUsageInBytes = 0;
        this.maxHttpRequestNum = 6;
        this.curHttpRequestNum = 0;
        this.maxTexRequestNum = 6;
        this.curTexRequestNum = 0;
        this.maxNodeParseThreadNum = 6;
        this.curNodeParseThreadNum = 0;

        this.passes = {
            render: !1,
            pick: !1,
            depth: !1
        };
        this.creditDisplay = i;
        this.afterRender = [];
        this.scene3DOnly = !1;
        this.fog = {
            enabled: !1,
            density: void 0,
            sse: void 0,
            minimumBrightness: void 0
        };
        this.terrainExaggeration = 1;
        this.shadowHints = {
            shadowsEnabled: !0,
            shadowMaps: [],
            lightShadowMaps: [],
            nearPlane: 1,
            farPlane: 5e3,
            closestObjectSize: 1e3,
            lastDirtyTime: 0,
            outOfView: !0
        };
        this.imagerySplitPosition = 0;
        this.frustumSplits = [];
        this.backgroundColor = void 0;
        this.minimumDisableDepthTestDistance = void 0;
        this.invertClassification = !1;
        this.invertClassificationColor = void 0;
    }

    return FrameState;
})