var bt = Object.defineProperty;
var $t = (t, e, n) =>
  e in t ? bt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (t[e] = n);
var X = (t, e, n) => $t(t, typeof e != 'symbol' ? e + '' : e, n);
(function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) s(o);
  new MutationObserver(o => {
    for (const l of o)
      if (l.type === 'childList')
        for (const r of l.addedNodes) r.tagName === 'LINK' && r.rel === 'modulepreload' && s(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(o) {
    const l = {};
    return (
      o.integrity && (l.integrity = o.integrity),
      o.referrerPolicy && (l.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === 'use-credentials'
        ? (l.credentials = 'include')
        : o.crossOrigin === 'anonymous'
          ? (l.credentials = 'omit')
          : (l.credentials = 'same-origin'),
      l
    );
  }
  function s(o) {
    if (o.ep) return;
    o.ep = !0;
    const l = n(o);
    fetch(o.href, l);
  }
})();
function P() {}
function ht(t) {
  return t();
}
function at() {
  return Object.create(null);
}
function Q(t) {
  t.forEach(ht);
}
function mt(t) {
  return typeof t == 'function';
}
function rt(t, e) {
  return t != t ? e == e : t !== e || (t && typeof t == 'object') || typeof t == 'function';
}
function kt(t) {
  return Object.keys(t).length === 0;
}
function c(t, e) {
  t.appendChild(e);
}
function b(t, e, n) {
  t.insertBefore(e, n || null);
}
function w(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function f(t) {
  return document.createElement(t);
}
function k(t) {
  return document.createTextNode(t);
}
function _() {
  return k(' ');
}
function _t(t, e, n, s) {
  return (t.addEventListener(e, n, s), () => t.removeEventListener(e, n, s));
}
function d(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Ct(t) {
  return Array.from(t.childNodes);
}
function z(t, e) {
  ((e = '' + e), t.data !== e && (t.data = e));
}
function O(t, e, n) {
  t.classList.toggle(e, !!n);
}
let K;
function D(t) {
  K = t;
}
function Et() {
  if (!K) throw new Error('Function called outside component initialization');
  return K;
}
function gt(t) {
  Et().$$.on_mount.push(t);
}
const H = [],
  ct = [];
let j = [];
const ut = [],
  vt = Promise.resolve();
let Z = !1;
function yt() {
  Z || ((Z = !0), vt.then(wt));
}
function q() {
  return (yt(), vt);
}
function tt(t) {
  j.push(t);
}
const Y = new Set();
let B = 0;
function wt() {
  if (B !== 0) return;
  const t = K;
  do {
    try {
      for (; B < H.length; ) {
        const e = H[B];
        (B++, D(e), Lt(e.$$));
      }
    } catch (e) {
      throw ((H.length = 0), (B = 0), e);
    }
    for (D(null), H.length = 0, B = 0; ct.length; ) ct.pop()();
    for (let e = 0; e < j.length; e += 1) {
      const n = j[e];
      Y.has(n) || (Y.add(n), n());
    }
    j.length = 0;
  } while (H.length);
  for (; ut.length; ) ut.pop()();
  ((Z = !1), Y.clear(), D(t));
}
function Lt(t) {
  if (t.fragment !== null) {
    (t.update(), Q(t.before_update));
    const e = t.dirty;
    ((t.dirty = [-1]), t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(tt));
  }
}
function Pt(t) {
  const e = [],
    n = [];
  (j.forEach(s => (t.indexOf(s) === -1 ? e.push(s) : n.push(s))), n.forEach(s => s()), (j = e));
}
const J = new Set();
let St;
function et(t, e) {
  t && t.i && (J.delete(t), t.i(e));
}
function ft(t, e, n, s) {
  if (t && t.o) {
    if (J.has(t)) return;
    (J.add(t),
      St.c.push(() => {
        J.delete(t);
      }),
      t.o(e));
  }
}
function dt(t) {
  t && t.c();
}
function nt(t, e, n) {
  const { fragment: s, after_update: o } = t.$$;
  (s && s.m(e, n),
    tt(() => {
      const l = t.$$.on_mount.map(ht).filter(mt);
      (t.$$.on_destroy ? t.$$.on_destroy.push(...l) : Q(l), (t.$$.on_mount = []));
    }),
    o.forEach(tt));
}
function lt(t, e) {
  const n = t.$$;
  n.fragment !== null &&
    (Pt(n.after_update),
    Q(n.on_destroy),
    n.fragment && n.fragment.d(e),
    (n.on_destroy = n.fragment = null),
    (n.ctx = []));
}
function Mt(t, e) {
  (t.$$.dirty[0] === -1 && (H.push(t), yt(), t.$$.dirty.fill(0)),
    (t.$$.dirty[(e / 31) | 0] |= 1 << e % 31));
}
function st(t, e, n, s, o, l, r = null, i = [-1]) {
  const u = K;
  D(t);
  const a = (t.$$ = {
    fragment: null,
    ctx: [],
    props: l,
    update: P,
    not_equal: o,
    bound: at(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (u ? u.$$.context : [])),
    callbacks: at(),
    dirty: i,
    skip_bound: !1,
    root: e.target || u.$$.root,
  });
  r && r(a.root);
  let h = !1;
  if (
    ((a.ctx = n
      ? n(t, e.props || {}, (m, g, ...v) => {
          const p = v.length ? v[0] : g;
          return (
            a.ctx &&
              o(a.ctx[m], (a.ctx[m] = p)) &&
              (!a.skip_bound && a.bound[m] && a.bound[m](p), h && Mt(t, m)),
            g
          );
        })
      : []),
    a.update(),
    (h = !0),
    Q(a.before_update),
    (a.fragment = s ? s(a.ctx) : !1),
    e.target)
  ) {
    if (e.hydrate) {
      const m = Ct(e.target);
      (a.fragment && a.fragment.l(m), m.forEach(w));
    } else a.fragment && a.fragment.c();
    (e.intro && et(t.$$.fragment), nt(t, e.target, e.anchor), wt());
  }
  D(u);
}
class ot {
  constructor() {
    X(this, '$$');
    X(this, '$$set');
  }
  $destroy() {
    (lt(this, 1), (this.$destroy = P));
  }
  $on(e, n) {
    if (!mt(n)) return P;
    const s = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return (
      s.push(n),
      () => {
        const o = s.indexOf(n);
        o !== -1 && s.splice(o, 1);
      }
    );
  }
  $set(e) {
    this.$$set && !kt(e) && ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
  }
}
const It = '4';
typeof window < 'u' && (window.__svelte || (window.__svelte = { v: new Set() })).v.add(It);
async function zt() {
  try {
    const t = await fetch('/api/stats');
    if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
    return await t.json();
  } catch (t) {
    throw (console.error('Failed to fetch stats:', t), t);
  }
}
async function Tt() {
  try {
    const t = await fetch('/api/health');
    if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
    return await t.json();
  } catch (t) {
    throw (console.error('Failed to fetch health:', t), t);
  }
}
function pt(t) {
  if (t < 60) return `${t}s`;
  if (t < 3600) return `${Math.floor(t / 60)}m`;
  if (t < 86400) {
    const e = Math.floor(t / 3600),
      n = Math.floor((t % 3600) / 60);
    return `${e}h ${n}m`;
  } else {
    const e = Math.floor(t / 86400),
      n = Math.floor((t % 86400) / 3600);
    return `${e}d ${n}h`;
  }
}
async function xt() {
  var t, e;
  try {
    const n = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
    );
    if (!n.ok) throw new Error(`HTTP error! status: ${n.status}`);
    const s = await n.json();
    return {
      bitcoin: ((t = s.bitcoin) == null ? void 0 : t.usd) || null,
      ethereum: ((e = s.ethereum) == null ? void 0 : e.usd) || null,
    };
  } catch (n) {
    throw (console.error('Failed to fetch crypto prices:', n), n);
  }
}
function V(t) {
  return t == null
    ? 'N/A'
    : `$${t.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function At(t) {
  var F;
  let e,
    n,
    s,
    o,
    l,
    r = (((F = t[0].total_gifs) == null ? void 0 : F.toLocaleString()) || '0') + '',
    i,
    u,
    a,
    h,
    m,
    g,
    v = (t[0].disk_usage_formatted || '0.00 MB') + '',
    p,
    x,
    y,
    S,
    U,
    M,
    C = (t[0].storage_path || 'N/A') + '',
    T;
  return {
    c() {
      ((e = f('dl')),
        (n = f('div')),
        (s = f('dt')),
        (s.textContent = 'Total GIFs'),
        (o = _()),
        (l = f('dd')),
        (i = k(r)),
        (u = _()),
        (a = f('div')),
        (h = f('dt')),
        (h.textContent = 'Disk Usage'),
        (m = _()),
        (g = f('dd')),
        (p = k(v)),
        (x = _()),
        (y = f('div')),
        (S = f('dt')),
        (S.textContent = 'Storage Path'),
        (U = _()),
        (M = f('dd')),
        (T = k(C)),
        d(s, 'class', 'svelte-y9p609'),
        d(l, 'class', 'svelte-y9p609'),
        d(n, 'class', 'stat-item svelte-y9p609'),
        d(h, 'class', 'svelte-y9p609'),
        d(g, 'class', 'svelte-y9p609'),
        d(a, 'class', 'stat-item svelte-y9p609'),
        d(S, 'class', 'svelte-y9p609'),
        d(M, 'class', 'path svelte-y9p609'),
        d(y, 'class', 'stat-item svelte-y9p609'),
        d(e, 'class', 'svelte-y9p609'));
    },
    m(L, $) {
      (b(L, e, $),
        c(e, n),
        c(n, s),
        c(n, o),
        c(n, l),
        c(l, i),
        c(n, u),
        c(e, a),
        c(a, h),
        c(a, m),
        c(a, g),
        c(g, p),
        c(a, x),
        c(e, y),
        c(y, S),
        c(y, U),
        c(y, M),
        c(M, T));
    },
    p(L, $) {
      var A;
      ($ & 1 &&
        r !== (r = (((A = L[0].total_gifs) == null ? void 0 : A.toLocaleString()) || '0') + '') &&
        z(i, r),
        $ & 1 && v !== (v = (L[0].disk_usage_formatted || '0.00 MB') + '') && z(p, v),
        $ & 1 && C !== (C = (L[0].storage_path || 'N/A') + '') && z(T, C));
    },
    d(L) {
      L && w(e);
    },
  };
}
function Ft(t) {
  let e, n, s, o, l, r, i;
  return {
    c() {
      ((e = f('div')),
        (n = k('Error: ')),
        (s = k(t[2])),
        (o = _()),
        (l = f('button')),
        (l.textContent = 'Retry'),
        d(e, 'class', 'error svelte-y9p609'),
        d(l, 'class', 'svelte-y9p609'));
    },
    m(u, a) {
      (b(u, e, a),
        c(e, n),
        c(e, s),
        b(u, o, a),
        b(u, l, a),
        r || ((i = _t(l, 'click', t[3])), (r = !0)));
    },
    p(u, a) {
      a & 4 && z(s, u[2]);
    },
    d(u) {
      (u && (w(e), w(o), w(l)), (r = !1), i());
    },
  };
}
function Nt(t) {
  let e;
  return {
    c() {
      ((e = f('div')), (e.textContent = 'Loading...'), d(e, 'class', 'loading svelte-y9p609'));
    },
    m(n, s) {
      b(n, e, s);
    },
    p: P,
    d(n) {
      n && w(e);
    },
  };
}
function Ot(t) {
  let e, n, s;
  function o(i, u) {
    if (i[1] && !i[0]) return Nt;
    if (i[2]) return Ft;
    if (i[0]) return At;
  }
  let l = o(t),
    r = l && l(t);
  return {
    c() {
      ((e = f('section')),
        (n = f('h2')),
        (n.textContent = 'Statistics'),
        (s = _()),
        r && r.c(),
        d(n, 'class', 'svelte-y9p609'),
        d(e, 'class', 'stats svelte-y9p609'));
    },
    m(i, u) {
      (b(i, e, u), c(e, n), c(e, s), r && r.m(e, null));
    },
    p(i, [u]) {
      l === (l = o(i)) && r
        ? r.p(i, u)
        : (r && r.d(1), (r = l && l(i)), r && (r.c(), r.m(e, null)));
    },
    i: P,
    o: P,
    d(i) {
      (i && w(e), r && r.d());
    },
  };
}
function Bt(t, e, n) {
  let s = null,
    o = !0,
    l = null;
  async function r() {
    (n(1, (o = !0)), n(2, (l = null)));
    try {
      n(0, (s = await zt()));
    } catch (i) {
      n(2, (l = i.message));
    } finally {
      n(1, (o = !1));
    }
  }
  return (
    gt(() => {
      r();
      const i = setInterval(r, 3e4);
      return () => clearInterval(i);
    }),
    [s, o, l, r]
  );
}
class Ht extends ot {
  constructor(e) {
    (super(), st(this, e, Bt, Ot, rt, {}));
  }
}
function jt(t) {
  let e,
    n,
    s,
    o,
    l,
    r = (t[0].status || 'unknown') + '',
    i,
    u,
    a,
    h,
    m,
    g,
    v = pt(t[0].uptime || 0) + '',
    p,
    x,
    y,
    S,
    U,
    M,
    C,
    T = V(t[3]) + '',
    F,
    L,
    $,
    A,
    it,
    R,
    N,
    G = V(t[4]) + '',
    W;
  return {
    c() {
      ((e = f('dl')),
        (n = f('div')),
        (s = f('dt')),
        (s.textContent = 'Status'),
        (o = _()),
        (l = f('dd')),
        (i = k(r)),
        (u = _()),
        (a = f('div')),
        (h = f('dt')),
        (h.textContent = 'Uptime'),
        (m = _()),
        (g = f('dd')),
        (p = k(v)),
        (x = _()),
        (y = f('div')),
        (S = f('dt')),
        (S.innerHTML = `<svg class="crypto-icon svelte-176t98a" viewBox="0 0 4091.27 4091.73" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="#F7931A" fill-rule="nonzero" d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z"></path><path fill="white" fill-rule="nonzero" d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z"></path></svg>
          Bitcoin price`),
        (U = _()),
        (M = f('dd')),
        (C = f('span')),
        (F = k(T)),
        (L = _()),
        ($ = f('div')),
        (A = f('dt')),
        (A.innerHTML = `<svg class="crypto-icon svelte-176t98a" viewBox="0 0 784.37 1277.39" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><polygon fill="#343434" fill-rule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "></polygon><polygon fill="#8C8C8C" fill-rule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "></polygon><polygon fill="#3C3C3B" fill-rule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "></polygon><polygon fill="#8C8C8C" fill-rule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "></polygon><polygon fill="#141414" fill-rule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "></polygon><polygon fill="#393939" fill-rule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "></polygon></svg>
          Ethereum price`),
        (it = _()),
        (R = f('dd')),
        (N = f('span')),
        (W = k(G)),
        d(s, 'class', 'svelte-176t98a'),
        d(l, 'class', 'status svelte-176t98a'),
        O(l, 'ok', t[0].status === 'ok'),
        d(n, 'class', 'stat-item svelte-176t98a'),
        d(h, 'class', 'svelte-176t98a'),
        d(g, 'class', 'svelte-176t98a'),
        d(a, 'class', 'stat-item svelte-176t98a'),
        d(S, 'class', 'svelte-176t98a'),
        d(C, 'class', 'price-roll svelte-176t98a'),
        O(C, 'animating', t[5]),
        d(M, 'class', 'price-container svelte-176t98a'),
        d(y, 'class', 'stat-item svelte-176t98a'),
        d(A, 'class', 'svelte-176t98a'),
        d(N, 'class', 'price-roll svelte-176t98a'),
        O(N, 'animating', t[6]),
        d(R, 'class', 'price-container svelte-176t98a'),
        d($, 'class', 'stat-item svelte-176t98a'),
        d(e, 'class', 'svelte-176t98a'));
    },
    m(E, I) {
      (b(E, e, I),
        c(e, n),
        c(n, s),
        c(n, o),
        c(n, l),
        c(l, i),
        c(n, u),
        c(e, a),
        c(a, h),
        c(a, m),
        c(a, g),
        c(g, p),
        c(a, x),
        c(e, y),
        c(y, S),
        c(y, U),
        c(y, M),
        c(M, C),
        c(C, F),
        c(y, L),
        c(e, $),
        c($, A),
        c($, it),
        c($, R),
        c(R, N),
        c(N, W));
    },
    p(E, I) {
      (I & 1 && r !== (r = (E[0].status || 'unknown') + '') && z(i, r),
        I & 1 && O(l, 'ok', E[0].status === 'ok'),
        I & 1 && v !== (v = pt(E[0].uptime || 0) + '') && z(p, v),
        I & 8 && T !== (T = V(E[3]) + '') && z(F, T),
        I & 32 && O(C, 'animating', E[5]),
        I & 16 && G !== (G = V(E[4]) + '') && z(W, G),
        I & 64 && O(N, 'animating', E[6]));
    },
    d(E) {
      E && w(e);
    },
  };
}
function Ut(t) {
  let e, n, s, o, l, r, i;
  return {
    c() {
      ((e = f('div')),
        (n = k('Error: ')),
        (s = k(t[2])),
        (o = _()),
        (l = f('button')),
        (l.textContent = 'Retry'),
        d(e, 'class', 'error svelte-176t98a'),
        d(l, 'class', 'svelte-176t98a'));
    },
    m(u, a) {
      (b(u, e, a),
        c(e, n),
        c(e, s),
        b(u, o, a),
        b(u, l, a),
        r || ((i = _t(l, 'click', t[7])), (r = !0)));
    },
    p(u, a) {
      a & 4 && z(s, u[2]);
    },
    d(u) {
      (u && (w(e), w(o), w(l)), (r = !1), i());
    },
  };
}
function Dt(t) {
  let e;
  return {
    c() {
      ((e = f('div')), (e.textContent = 'Loading...'), d(e, 'class', 'loading svelte-176t98a'));
    },
    m(n, s) {
      b(n, e, s);
    },
    p: P,
    d(n) {
      n && w(e);
    },
  };
}
function Kt(t) {
  let e, n, s;
  function o(i, u) {
    if (i[1] && !i[0]) return Dt;
    if (i[2]) return Ut;
    if (i[0]) return jt;
  }
  let l = o(t),
    r = l && l(t);
  return {
    c() {
      ((e = f('section')),
        (n = f('h2')),
        (n.textContent = 'Health Status'),
        (s = _()),
        r && r.c(),
        d(n, 'class', 'svelte-176t98a'),
        d(e, 'class', 'health svelte-176t98a'));
    },
    m(i, u) {
      (b(i, e, u), c(e, n), c(e, s), r && r.m(e, null));
    },
    p(i, [u]) {
      l === (l = o(i)) && r
        ? r.p(i, u)
        : (r && r.d(1), (r = l && l(i)), r && (r.c(), r.m(e, null)));
    },
    i: P,
    o: P,
    d(i) {
      (i && w(e), r && r.d());
    },
  };
}
function Rt(t, e, n) {
  let s = null,
    o = !0,
    l = null,
    r = null,
    i = null,
    u = 0,
    a = 0,
    h = !1,
    m = !1;
  async function g() {
    (n(1, (o = !0)), n(2, (l = null)));
    try {
      n(0, (s = await Tt()));
    } catch (p) {
      n(2, (l = p.message));
    } finally {
      n(1, (o = !1));
    }
  }
  async function v() {
    try {
      const p = await xt();
      (p.bitcoin !== null &&
        p.bitcoin !== r &&
        (n(5, (h = !1)),
        await q(),
        (u += 1),
        n(3, (r = p.bitcoin)),
        await q(),
        n(5, (h = !0)),
        setTimeout(() => {
          n(5, (h = !1));
        }, 300)),
        p.ethereum !== null &&
          p.ethereum !== i &&
          (n(6, (m = !1)),
          await q(),
          (a += 1),
          n(4, (i = p.ethereum)),
          await q(),
          n(6, (m = !0)),
          setTimeout(() => {
            n(6, (m = !1));
          }, 300)));
    } catch (p) {
      console.error('Failed to load crypto prices:', p);
    }
  }
  return (
    gt(() => {
      (g(), v());
      const p = setInterval(g, 1e4),
        x = setInterval(v, 15e3);
      return () => {
        (clearInterval(p), clearInterval(x));
      };
    }),
    [s, o, l, r, i, h, m, g]
  );
}
class Gt extends ot {
  constructor(e) {
    (super(), st(this, e, Rt, Kt, rt, {}));
  }
}
function qt(t) {
  let e, n, s, o, l, r, i, u;
  return (
    (l = new Ht({})),
    (i = new Gt({})),
    {
      c() {
        ((e = f('main')),
          (n = f('header')),
          (n.innerHTML = '<h1 class="svelte-1d5rxi1">Discord GIF Bot</h1>'),
          (s = _()),
          (o = f('div')),
          dt(l.$$.fragment),
          (r = _()),
          dt(i.$$.fragment),
          d(n, 'class', 'svelte-1d5rxi1'),
          d(o, 'class', 'content svelte-1d5rxi1'),
          d(e, 'class', 'svelte-1d5rxi1'));
      },
      m(a, h) {
        (b(a, e, h), c(e, n), c(e, s), c(e, o), nt(l, o, null), c(o, r), nt(i, o, null), (u = !0));
      },
      p: P,
      i(a) {
        u || (et(l.$$.fragment, a), et(i.$$.fragment, a), (u = !0));
      },
      o(a) {
        (ft(l.$$.fragment, a), ft(i.$$.fragment, a), (u = !1));
      },
      d(a) {
        (a && w(e), lt(l), lt(i));
      },
    }
  );
}
class Vt extends ot {
  constructor(e) {
    (super(), st(this, e, null, qt, rt, {}));
  }
}
new Vt({ target: document.getElementById('app') });
