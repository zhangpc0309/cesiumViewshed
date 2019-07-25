define([
    "../Core/BoundingRectangle",
    "../Core/BoundingSphere",
    "../Core/BoxGeometry",
    "../Core/Cartesian2",
    "../Core/Cartesian3",
    "../Core/Cartesian4",
    "../Core/Cartographic",
    "../Core/Color",
    "../Core/ColorGeometryInstanceAttribute",
    "../Core/createGuid",
    "../Core/CullingVolume",
    "../Core/defaultValue",
    "../Core/defined",
    "../Core/defineProperties",
    "../Core/destroyObject",
    "../Core/DeveloperError",
    "../Core/EllipsoidGeometry",
    "../Core/Event",
    "../Core/GeographicProjection",
    "../Core/GeometryInstance",
    "../Core/GeometryPipeline",
    "../Core/getTimestamp",
    "../Core/Intersect",
    "../Core/Interval",
    "../Core/JulianDate",
    "../Core/Math",
    "../Core/Matrix4",
    "../Core/mergeSort",
    "../Core/Occluder",
    "../Core/OrthographicFrustum",
    "../Core/OrthographicOffCenterFrustum",
    "../Core/PerspectiveFrustum",
    "../Core/PerspectiveOffCenterFrustum",
    "../Core/PixelFormat",
    "../Core/Plane",
    "../Core/Ray",
    "../Core/RequestScheduler",
    "../Core/ShowGeometryInstanceAttribute",
    "../Core/TaskProcessor",
    "../Core/Transforms",
    "../LSSource/PitCollection",
    "../LSSource/SetSurfaceTransparency",
    "../LSSource/WaterCollection",
    "../Renderer/ClearCommand",
    "../Renderer/ComputeEngine",
    "../Renderer/Context",
    "../Renderer/ContextLimits",
    "../Renderer/DrawCommand",
    "../Renderer/Framebuffer",
    "../Renderer/Pass",
    "../Renderer/PassState",
    "../Renderer/PixelDatatype",
    "../Renderer/RenderState",
    "../Renderer/ShaderProgram",
    "../Renderer/ShaderSource",
    "../Renderer/Texture",
    "./BrdfLutGenerator",
    "./Camera",
    "./CreditDisplay",
    "./DebugCameraPrimitive",
    "./DepthPlane",
    "./DeviceOrientationCameraController",
    "./EllipsoidPrimitive",
    "./Fog",
    "./FrameState",
    "./FrustumCommands",
    "./FXAA",
    "./GlobeDepth",
    "./InvertClassification",
    "./JobScheduler",
    "./MapMode2D",
    "./OIT",
    "./PerformanceDisplay",
    "./PerInstanceColorAppearance",
    "./PickDepth",
    "./Primitive",
    "./PrimitiveCollection",
    "./SceneMode",
    "./SceneTransforms",
    "./SceneTransitioner",
    "./ScreenSpaceCameraController",
    "./ShadowMap",
    "./SunPostProcess",
    "./TweenCollection",
    "../LSSource/PageLODCollection"
], function (
    e,
    t,
    r,
    i,
    n,
    o,
    a,
    s,
    l,
    u,
    c,
    d,
    h,
    p,
    f,
    m,
    g,
    _,
    v,
    y,
    b,
    C,
    S,
    w,
    T,
    x,
    E,
    A,
    P,
    D,
    I,
    O,
    M,
    R,
    L,
    N,
    k,
    B,
    F,
    U,
    V____,//PitCollection
    z____,//SetSurfaceTransparency
    G____,//WaterCollection
    H,
    W,
    j,
    q,
    Y,
    X,
    Q,
    Z,
    K,
    J,
    $,
    ee,
    te,
    re,
    ie,
    ne,
    oe,
    ae,
    se,
    le,
    ue,
    ce,
    de,
    he,
    pe,
    fe,
    me,
    ge,
    _e,
    ve,
    ye,
    be,
    Ce,
    Se,
    we,
    Te,
    xe,
    Ee,
    Ae,
    Pe,
    De,
    Ie______//PageLODCollection
) {
    "use strict";

    function Oe(t) {
        t = d(t, d.EMPTY_OBJECT);
        var r = t.canvas, i = t.contextOptions, o = t.creditContainer, a = t.creditViewport, l = h(o),
            c = new j(r, i);
        l || (o = document.createElement("div"), o.style.position = "absolute", o.style.bottom = "0", o.style["text-shadow"] = "0 0 2px #000000", o.style.color = "#ffffff", o.style["font-size"] = "10px", o.style["padding-right"] = "5px", r.parentNode.appendChild(o)), h(a) || (a = r.parentNode), this.pit = [], this._id = u(), this._jobScheduler = new me, this._frameState = new ce(c, new ne(o, " • ", a), this._jobScheduler), this._frameState.scene3DOnly = d(t.scene3DOnly, !1), this._removeCreditContainer = !l, this._creditContainer = o;
        var p = new Z(c);
        p.viewport = new e, p.viewport.x = 0, p.viewport.y = 0, p.viewport.width = c.drawingBufferWidth, p.viewport.height = c.drawingBufferHeight, this._passState = p, this._canvas = r, this._context = c, this._computeEngine = new W(c), this._globe = void 0, this._primitives = new Se, this._groundPrimitives = new Se;
        //this._pageLODs = new Ie;
        this._tweens = new De, this._shaderFrameCount = 0, this._sunPostProcess = void 0, this._computeCommandList = [], this._frustumCommandsList = [], this._overlayCommandList = [], this._pickFramebuffer = void 0, this._useOIT = d(t.orderIndependentTranslucency, !0), this._executeOITFunction = void 0;
        var f;
        c.depthTexture && (f = new pe);
        var m;
        this._useOIT && h(f) && (m = new _e(c)), this._globeDepth = f, this._depthPlane = new ae, this._oit = m, this._fxaa = new he, this._clearColorCommand = new H({
            color: new s,
            stencil: 0,
            owner: this
        }), this._depthClearCommand = new H({
            depth: 1,
            owner: this
        }), this._stencilClearCommand = new H({stencil: 0}), this._pickDepths = [], this._debugGlobeDepths = [], this._pickDepthPassState = void 0, this._pickDepthFramebuffer = void 0, this._pickDepthFramebufferWidth = void 0, this._pickDepthFramebufferHeight = void 0, this._depthOnlyRenderStateCache = {}, this._transitioner = new xe(this), this._preUpdate = new _, this._postUpdate = new _, this._renderError = new _, this._preRender = new _, this._postRender = new _, this._cameraStartFired = !1, this._cameraMovedTime = void 0, this._pickPositionCache = {}, this._pickPositionCacheDirty = !1, this._minimumDisableDepthTestDistance = 0, this.rethrowRenderErrors = !1, this.completeMorphOnUserInput = !0, this.morphStart = new _, this.morphComplete = new _, this.skyBox = void 0, this.skyAtmosphere = void 0, this.sun = void 0, this.sunBloom = !0, this._sunBloom = void 0, this.moon = void 0, this.backgroundColor = s.clone(s.BLACK), this._mode = we.SCENE3D, this._mapProjection = h(t.mapProjection) ? t.mapProjection : new v, this.morphTime = 1, this.farToNearRatio = 1e3, this.nearToFarDistance2D = 175e4, this.debugCommandFilter = void 0, this.debugShowCommands = !1, this.debugShowFrustums = !1, this._debugFrustumStatistics = void 0, this.debugShowFramesPerSecond = !1, this.debugShowGlobeDepth = !1, this.debugShowDepthFrustum = 1, this.debugShowFrustumPlanes = !1, this._debugShowFrustumPlanes = !1, this._debugFrustumPlanes = void 0, this.fxaa = !0, this.useDepthPicking = !0, this.pickTranslucentDepth = !1, this.cameraEventWaitTime = 500, this.copyGlobeDepth = !1, this.fog = new ue, this._sunCamera = new ie(this), this.shadowMap = new Ae({
            context: c,
            lightCamera: this._sunCamera,
            enabled: d(t.shadows, !1)
        }), this.invertClassification = !1, this.invertClassificationColor = s.clone(s.WHITE), this._actualInvertClassificationColor = s.clone(this._invertClassificationColor), this._invertClassification = new fe, this.focalLength = void 0, this.eyeSeparation = void 0, this._brdfLutGenerator = new re, this._terrainExaggeration = d(t.terrainExaggeration, 1), this._performanceDisplay = void 0, this._debugVolume = void 0;
        var g = new ie(this);
        this._camera = g, this._cameraClone = ie.clone(g), this._screenSpaceCameraController = new Ee(this), this._mapMode2D = d(t.mapMode2D, ge.INFINITE_SCROLL), this._environmentState = {
            skyBoxCommand: void 0,
            skyAtmosphereCommand: void 0,
            sunDrawCommand: void 0,
            sunComputeCommand: void 0,
            moonCommand: void 0,
            isSunVisible: !1,
            isMoonVisible: !1,
            isReadyForAtmosphere: !1,
            isSkyAtmosphereVisible: !1,
            clearGlobeDepth: !1,
            useDepthPlane: !1,
            originalFramebuffer: void 0,
            useGlobeDepthFramebuffer: !1,
            useOIT: !1,
            useFXAA: !1,
            useInvertClassification: !1
        }, this._ellipsoidPrimitive = new le, this._ellipsoidPrimitive.center = new n(0, 0, 0), this._ellipsoidPrimitive.radii = n.multiplyByScalar(new n(6378137, 6378137, 6356752), .9995, new n), this._ellipsoidPrimitive.material.uniforms.color = new s(0, 0, 0, 1), this._ellipsoidPrimitive.show = !1, this._primitives.add(this._ellipsoidPrimitive),
            //this._pitCollection = new V(this),
            //this._waterCollection = new G(this),
            //this._setSurfaceTransparency = new z(this),
        this._useWebVR = !1, this._cameraVR = void 0, this._aspectRatioVR = void 0, this._useSingleFrustum = !0, this.requestRenderMode = d(t.requestRenderMode, !1), this._renderRequested = !0, this._lastFpsSampleTime = C(), this._fpsFrameCount = 0, this.maximumRenderTimeChange = d(t.maximumRenderTimeChange, 0), this._lastRenderTime = void 0, this._removeRequestListenerCallback = k.requestCompletedEvent.addEventListener(At(this)), this._removeTaskProcessorListenerCallback = F.taskCompletedEvent.addEventListener(At(this)), this._removeGlobeCallbacks = [];
        var y = g.frustum.near, b = g.frustum.far, S = Math.ceil(Math.log(b / y) / Math.log(this.farToNearRatio));
        Ue(y, b, this.farToNearRatio, S, this._frustumCommandsList, !1, void 0), Fe(this, 0, T.now()), this.initializeFrame()
    }

    function Me(e, t) {
        for (var r = 0; r < e._removeGlobeCallbacks.length; ++r) e._removeGlobeCallbacks[r]();
        e._removeGlobeCallbacks.length = 0;
        var i = [];
        h(t) && (i.push(t.imageryLayersUpdatedEvent.addEventListener(At(e))), i.push(t.terrainProviderChanged.addEventListener(At(e)))), e._removeGlobeCallbacks = i
    }

    function Re(e, t) {
        var r = Math.max(Math.abs(e.x), Math.abs(t.x)), i = Math.max(Math.abs(e.y), Math.abs(t.y)),
            n = Math.max(Math.abs(e.z), Math.abs(t.z));
        return Math.max(Math.max(r, i), n)
    }

    function Le(e, t, r) {
        var i = 1 / Math.max(1, Re(e.position, t.position));
        return n.multiplyByScalar(e.position, i, It), n.multiplyByScalar(t.position, i, Ot), n.equalsEpsilon(It, Ot, r) && n.equalsEpsilon(e.direction, t.direction, r) && n.equalsEpsilon(e.up, t.up, r) && n.equalsEpsilon(e.right, t.right, r) && E.equalsEpsilon(e.transform, t.transform, r)
    }

    function Ne(e, t) {
        var r = e.frameState, i = e._context, n = r.shadowHints.shadowsEnabled, o = r.shadowHints.shadowMaps,
            a = r.shadowHints.lightShadowMaps, s = n && a.length > 0, l = !1, u = r.shadowHints.lastDirtyTime;
        t.lastDirtyTime !== u && (t.lastDirtyTime = u, t.dirty = !0, l = !0);
        var c = t.derivedCommands;
        if (t.dirty && h(c)) {
            t.dirty = !1, n && (t.receiveShadows || t.castShadows) && (c.shadows = Ae.createDerivedCommands(o, a, t, l, i, c.shadows));
            var d = e._oit;
            t.pass === Q.TRANSLUCENT && h(d) && d.isSupported() && (s && t.receiveShadows ? (c.oit = h(c.oit) ? c.oit : {}, c.oit.shadows = d.createDerivedCommands(t.derivedCommands.shadows.receiveCommand, i, c.oit.shadows)) : c.oit = d.createDerivedCommands(t, i, c.oit)), c.depth = wt(e, t, i, c.depth)
        }
    }

    function ke(e) {
        var t = e.globe;
        if (e._mode === we.SCENE3D && h(t)) {
            var r = t.ellipsoid;
            return Mt.radius = r.minimumRadius, Dt = P.fromBoundingSphere(Mt, e._camera.positionWC, Dt)
        }
    }

    function Be(e) {
        e.render = !1, e.pick = !1, e.depth = !1
    }

    function Fe(e, t, r) {
        var i = e._camera;
        if (e.useSingleFrustum) {
            var o = Math.abs(i.positionCartographic.height);
            if (h(e.globe)) {
                var a = e.globe.getHeight(i.positionCartographic);
                h(a) && (o = Math.abs(i.positionCartographic.height - a))
            }
            var l = o / 100 * .05;
            l *= l, l > .05 && (l = .05);
            var u = l * o;
            u < 1 && (u = 1), i.frustum.near = u;
            var c = n.magnitude(i.positionWC), d = c - i.positionCartographic.height;
            Math.sqrt(c * c - d * d);
            i.frustum.far = 1e8
        }
        var p = e._frameState;
        p.commandList.length = 0,
            p.shadowMaps.length = 0,
            p.viewshed3ds.length = 0,
            //p._setSurfaceTransparency = e._setSurfaceTransparency,
            p.pit = e.pit,
            p.brdfLutGenerator = e._brdfLutGenerator, p.environmentMap = e.skyBox && e.skyBox._cubeMap, p.mode = e._mode, p.morphTime = e.morphTime, p.mapProjection = e.mapProjection, p.frameNumber = t, p.time = T.clone(r, p.time), p.camera = i, p.cullingVolume = i.frustum.computeCullingVolume(i.positionWC, i.directionWC, i.upWC), p.occluder = ke(e), p.terrainExaggeration = e._terrainExaggeration, p.minimumDisableDepthTestDistance = e._minimumDisableDepthTestDistance, p.invertClassification = e.invertClassification, e._actualInvertClassificationColor = s.clone(e.invertClassificationColor, e._actualInvertClassificationColor), fe.isTranslucencySupported(e._context) || (e._actualInvertClassificationColor.alpha = 1), p.invertClassificationColor = e._actualInvertClassificationColor, h(e.globe) ? p.maximumScreenSpaceError = e.globe.maximumScreenSpaceError : p.maximumScreenSpaceError = 2, Be(p.passes)
    }

    function Ue(e, t, r, i, n, o, a) {
        if (!isNaN(i)) {
            n.length = i;
            for (var s = 0; s < i; ++s) {
                var l, u;
                o ? (l = Math.min(t - a, e + s * a), u = Math.min(t, l + a)) : (l = Math.max(e, Math.pow(r, s) * e), u = Math.min(t, r * l));
                var c = n[s];
                h(c) ? (c.near = l, c.far = u) : c = n[s] = new de(l, u)
            }
        }
    }

    function Ve(e, t, r) {
        e.debugShowFrustums && (t.debugOverlappingFrustums = 0), e.frameState.passes.pick || Ne(e, t);
        for (var i = e._frustumCommandsList, n = i.length, o = 0; o < n; ++o) {
            var a = i[o], s = a.near, l = a.far;
            if (!(r.start > l)) {
                if (r.stop < s) break;
                var u = t.pass, c = a.indices[u]++;
                if (a.commands[u][c] = t, e.debugShowFrustums && (t.debugOverlappingFrustums |= 1 << o), t.executeInClosestFrustum) break
            }
        }
        if (e.debugShowFrustums) {
            var d = e._debugFrustumStatistics.commandsInFrustums;
            d[t.debugOverlappingFrustums] = h(d[t.debugOverlappingFrustums]) ? d[t.debugOverlappingFrustums] + 1 : 1, ++e._debugFrustumStatistics.totalCommands
        }
    }

    function ze(e, t, r) {
        return h(e) && (!h(e.boundingVolume) || !e.cull || t.computeVisibility(e.boundingVolume) !== S.OUTSIDE && (!h(r) || !e.boundingVolume.isOccluded(r)))
    }

    function Ge(e) {
        var t = e._frameState, r = t.camera, i = r.directionWC, n = r.positionWC, o = e._computeCommandList,
            a = e._overlayCommandList, s = t.commandList;
        e.debugShowFrustums && (e._debugFrustumStatistics = {totalCommands: 0, commandsInFrustums: {}});
        for (var l = e._frustumCommandsList, u = l.length, c = Q.NUMBER_OF_PASSES, d = 0; d < u; ++d) for (var p = 0; p < c; ++p) l[d].indices[p] = 0;
        o.length = 0, a.length = 0;
        for (var f = Number.MAX_VALUE, m = -Number.MAX_VALUE, g = !1, _ = t.shadowHints.shadowsEnabled, v = Number.MAX_VALUE, y = -Number.MAX_VALUE, b = Number.MAX_VALUE, C = t.mode === we.SCENE3D ? t.occluder : void 0, S = t.cullingVolume, w = Rt.planes, T = 0; T < 5; ++T) w[T] = S.planes[T];
        S = Rt;
        for (var E = s.length, A = 0; A < E; ++A) {
            var P = s[A], D = P.pass;
            if (D === Q.COMPUTE) o.push(P); else if (D === Q.OVERLAY) a.push(P); else {
                var I = P.boundingVolume;
                if (h(I)) {
                    if (!ze(P, S, C)) continue;
                    if (Lt = I.computePlaneDistances(n, i, Lt), isNaN(Lt.start) || isNaN(Lt.stop)) continue;
                    if (f = Math.min(f, Lt.start), m = Math.max(m, Lt.stop), _ && P.receiveShadows && Lt.start < Ae.MAXIMUM_DISTANCE && !(D === Q.GLOBE && Lt.start < -100 && Lt.stop > 100)) {
                        var O = Lt.stop - Lt.start;
                        D !== Q.GLOBE && Lt.start < 100 && (b = Math.min(b, O)), v = Math.min(v, Lt.start), y = Math.max(y, Lt.stop)
                    }
                } else Lt.start = r.frustum.near, Lt.stop = r.frustum.far, g = !(P instanceof H);
                Ve(e, P, Lt)
            }
        }
        g ? (f = r.frustum.near, m = r.frustum.far) : (isNaN(r.frustum.far) && (r.frustum.far = 1e9), f = Math.min(Math.max(f, r.frustum.near), r.frustum.far), m = Math.max(Math.min(m, r.frustum.far), f), _ && (v = Math.min(Math.max(v, r.frustum.near), r.frustum.far), y = Math.max(Math.min(y, r.frustum.far), v))), _ && (t.shadowHints.nearPlane = v, t.shadowHints.farPlane = y, t.shadowHints.closestObjectSize = b);
        var M = e.mode === we.SCENE2D, R = e.farToNearRatio;
        e.useSingleFrustum && (R = Number.MAX_VALUE);
        var L;
        M ? (m = Math.min(m, r.position.z + e.nearToFarDistance2D), f = Math.min(f, m), L = Math.ceil(Math.max(1, m - f) / e.nearToFarDistance2D)) : L = Math.ceil(Math.log(m / f) / Math.log(R)), f !== Number.MAX_VALUE && (L !== u || 0 !== l.length && (f < l[0].near || m > l[u - 1].far && !x.equalsEpsilon(m, l[u - 1].far, x.EPSILON8))) && (Ue(f, m, R, L, l, M, e.nearToFarDistance2D), Ge(e));
        var N = t.frustumSplits;
        N.length = L + 1;
        for (var k = 0; k < L; ++k) N[k] = l[k].near, k === L - 1 && (N[k + 1] = l[k].far)
    }

    function He(e) {
        var t = {}, r = e.vertexAttributes;
        for (var i in r) r.hasOwnProperty(i) && (t[i] = r[i].index);
        return t
    }

    function We(e, t, r) {
        var i = t.context, n = d(r, e.shaderProgram), o = n.fragmentShaderSource.clone(), a = [];
        o.sources = o.sources.map(function (e) {
            e = ee.replaceMain(e, "czm_Debug_main");
            for (var t, r = /gl_FragData\[(\d+)\]/g; null !== (t = r.exec(e));) -1 === a.indexOf(t[1]) && a.push(t[1]);
            return e
        });
        var l, u = a.length, c = "void main() \n{ \n    czm_Debug_main(); \n";
        if (t.debugShowCommands) {
            h(e._debugColor) || (e._debugColor = s.fromRandom());
            var p = e._debugColor;
            if (u > 0) for (l = 0; l < u; ++l) c += "    gl_FragData[" + a[l] + "].rgb *= vec3(" + p.red + ", " + p.green + ", " + p.blue + "); \n"; else c += "    gl_FragColor.rgb *= vec3(" + p.red + ", " + p.green + ", " + p.blue + "); \n"
        }
        if (t.debugShowFrustums) {
            var f = 1 & e.debugOverlappingFrustums ? "1.0" : "0.0",
                m = 2 & e.debugOverlappingFrustums ? "1.0" : "0.0",
                g = 4 & e.debugOverlappingFrustums ? "1.0" : "0.0";
            if (u > 0) for (l = 0; l < u; ++l) c += "    gl_FragData[" + a[l] + "].rgb *= vec3(" + f + ", " + m + ", " + g + "); \n"; else c += "    gl_FragColor.rgb *= vec3(" + f + ", " + m + ", " + g + "); \n"
        }
        c += "}", o.sources.push(c);
        var _ = He(n);
        return $.fromCache({
            context: i,
            vertexShaderSource: n.vertexShaderSource,
            fragmentShaderSource: o,
            attributeLocations: _
        })
    }

    function je(e, t, r) {
        var i = Y.shallowClone(e);
        i.shaderProgram = We(e, t), i.execute(t.context, r), i.shaderProgram.destroy()
    }

    function qe(e, t, i, o, a) {
        if (!h(t.debugCommandFilter) || t.debugCommandFilter(e)) {
            if (e instanceof H) return void e.execute(i, o);
            var s = t.frameState.shadowHints.shadowsEnabled,
                u = s && t.frameState.shadowHints.lightShadowMaps.length > 0;
            if (t.debugShowCommands || t.debugShowFrustums ? je(e, t, o) : u && e.receiveShadows && h(e.derivedCommands.shadows) ? e.derivedCommands.shadows.receiveCommand.execute(i, o) : t.frameState.passes.depth && h(e.derivedCommands.depth) ? e.derivedCommands.depth.depthOnlyCommand.execute(i, o) : e.execute(i, o), e.debugShowBoundingVolume && h(e.boundingVolume)) {
                var c = t._frameState, d = e.boundingVolume;
                h(t._debugVolume) && t._debugVolume.destroy();
                var p, f = n.clone(d.center);
                if (c.mode !== we.SCENE3D) {
                    f = E.multiplyByPoint(Nt, f, f);
                    var m = c.mapProjection, _ = m.unproject(f);
                    f = m.ellipsoid.cartographicToCartesian(_)
                }
                if (h(d.radius)) {
                    var v = d.radius;
                    p = b.toWireframe(g.createGeometry(new g({
                        radii: new n(v, v, v),
                        vertexFormat: ye.FLAT_VERTEX_FORMAT
                    }))), t._debugVolume = new Ce({
                        geometryInstances: new y({
                            geometry: p,
                            modelMatrix: E.fromTranslation(f),
                            attributes: {color: new l(1, 0, 0, 1)}
                        }), appearance: new ye({flat: !0, translucent: !1}), asynchronous: !1
                    })
                } else {
                    var C = d.halfAxes;
                    p = b.toWireframe(r.createGeometry(r.fromDimensions({
                        dimensions: new n(2, 2, 2),
                        vertexFormat: ye.FLAT_VERTEX_FORMAT
                    }))), t._debugVolume = new Ce({
                        geometryInstances: new y({
                            geometry: p,
                            modelMatrix: E.fromRotationTranslation(C, f, new E),
                            attributes: {color: new l(1, 0, 0, 1)}
                        }), appearance: new ye({flat: !0, translucent: !1}), asynchronous: !1
                    })
                }
                var S = c.commandList, w = c.commandList = [];
                t._debugVolume.update(c);
                var T;
                h(a) && (T = o.framebuffer, o.framebuffer = a), w[0].execute(i, o), h(T) && (o.framebuffer = T), c.commandList = S
            }
        }
    }

    function Ye(e, t, r) {
        return t.boundingVolume.distanceSquaredTo(r) - e.boundingVolume.distanceSquaredTo(r)
    }

    function Xe(e, t, r, i, n) {
        var o = e.context;
        A(i, Ye, e._camera.positionWC), h(n) && t(n.unclassifiedCommand, e, o, r);
        for (var a = i.length, s = 0; s < a; ++s) t(i[s], e, o, r)
    }

    function Qe(e, t) {
        var r = e._debugGlobeDepths[t];
        return !h(r) && e.context.depthTexture && (r = new pe, e._debugGlobeDepths[t] = r), r
    }

    function Ze(e, t) {
        var r = e._pickDepths[t];
        return h(r) || (r = new be, e._pickDepths[t] = r), r
    }

    function Ke(e, t) {
        var r = e._camera,
            i = e.context,
            n = i.uniformState;

        n.updateCamera(r);

        var o;
        o = h(r.frustum.fov) ? r.frustum.clone(kt) : h(r.frustum.infiniteProjectionMatrix) ? r.frustum.clone(Bt) : h(r.frustum.width) ? r.frustum.clone(Ft) : r.frustum.clone(Ut), o.near = 1, o.far = 5e8, n.updateFrustum(o), n.updatePass(Q.ENVIRONMENT);
        var s = e._useWebVR && e.mode !== we.SCENE2D, l = e._frameState.passes, u = l.pick, c = l.depth,
            d = e._environmentState;
        if (!u) {
            var p = d.skyBoxCommand;
            if (h(p) && qe(p, e, i, t), d.isSkyAtmosphereVisible && qe(d.skyAtmosphereCommand, e, i, t), d.isSunVisible && (d.sunDrawCommand.execute(i, t), e.sunBloom && !s)) {
                var f;
                f = d.useGlobeDepthFramebuffer ? e._globeDepth.framebuffer : d.useFXAA ? e._fxaa.getColorFramebuffer() : d.originalFramebuffer, e._sunPostProcess.execute(i, f), t.framebuffer = f
            }
            d.isMoonVisible && d.moonCommand.execute(i, t)
        }
        var m;
        d.useOIT ? (h(e._executeOITFunction) || (e._executeOITFunction = function (e, t, r, i, n) {
            e._oit.executeCommands(e, t, r, i, n)
        }), m = e._executeOITFunction) : m = Xe;
        var g, _ = d.clearGlobeDepth, v = d.useDepthPlane, y = e._depthClearCommand, b = e._depthPlane,
            C = r.position.z, S = e._frustumCommandsList, w = S.length;
        r.workingFrustums.length = 0;
        for (var T = 0; T < w; ++T) {
            var x = w - T - 1,
                E = S[x];

            e.mode === we.SCENE2D
            ?
            (r.position.z = C - E.near + 1, o.far = Math.max(1, E.far - E.near), o.near = 1, n.update(e.frameState), n.updateFrustum(o))
            :
            (o.near = 0 !== x ? E.near * Pt : E.near, o.far = E.far, n.updateFrustum(o)),

                r.workingFrustums[x] = o.clone();
            var A, P = e.debugShowGlobeDepth ? Qe(e, x) : e._globeDepth;
            e.debugShowGlobeDepth && h(P) && d.useGlobeDepthFramebuffer && (P.update(i, t), P.clear(i, t, e._clearColorCommand.color), A = t.framebuffer, t.framebuffer = P.framebuffer), y.execute(i, t), e._stencilClearCommand.execute(i, t);
            var D = a.fromCartesian(e._camera.position).height;
            //if (0 == e._setSurfaceTransparency._enabled || D >= 1e4) {
            if ( D >= 1e4) {
                //e._ellipsoidPrimitive.show = !1,
                    n.updatePass(Q.GLOBE);
                var I = E.commands[Q.GLOBE], O = E.indices[Q.GLOBE];
                for (g = 0; g < O; ++g) qe(I[g], e, i, t);
                h(P) && d.useGlobeDepthFramebuffer && (e.copyGlobeDepth || e.debugShowGlobeDepth) && (P.update(i, t), P.executeCopyDepth(i, t)), e.debugShowGlobeDepth && h(P) && d.useGlobeDepthFramebuffer && (t.framebuffer = A)
            }
            for (n.updatePass(Q.TERRAIN_CLASSIFICATION), I = E.commands[Q.TERRAIN_CLASSIFICATION], O = E.indices[Q.TERRAIN_CLASSIFICATION], g = 0; g < O; ++g) qe(I[g], e, i, t);
            for (n.updatePass(Q.CLASSIFICATION), I = E.commands[Q.CLASSIFICATION], O = E.indices[Q.CLASSIFICATION], g = 0; g < O; ++g) qe(I[g], e, i, t);
            if (_ && y.execute(i, t), !d.useInvertClassification || u) {
                for (n.updatePass(Q.CESIUM_3D_TILE), I = E.commands[Q.CESIUM_3D_TILE], O = E.indices[Q.CESIUM_3D_TILE], g = 0; g < O; ++g) qe(I[g], e, i, t);
                for (n.updatePass(Q.CESIUM_3D_TILE_CLASSIFICATION), I = E.commands[Q.CESIUM_3D_TILE_CLASSIFICATION], O = E.indices[Q.CESIUM_3D_TILE_CLASSIFICATION], g = 0; g < O; ++g) qe(I[g], e, i, t);
                for (n.updatePass(Q.CLASSIFICATION), I = E.commands[Q.CLASSIFICATION], O = E.indices[Q.CLASSIFICATION], g = 0; g < O; ++g) qe(I[g], e, i, t)
            } else {
                e._invertClassification.clear(i, t);
                var M = t.framebuffer;
                for (t.framebuffer = e._invertClassification._fbo, n.updatePass(Q.CESIUM_3D_TILE), I = E.commands[Q.CESIUM_3D_TILE], O = E.indices[Q.CESIUM_3D_TILE], g = 0; g < O; ++g) qe(I[g], e, i, t);
                for (n.updatePass(Q.CESIUM_3D_TILE_CLASSIFICATION_IGNORE_SHOW), I = E.commands[Q.CESIUM_3D_TILE_CLASSIFICATION_IGNORE_SHOW], O = E.indices[Q.CESIUM_3D_TILE_CLASSIFICATION_IGNORE_SHOW], g = 0; g < O; ++g) qe(I[g], e, i, t);
                for (t.framebuffer = M, e._invertClassification.executeClassified(i, t), 1 === e.frameState.invertClassificationColor.alpha && e._invertClassification.executeUnclassified(i, t), O > 0 && i.stencilBuffer && e._stencilClearCommand.execute(i, t), n.updatePass(Q.CESIUM_3D_TILE_CLASSIFICATION), I = E.commands[Q.CESIUM_3D_TILE_CLASSIFICATION], O = E.indices[Q.CESIUM_3D_TILE_CLASSIFICATION], g = 0; g < O; ++g) qe(I[g], e, i, t);
                for (n.updatePass(Q.CLASSIFICATION), I = E.commands[Q.CLASSIFICATION], O = E.indices[Q.CLASSIFICATION], g = 0; g < O; ++g) qe(I[g], e, i, t)
            }
            for (O > 0 && i.stencilBuffer && e._stencilClearCommand.execute(i, t), _ && v && b.execute(i, t), n.updatePass(Q.OPAQUE), I = E.commands[Q.OPAQUE], O = E.indices[Q.OPAQUE], g = 0; g < O; ++g) qe(I[g], e, i, t);
            0 !== x && e.mode !== we.SCENE2D && (o.near = E.near, n.updateFrustum(o));
            var R;
            if (!u && d.useInvertClassification && e.frameState.invertClassificationColor.alpha < 1 && (R = e._invertClassification), n.updatePass(Q.TRANSLUCENT), I = E.commands[Q.TRANSLUCENT], I.length = E.indices[Q.TRANSLUCENT],
                m(e, qe, t, I, R),
            //1 == e._setSurfaceTransparency._enabled//改成1==1
                1 == 1
                && D < 1e4) {
                e._ellipsoidPrimitive.show = !0, n.updatePass(Q.GLOBE);
                var I = E.commands[Q.GLOBE], O = E.indices[Q.GLOBE];
                for (g = 0; g < O; ++g) qe(I[g], e, i, t);
                h(P) && d.useGlobeDepthFramebuffer && (e.copyGlobeDepth || e.debugShowGlobeDepth) && (P.update(i, t), P.executeCopyDepth(i, t)), e.debugShowGlobeDepth && h(P) && d.useGlobeDepthFramebuffer && (t.framebuffer = A)
            }
            if (h(P) && (d.useGlobeDepthFramebuffer || c) && e.useDepthPicking) {
                var L = c ? t.framebuffer.depthStencilTexture : P.framebuffer.depthStencilTexture, N = Ze(e, x);
                N.update(i, L), N.executeCopyDepth(i, t)
            }
        }
        e._stencilClearCommand.execute(i, t), e.frameState.passes.render && Je(e, t)
    }

    function Je(e, t) {
        var r = e.context, i = e._frameState, n = i.viewshed3ds;
            /*o = e._waterCollection._water,
            a = o.length;*/
       /* for (var s = 0; s < a; ++s) o[s].updateReflectTexture(e);
        for (var s = 0; s < a; ++s) o[s].execute(r, t);*/
        for (var l = n.length, s = 0; s < l; ++s) n[s].updateDepthMap(e);
        for (var s = 0; s < l; ++s) n[s].execute(r, t)
    }

    function $e(e) {
        e.context.uniformState.updatePass(Q.COMPUTE);
        var t = e._environmentState.sunComputeCommand;
        h(t) && t.execute(e._computeEngine);
        for (var r = e._computeCommandList, i = r.length, n = 0; n < i; ++n) r[n].execute(e._computeEngine)
    }

    function et(e, t) {
        e.context.uniformState.updatePass(Q.OVERLAY);
        for (var r = e.context, i = e._overlayCommandList, n = i.length, o = 0; o < n; ++o) i[o].execute(r, t)
    }

    function tt(e, t, r) {
        for (var i = r.shadowMapCullingVolume, n = r.isPointLight, o = r.passes, a = o.length, s = t.length, l = 0; l < s; ++l) {
            var u = t[l];
            if (Ne(e, u), u.castShadows && (u.pass === Q.GLOBE || u.pass === Q.CESIUM_3D_TILE || u.pass === Q.OPAQUE || u.pass === Q.TRANSLUCENT) && ze(u, i)) if (n) for (var c = 0; c < a; ++c) o[c].commandList.push(u); else if (1 === a) o[0].commandList.push(u); else for (var d = !1, h = a - 1; h >= 0; --h) {
                var p = o[h].cullingVolume;
                if (ze(u, p)) o[h].commandList.push(u), d = !0; else if (d) break
            }
        }
    }

    function rt(e) {
        var t = e.frameState, r = t.shadowHints.shadowMaps, i = r.length;
        if (t.shadowHints.shadowsEnabled) for (var n = e.context, o = n.uniformState, a = 0; a < i; ++a) {
            var s = r[a];
            if (!s.outOfView) {
                var l, u = s.passes, c = u.length;
                for (l = 0; l < c; ++l) u[l].commandList.length = 0;
                var d = e.frameState.commandList;
                for (tt(e, d, s), l = 0; l < c; ++l) {
                    var h = s.passes[l];
                    o.updateCamera(h.camera), s.updatePass(n, l);
                    for (var p = h.commandList.length, f = 0; f < p; ++f) {
                        var m = h.commandList[f];
                        o.updatePass(m.pass), qe(m.derivedCommands.shadows.castCommands[a], e, n, h.passState)
                    }
                }
            }
        }
    }

    function it(e, t, r) {
        var i = e._context, o = t.viewport;
        o.x = 0, o.y = 0, o.width = i.drawingBufferWidth, o.height = i.drawingBufferHeight;
        var a = e._frameState, s = a.camera, l = a.mode, u = a.passes.depth;
        if (e._useWebVR && l !== we.SCENE2D) {
            ct(e, t, r), u || ut(e), Ge(e), u || ($e(e), rt(e)), o.x = 0, o.y = 0, o.width = .5 * i.drawingBufferWidth, o.height = i.drawingBufferHeight;
            var c = ie.clone(s, e._cameraVR), h = s.frustum.near, p = h * d(e.focalLength, 5),
                f = d(e.eyeSeparation, p / 30), m = n.multiplyByScalar(c.right, .5 * f, Vt);
            s.frustum.aspectRatio = o.width / o.height;
            var g = .5 * f * h / p;
            n.add(c.position, m, s.position), s.frustum.xOffset = g, Ke(e, t), o.x = t.viewport.width, n.subtract(c.position, m, s.position), s.frustum.xOffset = -g, Ke(e, t), ie.clone(c, s)
        } else l !== we.SCENE2D || e._mapMode2D === ge.ROTATE ? ot(!0, e, t, r) : (ct(e, t, r), nt(e, t))
    }

    function nt(t, r) {
        var i = t.context, o = t.frameState, a = t.camera, s = r.viewport, l = e.clone(s, Xt);
        r.viewport = l;
        var u = zt, c = Gt;
        t.mapProjection.project(u, c);
        var d = n.clone(a.position, Ht), h = E.clone(a.transform, jt), p = a.frustum.clone();
        a._setTransform(E.IDENTITY);
        var f = E.computeViewportTransformation(l, 0, 1, Wt), m = a.frustum.projectionMatrix, g = a.positionWC.y,
            _ = n.fromElements(x.sign(g) * c.x - g, 0, -a.positionWC.x, qt),
            v = U.pointToGLWindowCoordinates(m, f, _, Yt);
        v.x = Math.floor(v.x);
        var y = l.x, b = l.width;
        if (0 === g || v.x <= y || v.x >= y + b) ot(!0, t, r); else if (Math.abs(y + .5 * b - v.x) < 1) l.width = v.x - l.x, a.position.x *= x.sign(a.position.x), a.frustum.right = 0, o.cullingVolume = a.frustum.computeCullingVolume(a.positionWC, a.directionWC, a.upWC), i.uniformState.update(o), ot(!0, t, r), l.x = v.x, a.position.x = -a.position.x, a.frustum.right = -a.frustum.left, a.frustum.left = 0, o.cullingVolume = a.frustum.computeCullingVolume(a.positionWC, a.directionWC, a.upWC), i.uniformState.update(o), ot(!1, t, r); else if (v.x > y + .5 * b) {
            l.width = v.x - y;
            var C = a.frustum.right;
            a.frustum.right = c.x - g, o.cullingVolume = a.frustum.computeCullingVolume(a.positionWC, a.directionWC, a.upWC), i.uniformState.update(o), ot(!0, t, r), l.x = v.x, l.width = y + b - v.x, a.position.x = -a.position.x, a.frustum.left = -a.frustum.right, a.frustum.right = C - 2 * a.frustum.right, o.cullingVolume = a.frustum.computeCullingVolume(a.positionWC, a.directionWC, a.upWC), i.uniformState.update(o), ot(!1, t, r)
        } else {
            l.x = v.x, l.width = y + b - v.x;
            var S = a.frustum.left;
            a.frustum.left = -c.x - g, o.cullingVolume = a.frustum.computeCullingVolume(a.positionWC, a.directionWC, a.upWC), i.uniformState.update(o), ot(!0, t, r), l.x = y, l.width = v.x - y, a.position.x = -a.position.x, a.frustum.right = -a.frustum.left,
                a.frustum.left = S - 2 * a.frustum.left, o.cullingVolume = a.frustum.computeCullingVolume(a.positionWC, a.directionWC, a.upWC), i.uniformState.update(o), ot(!1, t, r)
        }
        a._setTransform(h), n.clone(d, a.position), a.frustum = p.clone(), r.viewport = s
    }

    function ot(e, t, r, i) {
        var n = t.frameState.passes.depth;
        e || n || (t.frameState.commandList.length = 0), n || ut(t), Ge(t), e && (h(i) && ct(t, r, i), n || ($e(t), rt(t))), Ke(t, r)
    }

    function at(e, t) {
        var r = e._frameState, i = e._environmentState, n = r.passes.render, o = e.skyAtmosphere, a = e.globe;
        if (!n || e._mode !== we.SCENE2D && r.camera.frustum instanceof D) i.skyAtmosphereCommand = void 0, i.skyBoxCommand = void 0, i.sunDrawCommand = void 0, i.sunComputeCommand = void 0, i.moonCommand = void 0; else {
            h(o) && h(a) && (o.setDynamicAtmosphereColor(a.enableLighting), i.isReadyForAtmosphere = i.isReadyForAtmosphere || a._surface._tilesToRender.length > 0), i.skyAtmosphereCommand = h(o) ? o.update(r) : void 0, i.skyBoxCommand = h(e.skyBox) ? e.skyBox.update(r) : void 0;
            var s = h(e.sun) ? e.sun.update(r, t) : void 0;
            i.sunDrawCommand = h(s) ? s.drawCommand : void 0, i.sunComputeCommand = h(s) ? s.computeCommand : void 0, i.moonCommand = h(e.moon) ? e.moon.update(r) : void 0
        }
        var l = i.clearGlobeDepth = h(a) && (!a.depthTestAgainstTerrain || e.mode === we.SCENE2D);
        (i.useDepthPlane = l && e.mode === we.SCENE3D) && e._depthPlane.update(r);
        for (var u = r.mode === we.SCENE3D ? r.occluder : void 0, c = r.cullingVolume, d = Rt.planes, p = 0; p < 5; ++p) d[p] = c.planes[p];
        c = Rt, i.isSkyAtmosphereVisible = h(i.skyAtmosphereCommand) && i.isReadyForAtmosphere, i.isSunVisible = ze(i.sunDrawCommand, c, u), i.isMoonVisible = ze(i.moonCommand, c, u)
    }

    function st(e) {
        var t = e._frameState;
        e.debugShowFrustumPlanes !== e._debugShowFrustumPlanes && (e.debugShowFrustumPlanes ? e._debugFrustumPlanes = new oe({
            camera: e.camera,
            updateOnChange: !1
        }) : e._debugFrustumPlanes = e._debugFrustumPlanes && e._debugFrustumPlanes.destroy(), e._debugShowFrustumPlanes = e.debugShowFrustumPlanes), h(e._debugFrustumPlanes) && e._debugFrustumPlanes.update(t)
    }

    function lt(e) {
        var t = e._frameState, r = t.shadowMaps, i = r.length, n = i > 0 && !t.passes.pick && e.mode === we.SCENE3D;
        if (n !== t.shadowHints.shadowsEnabled && (++t.shadowHints.lastDirtyTime, t.shadowHints.shadowsEnabled = n), n) {
            for (var o = 0; o < i; ++o) if (r[o] !== t.shadowHints.shadowMaps[o]) {
                ++t.shadowHints.lastDirtyTime;
                break
            }
            t.shadowHints.shadowMaps.length = 0, t.shadowHints.lightShadowMaps.length = 0;
            for (var a = 0; a < i; ++a) {
                var s = r[a];
                s.update(t), t.shadowHints.shadowMaps.push(s), s.fromLightSource && t.shadowHints.lightShadowMaps.push(s), s.dirty && (++t.shadowHints.lastDirtyTime, s.dirty = !1)
            }
        }
    }

    function ut(e) {
        var t = e._frameState;
        t._scene = e,
            e._groundPrimitives.update(t),
            e._primitives.update(t),
            //e._pageLODs.update(t),
            st(e), lt(e), e._globe && e._globe.render(t)
    }

    function ct(e, t, r) {
        var i = e._context, n = e._environmentState, o = e._frameState.passes, a = o.pick,
            l = e._useWebVR && e.mode !== we.SCENE2D;
        n.originalFramebuffer = t.framebuffer, h(e.sun) && e.sunBloom !== e._sunBloom ? (e.sunBloom && !l ? e._sunPostProcess = new Pe : h(e._sunPostProcess) && (e._sunPostProcess = e._sunPostProcess.destroy()), e._sunBloom = e.sunBloom) : !h(e.sun) && h(e._sunPostProcess) && (e._sunPostProcess = e._sunPostProcess.destroy(), e._sunBloom = !1);
        var u = e._clearColorCommand;
        s.clone(r, u.color), u.execute(i, t);
        var c = n.useGlobeDepthFramebuffer = !a && h(e._globeDepth);
        c && (e._globeDepth.update(i, t), e._globeDepth.clear(i, t, r));
        var d = n.useOIT = !a && h(e._oit) && e._oit.isSupported();
        d && (e._oit.update(i, t, e._globeDepth.framebuffer), e._oit.clear(i, t, r), n.useOIT = e._oit.isSupported());
        var p = n.useFXAA = !a && e.fxaa;
        if (p && (e._fxaa.update(i, t), e._fxaa.clear(i, t, r)), n.isSunVisible && e.sunBloom && !l ? t.framebuffer = e._sunPostProcess.update(t) : c ? t.framebuffer = e._globeDepth.framebuffer : p && (t.framebuffer = e._fxaa.getColorFramebuffer()), h(t.framebuffer) && u.execute(i, t), n.useInvertClassification = !a && h(t.framebuffer) && e.invertClassification) {
            var f;
            if (1 === e.frameState.invertClassificationColor.alpha && (n.useGlobeDepthFramebuffer ? f = e._globeDepth.framebuffer : n.useFXAA && (f = e._fxaa.getColorFramebuffer())), e._invertClassification.previousFramebuffer = f, e._invertClassification.update(i), e._invertClassification.clear(i, t), e.frameState.invertClassificationColor.alpha < 1 && d) {
                var m = e._invertClassification.unclassifiedCommand, g = m.derivedCommands;
                g.oit = e._oit.createDerivedCommands(m, i, g.oit)
            }
        }
    }

    function dt(e, t) {
        var r = e._context, i = e._environmentState, n = i.useGlobeDepthFramebuffer;
        if (e.debugShowGlobeDepth && n) {
            Qe(e, e.debugShowDepthFrustum - 1).executeDebugGlobeDepth(r, t)
        }
        if (e.debugShowPickDepth && n) {
            Ze(e, e.debugShowDepthFrustum - 1).executeDebugPickDepth(r, t)
        }
        var o = i.useOIT, a = i.useFXAA;
        o && (t.framebuffer = a ? e._fxaa.getColorFramebuffer() : void 0, e._oit.execute(r, t)), a && (!o && n && (t.framebuffer = e._fxaa.getColorFramebuffer(), e._globeDepth.executeCopyColor(r, t)), t.framebuffer = i.originalFramebuffer, e._fxaa.execute(r, t)), o || a || !n || (t.framebuffer = i.originalFramebuffer, e._globeDepth.executeCopyColor(r, t))
    }

    function ht(e) {
        for (var t = e._frameState.afterRender, r = 0, i = t.length; r < i; ++r) t[r](), e.requestRender();
        t.length = 0
    }

    function pt(e) {
        var t = e._camera;
        return Le(t, e._cameraClone, x.EPSILON15) ? (e._cameraStartFired && C() - e._cameraMovedTime > e.cameraEventWaitTime && (t.moveEnd.raiseEvent(), e._cameraStartFired = !1), !1) : (e._cameraStartFired || (t.moveStart.raiseEvent(), e._cameraStartFired = !0), e._cameraMovedTime = C(), ie.clone(t, e._cameraClone), !0)
    }

    function ft(e, t) {
        if (e.debugShowFramesPerSecond) {
            if (!h(e._performanceDisplay)) {
                var r = document.createElement("div");
                r.className = "cesium-performanceDisplay-defaultContainer";
                e._canvas.parentNode.appendChild(r);
                var i = new ve({container: r});
                e._performanceDisplay = i, e._performanceContainer = r
            }
            e._performanceDisplay.throttled = e.requestRenderMode, e._performanceDisplay.update(t)
        } else h(e._performanceDisplay) && (e._performanceDisplay = e._performanceDisplay && e._performanceDisplay.destroy(), e._performanceContainer.parentNode.removeChild(e._performanceContainer))
    }

    function mt(e) {
        var t = e._frameState;
        h(e.globe) && e.globe.update(t), t.creditDisplay.update()
    }

    function gt(e, t) {
        e._pickPositionCacheDirty = !0;
        var r = e.context, i = r.uniformState, o = e._frameState;
        Fe(e, x.incrementWrap(o.frameNumber, 15e6, 1), t), o.passes.render = !0;
        var a = d(e.backgroundColor, s.BLACK);
        o.backgroundColor = a, o.creditDisplay.beginFrame(), e.fog.update(o), i.update(o);
        var l = e.shadowMap;
        h(l) && l.enabled && (n.negate(i.sunDirectionWC, e._sunCamera.direction), o.shadowMaps.push(l)), e._computeCommandList.length = 0, e._overlayCommandList.length = 0;
        var u = e._passState;
        u.framebuffer = void 0, u.blendingEnabled = void 0, u.scissorTest = void 0, h(e.globe) && e.globe.beginFrame(o), at(e, u), it(e, u, a), dt(e, u), et(e, u), h(e.globe) && (e.globe.endFrame(o), e.globe.tilesLoaded || (e._renderRequested = !0)), o.creditDisplay.endFrame(), r.endFrame()
    }

    function _t(e, t, r) {
        try {
            r(e, t)
        } catch (t) {
            if (e._renderError.raiseEvent(e, t), e.rethrowRenderErrors) throw t
        }
    }

    function vt(e, t, r, i) {
        var o = e._camera, a = o.frustum;
        h(a._offCenterFrustum) && (a = a._offCenterFrustum);
        var s = e._passState.viewport, l = 2 * (t.x - s.x) / s.width - 1;
        l *= .5 * (a.right - a.left);
        var u = 2 * (s.height - t.y - s.y) / s.height - 1;
        u *= .5 * (a.top - a.bottom);
        var c = E.clone(o.transform, $t);
        o._setTransform(E.IDENTITY);
        var d = n.clone(o.position, Zt);
        n.multiplyByScalar(o.right, l, Kt), n.add(Kt, d, d), n.multiplyByScalar(o.up, u, Kt), n.add(Kt, d, d), o._setTransform(c), e.mode === we.SCENE2D && n.fromElements(d.z, d.x, d.y, d);
        var p = a.getPixelDimensions(s.width, s.height, 1, Jt), f = Qt;
        return f.right = .5 * p.x, f.left = -f.right, f.top = .5 * p.y, f.bottom = -f.top, f.near = a.near, f.far = a.far, f.computeCullingVolume(d, o.directionWC, o.upWC)
    }

    function yt(e, t, r, i) {
        var n = e._camera, o = n.frustum, a = o.near, s = Math.tan(.5 * o.fovy), l = o.aspectRatio * s,
            u = e._passState.viewport, c = 2 * (t.x - u.x) / u.width - 1,
            d = 2 * (u.height - t.y - u.y) / u.height - 1, h = c * a * l, p = d * a * s,
            f = o.getPixelDimensions(u.width, u.height, 1, Jt), m = f.x * r * .5, g = f.y * i * .5, _ = er;
        return _.top = p + g, _.bottom = p - g, _.right = h + m, _.left = h - m, _.near = a, _.far = o.far, _.computeCullingVolume(n.positionWC, n.directionWC, n.upWC)
    }

    function bt(e, t, r, i) {
        var n = e.camera.frustum;
        return n instanceof D || n instanceof I ? vt(e, t, r, i) : yt(e, t, r, i)
    }

    function Ct(e, t) {
        var r = e.shaderCache.getDerivedShaderProgram(t, "depthOnly");
        if (!h(r)) {
            for (var i = t._attributeLocations, n = t.fragmentShaderSource, o = !1, a = n.sources, s = a.length, l = 0; l < s; ++l) if (ar.test(a[l]) || sr.test(a[l])) {
                o = !0;
                break
            }
            o || (n = new ee({sources: ["void main() { gl_FragColor = vec4(1.0); }"]})), r = e.shaderCache.createDerivedShaderProgram(t, "depthOnly", {
                vertexShaderSource: t.vertexShaderSource,
                fragmentShaderSource: n,
                attributeLocations: i
            })
        }
        return r
    }

    function St(e, t) {
        var r = e._depthOnlyRenderStateCache, i = r[t.id];
        if (!h(i)) {
            var n = J.getState(t);
            n.depthMask = !0, n.colorMask = {
                red: !1,
                green: !1,
                blue: !1,
                alpha: !1
            }, i = J.fromCache(n), r[t.id] = i
        }
        return i
    }

    function wt(e, t, r, i) {
        h(i) || (i = {});
        var n, o;
        return h(i.depthOnlyCommand) && (n = i.depthOnlyCommand.shaderProgram, o = i.depthOnlyCommand.renderState), i.depthOnlyCommand = Y.shallowClone(t, i.depthOnlyCommand), h(n) && i.shaderProgramId === t.shaderProgram.id ? (i.depthOnlyCommand.shaderProgram = n, i.depthOnlyCommand.renderState = o) : (i.depthOnlyCommand.shaderProgram = Ct(r, t.shaderProgram), i.depthOnlyCommand.renderState = St(e, t.renderState), i.shaderProgramId = t.shaderProgram.id), i
    }

    function Tt(t, r) {
        var i = t._context, n = t._frameState;
        Be(n.passes), n.passes.pick = !0, n.passes.depth = !0, n.cullingVolume = bt(t, r, 1, 1);
        var o = t._pickDepthPassState;
        h(o) || (o = t._pickDepthPassState = new Z(i), o.scissorTest = {
            enabled: !0,
            rectangle: new e
        }, o.viewport = new e);
        var a = i.drawingBufferWidth, s = i.drawingBufferHeight, l = t._pickDepthFramebuffer,
            u = t._pickDepthFramebufferWidth, c = t._pickDepthFramebufferHeight;
        h(l) && u === a && c === s || (t._pickDepthFramebuffer = t._pickDepthFramebuffer && t._pickDepthFramebuffer.destroy(), l = t._pickDepthFramebuffer = new X({
            context: i,
            depthStencilTexture: new te({
                context: i,
                width: a,
                height: s,
                pixelFormat: R.DEPTH_STENCIL,
                pixelDatatype: K.UNSIGNED_INT_24_8
            })
        }), t._pickDepthFramebufferWidth = a, t._pickDepthFramebufferHeight = s), o.framebuffer = l, o.viewport.width = a, o.viewport.height = s, o.scissorTest.rectangle.x = r.x, o.scissorTest.rectangle.y = s - r.y, o.scissorTest.rectangle.width = 1, o.scissorTest.rectangle.height = 1, at(t, o), it(t, o, nr), dt(t, o), i.endFrame()
    }

    function xt(e, t, r) {
        if (t.x >= 0 && t.x < e.canvas.clientWidth && t.y >= 0 && t.y < e.canvas.clientHeight) {
            var i = e.pickPositionWorldCoordinates(t, i);
            if (h(i)) {
                var o = n.distance(e.camera.position, i);
                if (r - o > .01 * o) return i
            }
        }
    }

    function Et(e, t, r, o) {
        var a = n.distance(e.camera.position, r), s = 2 * o + 1;
        s = s * s - 1;
        for (var l = 1, u = new i; s > 0;) {
            u.y = t.y - l;
            for (var c = 1 - l; c <= l; c++) {
                s--, u.x = t.x + c;
                var d = xt(e, u, a);
                if (h(d)) return d
            }
            u.x = t.x + l;
            for (var c = 1 - l; c <= l; c++) {
                s--, u.y = t.y + c;
                var d = xt(e, u, a);
                if (h(d)) return d
            }
            u.y = t.y + l;
            for (var c = l - 1; c >= -l; c--) {
                s--, u.x = t.x + c;
                var d = xt(e, u, a);
                if (h(d)) return d
            }
            u.x = t.x - l;
            for (var c = l - 1; c >= -l; c--) {
                s--, u.y = t.y + c;
                var d = xt(u, a);
                if (h(d)) return d
            }
            l++
        }
    }

    var At = function (e) {
        return function () {
            e.frameState.afterRender.push(function () {
                e.requestRender()
            })
        }
    }, Pt = .9999;
    p(Oe.prototype, {
        canvas: {
            get: function () {
                return this._canvas
            }
        }, drawingBufferHeight: {
            get: function () {
                return this._context.drawingBufferHeight
            }
        }, drawingBufferWidth: {
            get: function () {
                return this._context.drawingBufferWidth
            }
        }, maximumAliasedLineWidth: {
            get: function () {
                return q.maximumAliasedLineWidth
            }
        }, maximumCubeMapSize: {
            get: function () {
                return q.maximumCubeMapSize
            }
        }, pickPositionSupported: {
            get: function () {
                return this._context.depthTexture
            }
        }, globe: {
            get: function () {
                return this._globe
            }, set: function (e) {
                this._globe = this._globe && this._globe.destroy(), this._globe = e, Me(this, e)
            }
        }, primitives: {
            get: function () {
                return this._primitives
            }
        }, groundPrimitives: {
            get: function () {
                return this._groundPrimitives
            }
        }, pageLODLayers: {
            get: function () {
                return this._pageLODs
            }
        }, camera: {
            get: function () {
                return this._camera
            }
        }, screenSpaceCameraController: {
            get: function () {
                return this._screenSpaceCameraController
            }
        }, mapProjection: {
            get: function () {
                return this._mapProjection
            }
        }, frameState: {
            get: function () {
                return this._frameState
            }
        }, tweens: {
            get: function () {
                return this._tweens
            }
        }, imageryLayers: {
            get: function () {
                if (h(this.globe)) return this.globe.imageryLayers
            }
        }, pitCollection: {
            get: function () {
                return this._pitCollection
            }
        }, setSurfaceTransparency: {
            get: function () {
                return this._setSurfaceTransparency
            }
        }, waterCollection: {
            get: function () {
                return this._waterCollection
            }
        }, terrainLayers: {
            get: function () {
                return this.globe.terrainLayers
            }
        }, terrainProviderChanged: {
            get: function () {
                if (h(this.globe)) return this.globe.terrainProviderChanged
            }
        }, preUpdate: {
            get: function () {
                return this._preUpdate
            }
        }, postUpdate: {
            get: function () {
                return this._postUpdate
            }
        }, renderError: {
            get: function () {
                return this._renderError
            }
        }, preRender: {
            get: function () {
                return this._preRender
            }
        }, postRender: {
            get: function () {
                return this._postRender
            }
        }, lastRenderTime: {
            get: function () {
                return this._lastRenderTime
            }
        }, context: {
            get: function () {
                return this._context
            }
        }, debugFrustumStatistics: {
            get: function () {
                return this._debugFrustumStatistics
            }
        }, scene3DOnly: {
            get: function () {
                return this._frameState.scene3DOnly
            }
        }, orderIndependentTranslucency: {
            get: function () {
                return h(this._oit)
            }
        }, id: {
            get: function () {
                return this._id
            }
        }, mode: {
            get: function () {
                return this._mode
            }, set: function (e) {
                e === we.SCENE2D ? this.morphTo2D(0) : e === we.SCENE3D ? this.morphTo3D(0) : e === we.COLUMBUS_VIEW && this.morphToColumbusView(0), this._mode = e
            }
        }, numberOfFrustums: {
            get: function () {
                return this._frustumCommandsList.length
            }
        }, terrainExaggeration: {
            get: function () {
                return this._terrainExaggeration
            }
        }, useWebVR: {
            get: function () {
                return this._useWebVR
            }, set: function (e) {
                this._useWebVR = e, this._useWebVR ? (this._frameState.creditDisplay.container.style.visibility = "hidden", this._cameraVR = new ie(this), h(this._deviceOrientationCameraController) || (this._deviceOrientationCameraController = new se(this)), this._aspectRatioVR = this._camera.frustum.aspectRatio) : (this._frameState.creditDisplay.container.style.visibility = "visible", this._cameraVR = void 0, this._deviceOrientationCameraController = this._deviceOrientationCameraController && !this._deviceOrientationCameraController.isDestroyed() && this._deviceOrientationCameraController.destroy(), this._camera.frustum.aspectRatio = this._aspectRatioVR, this._camera.frustum.xOffset = 0)
            }
        }, mapMode2D: {
            get: function () {
                return this._mapMode2D
            }
        }, imagerySplitPosition: {
            get: function () {
                return this._frameState.imagerySplitPosition
            }, set: function (e) {
                this._frameState.imagerySplitPosition = e
            }
        }, minimumDisableDepthTestDistance: {
            get: function () {
                return this._minimumDisableDepthTestDistance
            }, set: function (e) {
                this._minimumDisableDepthTestDistance = e
            }
        }, useSingleFrustum: {
            get: function () {
                return this._useSingleFrustum
            }, set: function (e) {
                this._useSingleFrustum = e, e || (this._camera.frustum.near = 1, this._camera.frustum.far = 5e8)
            }
        }
    }), Oe.prototype.getCompressedTextureFormatSupported = function (e) {
        var t = this.context;
        return ("WEBGL_compressed_texture_s3tc" === e || "s3tc" === e) && t.s3tc || ("WEBGL_compressed_texture_pvrtc" === e || "pvrtc" === e) && t.pvrtc || ("WEBGL_compressed_texture_etc1" === e || "etc1" === e) && t.etc1
    };
    var Dt, It = new n, Ot = new n, Mt = new t, Rt = new c, Lt = new w,
        Nt = new E(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1);
    Nt = E.inverseTransformation(Nt, Nt);
    var kt = new O, Bt = new M, Ft = new D, Ut = new I, Vt = new n, zt = new a(Math.PI, x.PI_OVER_TWO), Gt = new n,
        Ht = new n, Wt = new E, jt = new E, qt = new n, Yt = new n, Xt = new e;
    Oe.prototype.initializeFrame = function () {
        120 == this._shaderFrameCount++ && (this._shaderFrameCount = 0, this._context.shaderCache.destroyReleasedShaderPrograms()), this._tweens.update(), this._screenSpaceCameraController.update(), h(this._deviceOrientationCameraController) && this._deviceOrientationCameraController.update(), this._camera.update(this._mode), this._camera._updateCameraChanged()
    }, Oe.prototype.render = function (e) {
        h(e) || (e = T.now()), this._jobScheduler.resetBudgets(), this._preUpdate.raiseEvent(this, e), _t(this, e, mt), this._postUpdate.raiseEvent(this, e);
        var t = pt(this), r = !this.requestRenderMode || this._renderRequested || t || this.mode === we.MORPHING;
        if (!r && h(this.maximumRenderTimeChange) && h(this._lastRenderTime)) {
            var i = Math.abs(T.secondsDifference(this._lastRenderTime, e));
            r = r || i > this.maximumRenderTimeChange
        }
        if (r && (this._lastRenderTime = T.clone(e, this._lastRenderTime), this._renderRequested = !1, this._preRender.raiseEvent(this, e), _t(this, e, gt), k.update()), ft(this, r), ht(this), r && this._postRender.raiseEvent(this, e), !this._frameState.isPC) {
            var e = C();
            this._fpsFrameCount++;
            var n = e - this._lastFpsSampleTime;
            if (n > 1e3) {
                var o = 1e3 * this._fpsFrameCount / n | 0, a = 100;
                a = o < 20 ? 100 : o < 40 ? 200 : 500, this._frameState.maximumMemoryUsage = 1048576 * a, this._lastFpsSampleTime = e, this._fpsFrameCount = 0
            }
        }
    }, Oe.prototype.forceRender = function (e) {
        this._renderRequested = !0, this.render(e)
    }, Oe.prototype.requestRender = function () {
        this._renderRequested = !0
    }, Oe.prototype.renderDepth = function (e, t, r) {
        var i = this.frameState, n = this.context, o = n.uniformState;
        Be(this._frameState.passes), i.passes.depth = !0, o.updateCamera(r), e.execute(this.context, t);
        for (var a = r.frustum.computeCullingVolume(r.positionWC, r.directionWC, r.upWC), s = i.commandList, l = s.length, u = 0; u < l; ++u) {
            var c = s[u];
            c.pass !== Q.GLOBE && c.pass !== Q.CESIUM_3D_TILE && c.pass !== Q.OPAQUE && c.pass !== Q.TRANSLUCENT || ze(c, a) && (o.updatePass(c.pass), Ne(this, c), qe(c, this, n, t))
        }
        o.updateCamera(this._camera), o.updateFrustum(this._camera.workingFrustums[0])
    }, Oe.prototype.renderColorTexture = function (e, t, r) {
        var i = this.frameState, n = this.context, o = n.uniformState;
        Be(this._frameState.passes), i.passes.render = !0;
        var a = i.camera;
        i.camera = r, o.updateCamera(r), at(this, t), e.execute(n, t);
        var s = i.commandList, l = s.length, u = this._environmentState;
        u.isSkyAtmosphereVisible && qe(u.skyAtmosphereCommand, this, n, t);
        for (var c = 0; c < l; ++c) {
            var d = s[c];
            d.pass !== Q.GLOBE && d.pass !== Q.CESIUM_3D_TILE && d.pass !== Q.OPAQUE && d.pass !== Q.TRANSLUCENT && d.pass !== Q.ENVIRONMENT && d.pass !== Q.OVERLAY || (o.updatePass(d.pass), qe(d, this, n, t))
        }
        o.updateCamera(this._camera), o.updateFrustum(this._camera.workingFrustums[0]), i.camera = a
    }, Oe.prototype.clampLineWidth = function (e) {
        return Math.max(q.minimumAliasedLineWidth, Math.min(e, q.maximumAliasedLineWidth))
    };
    var Qt = new I, Zt = new n, Kt = new n, Jt = new i, $t = new E, er = new M, tr = 3, rr = 3,
        ir = new e(0, 0, tr, rr), nr = new s(0, 0, 0, 0), or = new i;
    Oe.prototype.pick = function (e, t, r) {
        tr = d(t, 3), rr = d(r, tr);
        var i = this._context, n = i.uniformState, o = this._frameState,
            a = Te.transformWindowToDrawingBuffer(this, e, or);
        h(this._pickFramebuffer) || (this._pickFramebuffer = i.createPickFramebuffer()), this._jobScheduler.disableThisFrame(), Fe(this, o.frameNumber, o.time), o.cullingVolume = bt(this, a, tr, rr), o.invertClassification = !1, o.passes.pick = !0, n.update(o), ir.x = a.x - .5 * (tr - 1), ir.y = this.drawingBufferHeight - a.y - .5 * (rr - 1), ir.width = tr, ir.height = rr;
        var s = this._pickFramebuffer.begin(ir);
        at(this, s), it(this, s, nr), dt(this, s);
        var l = this._pickFramebuffer.end(ir);
        return i.endFrame(), ht(this), l
    }, Oe.prototype._pickObjectId = function (e) {
        var t = this._context, r = t.uniformState, i = this._frameState,
            n = Te.transformWindowToDrawingBuffer(this, e, or);
        h(this._pickFramebuffer) || (this._pickFramebuffer = t.createPickFramebuffer()), this._jobScheduler.disableThisFrame(), Fe(this, i.frameNumber, i.time), i.cullingVolume = bt(this, n, tr, rr), i.passes.pick = !0, r.update(i), ir.x = n.x - .5 * (tr - 1), ir.y = this.drawingBufferHeight - n.y - .5 * (rr - 1);
        var o = this._pickFramebuffer.begin(ir);
        at(this, o), it(this, o, nr), dt(this, o), ir.width = 1, ir.height = 1;
        var a = this._pickFramebuffer._pickId(ir);
        return t.endFrame(), ht(this), a
    };
    var ar = /\bgl_FragDepthEXT\b/, sr = /\bdiscard\b/, lr = new o, ur = new o(1, 1 / 255, 1 / 65025, 1 / 16581375);
    Oe.prototype.pickPositionWorldCoordinates = function (e, t) {
        if (this.useDepthPicking) {
            var r = e.toString();
            if (this._pickPositionCacheDirty) this._pickPositionCache = {}, this._pickPositionCacheDirty = !1; else if (this._pickPositionCache.hasOwnProperty(r)) return n.clone(this._pickPositionCache[r], t);
            var i = this._context, a = i.uniformState, s = Te.transformWindowToDrawingBuffer(this, e, or);
            this.pickTranslucentDepth && Tt(this, s), s.y = this.drawingBufferHeight - s.y;
            var l, u = this._camera;
            l = h(u.frustum.fov) ? u.frustum.clone(kt) : h(u.frustum.infiniteProjectionMatrix) ? u.frustum.clone(Bt) : h(u.frustum.width) ? u.frustum.clone(Ft) : u.frustum.clone(Ut);
            for (var c = this.numberOfFrustums, d = 0; d < c; ++d) {
                var p = Ze(this, d),
                    f = i.readPixels({x: s.x, y: s.y, width: 1, height: 1, framebuffer: p.framebuffer}),
                    m = o.unpack(f, 0, lr);
                o.divideByScalar(m, 255, m);
                var g = o.dot(m, ur);
                if (g > 0 && g < 1) {
                    var _, v = this._frustumCommandsList[d];
                    return this.mode === we.SCENE2D ? (_ = u.position.z, u.position.z = _ - v.near + 1, l.far = Math.max(1, v.far - v.near), l.near = 1, a.update(this.frameState), a.updateFrustum(l)) : (l.near = v.near * (0 !== d ? Pt : 1), l.far = v.far, a.updateFrustum(l)), t = Te.drawingBufferToWgs84Coordinates(this, s, g, t), this.mode === we.SCENE2D && (u.position.z = _, a.update(this.frameState)), this._pickPositionCache[r] = n.clone(t), t
                }
            }
            this._pickPositionCache[r] = void 0
        }
    };
    var cr = new a;
    Oe.prototype.pickPosition = function (e, t) {
        if (t = this.pickPositionWorldCoordinates(e, t), h(t) && this.mode !== we.SCENE3D) {
            n.fromElements(t.y, t.z, t.x, t);
            var r = this.mapProjection, i = r.ellipsoid, o = r.unproject(t, cr);
            i.cartographicToCartesian(o, t)
        }
        return t
    }, Oe.prototype.drillPick = function (e, t) {
        var r, i, n = [], o = [], a = [];
        h(t) || (t = Number.MAX_VALUE);
        for (var s = this.pick(e); h(s) && h(s.primitive) && (n.push(s), !(0 >= --t));) {
            var l = s.primitive, u = !1;
            "function" == typeof l.getGeometryInstanceAttributes && h(s.id) && (i = l.getGeometryInstanceAttributes(s.id), h(i) && h(i.show) && (u = !0, i.show = B.toValue(!1, i.show), a.push(i))), u || (l.show = !1, o.push(l)), s = this.pick(e)
        }
        for (r = 0; r < o.length; ++r) o[r].show = !0;
        for (r = 0; r < a.length; ++r) i = a[r], i.show = B.toValue(!0, i.show);
        return n
    }, Oe.prototype.cartesianToCanvasCoordinates = function (e, t) {
        return Te.wgs84ToWindowCoordinates(this, e, t)
    }, Oe.prototype.completeMorph = function () {
        this._transitioner.completeMorph()
    }, Oe.prototype.morphTo2D = function (e) {
        var t, r = this.globe;
        t = h(r) ? r.ellipsoid : this.mapProjection.ellipsoid, e = d(e, 2), this._transitioner.morphTo2D(e, t)
    }, Oe.prototype.morphToColumbusView = function (e) {
        var t, r = this.globe;
        t = h(r) ? r.ellipsoid : this.mapProjection.ellipsoid, e = d(e, 2), this._transitioner.morphToColumbusView(e, t)
    }, Oe.prototype.morphTo3D = function (e) {
        var t, r = this.globe;
        t = h(r) ? r.ellipsoid : this.mapProjection.ellipsoid, e = d(e, 2), this._transitioner.morphTo3D(e, t)
    }, Oe.prototype.isDestroyed = function () {
        return !1
    }, Oe.prototype.destroy = function () {
        this._tweens.removeAll(), this._computeEngine = this._computeEngine && this._computeEngine.destroy(), this._screenSpaceCameraController = this._screenSpaceCameraController && this._screenSpaceCameraController.destroy(), this._deviceOrientationCameraController = this._deviceOrientationCameraController && !this._deviceOrientationCameraController.isDestroyed() && this._deviceOrientationCameraController.destroy(), this._pickFramebuffer = this._pickFramebuffer && this._pickFramebuffer.destroy(), this._pickDepthFramebuffer = this._pickDepthFramebuffer && this._pickDepthFramebuffer.destroy(), this._primitives = this._primitives && this._primitives.destroy(), this._groundPrimitives = this._groundPrimitives && this._groundPrimitives.destroy(), this._globe = this._globe && this._globe.destroy(), this.skyBox = this.skyBox && this.skyBox.destroy(), this.skyAtmosphere = this.skyAtmosphere && this.skyAtmosphere.destroy(), this._debugSphere = this._debugSphere && this._debugSphere.destroy(), this.sun = this.sun && this.sun.destroy(), this._sunPostProcess = this._sunPostProcess && this._sunPostProcess.destroy(), this._depthPlane = this._depthPlane && this._depthPlane.destroy(), this._transitioner.destroy(), this._debugFrustumPlanes = this._debugFrustumPlanes && this._debugFrustumPlanes.destroy(), this._brdfLutGenerator = this._brdfLutGenerator && this._brdfLutGenerator.destroy(), h(this._globeDepth) && this._globeDepth.destroy(), this._removeCreditContainer && this._canvas.parentNode.removeChild(this._creditContainer), h(this._oit) && this._oit.destroy(), this._fxaa.destroy(), this._context = this._context && this._context.destroy(), this._frameState.creditDisplay.destroy(), h(this._performanceDisplay) && (this._performanceDisplay = this._performanceDisplay && this._performanceDisplay.destroy(), this._performanceContainer.parentNode.removeChild(this._performanceContainer)), this._removeRequestListenerCallback(), this._removeTaskProcessorListenerCallback();
        for (var e = 0; e < this._removeGlobeCallbacks.length; ++e) this._removeGlobeCallbacks[e]();
        return this._removeGlobeCallbacks.length = 0, f(this)
    }, Oe.prototype.cartesianToCanvasCoordinates = function (e, t) {
        return Te.wgs84ToWindowCoordinates(this, e, t)
    };
    var dr = new N, hr = new n, pr = new n;
    return Oe.prototype.pickGlobe = function (e, t, r) {
        var i, o = this._globe, a = this.camera;
        if (this.pickPositionSupported && (i = this.pickPositionWorldCoordinates(e, hr), h(r) && h(i))) {
            var s = Et(this, e, i, r);
            h(s) && (i = s)
        }
        var l = a.getPickRay(e, dr), u = o.pick(l, this, pr);
        return (h(i) ? n.distance(i, a.positionWC) : Number.POSITIVE_INFINITY) < (h(u) ? n.distance(u, a.positionWC) : Number.POSITIVE_INFINITY) ? n.clone(i, t) : n.clone(u, t)
    }, Oe
})