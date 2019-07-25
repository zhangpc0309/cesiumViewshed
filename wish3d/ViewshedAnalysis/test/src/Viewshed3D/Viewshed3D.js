define([
    './ViewshedLineVS',
    './ViewshedLineFS'
], function (
    ViewshedLineVS,
    ViewshedLineFS
) {
    'use strict';

    var e=Cesium.BoundingRectangle,
        t=Cesium.BoundingSphere,
        r=Cesium.Cartesian3,//r
        i=Cesium.Color,//i
        n=Cesium.ComponentDatatype,
        o=Cesium.defined,
        defineProperties=Cesium.defineProperties,//a
        s=Cesium.destroyObject,
        l=Cesium.IndexDatatype,
        u=Cesium.Intersect,
        c=Cesium.Math,
        d=Cesium.Matrix3,
        h=Cesium.Matrix4,//h
        p=Cesium.PixelFormat,
        f=Cesium.PrimitiveType,
        m=Cesium.Transforms,
        g=Cesium.Buffer,
        _=Cesium.BufferUsage,
        v=Cesium.ClearCommand,
        y=Cesium.DrawCommand,
        b=Cesium.Framebuffer,
        C=Cesium.Pass,
        S=Cesium.PassState,
        w=Cesium.PixelDatatype,
        T=Cesium.RenderState,//T
        x=Cesium.Sampler,
        E=Cesium.ShaderProgram,
        A=Cesium.ShaderSource,//A
        P=Cesium.Texture,
        D=Cesium.TextureMagnificationFilter,
        I=Cesium.TextureMinificationFilter,
        O=Cesium.VertexArray,
        M=Cesium.BlendingState,//M
        R=Cesium.Camera,
        L=Cesium.Scene,
        N=ViewshedLineFS,
        k=ViewshedLineVS,

        Cartesian3=Cesium.Cartesian3,
        Color=Cesium.Color,
        Matrix4=Cesium.Matrix4

    ;

    function F(e, t, r) {
        var i = T.fromCache({depthTest: {enabled: !1}, depthMask: !1}), n = new A({
            sources: ["precision highp float;\n\nuniform sampler2D u_sceneDepthTexture;\nuniform sampler2D u_depthTexture;\nuniform sampler2D u_lastResultTexture;\nuniform mat4 u_textureViewMatrix;\nuniform mat4 u_textureProjMatrix;\nuniform float u_farDist;\nuniform vec4 u_visibleAreaColor;\nuniform vec4 u_hiddenAreaColor;\n\nvarying vec2 v_textureCoordinates;\n\nvoid main()\n{\n    // result.x: 0-不在可视域范围内，0.5-不可见，1.0-可见。\n    vec4 result = texture2D(u_lastResultTexture, v_textureCoordinates);\n    // 可见就直接赋值为可见。\n    if (result.x != 1.0) {\n       float sceneDepth = czm_unpackDepth(texture2D(u_sceneDepthTexture, v_textureCoordinates));\n       sceneDepth = sceneDepth>0.0 ? sceneDepth : 1.0;\n       vec4 projPos = vec4(v_textureCoordinates*2.0-1.0, sceneDepth*2.0-1.0, 1.0);\n       vec4 texViewPos = u_textureViewMatrix * projPos;\n       vec4 texProjPos = u_textureProjMatrix * texViewPos;\n       texProjPos /= texProjPos.w;\n       texProjPos.xyz = texProjPos.xyz * 0.5 + 0.5;\n\n       // 计算最远距离的深度\n       texViewPos /= texViewPos.w;\n       texViewPos.xyz *= u_farDist / length(texViewPos.xyz);\n       vec4 farPos = u_textureProjMatrix * texViewPos;\n       float farDepth = farPos.z / farPos.w;\n       farDepth = farDepth * 0.5 + 0.5;\n       farDepth = min(farDepth, 1.0);\n\n       if (texProjPos.x > 0.0 && texProjPos.x < 1.0 &&\n           texProjPos.y > 0.0 && texProjPos.y < 1.0 &&\n           texProjPos.z > 0.5 && texProjPos.z < farDepth) {\n           float depth = texture2D(u_depthTexture, texProjPos.xy).r;\n           if (depth < 1.0 && depth - texProjPos.z < -1.0e-5) {\n               result.x = 0.5;\n           } else {\n               result.x = 1.0;\n           }\n       }\n   }\n   gl_FragColor = result;\n}"]
        }), o = {
            u_sceneDepthTexture: function () {
                return e._viewer.scene._pickDepths[0]._depthTexture
            }, u_depthTexture: function () {
                return e._depthPassState.framebuffer.depthStencilTexture
            }, u_lastResultTexture: function () {
                return t._lastResultTexture
            }, u_textureViewMatrix: function () {
                return e._textureViewMatrix
            }, u_textureProjMatrix: function () {
                return e._textureProjMatrix
            }, u_farDist: function () {
                return e._distance
            }
        };
        return r.createViewportQuadCommand(n, {renderState: i, uniformMap: o, owner: e})
    }

    function U(e, t) {
        var r = T.fromCache({depthTest: {enabled: !1}, depthMask: !1, blending: M.ALPHA_BLEND}),
            i = new A({sources: ["precision highp float;\n\nuniform sampler2D u_resultTexture;\nuniform vec4 u_visibleAreaColor;\nuniform vec4 u_hiddenAreaColor;\n\nvarying vec2 v_textureCoordinates;\n\nvoid main()\n{\n    vec4 color = vec4(0.0);\n    // result.x: 0-不在可视域范围内，0.5-不可见，1.0-可见。\n    vec4 result = texture2D(u_resultTexture, v_textureCoordinates);\n    if (result.x > 0.9)\n       color = u_visibleAreaColor;\n    else if (result.x > 0.4)\n       color = u_hiddenAreaColor;\n    gl_FragColor = color;\n}"]}),
            n = {
                u_resultTexture: function () {
                    return e._lastResultTexture
                }, u_visibleAreaColor: function () {
                    return e._visibleAreaColor
                }, u_hiddenAreaColor: function () {
                    return e._hiddenAreaColor
                }
            };
        return t.createViewportQuadCommand(i, {renderState: r, uniformMap: n, owner: e})
    }


    function Viewshed3D(viewer) {
        this._viewer = viewer;
        this._viewerPosition = new Cartesian3(0, 0, 0);
        this._direction = 0;
        this._pitch = 0;
        this._horizontalFov = 60;
        this._verticalFov = 60;
        this._distance = 100;
        this._visibleAreaColor = new Color(0, 1, 0, 0.5);
        this._hiddenAreaColor = new Color(1, 0, 0, 0.5);
        this._targetPoint = new Cartesian3(0, 0, 0);
        this._modelMatrix = new Matrix4;
        this._lineColor = Color.YELLOW;
        this._hintLineUpdated = false;
        this._initialized = false;
        this._cameraUpdated = false;
        this._indices = undefined;
        this._positions = undefined;
        this._drawLineCommand = undefined;
        this._depthPassState = undefined;
        this._depthCamera = undefined;
        this._textureViewMatrix = new Matrix4;
        this._textureProjMatrix = new Matrix4;
        this._resultFrameBuffer = [];
        this._resultTextures = [];
        this._lastResultTexture = undefined;
        this._parentViewshed = undefined;
        this._childViewsheds = [];
        this._analysisCommand = undefined;
        this._mapDrawCommand = undefined;
        this._valid = false;
    }

    defineProperties(Viewshed3D.prototype, {
        viewerPosition: {
            get: function () {
                return this._viewerPosition
            }, set: function (e) {
                this._viewerPosition = e, this._cameraUpdated = !1
            }
        }, direction: {
            get: function () {
                return this._direction
            }, set: function (e) {
                this._direction = e, this._cameraUpdated = !1
            }
        }, pitch: {
            get: function () {
                return this._pitch
            }, set: function (e) {
                this._pitch = e, this._cameraUpdated = !1
            }
        }, horizontalFov: {
            get: function () {
                return this._horizontalFov
            }, set: function (e) {
                this._horizontalFov = e, this._cameraUpdated = !1, this._hintLineUpdated = !1
            }
        }, verticalFov: {
            get: function () {
                return this._verticalFov
            }, set: function (e) {
                this._verticalFov = e, this._cameraUpdated = !1, this._hintLineUpdated = !1
            }
        }, distance: {
            get: function () {
                return this._distance
            }, set: function (e) {
                this._distance = e, this._cameraUpdated = !1, this._hintLineUpdated = !1
            }
        }, visibleAreaColor: {
            get: function () {
                return this._visibleAreaColor
            }, set: function (e) {
                this._visibleAreaColor = e
            }
        }, hiddenAreaColor: {
            get: function () {
                return this._hiddenAreaColor
            }, set: function (e) {
                this._hiddenAreaColor = e
            }
        }, lineColor: {
            get: function () {
                return this._lineColor
            }, set: function (e) {
                this._lineColor = e
            }
        }
    });

    Viewshed3D.prototype.setPoseByTargetPoint = function (e) {
        this.distance = r.distance(this._viewerPosition, e);
        var t = new r, i = m.eastNorthUpToFixedFrame(this._viewerPosition);
        h.inverse(i, i), h.multiplyByPoint(i, e, t), r.normalize(t, t), this.direction = c.toDegrees(Math.atan2(t.x, t.y)), this.pitch = c.toDegrees(Math.asin(t.z))
    };

    Viewshed3D.prototype.attachViewshed = function (e) {
        return !(!o(e) || o(e._parentViewshed)) && (this._childViewsheds.push(e), e._parentViewshed = this, !0)
    };

    Viewshed3D.prototype.detachViewshed = function (e) {
        if (!o(e)) return !1;
        for (var t = this._childViewsheds.length, r = 0; r < t; ++r) if (this._childViewsheds[r] === e) return e._childViewsheds.splice(r, 1), e._parentViewshed = void 0, !0;
        return !1
    };

    Viewshed3D.prototype.locateToViewer = function () {
        this._viewer.camera.setView({
            destination: this._depthCamera.position,
            orientation: {direction: this._depthCamera.direction, up: this._depthCamera.up}
        })
    };

    Viewshed3D.prototype.update = function (e) {
        e.viewshed3ds.push(this)
    };

    Viewshed3D.prototype._initialize = function () {
        this._positions = new Float32Array(633), this._indices = new Uint16Array(408);
        var t = this._indices, r = 0;
        t[r++] = 0, t[r++] = 1, t[r++] = 0, t[r++] = 21, t[r++] = 0, t[r++] = 85, t[r++] = 0, t[r++] = 105;
        for (var i = 0, n = 0; n < 5; ++n) {
            i++;
            for (var a = 0; a < 20; ++a) t[r++] = i++, t[r++] = i
        }
        i++;
        for (var s = 0; s < 20; ++s) for (var l = 0; l < 5; ++l) t[r++] = i, t[r++] = 5 + i++;
        var u = this._viewer.scene, c = u._context;
        if (o(this._depthCamera) || (this._depthCamera = new R(u)), !o(this._depthPassState)) {
            var d = new b({
                context: c, depthStencilTexture: new P({
                    context: c, width: 2048, height: 2048,
                    pixelFormat: p.DEPTH_STENCIL, pixelDatatype: w.UNSIGNED_INT_24_8
                })
            });
            this._depthPassState = new S(c), this._depthPassState.viewport = new e(0, 0, 2048, 2048), this._depthPassState.framebuffer = d
        }
        this._initialized = !0
    };

    Viewshed3D.prototype._updateCamera = function () {
        this._depthCamera.frustum.near = .001 * this._distance, this._depthCamera.frustum.far = this._distance, this._depthCamera.frustum.fov = c.toRadians(Math.max(this._horizontalFov, this._verticalFov)), this._depthCamera.frustum.aspectRatio = this._horizontalFov / this._verticalFov, this._depthCamera.setView({
            destination: this._viewerPosition,
            orientation: {heading: c.toRadians(this._direction), pitch: c.toRadians(this._pitch)}
        }), this._modelMatrix = this._depthCamera.inverseViewMatrix, this._cameraUpdated = !0
    };

    Viewshed3D.prototype._updateHintLine = function (e) {
        var i, a, s, d, p = this._positions, m = c.toRadians(this._horizontalFov),
            v = c.toRadians(this._verticalFov), b = Math.tan(.5 * m), S = Math.tan(.5 * v);
        a = this._distance * b, d = this._distance * S, i = -a, s = -d;
        var w = new r(i, s, -this._distance), x = new r(a, d, 0);
        h.multiplyByPoint(this._modelMatrix, w, w), h.multiplyByPoint(this._modelMatrix, x, x);
        var A = t.fromCornerPoints(w, x);
        if (e.cullingVolume.computeVisibility(A) === u.OUTSIDE) return void (this._valid = !1);
        this._valid = !0;
        var P = 0;
        p[P++] = 0, p[P++] = 0, p[P++] = 0;
        for (var D, I, M = Math.PI - .5 * m, R = m / 4, L = 0; L < 5; ++L) {
            D = M + L * R;
            for (var B = d / (this._distance / Math.cos(D)), F = Math.atan(B), U = -F, V = F / 10, z = 0; z < 21; ++z) I = U + z * V, p[P++] = this._distance * Math.cos(I) * Math.sin(D), p[P++] = this._distance * Math.sin(I), p[P++] = this._distance * Math.cos(I) * Math.cos(D)
        }
        R = m / 20;
        for (var G = 0; G < 21; ++G) {
            D = M + G * R;
            for (var B = d / (this._distance / Math.cos(D)), F = Math.atan(B), U = -F, V = F / 2, H = 0; H < 5; ++H) I = U + H * V, p[P++] = this._distance * Math.cos(I) * Math.sin(D), p[P++] = this._distance * Math.sin(I), p[P++] = this._distance * Math.cos(I) * Math.cos(D)
        }
        var W = e.context, j = g.createIndexBuffer({
            context: W,
            typedArray: new Uint32Array(this._indices),
            usage: _.STATIC_DRAW,
            indexDatatype: l.UNSIGNED_INT
        }), q = g.createVertexBuffer({
            context: W,
            typedArray: n.createTypedArray(n.FLOAT, this._positions),
            usage: _.STATIC_DRAW
        }), Y = [];
        Y.push({index: 0, vertexBuffer: q, componentDatatype: n.FLOAT, componentsPerAttribute: 3, normalize: !1});
        var X = new O({context: W, attributes: Y, indexBuffer: j});
        if (o(this._drawLineCommand)) this._drawLineCommand.vertexArray.destroy(), this._drawLineCommand.vertexArray = X, this._drawLineCommand.modelMatrix = this._modelMatrix, this._drawLineCommand.boundingVolume = A; else {
            var Q = E.fromCache({context: W, vertexShaderSource: k, fragmentShaderSource: N}),
                Z = T.fromCache({depthTest: {enabled: !0}}), K = this, J = {
                    u_bgColor: function () {
                        return K._lineColor
                    }, u_modelViewMatrix: function () {
                        return W.uniformState.modelView
                    }
                };
            this._drawLineCommand = new y({
                boundingVolume: A,
                modelMatrix: K._modelMatrix,
                primitiveType: f.LINES,
                vertexArray: X,
                shaderProgram: Q,
                castShadows: !1,
                receiveShadows: !1,
                uniformMap: J,
                renderState: Z,
                pass: C.OPAQUE
            })
        }
        this._hintLineUpdated = !0
    };

    Viewshed3D.prototype.updateDepthMap = function (e) {
        if (0 !== this._distance) {
            this._initialized || this._initialize(), this._cameraUpdated || this._updateCamera();
            var t = this._viewer.scene._frameState;
            if (this._hintLineUpdated || this._updateHintLine(t), this._valid) {
                h.multiply(e._camera.workingFrustums[0].projectionMatrix, e._camera.viewMatrix, this._textureViewMatrix), h.inverse(this._textureViewMatrix, this._textureViewMatrix), h.multiply(this._depthCamera.viewMatrix, this._textureViewMatrix, this._textureViewMatrix), h.clone(this._depthCamera.frustum.projectionMatrix, this._textureProjMatrix);
                var r = new v({depth: 1, framebuffer: this._depthPassState.framebuffer});
                this._viewer.scene.renderDepth(r, this._depthPassState, this._depthCamera)
            }
        }
    };

    Viewshed3D.prototype.execute = function (e, t) {
        if (0 !== this._distance && this._valid && e.draw(this._drawLineCommand, t), !o(this._parentViewshed)) {
            var r = t.viewport.width, n = t.viewport.height;
            if (0 === this._resultTextures.length || this._resultTextures[0].width != r || this._resultTextures[0].height != n) {
                this._resultTextures = [], this._resultFrameBuffer = [];
                for (var a = new x({
                    minificationFilter: I.NEAREST,
                    magnificationFilter: D.NEAREST
                }), s = 0; s < 2; ++s) {
                    var l = new P({
                        context: e,
                        width: r,
                        height: n,
                        pixelFormat: p.RGBA,
                        pixelDatatype: w.UNSIGNED_BYTE,
                        sampler: a
                    });
                    this._resultTextures.push(l);
                    var u = new b({context: e, colorTextures: [l]});
                    this._resultFrameBuffer.push(u)
                }
            }
            var c = new v({color: i.BLACK, framebuffer: this._resultFrameBuffer[0]});
            c.execute(e), this._lastResultTexture = this._resultTextures[0], this._doAnalysis(this, c, e);
            for (var s = 0; s < this._childViewsheds.length; ++s) this._doAnalysis(this._childViewsheds[s], c, e);
            o(this._mapDrawCommand) || (this._mapDrawCommand = U(this, e)), e.draw(this._mapDrawCommand, t)
        }
    };

    Viewshed3D.prototype._doAnalysis = function (e, t, r) {
        if (e._valid) {
            var i = this._lastResultTexture !== this._resultTextures[0] ? this._resultFrameBuffer[0] : this._resultFrameBuffer[1];
            t.framebuffer = i, t.execute(r), o(e._analysisCommand) || (e._analysisCommand = F(e, this, r)), e._analysisCommand.framebuffer = i, r.draw(e._analysisCommand), this._lastResultTexture = i._colorTextures[0]
        }
    };

    Viewshed3D.prototype.destroy = function () {
        return s(this)
    };

    return Viewshed3D;
});