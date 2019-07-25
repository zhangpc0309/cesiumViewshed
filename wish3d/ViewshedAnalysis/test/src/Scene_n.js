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
        "../LSSource/LSPitCollection",
        "../LSSource/LSSetSurfaceTransparency",
        "../LSSource/LSWaterCollection",
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
        "../LSSource/LSPageLODCollection"
    ],
    function (
        BoundingRectangle,
        BoundingSphere,
        BoxGeometry,
        Cartesian2,
        Cartesian3,
        Cartesian4,
        Cartographic,
        Color,
        ColorGeometryInstanceAttribute,
        createGuid,
        CullingVolume,
        defaultValue,
        defined,
        defineProperties,
        destroyObject,
        DeveloperError,
        EllipsoidGeometry,
        Event,
        GeographicProjection,
        GeometryInstance,
        GeometryPipeline,
        getTimestamp,
        Intersect,
        Interval,
        JulianDate,
        Math,
        Matrix4,
        mergeSort,
        Occluder,
        OrthographicFrustum,
        OrthographicOffCenterFrustum,
        PerspectiveFrustum,
        PerspectiveOffCenterFrustum,
        PixelFormat,
        Plane,
        Ray,
        RequestScheduler,
        ShowGeometryInstanceAttribute,
        TaskProcessor,
        Transforms,
        LSPitCollection,
        LSSetSurfaceTransparency,
        LSWaterCollection,
        ClearCommand,
        ComputeEngine,
        Context,
        ContextLimits,
        DrawCommand,
        Framebuffer,
        Pass,
        PassState,
        PixelDatatype,
        RenderState,
        ShaderProgram,
        ShaderSource,
        Texture,
        BrdfLutGenerator,
        Camera,
        CreditDisplay,
        DebugCameraPrimitive,
        DepthPlane,
        DeviceOrientationCameraController,
        EllipsoidPrimitive,
        Fog,
        FrameState,
        FrustumCommands,
        FXAA,
        GlobeDepth,
        InvertClassification,
        JobScheduler,
        MapMode2D,
        OIT,
        PerformanceDisplay,
        PerInstanceColorAppearance,
        PickDepth,
        Primitive,
        PrimitiveCollection,
        SceneMode,
        SceneTransforms,
        SceneTransitioner,
        ScreenSpaceCameraController,
        ShadowMap,
        SunPostProcess,
        TweenCollection,
        LSPageLODCollection
    ) {
        "use strict";

        var requestRenderAfterFrame = function (scene) {
            return function () {
                scene.frameState.afterRender.push(function () {
                    scene.requestRender();
                });
            };
        };

        function Scene(options) {//Oe
            options = defaultValue(options, defaultValue.EMPTY_OBJECT);
            var canvas = options.canvas;//r
            var contextOptions = options.contextOptions;//i
            var creditContainer = options.creditContainer;//o
            var creditViewport = options.creditViewport;//a

            var hasCreditContainer = defined(creditContainer);//l
            var context = new Context(r, i);//c
            if (!hasCreditContainer) {
                creditContainer = document.createElement("div");
                creditContainer.style.position = "absolute";
                creditContainer.style.bottom = "0";
                creditContainer.style["text-shadow"] = "0 0 2px #000000";
                creditContainer.style.color = "#ffffff";
                creditContainer.style["font-size"] = "10px";
                creditContainer.style["padding-right"] = "5px";
                canvas.parentNode.appendChild(creditContainer);
            }


            if (!defined(creditViewport)) {
                creditViewport = canvas.parentNode;
            }

            this.pit = [];//新增

            this._id = createGuid();
            this._jobScheduler = new JobScheduler;
            this._frameState = new FrameState(context, new CreditDisplay(creditContainer, " • ", a), this._jobScheduler);
            this._frameState.scene3DOnly = defaultValue(options.scene3DOnly, !1);
            this._removeCreditContainer = !hasCreditContainer;
            this._creditContainer = creditContainer;

            var ps = new PassState(context);
            ps.viewport = new BoundingRectangle;
            ps.viewport.x = 0;
            ps.viewport.y = 0;
            ps.viewport.width = c.drawingBufferWidth;
            ps.viewport.height = c.drawingBufferHeight;
            this._passState = ps;

            this._canvas = canvas;
            this._context = context;
            this._computeEngine = new ComputeEngine(context);
            this._globe = undefined;
            this._primitives = new PrimitiveCollection();
            this._groundPrimitives = new PrimitiveCollection();

            this._pageLODs = new LSPageLODCollection();//新增

            this._tweens = new TweenCollection();

            this._shaderFrameCount = 0;

            this._sunPostProcess = undefined;

            this._computeCommandList = [];
            this._frustumCommandsList = [];
            this._overlayCommandList = [];

            this._pickFramebuffer = undefined;

            this._useOIT = defaultValue(options.orderIndependentTranslucency, true);
            this._executeOITFunction = undefined;


            var globeDepth;//f
            if (defined(context.depthTexture)) {
                globeDepth = new GlobeDepth()
            }

            var oit;//m
            if (defined(this._useOIT) && defined(globeDepth)) {
                oit = new OIT(context);
            }
            this._globeDepth = globeDepth;
            this._depthPlane = new DepthPlane();
            this._oit = oit;
            this._fxaa = new FXAA();

            this._clearColorCommand = new ClearCommand({
                color: new Color,
                stencil: 0,
                owner: this
            });
            this._depthClearCommand = new ClearCommand({
                depth: 1,
                owner: this
            });
            this._stencilClearCommand = new ClearCommand({stencil: 0});

            this._pickDepths = [];
            this._debugGlobeDepths = [];

            this._pickDepthPassState = undefined;
            this._pickDepthFramebuffer = undefined;
            this._pickDepthFramebufferWidth = undefined;
            this._pickDepthFramebufferHeight = undefined;
            this._depthOnlyRenderStateCache = {};

            this._transitioner = new SceneTransitioner(this);

            this._preUpdate = new Event();
            this._postUpdate = new Event();
            this._renderError = new Event();
            this._preRender = new Event();
            this._postRender = new Event();

            this._cameraStartFired = false;
            this._cameraMovedTime = undefined;

            this._pickPositionCache = {};
            this._pickPositionCacheDirty = false;

            this._minimumDisableDepthTestDistance = 0;

            this.rethrowRenderErrors = false;
            this.completeMorphOnUserInput = true;
            this.morphStart = new Event();
            this.morphComplete = new Event();
            this.skyBox = undefined;
            this.skyAtmosphere = undefined;
            this.sun = undefined;
            this.sunBloom = !0;
            this._sunBloom = undefined;
            this.moon = undefined;
            this.backgroundColor = Color.clone(Color.BLACK);
            this._mode = SceneMode.SCENE3D;
            this._mapProjection = defined(options.mapProjection) ? options.mapProjection : new GeographicProjection;
            this.morphTime = 1;
            this.farToNearRatio = 1000;
            this.nearToFarDistance2D = 175e4;
            this.debugCommandFilter = undefined;
            this.debugShowCommands = false;
            this.debugShowFrustums = false;
            this._debugFrustumStatistics = undefined;
            this.debugShowFramesPerSecond = false;
            this.debugShowGlobeDepth = false;
            this.debugShowDepthFrustum = 1;
            this.debugShowFrustumPlanes = false;
            this._debugShowFrustumPlanes = false;
            this._debugFrustumPlanes = undefined;
            this.fxaa = true;
            this.useDepthPicking = true;
            this.pickTranslucentDepth = false;
            this.cameraEventWaitTime = 500;
            this.copyGlobeDepth = false;
            this.fog = new Fog;
            this._sunCamera = new Camera(this);
            this.shadowMap = new ShadowMap({
                context: context,
                lightCamera: this._sunCamera,
                enabled: defaultValue(options.shadows, false)
            });
            this.invertClassification = false;
            this.invertClassificationColor = Color.clone(Color.WHITE);
            this._actualInvertClassificationColor = Color.clone(this._invertClassificationColor);
            this._invertClassification = new InvertClassification;

            this.focalLength = undefined;
            this.eyeSeparation = undefined;
            this._brdfLutGenerator = new BrdfLutGenerator();

            this._terrainExaggeration = defaultValue(options.terrainExaggeration, 1);
            this._performanceDisplay = undefined;
            this._debugVolume = undefined;

            var camera = new Camera(this);//g
            this._camera = camera;
            this._cameraClone = Camera.clone(camera);
            this._screenSpaceCameraController = new ScreenSpaceCameraController(this);
            this._mapMode2D = defaultValue(options.mapMode2D, MapMode2D.INFINITE_SCROLL);
            this._environmentState = {
                skyBoxCommand: undefined,
                skyAtmosphereCommand: undefined,
                sunDrawCommand: undefined,
                sunComputeCommand: undefined,
                moonCommand: undefined,
                isSunVisible: false,
                isMoonVisible: false,
                isReadyForAtmosphere: false,
                isSkyAtmosphereVisible: false,
                clearGlobeDepth: false,
                useDepthPlane: false,
                originalFramebuffer: undefined,
                useGlobeDepthFramebuffer: false,
                useOIT: false,
                useFXAA: false,
                useInvertClassification: false
            };

            //新增
            this._ellipsoidPrimitive = new EllipsoidPrimitive();
            this._ellipsoidPrimitive.center = new Cartesian3(0, 0, 0);
            this._ellipsoidPrimitive.radii = Cartesian3.multiplyByScalar(new Cartesian3(6378137, 6378137, 6356752), .9995, new Cartesian3());
            this._ellipsoidPrimitive.material.uniforms.color = new Color(0, 0, 0, 1);
            this._ellipsoidPrimitive.show = false;
            this._primitives.add(this._ellipsoidPrimitive);
            this._pitCollection = new LSPitCollection(this);
            this._waterCollection = new LSWaterCollection(this);
            this._setSurfaceTransparency = new LSSetSurfaceTransparency(this);

            this._useWebVR = false;
            this._cameraVR = undefined;
            this._aspectRatioVR = undefined;

            this._useSingleFrustum = true;//新增

            this.requestRenderMode = defaultValue(options.requestRenderMode, false);
            this._renderRequested = true;

            //新增
            this._lastFpsSampleTime = getTimestamp();
            this._fpsFrameCount = 0;

            this.maximumRenderTimeChange = defaultValue(options.maximumRenderTimeChange, 0);
            this._lastRenderTime = undefined;

            this._removeRequestListenerCallback = RequestScheduler.requestCompletedEvent.addEventListener(requestRenderAfterFrame(this));
            this._removeTaskProcessorListenerCallback = TaskProcessor.taskCompletedEvent.addEventListener(requestRenderAfterFrame(this));
            this._removeGlobeCallbacks = [];

            var near = camera.frustum.near;//y
            var far = camera.frustum.far;//b
            var numFrustums = Math.ceil(Math.log(far / near) / Math.log(this.farToNearRatio));//S
            updateFrustums(near, far, this.farToNearRatio, numFrustums, this._frustumCommandsList, false, undefined);

            updateFrameState(this, 0, JulianDate.now());//Fe

            this.initializeFrame()
        }

        var OPAQUE_FRUSTUM_NEAR_OFFSET = 0.9999;//Pt

        function updateGlobeListeners(scene, globe) {//Me
            for (var i = 0; i < scene._removeGlobeCallbacks.length; ++i) {
                scene._removeGlobeCallbacks[i]();
            }
            scene._removeGlobeCallbacks.length = 0;

            var removeGlobeCallbacks = [];
            if (defined(globe)) {
                removeGlobeCallbacks.push(globe.imageryLayersUpdatedEvent.addEventListener(requestRenderAfterFrame(e)));
                removeGlobeCallbacks.push(globe.terrainProviderChanged.addEventListener(requestRenderAfterFrame(scene)));
            }
            scene._removeGlobeCallbacks = removeGlobeCallbacks
        }

        defineProperties(Scene.prototype, {
            canvas: {
                get: function () {
                    return this._canvas
                }
            },
            drawingBufferHeight: {
                get: function () {
                    return this._context.drawingBufferHeight
                }
            },
            drawingBufferWidth: {
                get: function () {
                    return this._context.drawingBufferWidth
                }
            },
            maximumAliasedLineWidth: {
                get: function () {
                    return q.maximumAliasedLineWidth
                }
            },
            maximumCubeMapSize: {
                get: function () {
                    return q.maximumCubeMapSize
                }
            },
            pickPositionSupported: {
                get: function () {
                    return this._context.depthTexture
                }
            },
            globe: {
                get: function () {
                    return this._globe
                }, set: function (e) {
                    this._globe = this._globe && this._globe.destroy(), this._globe = e, updateGlobeListeners(this, e)
                }
            },
            primitives: {
                get: function () {
                    return this._primitives
                }
            },
            groundPrimitives: {
                get: function () {
                    return this._groundPrimitives
                }
            },
            pageLODLayers: {//新增
                get: function () {
                    return this._pageLODs
                }
            },
            camera: {
                get: function () {
                    return this._camera
                }
            },
            screenSpaceCameraController: {
                get: function () {
                    return this._screenSpaceCameraController
                }
            },
            mapProjection: {
                get: function () {
                    return this._mapProjection
                }
            },
            frameState: {
                get: function () {
                    return this._frameState
                }
            },
            tweens: {
                get: function () {
                    return this._tweens
                }
            },
            imageryLayers: {
                get: function () {
                    if (h(this.globe)) return this.globe.imageryLayers
                }
            },
            pitCollection: {//新增
                get: function () {
                    return this._pitCollection
                }
            },
            setSurfaceTransparency: {//新增
                get: function () {
                    return this._setSurfaceTransparency
                }
            },
            waterCollection: {//新增
                get: function () {
                    return this._waterCollection
                }
            },
            terrainLayers: {//修改
                get: function () {
                    return this.globe.terrainLayers
                }
            },
            terrainProviderChanged: {
                get: function () {
                    if (h(this.globe)) return this.globe.terrainProviderChanged
                }
            },
            preUpdate: {
                get: function () {
                    return this._preUpdate
                }
            },
            postUpdate: {
                get: function () {
                    return this._postUpdate
                }
            },
            renderError: {
                get: function () {
                    return this._renderError
                }
            },
            preRender: {
                get: function () {
                    return this._preRender
                }
            },
            postRender: {
                get: function () {
                    return this._postRender
                }
            },
            lastRenderTime: {
                get: function () {
                    return this._lastRenderTime
                }
            },
            context: {
                get: function () {
                    return this._context
                }
            },
            debugFrustumStatistics: {
                get: function () {
                    return this._debugFrustumStatistics
                }
            },
            scene3DOnly: {
                get: function () {
                    return this._frameState.scene3DOnly
                }
            },
            orderIndependentTranslucency: {
                get: function () {
                    return h(this._oit)
                }
            },
            id: {
                get: function () {
                    return this._id
                }
            },
            mode: {
                get: function () {
                    return this._mode
                }, set: function (e) {
                    e === we.SCENE2D ? this.morphTo2D(0) : e === we.SCENE3D ? this.morphTo3D(0) : e === we.COLUMBUS_VIEW && this.morphToColumbusView(0), this._mode = e
                }
            },
            numberOfFrustums: {
                get: function () {
                    return this._frustumCommandsList.length
                }
            },
            terrainExaggeration: {
                get: function () {
                    return this._terrainExaggeration
                }
            },
            useWebVR: {
                get: function () {
                    return this._useWebVR
                }, set: function (e) {
                    this._useWebVR = e, this._useWebVR ? (this._frameState.creditDisplay.container.style.visibility = "hidden", this._cameraVR = new ie(this), h(this._deviceOrientationCameraController) || (this._deviceOrientationCameraController = new se(this)), this._aspectRatioVR = this._camera.frustum.aspectRatio) : (this._frameState.creditDisplay.container.style.visibility = "visible", this._cameraVR = undefined, this._deviceOrientationCameraController = this._deviceOrientationCameraController && !this._deviceOrientationCameraController.isDestroyed() && this._deviceOrientationCameraController.destroy(), this._camera.frustum.aspectRatio = this._aspectRatioVR, this._camera.frustum.xOffset = 0)
                }
            },
            mapMode2D: {
                get: function () {
                    return this._mapMode2D
                }
            },
            imagerySplitPosition: {
                get: function () {
                    return this._frameState.imagerySplitPosition
                }, set: function (e) {
                    this._frameState.imagerySplitPosition = e
                }
            },
            minimumDisableDepthTestDistance: {
                get: function () {
                    return this._minimumDisableDepthTestDistance
                }, set: function (e) {
                    this._minimumDisableDepthTestDistance = e
                }
            },
            useSingleFrustum: {//新增
                get: function () {
                    return this._useSingleFrustum
                }, set: function (e) {
                    this._useSingleFrustum = e, e || (this._camera.frustum.near = 1, this._camera.frustum.far = 5e8)
                }
            }
        });

        Scene.prototype.getCompressedTextureFormatSupported = function (format) {
            var context = this.context;
            return ((format === 'WEBGL_compressed_texture_s3tc' || format === 's3tc') && context.s3tc) ||
                ((format === 'WEBGL_compressed_texture_pvrtc' || format === 'pvrtc') && context.pvrtc) ||
                ((format === 'WEBGL_compressed_texture_etc1' || format === 'etc1') && context.etc1);
        };

        var scratchPosition0 = new Cartesian3();
        var scratchPosition1 = new Cartesian3();

        function maxComponent(a, b) {//Re
            var x = Math.max(Math.abs(a.x), Math.abs(b.x));
            var y = Math.max(Math.abs(a.y), Math.abs(b.y));
            var z = Math.max(Math.abs(a.z), Math.abs(b.z));
            return Math.max(Math.max(x, y), z)
        }

        function cameraEqual(camera0, camera1, epsilon) {//Le
            var scalar = 1 / Math.max(1, maxComponent(camera0.position, camera1.position));
            Cartesian3.multiplyByScalar(camera0.position, scalar, scratchPosition0);
            Cartesian3.multiplyByScalar(camera1.position, scalar, scratchPosition1);
            return Cartesian3.equalsEpsilon(scratchPosition0, scratchPosition1, epsilon) &&
                Cartesian3.equalsEpsilon(camera0.direction, camera1.direction, epsilon) &&
                Cartesian3.equalsEpsilon(camera0.up, camera1.up, epsilon) &&
                Cartesian3.equalsEpsilon(camera0.right, camera1.right, epsilon) &&
                Matrix4.equalsEpsilon(camera0.transform, camera1.transform, epsilon);
        }

        function updateDerivedCommands(scene, command) {//Ne
            var frameState = scene.frameState;//r
            var context = scene._context;//i
            var shadowsEnabled = frameState.shadowHints.shadowsEnabled;//n
            var shadowMaps = frameState.shadowHints.shadowMaps;//o
            var lightShadowMaps = frameState.shadowHints.lightShadowMaps;//a
            var lightShadowsEnabled = shadowsEnabled && lightShadowMaps.length > 0;//s

            var shadowsDirty = false;//l
            var lastDirtyTime = frameState.shadowHints.lastDirtyTime;//u
            if (command.lastDirtyTime !== lastDirtyTime) {
                command.lastDirtyTime = lastDirtyTime;
                command.dirty = true;
                shadowsDirty = true
            }
            var derivedCommands = command.derivedCommands;//c
            if (command.dirty && defined(derivedCommands)) {
                command.dirty = false;

                if (shadowsEnabled && (command.receiveShadows || command.castShadows)) {
                    derivedCommands.shadows = ShadowMap.createDerivedCommands(shadowMaps, lightShadowMaps, command, shadowsDirty, context, derivedCommands.shadows)
                }

                var oit = scene._oit;//d
                if (command.pass === Pass.TRANSLUCENT && defined(oit) && oit.isSupported()) {
                    if (lightShadowsEnabled && command.receiveShadows) {
                        derivedCommands.oit = defined(derivedCommands.oit) ? derivedCommands.oit : {};
                        derivedCommands.oit.shadows = oit.createDerivedCommands(command.derivedCommands.shadows.receiveCommand, context, derivedCommands.oit.shadows)
                    } else {
                        derivedCommands.oit = oit.createDerivedCommands(command, context, derivedCommands.oit)
                    }
                }
                derivedCommands.depth = createDepthOnlyDerivedCommand(scene, command, context, derivedCommands.depth)
            }
        }

        var scratchOccluderBoundingSphere = new BoundingSphere();
        var scratchOccluder;

        function getOccluder(scene) {//ke
            var globe = scene.globe;
            if (scene._mode === SceneMode.SCENE3D && defined(globe)) {
                var ellipsoid = globe.ellipsoid;
                scratchOccluderBoundingSphere.radius = ellipsoid.minimumRadius;
                scratchOccluder = Occluder.fromBoundingSphere(scratchOccluderBoundingSphere, scene._camera.positionWC, scratchOccluder);
                return scratchOccluder;
            }

            return undefined;
        }

        function clearPasses(passes) {//Be
            passes.render = false;
            passes.pick = false;
            passes.depth = false;
        }

        function updateFrameState(scene, frameNumber, time) {//Fe
            var camera = scene._camera;//i

            if (scene.useSingleFrustum) {
                var o = Math.abs(camera.positionCartographic.height);
                if (defined(scene.globe)) {
                    var a = scene.globe.getHeight(camera.positionCartographic);
                    if (defined(a)) {
                        o = Math.abs(camera.positionCartographic.height - a)
                    }
                }
                var l = o / 100 * .05;
                l *= l;
                if (l > .05) {
                    l = .05;
                }
                var u = l * o;
                if (u < 1) {
                    u = 1;
                }
                camera.frustum.near = u;
                var c = Cartesian3.magnitude(camera.positionWC);
                var d = c - camera.positionCartographic.height;
                Math.sqrt(c * c - d * d);
                camera.frustum.far = 1e8
            }

            var frameState = scene._frameState;//p
            frameState.commandList.length = 0;
            frameState.shadowMaps.length = 0;
            //新增
            frameState.viewshed3ds.length = 0;
            frameState._setSurfaceTransparency = scene._setSurfaceTransparency;
            frameState.pit = scene.pit;

            frameState.brdfLutGenerator = scene._brdfLutGenerator;
            frameState.environmentMap = scene.skyBox && scene.skyBox._cubeMap;
            frameState.mode = scene._mode;
            frameState.morphTime = scene.morphTime;
            frameState.mapProjection = scene.mapProjection;
            frameState.frameNumber = frameNumber;
            frameState.time = JulianDate.clone(time, frameState.time);
            frameState.camera = camera;
            frameState.cullingVolume = camera.frustum.computeCullingVolume(camera.positionWC, camera.directionWC, camera.upWC);
            frameState.occluder = getOccluder(scene);
            frameState.terrainExaggeration = scene._terrainExaggeration;
            frameState.minimumDisableDepthTestDistance = scene._minimumDisableDepthTestDistance;
            frameState.invertClassification = scene.invertClassification;

            scene._actualInvertClassificationColor = Color.clone(scene.invertClassificationColor, scene._actualInvertClassificationColor);
            if (!InvertClassification.isTranslucencySupported(scene._context)) {
                scene._actualInvertClassificationColor.alpha = 1
            }

            frameState.invertClassificationColor = scene._actualInvertClassificationColor;

            if (defined(scene.globe)) {
                frameState.maximumScreenSpaceError = scene.globe.maximumScreenSpaceError;
            } else {
                frameState.maximumScreenSpaceError = 2;
            }

            clearPasses(frameState.passes);
        }

        function updateFrustums(near, far, farToNearRatio, numFrustums, frustumCommandsList, is2D, nearToFarDistance2D) {//Ue
            if (!isNaN(numFrustums)) {
                frustumCommandsList.length = numFrustums;
                for (var m = 0; m < numFrustums; ++m) {
                    var curNear;
                    var curFar;

                    if (!is2D) {
                        curNear = Math.max(near, Math.pow(farToNearRatio, m) * near);
                        curFar = Math.min(far, farToNearRatio * curNear);
                    } else {
                        curNear = Math.min(far - nearToFarDistance2D, near + m * nearToFarDistance2D);
                        curFar = Math.min(far, curNear + nearToFarDistance2D);
                    }

                    var frustumCommands = frustumCommandsList[m];
                    if (!defined(frustumCommands)) {
                        frustumCommands = frustumCommandsList[m] = new FrustumCommands(curNear, curFar);
                    } else {
                        frustumCommands.near = curNear;
                        frustumCommands.far = curFar;
                    }
                }
            }
        }

        function insertIntoBin(scene, command, distance) {//Ve
            if (scene.debugShowFrustums) {
                command.debugOverlappingFrustums = 0;
            }

            if (!scene.frameState.passes.pick) {
                updateDerivedCommands(scene, command);
            }

            var frustumCommandsList = scene._frustumCommandsList;
            var length = frustumCommandsList.length;

            for (var i = 0; i < length; ++i) {
                var frustumCommands = frustumCommandsList[i];
                var curNear = frustumCommands.near;
                var curFar = frustumCommands.far;

                if (distance.start > curFar) {
                    continue;
                }

                if (distance.stop < curNear) {
                    break;
                }

                var pass = command.pass;
                var index = frustumCommands.indices[pass]++;
                frustumCommands.commands[pass][index] = command;

                if (scene.debugShowFrustums) {
                    command.debugOverlappingFrustums |= (1 << i);
                }

                if (command.executeInClosestFrustum) {
                    break;
                }
            }

            if (scene.debugShowFrustums) {
                var cf = scene._debugFrustumStatistics.commandsInFrustums;
                cf[command.debugOverlappingFrustums] = defined(cf[command.debugOverlappingFrustums]) ? cf[command.debugOverlappingFrustums] + 1 : 1;
                ++scene._debugFrustumStatistics.totalCommands;
            }
        }

        var scratchCullingVolume = new CullingVolume();
        var distances = new Interval();

        function isVisible(command, cullingVolume, occluder) {//ze
            return ((defined(command)) &&
                ((!defined(command.boundingVolume)) ||
                    !command.cull ||
                    ((cullingVolume.computeVisibility(command.boundingVolume) !== Intersect.OUTSIDE) &&
                        (!defined(occluder) || !command.boundingVolume.isOccluded(occluder)))));
        }

        function createPotentiallyVisibleSet(scene) {//Ge
            var frameState = e._frameState;//t
            var camera = frameState.camera; //r
            var direction = camera.directionWC;//i
            var position = camera.positionWC;//n

            var computeList = scene._computeCommandList;//o
            var overlayList = scene._overlayCommandList;//a
            var commandList = frameState.commandList;//s

            if (scene.debugShowFrustums) {
                scene._debugFrustumStatistics = {
                    totalCommands: 0,
                    commandsInFrustums: {}
                };
            }

            var frustumCommandsList = scene._frustumCommandsList;
            var numberOfFrustums = frustumCommandsList.length;
            var numberOfPasses = Pass.NUMBER_OF_PASSES;
            for (var n = 0; n < numberOfFrustums; ++n) {
                for (var p = 0; p < numberOfPasses; ++p) {
                    frustumCommandsList[n].indices[p] = 0;
                }
            }

            computeList.length = 0;
            overlayList.length = 0;

            var near = Number.MAX_VALUE;
            var far = -Number.MAX_VALUE;
            var undefBV = false;//g

            var shadowsEnabled = frameState.shadowHints.shadowsEnabled;
            var shadowNear = Number.MAX_VALUE;
            var shadowFar = -Number.MAX_VALUE;
            var shadowClosestObjectSize = Number.MAX_VALUE;

            var occluder = (frameState.mode === SceneMode.SCENE3D) ? frameState.occluder : undefined;
            var cullingVolume = frameState.cullingVolume;

            // get user culling volume minus the far plane.
            var planes = scratchCullingVolume.planes;
            for (var k = 0; k < 5; ++k) {
                planes[k] = cullingVolume.planes[k];
            }
            cullingVolume = scratchCullingVolume;

            var length = commandList.length;
            for (var i = 0; i < length; ++i) {
                var command = commandList[i];
                var pass = command.pass;

                if (pass === Pass.COMPUTE) {
                    computeList.push(command);
                } else if (pass === Pass.OVERLAY) {
                    overlayList.push(command);
                } else {
                    var boundingVolume = command.boundingVolume;
                    if (defined(boundingVolume)) {
                        if (!isVisible(command, cullingVolume, occluder)) {
                            continue;
                        }

                        distances = boundingVolume.computePlaneDistances(position, direction, distances);
                        near = Math.min(near, distances.start);
                        far = Math.max(far, distances.stop);

                        // Compute a tight near and far plane for commands that receive shadows. This helps compute
                        // good splits for cascaded shadow maps. Ignore commands that exceed the maximum distance.
                        // When moving the camera low LOD globe tiles begin to load, whose bounding volumes
                        // throw off the near/far fitting for the shadow map. Only update for globe tiles that the
                        // camera isn't inside.
                        if (shadowsEnabled && command.receiveShadows && (distances.start < ShadowMap.MAXIMUM_DISTANCE) &&
                            !((pass === Pass.GLOBE) && (distances.start < -100.0) && (distances.stop > 100.0))) {

                            // Get the smallest bounding volume the camera is near. This is used to place more shadow detail near the object.
                            var size = distances.stop - distances.start;
                            if ((pass !== Pass.GLOBE) && (distances.start < 100.0)) {
                                shadowClosestObjectSize = Math.min(shadowClosestObjectSize, size);
                            }
                            shadowNear = Math.min(shadowNear, distances.start);
                            shadowFar = Math.max(shadowFar, distances.stop);
                        }
                    } else {
                        // Clear commands don't need a bounding volume - just add the clear to all frustums.
                        // If another command has no bounding volume, though, we need to use the camera's
                        // worst-case near and far planes to avoid clipping something important.
                        distances.start = camera.frustum.near;
                        distances.stop = camera.frustum.far;
                        undefBV = !(command instanceof ClearCommand);
                    }

                    insertIntoBin(scene, command, distances);
                }
            }

            if (undefBV) {//g
                near = camera.frustum.near;
                far = camera.frustum.far;
            } else {
                if (isNaN(camera.frustum.far)) {
                    camera.frustum.far = 1e9
                }
                near = Math.min(Math.max(near, camera.frustum.near), camera.frustum.far);
                far = Math.max(Math.min(far, camera.frustum.far), near);

                if (shadowsEnabled) {
                    shadowNear = Math.min(Math.max(shadowNear, camera.frustum.near), camera.frustum.far);
                    shadowFar = Math.max(Math.min(shadowFar, camera.frustum.far), shadowNear);
                }
            }

            if (shadowsEnabled) {
                frameState.shadowHints.nearPlane = shadowNear;
                frameState.shadowHints.farPlane = shadowFar;
                frameState.shadowHints.closestObjectSize = shadowClosestObjectSize;
            }

            var is2D = scene.mode === SceneMode.SCENE2D;
            var farToNearRatio = scene.farToNearRatio;//R

            if (scene.useSingleFrustum) {
                farToNearRatio = Number.MAX_VALUE;
            }

            var numFrustums;//L
            if (!is2D) {
                numFrustums = Math.ceil(Math.log(far / near) / Math.log(farToNearRatio));
            } else {
                far = Math.min(far, camera.position.z + scene.nearToFarDistance2D);
                near = Math.min(near, far);
                numFrustums = Math.ceil(Math.max(1.0, far - near) / scene.nearToFarDistance2D);
            }

            if (near !== Number.MAX_VALUE && (numFrustums !== numberOfFrustums || (frustumCommandsList.length !== 0 &&
                (near < frustumCommandsList[0].near || (far > frustumCommandsList[numberOfFrustums - 1].far && !CesiumMath.equalsEpsilon(far, frustumCommandsList[numberOfFrustums - 1].far, CesiumMath.EPSILON8)))))) {
                updateFrustums(near, far, farToNearRatio, numFrustums, frustumCommandsList, is2D, scene.nearToFarDistance2D);
                createPotentiallyVisibleSet(scene);
            }

            var frustumSplits = frameState.frustumSplits;
            frustumSplits.length = numFrustums + 1;
            for (var j = 0; j < numFrustums; ++j) {
                frustumSplits[j] = frustumCommandsList[j].near;
                if (j === numFrustums - 1) {
                    frustumSplits[j + 1] = frustumCommandsList[j].far;
                }
            }
        }

        function getAttributeLocations(shaderProgram) {//He
            var attributeLocations = {};
            var attributes = shaderProgram.vertexAttributes;
            for (var a in attributes) {
                if (attributes.hasOwnProperty(a)) {
                    attributeLocations[a] = attributes[a].index;
                }
            }

            return attributeLocations;
        }

        function createDebugFragmentShaderProgram(command, scene, shaderProgram) {//We
            var context = scene.context;
            var sp = defaultValue(shaderProgram, command.shaderProgram);
            var fs = sp.fragmentShaderSource.clone();

            var targets = [];
            fs.sources = fs.sources.map(function (source) {
                source = ShaderSource.replaceMain(source, 'czm_Debug_main');
                var re = /gl_FragData\[(\d+)\]/g;
                var match;
                while ((match = re.exec(source)) !== null) {
                    if (targets.indexOf(match[1]) === -1) {
                        targets.push(match[1]);
                    }
                }
                return source;
            });
            var length = targets.length;

            var newMain =
                'void main() \n' +
                '{ \n' +
                '    czm_Debug_main(); \n';

            var i;
            if (scene.debugShowCommands) {
                if (!defined(command._debugColor)) {
                    command._debugColor = Color.fromRandom();
                }
                var c = command._debugColor;
                if (length > 0) {
                    for (i = 0; i < length; ++i) {
                        newMain += '    gl_FragData[' + targets[i] + '].rgb *= vec3(' + c.red + ', ' + c.green + ', ' + c.blue + '); \n';
                    }
                } else {
                    newMain += '    ' + 'gl_FragColor' + '.rgb *= vec3(' + c.red + ', ' + c.green + ', ' + c.blue + '); \n';
                }
            }

            if (scene.debugShowFrustums) {
                // Support up to three frustums.  If a command overlaps all
                // three, it's code is not changed.
                var r = (command.debugOverlappingFrustums & (1 << 0)) ? '1.0' : '0.0';
                var g = (command.debugOverlappingFrustums & (1 << 1)) ? '1.0' : '0.0';
                var b = (command.debugOverlappingFrustums & (1 << 2)) ? '1.0' : '0.0';
                if (length > 0) {
                    for (i = 0; i < length; ++i) {
                        newMain += '    gl_FragData[' + targets[i] + '].rgb *= vec3(' + r + ', ' + g + ', ' + b + '); \n';
                    }
                } else {
                    newMain += '    ' + 'gl_FragColor' + '.rgb *= vec3(' + r + ', ' + g + ', ' + b + '); \n';
                }
            }

            newMain += '}';

            fs.sources.push(newMain);

            var attributeLocations = getAttributeLocations(sp);

            return ShaderProgram.fromCache({
                context: context,
                vertexShaderSource: sp.vertexShaderSource,
                fragmentShaderSource: fs,
                attributeLocations: attributeLocations
            });
        }

        function executeDebugCommand(e, t, r) {//je
            var debugCommand = DrawCommand.shallowClone(command);
            debugCommand.shaderProgram = createDebugFragmentShaderProgram(command, scene);
            debugCommand.execute(scene.context, passState);
            debugCommand.shaderProgram.destroy();
        }

        var transformFrom2D = new Matrix4(0.0, 0.0, 1.0, 0.0,
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        transformFrom2D = Matrix4.inverseTransformation(transformFrom2D, transformFrom2D);

        function executeCommand(command, scene, context, passState, debugFramebuffer) {//qe
            if ((defined(scene.debugCommandFilter)) && !scene.debugCommandFilter(command)) {
                return;
            }

            if (command instanceof ClearCommand) {
                command.execute(context, passState);
                return;
            }

            var shadowsEnabled = scene.frameState.shadowHints.shadowsEnabled;
            var lightShadowsEnabled = shadowsEnabled && (scene.frameState.shadowHints.lightShadowMaps.length > 0);

            if (scene.debugShowCommands || scene.debugShowFrustums) {
                executeDebugCommand(command, scene, passState);
            } else if (lightShadowsEnabled && command.receiveShadows && defined(command.derivedCommands.shadows)) {
                // If the command receives shadows, execute the derived shadows command.
                // Some commands, such as OIT derived commands, do not have derived shadow commands themselves
                // and instead shadowing is built-in. In this case execute the command regularly below.
                command.derivedCommands.shadows.receiveCommand.execute(context, passState);
            } else if (scene.frameState.passes.depth && defined(command.derivedCommands.depth)) {
                command.derivedCommands.depth.depthOnlyCommand.execute(context, passState);
            } else {
                command.execute(context, passState);
            }

            if (command.debugShowBoundingVolume && (defined(command.boundingVolume))) {
                // Debug code to draw bounding volume for command.  Not optimized!
                // Assumes bounding volume is a bounding sphere or box
                var frameState = scene._frameState;
                var boundingVolume = command.boundingVolume;

                if (defined(scene._debugVolume)) {
                    scene._debugVolume.destroy();
                }

                var geometry;

                var center = Cartesian3.clone(boundingVolume.center);
                if (frameState.mode !== SceneMode.SCENE3D) {
                    center = Matrix4.multiplyByPoint(transformFrom2D, center, center);
                    var projection = frameState.mapProjection;
                    var centerCartographic = projection.unproject(center);
                    center = projection.ellipsoid.cartographicToCartesian(centerCartographic);
                }

                if (defined(boundingVolume.radius)) {
                    var radius = boundingVolume.radius;

                    geometry = GeometryPipeline.toWireframe(EllipsoidGeometry.createGeometry(new EllipsoidGeometry({
                        radii: new Cartesian3(radius, radius, radius),
                        vertexFormat: PerInstanceColorAppearance.FLAT_VERTEX_FORMAT
                    })));

                    scene._debugVolume = new Primitive({
                        geometryInstances: new GeometryInstance({
                            geometry: geometry,
                            modelMatrix: Matrix4.fromTranslation(center),
                            attributes: {
                                color: new ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 1.0)
                            }
                        }),
                        appearance: new PerInstanceColorAppearance({
                            flat: true,
                            translucent: false
                        }),
                        asynchronous: false
                    });
                } else {
                    var halfAxes = boundingVolume.halfAxes;

                    geometry = GeometryPipeline.toWireframe(BoxGeometry.createGeometry(BoxGeometry.fromDimensions({
                        dimensions: new Cartesian3(2.0, 2.0, 2.0),
                        vertexFormat: PerInstanceColorAppearance.FLAT_VERTEX_FORMAT
                    })));

                    scene._debugVolume = new Primitive({
                        geometryInstances: new GeometryInstance({
                            geometry: geometry,
                            modelMatrix: Matrix4.fromRotationTranslation(halfAxes, center, new Matrix4()),
                            attributes: {
                                color: new ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 1.0)
                            }
                        }),
                        appearance: new PerInstanceColorAppearance({
                            flat: true,
                            translucent: false
                        }),
                        asynchronous: false
                    });
                }

                var savedCommandList = frameState.commandList;
                var commandList = frameState.commandList = [];
                scene._debugVolume.update(frameState);

                var framebuffer;
                if (defined(debugFramebuffer)) {
                    framebuffer = passState.framebuffer;
                    passState.framebuffer = debugFramebuffer;
                }

                commandList[0].execute(context, passState);

                if (defined(framebuffer)) {
                    passState.framebuffer = framebuffer;
                }

                frameState.commandList = savedCommandList;
            }
        }

        function translucentCompare(a, b, position) {//Ye
            return b.boundingVolume.distanceSquaredTo(position) - a.boundingVolume.distanceSquaredTo(position);
        }

        function executeTranslucentCommandsSorted(scene, executeFunction, passState, commands, invertClassification) {//Xe
            var context = scene.context;

            mergeSort(commands, translucentCompare, scene._camera.positionWC);

            if (defined(invertClassification)) {
                executeFunction(invertClassification.unclassifiedCommand, scene, context, passState);
            }

            var length = commands.length;
            for (var j = 0; j < length; ++j) {
                executeFunction(commands[j], scene, context, passState);
            }
        }

        function getDebugGlobeDepth(scene, index) {//Qe
            var globeDepth = scene._debugGlobeDepths[index];
            if (!defined(globeDepth) && scene.context.depthTexture) {
                globeDepth = new GlobeDepth();
                scene._debugGlobeDepths[index] = globeDepth;
            }
            return globeDepth;
        }

        function getPickDepth(scene, index) {//Ze
            var pickDepth = scene._pickDepths[index];
            if (!defined(pickDepth)) {
                pickDepth = new PickDepth();
                scene._pickDepths[index] = pickDepth;
            }
            return pickDepth;
        }

        var scratchPerspectiveFrustum = new PerspectiveFrustum();
        var scratchPerspectiveOffCenterFrustum = new PerspectiveOffCenterFrustum();
        var scratchOrthographicFrustum = new OrthographicFrustum();
        var scratchOrthographicOffCenterFrustum = new OrthographicOffCenterFrustum();

        function executeCommands(scene, passState) {//Ke
            var camera = scene._camera;//r
            var context = scene.context;//i
            var us = context.uniformState;//n

            us.updateCamera(camera);

            var frustum;//o
            if (defined(camera.frustum.fov)) {
                frustum = camera.frustum.clone(scratchPerspectiveFrustum);
            } else if (defined(camera.frustum.infiniteProjectionMatrix)) {
                frustum = camera.frustum.clone(scratchPerspectiveOffCenterFrustum);
            } else if (defined(camera.frustum.width)) {
                frustum = camera.frustum.clone(scratchOrthographicFrustum);
            } else {
                frustum = camera.frustum.clone(scratchOrthographicOffCenterFrustum);
            }

            frustum.near = 1;//camera.frustum.near;//不同
            frustum.far = 5e8;//camera.frustum.far;//不同
            us.updateFrustum(frustum);
            us.updatePass(Pass.ENVIRONMENT);

            var useWebVR = scene._useWebVR && scene.mode !== SceneMode.SCENE2D;
            var passes = scene._frameState.passes;
            var picking = passes.pick;
            var depthOnly = passes.depth;
            var environmentState = scene._environmentState;

            if (!picking) {
                var skyBoxCommand = environmentState.skyBoxCommand;
                if (defined(skyBoxCommand)) {
                    executeCommand(skyBoxCommand, scene, context, passState);
                }

                if (environmentState.isSkyAtmosphereVisible) {
                    executeCommand(environmentState.skyAtmosphereCommand, scene, context, passState);
                }

                if (environmentState.isSunVisible) {
                    environmentState.sunDrawCommand.execute(context, passState);
                    if (scene.sunBloom && !useWebVR) {
                        var framebuffer;
                        if (environmentState.useGlobeDepthFramebuffer) {
                            framebuffer = scene._globeDepth.framebuffer;
                        } else if (environmentState.useFXAA) {
                            framebuffer = scene._fxaa.getColorFramebuffer();
                        } else {
                            framebuffer = environmentState.originalFramebuffer;
                        }
                        scene._sunPostProcess.execute(context, framebuffer);
                        passState.framebuffer = framebuffer;
                    }
                }

                if (environmentState.isMoonVisible) {
                    environmentState.moonCommand.execute(context, passState);
                }
            }

            var executeTranslucentCommands;
            if (environmentState.useOIT) {
                if (!defined(scene._executeOITFunction)) {
                    scene._executeOITFunction = function (scene, executeFunction, passState, commands, invertClassification) {
                        scene._oit.executeCommands(scene, executeFunction, passState, commands, invertClassification);
                    };
                }
                executeTranslucentCommands = scene._executeOITFunction;
            } else {
                executeTranslucentCommands = executeTranslucentCommandsSorted;
            }


            var clearGlobeDepth = environmentState.clearGlobeDepth;//_
            var useDepthPlane = environmentState.useDepthPlane;//v
            var clearDepth = scene._depthClearCommand;//y
            var depthPlane = scene._depthPlane;//b

            var height2D = camera.position.z;//C

            // Execute commands in each frustum in back to front order
            var j;
            var frustumCommandsList = scene._frustumCommandsList;//S
            var numFrustums = frustumCommandsList.length;//w

            camera.workingFrustums.length = 0;//新增

            for (var i = 0; i < numFrustums; ++i) {//T
                var index = numFrustums - i - 1;//x
                var frustumCommands = frustumCommandsList[index];//E

                if (scene.mode === SceneMode.SCENE2D) {
                    // To avoid z-fighting in 2D, move the camera to just before the frustum
                    // and scale the frustum depth to be in [1.0, nearToFarDistance2D].
                    camera.position.z = height2D - frustumCommands.near + 1.0;
                    frustum.far = Math.max(1.0, frustumCommands.far - frustumCommands.near);
                    frustum.near = 1.0;
                    us.update(scene.frameState);
                    us.updateFrustum(frustum);
                } else {
                    // Avoid tearing artifacts between adjacent frustums in the opaque passes
                    frustum.near = index !== 0 ? frustumCommands.near * OPAQUE_FRUSTUM_NEAR_OFFSET : frustumCommands.near;
                    frustum.far = frustumCommands.far;
                    us.updateFrustum(frustum);
                }

                camera.workingFrustums[index] = frustum.clone();//新增

                var globeDepth = scene.debugShowGlobeDepth ? getDebugGlobeDepth(scene, index) : scene._globeDepth;

                var fb;
                if (scene.debugShowGlobeDepth && defined(globeDepth) && environmentState.useGlobeDepthFramebuffer) {
                    globeDepth.update(context, passState);
                    globeDepth.clear(context, passState, scene._clearColorCommand.color);
                    fb = passState.framebuffer;
                    passState.framebuffer = globeDepth.framebuffer;
                }

                clearDepth.execute(context, passState);
                scene._stencilClearCommand.execute(context, passState);

                var D = Cartographic.fromCartesian(scene._camera.position).height;
                if (0 === scene._setSurfaceTransparency._enabled || D >= 1e4) {
                    scene._ellipsoidPrimitive.show = false;

                    us.updatePass(Pass.GLOBE);
                    var commands = frustumCommands.commands[Pass.GLOBE];
                    var length = frustumCommands.indices[Pass.GLOBE];
                    for (j = 0; j < length; ++j) {
                        executeCommand(commands[j], scene, context, passState);
                    }

                    if (defined(globeDepth) && environmentState.useGlobeDepthFramebuffer && (scene.copyGlobeDepth || scene.debugShowGlobeDepth)) {
                        globeDepth.update(context, passState);
                        globeDepth.executeCopyDepth(context, passState);
                    }

                    if (scene.debugShowGlobeDepth && defined(globeDepth) && environmentState.useGlobeDepthFramebuffer) {
                        passState.framebuffer = fb;
                    }
                }

                us.updatePass(Pass.TERRAIN_CLASSIFICATION);
                commands = frustumCommands.commands[Pass.TERRAIN_CLASSIFICATION];
                length = frustumCommands.indices[Pass.TERRAIN_CLASSIFICATION];
                for (j = 0; j < length; ++j) {
                    executeCommand(commands[j], scene, context, passState);
                }

                us.updatePass(Pass.CLASSIFICATION);
                commands = frustumCommands.commands[Pass.CLASSIFICATION];
                length = frustumCommands.indices[Pass.CLASSIFICATION];
                for (j = 0; j < length; ++j) {
                    executeCommand(commands[j], scene, context, passState);
                }

                if (clearGlobeDepth) {
                    clearDepth.execute(context, passState);
                }

                if (!environmentState.useInvertClassification || picking) {
                    // Common/fastest path. Draw 3D Tiles and classification normally.

                    // Draw 3D Tiles
                    us.updatePass(Pass.CESIUM_3D_TILE);
                    commands = frustumCommands.commands[Pass.CESIUM_3D_TILE];
                    length = frustumCommands.indices[Pass.CESIUM_3D_TILE];
                    for (j = 0; j < length; ++j) {
                        executeCommand(commands[j], scene, context, passState);
                    }

                    // Draw classifications. Modifies 3D Tiles color.
                    us.updatePass(Pass.CESIUM_3D_TILE_CLASSIFICATION);
                    commands = frustumCommands.commands[Pass.CESIUM_3D_TILE_CLASSIFICATION];
                    length = frustumCommands.indices[Pass.CESIUM_3D_TILE_CLASSIFICATION];
                    for (j = 0; j < length; ++j) {
                        executeCommand(commands[j], scene, context, passState);
                    }

                    // Draw classification marked for both terrain and 3D Tiles classification
                    us.updatePass(Pass.CLASSIFICATION);
                    commands = frustumCommands.commands[Pass.CLASSIFICATION];
                    length = frustumCommands.indices[Pass.CLASSIFICATION];
                    for (j = 0; j < length; ++j) {
                        executeCommand(commands[j], scene, context, passState);
                    }
                } else {
                    // When the invert classification color is opaque:
                    //    Main FBO (FBO1):                   Main_Color   + Main_DepthStencil
                    //    Invert classification FBO (FBO2) : Invert_Color + Main_DepthStencil
                    //
                    //    1. Clear FBO2 color to vec4(0.0) for each frustum
                    //    2. Draw 3D Tiles to FBO2
                    //    3. Draw classification to FBO2
                    //    4. Fullscreen pass to FBO1, draw Invert_Color when:
                    //           * Main_DepthStencil has the stencil bit set > 0 (classified)
                    //    5. Fullscreen pass to FBO1, draw Invert_Color * czm_invertClassificationColor when:
                    //           * Main_DepthStencil has stencil bit set to 0 (unclassified) and
                    //           * Invert_Color !== vec4(0.0)
                    //
                    // When the invert classification color is translucent:
                    //    Main FBO (FBO1):                  Main_Color         + Main_DepthStencil
                    //    Invert classification FBO (FBO2): Invert_Color       + Invert_DepthStencil
                    //    IsClassified FBO (FBO3):          IsClassified_Color + Invert_DepthStencil
                    //
                    //    1. Clear FBO2 and FBO3 color to vec4(0.0), stencil to 0, and depth to 1.0
                    //    2. Draw 3D Tiles to FBO2
                    //    3. Draw classification to FBO2
                    //    4. Fullscreen pass to FBO3, draw any color when
                    //           * Invert_DepthStencil has the stencil bit set > 0 (classified)
                    //    5. Fullscreen pass to FBO1, draw Invert_Color when:
                    //           * Invert_Color !== vec4(0.0) and
                    //           * IsClassified_Color !== vec4(0.0)
                    //    6. Fullscreen pass to FBO1, draw Invert_Color * czm_invertClassificationColor when:
                    //           * Invert_Color !== vec4(0.0) and
                    //           * IsClassified_Color === vec4(0.0)
                    //
                    // NOTE: Step six when translucent invert color occurs after the TRANSLUCENT pass
                    //
                    scene._invertClassification.clear(context, passState);

                    var opaqueClassificationFramebuffer = passState.framebuffer;
                    passState.framebuffer = scene._invertClassification._fbo;

                    // Draw normally
                    us.updatePass(Pass.CESIUM_3D_TILE);
                    commands = frustumCommands.commands[Pass.CESIUM_3D_TILE];
                    length = frustumCommands.indices[Pass.CESIUM_3D_TILE];
                    for (j = 0; j < length; ++j) {
                        executeCommand(commands[j], scene, context, passState);
                    }

                    // Set stencil
                    us.updatePass(Pass.CESIUM_3D_TILE_CLASSIFICATION_IGNORE_SHOW);
                    commands = frustumCommands.commands[Pass.CESIUM_3D_TILE_CLASSIFICATION_IGNORE_SHOW];
                    length = frustumCommands.indices[Pass.CESIUM_3D_TILE_CLASSIFICATION_IGNORE_SHOW];
                    for (j = 0; j < length; ++j) {
                        executeCommand(commands[j], scene, context, passState);
                    }

                    passState.framebuffer = opaqueClassificationFramebuffer;

                    // Fullscreen pass to copy classified fragments
                    scene._invertClassification.executeClassified(context, passState);
                    if (scene.frameState.invertClassificationColor.alpha === 1.0) {
                        // Fullscreen pass to copy unclassified fragments when alpha == 1.0
                        scene._invertClassification.executeUnclassified(context, passState);
                    }

                    // Clear stencil set by the classification for the next classification pass
                    if (length > 0 && context.stencilBuffer) {
                        scene._stencilClearCommand.execute(context, passState);
                    }

                    // Draw style over classification.
                    us.updatePass(Pass.CESIUM_3D_TILE_CLASSIFICATION);
                    commands = frustumCommands.commands[Pass.CESIUM_3D_TILE_CLASSIFICATION];
                    length = frustumCommands.indices[Pass.CESIUM_3D_TILE_CLASSIFICATION];
                    for (j = 0; j < length; ++j) {
                        executeCommand(commands[j], scene, context, passState);
                    }

                    // Draw style over classification marked for both terrain and 3D Tiles classification
                    us.updatePass(Pass.CLASSIFICATION);
                    commands = frustumCommands.commands[Pass.CLASSIFICATION];
                    length = frustumCommands.indices[Pass.CLASSIFICATION];
                    for (j = 0; j < length; ++j) {
                        executeCommand(commands[j], scene, context, passState);
                    }
                }

                if (length > 0 && context.stencilBuffer) {
                    scene._stencilClearCommand.execute(context, passState);
                }

                if (clearGlobeDepth && useDepthPlane) {
                    depthPlane.execute(context, passState);
                }

                us.updatePass(Pass.OPAQUE);
                commands = frustumCommands.commands[Pass.OPAQUE];
                length = frustumCommands.indices[Pass.OPAQUE];
                for (j = 0; j < length; ++j) {
                    executeCommand(commands[j], scene, context, passState);
                }

                if (index !== 0 && scene.mode !== SceneMode.SCENE2D) {
                    // Do not overlap frustums in the translucent pass to avoid blending artifacts
                    frustum.near = frustumCommands.near;
                    us.updateFrustum(frustum);
                }

                var invertClassification;
                if (!picking && environmentState.useInvertClassification && scene.frameState.invertClassificationColor.alpha < 1.0) {
                    // Fullscreen pass to copy unclassified fragments when alpha < 1.0.
                    // Not executed when undefined.
                    invertClassification = scene._invertClassification;
                }

                us.updatePass(Pass.TRANSLUCENT);
                commands = frustumCommands.commands[Pass.TRANSLUCENT];
                commands.length = frustumCommands.indices[Pass.TRANSLUCENT];
                executeTranslucentCommands(scene, executeCommand, passState, commands, invertClassification);

                if (defined(globeDepth) && (environmentState.useGlobeDepthFramebuffer || depthOnly) && scene.useDepthPicking) {
                    // PERFORMANCE_IDEA: Use MRT to avoid the extra copy.
                    var depthStencilTexture = depthOnly ? passState.framebuffer.depthStencilTexture : globeDepth.framebuffer.depthStencilTexture;
                    var pickDepth = getPickDepth(scene, index);
                    pickDepth.update(context, depthStencilTexture);
                    pickDepth.executeCopyDepth(context, passState);
                }
            }

            //新增
            scene._stencilClearCommand.execute(context, passState);
            if (scene.frameState.passes.render) {
                Je(scene, passState);
            }
        }

        function Je(e, t) {
            for (var r = e.context, i = e._frameState, n = i.viewshed3ds, o = e._waterCollection._water, a = o.length, s = 0; s < a; ++s) o[s].updateReflectTexture(e);
            for (var s = 0; s < a; ++s) o[s].execute(r, t);
            for (var l = n.length, s = 0; s < l; ++s) n[s].updateDepthMap(e);
            for (var s = 0; s < l; ++s) n[s].execute(r, t)
        }

        function executeComputeCommands(scene) {//$e
            var us = scene.context.uniformState;
            us.updatePass(Pass.COMPUTE);

            var sunComputeCommand = scene._environmentState.sunComputeCommand;
            if (defined(sunComputeCommand)) {
                sunComputeCommand.execute(scene._computeEngine);
            }

            var commandList = scene._computeCommandList;
            var length = commandList.length;
            for (var i = 0; i < length; ++i) {
                commandList[i].execute(scene._computeEngine);
            }
        }

        function executeOverlayCommands(scene, passState) {//et
            var us = scene.context.uniformState;
            us.updatePass(Pass.OVERLAY);

            var context = scene.context;
            var commandList = scene._overlayCommandList;
            var length = commandList.length;
            for (var i = 0; i < length; ++i) {
                commandList[i].execute(context, passState);
            }
        }

        function insertShadowCastCommands(scene, commandList, shadowMap) {//tt
            var shadowVolume = shadowMap.shadowMapCullingVolume;
            var isPointLight = shadowMap.isPointLight;
            var passes = shadowMap.passes;
            var numberOfPasses = passes.length;

            var length = commandList.length;
            for (var i = 0; i < length; ++i) {
                var command = commandList[i];
                updateDerivedCommands(scene, command);

                if (command.castShadows && (command.pass === Pass.GLOBE || command.pass === Pass.CESIUM_3D_TILE || command.pass === Pass.OPAQUE || command.pass === Pass.TRANSLUCENT)) {
                    if (isVisible(command, shadowVolume)) {
                        if (isPointLight) {
                            for (var k = 0; k < numberOfPasses; ++k) {
                                passes[k].commandList.push(command);
                            }
                        } else if (numberOfPasses === 1) {
                            passes[0].commandList.push(command);
                        } else {
                            var wasVisible = false;
                            // Loop over cascades from largest to smallest
                            for (var j = numberOfPasses - 1; j >= 0; --j) {
                                var cascadeVolume = passes[j].cullingVolume;
                                if (isVisible(command, cascadeVolume)) {
                                    passes[j].commandList.push(command);
                                    wasVisible = true;
                                } else if (wasVisible) {
                                    // If it was visible in the previous cascade but now isn't
                                    // then there is no need to check any more cascades
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        function executeShadowMapCastCommands(scene) {//rt
            var frameState = scene.frameState;
            var shadowMaps = frameState.shadowHints.shadowMaps;
            var shadowMapLength = shadowMaps.length;

            if (!frameState.shadowHints.shadowsEnabled) {
                return;
            }

            var context = scene.context;
            var uniformState = context.uniformState;

            for (var i = 0; i < shadowMapLength; ++i) {
                var shadowMap = shadowMaps[i];
                if (shadowMap.outOfView) {
                    continue;
                }

                // Reset the command lists
                var j;
                var passes = shadowMap.passes;
                var numberOfPasses = passes.length;
                for (j = 0; j < numberOfPasses; ++j) {
                    passes[j].commandList.length = 0;
                }

                // Insert the primitive/model commands into the command lists
                var sceneCommands = scene.frameState.commandList;
                insertShadowCastCommands(scene, sceneCommands, shadowMap);

                for (j = 0; j < numberOfPasses; ++j) {
                    var pass = shadowMap.passes[j];
                    uniformState.updateCamera(pass.camera);
                    shadowMap.updatePass(context, j);
                    var numberOfCommands = pass.commandList.length;
                    for (var k = 0; k < numberOfCommands; ++k) {
                        var command = pass.commandList[k];
                        // Set the correct pass before rendering into the shadow map because some shaders
                        // conditionally render based on whether the pass is translucent or opaque.
                        uniformState.updatePass(command.pass);
                        executeCommand(command.derivedCommands.shadows.castCommands[i], scene, context, pass.passState);
                    }
                }
            }
        }

        var scratchEyeTranslation = new Cartesian3();

        function updateAndExecuteCommands(scene, passState, backgroundColor) {//it
            var context = scene._context;

            var viewport = passState.viewport;
            viewport.x = 0;
            viewport.y = 0;
            viewport.width = context.drawingBufferWidth;
            viewport.height = context.drawingBufferHeight;

            var frameState = scene._frameState;
            var camera = frameState.camera;
            var mode = frameState.mode;
            var depthOnly = frameState.passes.depth;

            if (scene._useWebVR && mode !== SceneMode.SCENE2D) {
                updateAndClearFramebuffers(scene, passState, backgroundColor);

                if (!depthOnly) {
                    updateAndRenderPrimitives(scene);
                }

                createPotentiallyVisibleSet(scene);

                if (!depthOnly) {
                    executeComputeCommands(scene);
                    executeShadowMapCastCommands(scene);
                }

                // Based on Calculating Stereo pairs by Paul Bourke
                // http://paulbourke.net/stereographics/stereorender/

                viewport.x = 0;
                viewport.y = 0;
                viewport.width = context.drawingBufferWidth * 0.5;
                viewport.height = context.drawingBufferHeight;

                var savedCamera = Camera.clone(camera, scene._cameraVR);

                var near = camera.frustum.near;
                var fo = near * defaultValue(scene.focalLength, 5.0);
                var eyeSeparation = defaultValue(scene.eyeSeparation, fo / 30.0);
                var eyeTranslation = Cartesian3.multiplyByScalar(savedCamera.right, eyeSeparation * 0.5, scratchEyeTranslation);

                camera.frustum.aspectRatio = viewport.width / viewport.height;

                var offset = 0.5 * eyeSeparation * near / fo;

                Cartesian3.add(savedCamera.position, eyeTranslation, camera.position);
                camera.frustum.xOffset = offset;

                executeCommands(scene, passState);

                viewport.x = passState.viewport.width;

                Cartesian3.subtract(savedCamera.position, eyeTranslation, camera.position);
                camera.frustum.xOffset = -offset;

                executeCommands(scene, passState);

                Camera.clone(savedCamera, camera);
            } else if (mode !== SceneMode.SCENE2D || scene._mapMode2D === MapMode2D.ROTATE) {
                executeCommandsInViewport(true, scene, passState, backgroundColor);
            } else {
                updateAndClearFramebuffers(scene, passState, backgroundColor);
                execute2DViewportCommands(scene, passState);
            }
        }

        var scratch2DViewportCartographic = new Cartographic(Math.PI, CesiumMath.PI_OVER_TWO);
        var scratch2DViewportMaxCoord = new Cartesian3();
        var scratch2DViewportSavedPosition = new Cartesian3();
        var scratch2DViewportTransform = new Matrix4();
        var scratch2DViewportCameraTransform = new Matrix4();
        var scratch2DViewportEyePoint = new Cartesian3();
        var scratch2DViewportWindowCoords = new Cartesian3();
        var scratch2DViewport = new BoundingRectangle();

        function execute2DViewportCommands(scene, passState) {//nt
            var context = scene.context;
            var frameState = scene.frameState;
            var camera = scene.camera;

            var originalViewport = passState.viewport;
            var viewport = BoundingRectangle.clone(originalViewport, scratch2DViewport);
            passState.viewport = viewport;

            var maxCartographic = scratch2DViewportCartographic;
            var maxCoord = scratch2DViewportMaxCoord;

            var projection = scene.mapProjection;
            projection.project(maxCartographic, maxCoord);

            var position = Cartesian3.clone(camera.position, scratch2DViewportSavedPosition);
            var transform = Matrix4.clone(camera.transform, scratch2DViewportCameraTransform);
            var frustum = camera.frustum.clone();

            camera._setTransform(Matrix4.IDENTITY);

            var viewportTransformation = Matrix4.computeViewportTransformation(viewport, 0.0, 1.0, scratch2DViewportTransform);
            var projectionMatrix = camera.frustum.projectionMatrix;

            var x = camera.positionWC.y;
            var eyePoint = Cartesian3.fromElements(CesiumMath.sign(x) * maxCoord.x - x, 0.0, -camera.positionWC.x, scratch2DViewportEyePoint);
            var windowCoordinates = Transforms.pointToGLWindowCoordinates(projectionMatrix, viewportTransformation, eyePoint, scratch2DViewportWindowCoords);

            windowCoordinates.x = Math.floor(windowCoordinates.x);

            var viewportX = viewport.x;
            var viewportWidth = viewport.width;

            if (x === 0.0 || windowCoordinates.x <= viewportX || windowCoordinates.x >= viewportX + viewportWidth) {
                executeCommandsInViewport(true, scene, passState);
            } else if (Math.abs(viewportX + viewportWidth * 0.5 - windowCoordinates.x) < 1.0) {
                viewport.width = windowCoordinates.x - viewport.x;

                camera.position.x *= CesiumMath.sign(camera.position.x);

                camera.frustum.right = 0.0;

                frameState.cullingVolume = camera.frustum.computeCullingVolume(camera.positionWC, camera.directionWC, camera.upWC);
                context.uniformState.update(frameState);

                executeCommandsInViewport(true, scene, passState);

                viewport.x = windowCoordinates.x;

                camera.position.x = -camera.position.x;

                camera.frustum.right = -camera.frustum.left;
                camera.frustum.left = 0.0;

                frameState.cullingVolume = camera.frustum.computeCullingVolume(camera.positionWC, camera.directionWC, camera.upWC);
                context.uniformState.update(frameState);

                executeCommandsInViewport(false, scene, passState);
            } else if (windowCoordinates.x > viewportX + viewportWidth * 0.5) {
                viewport.width = windowCoordinates.x - viewportX;

                var right = camera.frustum.right;
                camera.frustum.right = maxCoord.x - x;

                frameState.cullingVolume = camera.frustum.computeCullingVolume(camera.positionWC, camera.directionWC, camera.upWC);
                context.uniformState.update(frameState);

                executeCommandsInViewport(true, scene, passState);

                viewport.x = windowCoordinates.x;
                viewport.width = viewportX + viewportWidth - windowCoordinates.x;

                camera.position.x = -camera.position.x;

                camera.frustum.left = -camera.frustum.right;
                camera.frustum.right = right - camera.frustum.right * 2.0;

                frameState.cullingVolume = camera.frustum.computeCullingVolume(camera.positionWC, camera.directionWC, camera.upWC);
                context.uniformState.update(frameState);

                executeCommandsInViewport(false, scene, passState);
            } else {
                viewport.x = windowCoordinates.x;
                viewport.width = viewportX + viewportWidth - windowCoordinates.x;

                var left = camera.frustum.left;
                camera.frustum.left = -maxCoord.x - x;

                frameState.cullingVolume = camera.frustum.computeCullingVolume(camera.positionWC, camera.directionWC, camera.upWC);
                context.uniformState.update(frameState);

                executeCommandsInViewport(true, scene, passState);

                viewport.x = viewportX;
                viewport.width = windowCoordinates.x - viewportX;

                camera.position.x = -camera.position.x;

                camera.frustum.right = -camera.frustum.left;
                camera.frustum.left = left - camera.frustum.left * 2.0;

                frameState.cullingVolume = camera.frustum.computeCullingVolume(camera.positionWC, camera.directionWC, camera.upWC);
                context.uniformState.update(frameState);

                executeCommandsInViewport(false, scene, passState);
            }

            camera._setTransform(transform);
            Cartesian3.clone(position, camera.position);
            camera.frustum = frustum.clone();
            passState.viewport = originalViewport;
        }

        function executeCommandsInViewport(firstViewport, scene, passState, backgroundColor) {//ot
            var depthOnly = scene.frameState.passes.depth;

            if (!firstViewport && !depthOnly) {
                scene.frameState.commandList.length = 0;
            }

            if (!depthOnly) {
                updateAndRenderPrimitives(scene);
            }

            createPotentiallyVisibleSet(scene);

            if (firstViewport) {
                if (defined(backgroundColor)) {
                    updateAndClearFramebuffers(scene, passState, backgroundColor);
                }
                if (!depthOnly) {
                    executeComputeCommands(scene);
                    executeShadowMapCastCommands(scene);
                }
            }

            executeCommands(scene, passState);
        }

        function updateEnvironment(scene, passState) {//at
            var frameState = scene._frameState;

            // Update celestial and terrestrial environment effects.
            var environmentState = scene._environmentState;
            var renderPass = frameState.passes.render;
            var skyAtmosphere = scene.skyAtmosphere;
            var globe = scene.globe;

            if (!renderPass || (scene._mode !== SceneMode.SCENE2D && frameState.camera.frustum instanceof OrthographicFrustum)) {
                environmentState.skyAtmosphereCommand = undefined;
                environmentState.skyBoxCommand = undefined;
                environmentState.sunDrawCommand = undefined;
                environmentState.sunComputeCommand = undefined;
                environmentState.moonCommand = undefined;
            } else {
                if (defined(skyAtmosphere) && defined(globe)) {
                    skyAtmosphere.setDynamicAtmosphereColor(globe.enableLighting);
                    environmentState.isReadyForAtmosphere = environmentState.isReadyForAtmosphere || globe._surface._tilesToRender.length > 0;
                }
                environmentState.skyAtmosphereCommand = defined(skyAtmosphere) ? skyAtmosphere.update(frameState) : undefined;
                environmentState.skyBoxCommand = defined(scene.skyBox) ? scene.skyBox.update(frameState) : undefined;
                var sunCommands = defined(scene.sun) ? scene.sun.update(frameState, passState) : undefined;
                environmentState.sunDrawCommand = defined(sunCommands) ? sunCommands.drawCommand : undefined;
                environmentState.sunComputeCommand = defined(sunCommands) ? sunCommands.computeCommand : undefined;
                environmentState.moonCommand = defined(scene.moon) ? scene.moon.update(frameState) : undefined;
            }

            var clearGlobeDepth = environmentState.clearGlobeDepth = defined(globe) && (!globe.depthTestAgainstTerrain || scene.mode === SceneMode.SCENE2D);
            var useDepthPlane = environmentState.useDepthPlane = clearGlobeDepth && scene.mode === SceneMode.SCENE3D;
            if (useDepthPlane) {
                // Update the depth plane that is rendered in 3D when the primitives are
                // not depth tested against terrain so primitives on the backface
                // of the globe are not picked.
                scene._depthPlane.update(frameState);
            }

            var occluder = (frameState.mode === SceneMode.SCENE3D) ? frameState.occluder : undefined;
            var cullingVolume = frameState.cullingVolume;

            // get user culling volume minus the far plane.
            var planes = scratchCullingVolume.planes;
            for (var k = 0; k < 5; ++k) {
                planes[k] = cullingVolume.planes[k];
            }
            cullingVolume = scratchCullingVolume;

            // Determine visibility of celestial and terrestrial environment effects.
            environmentState.isSkyAtmosphereVisible = defined(environmentState.skyAtmosphereCommand) && environmentState.isReadyForAtmosphere;
            environmentState.isSunVisible = isVisible(environmentState.sunDrawCommand, cullingVolume, occluder);
            environmentState.isMoonVisible = isVisible(environmentState.moonCommand, cullingVolume, occluder);
        }

        function updateDebugFrustumPlanes(scene) {//st
            var frameState = scene._frameState;
            if (scene.debugShowFrustumPlanes !== scene._debugShowFrustumPlanes) {
                if (scene.debugShowFrustumPlanes) {
                    scene._debugFrustumPlanes = new DebugCameraPrimitive({
                        camera: scene.camera,
                        updateOnChange: false
                    });
                } else {
                    scene._debugFrustumPlanes = scene._debugFrustumPlanes && scene._debugFrustumPlanes.destroy();
                }
                scene._debugShowFrustumPlanes = scene.debugShowFrustumPlanes;
            }

            if (defined(scene._debugFrustumPlanes)) {
                scene._debugFrustumPlanes.update(frameState);
            }
        }

        function updateShadowMaps(scene) {//lt
            var frameState = scene._frameState;
            var shadowMaps = frameState.shadowMaps;
            var length = shadowMaps.length;

            var shadowsEnabled = (length > 0) && !frameState.passes.pick && (scene.mode === SceneMode.SCENE3D);
            if (shadowsEnabled !== frameState.shadowHints.shadowsEnabled) {
                // Update derived commands when shadowsEnabled changes
                ++frameState.shadowHints.lastDirtyTime;
                frameState.shadowHints.shadowsEnabled = shadowsEnabled;
            }

            if (!shadowsEnabled) {
                return;
            }

            // Check if the shadow maps are different than the shadow maps last frame.
            // If so, the derived commands need to be updated.
            for (var j = 0; j < length; ++j) {
                if (shadowMaps[j] !== frameState.shadowHints.shadowMaps[j]) {
                    ++frameState.shadowHints.lastDirtyTime;
                    break;
                }
            }

            frameState.shadowHints.shadowMaps.length = 0;
            frameState.shadowHints.lightShadowMaps.length = 0;

            for (var i = 0; i < length; ++i) {
                var shadowMap = shadowMaps[i];
                shadowMap.update(frameState);

                frameState.shadowHints.shadowMaps.push(shadowMap);

                if (shadowMap.fromLightSource) {
                    frameState.shadowHints.lightShadowMaps.push(shadowMap);
                }

                if (shadowMap.dirty) {
                    ++frameState.shadowHints.lastDirtyTime;
                    shadowMap.dirty = false;
                }
            }
        }

        function updateAndRenderPrimitives(scene) {//ut
            var frameState = scene._frameState;//t

            frameState._scene = scene;//新增

            scene._groundPrimitives.update(frameState);
            scene._primitives.update(frameState);

            scene._pageLODs.update(frameState);//新增

            updateDebugFrustumPlanes(scene);
            updateShadowMaps(scene);

            if (scene._globe) {
                scene._globe.render(frameState);
            }
        }

        function updateAndClearFramebuffers(scene, passState, clearColor) {//ct
            var context = scene._context;
            var environmentState = scene._environmentState;

            var passes = scene._frameState.passes;
            var picking = passes.pick;
            var useWebVR = scene._useWebVR && scene.mode !== SceneMode.SCENE2D;

            environmentState.originalFramebuffer = passState.framebuffer;

            if (defined(scene.sun) && scene.sunBloom !== scene._sunBloom) {
                if (scene.sunBloom && !useWebVR) {
                    scene._sunPostProcess = new SunPostProcess();
                } else if (defined(scene._sunPostProcess)) {
                    scene._sunPostProcess = scene._sunPostProcess.destroy();
                }

                scene._sunBloom = scene.sunBloom;
            } else if (!defined(scene.sun) && defined(scene._sunPostProcess)) {
                scene._sunPostProcess = scene._sunPostProcess.destroy();
                scene._sunBloom = false;
            }

            var clear = scene._clearColorCommand;
            Color.clone(clearColor, clear.color);
            clear.execute(context, passState);

            var useGlobeDepthFramebuffer = environmentState.useGlobeDepthFramebuffer = !picking && defined(scene._globeDepth);
            if (useGlobeDepthFramebuffer) {
                scene._globeDepth.update(context, passState);
                scene._globeDepth.clear(context, passState, clearColor);
            }

            var useOIT = environmentState.useOIT = !picking && defined(scene._oit) && scene._oit.isSupported();
            if (useOIT) {
                scene._oit.update(context, passState, scene._globeDepth.framebuffer);
                scene._oit.clear(context, passState, clearColor);
                environmentState.useOIT = scene._oit.isSupported();
            }

            var useFXAA = environmentState.useFXAA = !picking && scene.fxaa;
            if (useFXAA) {
                scene._fxaa.update(context, passState);
                scene._fxaa.clear(context, passState, clearColor);
            }

            if (environmentState.isSunVisible && scene.sunBloom && !useWebVR) {
                passState.framebuffer = scene._sunPostProcess.update(passState);
            } else if (useGlobeDepthFramebuffer) {
                passState.framebuffer = scene._globeDepth.framebuffer;
            } else if (useFXAA) {
                passState.framebuffer = scene._fxaa.getColorFramebuffer();
            }

            if (defined(passState.framebuffer)) {
                clear.execute(context, passState);
            }

            var useInvertClassification = environmentState.useInvertClassification = !picking && defined(passState.framebuffer) && scene.invertClassification;
            if (useInvertClassification) {
                var depthFramebuffer;
                if (scene.frameState.invertClassificationColor.alpha === 1.0) {
                    if (environmentState.useGlobeDepthFramebuffer) {
                        depthFramebuffer = scene._globeDepth.framebuffer;
                    } else if (environmentState.useFXAA) {
                        depthFramebuffer = scene._fxaa.getColorFramebuffer();
                    }
                }

                scene._invertClassification.previousFramebuffer = depthFramebuffer;
                scene._invertClassification.update(context);
                scene._invertClassification.clear(context, passState);

                if (scene.frameState.invertClassificationColor.alpha < 1.0 && useOIT) {
                    var command = scene._invertClassification.unclassifiedCommand;
                    var derivedCommands = command.derivedCommands;
                    derivedCommands.oit = scene._oit.createDerivedCommands(command, context, derivedCommands.oit);
                }
            }
        }

        function resolveFramebuffers(scene, passState) {//dt
            var context = scene._context;
            var environmentState = scene._environmentState;

            var useGlobeDepthFramebuffer = environmentState.useGlobeDepthFramebuffer;
            if (scene.debugShowGlobeDepth && useGlobeDepthFramebuffer) {
                var gd = getDebugGlobeDepth(scene, scene.debugShowDepthFrustum - 1);
                gd.executeDebugGlobeDepth(context, passState);
            }

            if (scene.debugShowPickDepth && useGlobeDepthFramebuffer) {
                var pd = getPickDepth(scene, scene.debugShowDepthFrustum - 1);
                pd.executeDebugPickDepth(context, passState);
            }

            var useOIT = environmentState.useOIT;
            var useFXAA = environmentState.useFXAA;

            if (useOIT) {
                passState.framebuffer = useFXAA ? scene._fxaa.getColorFramebuffer() : undefined;
                scene._oit.execute(context, passState);
            }

            if (useFXAA) {
                if (!useOIT && useGlobeDepthFramebuffer) {
                    passState.framebuffer = scene._fxaa.getColorFramebuffer();
                    scene._globeDepth.executeCopyColor(context, passState);
                }

                passState.framebuffer = environmentState.originalFramebuffer;
                scene._fxaa.execute(context, passState);
            }

            if (!useOIT && !useFXAA && useGlobeDepthFramebuffer) {
                passState.framebuffer = environmentState.originalFramebuffer;
                scene._globeDepth.executeCopyColor(context, passState);
            }
        }

        function callAfterRenderFunctions(scene) {//ht
            var functions = scene._frameState.afterRender;
            for (var i = 0, length = functions.length; i < length; ++i) {
                functions[i]();
                scene.requestRender();
            }

            functions.length = 0;
        }

        Scene.prototype.initializeFrame = function () {
            if (this._shaderFrameCount++ === 120) {
                this._shaderFrameCount = 0;
                this._context.shaderCache.destroyReleasedShaderPrograms();
            }

            this._tweens.update();

            this._screenSpaceCameraController.update();
            if (defined(this._deviceOrientationCameraController)) {
                this._deviceOrientationCameraController.update();
            }

            this._camera.update(this._mode);
            this._camera._updateCameraChanged();
        };

        function checkForCameraUpdates(scene) {//pt
            var camera = scene._camera;
            if (!cameraEqual(camera, scene._cameraClone, CesiumMath.EPSILON15)) {
                if (!scene._cameraStartFired) {
                    camera.moveStart.raiseEvent();
                    scene._cameraStartFired = true;
                }
                scene._cameraMovedTime = getTimestamp();
                Camera.clone(camera, scene._cameraClone);

                return true;
            }

            if (scene._cameraStartFired && getTimestamp() - scene._cameraMovedTime > scene.cameraEventWaitTime) {
                camera.moveEnd.raiseEvent();
                scene._cameraStartFired = false;
            }

            return false;
        }

        function updateDebugShowFramesPerSecond(scene, renderedThisFrame) {//ft
            if (scene.debugShowFramesPerSecond) {
                if (!defined(scene._performanceDisplay)) {
                    var performanceContainer = document.createElement('div');
                    performanceContainer.className = 'cesium-performanceDisplay-defaultContainer';
                    var container = scene._canvas.parentNode;
                    container.appendChild(performanceContainer);
                    var performanceDisplay = new PerformanceDisplay({container: performanceContainer});
                    scene._performanceDisplay = performanceDisplay;
                    scene._performanceContainer = performanceContainer;
                }

                scene._performanceDisplay.throttled = scene.requestRenderMode;
                scene._performanceDisplay.update(renderedThisFrame);
            } else if (defined(scene._performanceDisplay)) {
                scene._performanceDisplay = scene._performanceDisplay && scene._performanceDisplay.destroy();
                scene._performanceContainer.parentNode.removeChild(scene._performanceContainer);
            }
        }

        function update(scene) {//mt
            var frameState = scene._frameState;

            if (defined(scene.globe)) {
                scene.globe.update(frameState);
            }

            frameState.creditDisplay.update();
        }

        function render(scene, time) {//gt
            scene._pickPositionCacheDirty = true;

            var context = scene.context;
            var us = context.uniformState;
            var frameState = scene._frameState;

            var frameNumber = CesiumMath.incrementWrap(frameState.frameNumber, 15000000.0, 1.0);
            updateFrameState(scene, frameNumber, time);
            frameState.passes.render = true;

            var backgroundColor = defaultValue(scene.backgroundColor, Color.BLACK);
            frameState.backgroundColor = backgroundColor;

            frameState.creditDisplay.beginFrame();

            scene.fog.update(frameState);

            us.update(frameState);

            var shadowMap = scene.shadowMap;
            if (defined(shadowMap) && shadowMap.enabled) {
                // Update the sun's direction
                Cartesian3.negate(us.sunDirectionWC, scene._sunCamera.direction);
                frameState.shadowMaps.push(shadowMap);
            }

            scene._computeCommandList.length = 0;
            scene._overlayCommandList.length = 0;

            var passState = scene._passState;
            passState.framebuffer = undefined;
            passState.blendingEnabled = undefined;
            passState.scissorTest = undefined;

            if (defined(scene.globe)) {
                scene.globe.beginFrame(frameState);
            }

            updateEnvironment(scene, passState);
            updateAndExecuteCommands(scene, passState, backgroundColor);
            resolveFramebuffers(scene, passState);
            executeOverlayCommands(scene, passState);

            if (defined(scene.globe)) {
                scene.globe.endFrame(frameState);

                if (!scene.globe.tilesLoaded) {
                    scene._renderRequested = true;
                }
            }

            frameState.creditDisplay.endFrame();
            context.endFrame();
        }

        function tryAndCatchError(scene, time, functionToExecute) {//_t
            try {
                functionToExecute(scene, time);
            } catch (error) {
                scene._renderError.raiseEvent(scene, error);

                if (scene.rethrowRenderErrors) {
                    throw error;
                }
            }
        }

        Scene.prototype.render = function (time) {
            if (!defined(time)) {
                time = JulianDate.now();
            }

            this._jobScheduler.resetBudgets();

            // Update
            this._preUpdate.raiseEvent(this, time);
            tryAndCatchError(this, time, update);
            this._postUpdate.raiseEvent(this, time);

            var cameraChanged = checkForCameraUpdates(this);
            var shouldRender = !this.requestRenderMode || this._renderRequested || cameraChanged || (this.mode === SceneMode.MORPHING);
            if (!shouldRender && defined(this.maximumRenderTimeChange) && defined(this._lastRenderTime)) {
                var difference = Math.abs(JulianDate.secondsDifference(this._lastRenderTime, time));
                shouldRender = shouldRender || difference > this.maximumRenderTimeChange;
            }

            if (shouldRender) {
                this._lastRenderTime = JulianDate.clone(time, this._lastRenderTime);
                this._renderRequested = false;

                // Render
                this._preRender.raiseEvent(this, time);
                tryAndCatchError(this, time, render);

                RequestScheduler.update();
            }

            updateDebugShowFramesPerSecond(this, shouldRender);
            callAfterRenderFunctions(this);

            if (shouldRender) {
                this._postRender.raiseEvent(this, time);
            }

            //新增
            if (!this._frameState.isPC) {
                var e = getTimestamp();
                this._fpsFrameCount++;
                var n = e - this._lastFpsSampleTime;
                if (n > 1e3) {
                    var o = 1e3 * this._fpsFrameCount / n | 0;
                    var a = 100;
                    if (o < 20) {
                        a = 100;
                    } else {
                        if (o < 40) {
                            a = 200;
                        } else {
                            a = 500;
                        }
                    }

                    this._frameState.maximumMemoryUsage = 1048576 * a;
                    this._lastFpsSampleTime = e;
                    this._fpsFrameCount = 0;
                }
            }
        };

        Scene.prototype.forceRender = function(time) {
            this._renderRequested = true;
            this.render(time);
        };

        Scene.prototype.requestRender = function () {
            this._renderRequested = true;
        };

        Scene.prototype.clampLineWidth = function(width) {
            return Math.max(ContextLimits.minimumAliasedLineWidth, Math.min(width, ContextLimits.maximumAliasedLineWidth));
        };


        var orthoPickingFrustum = new OrthographicOffCenterFrustum();
        var scratchOrigin = new Cartesian3();
        var scratchDirection = new Cartesian3();
        var scratchPixelSize = new Cartesian2();
        var scratchPickVolumeMatrix4 = new Matrix4();

        function getPickOrthographicCullingVolume(scene, drawingBufferPosition, width, height) {//vt
            var camera = scene._camera;
            var frustum = camera.frustum;
            if (defined(frustum._offCenterFrustum)) {
                frustum = frustum._offCenterFrustum;
            }

            var viewport = scene._passState.viewport;
            var x = 2.0 * (drawingBufferPosition.x - viewport.x) / viewport.width - 1.0;
            x *= (frustum.right - frustum.left) * 0.5;
            var y = 2.0 * (viewport.height - drawingBufferPosition.y - viewport.y) / viewport.height - 1.0;
            y *= (frustum.top - frustum.bottom) * 0.5;

            var transform = Matrix4.clone(camera.transform, scratchPickVolumeMatrix4);
            camera._setTransform(Matrix4.IDENTITY);

            var origin = Cartesian3.clone(camera.position, scratchOrigin);
            Cartesian3.multiplyByScalar(camera.right, x, scratchDirection);
            Cartesian3.add(scratchDirection, origin, origin);
            Cartesian3.multiplyByScalar(camera.up, y, scratchDirection);
            Cartesian3.add(scratchDirection, origin, origin);

            camera._setTransform(transform);

            if (scene.mode === SceneMode.SCENE2D) {
                Cartesian3.fromElements(origin.z, origin.x, origin.y, origin);
            }

            var pixelSize = frustum.getPixelDimensions(viewport.width, viewport.height, 1.0, scratchPixelSize);

            var ortho = orthoPickingFrustum;
            ortho.right = pixelSize.x * 0.5;
            ortho.left = -ortho.right;
            ortho.top = pixelSize.y * 0.5;
            ortho.bottom = -ortho.top;
            ortho.near = frustum.near;
            ortho.far = frustum.far;

            return ortho.computeCullingVolume(origin, camera.directionWC, camera.upWC);
        }

        function getPickPerspectiveCullingVolume(scene, drawingBufferPosition, width, height) {//yt
            var camera = scene._camera;
            var frustum = camera.frustum;
            var near = frustum.near;

            var tanPhi = Math.tan(frustum.fovy * 0.5);
            var tanTheta = frustum.aspectRatio * tanPhi;

            var viewport = scene._passState.viewport;
            var x = 2.0 * (drawingBufferPosition.x - viewport.x) / viewport.width - 1.0;
            var y = 2.0 * (viewport.height - drawingBufferPosition.y - viewport.y) / viewport.height - 1.0;

            var xDir = x * near * tanTheta;
            var yDir = y * near * tanPhi;

            var pixelSize = frustum.getPixelDimensions(viewport.width, viewport.height, 1.0, scratchPixelSize);
            var pickWidth = pixelSize.x * width * 0.5;
            var pickHeight = pixelSize.y * height * 0.5;

            var offCenter = perspPickingFrustum;
            offCenter.top = yDir + pickHeight;
            offCenter.bottom = yDir - pickHeight;
            offCenter.right = xDir + pickWidth;
            offCenter.left = xDir - pickWidth;
            offCenter.near = near;
            offCenter.far = frustum.far;

            return offCenter.computeCullingVolume(camera.positionWC, camera.directionWC, camera.upWC);
        }

        function getPickCullingVolume(scene, drawingBufferPosition, width, height) {//bt
            var frustum = scene.camera.frustum;
            if (frustum instanceof OrthographicFrustum || frustum instanceof OrthographicOffCenterFrustum) {
                return getPickOrthographicCullingVolume(scene, drawingBufferPosition, width, height);
            }

            return getPickPerspectiveCullingVolume(scene, drawingBufferPosition, width, height);
        }

        var rectangleWidth = 3.0;
        var rectangleHeight = 3.0;
        var scratchRectangle = new BoundingRectangle(0.0, 0.0, rectangleWidth, rectangleHeight);
        var scratchColorZero = new Color(0.0, 0.0, 0.0, 0.0);
        var scratchPosition = new Cartesian2();

        Scene.prototype.pick = function (windowPosition, width, height) {
            if(!defined(windowPosition)) {
                throw new DeveloperError('windowPosition is undefined.');
            }

            rectangleWidth = defaultValue(width, 3.0);
            rectangleHeight = defaultValue(height, rectangleWidth);

            var context = this._context;
            var us = context.uniformState;
            var frameState = this._frameState;

            var drawingBufferPosition = SceneTransforms.transformWindowToDrawingBuffer(this, windowPosition, scratchPosition);

            if (!defined(this._pickFramebuffer)) {
                this._pickFramebuffer = context.createPickFramebuffer();
            }
            updateFrameState(this, frameState.frameNumber, frameState.time);
            frameState.cullingVolume = getPickCullingVolume(this, drawingBufferPosition, rectangleWidth, rectangleHeight);
            frameState.invertClassification = false;
            frameState.passes.pick = true;

            us.update(frameState);

            scratchRectangle.x = drawingBufferPosition.x - ((rectangleWidth - 1.0) * 0.5);
            scratchRectangle.y = (this.drawingBufferHeight - drawingBufferPosition.y) - ((rectangleHeight - 1.0) * 0.5);
            scratchRectangle.width = rectangleWidth;
            scratchRectangle.height = rectangleHeight;
            var passState = this._pickFramebuffer.begin(scratchRectangle);

            updateEnvironment(this, passState);
            updateAndExecuteCommands(this, passState, scratchColorZero);
            resolveFramebuffers(this, passState);

            var object = this._pickFramebuffer.end(scratchRectangle);
            context.endFrame();
            callAfterRenderFunctions(this);
            return object;
        };

        var fragDepthRegex = /\bgl_FragDepthEXT\b/;
        var discardRegex = /\bdiscard\b/;


        function getDepthOnlyShaderProgram(context, shaderProgram) {//Ct
            var shader = context.shaderCache.getDerivedShaderProgram(shaderProgram, 'depthOnly');
            if (!defined(shader)) {
                var attributeLocations = shaderProgram._attributeLocations;
                var fs = shaderProgram.fragmentShaderSource;

                var writesDepthOrDiscards = false;
                var sources = fs.sources;
                var length = sources.length;
                for (var i = 0; i < length; ++i) {
                    if (fragDepthRegex.test(sources[i]) || discardRegex.test(sources[i])) {
                        writesDepthOrDiscards = true;
                        break;
                    }
                }

                if (!writesDepthOrDiscards) {
                    fs = new ShaderSource({
                        sources: ['void main() { gl_FragColor = vec4(1.0); }']
                    });
                }

                shader = context.shaderCache.createDerivedShaderProgram(shaderProgram, 'depthOnly', {
                    vertexShaderSource: shaderProgram.vertexShaderSource,
                    fragmentShaderSource: fs,
                    attributeLocations: attributeLocations
                });
            }

            return shader;
        }

        function getDepthOnlyRenderState(scene, renderState) {//St
            var cache = scene._depthOnlyRenderStateCache;
            var depthOnlyState = cache[renderState.id];
            if (!defined(depthOnlyState)) {
                var rs = RenderState.getState(renderState);
                rs.depthMask = true;
                rs.colorMask = {
                    red: false,
                    green: false,
                    blue: false,
                    alpha: false
                };

                depthOnlyState = RenderState.fromCache(rs);
                cache[renderState.id] = depthOnlyState;
            }

            return depthOnlyState;
        }

        function createDepthOnlyDerivedCommand(scene, command, context, result) {
            // For a depth only pass, we bind a framebuffer with only a depth attachment (no color attachments),
            // do not write color, and write depth. If the fragment shader doesn't modify the fragment depth
            // or discard, the driver can replace the fragment shader with a pass-through shader. We're unsure if this
            // actually happens so we modify the shader to use a pass-through fragment shader.

            if (!defined(result)) {
                result = {};
            }

            var shader;
            var renderState;
            if (defined(result.depthOnlyCommand)) {
                shader = result.depthOnlyCommand.shaderProgram;
                renderState = result.depthOnlyCommand.renderState;
            }

            result.depthOnlyCommand = DrawCommand.shallowClone(command, result.depthOnlyCommand);

            if (!defined(shader) || result.shaderProgramId !== command.shaderProgram.id) {
                result.depthOnlyCommand.shaderProgram = getDepthOnlyShaderProgram(context, command.shaderProgram);
                result.depthOnlyCommand.renderState = getDepthOnlyRenderState(scene, command.renderState);
                result.shaderProgramId = command.shaderProgram.id;
            } else {
                result.depthOnlyCommand.shaderProgram = shader;
                result.depthOnlyCommand.renderState = renderState;
            }

            return result;
        }

        function renderTranslucentDepthForPick(scene, drawingBufferPosition) {//Tt
            var context = scene._context;
            var frameState = scene._frameState;

            clearPasses(frameState.passes);
            frameState.passes.pick = true;
            frameState.passes.depth = true;
            frameState.cullingVolume = getPickCullingVolume(scene, drawingBufferPosition, 1, 1);

            var passState = scene._pickDepthPassState;
            if (!defined(passState)) {
                passState = scene._pickDepthPassState = new PassState(context);
                passState.scissorTest = {
                    enabled: true,
                    rectangle: new BoundingRectangle()
                };
                passState.viewport = new BoundingRectangle();
            }

            var width = context.drawingBufferWidth;
            var height = context.drawingBufferHeight;

            var framebuffer = scene._pickDepthFramebuffer;
            var pickDepthFBWidth = scene._pickDepthFramebufferWidth;
            var pickDepthFBHeight = scene._pickDepthFramebufferHeight;
            if (!defined(framebuffer) || pickDepthFBWidth !== width || pickDepthFBHeight !== height) {
                scene._pickDepthFramebuffer = scene._pickDepthFramebuffer && scene._pickDepthFramebuffer.destroy();
                framebuffer = scene._pickDepthFramebuffer = new Framebuffer({
                    context: context,
                    depthStencilTexture: new Texture({
                        context: context,
                        width: width,
                        height: height,
                        pixelFormat: PixelFormat.DEPTH_STENCIL,
                        pixelDatatype: PixelDatatype.UNSIGNED_INT_24_8
                    })
                });

                scene._pickDepthFramebufferWidth = width;
                scene._pickDepthFramebufferHeight = height;
            }

            passState.framebuffer = framebuffer;
            passState.viewport.width = width;
            passState.viewport.height = height;
            passState.scissorTest.rectangle.x = drawingBufferPosition.x;
            passState.scissorTest.rectangle.y = height - drawingBufferPosition.y;
            passState.scissorTest.rectangle.width = 1;
            passState.scissorTest.rectangle.height = 1;

            updateEnvironment(scene, passState);
            updateAndExecuteCommands(scene, passState, scratchColorZero);
            resolveFramebuffers(scene, passState);

            context.endFrame();
        }

        var scratchPackedDepth = new Cartesian4();
        var packedDepthScale = new Cartesian4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0);

        Scene.prototype.pickPositionWorldCoordinates = function(windowPosition, result) {
            if (!this.useDepthPicking) {
                return undefined;
            }

            //>>includeStart('debug', pragmas.debug);
            if(!defined(windowPosition)) {
                throw new DeveloperError('windowPosition is undefined.');
            }
            if (!defined(this._globeDepth)) {
                throw new DeveloperError('Picking from the depth buffer is not supported. Check pickPositionSupported.');
            }
            //>>includeEnd('debug');

            var cacheKey = windowPosition.toString();

            if (this._pickPositionCacheDirty){
                this._pickPositionCache = {};
                this._pickPositionCacheDirty = false;
            } else if (this._pickPositionCache.hasOwnProperty(cacheKey)){
                return Cartesian3.clone(this._pickPositionCache[cacheKey], result);
            }

            var context = this._context;
            var uniformState = context.uniformState;

            var drawingBufferPosition = SceneTransforms.transformWindowToDrawingBuffer(this, windowPosition, scratchPosition);
            if (this.pickTranslucentDepth) {
                renderTranslucentDepthForPick(this, drawingBufferPosition);
            }
            drawingBufferPosition.y = this.drawingBufferHeight - drawingBufferPosition.y;

            var camera = this._camera;

            // Create a working frustum from the original camera frustum.
            var frustum;
            if (defined(camera.frustum.fov)) {
                frustum = camera.frustum.clone(scratchPerspectiveFrustum);
            } else if (defined(camera.frustum.infiniteProjectionMatrix)){
                frustum = camera.frustum.clone(scratchPerspectiveOffCenterFrustum);
            } else if (defined(camera.frustum.width)) {
                frustum = camera.frustum.clone(scratchOrthographicFrustum);
            } else {
                frustum = camera.frustum.clone(scratchOrthographicOffCenterFrustum);
            }

            var numFrustums = this.numberOfFrustums;
            for (var i = 0; i < numFrustums; ++i) {
                var pickDepth = getPickDepth(this, i);
                var pixels = context.readPixels({
                    x : drawingBufferPosition.x,
                    y : drawingBufferPosition.y,
                    width : 1,
                    height : 1,
                    framebuffer : pickDepth.framebuffer
                });

                var packedDepth = Cartesian4.unpack(pixels, 0, scratchPackedDepth);
                Cartesian4.divideByScalar(packedDepth, 255.0, packedDepth);
                var depth = Cartesian4.dot(packedDepth, packedDepthScale);

                if (depth > 0.0 && depth < 1.0) {
                    var renderedFrustum = this._frustumCommandsList[i];
                    var height2D;
                    if (this.mode === SceneMode.SCENE2D) {
                        height2D = camera.position.z;
                        camera.position.z = height2D - renderedFrustum.near + 1.0;
                        frustum.far = Math.max(1.0, renderedFrustum.far - renderedFrustum.near);
                        frustum.near = 1.0;
                        uniformState.update(this.frameState);
                        uniformState.updateFrustum(frustum);
                    } else {
                        frustum.near = renderedFrustum.near * (i !== 0 ? OPAQUE_FRUSTUM_NEAR_OFFSET : 1.0);
                        frustum.far = renderedFrustum.far;
                        uniformState.updateFrustum(frustum);
                    }

                    result = SceneTransforms.drawingBufferToWgs84Coordinates(this, drawingBufferPosition, depth, result);

                    if (this.mode === SceneMode.SCENE2D) {
                        camera.position.z = height2D;
                        uniformState.update(this.frameState);
                    }

                    this._pickPositionCache[cacheKey] = Cartesian3.clone(result);
                    return result;
                }
            }

            this._pickPositionCache[cacheKey] = undefined;
            return undefined;
        };

        var scratchPickPositionCartographic = new Cartographic();

        Scene.prototype.pickPosition = function(windowPosition, result) {
            result = this.pickPositionWorldCoordinates(windowPosition, result);
            if (defined(result) && this.mode !== SceneMode.SCENE3D) {
                Cartesian3.fromElements(result.y, result.z, result.x, result);

                var projection = this.mapProjection;
                var ellipsoid = projection.ellipsoid;

                var cart = projection.unproject(result, scratchPickPositionCartographic);
                ellipsoid.cartographicToCartesian(cart, result);
            }

            return result;
        };

        Scene.prototype.drillPick = function(windowPosition, limit) {
            // PERFORMANCE_IDEA: This function calls each primitive's update for each pass. Instead
            // we could update the primitive once, and then just execute their commands for each pass,
            // and cull commands for picked primitives.  e.g., base on the command's owner.

            //>>includeStart('debug', pragmas.debug);
            if (!defined(windowPosition)) {
                throw new DeveloperError('windowPosition is undefined.');
            }
            //>>includeEnd('debug');

            var i;
            var attributes;
            var result = [];
            var pickedPrimitives = [];
            var pickedAttributes = [];
            if (!defined(limit)) {
                limit = Number.MAX_VALUE;
            }

            var pickedResult = this.pick(windowPosition);
            while (defined(pickedResult) && defined(pickedResult.primitive)) {
                result.push(pickedResult);
                if (0 >= --limit) {
                    break;
                }

                var primitive = pickedResult.primitive;
                var hasShowAttribute = false;

                //If the picked object has a show attribute, use it.
                if (typeof primitive.getGeometryInstanceAttributes === 'function') {
                    if (defined(pickedResult.id)) {
                        attributes = primitive.getGeometryInstanceAttributes(pickedResult.id);
                        if (defined(attributes) && defined(attributes.show)) {
                            hasShowAttribute = true;
                            attributes.show = ShowGeometryInstanceAttribute.toValue(false, attributes.show);
                            pickedAttributes.push(attributes);
                        }
                    }
                }

                //Otherwise, hide the entire primitive
                if (!hasShowAttribute) {
                    primitive.show = false;
                    pickedPrimitives.push(primitive);
                }

                pickedResult = this.pick(windowPosition);
            }

            // unhide everything we hid while drill picking
            for (i = 0; i < pickedPrimitives.length; ++i) {
                pickedPrimitives[i].show = true;
            }

            for (i = 0; i < pickedAttributes.length; ++i) {
                attributes = pickedAttributes[i];
                attributes.show = ShowGeometryInstanceAttribute.toValue(true, attributes.show);
            }

            return result;
        };

        Scene.prototype.cartesianToCanvasCoordinates = function(position, result) {
            return SceneTransforms.wgs84ToWindowCoordinates(this, position, result);
        };

        Scene.prototype.completeMorph = function () {
            this._transitioner.completeMorph()
        };
        Scene.prototype.morphTo2D = function(duration) {
            var ellipsoid;
            var globe = this.globe;
            if (defined(globe)) {
                ellipsoid = globe.ellipsoid;
            } else {
                ellipsoid = this.mapProjection.ellipsoid;
            }
            duration = defaultValue(duration, 2.0);
            this._transitioner.morphTo2D(duration, ellipsoid);
        };

        Scene.prototype.morphToColumbusView = function(duration) {
            var ellipsoid;
            var globe = this.globe;
            if (defined(globe)) {
                ellipsoid = globe.ellipsoid;
            } else {
                ellipsoid = this.mapProjection.ellipsoid;
            }
            duration = defaultValue(duration, 2.0);
            this._transitioner.morphToColumbusView(duration, ellipsoid);
        };
        Scene.prototype.morphTo3D = function(duration) {
            var ellipsoid;
            var globe = this.globe;
            if (defined(globe)) {
                ellipsoid = globe.ellipsoid;
            } else {
                ellipsoid = this.mapProjection.ellipsoid;
            }
            duration = defaultValue(duration, 2.0);
            this._transitioner.morphTo3D(duration, ellipsoid);
        };
        Scene.prototype.isDestroyed = function() {
            return false;
        };
        Scene.prototype.destroy = function () {
            this._tweens.removeAll();
            this._computeEngine = this._computeEngine && this._computeEngine.destroy();
            this._screenSpaceCameraController = this._screenSpaceCameraController && this._screenSpaceCameraController.destroy();
            this._deviceOrientationCameraController = this._deviceOrientationCameraController && !this._deviceOrientationCameraController.isDestroyed() && this._deviceOrientationCameraController.destroy();
            this._pickFramebuffer = this._pickFramebuffer && this._pickFramebuffer.destroy();
            this._pickDepthFramebuffer = this._pickDepthFramebuffer && this._pickDepthFramebuffer.destroy();
            this._primitives = this._primitives && this._primitives.destroy();
            this._groundPrimitives = this._groundPrimitives && this._groundPrimitives.destroy();
            this._globe = this._globe && this._globe.destroy();
            this.skyBox = this.skyBox && this.skyBox.destroy();
            this.skyAtmosphere = this.skyAtmosphere && this.skyAtmosphere.destroy();
            this._debugSphere = this._debugSphere && this._debugSphere.destroy();
            this.sun = this.sun && this.sun.destroy();
            this._sunPostProcess = this._sunPostProcess && this._sunPostProcess.destroy();
            this._depthPlane = this._depthPlane && this._depthPlane.destroy();
            this._transitioner.destroy();
            this._debugFrustumPlanes = this._debugFrustumPlanes && this._debugFrustumPlanes.destroy();
            this._brdfLutGenerator = this._brdfLutGenerator && this._brdfLutGenerator.destroy();

            if (defined(this._globeDepth)) {
                this._globeDepth.destroy();
            }
            if (this._removeCreditContainer) {
                this._canvas.parentNode.removeChild(this._creditContainer);
            }

            if (defined(this._oit)) {
                this._oit.destroy();
            }
            this._fxaa.destroy();

            this._context = this._context && this._context.destroy();
            this._frameState.creditDisplay.destroy();
            if (defined(this._performanceDisplay)){
                this._performanceDisplay = this._performanceDisplay && this._performanceDisplay.destroy();
                this._performanceContainer.parentNode.removeChild(this._performanceContainer);
            }

            this._removeRequestListenerCallback();
            this._removeTaskProcessorListenerCallback();
            for (var i = 0; i < this._removeGlobeCallbacks.length; ++i) {
                this._removeGlobeCallbacks[i]();
            }
            this._removeGlobeCallbacks.length = 0;

            return destroyObject(this);
        };

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


        Scene.prototype.renderDepth = function (e, t, r) {
            var i = this.frameState, n = this.context, o = n.uniformState;
            clearPasses(this._frameState.passes), i.passes.depth = !0, o.updateCamera(r), e.execute(this.context, t);
            for (var a = r.frustum.computeCullingVolume(r.positionWC, r.directionWC, r.upWC), s = i.commandList, l = s.length, u = 0; u < l; ++u) {
                var c = s[u];
                c.pass !== Pass.GLOBE && c.pass !== Pass.CESIUM_3D_TILE && c.pass !== Pass.OPAQUE && c.pass !== Pass.TRANSLUCENT || isVisible(c, a) && (o.updatePass(c.pass), updateDerivedCommands(this, c), executeCommand(c, this, n, t))
            }
            o.updateCamera(this._camera), o.updateFrustum(this._camera.workingFrustums[0])
        };

        Scene.prototype.renderColorTexture = function (e, t, r) {
            var i = this.frameState, n = this.context, o = n.uniformState;
            clearPasses(this._frameState.passes), i.passes.render = !0;
            var a = i.camera;
            i.camera = r, o.updateCamera(r), updateEnvironment(this, t), e.execute(n, t);
            var s = i.commandList, l = s.length, u = this._environmentState;
            u.isSkyAtmosphereVisible && executeCommand(u.skyAtmosphereCommand, this, n, t);
            for (var c = 0; c < l; ++c) {
                var d = s[c];
                d.pass !== Pass.GLOBE && d.pass !== Pass.CESIUM_3D_TILE && d.pass !== Pass.OPAQUE && d.pass !== Pass.TRANSLUCENT && d.pass !== Pass.ENVIRONMENT && d.pass !== Pass.OVERLAY || (o.updatePass(d.pass), executeCommand(d, this, n, t))
            }
            o.updateCamera(this._camera), o.updateFrustum(this._camera.workingFrustums[0]), i.camera = a
        };

        var Qt = new I, Zt = new n, Kt = new n, Jt = new i, $t = new E, er = new M, tr = 3, rr = 3,
            ir = new e(0, 0, tr, rr), nr = new s(0, 0, 0, 0), or = new i;

        Scene.prototype._pickObjectId = function (e) {
            var t = this._context, r = t.uniformState, i = this._frameState,
                n = Te.transformWindowToDrawingBuffer(this, e, or);
            h(this._pickFramebuffer) || (this._pickFramebuffer = t.createPickFramebuffer()), this._jobScheduler.disableThisFrame(), Fe(this, i.frameNumber, i.time), i.cullingVolume = getPickCullingVolume(this, n, tr, rr), i.passes.pick = !0, r.update(i), ir.x = n.x - .5 * (tr - 1), ir.y = this.drawingBufferHeight - n.y - .5 * (rr - 1);
            var o = this._pickFramebuffer.begin(ir);
            updateEnvironment(this, o), updateAndExecuteCommands(this, o, nr), resolveFramebuffers(this, o), ir.width = 1, ir.height = 1;
            var a = this._pickFramebuffer._pickId(ir);
            return t.endFrame(), callAfterRenderFunctions(this), a
        };

        var dr = new N, hr = new n, pr = new n;
        return Scene.prototype.pickGlobe = function (e, t, r) {
            var i, o = this._globe, a = this.camera;
            if (this.pickPositionSupported && (i = this.pickPositionWorldCoordinates(e, hr), h(r) && h(i))) {
                var s = Et(this, e, i, r);
                h(s) && (i = s)
            }
            var l = a.getPickRay(e, dr), u = o.pick(l, this, pr);
            return (h(i) ? n.distance(i, a.positionWC) : Number.POSITIVE_INFINITY) < (h(u) ? n.distance(u, a.positionWC) : Number.POSITIVE_INFINITY) ? n.clone(i, t) : n.clone(u, t)
        }, Scene
    })