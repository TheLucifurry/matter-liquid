const Ee = "#fff";
const d = {
  X: 0,
  Y: 1,
  VEL_X: 2,
  VEL_Y: 3
}, v = {
  ID: 0,
  COLOR: 1,
  COLOR_VEC4: 2,
  TEXTURE: 3,
  MASS: 4
};
function g(t, e, [n, o, r, s]) {
  return t > n && t < r && e > o && e < s;
}
function At(t, e, n) {
  const o = n - e;
  return e + ((t - e) % o + o) % o;
}
function Q(t, e) {
  return t > e ? t : e;
}
function Z(t, e, n) {
  return t < e ? e : t > n ? n : t;
}
function pe(t, e) {
  const n = t.indexOf(e);
  return n !== -1 && t.splice(n, 1), t;
}
function Te(t) {
  const e = t.length, [n, o, r, s, i, c, a, f, u] = t;
  return e < 6 ? [
    +`0x${o}` / 15,
    +`0x${r}` / 15,
    +`0x${s}` / 15,
    e === 5 ? +`0x${i}` / 15 : 1
  ] : [
    +`0x${o}${r}` / 255,
    +`0x${s}${i}` / 255,
    +`0x${c}${a}` / 255,
    e === 9 ? +`0x${f}${u}` / 255 : 1
  ];
}
function xe(t) {
  return Math.hypot(t[0], t[1]);
}
function V(t) {
  const e = Math.hypot(t[0], t[1]);
  return e !== 0 ? [t[0] / e, t[1] / e] : [0, 0];
}
function z(t, e) {
  return [t[0] * e, t[1] * e];
}
function J(t, e) {
  return [t[0] / e, t[1] / e];
}
function Se(t, e) {
  const n = Math.hypot(t[0], t[1]), o = J(t, n || 1);
  return z(o, Z(n, -e, e));
}
function Et(t, e) {
  return [e[0] + t[0], e[1] + t[1]];
}
function he(t, e) {
  return e[0] === t[0] && e[1] === t[1];
}
function rt(t, e) {
  return [e[0] - t[0], e[1] - t[1]];
}
function j(t, e) {
  return [t[0] - e[0], t[1] - e[1]];
}
function ot(t, e) {
  let n = -1;
  const { length: o } = t;
  for (; ++n < o; )
    e(t[n], n);
}
function Ie(t, e, n, o) {
  ot(n, (r, s) => {
    r === null || e && !g(r[d.X], r[d.Y], e) || o(r, s);
  });
}
function st(t, e, n) {
  ot(e, (o) => n(t[o], o));
}
function Be(t, e) {
  const n = t._particles[e];
  return t._spatialHash.getNearby(n[d.X], n[d.Y], t._particles);
}
const Bt = window.Matter;
function Re(t, e) {
  return Bt.Query.region(t, {
    min: { x: e[0], y: e[1] },
    max: { x: e[2], y: e[3] }
  });
}
function Rt(t, e, n) {
  return Bt.Vertices.contains(t.vertices, { x: e, y: n });
}
function be(t, e = 0) {
  return [
    t.min.x - e,
    t.min.y - e,
    t.max.x + e,
    t.max.y + e
  ];
}
function ve(t, e, n, o) {
  const r = [], s = n.getFromBounds(e.bounds);
  for (let i = 0; i < s.length; i++) {
    const c = s[i], a = t[c], f = a[d.X], u = a[d.Y];
    Rt(e, f, u) && r.push(c);
  }
  return r;
}
function Pe(t, e, n, o) {
  const r = (t[0] - e[0]) * (n[1] - o[1]), s = (t[1] - e[1]) * (n[0] - o[0]), i = r - s;
  if (i === 0)
    return null;
  const c = t[0] * e[1] - t[1] * e[0], a = n[0] * o[1] - n[1] * o[0], f = n[0] - o[0], u = t[0] - e[0], l = n[1] - o[1], m = t[1] - e[1], _ = (c * f - u * a) / i, A = (c * l - m * a) / i;
  return [_, A];
}
function Fe(t, e, n, o) {
  const r = (e[0] - t[0]) * (o[1] - n[1]) - (o[0] - n[0]) * (e[1] - t[1]);
  if (r === 0)
    return !1;
  const s = ((o[1] - n[1]) * (o[0] - t[0]) + (n[0] - o[0]) * (o[1] - t[1])) / r, i = ((t[1] - e[1]) * (o[0] - t[0]) + (e[0] - t[0]) * (o[1] - t[1])) / r;
  return s > 0 && s < 1 && i < 1;
}
function Ce(t, e, n) {
  const o = t.vertices;
  for (let r = 0; r < o.length; r++) {
    const s = o[r], i = o[r !== o.length - 1 ? r + 1 : 0], c = [s.x, s.y], a = [i.x, i.y];
    if (Fe(c, a, e, n))
      return [c, a];
  }
  return null;
}
function Le(t, e) {
  const n = V(rt([t[0], t[1]], [e[0], e[1]]));
  return [n[1], -n[0]];
}
const Me = 1;
function Ne(t, e) {
  return rt([t[d.X], t[d.Y]], [e[d.X], e[d.Y]]);
}
function De(t, e) {
  const n = [e.velocity.x, e.velocity.y], o = j([t[d.VEL_X], t[d.VEL_Y]], n), r = V(o), s = j(o, r);
  return j(r, z(s, Me));
}
function pt(t, e, n) {
  const o = e;
  t[d.X] += o[0], t[d.Y] += o[1];
}
function Oe(t, e, n, o) {
  t[d.VEL_X] += e * o * n[0], t[d.VEL_Y] += e * o * n[1];
}
function Ue(t, e) {
  t[d.X] += e * t[d.VEL_X], t[d.Y] += e * t[d.VEL_Y];
}
function ge(t, e, n) {
  t[d.VEL_X] = (t[d.X] - n[0]) / e, t[d.VEL_Y] = (t[d.Y] - n[1]) / e;
}
function Ve(t, e) {
  const [n, o] = Se([t[d.VEL_X], t[d.VEL_Y]], e);
  t[d.VEL_X] = n, t[d.VEL_Y] = o;
}
function ze(t, e, n, o) {
  const r = t._fluidByParticleId[n][v.MASS], s = t._fluidByParticleId[n][v.ID], i = t._h * 0.2, c = 0.3, a = t._h * 0.3;
  t._h * 0.8;
  const f = t._chemicsStore, u = t._fluidByParticleId[n], l = f._isReactableByFid[s] && f._isReadyByFid[s];
  l && (f._data[s][n] = []);
  let m = 0, _ = 0;
  const A = Be(t, n), E = Array(A.length);
  for (let p = 0; p < A.length; p++) {
    const x = A[p], P = t._particles[x], N = Ne(e, P), L = xe(J(N, t._h)), M = Q(1 - L, 0.5);
    m += M ** 2, _ += M ** 3, E[p] = [M, x, N], l && t._fluidByParticleId[x] !== u && f._data[s][n].push(x);
  }
  const S = c * (m - i) * r, h = a * _, R = [0, 0];
  for (let p = 0; p < E.length; p++) {
    const [x, P, N] = E[p], L = t._particles[P], M = V(N), Ae = z(M, o ** 2 * (S * x + h * x ** 2)), H = J(Ae, 2);
    R[0] -= H[0], R[1] -= H[1], pt(L, H), t._spatialHash.update(P, L[0], L[1]);
  }
  pt(e, R), t._spatialHash.update(n, e[0], e[1]);
}
function we(t, e) {
  t[d.VEL_X] -= e[0], t[d.VEL_Y] -= e[1];
}
function ke(t, e, n) {
  const o = [t.position.x, t.position.y];
  if (t.circleRadius) {
    const c = V(rt(o, n));
    return Et(o, z(c, t.circleRadius));
  }
  const r = he(e, n) ? o : n, s = Ce(t, r, e), i = Le(s[0], s[1]);
  return Pe(s[0], s[1], e, Et(e, i));
}
function Ye(t, e, n, o) {
  const { _particles: r } = t;
  (e ? Re(t._world.bodies, e) : t._world.bodies).forEach((i) => {
    const c = ve(r, i, t._spatialHash);
    st(r, c, (a) => {
      if (!g(a[d.X], a[d.Y], n))
        return;
      const f = De(a, i), u = [a[d.X], a[d.Y]];
      if (we(a, f), Rt(i, a[d.X], a[d.Y])) {
        const l = ke(i, u, [a[d.X], a[d.Y]]);
        a[d.X] = l[0], a[d.Y] = l[1];
      }
    });
  });
}
function $e(t, e, n, o) {
  st(t._particles, e, (i, c) => {
    ge(i, n, o[c]);
    const a = t._worldBordersBounce, f = t._bounds;
    if (t._isWrappedX)
      i[d.X] = At(i[d.X], f[0], f[2]);
    else {
      const u = i[d.X];
      i[d.X] = Z(u, f[0], f[2]), u !== i[d.X] && (i[d.VEL_X] *= -a, i[d.VEL_Y] *= a);
    }
    if (t._isWrappedY)
      i[d.Y] = At(i[d.Y], f[1], f[3]);
    else {
      const u = i[d.Y];
      i[d.Y] = Z(u, f[1], f[3]), u !== i[d.Y] && (i[d.VEL_X] *= a, i[d.VEL_Y] *= -a);
    }
    t._spatialHash.update(c, i[d.X], i[d.Y]);
  });
  const r = t._chemicsStore, s = t._fluidByParticleId;
  for (let i = 0; i < r._data.length; i++) {
    if (!r._isReactableByFid[i] || !r._isReadyByFid[i])
      continue;
    const c = r._data[i], a = [], f = [];
    t._fluids.forEach((m, _) => {
      a[_] = [], f[_] = [];
    });
    const u = Object.keys(c);
    for (let m = 0; m < u.length; m++) {
      const _ = +u[m], A = c[_];
      for (let E = 0; E < A.length; E++) {
        const S = A[E], h = s[S][v.ID];
        a[h].push(_), f[h].push(S);
      }
    }
    const l = [a, f];
    r._callbackByFid[i](l);
  }
}
function Xe(t, e) {
  const n = [], o = Matter.Liquid.getGravity(t), r = {}, s = t._isRegionalComputing ? be(t._render.bounds, t._activeBoundsPadding) : null, i = t._bounds, c = t._h * 0.75;
  t._chemicsStore._data = t._fluids.map(() => []), Ie(t, s, t._particles, (a, f) => {
    n.push(f), Oe(a, e, o, t._fluidByParticleId[f][v.MASS]), r[f] = [a[d.X], a[d.Y]], Ve(a, c), Ue(a, e), t._spatialHash.update(f, a[d.X], a[d.Y]);
  }), st(t._particles, n, (a, f) => {
    ze(t, a, f, e);
  }), Ye(t, s, i), $e(t, n, e, r);
}
function it(t, e) {
  if (OffscreenCanvas)
    return new OffscreenCanvas(t, e);
  const n = document.createElement("canvas");
  return n.height = e, n.width = t, n;
}
/* @license twgl.js 4.19.2 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
Available via the MIT license.
see: http://github.com/greggman/twgl.js for details */
const bt = 5120, O = 5121, vt = 5122, Pt = 5123, Ft = 5124, Ct = 5125, Lt = 5126;
function Mt(t) {
  if (t instanceof Int8Array)
    return bt;
  if (t instanceof Uint8Array || t instanceof Uint8ClampedArray)
    return O;
  if (t instanceof Int16Array)
    return vt;
  if (t instanceof Uint16Array)
    return Pt;
  if (t instanceof Int32Array)
    return Ft;
  if (t instanceof Uint32Array)
    return Ct;
  if (t instanceof Float32Array)
    return Lt;
  throw new Error("unsupported typed array type");
}
function Ge(t) {
  if (t === Int8Array)
    return bt;
  if (t === Uint8Array || t === Uint8ClampedArray)
    return O;
  if (t === Int16Array)
    return vt;
  if (t === Uint16Array)
    return Pt;
  if (t === Int32Array)
    return Ft;
  if (t === Uint32Array)
    return Ct;
  if (t === Float32Array)
    return Lt;
  throw new Error("unsupported typed array type");
}
const q = typeof SharedArrayBuffer < "u" ? function(e) {
  return e && e.buffer && (e.buffer instanceof ArrayBuffer || e.buffer instanceof SharedArrayBuffer);
} : function(e) {
  return e && e.buffer && e.buffer instanceof ArrayBuffer;
};
function We(...t) {
  console.error(...t);
}
function He(t, e) {
  return typeof WebGLBuffer < "u" && e instanceof WebGLBuffer;
}
function je(t, e) {
  return typeof WebGLShader < "u" && e instanceof WebGLShader;
}
function Nt(t, e) {
  return typeof WebGLTexture < "u" && e instanceof WebGLTexture;
}
const Dt = 35044, b = 34962, Ke = 34963, Qe = 34660, Ze = 5120, Je = 5121, qe = 5122, tn = 5123, en = 5124, nn = 5125, rn = 5126, Ot = {
  attribPrefix: ""
};
function Ut(t, e, n, o, r) {
  t.bindBuffer(e, n), t.bufferData(e, o, r || Dt);
}
function gt(t, e, n, o) {
  if (He(t, e))
    return e;
  n = n || b;
  const r = t.createBuffer();
  return Ut(t, n, r, e, o), r;
}
function Vt(t) {
  return t === "indices";
}
function on(t) {
  return t instanceof Int8Array || t instanceof Uint8Array;
}
function sn(t) {
  return t === Int8Array || t === Uint8Array;
}
function cn(t) {
  return t.length ? t : t.data;
}
const an = /coord|texture/i, fn = /color|colour/i;
function zt(t, e) {
  let n;
  if (an.test(t) ? n = 2 : fn.test(t) ? n = 4 : n = 3, e % n > 0)
    throw new Error(`Can not guess numComponents for attribute '${t}'. Tried ${n} but ${e} values is not evenly divisible by ${n}. You should specify it.`);
  return n;
}
function un(t, e) {
  return t.numComponents || t.size || zt(e, cn(t).length);
}
function ct(t, e) {
  if (q(t))
    return t;
  if (q(t.data))
    return t.data;
  Array.isArray(t) && (t = {
    data: t
  });
  let n = t.type;
  return n || (Vt(e) ? n = Uint16Array : n = Float32Array), new n(t.data);
}
function ln(t, e) {
  const n = {};
  return Object.keys(e).forEach(function(o) {
    if (!Vt(o)) {
      const r = e[o], s = r.attrib || r.name || r.attribName || Ot.attribPrefix + o;
      if (r.value) {
        if (!Array.isArray(r.value) && !q(r.value))
          throw new Error("array.value is not array or typedarray");
        n[s] = {
          value: r.value
        };
      } else {
        let i, c, a, f;
        if (r.buffer && r.buffer instanceof WebGLBuffer)
          i = r.buffer, f = r.numComponents || r.size, c = r.type, a = r.normalize;
        else if (typeof r == "number" || typeof r.data == "number") {
          const u = r.data || r, l = r.type || Float32Array, m = u * l.BYTES_PER_ELEMENT;
          c = Ge(l), a = r.normalize !== void 0 ? r.normalize : sn(l), f = r.numComponents || r.size || zt(o, u), i = t.createBuffer(), t.bindBuffer(b, i), t.bufferData(b, m, r.drawType || Dt);
        } else {
          const u = ct(r, o);
          i = gt(t, u, void 0, r.drawType), c = Mt(u), a = r.normalize !== void 0 ? r.normalize : on(u), f = un(r, o);
        }
        n[s] = {
          buffer: i,
          numComponents: f,
          type: c,
          normalize: a,
          stride: r.stride || 0,
          offset: r.offset || 0,
          divisor: r.divisor === void 0 ? void 0 : r.divisor,
          drawType: r.drawType
        };
      }
    }
  }), t.bindBuffer(b, null), n;
}
function dn(t, e, n, o) {
  n = ct(n), o !== void 0 ? (t.bindBuffer(b, e.buffer), t.bufferSubData(b, o, n)) : Ut(t, b, e.buffer, n, e.drawType);
}
function mn(t, e) {
  return e === Ze || e === Je ? 1 : e === qe || e === tn ? 2 : e === en || e === nn || e === rn ? 4 : 0;
}
const K = ["position", "positions", "a_position"];
function _n(t, e) {
  let n, o;
  for (o = 0; o < K.length && (n = K[o], !(n in e || (n = Ot.attribPrefix + n, n in e))); ++o)
    ;
  o === K.length && (n = Object.keys(e)[0]);
  const r = e[n];
  t.bindBuffer(b, r.buffer);
  const s = t.getBufferParameter(b, Qe);
  t.bindBuffer(b, null);
  const i = mn(t, r.type), c = s / i, a = r.numComponents || r.size, f = c / a;
  if (f % 1 !== 0)
    throw new Error(`numComponents ${a} not correct for length ${length}`);
  return f;
}
function yn(t, e, n) {
  const o = ln(t, e), r = Object.assign({}, n || {});
  r.attribs = Object.assign({}, n ? n.attribs : {}, o);
  const s = e.indices;
  if (s) {
    const i = ct(s, "indices");
    r.indices = gt(t, i, Ke), r.numElements = i.length, r.elementType = Mt(i);
  } else
    r.numElements || (r.numElements = _n(t, r.attribs));
  return r;
}
function at(t) {
  return !!t.texStorage2D;
}
const wt = function() {
  const t = {}, e = {};
  function n(o) {
    const r = o.constructor.name;
    if (!t[r]) {
      for (const s in o)
        if (typeof o[s] == "number") {
          const i = e[o[s]];
          e[o[s]] = i ? `${i} | ${s}` : s;
        }
      t[r] = !0;
    }
  }
  return function(r, s) {
    return n(r), e[s] || (typeof s == "number" ? `0x${s.toString(16)}` : s);
  };
}(), kt = We;
function Yt(t) {
  return typeof document < "u" && document.getElementById ? document.getElementById(t) : null;
}
const U = 33984, w = 34962, An = 34963, En = 35713, pn = 35714, Tn = 35632, xn = 35633, Sn = 35981, $t = 35718, hn = 35721, In = 35971, Bn = 35382, Rn = 35396, bn = 35398, vn = 35392, Pn = 35395, k = 5126, Xt = 35664, Gt = 35665, Wt = 35666, ft = 5124, Ht = 35667, jt = 35668, Kt = 35669, Qt = 35670, Zt = 35671, Jt = 35672, qt = 35673, te = 35674, ee = 35675, ne = 35676, Fn = 35678, Cn = 35680, Ln = 35679, Mn = 35682, Nn = 35685, Dn = 35686, On = 35687, Un = 35688, gn = 35689, Vn = 35690, zn = 36289, wn = 36292, kn = 36293, ut = 5125, re = 36294, oe = 36295, se = 36296, Yn = 36298, $n = 36299, Xn = 36300, Gn = 36303, Wn = 36306, Hn = 36307, jn = 36308, Kn = 36311, Y = 3553, $ = 34067, lt = 32879, X = 35866, y = {};
function ie(t, e) {
  return y[e].bindPoint;
}
function Qn(t, e) {
  return function(n) {
    t.uniform1f(e, n);
  };
}
function Zn(t, e) {
  return function(n) {
    t.uniform1fv(e, n);
  };
}
function Jn(t, e) {
  return function(n) {
    t.uniform2fv(e, n);
  };
}
function qn(t, e) {
  return function(n) {
    t.uniform3fv(e, n);
  };
}
function tr(t, e) {
  return function(n) {
    t.uniform4fv(e, n);
  };
}
function ce(t, e) {
  return function(n) {
    t.uniform1i(e, n);
  };
}
function ae(t, e) {
  return function(n) {
    t.uniform1iv(e, n);
  };
}
function fe(t, e) {
  return function(n) {
    t.uniform2iv(e, n);
  };
}
function ue(t, e) {
  return function(n) {
    t.uniform3iv(e, n);
  };
}
function le(t, e) {
  return function(n) {
    t.uniform4iv(e, n);
  };
}
function er(t, e) {
  return function(n) {
    t.uniform1ui(e, n);
  };
}
function nr(t, e) {
  return function(n) {
    t.uniform1uiv(e, n);
  };
}
function rr(t, e) {
  return function(n) {
    t.uniform2uiv(e, n);
  };
}
function or(t, e) {
  return function(n) {
    t.uniform3uiv(e, n);
  };
}
function sr(t, e) {
  return function(n) {
    t.uniform4uiv(e, n);
  };
}
function ir(t, e) {
  return function(n) {
    t.uniformMatrix2fv(e, !1, n);
  };
}
function cr(t, e) {
  return function(n) {
    t.uniformMatrix3fv(e, !1, n);
  };
}
function ar(t, e) {
  return function(n) {
    t.uniformMatrix4fv(e, !1, n);
  };
}
function fr(t, e) {
  return function(n) {
    t.uniformMatrix2x3fv(e, !1, n);
  };
}
function ur(t, e) {
  return function(n) {
    t.uniformMatrix3x2fv(e, !1, n);
  };
}
function lr(t, e) {
  return function(n) {
    t.uniformMatrix2x4fv(e, !1, n);
  };
}
function dr(t, e) {
  return function(n) {
    t.uniformMatrix4x2fv(e, !1, n);
  };
}
function mr(t, e) {
  return function(n) {
    t.uniformMatrix3x4fv(e, !1, n);
  };
}
function _r(t, e) {
  return function(n) {
    t.uniformMatrix4x3fv(e, !1, n);
  };
}
function I(t, e, n, o) {
  const r = ie(t, e);
  return at(t) ? function(s) {
    let i, c;
    Nt(t, s) ? (i = s, c = null) : (i = s.texture, c = s.sampler), t.uniform1i(o, n), t.activeTexture(U + n), t.bindTexture(r, i), t.bindSampler(n, c);
  } : function(s) {
    t.uniform1i(o, n), t.activeTexture(U + n), t.bindTexture(r, s);
  };
}
function B(t, e, n, o, r) {
  const s = ie(t, e), i = new Int32Array(r);
  for (let c = 0; c < r; ++c)
    i[c] = n + c;
  return at(t) ? function(c) {
    t.uniform1iv(o, i), c.forEach(function(a, f) {
      t.activeTexture(U + i[f]);
      let u, l;
      Nt(t, a) ? (u = a, l = null) : (u = a.texture, l = a.sampler), t.bindSampler(n, l), t.bindTexture(s, u);
    });
  } : function(c) {
    t.uniform1iv(o, i), c.forEach(function(a, f) {
      t.activeTexture(U + i[f]), t.bindTexture(s, a);
    });
  };
}
y[k] = { Type: Float32Array, size: 4, setter: Qn, arraySetter: Zn };
y[Xt] = { Type: Float32Array, size: 8, setter: Jn };
y[Gt] = { Type: Float32Array, size: 12, setter: qn };
y[Wt] = { Type: Float32Array, size: 16, setter: tr };
y[ft] = { Type: Int32Array, size: 4, setter: ce, arraySetter: ae };
y[Ht] = { Type: Int32Array, size: 8, setter: fe };
y[jt] = { Type: Int32Array, size: 12, setter: ue };
y[Kt] = { Type: Int32Array, size: 16, setter: le };
y[ut] = { Type: Uint32Array, size: 4, setter: er, arraySetter: nr };
y[re] = { Type: Uint32Array, size: 8, setter: rr };
y[oe] = { Type: Uint32Array, size: 12, setter: or };
y[se] = { Type: Uint32Array, size: 16, setter: sr };
y[Qt] = { Type: Uint32Array, size: 4, setter: ce, arraySetter: ae };
y[Zt] = { Type: Uint32Array, size: 8, setter: fe };
y[Jt] = { Type: Uint32Array, size: 12, setter: ue };
y[qt] = { Type: Uint32Array, size: 16, setter: le };
y[te] = { Type: Float32Array, size: 16, setter: ir };
y[ee] = { Type: Float32Array, size: 36, setter: cr };
y[ne] = { Type: Float32Array, size: 64, setter: ar };
y[Nn] = { Type: Float32Array, size: 24, setter: fr };
y[Dn] = { Type: Float32Array, size: 32, setter: lr };
y[On] = { Type: Float32Array, size: 24, setter: ur };
y[Un] = { Type: Float32Array, size: 48, setter: mr };
y[gn] = { Type: Float32Array, size: 32, setter: dr };
y[Vn] = { Type: Float32Array, size: 48, setter: _r };
y[Fn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: Y };
y[Cn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: $ };
y[Ln] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: lt };
y[Mn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: Y };
y[zn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: X };
y[wn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: X };
y[kn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: $ };
y[Yn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: Y };
y[$n] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: lt };
y[Xn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: $ };
y[Gn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: X };
y[Wn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: Y };
y[Hn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: lt };
y[jn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: $ };
y[Kn] = { Type: null, size: 0, setter: I, arraySetter: B, bindPoint: X };
function G(t, e) {
  return function(n) {
    if (n.value)
      switch (t.disableVertexAttribArray(e), n.value.length) {
        case 4:
          t.vertexAttrib4fv(e, n.value);
          break;
        case 3:
          t.vertexAttrib3fv(e, n.value);
          break;
        case 2:
          t.vertexAttrib2fv(e, n.value);
          break;
        case 1:
          t.vertexAttrib1fv(e, n.value);
          break;
        default:
          throw new Error("the length of a float constant value must be between 1 and 4!");
      }
    else
      t.bindBuffer(w, n.buffer), t.enableVertexAttribArray(e), t.vertexAttribPointer(
        e,
        n.numComponents || n.size,
        n.type || k,
        n.normalize || !1,
        n.stride || 0,
        n.offset || 0
      ), n.divisor !== void 0 && t.vertexAttribDivisor(e, n.divisor);
  };
}
function F(t, e) {
  return function(n) {
    if (n.value)
      if (t.disableVertexAttribArray(e), n.value.length === 4)
        t.vertexAttrib4iv(e, n.value);
      else
        throw new Error("The length of an integer constant value must be 4!");
    else
      t.bindBuffer(w, n.buffer), t.enableVertexAttribArray(e), t.vertexAttribIPointer(
        e,
        n.numComponents || n.size,
        n.type || ft,
        n.stride || 0,
        n.offset || 0
      ), n.divisor !== void 0 && t.vertexAttribDivisor(e, n.divisor);
  };
}
function W(t, e) {
  return function(n) {
    if (n.value)
      if (t.disableVertexAttribArray(e), n.value.length === 4)
        t.vertexAttrib4uiv(e, n.value);
      else
        throw new Error("The length of an unsigned integer constant value must be 4!");
    else
      t.bindBuffer(w, n.buffer), t.enableVertexAttribArray(e), t.vertexAttribIPointer(
        e,
        n.numComponents || n.size,
        n.type || ut,
        n.stride || 0,
        n.offset || 0
      ), n.divisor !== void 0 && t.vertexAttribDivisor(e, n.divisor);
  };
}
function dt(t, e, n) {
  const o = n.size, r = n.count;
  return function(s) {
    t.bindBuffer(w, s.buffer);
    const i = s.size || s.numComponents || o, c = i / r, a = s.type || k, u = y[a].size * i, l = s.normalize || !1, m = s.offset || 0, _ = u / r;
    for (let A = 0; A < r; ++A)
      t.enableVertexAttribArray(e + A), t.vertexAttribPointer(
        e + A,
        c,
        a,
        l,
        u,
        m + _ * A
      ), s.divisor !== void 0 && t.vertexAttribDivisor(e + A, s.divisor);
  };
}
const T = {};
T[k] = { size: 4, setter: G };
T[Xt] = { size: 8, setter: G };
T[Gt] = { size: 12, setter: G };
T[Wt] = { size: 16, setter: G };
T[ft] = { size: 4, setter: F };
T[Ht] = { size: 8, setter: F };
T[jt] = { size: 12, setter: F };
T[Kt] = { size: 16, setter: F };
T[ut] = { size: 4, setter: W };
T[re] = { size: 8, setter: W };
T[oe] = { size: 12, setter: W };
T[se] = { size: 16, setter: W };
T[Qt] = { size: 4, setter: F };
T[Zt] = { size: 8, setter: F };
T[Jt] = { size: 12, setter: F };
T[qt] = { size: 16, setter: F };
T[te] = { size: 4, setter: dt, count: 2 };
T[ee] = { size: 9, setter: dt, count: 3 };
T[ne] = { size: 16, setter: dt, count: 4 };
const yr = /ERROR:\s*\d+:(\d+)/gi;
function de(t, e = "", n = 0) {
  const o = [...e.matchAll(yr)], r = new Map(o.map((s, i) => {
    const c = parseInt(s[1]), a = o[i + 1], f = a ? a.index : e.length, u = e.substring(s.index, f);
    return [c - 1, u];
  }));
  return t.split(`
`).map((s, i) => {
    const c = r.get(i);
    return `${i + 1 + n}: ${s}${c ? `

^^^ ${c}` : ""}`;
  }).join(`
`);
}
const Tt = /^[ \t]*\n/;
function me(t, e, n, o) {
  const r = o || kt, s = t.createShader(n);
  let i = 0;
  if (Tt.test(e) && (i = 1, e = e.replace(Tt, "")), t.shaderSource(s, e), t.compileShader(s), !t.getShaderParameter(s, En)) {
    const a = t.getShaderInfoLog(s);
    return r(`${de(e, a, i)}
Error compiling ${wt(t, n)}: ${a}`), t.deleteShader(s), null;
  }
  return s;
}
function mt(t, e, n) {
  let o, r;
  if (typeof e == "function" && (n = e, e = void 0), typeof t == "function")
    n = t, t = void 0;
  else if (t && !Array.isArray(t)) {
    if (t.errorCallback)
      return t;
    const i = t;
    n = i.errorCallback, t = i.attribLocations, o = i.transformFeedbackVaryings, r = i.transformFeedbackMode;
  }
  const s = {
    errorCallback: n || kt,
    transformFeedbackVaryings: o,
    transformFeedbackMode: r
  };
  if (t) {
    let i = {};
    Array.isArray(t) ? t.forEach(function(c, a) {
      i[c] = e ? e[a] : a;
    }) : i = t, s.attribLocations = i;
  }
  return s;
}
const _e = [
  "VERTEX_SHADER",
  "FRAGMENT_SHADER"
];
function Ar(t, e) {
  if (e.indexOf("frag") >= 0)
    return Tn;
  if (e.indexOf("vert") >= 0)
    return xn;
}
function xt(t, e) {
  e.forEach(function(n) {
    t.deleteShader(n);
  });
}
function Er(t, e, n, o, r) {
  const s = mt(n, o, r), i = [], c = [];
  for (let l = 0; l < e.length; ++l) {
    let m = e[l];
    if (typeof m == "string") {
      const _ = Yt(m), A = _ ? _.text : m;
      let E = t[_e[l]];
      _ && _.type && (E = Ar(t, _.type) || E), m = me(t, A, E, s.errorCallback), c.push(m);
    }
    je(t, m) && i.push(m);
  }
  if (i.length !== e.length)
    return s.errorCallback("not enough shaders for program"), xt(t, c), null;
  const a = t.createProgram();
  i.forEach(function(l) {
    t.attachShader(a, l);
  }), s.attribLocations && Object.keys(s.attribLocations).forEach(function(l) {
    t.bindAttribLocation(a, s.attribLocations[l], l);
  });
  let f = s.transformFeedbackVaryings;
  if (f && (f.attribs && (f = f.attribs), Array.isArray(f) || (f = Object.keys(f)), t.transformFeedbackVaryings(a, f, s.transformFeedbackMode || Sn)), t.linkProgram(a), !t.getProgramParameter(a, pn)) {
    const l = t.getProgramInfoLog(a);
    return s.errorCallback(`${i.map((m) => {
      const _ = de(t.getShaderSource(m), "", 0), A = t.getShaderParameter(m, t.SHADER_TYPE);
      return `${wt(t, A)}
${_}}`;
    }).join(`
`)}
Error in program linking: ${l}`), t.deleteProgram(a), xt(t, c), null;
  }
  return a;
}
function pr(t, e, n, o, r) {
  const s = mt(n, o, r), i = [];
  for (let c = 0; c < e.length; ++c) {
    const a = me(
      t,
      e[c],
      t[_e[c]],
      s.errorCallback
    );
    if (!a)
      return null;
    i.push(a);
  }
  return Er(t, i, s);
}
function _t(t) {
  const e = t.name;
  return e.startsWith("gl_") || e.startsWith("webgl_");
}
function Tr(t, e) {
  let n = 0;
  function o(i, c, a) {
    const f = c.name.endsWith("[0]"), u = c.type, l = y[u];
    if (!l)
      throw new Error(`unknown type: 0x${u.toString(16)}`);
    let m;
    if (l.bindPoint) {
      const _ = n;
      n += c.size, f ? m = l.arraySetter(t, u, _, a, c.size) : m = l.setter(t, u, _, a, c.size);
    } else
      l.arraySetter && f ? m = l.arraySetter(t, a) : m = l.setter(t, a);
    return m.location = a, m;
  }
  const r = {}, s = t.getProgramParameter(e, $t);
  for (let i = 0; i < s; ++i) {
    const c = t.getActiveUniform(e, i);
    if (_t(c))
      continue;
    let a = c.name;
    a.endsWith("[0]") && (a = a.substr(0, a.length - 3));
    const f = t.getUniformLocation(e, c.name);
    f && (r[a] = o(e, c, f));
  }
  return r;
}
function xr(t, e) {
  const n = {}, o = t.getProgramParameter(e, In);
  for (let r = 0; r < o; ++r) {
    const s = t.getTransformFeedbackVarying(e, r);
    n[s.name] = {
      index: r,
      type: s.type,
      size: s.size
    };
  }
  return n;
}
function Sr(t, e) {
  const n = t.getProgramParameter(e, $t), o = [], r = [];
  for (let c = 0; c < n; ++c) {
    r.push(c), o.push({});
    const a = t.getActiveUniform(e, c);
    if (_t(a))
      break;
    o[c].name = a.name;
  }
  [
    ["UNIFORM_TYPE", "type"],
    ["UNIFORM_SIZE", "size"],
    // num elements
    ["UNIFORM_BLOCK_INDEX", "blockNdx"],
    ["UNIFORM_OFFSET", "offset"]
  ].forEach(function(c) {
    const a = c[0], f = c[1];
    t.getActiveUniforms(e, r, t[a]).forEach(function(u, l) {
      o[l][f] = u;
    });
  });
  const s = {}, i = t.getProgramParameter(e, Bn);
  for (let c = 0; c < i; ++c) {
    const a = t.getActiveUniformBlockName(e, c), f = {
      index: t.getUniformBlockIndex(e, a),
      usedByVertexShader: t.getActiveUniformBlockParameter(e, c, Rn),
      usedByFragmentShader: t.getActiveUniformBlockParameter(e, c, bn),
      size: t.getActiveUniformBlockParameter(e, c, vn),
      uniformIndices: t.getActiveUniformBlockParameter(e, c, Pn)
    };
    f.used = f.usedByVertexShader || f.usedByFragmentShader, s[a] = f;
  }
  return {
    blockSpecs: s,
    uniformData: o
  };
}
function yt(t, e) {
  const n = t.uniformSetters || t, o = arguments.length;
  for (let r = 1; r < o; ++r) {
    const s = arguments[r];
    if (Array.isArray(s)) {
      const i = s.length;
      for (let c = 0; c < i; ++c)
        yt(n, s[c]);
    } else
      for (const i in s) {
        const c = n[i];
        c && c(s[i]);
      }
  }
}
function hr(t, e) {
  const n = {}, o = t.getProgramParameter(e, hn);
  for (let r = 0; r < o; ++r) {
    const s = t.getActiveAttrib(e, r);
    if (_t(s))
      continue;
    const i = t.getAttribLocation(e, s.name), c = T[s.type], a = c.setter(t, i, c);
    a.location = i, n[s.name] = a;
  }
  return n;
}
function Ir(t, e) {
  for (const n in e) {
    const o = t[n];
    o && o(e[n]);
  }
}
function Br(t, e, n) {
  n.vertexArrayObject ? t.bindVertexArray(n.vertexArrayObject) : (Ir(e.attribSetters || e, n.attribs), n.indices && t.bindBuffer(An, n.indices));
}
function Rr(t, e) {
  const n = Tr(t, e), o = hr(t, e), r = {
    program: e,
    uniformSetters: n,
    attribSetters: o
  };
  return at(t) && (r.uniformBlockSpec = Sr(t, e), r.transformFeedbackInfo = xr(t, e)), r;
}
function br(t, e, n, o, r) {
  const s = mt(n, o, r);
  let i = !0;
  if (e = e.map(function(a) {
    if (a.indexOf(`
`) < 0) {
      const f = Yt(a);
      f ? a = f.text : (s.errorCallback("no element with id: " + a), i = !1);
    }
    return a;
  }), !i)
    return null;
  const c = pr(t, e, s);
  return c ? Rr(t, c) : null;
}
const vr = 4, St = 5123;
function Pr(t, e, n, o, r, s) {
  n = n === void 0 ? vr : n;
  const i = e.indices, c = e.elementType, a = o === void 0 ? e.numElements : o;
  r = r === void 0 ? 0 : r, c || i ? s !== void 0 ? t.drawElementsInstanced(n, a, c === void 0 ? St : e.elementType, r, s) : t.drawElements(n, a, c === void 0 ? St : e.elementType, r) : s !== void 0 ? t.drawArraysInstanced(n, r, a, s) : t.drawArrays(n, r, a);
}
var Fr = `#version 300 es
precision lowp float;

in vec2 a_position;
uniform vec4 u_camera;

void main() {
  vec2 offset = u_camera.xy;
  vec2 resolution = u_camera.zw - offset;

  vec2 position = (a_position - offset) / resolution;
  vec2 clipFlipSpace = (position * 2.0 - 1.0) * vec2(1, -1);

  gl_PointSize = 32.0;
  gl_Position = vec4(clipFlipSpace, 1, 1);
}`, Cr = `#version 300 es
precision lowp float;

uniform vec4 u_color;
out vec4 outColor;

float intensivity = 3.0;

void main() {
    float alpha = (0.5 - length(gl_PointCoord - 0.5)) * intensivity;
    outColor = vec4(u_color.rgb, alpha);
}`;
const tt = {
  position: "a_position"
};
let C, D;
function Lr(t) {
  C = br(t, [Fr, Cr], [tt.position]), D = yn(t, {
    [tt.position]: { numComponents: 2, data: [] }
  });
}
function Mr(t, e, n) {
  const o = n[v.COLOR_VEC4];
  t.useProgram(C.program), yt(C, { u_color: o }), dn(t, D.attribs[tt.position], e), Br(t, C, D), Pr(t, D, t.POINTS, e.length / 2);
}
function Nr(t) {
  const e = t._renderContext, n = t._render, o = n.context, r = n.bounds, s = r.max.x - r.min.x, i = r.max.y - r.min.y, c = t._statistics._particlesCountByFluidId.map((f) => new Float32Array(f * 2)), a = Array(c.length).fill(0);
  for (let f = 0; f < t._particles.length; f++) {
    const u = t._particles[f];
    if (u === null)
      continue;
    const l = t._fluidByParticleId[f][v.ID], m = c[l];
    m[a[l]] = u[0], m[a[l] + 1] = u[1], a[l] += 2;
  }
  e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.viewport(0, 0, e.canvas.width, e.canvas.height), e.clearColor(0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT), e.useProgram(C.program), e.enable(e.BLEND), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), e.blendFunc(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA), yt(C, {
    u_camera: [r.min.x, r.min.y, r.max.x, r.max.y]
  }), c.forEach((f, u) => Mr(e, f, t._fluids[u])), o.drawImage(e.canvas, r.min.x, r.min.y, s, i);
}
function Dr(t, e) {
  const n = it(e * 6, e * 6), o = n.getContext("2d");
  return o.shadowColor = t, o.shadowBlur = e * 2, o.fillStyle = t, o.beginPath(), o.arc(e * 3, e * 3, e, 0, 2 * Math.PI), o.fill(), n;
}
function Or(t) {
  const { context: e } = t._render;
  Matter.Render.startViewTransform({ ...t._render, context: e }), Nr(t);
}
function Ur(t, e) {
  const n = e.min.x, o = e.min.y, r = Math.round((e.max.x - e.min.x) / t);
  function s(u, l) {
    return l * r + u;
  }
  function i(u, l, m) {
    const _ = u.h[m];
    typeof _ > "u" ? (u.h[m] = [l], u.p[l] = m) : _.includes(l) || (_.push(l), u.p[l] = m);
  }
  function c(u, l, m) {
    return u.h[s(l, m)] || [];
  }
  function a(u, l, m) {
    const _ = u.h[m];
    pe(_, l), delete u.p[l];
  }
  const f = {
    h: [],
    p: {},
    // clear: (): void => {
    //   sh.h = {};
    //   sh.p = {};
    // },
    update: (u, l, m) => {
      const _ = Math.trunc((l - n) / t), A = Math.trunc((m - o) / t), E = f.p[u], S = s(_, A);
      E !== S && (typeof E < "u" && a(f, u, E), i(f, u, S));
    },
    insert: (u, l, m) => {
      const _ = Math.trunc((l - n) / t), A = Math.trunc((m - o) / t), E = s(_, A);
      i(f, u, E);
    },
    remove: (u) => {
      const l = f.p[u];
      a(f, u, l);
    },
    // Special
    // fill: (particles: TParticle[]): void => {
    //   particles.forEach((part, pid) => {
    //     const x = part[P.X];
    //     const y = part[P.Y];
    //     sh.insert(pid, x, y);
    //   });
    // },
    getNearby: (u, l, m) => {
      const _ = Math.trunc((u - n) / t), A = Math.trunc((l - o) / t), E = [
        ...c(f, _ - 1, A - 1),
        ...c(f, _, A - 1),
        ...c(f, _ + 1, A - 1),
        ...c(f, _ - 1, A),
        ...c(f, _ + 1, A),
        ...c(f, _ - 1, A + 1),
        ...c(f, _, A + 1),
        ...c(f, _ + 1, A + 1)
      ], S = c(f, _, A).slice();
      for (let h = 0; h < E.length; h++) {
        const R = E[h], p = m[R];
        (p[0] - u) ** 2 + (p[1] - l) ** 2 <= t ** 2 && S.push(R);
      }
      return S;
    },
    getFromBounds: (u) => f.getFromRect([u.min.x, u.min.y, u.max.x, u.max.y]),
    getFromRect: (u) => {
      const l = Math.trunc((u[0] - n) / t), m = Math.trunc((u[1] - o) / t), _ = Math.trunc((u[2] - n) / t), A = Math.trunc((u[3] - o) / t), E = [];
      for (let S = m; S <= A; S++)
        for (let h = l; h <= _; h++)
          E.push(...c(f, h, S));
      return E;
    }
  };
  return Object.seal(f);
}
const gr = [
  "pauseChange",
  "particleRemove"
];
function Vr() {
  const t = {};
  return gr.forEach((e) => t[e] = () => 0), t;
}
const ht = window.Matter;
function zr(t, e, n) {
  const o = e.color || Ee;
  return [
    t,
    o,
    Te(o),
    e.texture || Dr(o, n),
    e.mass || 1
  ];
}
function wr(t) {
  const e = ht.Liquid, n = t.radius || 32, o = !!t.enableChemics, r = n * (t.particleTextureScale || 0.3);
  let s = [!1, !1];
  const i = t.worldWrapping;
  i != null && (s = typeof i == "boolean" ? [i, i] : i);
  const c = {}, a = t.fluids.map((p, x) => (p.name && (c[p.name] = x), zr(x, p, r))), f = t.render.canvas, l = it(f.clientWidth, f.clientHeight).getContext("webgl2", {
    // alpha: false,
    premultipliedAlpha: !1
    // Запрашиваем альфа без предварительного умножения
  }), m = Or, _ = Xe, A = t.updateStep || 2, E = t.bounds, S = t.engine.timing;
  let h = 0;
  const R = {
    _fluidIdByParticleId: c,
    _h: n,
    _isWrappedX: s[0],
    _isWrappedY: s[1],
    _bounds: [E.min.x, E.min.y, E.max.x, E.max.y, E.max.x - E.min.x, E.max.y - E.min.y],
    _engine: t.engine,
    _render: t.render,
    _world: t.engine.world,
    _renderContext: l,
    _isRegionalComputing: t.isRegionalComputing || !1,
    _fluids: a,
    _chemicsStore: t.fluids.reduce((p, x, P) => (p._isReadyByFid[P] = !1, p._iterStepByFid[P] = x.chemicsUS || 10, p._isReactableByFid[P] = !1, p), {
      _isReadyByFid: [],
      _iterStepByFid: [],
      _isReactableByFid: [],
      _data: [],
      _callbackByFid: []
    }),
    _worldBordersBounce: t.bordersBounce || 0.5,
    _isPaused: !1,
    _gravityRatio: t.gravityRatio || 0.2,
    _spatialHash: Ur(n, E),
    _renderBoundsPadding: 0,
    _activeBoundsPadding: 0,
    _particles: [],
    _freeParticleIds: [],
    _fluidByParticleId: {},
    _timeDelta: t.timeScale || 1,
    _events: Vr(),
    _statistics: {
      _particlesCountByFluidId: a.map(() => 0)
    },
    _updateCompute: () => {
      if (h++ % A === 0) {
        if (o) {
          const p = R._chemicsStore._isReadyByFid;
          for (let x = 0; x < p.length; x++)
            p[x] = (h - x) % R._chemicsStore._iterStepByFid[x] === 0;
        }
        _(R, S.timeScale * R._timeDelta);
      }
    }
  };
  return Lr(l), ht.Events.on(t.render, "afterRender", () => m(R)), e.setPause(R, !!t.isPaused), Object.seal(R);
}
const et = {
  trans(t, e, n) {
    const o = t._fluidByParticleId, r = t._fluids[n];
    e.forEach((s) => {
      const i = t._fluidByParticleId[s];
      o[s] = r, t._statistics._particlesCountByFluidId[i[v.ID]]--, t._statistics._particlesCountByFluidId[r[v.ID]]++;
    });
  },
  transByName(t, e, n) {
    et.trans(t, e, Matter.Liquid.getFluidId(t, n));
  },
  transRect(t, e, n, o, r, s) {
    const i = Matter.Liquid.getFluidId(t, e), c = [];
    t._particles.forEach((a, f) => {
      a !== null && g(a[d.X], a[d.Y], [n, o, n + r, o + s]) && c.push(f);
    }), et.trans(t, c, i);
  },
  reacts(t, e, n) {
    const o = Matter.Liquid.getFluidId(t, e);
    t._chemicsStore._isReactableByFid[o] = !0, t._chemicsStore._callbackByFid[o] = n;
  }
  // reactsBody
}, ye = {
  dry(t, e) {
    const n = t._fluidByParticleId[e], o = t._particles[e];
    t._particles[e] = null, t._spatialHash.remove(e), t._events.particleRemove(o, e, n), t._freeParticleIds.includes(e) || t._freeParticleIds.unshift(e), t._statistics._particlesCountByFluidId[n[v.ID]]--;
  },
  rect(t, e, n, o, r) {
    const s = t._spatialHash.getFromRect([e, n, e + o, n + r]);
    ot(s, (i) => {
      const c = t._particles[i];
      c !== null && g(c[d.X], c[d.Y], [e, n, e + o, n + r]) && ye.dry(t, i);
    });
  }
  // TODO: methods circle, shape (using Matter geom) etc.
}, nt = {
  drip(t, e, n, o) {
    const r = t._freeParticleIds.length === 0 ? t._particles.length : t._freeParticleIds.pop(), s = new Float32Array([n, o, 0, 0]);
    t._fluidByParticleId[r] = t._fluids[e], t._particles[r] = s, t._spatialHash.insert(r, n, o), t._statistics._particlesCountByFluidId[e]++;
  },
  rect(t, e, n, o, r, s, i = t._h) {
    const c = Matter.Liquid.getFluidId(t, e), a = i / 2, f = Q(Math.trunc(r / i), 1), u = Q(Math.trunc(s / i), 1);
    for (let l = 0; l < f; l++)
      for (let m = 0; m < u; m++) {
        const _ = n + a + l * i, A = o + a + m * i;
        nt.drip(t, c, _, A), l !== f - 1 && m !== u - 1 && nt.drip(t, c, _ + a, A + a);
      }
  }
  // TODO: methods circle, shape (using Matter geom) etc.
}, It = window.Matter, kr = {
  utils: {
    VirtualCanvas: it
    // ...Utils,
    // ...Cycles,
    // ...Vector,
  },
  create: wr,
  drip: nt,
  dry: ye,
  chemics: et,
  setPause(t, e = !0) {
    e ? It.Events.off(t._engine, "afterUpdate", t._updateCompute) : It.Events.on(t._engine, "afterUpdate", t._updateCompute), t._isPaused = e, t._events.pauseChange(e);
  },
  setRenderBoundsPadding(t, e) {
    t._renderBoundsPadding = e;
  },
  setActiveBoundsPadding(t, e) {
    t._activeBoundsPadding = e;
  },
  setGravityRatio(t, e = t._gravityRatio) {
    t._gravityRatio = e;
  },
  setTimeScale(t, e = t._timeDelta) {
    t._timeDelta = e;
  },
  getGravity(t) {
    return [t._world.gravity.x * t._gravityRatio, t._world.gravity.y * t._gravityRatio];
  },
  getParticlesCount(t) {
    return t._particles.length - t._freeParticleIds.length;
  },
  getFluidId(t, e) {
    return typeof e == "number" ? e : t._fluidIdByParticleId[e];
  }
}, Yr = {
  name: "matter-liquid",
  version: "0.0.1",
  for: "matter-js@0.17.1",
  // uses: [],
  // options: {
  //   something: true,
  // },
  install(t) {
    t.Liquid = kr;
  }
};
Matter.Plugin.register(Yr);
