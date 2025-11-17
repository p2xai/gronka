var ft = Object.defineProperty;
var ut = (t, e, n) =>
  e in t ? ft(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (t[e] = n);
var U = (t, e, n) => ut(t, typeof e != 'symbol' ? e + '' : e, n);
(function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) s(o);
  new MutationObserver(o => {
    for (const r of o)
      if (r.type === 'childList')
        for (const l of r.addedNodes) l.tagName === 'LINK' && l.rel === 'modulepreload' && s(l);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(o) {
    const r = {};
    return (
      o.integrity && (r.integrity = o.integrity),
      o.referrerPolicy && (r.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === 'use-credentials'
        ? (r.credentials = 'include')
        : o.crossOrigin === 'anonymous'
          ? (r.credentials = 'omit')
          : (r.credentials = 'same-origin'),
      r
    );
  }
  function s(o) {
    if (o.ep) return;
    o.ep = !0;
    const r = n(o);
    fetch(o.href, r);
  }
})();
function z() {}
function st(t) {
  return t();
}
function Y() {
  return Object.create(null);
}
function F(t) {
  t.forEach(st);
}
function ot(t) {
  return typeof t == 'function';
}
function J(t, e) {
  return t != t ? e == e : t !== e || (t && typeof t == 'object') || typeof t == 'function';
}
function dt(t) {
  return Object.keys(t).length === 0;
}
function c(t, e) {
  t.appendChild(e);
}
function y(t, e, n) {
  t.insertBefore(e, n || null);
}
function v(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function u(t) {
  return document.createElement(t);
}
function k(t) {
  return document.createTextNode(t);
}
function h() {
  return k(' ');
}
function it(t, e, n, s) {
  return (t.addEventListener(e, n, s), () => t.removeEventListener(e, n, s));
}
function d(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function ht(t) {
  return Array.from(t.childNodes);
}
function x(t, e) {
  ((e = '' + e), t.data !== e && (t.data = e));
}
function Z(t, e, n) {
  t.classList.toggle(e, !!n);
}
let j;
function T(t) {
  j = t;
}
function pt() {
  if (!j) throw new Error('Function called outside component initialization');
  return j;
}
function at(t) {
  pt().$$.on_mount.push(t);
}
const O = [],
  tt = [];
let A = [];
const et = [],
  _t = Promise.resolve();
let D = !1;
function mt() {
  D || ((D = !0), _t.then(ct));
}
function G(t) {
  A.push(t);
}
const R = new Set();
let M = 0;
function ct() {
  if (M !== 0) return;
  const t = j;
  do {
    try {
      for (; M < O.length; ) {
        const e = O[M];
        (M++, T(e), vt(e.$$));
      }
    } catch (e) {
      throw ((O.length = 0), (M = 0), e);
    }
    for (T(null), O.length = 0, M = 0; tt.length; ) tt.pop()();
    for (let e = 0; e < A.length; e += 1) {
      const n = A[e];
      R.has(n) || (R.add(n), n());
    }
    A.length = 0;
  } while (O.length);
  for (; et.length; ) et.pop()();
  ((D = !1), R.clear(), T(t));
}
function vt(t) {
  if (t.fragment !== null) {
    (t.update(), F(t.before_update));
    const e = t.dirty;
    ((t.dirty = [-1]), t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(G));
  }
}
function gt(t) {
  const e = [],
    n = [];
  (A.forEach(s => (t.indexOf(s) === -1 ? e.push(s) : n.push(s))), n.forEach(s => s()), (A = e));
}
const B = new Set();
let yt;
function q(t, e) {
  t && t.i && (B.delete(t), t.i(e));
}
function nt(t, e, n, s) {
  if (t && t.o) {
    if (B.has(t)) return;
    (B.add(t),
      yt.c.push(() => {
        B.delete(t);
      }),
      t.o(e));
  }
}
function rt(t) {
  t && t.c();
}
function K(t, e, n) {
  const { fragment: s, after_update: o } = t.$$;
  (s && s.m(e, n),
    G(() => {
      const r = t.$$.on_mount.map(st).filter(ot);
      (t.$$.on_destroy ? t.$$.on_destroy.push(...r) : F(r), (t.$$.on_mount = []));
    }),
    o.forEach(G));
}
function V(t, e) {
  const n = t.$$;
  n.fragment !== null &&
    (gt(n.after_update),
    F(n.on_destroy),
    n.fragment && n.fragment.d(e),
    (n.on_destroy = n.fragment = null),
    (n.ctx = []));
}
function $t(t, e) {
  (t.$$.dirty[0] === -1 && (O.push(t), mt(), t.$$.dirty.fill(0)),
    (t.$$.dirty[(e / 31) | 0] |= 1 << e % 31));
}
function Q(t, e, n, s, o, r, l = null, i = [-1]) {
  const f = j;
  T(t);
  const a = (t.$$ = {
    fragment: null,
    ctx: [],
    props: r,
    update: z,
    not_equal: o,
    bound: Y(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (f ? f.$$.context : [])),
    callbacks: Y(),
    dirty: i,
    skip_bound: !1,
    root: e.target || f.$$.root,
  });
  l && l(a.root);
  let p = !1;
  if (
    ((a.ctx = n
      ? n(t, e.props || {}, (_, $, ...w) => {
          const E = w.length ? w[0] : $;
          return (
            a.ctx &&
              o(a.ctx[_], (a.ctx[_] = E)) &&
              (!a.skip_bound && a.bound[_] && a.bound[_](E), p && $t(t, _)),
            $
          );
        })
      : []),
    a.update(),
    (p = !0),
    F(a.before_update),
    (a.fragment = s ? s(a.ctx) : !1),
    e.target)
  ) {
    if (e.hydrate) {
      const _ = ht(e.target);
      (a.fragment && a.fragment.l(_), _.forEach(v));
    } else a.fragment && a.fragment.c();
    (e.intro && q(t.$$.fragment), K(t, e.target, e.anchor), ct());
  }
  T(f);
}
class W {
  constructor() {
    U(this, '$$');
    U(this, '$$set');
  }
  $destroy() {
    (V(this, 1), (this.$destroy = z));
  }
  $on(e, n) {
    if (!ot(n)) return z;
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
    this.$$set && !dt(e) && ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
  }
}
const wt = '4';
typeof window < 'u' && (window.__svelte || (window.__svelte = { v: new Set() })).v.add(wt);
async function bt() {
  try {
    const t = await fetch('/api/stats');
    if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
    return await t.json();
  } catch (t) {
    throw (console.error('Failed to fetch stats:', t), t);
  }
}
async function kt() {
  try {
    const t = await fetch('/api/health');
    if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
    return await t.json();
  } catch (t) {
    throw (console.error('Failed to fetch health:', t), t);
  }
}
function lt(t) {
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
function Et(t) {
  var b;
  let e,
    n,
    s,
    o,
    r,
    l = (((b = t[0].total_gifs) == null ? void 0 : b.toLocaleString()) || '0') + '',
    i,
    f,
    a,
    p,
    _,
    $,
    w = (t[0].disk_usage_formatted || '0.00 MB') + '',
    E,
    I,
    g,
    C,
    P,
    L,
    S = (t[0].storage_path || 'N/A') + '',
    N;
  return {
    c() {
      ((e = u('dl')),
        (n = u('div')),
        (s = u('dt')),
        (s.textContent = 'Total GIFs'),
        (o = h()),
        (r = u('dd')),
        (i = k(l)),
        (f = h()),
        (a = u('div')),
        (p = u('dt')),
        (p.textContent = 'Disk Usage'),
        (_ = h()),
        ($ = u('dd')),
        (E = k(w)),
        (I = h()),
        (g = u('div')),
        (C = u('dt')),
        (C.textContent = 'Storage Path'),
        (P = h()),
        (L = u('dd')),
        (N = k(S)),
        d(s, 'class', 'svelte-y9p609'),
        d(r, 'class', 'svelte-y9p609'),
        d(n, 'class', 'stat-item svelte-y9p609'),
        d(p, 'class', 'svelte-y9p609'),
        d($, 'class', 'svelte-y9p609'),
        d(a, 'class', 'stat-item svelte-y9p609'),
        d(C, 'class', 'svelte-y9p609'),
        d(L, 'class', 'path svelte-y9p609'),
        d(g, 'class', 'stat-item svelte-y9p609'),
        d(e, 'class', 'svelte-y9p609'));
    },
    m(m, H) {
      (y(m, e, H),
        c(e, n),
        c(n, s),
        c(n, o),
        c(n, r),
        c(r, i),
        c(n, f),
        c(e, a),
        c(a, p),
        c(a, _),
        c(a, $),
        c($, E),
        c(a, I),
        c(e, g),
        c(g, C),
        c(g, P),
        c(g, L),
        c(L, N));
    },
    p(m, H) {
      var X;
      (H & 1 &&
        l !== (l = (((X = m[0].total_gifs) == null ? void 0 : X.toLocaleString()) || '0') + '') &&
        x(i, l),
        H & 1 && w !== (w = (m[0].disk_usage_formatted || '0.00 MB') + '') && x(E, w),
        H & 1 && S !== (S = (m[0].storage_path || 'N/A') + '') && x(N, S));
    },
    d(m) {
      m && v(e);
    },
  };
}
function zt(t) {
  let e, n, s, o, r, l, i;
  return {
    c() {
      ((e = u('div')),
        (n = k('Error: ')),
        (s = k(t[2])),
        (o = h()),
        (r = u('button')),
        (r.textContent = 'Retry'),
        d(e, 'class', 'error svelte-y9p609'),
        d(r, 'class', 'svelte-y9p609'));
    },
    m(f, a) {
      (y(f, e, a),
        c(e, n),
        c(e, s),
        y(f, o, a),
        y(f, r, a),
        l || ((i = it(r, 'click', t[3])), (l = !0)));
    },
    p(f, a) {
      a & 4 && x(s, f[2]);
    },
    d(f) {
      (f && (v(e), v(o), v(r)), (l = !1), i());
    },
  };
}
function Ct(t) {
  let e;
  return {
    c() {
      ((e = u('div')), (e.textContent = 'Loading...'), d(e, 'class', 'loading svelte-y9p609'));
    },
    m(n, s) {
      y(n, e, s);
    },
    p: z,
    d(n) {
      n && v(e);
    },
  };
}
function Lt(t) {
  let e, n, s;
  function o(i, f) {
    if (i[1] && !i[0]) return Ct;
    if (i[2]) return zt;
    if (i[0]) return Et;
  }
  let r = o(t),
    l = r && r(t);
  return {
    c() {
      ((e = u('section')),
        (n = u('h2')),
        (n.textContent = 'Statistics'),
        (s = h()),
        l && l.c(),
        d(n, 'class', 'svelte-y9p609'),
        d(e, 'class', 'stats svelte-y9p609'));
    },
    m(i, f) {
      (y(i, e, f), c(e, n), c(e, s), l && l.m(e, null));
    },
    p(i, [f]) {
      r === (r = o(i)) && l
        ? l.p(i, f)
        : (l && l.d(1), (l = r && r(i)), l && (l.c(), l.m(e, null)));
    },
    i: z,
    o: z,
    d(i) {
      (i && v(e), l && l.d());
    },
  };
}
function St(t, e, n) {
  let s = null,
    o = !0,
    r = null;
  async function l() {
    (n(1, (o = !0)), n(2, (r = null)));
    try {
      n(0, (s = await bt()));
    } catch (i) {
      n(2, (r = i.message));
    } finally {
      n(1, (o = !1));
    }
  }
  return (
    at(() => {
      l();
      const i = setInterval(l, 3e4);
      return () => clearInterval(i);
    }),
    [s, o, r, l]
  );
}
class xt extends W {
  constructor(e) {
    (super(), Q(this, e, St, Lt, J, {}));
  }
}
function Nt(t) {
  let e,
    n,
    s,
    o,
    r,
    l = (t[0].status || 'unknown') + '',
    i,
    f,
    a,
    p,
    _,
    $,
    w = lt(t[0].uptime || 0) + '',
    E,
    I,
    g,
    C,
    P,
    L,
    S = (t[0].timestamp || 'N/A') + '',
    N;
  return {
    c() {
      ((e = u('dl')),
        (n = u('div')),
        (s = u('dt')),
        (s.textContent = 'Status'),
        (o = h()),
        (r = u('dd')),
        (i = k(l)),
        (f = h()),
        (a = u('div')),
        (p = u('dt')),
        (p.textContent = 'Uptime'),
        (_ = h()),
        ($ = u('dd')),
        (E = k(w)),
        (I = h()),
        (g = u('div')),
        (C = u('dt')),
        (C.textContent = 'Last Update'),
        (P = h()),
        (L = u('dd')),
        (N = k(S)),
        d(s, 'class', 'svelte-f1atz'),
        d(r, 'class', 'status svelte-f1atz'),
        Z(r, 'ok', t[0].status === 'ok'),
        d(n, 'class', 'stat-item svelte-f1atz'),
        d(p, 'class', 'svelte-f1atz'),
        d($, 'class', 'svelte-f1atz'),
        d(a, 'class', 'stat-item svelte-f1atz'),
        d(C, 'class', 'svelte-f1atz'),
        d(L, 'class', 'timestamp svelte-f1atz'),
        d(g, 'class', 'stat-item svelte-f1atz'),
        d(e, 'class', 'svelte-f1atz'));
    },
    m(b, m) {
      (y(b, e, m),
        c(e, n),
        c(n, s),
        c(n, o),
        c(n, r),
        c(r, i),
        c(n, f),
        c(e, a),
        c(a, p),
        c(a, _),
        c(a, $),
        c($, E),
        c(a, I),
        c(e, g),
        c(g, C),
        c(g, P),
        c(g, L),
        c(L, N));
    },
    p(b, m) {
      (m & 1 && l !== (l = (b[0].status || 'unknown') + '') && x(i, l),
        m & 1 && Z(r, 'ok', b[0].status === 'ok'),
        m & 1 && w !== (w = lt(b[0].uptime || 0) + '') && x(E, w),
        m & 1 && S !== (S = (b[0].timestamp || 'N/A') + '') && x(N, S));
    },
    d(b) {
      b && v(e);
    },
  };
}
function Mt(t) {
  let e, n, s, o, r, l, i;
  return {
    c() {
      ((e = u('div')),
        (n = k('Error: ')),
        (s = k(t[2])),
        (o = h()),
        (r = u('button')),
        (r.textContent = 'Retry'),
        d(e, 'class', 'error svelte-f1atz'),
        d(r, 'class', 'svelte-f1atz'));
    },
    m(f, a) {
      (y(f, e, a),
        c(e, n),
        c(e, s),
        y(f, o, a),
        y(f, r, a),
        l || ((i = it(r, 'click', t[3])), (l = !0)));
    },
    p(f, a) {
      a & 4 && x(s, f[2]);
    },
    d(f) {
      (f && (v(e), v(o), v(r)), (l = !1), i());
    },
  };
}
function Ot(t) {
  let e;
  return {
    c() {
      ((e = u('div')), (e.textContent = 'Loading...'), d(e, 'class', 'loading svelte-f1atz'));
    },
    m(n, s) {
      y(n, e, s);
    },
    p: z,
    d(n) {
      n && v(e);
    },
  };
}
function At(t) {
  let e, n, s;
  function o(i, f) {
    if (i[1] && !i[0]) return Ot;
    if (i[2]) return Mt;
    if (i[0]) return Nt;
  }
  let r = o(t),
    l = r && r(t);
  return {
    c() {
      ((e = u('section')),
        (n = u('h2')),
        (n.textContent = 'Health Status'),
        (s = h()),
        l && l.c(),
        d(n, 'class', 'svelte-f1atz'),
        d(e, 'class', 'health svelte-f1atz'));
    },
    m(i, f) {
      (y(i, e, f), c(e, n), c(e, s), l && l.m(e, null));
    },
    p(i, [f]) {
      r === (r = o(i)) && l
        ? l.p(i, f)
        : (l && l.d(1), (l = r && r(i)), l && (l.c(), l.m(e, null)));
    },
    i: z,
    o: z,
    d(i) {
      (i && v(e), l && l.d());
    },
  };
}
function It(t, e, n) {
  let s = null,
    o = !0,
    r = null;
  async function l() {
    (n(1, (o = !0)), n(2, (r = null)));
    try {
      n(0, (s = await kt()));
    } catch (i) {
      n(2, (r = i.message));
    } finally {
      n(1, (o = !1));
    }
  }
  return (
    at(() => {
      l();
      const i = setInterval(l, 1e4);
      return () => clearInterval(i);
    }),
    [s, o, r, l]
  );
}
class Pt extends W {
  constructor(e) {
    (super(), Q(this, e, It, At, J, {}));
  }
}
function Ht(t) {
  let e, n, s, o, r, l, i, f;
  return (
    (r = new xt({})),
    (i = new Pt({})),
    {
      c() {
        ((e = u('main')),
          (n = u('header')),
          (n.innerHTML = '<h1 class="svelte-1d5rxi1">Discord GIF Bot</h1>'),
          (s = h()),
          (o = u('div')),
          rt(r.$$.fragment),
          (l = h()),
          rt(i.$$.fragment),
          d(n, 'class', 'svelte-1d5rxi1'),
          d(o, 'class', 'content svelte-1d5rxi1'),
          d(e, 'class', 'svelte-1d5rxi1'));
      },
      m(a, p) {
        (y(a, e, p), c(e, n), c(e, s), c(e, o), K(r, o, null), c(o, l), K(i, o, null), (f = !0));
      },
      p: z,
      i(a) {
        f || (q(r.$$.fragment, a), q(i.$$.fragment, a), (f = !0));
      },
      o(a) {
        (nt(r.$$.fragment, a), nt(i.$$.fragment, a), (f = !1));
      },
      d(a) {
        (a && v(e), V(r), V(i));
      },
    }
  );
}
class Tt extends W {
  constructor(e) {
    (super(), Q(this, e, null, Ht, J, {}));
  }
}
new Tt({ target: document.getElementById('app') });
