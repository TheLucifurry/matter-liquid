const ye = "#fff";
function O(t, e, [n, o, r, s]) {
  return t > n && t < r && e > o && e < s;
}
function mt(t, e, n) {
  const o = n - e;
  return e + ((t - e) % o + o) % o;
}
function j(t, e) {
  return t > e ? t : e;
}
function K(t, e, n) {
  return t < e ? e : t > n ? n : t;
}
function Ae(t, e) {
  const n = t.indexOf(e);
  return n !== -1 && t.splice(n, 1), t;
}
function Ee(t) {
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
function pe(t) {
  return Math.hypot(t[0], t[1]);
}
function U(t) {
  const e = Math.hypot(t[0], t[1]);
  return e !== 0 ? [t[0] / e, t[1] / e] : [0, 0];
}
function g(t, e) {
  return [t[0] * e, t[1] * e];
}
function Q(t, e) {
  return [t[0] / e, t[1] / e];
}
function Te(t, e) {
  const n = Math.hypot(t[0], t[1]), o = Q(t, n || 1);
  return g(o, K(n, -e, e));
}
function yt(t, e) {
  return [e[0] + t[0], e[1] + t[1]];
}
function xe(t, e) {
  return e[0] === t[0] && e[1] === t[1];
}
function et(t, e) {
  return [e[0] - t[0], e[1] - t[1]];
}
function W(t, e) {
  return [t[0] - e[0], t[1] - e[1]];
}
function nt(t, e) {
  let n = -1;
  const { length: o } = t;
  for (; ++n < o; )
    e(t[n], n);
}
function Se(t, e, n, o) {
  nt(n, (r, s) => {
    r === null || e && !O(r[0], r[1], e) || o(r, s);
  });
}
function rt(t, e, n) {
  nt(e, (o) => n(t[o], o));
}
function he(t, e) {
  const n = t._particles[e];
  return t._spatialHash.getNearby(n[0], n[1], t._particles);
}
const ht = window.Matter;
function Ie(t, e) {
  return ht.Query.region(t, {
    min: { x: e[0], y: e[1] },
    max: { x: e[2], y: e[3] }
  });
}
function It(t, e, n) {
  return ht.Vertices.contains(t.vertices, { x: e, y: n });
}
function Be(t, e = 0) {
  return [
    t.min.x - e,
    t.min.y - e,
    t.max.x + e,
    t.max.y + e
  ];
}
function Re(t, e, n, o) {
  const r = [], s = n.getFromBounds(e.bounds);
  for (let i = 0; i < s.length; i++) {
    const c = s[i], a = t[c], f = a[0], u = a[1];
    It(e, f, u) && r.push(c);
  }
  return r;
}
function be(t, e, n, o) {
  const r = (t[0] - e[0]) * (n[1] - o[1]), s = (t[1] - e[1]) * (n[0] - o[0]), i = r - s;
  if (i === 0)
    return null;
  const c = t[0] * e[1] - t[1] * e[0], a = n[0] * o[1] - n[1] * o[0], f = n[0] - o[0], u = t[0] - e[0], l = n[1] - o[1], d = t[1] - e[1], _ = (c * f - u * a) / i, y = (c * l - d * a) / i;
  return [_, y];
}
function ve(t, e, n, o) {
  const r = (e[0] - t[0]) * (o[1] - n[1]) - (o[0] - n[0]) * (e[1] - t[1]);
  if (r === 0)
    return !1;
  const s = ((o[1] - n[1]) * (o[0] - t[0]) + (n[0] - o[0]) * (o[1] - t[1])) / r, i = ((t[1] - e[1]) * (o[0] - t[0]) + (e[0] - t[0]) * (o[1] - t[1])) / r;
  return s > 0 && s < 1 && i < 1;
}
function Fe(t, e, n) {
  const o = t.vertices;
  for (let r = 0; r < o.length; r++) {
    const s = o[r], i = o[r !== o.length - 1 ? r + 1 : 0], c = [s.x, s.y], a = [i.x, i.y];
    if (ve(c, a, e, n))
      return [c, a];
  }
  return null;
}
function Pe(t, e) {
  const n = U(et([t[0], t[1]], [e[0], e[1]]));
  return [n[1], -n[0]];
}
const Ce = 1;
function Le(t, e) {
  return et([t[0], t[1]], [e[0], e[1]]);
}
function Me(t, e) {
  const n = [e.velocity.x, e.velocity.y], o = W([t[2], t[3]], n), r = U(o), s = W(o, r);
  return W(r, g(s, Ce));
}
function At(t, e, n) {
  const o = e;
  t[0] += o[0], t[1] += o[1];
}
function Ne(t, e, n, o) {
  t[2] += e * o * n[0], t[3] += e * o * n[1];
}
function De(t, e) {
  t[0] += e * t[2], t[1] += e * t[3];
}
function Oe(t, e, n) {
  t[2] = (t[0] - n[0]) / e, t[3] = (t[1] - n[1]) / e;
}
function Ue(t, e) {
  const [n, o] = Te([t[2], t[3]], e);
  t[2] = n, t[3] = o;
}
function ge(t, e, n, o) {
  const r = t._fluidByParticleId[n][4], s = t._fluidByParticleId[n][0], i = t._h * 0.2, c = 0.3, a = t._h * 0.3;
  t._h * 0.8;
  const f = t._chemicsStore, u = t._fluidByParticleId[n], l = f._isReactableByFid[s] && f._isReadyByFid[s];
  l && (f._data[s][n] = []);
  let d = 0, _ = 0;
  const y = he(t, n), A = Array(y.length);
  for (let E = 0; E < y.length; E++) {
    const T = y[E], b = t._particles[T], L = Le(e, b), P = pe(Q(L, t._h)), C = j(1 - P, 0.5);
    d += C ** 2, _ += C ** 3, A[E] = [C, T, L], l && t._fluidByParticleId[T] !== u && f._data[s][n].push(T);
  }
  const x = c * (d - i) * r, S = a * _, B = [0, 0];
  for (let E = 0; E < A.length; E++) {
    const [T, b, L] = A[E], P = t._particles[b], C = U(L), me = g(C, o ** 2 * (x * T + S * T ** 2)), G = Q(me, 2);
    B[0] -= G[0], B[1] -= G[1], At(P, G), t._spatialHash.update(b, P[0], P[1]);
  }
  At(e, B), t._spatialHash.update(n, e[0], e[1]);
}
function Ve(t, e) {
  t[2] -= e[0], t[3] -= e[1];
}
function ze(t, e, n) {
  const o = [t.position.x, t.position.y];
  if (t.circleRadius) {
    const c = U(et(o, n));
    return yt(o, g(c, t.circleRadius));
  }
  const r = xe(e, n) ? o : n, s = Fe(t, r, e), i = Pe(s[0], s[1]);
  return be(s[0], s[1], e, yt(e, i));
}
function we(t, e, n, o) {
  const { _particles: r } = t;
  (e ? Ie(t._world.bodies, e) : t._world.bodies).forEach((i) => {
    const c = Re(r, i, t._spatialHash);
    rt(r, c, (a) => {
      if (!O(a[0], a[1], n))
        return;
      const f = Me(a, i), u = [a[0], a[1]];
      if (Ve(a, f), It(i, a[0], a[1])) {
        const l = ze(i, u, [a[0], a[1]]);
        a[0] = l[0], a[1] = l[1];
      }
    });
  });
}
function ke(t, e, n, o) {
  rt(t._particles, e, (i, c) => {
    Oe(i, n, o[c]);
    const a = t._worldBordersBounce, f = t._bounds;
    if (t._isWrappedX)
      i[0] = mt(i[0], f[0], f[2]);
    else {
      const u = i[0];
      i[0] = K(u, f[0], f[2]), u !== i[0] && (i[2] *= -a, i[3] *= a);
    }
    if (t._isWrappedY)
      i[1] = mt(i[1], f[1], f[3]);
    else {
      const u = i[1];
      i[1] = K(u, f[1], f[3]), u !== i[1] && (i[2] *= a, i[3] *= -a);
    }
    t._spatialHash.update(c, i[0], i[1]);
  });
  const r = t._chemicsStore, s = t._fluidByParticleId;
  for (let i = 0; i < r._data.length; i++) {
    if (!r._isReactableByFid[i] || !r._isReadyByFid[i])
      continue;
    const c = r._data[i], a = [], f = [];
    t._fluids.forEach((d, _) => {
      a[_] = [], f[_] = [];
    });
    const u = Object.keys(c);
    for (let d = 0; d < u.length; d++) {
      const _ = +u[d], y = c[_];
      for (let A = 0; A < y.length; A++) {
        const x = y[A], S = s[x][0];
        a[S].push(_), f[S].push(x);
      }
    }
    const l = [a, f];
    r._callbackByFid[i](l);
  }
}
function Ye(t, e) {
  const n = [], o = Matter.Liquid.getGravity(t), r = {}, s = t._isRegionalComputing ? Be(t._render.bounds, t._activeBoundsPadding) : null, i = t._bounds, c = t._h * 0.75;
  t._chemicsStore._data = t._fluids.map(() => []), Se(t, s, t._particles, (a, f) => {
    n.push(f), Ne(a, e, o, t._fluidByParticleId[f][4]), r[f] = [a[0], a[1]], Ue(a, c), De(a, e), t._spatialHash.update(f, a[0], a[1]);
  }), rt(t._particles, n, (a, f) => {
    ge(t, a, f, e);
  }), we(t, s, i), ke(t, n, e, r);
}
function ot(t, e) {
  if (OffscreenCanvas)
    return new OffscreenCanvas(t, e);
  const n = document.createElement("canvas");
  return n.height = e, n.width = t, n;
}
/* @license twgl.js 4.19.2 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
Available via the MIT license.
see: http://github.com/greggman/twgl.js for details */
const Bt = 5120, N = 5121, Rt = 5122, bt = 5123, vt = 5124, Ft = 5125, Pt = 5126;
function Ct(t) {
  if (t instanceof Int8Array)
    return Bt;
  if (t instanceof Uint8Array || t instanceof Uint8ClampedArray)
    return N;
  if (t instanceof Int16Array)
    return Rt;
  if (t instanceof Uint16Array)
    return bt;
  if (t instanceof Int32Array)
    return vt;
  if (t instanceof Uint32Array)
    return Ft;
  if (t instanceof Float32Array)
    return Pt;
  throw new Error("unsupported typed array type");
}
function $e(t) {
  if (t === Int8Array)
    return Bt;
  if (t === Uint8Array || t === Uint8ClampedArray)
    return N;
  if (t === Int16Array)
    return Rt;
  if (t === Uint16Array)
    return bt;
  if (t === Int32Array)
    return vt;
  if (t === Uint32Array)
    return Ft;
  if (t === Float32Array)
    return Pt;
  throw new Error("unsupported typed array type");
}
const Z = typeof SharedArrayBuffer < "u" ? function(e) {
  return e && e.buffer && (e.buffer instanceof ArrayBuffer || e.buffer instanceof SharedArrayBuffer);
} : function(e) {
  return e && e.buffer && e.buffer instanceof ArrayBuffer;
};
function Xe(...t) {
  console.error(...t);
}
function Ge(t, e) {
  return typeof WebGLBuffer < "u" && e instanceof WebGLBuffer;
}
function We(t, e) {
  return typeof WebGLShader < "u" && e instanceof WebGLShader;
}
function Lt(t, e) {
  return typeof WebGLTexture < "u" && e instanceof WebGLTexture;
}
const Mt = 35044, R = 34962, He = 34963, je = 34660, Ke = 5120, Qe = 5121, Ze = 5122, Je = 5123, qe = 5124, tn = 5125, en = 5126, Nt = {
  attribPrefix: ""
};
function Dt(t, e, n, o, r) {
  t.bindBuffer(e, n), t.bufferData(e, o, r || Mt);
}
function Ot(t, e, n, o) {
  if (Ge(t, e))
    return e;
  n = n || R;
  const r = t.createBuffer();
  return Dt(t, n, r, e, o), r;
}
function Ut(t) {
  return t === "indices";
}
function nn(t) {
  return t instanceof Int8Array || t instanceof Uint8Array;
}
function rn(t) {
  return t === Int8Array || t === Uint8Array;
}
function on(t) {
  return t.length ? t : t.data;
}
const sn = /coord|texture/i, cn = /color|colour/i;
function gt(t, e) {
  let n;
  if (sn.test(t) ? n = 2 : cn.test(t) ? n = 4 : n = 3, e % n > 0)
    throw new Error(`Can not guess numComponents for attribute '${t}'. Tried ${n} but ${e} values is not evenly divisible by ${n}. You should specify it.`);
  return n;
}
function an(t, e) {
  return t.numComponents || t.size || gt(e, on(t).length);
}
function st(t, e) {
  if (Z(t))
    return t;
  if (Z(t.data))
    return t.data;
  Array.isArray(t) && (t = {
    data: t
  });
  let n = t.type;
  return n || (Ut(e) ? n = Uint16Array : n = Float32Array), new n(t.data);
}
function fn(t, e) {
  const n = {};
  return Object.keys(e).forEach(function(o) {
    if (!Ut(o)) {
      const r = e[o], s = r.attrib || r.name || r.attribName || Nt.attribPrefix + o;
      if (r.value) {
        if (!Array.isArray(r.value) && !Z(r.value))
          throw new Error("array.value is not array or typedarray");
        n[s] = {
          value: r.value
        };
      } else {
        let i, c, a, f;
        if (r.buffer && r.buffer instanceof WebGLBuffer)
          i = r.buffer, f = r.numComponents || r.size, c = r.type, a = r.normalize;
        else if (typeof r == "number" || typeof r.data == "number") {
          const u = r.data || r, l = r.type || Float32Array, d = u * l.BYTES_PER_ELEMENT;
          c = $e(l), a = r.normalize !== void 0 ? r.normalize : rn(l), f = r.numComponents || r.size || gt(o, u), i = t.createBuffer(), t.bindBuffer(R, i), t.bufferData(R, d, r.drawType || Mt);
        } else {
          const u = st(r, o);
          i = Ot(t, u, void 0, r.drawType), c = Ct(u), a = r.normalize !== void 0 ? r.normalize : nn(u), f = an(r, o);
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
  }), t.bindBuffer(R, null), n;
}
function un(t, e, n, o) {
  n = st(n), o !== void 0 ? (t.bindBuffer(R, e.buffer), t.bufferSubData(R, o, n)) : Dt(t, R, e.buffer, n, e.drawType);
}
function ln(t, e) {
  return e === Ke || e === Qe ? 1 : e === Ze || e === Je ? 2 : e === qe || e === tn || e === en ? 4 : 0;
}
const H = ["position", "positions", "a_position"];
function dn(t, e) {
  let n, o;
  for (o = 0; o < H.length && (n = H[o], !(n in e || (n = Nt.attribPrefix + n, n in e))); ++o)
    ;
  o === H.length && (n = Object.keys(e)[0]);
  const r = e[n];
  t.bindBuffer(R, r.buffer);
  const s = t.getBufferParameter(R, je);
  t.bindBuffer(R, null);
  const i = ln(t, r.type), c = s / i, a = r.numComponents || r.size, f = c / a;
  if (f % 1 !== 0)
    throw new Error(`numComponents ${a} not correct for length ${length}`);
  return f;
}
function _n(t, e, n) {
  const o = fn(t, e), r = Object.assign({}, n || {});
  r.attribs = Object.assign({}, n ? n.attribs : {}, o);
  const s = e.indices;
  if (s) {
    const i = st(s, "indices");
    r.indices = Ot(t, i, He), r.numElements = i.length, r.elementType = Ct(i);
  } else
    r.numElements || (r.numElements = dn(t, r.attribs));
  return r;
}
function it(t) {
  return !!t.texStorage2D;
}
const Vt = function() {
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
}(), zt = Xe;
function wt(t) {
  return typeof document < "u" && document.getElementById ? document.getElementById(t) : null;
}
const D = 33984, V = 34962, mn = 34963, yn = 35713, An = 35714, En = 35632, pn = 35633, Tn = 35981, kt = 35718, xn = 35721, Sn = 35971, hn = 35382, In = 35396, Bn = 35398, Rn = 35392, bn = 35395, z = 5126, Yt = 35664, $t = 35665, Xt = 35666, ct = 5124, Gt = 35667, Wt = 35668, Ht = 35669, jt = 35670, Kt = 35671, Qt = 35672, Zt = 35673, Jt = 35674, qt = 35675, te = 35676, vn = 35678, Fn = 35680, Pn = 35679, Cn = 35682, Ln = 35685, Mn = 35686, Nn = 35687, Dn = 35688, On = 35689, Un = 35690, gn = 36289, Vn = 36292, zn = 36293, at = 5125, ee = 36294, ne = 36295, re = 36296, wn = 36298, kn = 36299, Yn = 36300, $n = 36303, Xn = 36306, Gn = 36307, Wn = 36308, Hn = 36311, w = 3553, k = 34067, ft = 32879, Y = 35866, m = {};
function oe(t, e) {
  return m[e].bindPoint;
}
function jn(t, e) {
  return function(n) {
    t.uniform1f(e, n);
  };
}
function Kn(t, e) {
  return function(n) {
    t.uniform1fv(e, n);
  };
}
function Qn(t, e) {
  return function(n) {
    t.uniform2fv(e, n);
  };
}
function Zn(t, e) {
  return function(n) {
    t.uniform3fv(e, n);
  };
}
function Jn(t, e) {
  return function(n) {
    t.uniform4fv(e, n);
  };
}
function se(t, e) {
  return function(n) {
    t.uniform1i(e, n);
  };
}
function ie(t, e) {
  return function(n) {
    t.uniform1iv(e, n);
  };
}
function ce(t, e) {
  return function(n) {
    t.uniform2iv(e, n);
  };
}
function ae(t, e) {
  return function(n) {
    t.uniform3iv(e, n);
  };
}
function fe(t, e) {
  return function(n) {
    t.uniform4iv(e, n);
  };
}
function qn(t, e) {
  return function(n) {
    t.uniform1ui(e, n);
  };
}
function tr(t, e) {
  return function(n) {
    t.uniform1uiv(e, n);
  };
}
function er(t, e) {
  return function(n) {
    t.uniform2uiv(e, n);
  };
}
function nr(t, e) {
  return function(n) {
    t.uniform3uiv(e, n);
  };
}
function rr(t, e) {
  return function(n) {
    t.uniform4uiv(e, n);
  };
}
function or(t, e) {
  return function(n) {
    t.uniformMatrix2fv(e, !1, n);
  };
}
function sr(t, e) {
  return function(n) {
    t.uniformMatrix3fv(e, !1, n);
  };
}
function ir(t, e) {
  return function(n) {
    t.uniformMatrix4fv(e, !1, n);
  };
}
function cr(t, e) {
  return function(n) {
    t.uniformMatrix2x3fv(e, !1, n);
  };
}
function ar(t, e) {
  return function(n) {
    t.uniformMatrix3x2fv(e, !1, n);
  };
}
function fr(t, e) {
  return function(n) {
    t.uniformMatrix2x4fv(e, !1, n);
  };
}
function ur(t, e) {
  return function(n) {
    t.uniformMatrix4x2fv(e, !1, n);
  };
}
function lr(t, e) {
  return function(n) {
    t.uniformMatrix3x4fv(e, !1, n);
  };
}
function dr(t, e) {
  return function(n) {
    t.uniformMatrix4x3fv(e, !1, n);
  };
}
function h(t, e, n, o) {
  const r = oe(t, e);
  return it(t) ? function(s) {
    let i, c;
    Lt(t, s) ? (i = s, c = null) : (i = s.texture, c = s.sampler), t.uniform1i(o, n), t.activeTexture(D + n), t.bindTexture(r, i), t.bindSampler(n, c);
  } : function(s) {
    t.uniform1i(o, n), t.activeTexture(D + n), t.bindTexture(r, s);
  };
}
function I(t, e, n, o, r) {
  const s = oe(t, e), i = new Int32Array(r);
  for (let c = 0; c < r; ++c)
    i[c] = n + c;
  return it(t) ? function(c) {
    t.uniform1iv(o, i), c.forEach(function(a, f) {
      t.activeTexture(D + i[f]);
      let u, l;
      Lt(t, a) ? (u = a, l = null) : (u = a.texture, l = a.sampler), t.bindSampler(n, l), t.bindTexture(s, u);
    });
  } : function(c) {
    t.uniform1iv(o, i), c.forEach(function(a, f) {
      t.activeTexture(D + i[f]), t.bindTexture(s, a);
    });
  };
}
m[z] = { Type: Float32Array, size: 4, setter: jn, arraySetter: Kn };
m[Yt] = { Type: Float32Array, size: 8, setter: Qn };
m[$t] = { Type: Float32Array, size: 12, setter: Zn };
m[Xt] = { Type: Float32Array, size: 16, setter: Jn };
m[ct] = { Type: Int32Array, size: 4, setter: se, arraySetter: ie };
m[Gt] = { Type: Int32Array, size: 8, setter: ce };
m[Wt] = { Type: Int32Array, size: 12, setter: ae };
m[Ht] = { Type: Int32Array, size: 16, setter: fe };
m[at] = { Type: Uint32Array, size: 4, setter: qn, arraySetter: tr };
m[ee] = { Type: Uint32Array, size: 8, setter: er };
m[ne] = { Type: Uint32Array, size: 12, setter: nr };
m[re] = { Type: Uint32Array, size: 16, setter: rr };
m[jt] = { Type: Uint32Array, size: 4, setter: se, arraySetter: ie };
m[Kt] = { Type: Uint32Array, size: 8, setter: ce };
m[Qt] = { Type: Uint32Array, size: 12, setter: ae };
m[Zt] = { Type: Uint32Array, size: 16, setter: fe };
m[Jt] = { Type: Float32Array, size: 16, setter: or };
m[qt] = { Type: Float32Array, size: 36, setter: sr };
m[te] = { Type: Float32Array, size: 64, setter: ir };
m[Ln] = { Type: Float32Array, size: 24, setter: cr };
m[Mn] = { Type: Float32Array, size: 32, setter: fr };
m[Nn] = { Type: Float32Array, size: 24, setter: ar };
m[Dn] = { Type: Float32Array, size: 48, setter: lr };
m[On] = { Type: Float32Array, size: 32, setter: ur };
m[Un] = { Type: Float32Array, size: 48, setter: dr };
m[vn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: w };
m[Fn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: k };
m[Pn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: ft };
m[Cn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: w };
m[gn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: Y };
m[Vn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: Y };
m[zn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: k };
m[wn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: w };
m[kn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: ft };
m[Yn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: k };
m[$n] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: Y };
m[Xn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: w };
m[Gn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: ft };
m[Wn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: k };
m[Hn] = { Type: null, size: 0, setter: h, arraySetter: I, bindPoint: Y };
function $(t, e) {
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
      t.bindBuffer(V, n.buffer), t.enableVertexAttribArray(e), t.vertexAttribPointer(
        e,
        n.numComponents || n.size,
        n.type || z,
        n.normalize || !1,
        n.stride || 0,
        n.offset || 0
      ), n.divisor !== void 0 && t.vertexAttribDivisor(e, n.divisor);
  };
}
function v(t, e) {
  return function(n) {
    if (n.value)
      if (t.disableVertexAttribArray(e), n.value.length === 4)
        t.vertexAttrib4iv(e, n.value);
      else
        throw new Error("The length of an integer constant value must be 4!");
    else
      t.bindBuffer(V, n.buffer), t.enableVertexAttribArray(e), t.vertexAttribIPointer(
        e,
        n.numComponents || n.size,
        n.type || ct,
        n.stride || 0,
        n.offset || 0
      ), n.divisor !== void 0 && t.vertexAttribDivisor(e, n.divisor);
  };
}
function X(t, e) {
  return function(n) {
    if (n.value)
      if (t.disableVertexAttribArray(e), n.value.length === 4)
        t.vertexAttrib4uiv(e, n.value);
      else
        throw new Error("The length of an unsigned integer constant value must be 4!");
    else
      t.bindBuffer(V, n.buffer), t.enableVertexAttribArray(e), t.vertexAttribIPointer(
        e,
        n.numComponents || n.size,
        n.type || at,
        n.stride || 0,
        n.offset || 0
      ), n.divisor !== void 0 && t.vertexAttribDivisor(e, n.divisor);
  };
}
function ut(t, e, n) {
  const o = n.size, r = n.count;
  return function(s) {
    t.bindBuffer(V, s.buffer);
    const i = s.size || s.numComponents || o, c = i / r, a = s.type || z, u = m[a].size * i, l = s.normalize || !1, d = s.offset || 0, _ = u / r;
    for (let y = 0; y < r; ++y)
      t.enableVertexAttribArray(e + y), t.vertexAttribPointer(
        e + y,
        c,
        a,
        l,
        u,
        d + _ * y
      ), s.divisor !== void 0 && t.vertexAttribDivisor(e + y, s.divisor);
  };
}
const p = {};
p[z] = { size: 4, setter: $ };
p[Yt] = { size: 8, setter: $ };
p[$t] = { size: 12, setter: $ };
p[Xt] = { size: 16, setter: $ };
p[ct] = { size: 4, setter: v };
p[Gt] = { size: 8, setter: v };
p[Wt] = { size: 12, setter: v };
p[Ht] = { size: 16, setter: v };
p[at] = { size: 4, setter: X };
p[ee] = { size: 8, setter: X };
p[ne] = { size: 12, setter: X };
p[re] = { size: 16, setter: X };
p[jt] = { size: 4, setter: v };
p[Kt] = { size: 8, setter: v };
p[Qt] = { size: 12, setter: v };
p[Zt] = { size: 16, setter: v };
p[Jt] = { size: 4, setter: ut, count: 2 };
p[qt] = { size: 9, setter: ut, count: 3 };
p[te] = { size: 16, setter: ut, count: 4 };
const _r = /ERROR:\s*\d+:(\d+)/gi;
function ue(t, e = "", n = 0) {
  const o = [...e.matchAll(_r)], r = new Map(o.map((s, i) => {
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
const Et = /^[ \t]*\n/;
function le(t, e, n, o) {
  const r = o || zt, s = t.createShader(n);
  let i = 0;
  if (Et.test(e) && (i = 1, e = e.replace(Et, "")), t.shaderSource(s, e), t.compileShader(s), !t.getShaderParameter(s, yn)) {
    const a = t.getShaderInfoLog(s);
    return r(`${ue(e, a, i)}
Error compiling ${Vt(t, n)}: ${a}`), t.deleteShader(s), null;
  }
  return s;
}
function lt(t, e, n) {
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
    errorCallback: n || zt,
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
const de = [
  "VERTEX_SHADER",
  "FRAGMENT_SHADER"
];
function mr(t, e) {
  if (e.indexOf("frag") >= 0)
    return En;
  if (e.indexOf("vert") >= 0)
    return pn;
}
function pt(t, e) {
  e.forEach(function(n) {
    t.deleteShader(n);
  });
}
function yr(t, e, n, o, r) {
  const s = lt(n, o, r), i = [], c = [];
  for (let l = 0; l < e.length; ++l) {
    let d = e[l];
    if (typeof d == "string") {
      const _ = wt(d), y = _ ? _.text : d;
      let A = t[de[l]];
      _ && _.type && (A = mr(t, _.type) || A), d = le(t, y, A, s.errorCallback), c.push(d);
    }
    We(t, d) && i.push(d);
  }
  if (i.length !== e.length)
    return s.errorCallback("not enough shaders for program"), pt(t, c), null;
  const a = t.createProgram();
  i.forEach(function(l) {
    t.attachShader(a, l);
  }), s.attribLocations && Object.keys(s.attribLocations).forEach(function(l) {
    t.bindAttribLocation(a, s.attribLocations[l], l);
  });
  let f = s.transformFeedbackVaryings;
  if (f && (f.attribs && (f = f.attribs), Array.isArray(f) || (f = Object.keys(f)), t.transformFeedbackVaryings(a, f, s.transformFeedbackMode || Tn)), t.linkProgram(a), !t.getProgramParameter(a, An)) {
    const l = t.getProgramInfoLog(a);
    return s.errorCallback(`${i.map((d) => {
      const _ = ue(t.getShaderSource(d), "", 0), y = t.getShaderParameter(d, t.SHADER_TYPE);
      return `${Vt(t, y)}
${_}}`;
    }).join(`
`)}
Error in program linking: ${l}`), t.deleteProgram(a), pt(t, c), null;
  }
  return a;
}
function Ar(t, e, n, o, r) {
  const s = lt(n, o, r), i = [];
  for (let c = 0; c < e.length; ++c) {
    const a = le(
      t,
      e[c],
      t[de[c]],
      s.errorCallback
    );
    if (!a)
      return null;
    i.push(a);
  }
  return yr(t, i, s);
}
function dt(t) {
  const e = t.name;
  return e.startsWith("gl_") || e.startsWith("webgl_");
}
function Er(t, e) {
  let n = 0;
  function o(i, c, a) {
    const f = c.name.endsWith("[0]"), u = c.type, l = m[u];
    if (!l)
      throw new Error(`unknown type: 0x${u.toString(16)}`);
    let d;
    if (l.bindPoint) {
      const _ = n;
      n += c.size, f ? d = l.arraySetter(t, u, _, a, c.size) : d = l.setter(t, u, _, a, c.size);
    } else
      l.arraySetter && f ? d = l.arraySetter(t, a) : d = l.setter(t, a);
    return d.location = a, d;
  }
  const r = {}, s = t.getProgramParameter(e, kt);
  for (let i = 0; i < s; ++i) {
    const c = t.getActiveUniform(e, i);
    if (dt(c))
      continue;
    let a = c.name;
    a.endsWith("[0]") && (a = a.substr(0, a.length - 3));
    const f = t.getUniformLocation(e, c.name);
    f && (r[a] = o(e, c, f));
  }
  return r;
}
function pr(t, e) {
  const n = {}, o = t.getProgramParameter(e, Sn);
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
function Tr(t, e) {
  const n = t.getProgramParameter(e, kt), o = [], r = [];
  for (let c = 0; c < n; ++c) {
    r.push(c), o.push({});
    const a = t.getActiveUniform(e, c);
    if (dt(a))
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
  const s = {}, i = t.getProgramParameter(e, hn);
  for (let c = 0; c < i; ++c) {
    const a = t.getActiveUniformBlockName(e, c), f = {
      index: t.getUniformBlockIndex(e, a),
      usedByVertexShader: t.getActiveUniformBlockParameter(e, c, In),
      usedByFragmentShader: t.getActiveUniformBlockParameter(e, c, Bn),
      size: t.getActiveUniformBlockParameter(e, c, Rn),
      uniformIndices: t.getActiveUniformBlockParameter(e, c, bn)
    };
    f.used = f.usedByVertexShader || f.usedByFragmentShader, s[a] = f;
  }
  return {
    blockSpecs: s,
    uniformData: o
  };
}
function _t(t, e) {
  const n = t.uniformSetters || t, o = arguments.length;
  for (let r = 1; r < o; ++r) {
    const s = arguments[r];
    if (Array.isArray(s)) {
      const i = s.length;
      for (let c = 0; c < i; ++c)
        _t(n, s[c]);
    } else
      for (const i in s) {
        const c = n[i];
        c && c(s[i]);
      }
  }
}
function xr(t, e) {
  const n = {}, o = t.getProgramParameter(e, xn);
  for (let r = 0; r < o; ++r) {
    const s = t.getActiveAttrib(e, r);
    if (dt(s))
      continue;
    const i = t.getAttribLocation(e, s.name), c = p[s.type], a = c.setter(t, i, c);
    a.location = i, n[s.name] = a;
  }
  return n;
}
function Sr(t, e) {
  for (const n in e) {
    const o = t[n];
    o && o(e[n]);
  }
}
function hr(t, e, n) {
  n.vertexArrayObject ? t.bindVertexArray(n.vertexArrayObject) : (Sr(e.attribSetters || e, n.attribs), n.indices && t.bindBuffer(mn, n.indices));
}
function Ir(t, e) {
  const n = Er(t, e), o = xr(t, e), r = {
    program: e,
    uniformSetters: n,
    attribSetters: o
  };
  return it(t) && (r.uniformBlockSpec = Tr(t, e), r.transformFeedbackInfo = pr(t, e)), r;
}
function Br(t, e, n, o, r) {
  const s = lt(n, o, r);
  let i = !0;
  if (e = e.map(function(a) {
    if (a.indexOf(`
`) < 0) {
      const f = wt(a);
      f ? a = f.text : (s.errorCallback("no element with id: " + a), i = !1);
    }
    return a;
  }), !i)
    return null;
  const c = Ar(t, e, s);
  return c ? Ir(t, c) : null;
}
const Rr = 4, Tt = 5123;
function br(t, e, n, o, r, s) {
  n = n === void 0 ? Rr : n;
  const i = e.indices, c = e.elementType, a = o === void 0 ? e.numElements : o;
  r = r === void 0 ? 0 : r, c || i ? s !== void 0 ? t.drawElementsInstanced(n, a, c === void 0 ? Tt : e.elementType, r, s) : t.drawElements(n, a, c === void 0 ? Tt : e.elementType, r) : s !== void 0 ? t.drawArraysInstanced(n, r, a, s) : t.drawArrays(n, r, a);
}
var vr = `#version 300 es
precision lowp float;in vec2 a_position;uniform vec4 u_camera;void main(){vec2 offset=u_camera.xy;vec2 resolution=u_camera.zw-offset;vec2 position=(a_position-offset)/resolution;vec2 clipFlipSpace=(position*2.0-1.0)*vec2(1,-1);gl_PointSize=32.0;gl_Position=vec4(clipFlipSpace,1,1);}`, Fr = `#version 300 es
precision lowp float;uniform vec4 u_color;out vec4 outColor;float intensivity=3.0;void main(){float alpha=(0.5-length(gl_PointCoord-0.5))*intensivity;outColor=vec4(u_color.rgb,alpha);}`;
const J = {
  position: "a_position"
};
let F, M;
function Pr(t) {
  F = Br(t, [vr, Fr], [J.position]), M = _n(t, {
    [J.position]: { numComponents: 2, data: [] }
  });
}
function Cr(t, e, n) {
  const o = n[2];
  t.useProgram(F.program), _t(F, { u_color: o }), un(t, M.attribs[J.position], e), hr(t, F, M), br(t, M, t.POINTS, e.length / 2);
}
function Lr(t) {
  const e = t._renderContext, n = t._render, o = n.context, r = n.bounds, s = r.max.x - r.min.x, i = r.max.y - r.min.y, c = t._statistics._particlesCountByFluidId.map((f) => new Float32Array(f * 2)), a = Array(c.length).fill(0);
  for (let f = 0; f < t._particles.length; f++) {
    const u = t._particles[f];
    if (u === null)
      continue;
    const l = t._fluidByParticleId[f][0], d = c[l];
    d[a[l]] = u[0], d[a[l] + 1] = u[1], a[l] += 2;
  }
  e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.viewport(0, 0, e.canvas.width, e.canvas.height), e.clearColor(0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT), e.useProgram(F.program), e.enable(e.BLEND), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), e.blendFunc(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA), _t(F, {
    u_camera: [r.min.x, r.min.y, r.max.x, r.max.y]
  }), c.forEach((f, u) => Cr(e, f, t._fluids[u])), o.drawImage(e.canvas, r.min.x, r.min.y, s, i);
}
function Mr(t, e) {
  const n = ot(e * 6, e * 6), o = n.getContext("2d");
  return o.shadowColor = t, o.shadowBlur = e * 2, o.fillStyle = t, o.beginPath(), o.arc(e * 3, e * 3, e, 0, 2 * Math.PI), o.fill(), n;
}
function Nr(t) {
  const { context: e } = t._render;
  Matter.Render.startViewTransform({ ...t._render, context: e }), Lr(t);
}
function Dr(t, e) {
  const n = e.min.x, o = e.min.y, r = Math.round((e.max.x - e.min.x) / t);
  function s(u, l) {
    return l * r + u;
  }
  function i(u, l, d) {
    const _ = u.h[d];
    typeof _ > "u" ? (u.h[d] = [l], u.p[l] = d) : _.includes(l) || (_.push(l), u.p[l] = d);
  }
  function c(u, l, d) {
    return u.h[s(l, d)] || [];
  }
  function a(u, l, d) {
    const _ = u.h[d];
    Ae(_, l), delete u.p[l];
  }
  const f = {
    h: [],
    p: {},
    // clear: (): void => {
    //   sh.h = {};
    //   sh.p = {};
    // },
    update: (u, l, d) => {
      const _ = Math.trunc((l - n) / t), y = Math.trunc((d - o) / t), A = f.p[u], x = s(_, y);
      A !== x && (typeof A < "u" && a(f, u, A), i(f, u, x));
    },
    insert: (u, l, d) => {
      const _ = Math.trunc((l - n) / t), y = Math.trunc((d - o) / t), A = s(_, y);
      i(f, u, A);
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
    getNearby: (u, l, d) => {
      const _ = Math.trunc((u - n) / t), y = Math.trunc((l - o) / t), A = [
        ...c(f, _ - 1, y - 1),
        ...c(f, _, y - 1),
        ...c(f, _ + 1, y - 1),
        ...c(f, _ - 1, y),
        ...c(f, _ + 1, y),
        ...c(f, _ - 1, y + 1),
        ...c(f, _, y + 1),
        ...c(f, _ + 1, y + 1)
      ], x = c(f, _, y).slice();
      for (let S = 0; S < A.length; S++) {
        const B = A[S], E = d[B];
        (E[0] - u) ** 2 + (E[1] - l) ** 2 <= t ** 2 && x.push(B);
      }
      return x;
    },
    getFromBounds: (u) => f.getFromRect([u.min.x, u.min.y, u.max.x, u.max.y]),
    getFromRect: (u) => {
      const l = Math.trunc((u[0] - n) / t), d = Math.trunc((u[1] - o) / t), _ = Math.trunc((u[2] - n) / t), y = Math.trunc((u[3] - o) / t), A = [];
      for (let x = d; x <= y; x++)
        for (let S = l; S <= _; S++)
          A.push(...c(f, S, x));
      return A;
    }
  };
  return Object.seal(f);
}
const Or = [
  "pauseChange",
  "particleRemove"
];
function Ur() {
  const t = {};
  return Or.forEach((e) => t[e] = () => 0), t;
}
const xt = window.Matter;
function gr(t, e, n) {
  const o = e.color || ye;
  return [
    t,
    o,
    Ee(o),
    e.texture || Mr(o, n),
    e.mass || 1
  ];
}
function Vr(t) {
  const e = xt.Liquid, n = t.radius || 32, o = !!t.enableChemics, r = n * (t.particleTextureScale || 0.3);
  let s = [!1, !1];
  const i = t.worldWrapping;
  i != null && (s = typeof i == "boolean" ? [i, i] : i);
  const c = {}, a = t.fluids.map((E, T) => (E.name && (c[E.name] = T), gr(T, E, r))), f = t.render.canvas, l = ot(f.clientWidth, f.clientHeight).getContext("webgl2", {
    // alpha: false,
    premultipliedAlpha: !1
    // Запрашиваем альфа без предварительного умножения
  }), d = Nr, _ = Ye, y = t.updateStep || 2, A = t.bounds, x = t.engine.timing;
  let S = 0;
  const B = {
    _fluidIdByParticleId: c,
    _h: n,
    _isWrappedX: s[0],
    _isWrappedY: s[1],
    _bounds: [A.min.x, A.min.y, A.max.x, A.max.y, A.max.x - A.min.x, A.max.y - A.min.y],
    _engine: t.engine,
    _render: t.render,
    _world: t.engine.world,
    _renderContext: l,
    _isRegionalComputing: t.isRegionalComputing || !1,
    _fluids: a,
    _chemicsStore: t.fluids.reduce((E, T, b) => (E._isReadyByFid[b] = !1, E._iterStepByFid[b] = T.chemicsUS || 10, E._isReactableByFid[b] = !1, E), {
      _isReadyByFid: [],
      _iterStepByFid: [],
      _isReactableByFid: [],
      _data: [],
      _callbackByFid: []
    }),
    _worldBordersBounce: t.bordersBounce || 0.5,
    _isPaused: !1,
    _gravityRatio: t.gravityRatio || 0.2,
    _spatialHash: Dr(n, A),
    _renderBoundsPadding: 0,
    _activeBoundsPadding: 0,
    _particles: [],
    _freeParticleIds: [],
    _fluidByParticleId: {},
    _timeDelta: t.timeScale || 1,
    _events: Ur(),
    _statistics: {
      _particlesCountByFluidId: a.map(() => 0)
    },
    _updateCompute: () => {
      if (S++ % y === 0) {
        if (o) {
          const E = B._chemicsStore._isReadyByFid;
          for (let T = 0; T < E.length; T++)
            E[T] = (S - T) % B._chemicsStore._iterStepByFid[T] === 0;
        }
        _(B, x.timeScale * B._timeDelta);
      }
    }
  };
  return Pr(l), xt.Events.on(t.render, "afterRender", () => d(B)), e.setPause(B, !!t.isPaused), Object.seal(B);
}
const q = {
  trans(t, e, n) {
    const o = t._fluidByParticleId, r = t._fluids[n];
    e.forEach((s) => {
      const i = t._fluidByParticleId[s];
      o[s] = r, t._statistics._particlesCountByFluidId[i[0]]--, t._statistics._particlesCountByFluidId[r[0]]++;
    });
  },
  transByName(t, e, n) {
    q.trans(t, e, Matter.Liquid.getFluidId(t, n));
  },
  transRect(t, e, n, o, r, s) {
    const i = Matter.Liquid.getFluidId(t, e), c = [];
    t._particles.forEach((a, f) => {
      a !== null && O(a[0], a[1], [n, o, n + r, o + s]) && c.push(f);
    }), q.trans(t, c, i);
  },
  reacts(t, e, n) {
    const o = Matter.Liquid.getFluidId(t, e);
    t._chemicsStore._isReactableByFid[o] = !0, t._chemicsStore._callbackByFid[o] = n;
  }
  // reactsBody
}, _e = {
  dry(t, e) {
    const n = t._fluidByParticleId[e], o = t._particles[e];
    t._particles[e] = null, t._spatialHash.remove(e), t._events.particleRemove(o, e, n), t._freeParticleIds.includes(e) || t._freeParticleIds.unshift(e), t._statistics._particlesCountByFluidId[n[0]]--;
  },
  rect(t, e, n, o, r) {
    const s = t._spatialHash.getFromRect([e, n, e + o, n + r]);
    nt(s, (i) => {
      const c = t._particles[i];
      c !== null && O(c[0], c[1], [e, n, e + o, n + r]) && _e.dry(t, i);
    });
  }
  // TODO: methods circle, shape (using Matter geom) etc.
}, tt = {
  drip(t, e, n, o) {
    const r = t._freeParticleIds.length === 0 ? t._particles.length : t._freeParticleIds.pop(), s = new Float32Array([n, o, 0, 0]);
    t._fluidByParticleId[r] = t._fluids[e], t._particles[r] = s, t._spatialHash.insert(r, n, o), t._statistics._particlesCountByFluidId[e]++;
  },
  rect(t, e, n, o, r, s, i = t._h) {
    const c = Matter.Liquid.getFluidId(t, e), a = i / 2, f = j(Math.trunc(r / i), 1), u = j(Math.trunc(s / i), 1);
    for (let l = 0; l < f; l++)
      for (let d = 0; d < u; d++) {
        const _ = n + a + l * i, y = o + a + d * i;
        tt.drip(t, c, _, y), l !== f - 1 && d !== u - 1 && tt.drip(t, c, _ + a, y + a);
      }
  }
  // TODO: methods circle, shape (using Matter geom) etc.
}, St = window.Matter, zr = {
  utils: {
    VirtualCanvas: ot
    // ...Utils,
    // ...Cycles,
    // ...Vector,
  },
  create: Vr,
  drip: tt,
  dry: _e,
  chemics: q,
  setPause(t, e = !0) {
    e ? St.Events.off(t._engine, "afterUpdate", t._updateCompute) : St.Events.on(t._engine, "afterUpdate", t._updateCompute), t._isPaused = e, t._events.pauseChange(e);
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
}, wr = {
  name: "matter-liquid",
  version: "0.0.1",
  for: "matter-js@0.17.1",
  install(t) {
    t.Liquid = zr;
  }
};
Matter.Plugin.register(wr);
