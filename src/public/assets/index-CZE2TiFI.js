var bt = Object.defineProperty;
var $t = (t, e, n) =>
  e in t ? bt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (t[e] = n);
var W = (t, e, n) => $t(t, typeof e != 'symbol' ? e + '' : e, n);
(function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) s(i);
  new MutationObserver(i => {
    for (const r of i)
      if (r.type === 'childList')
        for (const l of r.addedNodes) l.tagName === 'LINK' && l.rel === 'modulepreload' && s(l);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(i) {
    const r = {};
    return (
      i.integrity && (r.integrity = i.integrity),
      i.referrerPolicy && (r.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === 'use-credentials'
        ? (r.credentials = 'include')
        : i.crossOrigin === 'anonymous'
          ? (r.credentials = 'omit')
          : (r.credentials = 'same-origin'),
      r
    );
  }
  function s(i) {
    if (i.ep) return;
    i.ep = !0;
    const r = n(i);
    fetch(i.href, r);
  }
})();
function C() {}
function pt(t) {
  return t();
}
function ct() {
  return Object.create(null);
}
function J(t) {
  t.forEach(pt);
}
function mt(t) {
  return typeof t == 'function';
}
function lt(t, e) {
  return t != t ? e == e : t !== e || (t && typeof t == 'object') || typeof t == 'function';
}
function kt(t) {
  return Object.keys(t).length === 0;
}
function a(t, e) {
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
function Lt(t) {
  return Array.from(t.childNodes);
}
function x(t, e) {
  ((e = '' + e), t.data !== e && (t.data = e));
}
function H(t, e, n) {
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
function vt(t) {
  Et().$$.on_mount.push(t);
}
const j = [],
  at = [];
let U = [];
const ut = [],
  gt = Promise.resolve();
let Y = !1;
function yt() {
  Y || ((Y = !0), gt.then(wt));
}
function Z() {
  return (yt(), gt);
}
function tt(t) {
  U.push(t);
}
const X = new Set();
let B = 0;
function wt() {
  if (B !== 0) return;
  const t = K;
  do {
    try {
      for (; B < j.length; ) {
        const e = j[B];
        (B++, D(e), Mt(e.$$));
      }
    } catch (e) {
      throw ((j.length = 0), (B = 0), e);
    }
    for (D(null), j.length = 0, B = 0; at.length; ) at.pop()();
    for (let e = 0; e < U.length; e += 1) {
      const n = U[e];
      X.has(n) || (X.add(n), n());
    }
    U.length = 0;
  } while (j.length);
  for (; ut.length; ) ut.pop()();
  ((Y = !1), X.clear(), D(t));
}
function Mt(t) {
  if (t.fragment !== null) {
    (t.update(), J(t.before_update));
    const e = t.dirty;
    ((t.dirty = [-1]), t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(tt));
  }
}
function Ct(t) {
  const e = [],
    n = [];
  (U.forEach(s => (t.indexOf(s) === -1 ? e.push(s) : n.push(s))), n.forEach(s => s()), (U = e));
}
const V = new Set();
let Pt;
function et(t, e) {
  t && t.i && (V.delete(t), t.i(e));
}
function ft(t, e, n, s) {
  if (t && t.o) {
    if (V.has(t)) return;
    (V.add(t),
      Pt.c.push(() => {
        V.delete(t);
      }),
      t.o(e));
  }
}
function dt(t) {
  t && t.c();
}
function nt(t, e, n) {
  const { fragment: s, after_update: i } = t.$$;
  (s && s.m(e, n),
    tt(() => {
      const r = t.$$.on_mount.map(pt).filter(mt);
      (t.$$.on_destroy ? t.$$.on_destroy.push(...r) : J(r), (t.$$.on_mount = []));
    }),
    i.forEach(tt));
}
function rt(t, e) {
  const n = t.$$;
  n.fragment !== null &&
    (Ct(n.after_update),
    J(n.on_destroy),
    n.fragment && n.fragment.d(e),
    (n.on_destroy = n.fragment = null),
    (n.ctx = []));
}
function St(t, e) {
  (t.$$.dirty[0] === -1 && (j.push(t), yt(), t.$$.dirty.fill(0)),
    (t.$$.dirty[(e / 31) | 0] |= 1 << e % 31));
}
function st(t, e, n, s, i, r, l = null, o = [-1]) {
  const u = K;
  D(t);
  const c = (t.$$ = {
    fragment: null,
    ctx: [],
    props: r,
    update: C,
    not_equal: i,
    bound: ct(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (u ? u.$$.context : [])),
    callbacks: ct(),
    dirty: o,
    skip_bound: !1,
    root: e.target || u.$$.root,
  });
  l && l(c.root);
  let p = !1;
  if (
    ((c.ctx = n
      ? n(t, e.props || {}, (m, v, ...g) => {
          const h = g.length ? g[0] : v;
          return (
            c.ctx &&
              i(c.ctx[m], (c.ctx[m] = h)) &&
              (!c.skip_bound && c.bound[m] && c.bound[m](h), p && St(t, m)),
            v
          );
        })
      : []),
    c.update(),
    (p = !0),
    J(c.before_update),
    (c.fragment = s ? s(c.ctx) : !1),
    e.target)
  ) {
    if (e.hydrate) {
      const m = Lt(e.target);
      (c.fragment && c.fragment.l(m), m.forEach(w));
    } else c.fragment && c.fragment.c();
    (e.intro && et(t.$$.fragment), nt(t, e.target, e.anchor), wt());
  }
  D(u);
}
class it {
  constructor() {
    W(this, '$$');
    W(this, '$$set');
  }
  $destroy() {
    (rt(this, 1), (this.$destroy = C));
  }
  $on(e, n) {
    if (!mt(n)) return C;
    const s = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return (
      s.push(n),
      () => {
        const i = s.indexOf(n);
        i !== -1 && s.splice(i, 1);
      }
    );
  }
  $set(e) {
    this.$$set && !kt(e) && ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
  }
}
const It = '4';
typeof window < 'u' && (window.__svelte || (window.__svelte = { v: new Set() })).v.add(It);
async function xt() {
  try {
    const t = await fetch('/api/stats');
    if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
    return await t.json();
  } catch (t) {
    throw (console.error('Failed to fetch stats:', t), t);
  }
}
async function At() {
  try {
    const t = await fetch('/api/health');
    if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
    return await t.json();
  } catch (t) {
    throw (console.error('Failed to fetch health:', t), t);
  }
}
function ht(t) {
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
async function Tt() {
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
function q(t) {
  return t == null
    ? 'N/A'
    : `$${t.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function Nt(t) {
  var O;
  let e,
    n,
    s,
    i,
    r,
    l = (((O = t[0].total_gifs) == null ? void 0 : O.toLocaleString()) || '0') + '',
    o,
    u,
    c,
    p,
    m,
    v,
    g = (t[0].disk_usage_formatted || '0.00 MB') + '',
    h,
    T,
    y,
    P,
    z,
    S,
    L = (t[0].storage_path || 'N/A') + '',
    A;
  return {
    c() {
      ((e = f('dl')),
        (n = f('div')),
        (s = f('dt')),
        (s.textContent = 'Total GIFs'),
        (i = _()),
        (r = f('dd')),
        (o = k(l)),
        (u = _()),
        (c = f('div')),
        (p = f('dt')),
        (p.textContent = 'Disk Usage'),
        (m = _()),
        (v = f('dd')),
        (h = k(g)),
        (T = _()),
        (y = f('div')),
        (P = f('dt')),
        (P.textContent = 'Storage Path'),
        (z = _()),
        (S = f('dd')),
        (A = k(L)),
        d(s, 'class', 'svelte-y9p609'),
        d(r, 'class', 'svelte-y9p609'),
        d(n, 'class', 'stat-item svelte-y9p609'),
        d(p, 'class', 'svelte-y9p609'),
        d(v, 'class', 'svelte-y9p609'),
        d(c, 'class', 'stat-item svelte-y9p609'),
        d(P, 'class', 'svelte-y9p609'),
        d(S, 'class', 'path svelte-y9p609'),
        d(y, 'class', 'stat-item svelte-y9p609'),
        d(e, 'class', 'svelte-y9p609'));
    },
    m(M, $) {
      (b(M, e, $),
        a(e, n),
        a(n, s),
        a(n, i),
        a(n, r),
        a(r, o),
        a(n, u),
        a(e, c),
        a(c, p),
        a(c, m),
        a(c, v),
        a(v, h),
        a(c, T),
        a(e, y),
        a(y, P),
        a(y, z),
        a(y, S),
        a(S, A));
    },
    p(M, $) {
      var N;
      ($ & 1 &&
        l !== (l = (((N = M[0].total_gifs) == null ? void 0 : N.toLocaleString()) || '0') + '') &&
        x(o, l),
        $ & 1 && g !== (g = (M[0].disk_usage_formatted || '0.00 MB') + '') && x(h, g),
        $ & 1 && L !== (L = (M[0].storage_path || 'N/A') + '') && x(A, L));
    },
    d(M) {
      M && w(e);
    },
  };
}
function Ot(t) {
  let e, n, s, i, r, l, o;
  return {
    c() {
      ((e = f('div')),
        (n = k('Error: ')),
        (s = k(t[2])),
        (i = _()),
        (r = f('button')),
        (r.textContent = 'Retry'),
        d(e, 'class', 'error svelte-y9p609'),
        d(r, 'class', 'svelte-y9p609'));
    },
    m(u, c) {
      (b(u, e, c),
        a(e, n),
        a(e, s),
        b(u, i, c),
        b(u, r, c),
        l || ((o = _t(r, 'click', t[3])), (l = !0)));
    },
    p(u, c) {
      c & 4 && x(s, u[2]);
    },
    d(u) {
      (u && (w(e), w(i), w(r)), (l = !1), o());
    },
  };
}
function Ft(t) {
  let e;
  return {
    c() {
      ((e = f('div')), (e.textContent = 'Loading...'), d(e, 'class', 'loading svelte-y9p609'));
    },
    m(n, s) {
      b(n, e, s);
    },
    p: C,
    d(n) {
      n && w(e);
    },
  };
}
function Ht(t) {
  let e, n, s;
  function i(o, u) {
    if (o[1] && !o[0]) return Ft;
    if (o[2]) return Ot;
    if (o[0]) return Nt;
  }
  let r = i(t),
    l = r && r(t);
  return {
    c() {
      ((e = f('section')),
        (n = f('h2')),
        (n.textContent = 'Statistics'),
        (s = _()),
        l && l.c(),
        d(n, 'class', 'svelte-y9p609'),
        d(e, 'class', 'stats svelte-y9p609'));
    },
    m(o, u) {
      (b(o, e, u), a(e, n), a(e, s), l && l.m(e, null));
    },
    p(o, [u]) {
      r === (r = i(o)) && l
        ? l.p(o, u)
        : (l && l.d(1), (l = r && r(o)), l && (l.c(), l.m(e, null)));
    },
    i: C,
    o: C,
    d(o) {
      (o && w(e), l && l.d());
    },
  };
}
function Bt(t, e, n) {
  let s = null,
    i = !0,
    r = null;
  async function l() {
    (n(1, (i = !0)), n(2, (r = null)));
    try {
      n(0, (s = await xt()));
    } catch (o) {
      n(2, (r = o.message));
    } finally {
      n(1, (i = !1));
    }
  }
  return (
    vt(() => {
      l();
      const o = setInterval(l, 3e4);
      return () => clearInterval(o);
    }),
    [s, i, r, l]
  );
}
class jt extends it {
  constructor(e) {
    (super(), st(this, e, Bt, Ht, lt, {}));
  }
}
function Ut(t) {
  let e,
    n,
    s,
    i,
    r,
    l = (t[0].status || 'unknown') + '',
    o,
    u,
    c,
    p,
    m,
    v,
    g = ht(t[0].uptime || 0) + '',
    h,
    T,
    y,
    P,
    z,
    S,
    L,
    A = q(t[3]) + '',
    O,
    M,
    $,
    N,
    ot,
    R,
    F,
    G = q(t[4]) + '',
    Q;
  return {
    c() {
      ((e = f('dl')),
        (n = f('div')),
        (s = f('dt')),
        (s.textContent = 'Status'),
        (i = _()),
        (r = f('dd')),
        (o = k(l)),
        (u = _()),
        (c = f('div')),
        (p = f('dt')),
        (p.textContent = 'Uptime'),
        (m = _()),
        (v = f('dd')),
        (h = k(g)),
        (T = _()),
        (y = f('div')),
        (P = f('dt')),
        (P.innerHTML = `<svg class="crypto-icon svelte-176t98a" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#f7931a" stroke="currentColor" stroke-width="0.5"></circle><path d="M12.5 6.5c1.5 0 2.5 0.5 3 1.5c0.3 0.6 0.2 1.3 0.1 1.7c-0.1 0.4-0.3 0.7-0.5 1c0.3 0.2 0.5 0.6 0.6 1c0.1 0.5 0.1 1.1-0.1 1.6c-0.4 1.1-1.4 1.6-3 1.6h-0.5v2h-1.5v-2h-1v2h-1.5v-2.1c-0.3 0-0.6-0.1-0.8-0.2l-0.5 1.5c-0.2 0.1-0.5 0.2-0.8 0.2l-0.3 1.8h-1.2l0.3-1.8c-0.2-0.1-0.4-0.2-0.5-0.3l-0.5 1.5l-1.2-0.4l0.5-1.5c-0.1-0.2-0.2-0.4-0.2-0.6v-2.5c0-0.2 0.1-0.4 0.2-0.6l-0.5-1.5l1.2-0.4l0.5 1.5c0.1-0.1 0.3-0.2 0.5-0.3l0.3-1.8h1.2l-0.3 1.8c0.2 0.1 0.5 0.2 0.8 0.2l0.5-1.5c0.2 0.1 0.5 0.2 0.8 0.2v-2h1v2h1.5v-2h1.5v2h0.5zM9.5 10.5h2.5c1 0 1.5-0.3 1.7-0.8c0.1-0.3 0.1-0.6 0-0.9c-0.2-0.5-0.7-0.8-1.7-0.8h-2.5v2.5zM9.5 13.5h3c1.1 0 1.6-0.3 1.8-0.9c0.1-0.3 0.1-0.7 0-1c-0.2-0.6-0.7-0.9-1.8-0.9h-3v2.8z" fill="#fff"></path></svg>
          Bitcoin price`),
        (z = _()),
        (S = f('dd')),
        (L = f('span')),
        (O = k(A)),
        (M = _()),
        ($ = f('div')),
        (N = f('dt')),
        (N.innerHTML = `<svg class="crypto-icon svelte-176t98a" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 17.97L4.58 13.62L11.943 24L19.307 13.62L11.944 17.97Z" fill="#627EEA"></path><path d="M11.944 0L4.58 12.223L11.944 17.97L19.308 12.223L11.944 0Z" fill="#627EEA"></path></svg>
          Ethereum price`),
        (ot = _()),
        (R = f('dd')),
        (F = f('span')),
        (Q = k(G)),
        d(s, 'class', 'svelte-176t98a'),
        d(r, 'class', 'status svelte-176t98a'),
        H(r, 'ok', t[0].status === 'ok'),
        d(n, 'class', 'stat-item svelte-176t98a'),
        d(p, 'class', 'svelte-176t98a'),
        d(v, 'class', 'svelte-176t98a'),
        d(c, 'class', 'stat-item svelte-176t98a'),
        d(P, 'class', 'svelte-176t98a'),
        d(L, 'class', 'price-roll svelte-176t98a'),
        H(L, 'animating', t[5]),
        d(S, 'class', 'price-container svelte-176t98a'),
        d(y, 'class', 'stat-item svelte-176t98a'),
        d(N, 'class', 'svelte-176t98a'),
        d(F, 'class', 'price-roll svelte-176t98a'),
        H(F, 'animating', t[6]),
        d(R, 'class', 'price-container svelte-176t98a'),
        d($, 'class', 'stat-item svelte-176t98a'),
        d(e, 'class', 'svelte-176t98a'));
    },
    m(E, I) {
      (b(E, e, I),
        a(e, n),
        a(n, s),
        a(n, i),
        a(n, r),
        a(r, o),
        a(n, u),
        a(e, c),
        a(c, p),
        a(c, m),
        a(c, v),
        a(v, h),
        a(c, T),
        a(e, y),
        a(y, P),
        a(y, z),
        a(y, S),
        a(S, L),
        a(L, O),
        a(y, M),
        a(e, $),
        a($, N),
        a($, ot),
        a($, R),
        a(R, F),
        a(F, Q));
    },
    p(E, I) {
      (I & 1 && l !== (l = (E[0].status || 'unknown') + '') && x(o, l),
        I & 1 && H(r, 'ok', E[0].status === 'ok'),
        I & 1 && g !== (g = ht(E[0].uptime || 0) + '') && x(h, g),
        I & 8 && A !== (A = q(E[3]) + '') && x(O, A),
        I & 32 && H(L, 'animating', E[5]),
        I & 16 && G !== (G = q(E[4]) + '') && x(Q, G),
        I & 64 && H(F, 'animating', E[6]));
    },
    d(E) {
      E && w(e);
    },
  };
}
function zt(t) {
  let e, n, s, i, r, l, o;
  return {
    c() {
      ((e = f('div')),
        (n = k('Error: ')),
        (s = k(t[2])),
        (i = _()),
        (r = f('button')),
        (r.textContent = 'Retry'),
        d(e, 'class', 'error svelte-176t98a'),
        d(r, 'class', 'svelte-176t98a'));
    },
    m(u, c) {
      (b(u, e, c),
        a(e, n),
        a(e, s),
        b(u, i, c),
        b(u, r, c),
        l || ((o = _t(r, 'click', t[7])), (l = !0)));
    },
    p(u, c) {
      c & 4 && x(s, u[2]);
    },
    d(u) {
      (u && (w(e), w(i), w(r)), (l = !1), o());
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
    p: C,
    d(n) {
      n && w(e);
    },
  };
}
function Kt(t) {
  let e, n, s;
  function i(o, u) {
    if (o[1] && !o[0]) return Dt;
    if (o[2]) return zt;
    if (o[0]) return Ut;
  }
  let r = i(t),
    l = r && r(t);
  return {
    c() {
      ((e = f('section')),
        (n = f('h2')),
        (n.textContent = 'Health Status'),
        (s = _()),
        l && l.c(),
        d(n, 'class', 'svelte-176t98a'),
        d(e, 'class', 'health svelte-176t98a'));
    },
    m(o, u) {
      (b(o, e, u), a(e, n), a(e, s), l && l.m(e, null));
    },
    p(o, [u]) {
      r === (r = i(o)) && l
        ? l.p(o, u)
        : (l && l.d(1), (l = r && r(o)), l && (l.c(), l.m(e, null)));
    },
    i: C,
    o: C,
    d(o) {
      (o && w(e), l && l.d());
    },
  };
}
function Rt(t, e, n) {
  let s = null,
    i = !0,
    r = null,
    l = null,
    o = null,
    u = 0,
    c = 0,
    p = !1,
    m = !1;
  async function v() {
    (n(1, (i = !0)), n(2, (r = null)));
    try {
      n(0, (s = await At()));
    } catch (h) {
      n(2, (r = h.message));
    } finally {
      n(1, (i = !1));
    }
  }
  async function g() {
    try {
      const h = await Tt();
      (h.bitcoin !== null &&
        h.bitcoin !== l &&
        (n(5, (p = !1)),
        await Z(),
        (u += 1),
        n(3, (l = h.bitcoin)),
        await Z(),
        n(5, (p = !0)),
        setTimeout(() => {
          n(5, (p = !1));
        }, 300)),
        h.ethereum !== null &&
          h.ethereum !== o &&
          (n(6, (m = !1)),
          await Z(),
          (c += 1),
          n(4, (o = h.ethereum)),
          await Z(),
          n(6, (m = !0)),
          setTimeout(() => {
            n(6, (m = !1));
          }, 300)));
    } catch (h) {
      console.error('Failed to load crypto prices:', h);
    }
  }
  return (
    vt(() => {
      (v(), g());
      const h = setInterval(v, 1e4),
        T = setInterval(g, 15e3);
      return () => {
        (clearInterval(h), clearInterval(T));
      };
    }),
    [s, i, r, l, o, p, m, v]
  );
}
class Gt extends it {
  constructor(e) {
    (super(), st(this, e, Rt, Kt, lt, {}));
  }
}
function Zt(t) {
  let e, n, s, i, r, l, o, u;
  return (
    (r = new jt({})),
    (o = new Gt({})),
    {
      c() {
        ((e = f('main')),
          (n = f('header')),
          (n.innerHTML = '<h1 class="svelte-1d5rxi1">Discord GIF Bot</h1>'),
          (s = _()),
          (i = f('div')),
          dt(r.$$.fragment),
          (l = _()),
          dt(o.$$.fragment),
          d(n, 'class', 'svelte-1d5rxi1'),
          d(i, 'class', 'content svelte-1d5rxi1'),
          d(e, 'class', 'svelte-1d5rxi1'));
      },
      m(c, p) {
        (b(c, e, p), a(e, n), a(e, s), a(e, i), nt(r, i, null), a(i, l), nt(o, i, null), (u = !0));
      },
      p: C,
      i(c) {
        u || (et(r.$$.fragment, c), et(o.$$.fragment, c), (u = !0));
      },
      o(c) {
        (ft(r.$$.fragment, c), ft(o.$$.fragment, c), (u = !1));
      },
      d(c) {
        (c && w(e), rt(r), rt(o));
      },
    }
  );
}
class qt extends it {
  constructor(e) {
    (super(), st(this, e, null, Zt, lt, {}));
  }
}
new qt({ target: document.getElementById('app') });
