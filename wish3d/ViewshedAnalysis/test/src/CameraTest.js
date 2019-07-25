define("Scene/Camera", ["../Core/BoundingSphere", "../Core/Cartesian2", "../Core/Cartesian3", "../Core/Cartesian4", "../Core/Cartographic", "../Core/defaultValue", "../Core/defined", "../Core/defineProperties", "../Core/DeveloperError", "../Core/EasingFunction", "../Core/Ellipsoid", "../Core/EllipsoidGeodesic", "../Core/Event", "../Core/HeadingPitchRange", "../Core/HeadingPitchRoll", "../Core/Intersect", "../Core/IntersectionTests", "../Core/Math", "../Core/Matrix3", "../Core/Matrix4", "../Core/OrthographicFrustum", "../Core/OrthographicOffCenterFrustum", "../Core/PerspectiveFrustum", "../Core/Quaternion", "../Core/Ray", "../Core/Rectangle", "../Core/Transforms", "./CameraFlightPath", "./MapMode2D", "./SceneMode"], function (e, t, r, i, n, o, a, s, l, u, c, d, h, p, f, m, g, _, v, y, b, C, S, w, T, x, E, A, P, D) {
    "use strict";

    function I(e) {
        this._scene = e, this._transform = y.clone(y.IDENTITY), this._invTransform = y.clone(y.IDENTITY), this._actualTransform = y.clone(y.IDENTITY), this._actualInvTransform = y.clone(y.IDENTITY), this._transformChanged = !1, this.position = new r, this._position = new r, this._positionWC = new r, this._positionCartographic = new n, this.direction = new r, this._direction = new r, this._directionWC = new r, this.up = new r, this._up = new r, this._upWC = new r, this.right = new r, this._right = new r, this._rightWC = new r, this.frustum = new S, this.frustum.aspectRatio = e.drawingBufferWidth / e.drawingBufferHeight, this.frustum.fov = _.toRadians(60), this.workingFrustums = [], this.defaultMoveAmount = 1e5, this.defaultLookAmount = Math.PI / 60, this.defaultRotateAmount = Math.PI / 3600, this.defaultZoomAmount = 1e5, this.constrainedAxis = void 0, this.maximumZoomFactor = 1.5, this._moveStart = new h, this._moveEnd = new h, this._changed = new h, this._changedPosition = void 0, this._changedDirection = void 0, this._changedFrustum = void 0, this.percentageChanged = .5, this._viewMatrix = new y, this._invViewMatrix = new y, O(this), this._mode = D.SCENE3D, this._modeChanged = !0;
        var t = e.mapProjection;
        this._projection = t, this._maxCoord = t.project(new n(Math.PI, _.PI_OVER_TWO)), this._max2Dfrustum = void 0, this._suspendTerrainAdjustment = !1, Q(this, I.DEFAULT_VIEW_RECTANGLE, this.position, !0);
        var i = r.magnitude(this.position);
        i += i * I.DEFAULT_VIEW_FACTOR, r.normalize(this.position, this.position), r.multiplyByScalar(this.position, i, this.position)
    }

    function O(e) {
        y.computeView(e._position, e._direction, e._up, e._right, e._viewMatrix), y.multiply(e._viewMatrix, e._actualInvTransform, e._viewMatrix), y.inverseTransformation(e._viewMatrix, e._invViewMatrix)
    }

    function M(e) {
        E.basisTo2D(e._projection, e._transform, e._actualTransform)
    }

    function R(e) {
        var t = e._projection, n = t.ellipsoid, o = y.getColumn(e._transform, 3, me),
            a = n.cartesianToCartographic(o, he), s = t.project(a, pe), l = ge;
        l.x = s.z, l.y = s.x, l.z = s.y, l.w = 1;
        var u = i.clone(i.UNIT_X, ye), c = i.add(y.getColumn(e._transform, 0, fe), o, fe);
        n.cartesianToCartographic(c, a), t.project(a, s);
        var d = _e;
        d.x = s.z, d.y = s.x, d.z = s.y, d.w = 0, r.subtract(d, l, d), d.x = 0;
        var h = ve;
        if (r.magnitudeSquared(d) > _.EPSILON10) r.cross(u, d, h); else {
            var p = i.add(y.getColumn(e._transform, 1, fe), o, fe);
            n.cartesianToCartographic(p, a), t.project(a, s), h.x = s.z, h.y = s.x, h.z = s.y, h.w = 0, r.subtract(h, l, h), h.x = 0, r.magnitudeSquared(h) < _.EPSILON10 && (i.clone(i.UNIT_Y, d), i.clone(i.UNIT_Z, h))
        }
        r.cross(h, u, d), r.normalize(d, d), r.cross(u, d, h), r.normalize(h, h), y.setColumn(e._actualTransform, 0, d, e._actualTransform), y.setColumn(e._actualTransform, 1, h, e._actualTransform), y.setColumn(e._actualTransform, 2, u, e._actualTransform), y.setColumn(e._actualTransform, 3, l, e._actualTransform)
    }

    function L(e) {
        var t = e._mode, i = !1, n = 0;
        t === D.SCENE2D && (n = e.frustum.right - e.frustum.left, i = n !== e._positionCartographic.height);
        var o = e._position, a = !r.equals(o, e.position) || i;
        a && (o = r.clone(e.position, e._position));
        var s = e._direction, l = !r.equals(s, e.direction);
        l && (r.normalize(e.direction, e.direction), s = r.clone(e.direction, e._direction));
        var u = e._up, c = !r.equals(u, e.up);
        c && (r.normalize(e.up, e.up), u = r.clone(e.up, e._up));
        var d = e._right, h = !r.equals(d, e.right);
        h && (r.normalize(e.right, e.right), d = r.clone(e.right, e._right));
        var p = e._transformChanged || e._modeChanged;
        e._transformChanged = !1, p && (y.inverseTransformation(e._transform, e._invTransform), e._mode === D.COLUMBUS_VIEW || e._mode === D.SCENE2D ? y.equals(y.IDENTITY, e._transform) ? y.clone(I.TRANSFORM_2D, e._actualTransform) : e._mode === D.COLUMBUS_VIEW ? M(e) : R(e) : y.clone(e._transform, e._actualTransform), y.inverseTransformation(e._actualTransform, e._actualInvTransform), e._modeChanged = !1);
        var f = e._actualTransform;
        if (a || p) if (e._positionWC = y.multiplyByPoint(f, o, e._positionWC), t === D.SCENE3D || t === D.MORPHING) e._positionCartographic = e._projection.ellipsoid.cartesianToCartographic(e._positionWC, e._positionCartographic); else {
            var m = be;
            m.x = e._positionWC.y, m.y = e._positionWC.z, m.z = e._positionWC.x, t === D.SCENE2D && (m.z = n), e._projection.unproject(m, e._positionCartographic)
        }
        if (l || c || h) {
            var g = r.dot(s, r.cross(u, d, be));
            if (Math.abs(1 - g) > _.EPSILON2) {
                var v = 1 / r.magnitudeSquared(u), b = r.dot(u, s) * v, C = r.multiplyByScalar(s, b, be);
                u = r.normalize(r.subtract(u, C, e._up), e._up), r.clone(u, e.up), d = r.cross(s, u, e._right), r.clone(d, e.right)
            }
        }
        (l || p) && (e._directionWC = y.multiplyByPointAsVector(f, s, e._directionWC), r.normalize(e._directionWC, e._directionWC)), (c || p) && (e._upWC = y.multiplyByPointAsVector(f, u, e._upWC), r.normalize(e._upWC, e._upWC)), (h || p) && (e._rightWC = y.multiplyByPointAsVector(f, d, e._rightWC), r.normalize(e._rightWC, e._rightWC)), (a || l || c || h || p) && O(e)
    }

    function N(e, t) {
        var r;
        return r = _.equalsEpsilon(Math.abs(e.z), 1, _.EPSILON3) ? Math.atan2(t.y, t.x) - _.PI_OVER_TWO : Math.atan2(e.y, e.x) - _.PI_OVER_TWO, _.TWO_PI - _.zeroToTwoPi(r)
    }

    function k(e) {
        return _.PI_OVER_TWO - _.acosClamped(e.z)
    }

    function B(e, t, r) {
        var i = 0;
        return _.equalsEpsilon(Math.abs(e.z), 1, _.EPSILON3) || (i = Math.atan2(-r.z, t.z), i = _.zeroToTwoPi(i + _.TWO_PI)), i
    }

    function F(e, t, i) {
        var n = y.clone(e.transform, Oe), o = E.eastNorthUpToFixedFrame(t, e._projection.ellipsoid, Me);
        e._setTransform(o), r.clone(r.ZERO, e.position), i.heading = i.heading - _.PI_OVER_TWO;
        var a = w.fromHeadingPitchRoll(i, Re), s = v.fromQuaternion(a, Le);
        v.getColumn(s, 0, e.direction), v.getColumn(s, 2, e.up), r.cross(e.direction, e.up, e.right), e._setTransform(n), e._adjustOrthographicFrustum(!0)
    }

    function U(e, t, i, n) {
        var o = y.clone(e.transform, Oe);
        if (e._setTransform(y.IDENTITY), !r.equals(t, e.positionWC)) {
            if (n) {
                var a = e._projection, s = a.ellipsoid.cartesianToCartographic(t, Ne);
                t = a.project(s, Ie)
            }
            r.clone(t, e.position)
        }
        i.heading = i.heading - _.PI_OVER_TWO;
        var l = w.fromHeadingPitchRoll(i, Re), u = v.fromQuaternion(l, Le);
        v.getColumn(u, 0, e.direction), v.getColumn(u, 2, e.up), r.cross(e.direction, e.up, e.right), e._setTransform(o), e._adjustOrthographicFrustum(!0)
    }

    function V(e, i, n, o) {
        var a = y.clone(e.transform, Oe);
        if (e._setTransform(y.IDENTITY), !r.equals(i, e.positionWC)) {
            if (o) {
                var s = e._projection, l = s.ellipsoid.cartesianToCartographic(i, Ne);
                i = s.project(l, Ie)
            }
            t.clone(i, e.position);
            var u = .5 * -i.z, c = -u, d = e.frustum;
            if (c > u) {
                var h = d.top / d.right;
                d.right = c, d.left = u, d.top = d.right * h, d.bottom = -d.top
            }
        }
        if (e._scene.mapMode2D === P.ROTATE) {
            n.heading = n.heading - _.PI_OVER_TWO, n.pitch = -_.PI_OVER_TWO, n.roll = 0;
            var p = w.fromHeadingPitchRoll(n, Re), f = v.fromQuaternion(p, Le);
            v.getColumn(f, 2, e.up), r.cross(e.direction, e.up, e.right)
        }
        e._setTransform(a)
    }

    function z(e, t, i, n) {
        var o = r.clone(i.direction, ke), a = r.clone(i.up, Be);
        if (e._scene.mode === D.SCENE3D) {
            var s = e._projection.ellipsoid, l = E.eastNorthUpToFixedFrame(t, s, Ce),
                u = y.inverseTransformation(l, Se);
            y.multiplyByPointAsVector(u, o, o), y.multiplyByPointAsVector(u, a, a)
        }
        var c = r.cross(o, a, Fe);
        return n.heading = N(o, a), n.pitch = k(o), n.roll = B(o, a, c), n
    }

    function G(e, t) {
        var r, i, n = e._scene.mapMode2D === P.ROTATE, o = e._maxCoord.x, a = e._maxCoord.y;
        n ? (i = o, r = -i) : (i = t.x - 2 * o, r = t.x + 2 * o), t.x > o && (t.x = i), t.x < -o && (t.x = r), t.y > a && (t.y = a), t.y < -a && (t.y = -a)
    }

    function H(e, t) {
        var i = e.position, n = r.normalize(i, Ye);
        if (a(e.constrainedAxis)) {
            var o = r.equalsEpsilon(n, e.constrainedAxis, _.EPSILON2),
                s = r.equalsEpsilon(n, r.negate(e.constrainedAxis, Ze), _.EPSILON2);
            if (o || s) (o && t < 0 || s && t > 0) && e.rotate(e.right, t); else {
                var l = r.normalize(e.constrainedAxis, Xe), u = r.dot(n, l), c = _.acosClamped(u);
                t > 0 && t > c && (t = c - _.EPSILON4), u = r.dot(n, r.negate(l, Ze)), c = _.acosClamped(u), t < 0 && -t > c && (t = -c + _.EPSILON4);
                var d = r.cross(l, n, Qe);
                e.rotate(d, t)
            }
        } else e.rotate(e.right, t)
    }

    function W(e, t) {
        a(e.constrainedAxis) ? e.rotate(e.constrainedAxis, t) : e.rotate(e.up, t)
    }

    function j(e, t) {
        var r, i = e.frustum;
        if (t *= .5, Math.abs(i.top) + Math.abs(i.bottom) > Math.abs(i.left) + Math.abs(i.right)) {
            var n = i.top - t, o = i.bottom + t, a = e._maxCoord.y;
            e._scene.mapMode2D === P.ROTATE && (a *= e.maximumZoomFactor), o > a && (o = a, n = -a), n <= o && (n = 1, o = -1), r = i.right / i.top, i.top = n, i.bottom = o, i.right = i.top * r, i.left = -i.right
        } else {
            var s = i.right - t, l = i.left + t, u = e._maxCoord.x;
            e._scene.mapMode2D === P.ROTATE && (u *= e.maximumZoomFactor), s > u && (s = u, l = -u), s <= l && (s = 1, l = -1), r = i.top / i.right, i.right = s, i.left = l, i.top = i.right * r, i.bottom = -i.top
        }
    }

    function q(e, t) {
        e.move(e.direction, t)
    }

    function Y(e, t, i) {
        t = _.clamp(t, -_.PI_OVER_TWO, _.PI_OVER_TWO), e = _.zeroToTwoPi(e) - _.PI_OVER_TWO;
        var n = w.fromAxisAngle(r.UNIT_Y, -t, $e), o = w.fromAxisAngle(r.UNIT_Z, -e, et), a = w.multiply(o, n, o),
            s = v.fromQuaternion(a, tt), l = r.clone(r.UNIT_X, Je);
        return v.multiplyByVector(s, l, l), r.negate(l, l), r.multiplyByScalar(l, i, l), l
    }

    function X(e, t, i, n) {
        return Math.abs(r.dot(t, i)) / n - r.dot(e, i)
    }

    function Q(e, t, i, n) {
        var o = e._projection.ellipsoid, s = n ? e : pt, l = t.north, u = t.south, c = t.east, h = t.west;
        h > c && (c += _.TWO_PI);
        var p, f = .5 * (h + c);
        if (u < -_.PI_OVER_TWO + _.RADIANS_PER_DEGREE && l > _.PI_OVER_TWO - _.RADIANS_PER_DEGREE) p = 0; else {
            var m = it;
            m.longitude = f, m.latitude = l, m.height = 0;
            var g = nt;
            g.longitude = f, g.latitude = u, g.height = 0;
            var v = rt;
            a(v) && v.ellipsoid === o || (rt = v = new d(void 0, void 0, o)), v.setEndPoints(m, g), p = v.interpolateUsingFraction(.5, it).latitude
        }
        var y = it;
        y.longitude = f, y.latitude = p, y.height = 0;
        var C = o.cartographicToCartesian(y, dt), S = it;
        S.longitude = c, S.latitude = l;
        var w = o.cartographicToCartesian(S, ot);
        S.longitude = h;
        var T = o.cartographicToCartesian(S, st);
        S.longitude = f;
        var x = o.cartographicToCartesian(S, ut);
        S.latitude = u;
        var E = o.cartographicToCartesian(S, ct);
        S.longitude = c;
        var A = o.cartographicToCartesian(S, lt);
        S.longitude = h;
        var P = o.cartographicToCartesian(S, at);
        r.subtract(T, C, T), r.subtract(A, C, A), r.subtract(w, C, w), r.subtract(P, C, P), r.subtract(x, C, x), r.subtract(E, C, E);
        var D = o.geodeticSurfaceNormal(C, s.direction);
        r.negate(D, D);
        var I = r.cross(D, r.UNIT_Z, s.right);
        r.normalize(I, I);
        var O, M = r.cross(I, D, s.up);
        if (e.frustum instanceof b) {
            var R, L, N = Math.max(r.distance(w, T), r.distance(A, P)),
                k = Math.max(r.distance(w, A), r.distance(T, P)),
                B = e.frustum._offCenterFrustum.right / e.frustum._offCenterFrustum.top, F = k * B;
            N > F ? (R = N, L = R / B) : (L = k, R = F), O = Math.max(R, L)
        } else {
            var U = Math.tan(.5 * e.frustum.fovy), V = e.frustum.aspectRatio * U;
            if (O = Math.max(X(D, M, T, U), X(D, M, A, U), X(D, M, w, U), X(D, M, P, U), X(D, M, x, U), X(D, M, E, U), X(D, I, T, V), X(D, I, A, V), X(D, I, w, V), X(D, I, P, V), X(D, I, x, V), X(D, I, E, V)), u < 0 && l > 0) {
                var z = it;
                z.longitude = h, z.latitude = 0, z.height = 0;
                var G = o.cartographicToCartesian(z, ht);
                r.subtract(G, C, G), O = Math.max(O, X(D, M, G, U), X(D, I, G, V)), z.longitude = c, G = o.cartographicToCartesian(z, ht), r.subtract(G, C, G), O = Math.max(O, X(D, M, G, U), X(D, I, G, V))
            }
        }
        return r.add(C, r.multiplyByScalar(D, -O, ht), i)
    }

    function Z(e, t, r) {
        var i = e._projection;
        t.west > t.east && (t = x.MAX_VALUE);
        var n = e._actualTransform, o = e._actualInvTransform, s = ft;
        s.longitude = t.east, s.latitude = t.north;
        var l = i.project(s, mt);
        y.multiplyByPoint(n, l, l), y.multiplyByPoint(o, l, l), s.longitude = t.west, s.latitude = t.south;
        var u = i.project(s, gt);
        if (y.multiplyByPoint(n, u, u), y.multiplyByPoint(o, u, u), r.x = .5 * (l.x - u.x) + u.x, r.y = .5 * (l.y - u.y) + u.y, a(e.frustum.fovy)) {
            var c = Math.tan(.5 * e.frustum.fovy), d = e.frustum.aspectRatio * c;
            r.z = .5 * Math.max((l.x - u.x) / d, (l.y - u.y) / c)
        } else {
            var h = l.x - u.x, p = l.y - u.y;
            r.z = Math.max(h, p)
        }
        return r
    }

    function K(e, t, r) {
        var i = e._projection;
        t.west > t.east && (t = x.MAX_VALUE);
        var n = _t;
        n.longitude = t.east, n.latitude = t.north;
        var o = i.project(n, vt);
        n.longitude = t.west, n.latitude = t.south;
        var a, s, l = i.project(n, yt), u = .5 * Math.abs(o.x - l.x), c = .5 * Math.abs(o.y - l.y),
            d = e.frustum.right / e.frustum.top, h = c * d;
        return u > h ? (a = u, s = a / d) : (s = c, a = h), c = Math.max(2 * a, 2 * s), r.x = .5 * (o.x - l.x) + l.x, r.y = .5 * (o.y - l.y) + l.y, n = i.unproject(r, n), n.height = c, r = i.project(n, r)
    }

    function J(e, t, r, i) {
        r = o(r, c.WGS84);
        var n = e.getPickRay(t, bt), a = g.rayEllipsoid(n, r);
        if (a) {
            var s = a.start > 0 ? a.start : a.stop;
            return T.getPoint(n, s, i)
        }
    }

    function $(e, t, r, i) {
        var n = e.getPickRay(t, Ct), o = n.origin;
        o.z = 0;
        var a = r.unproject(o);
        if (!(a.latitude < -_.PI_OVER_TWO || a.latitude > _.PI_OVER_TWO)) return r.ellipsoid.cartographicToCartesian(a, i)
    }

    function ee(e, t, i, n) {
        var o = e.getPickRay(t, St), a = -o.origin.x / o.direction.x;
        T.getPoint(o, a, n);
        var s = i.unproject(new r(n.y, n.z, 0));
        if (!(s.latitude < -_.PI_OVER_TWO || s.latitude > _.PI_OVER_TWO || s.longitude < -Math.PI || s.longitude > Math.PI)) return i.ellipsoid.cartographicToCartesian(s, n)
    }

    function te(e, t, i) {
        var n = e._scene.canvas, o = n.clientWidth, a = n.clientHeight, s = Math.tan(.5 * e.frustum.fovy),
            l = e.frustum.aspectRatio * s, u = e.frustum.near, c = 2 / o * t.x - 1, d = 2 / a * (a - t.y) - 1,
            h = e.positionWC;
        r.clone(h, i.origin);
        var p = r.multiplyByScalar(e.directionWC, u, wt);
        r.add(h, p, p);
        var f = r.multiplyByScalar(e.rightWC, c * u * l, Tt), m = r.multiplyByScalar(e.upWC, d * u * s, xt),
            g = r.add(p, f, i.direction);
        return r.add(g, m, g), r.subtract(g, h, g), r.normalize(g, g), i
    }

    function re(e, t, i) {
        var n = e._scene.canvas, o = n.clientWidth, s = n.clientHeight, l = e.frustum;
        a(l._offCenterFrustum) && (l = l._offCenterFrustum);
        var u = 2 / o * t.x - 1;
        u *= .5 * (l.right - l.left);
        var c = 2 / s * (s - t.y) - 1;
        c *= .5 * (l.top - l.bottom);
        var d = i.origin;
        return r.clone(e.position, d), r.multiplyByScalar(e.right, u, Et), r.add(Et, d, d), r.multiplyByScalar(e.up, c, Et), r.add(Et, d, d), r.clone(e.directionWC, i.direction), e._mode === D.COLUMBUS_VIEW && r.fromElements(i.origin.z, i.origin.x, i.origin.y, i.origin), i
    }

    function ie(e, t, i, n, o, a) {
        function s(i) {
            var n = r.lerp(t, l, i.time, new r);
            e.worldToCameraCoordinatesPoint(n, e.position)
        }

        var l = r.clone(t);
        return i.y > n ? l.y -= i.y - n : i.y < -n && (l.y += -n - i.y), i.z > o ? l.z -= i.z - o : i.z < -o && (l.z += -o - i.z), {
            easingFunction: u.EXPONENTIAL_OUT,
            startObject: {time: 0},
            stopObject: {time: 1},
            duration: a,
            update: s
        }
    }

    function ne(e, t) {
        var i = e.position, n = e.direction, o = e.worldToCameraCoordinatesVector(r.UNIT_X, It),
            a = -r.dot(o, i) / r.dot(o, n), s = r.add(i, r.multiplyByScalar(n, a, Ot), Ot);
        e.cameraToWorldCoordinatesPoint(s, s), i = e.cameraToWorldCoordinatesPoint(e.position, Mt);
        var l = Math.tan(.5 * e.frustum.fovy), u = e.frustum.aspectRatio * l, c = r.magnitude(r.subtract(i, s, Rt)),
            d = u * c, h = l * c, p = e._maxCoord.x, f = e._maxCoord.y, m = Math.max(d - p, p),
            g = Math.max(h - f, f);
        if (i.z < -m || i.z > m || i.y < -g || i.y > g) {
            var _ = s.y < -m || s.y > m, v = s.z < -g || s.z > g;
            if (_ || v) return ie(e, i, s, m, g, t)
        }
    }

    function oe(e, t) {
        var r = e.frustum, i = Math.tan(.5 * r.fovy), n = r.aspectRatio * i;
        return Math.max(t / n, t / i)
    }

    function ae(e, t) {
        var r = e.frustum;
        a(r._offCenterFrustum) && (r = r._offCenterFrustum);
        var i, n, o = r.right / r.top, s = t * o;
        return t > s ? (i = t, n = i / o) : (n = t, i = s), 1.5 * Math.max(i, n)
    }

    function se(e, t, r) {
        a(r) || (r = p.clone(I.DEFAULT_OFFSET));
        var i = r.range;
        if (!a(i) || 0 === i) {
            var n = t.radius;
            0 === n ? r.range = kt : e.frustum instanceof b || e._mode === D.SCENE2D ? r.range = ae(e, n) : r.range = oe(e, n)
        }
        return r
    }

    function le(e, t) {
        var i, n, o = t.radii, a = e.positionWC, s = r.multiplyComponents(t.oneOverRadii, a, jt),
            l = r.magnitude(s), u = r.normalize(s, qt);
        r.equalsEpsilon(u, r.UNIT_Z, _.EPSILON10) ? (i = new r(0, 1, 0), n = new r(0, 0, 1)) : (i = r.normalize(r.cross(r.UNIT_Z, u, Yt), Yt), n = r.normalize(r.cross(u, i, Xt), Xt));
        var c = Math.sqrt(r.magnitudeSquared(s) - 1), d = r.multiplyByScalar(u, 1 / l, jt), h = c / l,
            p = r.multiplyByScalar(i, h, qt), f = r.multiplyByScalar(n, h, Yt), m = r.add(d, f, Qt[0]);
        r.subtract(m, p, m), r.multiplyComponents(o, m, m);
        var g = r.subtract(d, f, Qt[1]);
        r.subtract(g, p, g), r.multiplyComponents(o, g, g);
        var v = r.subtract(d, f, Qt[2]);
        r.add(v, p, v), r.multiplyComponents(o, v, v);
        var y = r.add(d, f, Qt[3]);
        return r.add(y, p, y), r.multiplyComponents(o, y, y), Qt
    }

    function ue(e, t, r, i, n, o) {
        Zt.x = e, Zt.y = t;
        var s = i.pickEllipsoid(Zt, n, Kt);
        return a(s) ? (Jt[r] = n.cartesianToCartographic(s, Jt[r]), 1) : (Jt[r] = n.cartesianToCartographic(o[r], Jt[r]), 0)
    }

    I.TRANSFORM_2D = new y(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1), I.TRANSFORM_2D_INVERSE = y.inverseTransformation(I.TRANSFORM_2D, new y), I.DEFAULT_VIEW_RECTANGLE = x.fromDegrees(100, -20, 120, 90), I.DEFAULT_VIEW_FACTOR = .5, I.DEFAULT_OFFSET = new p(0, -_.PI_OVER_FOUR, 0), I.prototype._updateCameraChanged = function () {
        var e = this;
        if (0 !== e._changed.numberOfListeners) {
            var t = e.percentageChanged;
            if (e._mode === D.SCENE2D) {
                if (!a(e._changedFrustum)) return e._changedPosition = r.clone(e.position, e._changedPosition), void (e._changedFrustum = e.frustum.clone());
                var i, n = e.position, o = e._changedPosition, s = e.frustum, l = e._changedFrustum,
                    u = n.x + s.left, c = n.x + s.right, d = o.x + l.left, h = o.x + l.right, p = n.y + s.bottom,
                    f = n.y + s.top, m = o.y + l.bottom, g = o.y + l.top, v = Math.max(u, d), y = Math.min(c, h),
                    b = Math.max(p, m), C = Math.min(f, g);
                if (v >= y || b >= f) i = 1; else {
                    var S = l;
                    u < d && c > h && p < m && f > g && (S = s), i = 1 - (y - v) * (C - b) / ((S.right - S.left) * (S.top - S.bottom))
                }
                return void (i > t && (e._changed.raiseEvent(i), e._changedPosition = r.clone(e.position, e._changedPosition), e._changedFrustum = e.frustum.clone(e._changedFrustum)))
            }
            if (!a(e._changedDirection)) return e._changedPosition = r.clone(e.positionWC, e._changedPosition), void (e._changedDirection = r.clone(e.directionWC, e._changedDirection));
            var w, T = _.acosClamped(r.dot(e.directionWC, e._changedDirection));
            w = a(e.frustum.fovy) ? T / (.5 * e.frustum.fovy) : T;
            var x = r.distance(e.positionWC, e._changedPosition), E = x / e.positionCartographic.height;
            (w > t || E > t) && (e._changed.raiseEvent(Math.max(w, E)), e._changedPosition = r.clone(e.positionWC, e._changedPosition), e._changedDirection = r.clone(e.directionWC, e._changedDirection))
        }
    };
    var ce = new y, de = new n;
    I.prototype._adjustHeightForTerrain = function () {
        var e = this._scene, t = e.screenSpaceCameraController, i = t.enableCollisionDetection,
            n = t.minimumCollisionTerrainHeight, o = t.minimumZoomDistance;
        if (!this._suspendTerrainAdjustment && i) {
            var s = this._mode, l = e.globe;
            if (a(l) && s !== D.SCENE2D && s !== D.MORPHING) {
                var u, c, d = l.ellipsoid, h = e.mapProjection;
                y.equals(this.transform, y.IDENTITY) || (u = y.clone(this.transform, ce), c = r.magnitude(this.position), this._setTransform(y.IDENTITY));
                var p = de;
                s === D.SCENE3D ? d.cartesianToCartographic(this.position, p) : h.unproject(this.position, p);
                var f = !1;
                if (p.height < n) {
                    var m = l.getHeight(p);
                    a(m) && (m += o, p.height < m && (p.height = m, s === D.SCENE3D ? d.cartographicToCartesian(p, this.position) : h.project(p, this.position), f = !0))
                }
                a(u) && (this._setTransform(u), f && (r.normalize(this.position, this.position), r.negate(this.position, this.direction), r.multiplyByScalar(this.position, Math.max(c, o), this.position), r.normalize(this.direction, this.direction), r.cross(this.direction, this.up, this.right), r.cross(this.right, this.direction, this.up)))
            }
        }
    };
    var he = new n, pe = new r, fe = new r, me = new i, ge = new i, _e = new i, ve = new i, ye = new i, be = new r,
        Ce = new y, Se = new y;
    s(I.prototype, {
        transform: {
            get: function () {
                return this._transform
            }
        }, inverseTransform: {
            get: function () {
                return L(this), this._invTransform
            }
        }, viewMatrix: {
            get: function () {
                return L(this), this._viewMatrix
            }
        }, inverseViewMatrix: {
            get: function () {
                return L(this), this._invViewMatrix
            }
        }, positionCartographic: {
            get: function () {
                return L(this), this._positionCartographic
            }
        }, positionWC: {
            get: function () {
                return L(this), this._positionWC
            }
        }, directionWC: {
            get: function () {
                return L(this), this._directionWC
            }
        }, upWC: {
            get: function () {
                return L(this), this._upWC
            }
        }, rightWC: {
            get: function () {
                return L(this), this._rightWC
            }
        }, heading: {
            get: function () {
                if (this._mode !== D.MORPHING) {
                    var e = this._projection.ellipsoid, t = y.clone(this._transform, Ce),
                        r = E.eastNorthUpToFixedFrame(this.positionWC, e, Se);
                    this._setTransform(r);
                    var i = N(this.direction, this.up);
                    return this._setTransform(t), i
                }
            }
        }, pitch: {
            get: function () {
                if (this._mode !== D.MORPHING) {
                    var e = this._projection.ellipsoid, t = y.clone(this._transform, Ce),
                        r = E.eastNorthUpToFixedFrame(this.positionWC, e, Se);
                    this._setTransform(r);
                    var i = k(this.direction);
                    return this._setTransform(t), i
                }
            }
        }, roll: {
            get: function () {
                if (this._mode !== D.MORPHING) {
                    var e = this._projection.ellipsoid, t = y.clone(this._transform, Ce),
                        r = E.eastNorthUpToFixedFrame(this.positionWC, e, Se);
                    this._setTransform(r);
                    var i = B(this.direction, this.up, this.right);
                    return this._setTransform(t), i
                }
            }
        }, moveStart: {
            get: function () {
                return this._moveStart
            }
        }, moveEnd: {
            get: function () {
                return this._moveEnd
            }
        }, changed: {
            get: function () {
                return this._changed
            }
        }
    }), I.prototype.update = function (e) {
        var t = !1;
        if (e !== this._mode && (this._mode = e, this._modeChanged = e !== D.MORPHING, t = this._mode === D.SCENE2D), t) {
            var r = this._max2Dfrustum = this.frustum.clone(), i = r.top / r.right;
            r.right = 2 * this._maxCoord.x, r.left = -r.right, r.top = i * r.right, r.bottom = -r.top
        }
        this._mode === D.SCENE2D && G(this, this.position);
        var n = this._scene.globe,
            o = !a(n) || n._surface.tileProvider.ready && 0 === n._surface._tileLoadQueueHigh.length && 0 === n._surface._tileLoadQueueMedium.length && 0 === n._surface._tileLoadQueueLow.length && 0 === n._surface._debug.tilesWaitingForChildren;
        this._suspendTerrainAdjustment && (this._suspendTerrainAdjustment = !o), this._adjustHeightForTerrain()
    };
    var we = new r, Te = new r, xe = new r;
    I.prototype._setTransform = function (e) {
        var t = r.clone(this.positionWC, we), i = r.clone(this.upWC, Te), n = r.clone(this.directionWC, xe);
        y.clone(e, this._transform), this._transformChanged = !0, L(this);
        var o = this._actualInvTransform;
        y.multiplyByPoint(o, t, this.position), y.multiplyByPointAsVector(o, n, this.direction), y.multiplyByPointAsVector(o, i, this.up), r.cross(this.direction, this.up, this.right), L(this)
    };
    var Ee = new t, Ae = new T, Pe = new r, De = new r;
    I.prototype._adjustOrthographicFrustum = function (e) {
        if (this.frustum instanceof b && (e || !(this._positionCartographic.height < 15e4))) {
            if (!y.equals(y.IDENTITY, this.transform)) return void (this.frustum.width = r.magnitude(this.position));
            var t, i, n = this._scene, o = n._globe;
            if (a(o)) {
                var s = Ee;
                s.x = n.drawingBufferWidth / 2, s.y = n.drawingBufferHeight / 2;
                var l = this.getPickRay(s, Ae);
                if (t = o.pick(l, n, Pe), n.pickPositionSupported && (i = n.pickPositionWorldCoordinates(s, De)), a(t) && a(i)) {
                    var u = a(i) ? r.distance(i, this.positionWC) : Number.POSITIVE_INFINITY,
                        c = a(t) ? r.distance(t, this.positionWC) : Number.POSITIVE_INFINITY;
                    this.frustum.width = Math.min(u, c)
                } else a(i) ? this.frustum.width = r.distance(i, this.positionWC) : a(t) && (this.frustum.width = r.distance(t, this.positionWC))
            }
            if (!a(o) || !a(t) && !a(i)) {
                var d = Math.max(this.positionCartographic.height, 0);
                this.frustum.width = d
            }
        }
    };
    var Ie = new r, Oe = new y, Me = new y, Re = new w, Le = new v, Ne = new n, ke = new r, Be = new r, Fe = new r,
        Ue = {
            destination: void 0,
            orientation: {direction: void 0, up: void 0, heading: void 0, pitch: void 0, roll: void 0},
            convert: void 0,
            endTransform: void 0
        }, Ve = new f;
    I.prototype.setView = function (e) {
        e = o(e, o.EMPTY_OBJECT);
        var t = o(e.orientation, o.EMPTY_OBJECT), i = this._mode;
        if (i !== D.MORPHING) {
            a(e.endTransform) && this._setTransform(e.endTransform);
            var n = o(e.convert, !0), s = o(e.destination, r.clone(this.positionWC, Ie));
            a(s) && a(s.west) && (s = this.getRectangleCameraCoordinates(s, Ie), n = !1), a(t.direction) && (t = z(this, s, t, Ue.orientation)), Ve.heading = o(t.heading, 0), Ve.pitch = o(t.pitch, -_.PI_OVER_TWO), Ve.roll = o(t.roll, 0), this._suspendTerrainAdjustment = !0, i === D.SCENE3D ? F(this, s, Ve) : i === D.SCENE2D ? V(this, s, Ve, n) : U(this, s, Ve, n)
        }
    };
    var ze = new r;
    I.prototype.flyHome = function (e) {
        var t = this._mode;
        if (t === D.MORPHING && this._scene.completeMorph(), t === D.SCENE2D) this.flyTo({
            destination: I.DEFAULT_VIEW_RECTANGLE,
            duration: e,
            endTransform: y.IDENTITY
        }); else if (t === D.SCENE3D) {
            var i = this.getRectangleCameraCoordinates(I.DEFAULT_VIEW_RECTANGLE), n = r.magnitude(i);
            n += n * I.DEFAULT_VIEW_FACTOR, r.normalize(i, i), r.multiplyByScalar(i, n, i), this.flyTo({
                destination: i,
                duration: e,
                endTransform: y.IDENTITY
            })
        } else if (t === D.COLUMBUS_VIEW) {
            var o = this._projection.ellipsoid.maximumRadius, a = new r(0, -1, 1);
            a = r.multiplyByScalar(r.normalize(a, a), 5 * o, a), this.flyTo({
                destination: a,
                duration: e,
                orientation: {heading: 0, pitch: -Math.acos(r.normalize(a, ze).z), roll: 0},
                endTransform: y.IDENTITY,
                convert: !1
            })
        }
    }, I.prototype.worldToCameraCoordinates = function (e, t) {
        return a(t) || (t = new i), L(this), y.multiplyByVector(this._actualInvTransform, e, t)
    }, I.prototype.worldToCameraCoordinatesPoint = function (e, t) {
        return a(t) || (t = new r), L(this), y.multiplyByPoint(this._actualInvTransform, e, t)
    }, I.prototype.worldToCameraCoordinatesVector = function (e, t) {
        return a(t) || (t = new r), L(this), y.multiplyByPointAsVector(this._actualInvTransform, e, t)
    }, I.prototype.cameraToWorldCoordinates = function (e, t) {
        return a(t) || (t = new i), L(this), y.multiplyByVector(this._actualTransform, e, t)
    }, I.prototype.cameraToWorldCoordinatesPoint = function (e, t) {
        return a(t) || (t = new r), L(this), y.multiplyByPoint(this._actualTransform, e, t)
    }, I.prototype.cameraToWorldCoordinatesVector = function (e, t) {
        return a(t) || (t = new r), L(this), y.multiplyByPointAsVector(this._actualTransform, e, t)
    };
    var Ge = new r;
    I.prototype.move = function (e, t) {
        var i = this.position;
        r.multiplyByScalar(e, t, Ge), r.add(i, Ge, i), this._mode === D.SCENE2D && G(this, i), this._adjustOrthographicFrustum(!0)
    }, I.prototype.moveForward = function (e) {
        e = o(e, this.defaultMoveAmount), this._mode === D.SCENE2D ? j(this, e) : this.move(this.direction, e)
    }, I.prototype.moveBackward = function (e) {
        e = o(e, this.defaultMoveAmount), this._mode === D.SCENE2D ? j(this, -e) : this.move(this.direction, -e)
    }, I.prototype.moveUp = function (e) {
        e = o(e, this.defaultMoveAmount), this.move(this.up, e)
    }, I.prototype.moveDown = function (e) {
        e = o(e, this.defaultMoveAmount), this.move(this.up, -e)
    }, I.prototype.moveRight = function (e) {
        e = o(e, this.defaultMoveAmount), this.move(this.right, e)
    }, I.prototype.moveLeft = function (e) {
        e = o(e, this.defaultMoveAmount), this.move(this.right, -e)
    }, I.prototype.lookLeft = function (e) {
        e = o(e, this.defaultLookAmount), this._mode !== D.SCENE2D && this.look(this.up, -e)
    }, I.prototype.lookRight = function (e) {
        e = o(e, this.defaultLookAmount), this._mode !== D.SCENE2D && this.look(this.up, e)
    }, I.prototype.lookUp = function (e) {
        e = o(e, this.defaultLookAmount), this._mode !== D.SCENE2D && this.look(this.right, -e)
    }, I.prototype.lookDown = function (e) {
        e = o(e, this.defaultLookAmount), this._mode !== D.SCENE2D && this.look(this.right, e)
    };
    var He = new w, We = new v;
    I.prototype.look = function (e, t) {
        var r = o(t, this.defaultLookAmount), i = w.fromAxisAngle(e, -r, He), n = v.fromQuaternion(i, We),
            a = this.direction, s = this.up, l = this.right;
        v.multiplyByVector(n, a, a), v.multiplyByVector(n, s, s), v.multiplyByVector(n, l, l)
    }, I.prototype.twistLeft = function (e) {
        e = o(e, this.defaultLookAmount), this.look(this.direction, e)
    }, I.prototype.twistRight = function (e) {
        e = o(e, this.defaultLookAmount), this.look(this.direction, -e)
    };
    var je = new w, qe = new v;
    I.prototype.rotate = function (e, t) {
        var i = o(t, this.defaultRotateAmount), n = w.fromAxisAngle(e, -i, je), a = v.fromQuaternion(n, qe);
        v.multiplyByVector(a, this.position, this.position), v.multiplyByVector(a, this.direction, this.direction), v.multiplyByVector(a, this.up, this.up), r.cross(this.direction, this.up, this.right), r.cross(this.right, this.direction, this.up), this._adjustOrthographicFrustum(!1)
    }, I.prototype.rotateDown = function (e) {
        e = o(e, this.defaultRotateAmount), H(this, e)
    }, I.prototype.rotateUp = function (e) {
        e = o(e, this.defaultRotateAmount), H(this, -e)
    };
    var Ye = new r, Xe = new r, Qe = new r, Ze = new r;
    I.prototype.rotateRight = function (e) {
        e = o(e, this.defaultRotateAmount), W(this, -e)
    }, I.prototype.rotateLeft = function (e) {
        e = o(e, this.defaultRotateAmount), W(this, e)
    }, I.prototype.zoomIn = function (e) {
        e = o(e, this.defaultZoomAmount), this._mode === D.SCENE2D ? j(this, e) : q(this, e)
    }, I.prototype.zoomOut = function (e) {
        e = o(e, this.defaultZoomAmount), this._mode === D.SCENE2D ? j(this, -e) : q(this, -e)
    }, I.prototype.getMagnitude = function () {
        return this._mode === D.SCENE3D ? r.magnitude(this.position) : this._mode === D.COLUMBUS_VIEW ? Math.abs(this.position.z) : this._mode === D.SCENE2D ? Math.max(this.frustum.right - this.frustum.left, this.frustum.top - this.frustum.bottom) : void 0
    };
    var Ke = new y;
    I.prototype.lookAt = function (e, t) {
        var r = E.eastNorthUpToFixedFrame(e, c.WGS84, Ke);
        this.lookAtTransform(r, t)
    };
    var Je = new r, $e = new w, et = new w, tt = new v;
    I.prototype.lookAtTransform = function (e, i) {
        if (this._setTransform(e), a(i)) {
            var n;
            if (n = a(i.heading) ? Y(i.heading, i.pitch, i.range) : i, this._mode === D.SCENE2D) {
                t.clone(t.ZERO, this.position), r.negate(n, this.up), this.up.z = 0, r.magnitudeSquared(this.up) < _.EPSILON10 && r.clone(r.UNIT_Y, this.up), r.normalize(this.up, this.up), this._setTransform(y.IDENTITY), r.negate(r.UNIT_Z, this.direction), r.cross(this.direction, this.up, this.right), r.normalize(this.right, this.right);
                var o = this.frustum, s = o.top / o.right;
                return o.right = .5 * r.magnitude(n), o.left = -o.right, o.top = s * o.right, o.bottom = -o.top, void this._setTransform(e)
            }
            r.clone(n, this.position), r.negate(this.position, this.direction), r.normalize(this.direction, this.direction), r.cross(this.direction, r.UNIT_Z, this.right), r.magnitudeSquared(this.right) < _.EPSILON10 && r.clone(r.UNIT_X, this.right), r.normalize(this.right, this.right), r.cross(this.right, this.direction, this.up), r.normalize(this.up, this.up), this._adjustOrthographicFrustum(!0)
        }
    };
    var rt, it = new n, nt = new n, ot = new r, at = new r, st = new r, lt = new r, ut = new r, ct = new r,
        dt = new r, ht = new r, pt = {
            direction: new r, right: new r, up: new r
        }, ft = new n, mt = new r, gt = new r, _t = new n, vt = new r, yt = new r;
    I.prototype.getRectangleCameraCoordinates = function (e, t) {
        var i = this._mode;
        return a(t) || (t = new r), i === D.SCENE3D ? Q(this, e, t) : i === D.COLUMBUS_VIEW ? Z(this, e, t) : i === D.SCENE2D ? K(this, e, t) : void 0
    };
    var bt = new T, Ct = new T, St = new T;
    I.prototype.pickEllipsoid = function (e, t, i) {
        var n = this._scene.canvas;
        if (0 !== n.clientWidth && 0 !== n.clientHeight) {
            if (a(i) || (i = new r), t = o(t, c.WGS84), this._mode === D.SCENE3D) i = J(this, e, t, i); else if (this._mode === D.SCENE2D) i = $(this, e, this._projection, i); else {
                if (this._mode !== D.COLUMBUS_VIEW) return;
                i = ee(this, e, this._projection, i)
            }
            return i
        }
    };
    var wt = new r, Tt = new r, xt = new r, Et = new r;
    I.prototype.getPickRay = function (e, t) {
        a(t) || (t = new T);
        var r = this.frustum;
        return a(r.aspectRatio) && a(r.fov) && a(r.near) ? te(this, e, t) : re(this, e, t)
    };
    var At = new r, Pt = new r;
    I.prototype.distanceToBoundingSphere = function (e) {
        var t = r.subtract(this.positionWC, e.center, At),
            i = r.multiplyByScalar(this.directionWC, r.dot(t, this.directionWC), Pt);
        return Math.max(0, r.magnitude(i) - e.radius)
    };
    var Dt = new t;
    I.prototype.getPixelSize = function (e, t, r) {
        var i = this.distanceToBoundingSphere(e), n = this.frustum.getPixelDimensions(t, r, i, Dt);
        return Math.max(n.x, n.y)
    };
    var It = new r, Ot = new r, Mt = new r, Rt = new r;
    I.prototype.createCorrectPositionTween = function (e) {
        if (this._mode === D.COLUMBUS_VIEW) return ne(this, e)
    };
    var Lt = new r, Nt = {
        destination: void 0,
        heading: void 0,
        pitch: void 0,
        roll: void 0,
        duration: void 0,
        complete: void 0,
        cancel: void 0,
        endTransform: void 0,
        maximumHeight: void 0,
        easingFunction: void 0
    };
    I.prototype.cancelFlight = function () {
        a(this._currentFlight) && (this._currentFlight.cancelTween(), this._currentFlight = void 0)
    }, I.prototype.flyTo = function (e) {
        e = o(e, o.EMPTY_OBJECT);
        var t = e.destination;
        if (this._mode !== D.MORPHING) {
            this.cancelFlight();
            var r = o(e.orientation, o.EMPTY_OBJECT);
            if (a(r.direction) && (r = z(this, t, r, Ue.orientation)), a(e.duration) && e.duration <= 0) {
                var i = Ue;
                return i.destination = e.destination, i.orientation.heading = r.heading, i.orientation.pitch = r.pitch, i.orientation.roll = r.roll, i.convert = e.convert, i.endTransform = e.endTransform, this.setView(i), void ("function" == typeof e.complete && e.complete())
            }
            var n = a(t.west);
            n && (t = this.getRectangleCameraCoordinates(t, Lt));
            var s, l = this;
            Nt.destination = t, Nt.heading = r.heading, Nt.pitch = r.pitch, Nt.roll = r.roll, Nt.duration = e.duration, Nt.complete = function () {
                s === l._currentFlight && (l._currentFlight = void 0), a(e.complete) && e.complete()
            }, Nt.cancel = e.cancel, Nt.endTransform = e.endTransform, Nt.convert = !n && e.convert, Nt.maximumHeight = e.maximumHeight, Nt.pitchAdjustHeight = e.pitchAdjustHeight, Nt.flyOverLongitude = e.flyOverLongitude, Nt.flyOverLongitudeWeight = e.flyOverLongitudeWeight, Nt.easingFunction = e.easingFunction;
            var u = this._scene;
            s = u.tweens.add(A.createTween(u, Nt)), this._currentFlight = s
        }
    };
    var kt = 100;
    I.prototype.viewBoundingSphere = function (e, t) {
        t = se(this, e, t), this.lookAt(e.center, t)
    };
    var Bt = new y, Ft = new r, Ut = new r, Vt = new r, zt = new r, Gt = new i, Ht = new w, Wt = new v;
    I.prototype.flyToBoundingSphere = function (e, t) {
        t = o(t, o.EMPTY_OBJECT);
        var i = this._mode === D.SCENE2D || this._mode === D.COLUMBUS_VIEW;
        this._setTransform(y.IDENTITY);
        var n, a = se(this, e, t.offset);
        n = i ? r.multiplyByScalar(r.UNIT_Z, a.range, Ft) : Y(a.heading, a.pitch, a.range);
        var s = E.eastNorthUpToFixedFrame(e.center, c.WGS84, Bt);
        y.multiplyByPoint(s, n, n);
        var l, u;
        if (!i) {
            if (l = r.subtract(e.center, n, Ut), r.normalize(l, l), u = y.multiplyByPointAsVector(s, r.UNIT_Z, Vt), 1 - Math.abs(r.dot(l, u)) < _.EPSILON6) {
                var d = w.fromAxisAngle(l, a.heading, Ht), h = v.fromQuaternion(d, Wt);
                r.fromCartesian4(y.getColumn(s, 1, Gt), u), v.multiplyByVector(h, u, u)
            }
            var p = r.cross(l, u, zt);
            r.cross(p, l, u), r.normalize(u, u)
        }
        this.flyTo({
            destination: n,
            orientation: {direction: l, up: u},
            duration: t.duration,
            complete: t.complete,
            cancel: t.cancel,
            endTransform: t.endTransform,
            maximumHeight: t.maximumHeight,
            easingFunction: t.easingFunction,
            flyOverLongitude: t.flyOverLongitude,
            flyOverLongitudeWeight: t.flyOverLongitudeWeight,
            pitchAdjustHeight: t.pitchAdjustHeight
        })
    };
    var jt = new r, qt = new r, Yt = new r, Xt = new r, Qt = [new r, new r, new r, new r], Zt = new t, Kt = new r,
        Jt = [new n, new n, new n, new n];
    return I.prototype.computeViewRectangle = function (t, i) {
        t = o(t, c.WGS84);
        var n = this.frustum.computeCullingVolume(this.positionWC, this.directionWC, this.upWC),
            a = new e(r.ZERO, t.maximumRadius);
        if (n.computeVisibility(a) !== m.OUTSIDE) {
            var s = this._scene.canvas, l = s.clientWidth, u = s.clientHeight, d = 0, h = le(this, t);
            if (d += ue(0, 0, 0, this, t, h), d += ue(0, u, 1, this, t, h), d += ue(l, u, 2, this, t, h), (d += ue(l, 0, 3, this, t, h)) < 2) return x.MAX_VALUE;
            i = x.fromCartographicArray(Jt, i);
            for (var p = 0, f = Jt[3].longitude, g = 0; g < 4; ++g) {
                var v = Jt[g].longitude, y = Math.abs(v - f);
                y > _.PI ? p += _.TWO_PI - y : p += y, f = v
            }
            return _.equalsEpsilon(Math.abs(p), _.TWO_PI, _.EPSILON9) && (i.west = -_.PI, i.east = _.PI, Jt[0].latitude >= 0 ? i.north = _.PI_OVER_TWO : i.south = -_.PI_OVER_TWO), i
        }
    }, I.prototype.switchToPerspectiveFrustum = function () {
        if (!(this._mode === D.SCENE2D || this.frustum instanceof S)) {
            var e = this._scene;
            this.frustum = new S, this.frustum.aspectRatio = e.drawingBufferWidth / e.drawingBufferHeight, this.frustum.fov = _.toRadians(60)
        }
    }, I.prototype.switchToOrthographicFrustum = function () {
        if (!(this._mode === D.SCENE2D || this.frustum instanceof b)) {
            var e = this._scene;
            this.frustum = new b, this.frustum.aspectRatio = e.drawingBufferWidth / e.drawingBufferHeight, this.frustum.width = r.magnitude(this.position);
            var t = this.frustum.projectionMatrix;
            a(t) && this._adjustOrthographicFrustum(!0)
        }
    }, I.clone = function (e, t) {
        return a(t) || (t = new I(e._scene)), r.clone(e.position, t.position), r.clone(e.direction, t.direction), r.clone(e.up, t.up), r.clone(e.right, t.right), y.clone(e._transform, t.transform), t._transformChanged = !0, t
    }, I
})