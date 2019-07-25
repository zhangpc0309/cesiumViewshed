define(["../Core/BoundingRectangle", "../Core/Cartesian2", "../Core/Color", "../Core/defined", "../Core/destroyObject", "../Core/PixelFormat", "../Renderer/ClearCommand", "../Renderer/Framebuffer", "../Renderer/PixelDatatype", "../Renderer/Renderbuffer", "../Renderer/RenderbufferFormat", "../Renderer/RenderState", "../Renderer/Sampler", "../Renderer/Texture", "../Renderer/TextureMagnificationFilter", "../Renderer/TextureMinificationFilter", "../Renderer/TextureWrap", "../Shaders/PostProcessFilters/FXAA", "../ThirdParty/Shaders/FXAA3_11"], function (e, t, r, i, n, o, a, s, l, u, c, d, h, p, f, m, g, _, v) {
    "use strict";

    function FXAA() {
        this._texture = void 0, this._depthStencilTexture = void 0, this._depthStencilRenderbuffer = void 0, this._fbo = void 0, this._command = void 0, this._viewport = new e, this._rs = void 0, this._useScissorTest = !1, this._scissorRectangle = void 0;
        var t = new a({color: new r(0, 0, 0, 0), depth: 1, owner: this});
        this._clearCommand = t, this._qualityPreset = 39
    }

    function b(e) {
        e._fbo = e._fbo && e._fbo.destroy(), e._texture = e._texture && e._texture.destroy(), e._depthStencilTexture = e._depthStencilTexture && e._depthStencilTexture.destroy(), e._depthStencilRenderbuffer = e._depthStencilRenderbuffer && e._depthStencilRenderbuffer.destroy(), e._fbo = void 0, e._texture = void 0, e._depthStencilTexture = void 0, e._depthStencilRenderbuffer = void 0, i(e._command) && (e._command.shaderProgram = e._command.shaderProgram && e._command.shaderProgram.destroy(), e._command = void 0)
    }

    FXAA.prototype.update = function (r, n) {
        var a = r.drawingBufferWidth, y = r.drawingBufferHeight, b = this._texture,
            C = !i(b) || b.width !== a || b.height !== y;
        if (C && (this._texture = this._texture && this._texture.destroy(), this._depthStencilTexture = this._depthStencilTexture && this._depthStencilTexture.destroy(), this._depthStencilRenderbuffer = this._depthStencilRenderbuffer && this._depthStencilRenderbuffer.destroy(), this._texture = new p({
            context: r, width: a, height: y, pixelFormat: o.RGBA, pixelDatatype: l.UNSIGNED_BYTE, sampler: new h({
                wrapS: g.CLAMP_TO_EDGE, wrapT: g.CLAMP_TO_EDGE, minificationFilter: m.LINEAR,
                magnificationFilter: f.LINEAR
            })
        }), r.depthTexture ? this._depthStencilTexture = new p({
            context: r,
            width: a,
            height: y,
            pixelFormat: o.DEPTH_STENCIL,
            pixelDatatype: l.UNSIGNED_INT_24_8
        }) : this._depthStencilRenderbuffer = new u({
            context: r,
            width: a,
            height: y,
            format: c.DEPTH_STENCIL
        })), i(this._fbo) && !C || (this._fbo = this._fbo && this._fbo.destroy(), this._fbo = new s({
            context: r,
            colorTextures: [this._texture],
            depthStencilTexture: this._depthStencilTexture,
            depthStencilRenderbuffer: this._depthStencilRenderbuffer,
            destroyAttachments: !1
        })), !i(this._command)) {
            var S = "#define FXAA_QUALITY_PRESET " + this._qualityPreset + "\n" + v + "\n" + _;
            this._command = r.createViewportQuadCommand(S, {owner: this})
        }
        this._viewport.width = a, this._viewport.height = y;
        var w = !e.equals(this._viewport, n.viewport), T = w !== this._useScissorTest;
        if (this._useScissorTest = w, e.equals(this._scissorRectangle, n.viewport) || (this._scissorRectangle = e.clone(n.viewport, this._scissorRectangle), T = !0), i(this._rs) && e.equals(this._rs.viewport, this._viewport) && !T || (this._rs = d.fromCache({
            viewport: this._viewport,
            scissorTest: {enabled: this._useScissorTest, rectangle: this._scissorRectangle}
        })), this._command.renderState = this._rs, C) {
            var x = this, E = new t(1 / this._texture.width, 1 / this._texture.height);
            this._command.uniformMap = {
                u_texture: function () {
                    return x._texture
                }, u_fxaaQualityRcpFrame: function () {
                    return E
                }
            }
        }
    }, FXAA.prototype.execute = function (e, t) {
        this._command.execute(e, t)
    }, FXAA.prototype.clear = function (e, t, i) {
        var n = t.framebuffer;
        t.framebuffer = this._fbo, r.clone(i, this._clearCommand.color), this._clearCommand.execute(e, t), t.framebuffer = n
    }, FXAA.prototype.getColorFramebuffer = function () {
        return this._fbo
    }, FXAA.prototype.isDestroyed = function () {
        return !1
    }, FXAA.prototype.destroy = function () {
        return b(this), n(this)
    };

    return FXAA;
});