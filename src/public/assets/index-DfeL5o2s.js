var ft = Object.defineProperty;
var dt = (t, e, n) =>
  e in t ? ft(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (t[e] = n);
var U = (t, e, n) => dt(t, typeof e != 'symbol' ? e + '' : e, n);
(function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) l(o);
  new MutationObserver(o => {
    for (const r of o)
      if (r.type === 'childList')
        for (const s of r.addedNodes) s.tagName === 'LINK' && s.rel === 'modulepreload' && l(s);
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
  function l(o) {
    if (o.ep) return;
    o.ep = !0;
    const r = n(o);
    fetch(o.href, r);
  }
})();
function E() {}
function ot(t) {
  return t();
}
function X() {
  return Object.create(null);
}
function D(t) {
  t.forEach(ot);
}
function it(t) {
  return typeof t == 'function';
}
function V(t, e) {
  return t != t ? e == e : t !== e || (t && typeof t == 'object') || typeof t == 'function';
}
function mt(t) {
  return Object.keys(t).length === 0;
}
function a(t, e) {
  t.appendChild(e);
}
function y(t, e, n) {
  t.insertBefore(e, n || null);
}
function g(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function f(t) {
  return document.createElement(t);
}
function k(t) {
  return document.createTextNode(t);
}
function m() {
  return k(' ');
}
function ut(t, e, n, l) {
  return (t.addEventListener(e, n, l), () => t.removeEventListener(e, n, l));
}
function d(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function ht(t) {
  return Array.from(t.childNodes);
}
function N(t, e) {
  ((e = '' + e), t.data !== e && (t.data = e));
}
function Z(t, e, n) {
  t.classList.toggle(e, !!n);
}
let j;
function H(t) {
  j = t;
}
function pt() {
  if (!j) throw new Error('Function called outside component initialization');
  return j;
}
function at(t) {
  pt().$$.on_mount.push(t);
}
const A = [],
  tt = [];
let I = [];
const et = [],
  _t = Promise.resolve();
let G = !1;
function gt() {
  G || ((G = !0), _t.then(ct));
}
function Y(t) {
  I.push(t);
}
const R = new Set();
let O = 0;
function ct() {
  if (O !== 0) return;
  const t = j;
  do {
    try {
      for (; O < A.length; ) {
        const e = A[O];
        (O++, H(e), vt(e.$$));
      }
    } catch (e) {
      throw ((A.length = 0), (O = 0), e);
    }
    for (H(null), A.length = 0, O = 0; tt.length; ) tt.pop()();
    for (let e = 0; e < I.length; e += 1) {
      const n = I[e];
      R.has(n) || (R.add(n), n());
    }
    I.length = 0;
  } while (A.length);
  for (; et.length; ) et.pop()();
  ((G = !1), R.clear(), H(t));
}
function vt(t) {
  if (t.fragment !== null) {
    (t.update(), D(t.before_update));
    const e = t.dirty;
    ((t.dirty = [-1]), t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(Y));
  }
}
function yt(t) {
  const e = [],
    n = [];
  (I.forEach(l => (t.indexOf(l) === -1 ? e.push(l) : n.push(l))), n.forEach(l => l()), (I = e));
}
const B = new Set();
let $t;
function q(t, e) {
  t && t.i && (B.delete(t), t.i(e));
}
function nt(t, e, n, l) {
  if (t && t.o) {
    if (B.has(t)) return;
    (B.add(t),
      $t.c.push(() => {
        B.delete(t);
      }),
      t.o(e));
  }
}
function rt(t) {
  t && t.c();
}
function z(t, e, n) {
  const { fragment: l, after_update: o } = t.$$;
  (l && l.m(e, n),
    Y(() => {
      const r = t.$$.on_mount.map(ot).filter(it);
      (t.$$.on_destroy ? t.$$.on_destroy.push(...r) : D(r), (t.$$.on_mount = []));
    }),
    o.forEach(Y));
}
function K(t, e) {
  const n = t.$$;
  n.fragment !== null &&
    (yt(n.after_update),
    D(n.on_destroy),
    n.fragment && n.fragment.d(e),
    (n.on_destroy = n.fragment = null),
    (n.ctx = []));
}
function wt(t, e) {
  (t.$$.dirty[0] === -1 && (A.push(t), gt(), t.$$.dirty.fill(0)),
    (t.$$.dirty[(e / 31) | 0] |= 1 << e % 31));
}
function J(t, e, n, l, o, r, s = null, i = [-1]) {
  const c = j;
  H(t);
  const u = (t.$$ = {
    fragment: null,
    ctx: [],
    props: r,
    update: E,
    not_equal: o,
    bound: X(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (c ? c.$$.context : [])),
    callbacks: X(),
    dirty: i,
    skip_bound: !1,
    root: e.target || c.$$.root,
  });
  s && s(u.root);
  let h = !1;
  if (
    ((u.ctx = n
      ? n(t, e.props || {}, (p, $, ...w) => {
          const S = w.length ? w[0] : $;
          return (
            u.ctx &&
              o(u.ctx[p], (u.ctx[p] = S)) &&
              (!u.skip_bound && u.bound[p] && u.bound[p](S), h && wt(t, p)),
            $
          );
        })
      : []),
    u.update(),
    (h = !0),
    D(u.before_update),
    (u.fragment = l ? l(u.ctx) : !1),
    e.target)
  ) {
    if (e.hydrate) {
      const p = ht(e.target);
      (u.fragment && u.fragment.l(p), p.forEach(g));
    } else u.fragment && u.fragment.c();
    (e.intro && q(t.$$.fragment), z(t, e.target, e.anchor), ct());
  }
  H(c);
}
class Q {
  constructor() {
    U(this, '$$');
    U(this, '$$set');
  }
  $destroy() {
    (K(this, 1), (this.$destroy = E));
  }
  $on(e, n) {
    if (!it(n)) return E;
    const l = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return (
      l.push(n),
      () => {
        const o = l.indexOf(n);
        o !== -1 && l.splice(o, 1);
      }
    );
  }
  $set(e) {
    this.$$set && !mt(e) && ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
  }
}
const bt = '4';
typeof window < 'u' && (window.__svelte || (window.__svelte = { v: new Set() })).v.add(bt);
async function kt() {
  try {
    const t = await fetch('/api/stats');
    if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
    return await t.json();
  } catch (t) {
    throw (console.error('Failed to fetch stats:', t), t);
  }
}
async function St() {
  try {
    const t = await fetch('/api/health');
    if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
    return await t.json();
  } catch (t) {
    throw (console.error('Failed to fetch health:', t), t);
  }
}
function st(t) {
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
function lt(t) {
  if (!t && t !== 0) return 'N/A';
  try {
    const e = new Date(),
      n = new Date(e.getTime() - t * 1e3),
      l = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return n.getFullYear() === e.getFullYear()
      ? n.toLocaleDateString('en-US', l)
      : n.toLocaleDateString('en-US', { ...l, year: 'numeric' });
  } catch {
    return 'N/A';
  }
}
function Et(t) {
  var b;
  let e,
    n,
    l,
    o,
    r,
    s = (((b = t[0].total_gifs) == null ? void 0 : b.toLocaleString()) || '0') + '',
    i,
    c,
    u,
    h,
    p,
    $,
    w = (t[0].disk_usage_formatted || '0.00 MB') + '',
    S,
    T,
    v,
    C,
    P,
    L,
    x = (t[0].storage_path || 'N/A') + '',
    M;
  return {
    c() {
      ((e = f('dl')),
        (n = f('div')),
        (l = f('dt')),
        (l.textContent = 'Total GIFs'),
        (o = m()),
        (r = f('dd')),
        (i = k(s)),
        (c = m()),
        (u = f('div')),
        (h = f('dt')),
        (h.textContent = 'Disk Usage'),
        (p = m()),
        ($ = f('dd')),
        (S = k(w)),
        (T = m()),
        (v = f('div')),
        (C = f('dt')),
        (C.textContent = 'Storage Path'),
        (P = m()),
        (L = f('dd')),
        (M = k(x)),
        d(l, 'class', 'svelte-y9p609'),
        d(r, 'class', 'svelte-y9p609'),
        d(n, 'class', 'stat-item svelte-y9p609'),
        d(h, 'class', 'svelte-y9p609'),
        d($, 'class', 'svelte-y9p609'),
        d(u, 'class', 'stat-item svelte-y9p609'),
        d(C, 'class', 'svelte-y9p609'),
        d(L, 'class', 'path svelte-y9p609'),
        d(v, 'class', 'stat-item svelte-y9p609'),
        d(e, 'class', 'svelte-y9p609'));
    },
    m(_, F) {
      (y(_, e, F),
        a(e, n),
        a(n, l),
        a(n, o),
        a(n, r),
        a(r, i),
        a(n, c),
        a(e, u),
        a(u, h),
        a(u, p),
        a(u, $),
        a($, S),
        a(u, T),
        a(e, v),
        a(v, C),
        a(v, P),
        a(v, L),
        a(L, M));
    },
    p(_, F) {
      var W;
      (F & 1 &&
        s !== (s = (((W = _[0].total_gifs) == null ? void 0 : W.toLocaleString()) || '0') + '') &&
        N(i, s),
        F & 1 && w !== (w = (_[0].disk_usage_formatted || '0.00 MB') + '') && N(S, w),
        F & 1 && x !== (x = (_[0].storage_path || 'N/A') + '') && N(M, x));
    },
    d(_) {
      _ && g(e);
    },
  };
}
function Ct(t) {
  let e, n, l, o, r, s, i;
  return {
    c() {
      ((e = f('div')),
        (n = k('Error: ')),
        (l = k(t[2])),
        (o = m()),
        (r = f('button')),
        (r.textContent = 'Retry'),
        d(e, 'class', 'error svelte-y9p609'),
        d(r, 'class', 'svelte-y9p609'));
    },
    m(c, u) {
      (y(c, e, u),
        a(e, n),
        a(e, l),
        y(c, o, u),
        y(c, r, u),
        s || ((i = ut(r, 'click', t[3])), (s = !0)));
    },
    p(c, u) {
      u & 4 && N(l, c[2]);
    },
    d(c) {
      (c && (g(e), g(o), g(r)), (s = !1), i());
    },
  };
}
function Lt(t) {
  let e;
  return {
    c() {
      ((e = f('div')), (e.textContent = 'Loading...'), d(e, 'class', 'loading svelte-y9p609'));
    },
    m(n, l) {
      y(n, e, l);
    },
    p: E,
    d(n) {
      n && g(e);
    },
  };
}
function xt(t) {
  let e, n, l;
  function o(i, c) {
    if (i[1] && !i[0]) return Lt;
    if (i[2]) return Ct;
    if (i[0]) return Et;
  }
  let r = o(t),
    s = r && r(t);
  return {
    c() {
      ((e = f('section')),
        (n = f('h2')),
        (n.textContent = 'Statistics'),
        (l = m()),
        s && s.c(),
        d(n, 'class', 'svelte-y9p609'),
        d(e, 'class', 'stats svelte-y9p609'));
    },
    m(i, c) {
      (y(i, e, c), a(e, n), a(e, l), s && s.m(e, null));
    },
    p(i, [c]) {
      r === (r = o(i)) && s
        ? s.p(i, c)
        : (s && s.d(1), (s = r && r(i)), s && (s.c(), s.m(e, null)));
    },
    i: E,
    o: E,
    d(i) {
      (i && g(e), s && s.d());
    },
  };
}
function Nt(t, e, n) {
  let l = null,
    o = !0,
    r = null;
  async function s() {
    (n(1, (o = !0)), n(2, (r = null)));
    try {
      n(0, (l = await kt()));
    } catch (i) {
      n(2, (r = i.message));
    } finally {
      n(1, (o = !1));
    }
  }
  return (
    at(() => {
      s();
      const i = setInterval(s, 3e4);
      return () => clearInterval(i);
    }),
    [l, o, r, s]
  );
}
class Mt extends Q {
  constructor(e) {
    (super(), J(this, e, Nt, xt, V, {}));
  }
}
function Ot(t) {
  let e,
    n,
    l,
    o,
    r,
    s = (t[0].status || 'unknown') + '',
    i,
    c,
    u,
    h,
    p,
    $,
    w = st(t[0].uptime || 0) + '',
    S,
    T,
    v,
    C,
    P,
    L,
    x = lt(t[0].uptime) + '',
    M;
  return {
    c() {
      ((e = f('dl')),
        (n = f('div')),
        (l = f('dt')),
        (l.textContent = 'Status'),
        (o = m()),
        (r = f('dd')),
        (i = k(s)),
        (c = m()),
        (u = f('div')),
        (h = f('dt')),
        (h.textContent = 'Uptime'),
        (p = m()),
        ($ = f('dd')),
        (S = k(w)),
        (T = m()),
        (v = f('div')),
        (C = f('dt')),
        (C.textContent = 'Started'),
        (P = m()),
        (L = f('dd')),
        (M = k(x)),
        d(l, 'class', 'svelte-uoumsm'),
        d(r, 'class', 'status svelte-uoumsm'),
        Z(r, 'ok', t[0].status === 'ok'),
        d(n, 'class', 'stat-item svelte-uoumsm'),
        d(h, 'class', 'svelte-uoumsm'),
        d($, 'class', 'svelte-uoumsm'),
        d(u, 'class', 'stat-item svelte-uoumsm'),
        d(C, 'class', 'svelte-uoumsm'),
        d(L, 'class', 'timestamp svelte-uoumsm'),
        d(v, 'class', 'stat-item svelte-uoumsm'),
        d(e, 'class', 'svelte-uoumsm'));
    },
    m(b, _) {
      (y(b, e, _),
        a(e, n),
        a(n, l),
        a(n, o),
        a(n, r),
        a(r, i),
        a(n, c),
        a(e, u),
        a(u, h),
        a(u, p),
        a(u, $),
        a($, S),
        a(u, T),
        a(e, v),
        a(v, C),
        a(v, P),
        a(v, L),
        a(L, M));
    },
    p(b, _) {
      (_ & 1 && s !== (s = (b[0].status || 'unknown') + '') && N(i, s),
        _ & 1 && Z(r, 'ok', b[0].status === 'ok'),
        _ & 1 && w !== (w = st(b[0].uptime || 0) + '') && N(S, w),
        _ & 1 && x !== (x = lt(b[0].uptime) + '') && N(M, x));
    },
    d(b) {
      b && g(e);
    },
  };
}
function At(t) {
  let e, n, l, o, r, s, i;
  return {
    c() {
      ((e = f('div')),
        (n = k('Error: ')),
        (l = k(t[2])),
        (o = m()),
        (r = f('button')),
        (r.textContent = 'Retry'),
        d(e, 'class', 'error svelte-uoumsm'),
        d(r, 'class', 'svelte-uoumsm'));
    },
    m(c, u) {
      (y(c, e, u),
        a(e, n),
        a(e, l),
        y(c, o, u),
        y(c, r, u),
        s || ((i = ut(r, 'click', t[3])), (s = !0)));
    },
    p(c, u) {
      u & 4 && N(l, c[2]);
    },
    d(c) {
      (c && (g(e), g(o), g(r)), (s = !1), i());
    },
  };
}
function It(t) {
  let e;
  return {
    c() {
      ((e = f('div')), (e.textContent = 'Loading...'), d(e, 'class', 'loading svelte-uoumsm'));
    },
    m(n, l) {
      y(n, e, l);
    },
    p: E,
    d(n) {
      n && g(e);
    },
  };
}
function Tt(t) {
  let e, n, l;
  function o(i, c) {
    if (i[1] && !i[0]) return It;
    if (i[2]) return At;
    if (i[0]) return Ot;
  }
  let r = o(t),
    s = r && r(t);
  return {
    c() {
      ((e = f('section')),
        (n = f('h2')),
        (n.textContent = 'Health Status'),
        (l = m()),
        s && s.c(),
        d(n, 'class', 'svelte-uoumsm'),
        d(e, 'class', 'health svelte-uoumsm'));
    },
    m(i, c) {
      (y(i, e, c), a(e, n), a(e, l), s && s.m(e, null));
    },
    p(i, [c]) {
      r === (r = o(i)) && s
        ? s.p(i, c)
        : (s && s.d(1), (s = r && r(i)), s && (s.c(), s.m(e, null)));
    },
    i: E,
    o: E,
    d(i) {
      (i && g(e), s && s.d());
    },
  };
}
function Pt(t, e, n) {
  let l = null,
    o = !0,
    r = null;
  async function s() {
    (n(1, (o = !0)), n(2, (r = null)));
    try {
      n(0, (l = await St()));
    } catch (i) {
      n(2, (r = i.message));
    } finally {
      n(1, (o = !1));
    }
  }
  return (
    at(() => {
      s();
      const i = setInterval(s, 1e4);
      return () => clearInterval(i);
    }),
    [l, o, r, s]
  );
}
class Ft extends Q {
  constructor(e) {
    (super(), J(this, e, Pt, Tt, V, {}));
  }
}
function Ht(t) {
  let e, n, l, o, r, s, i, c;
  return (
    (r = new Mt({})),
    (i = new Ft({})),
    {
      c() {
        ((e = f('main')),
          (n = f('header')),
          (n.innerHTML = '<h1 class="svelte-1d5rxi1">Discord GIF Bot</h1>'),
          (l = m()),
          (o = f('div')),
          rt(r.$$.fragment),
          (s = m()),
          rt(i.$$.fragment),
          d(n, 'class', 'svelte-1d5rxi1'),
          d(o, 'class', 'content svelte-1d5rxi1'),
          d(e, 'class', 'svelte-1d5rxi1'));
      },
      m(u, h) {
        (y(u, e, h), a(e, n), a(e, l), a(e, o), z(r, o, null), a(o, s), z(i, o, null), (c = !0));
      },
      p: E,
      i(u) {
        c || (q(r.$$.fragment, u), q(i.$$.fragment, u), (c = !0));
      },
      o(u) {
        (nt(r.$$.fragment, u), nt(i.$$.fragment, u), (c = !1));
      },
      d(u) {
        (u && g(e), K(r), K(i));
      },
    }
  );
}
class jt extends Q {
  constructor(e) {
    (super(), J(this, e, null, Ht, V, {}));
  }
}
new jt({ target: document.getElementById('app') });
