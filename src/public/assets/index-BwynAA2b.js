var ft = Object.defineProperty;
var dt = (e, t, n) =>
  t in e ? ft(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
var B = (e, t, n) => dt(e, typeof t != 'symbol' ? t + '' : t, n);
(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const l of document.querySelectorAll('link[rel="modulepreload"]')) o(l);
  new MutationObserver(l => {
    for (const r of l)
      if (r.type === 'childList')
        for (const s of r.addedNodes) s.tagName === 'LINK' && s.rel === 'modulepreload' && o(s);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(l) {
    const r = {};
    return (
      l.integrity && (r.integrity = l.integrity),
      l.referrerPolicy && (r.referrerPolicy = l.referrerPolicy),
      l.crossOrigin === 'use-credentials'
        ? (r.credentials = 'include')
        : l.crossOrigin === 'anonymous'
          ? (r.credentials = 'omit')
          : (r.credentials = 'same-origin'),
      r
    );
  }
  function o(l) {
    if (l.ep) return;
    l.ep = !0;
    const r = n(l);
    fetch(l.href, r);
  }
})();
function E() {}
function ot(e) {
  return e();
}
function X() {
  return Object.create(null);
}
function j(e) {
  e.forEach(ot);
}
function it(e) {
  return typeof e == 'function';
}
function V(e, t) {
  return e != e ? t == t : e !== t || (e && typeof e == 'object') || typeof e == 'function';
}
function mt(e) {
  return Object.keys(e).length === 0;
}
function a(e, t) {
  e.appendChild(t);
}
function y(e, t, n) {
  e.insertBefore(t, n || null);
}
function g(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function f(e) {
  return document.createElement(e);
}
function k(e) {
  return document.createTextNode(e);
}
function m() {
  return k(' ');
}
function ut(e, t, n, o) {
  return (e.addEventListener(t, n, o), () => e.removeEventListener(t, n, o));
}
function d(e, t, n) {
  n == null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function ht(e) {
  return Array.from(e.childNodes);
}
function x(e, t) {
  ((t = '' + t), e.data !== t && (e.data = t));
}
function Z(e, t, n) {
  e.classList.toggle(t, !!n);
}
let D;
function T(e) {
  D = e;
}
function pt() {
  if (!D) throw new Error('Function called outside component initialization');
  return D;
}
function at(e) {
  pt().$$.on_mount.push(e);
}
const I = [],
  tt = [];
let A = [];
const et = [],
  _t = Promise.resolve();
let G = !1;
function gt() {
  G || ((G = !0), _t.then(ct));
}
function Y(e) {
  A.push(e);
}
const R = new Set();
let O = 0;
function ct() {
  if (O !== 0) return;
  const e = D;
  do {
    try {
      for (; O < I.length; ) {
        const t = I[O];
        (O++, T(t), vt(t.$$));
      }
    } catch (t) {
      throw ((I.length = 0), (O = 0), t);
    }
    for (T(null), I.length = 0, O = 0; tt.length; ) tt.pop()();
    for (let t = 0; t < A.length; t += 1) {
      const n = A[t];
      R.has(n) || (R.add(n), n());
    }
    A.length = 0;
  } while (I.length);
  for (; et.length; ) et.pop()();
  ((G = !1), R.clear(), T(e));
}
function vt(e) {
  if (e.fragment !== null) {
    (e.update(), j(e.before_update));
    const t = e.dirty;
    ((e.dirty = [-1]), e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(Y));
  }
}
function yt(e) {
  const t = [],
    n = [];
  (A.forEach(o => (e.indexOf(o) === -1 ? t.push(o) : n.push(o))), n.forEach(o => o()), (A = t));
}
const U = new Set();
let $t;
function q(e, t) {
  e && e.i && (U.delete(e), e.i(t));
}
function nt(e, t, n, o) {
  if (e && e.o) {
    if (U.has(e)) return;
    (U.add(e),
      $t.c.push(() => {
        U.delete(e);
      }),
      e.o(t));
  }
}
function rt(e) {
  e && e.c();
}
function z(e, t, n) {
  const { fragment: o, after_update: l } = e.$$;
  (o && o.m(t, n),
    Y(() => {
      const r = e.$$.on_mount.map(ot).filter(it);
      (e.$$.on_destroy ? e.$$.on_destroy.push(...r) : j(r), (e.$$.on_mount = []));
    }),
    l.forEach(Y));
}
function K(e, t) {
  const n = e.$$;
  n.fragment !== null &&
    (yt(n.after_update),
    j(n.on_destroy),
    n.fragment && n.fragment.d(t),
    (n.on_destroy = n.fragment = null),
    (n.ctx = []));
}
function wt(e, t) {
  (e.$$.dirty[0] === -1 && (I.push(e), gt(), e.$$.dirty.fill(0)),
    (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31));
}
function J(e, t, n, o, l, r, s = null, i = [-1]) {
  const c = D;
  T(e);
  const u = (e.$$ = {
    fragment: null,
    ctx: [],
    props: r,
    update: E,
    not_equal: l,
    bound: X(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (c ? c.$$.context : [])),
    callbacks: X(),
    dirty: i,
    skip_bound: !1,
    root: t.target || c.$$.root,
  });
  s && s(u.root);
  let h = !1;
  if (
    ((u.ctx = n
      ? n(e, t.props || {}, (p, $, ...w) => {
          const S = w.length ? w[0] : $;
          return (
            u.ctx &&
              l(u.ctx[p], (u.ctx[p] = S)) &&
              (!u.skip_bound && u.bound[p] && u.bound[p](S), h && wt(e, p)),
            $
          );
        })
      : []),
    u.update(),
    (h = !0),
    j(u.before_update),
    (u.fragment = o ? o(u.ctx) : !1),
    t.target)
  ) {
    if (t.hydrate) {
      const p = ht(t.target);
      (u.fragment && u.fragment.l(p), p.forEach(g));
    } else u.fragment && u.fragment.c();
    (t.intro && q(e.$$.fragment), z(e, t.target, t.anchor), ct());
  }
  T(c);
}
class Q {
  constructor() {
    B(this, '$$');
    B(this, '$$set');
  }
  $destroy() {
    (K(this, 1), (this.$destroy = E));
  }
  $on(t, n) {
    if (!it(n)) return E;
    const o = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return (
      o.push(n),
      () => {
        const l = o.indexOf(n);
        l !== -1 && o.splice(l, 1);
      }
    );
  }
  $set(t) {
    this.$$set && !mt(t) && ((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1));
  }
}
const bt = '4';
typeof window < 'u' && (window.__svelte || (window.__svelte = { v: new Set() })).v.add(bt);
async function kt() {
  try {
    const e = await fetch('/api/stats');
    if (!e.ok) throw new Error(`HTTP error! status: ${e.status}`);
    return await e.json();
  } catch (e) {
    throw (console.error('Failed to fetch stats:', e), e);
  }
}
async function St() {
  try {
    const e = await fetch('/api/health');
    if (!e.ok) throw new Error(`HTTP error! status: ${e.status}`);
    return await e.json();
  } catch (e) {
    throw (console.error('Failed to fetch health:', e), e);
  }
}
function st(e) {
  if (e < 60) return `${e}s`;
  if (e < 3600) return `${Math.floor(e / 60)}m`;
  if (e < 86400) {
    const t = Math.floor(e / 3600),
      n = Math.floor((e % 3600) / 60);
    return `${t}h ${n}m`;
  } else {
    const t = Math.floor(e / 86400),
      n = Math.floor((e % 86400) / 3600);
    return `${t}d ${n}h`;
  }
}
function lt(e) {
  if (!e) return 'N/A';
  try {
    const t = new Date(e),
      n = new Date(),
      o = n - t,
      l = Math.floor(o / 1e3),
      r = Math.floor(l / 60),
      s = Math.floor(r / 60),
      i = Math.floor(s / 24);
    if (l < 60) return `${l}s ago`;
    if (r < 60) return `${r}m ago`;
    if (s < 24) return `${s}h ago`;
    if (i < 7) return `${i}d ago`;
    const c = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return t.getFullYear() === n.getFullYear()
      ? t.toLocaleDateString('en-US', c)
      : t.toLocaleDateString('en-US', { ...c, year: 'numeric' });
  } catch {
    return e;
  }
}
function Et(e) {
  var b;
  let t,
    n,
    o,
    l,
    r,
    s = (((b = e[0].total_gifs) == null ? void 0 : b.toLocaleString()) || '0') + '',
    i,
    c,
    u,
    h,
    p,
    $,
    w = (e[0].disk_usage_formatted || '0.00 MB') + '',
    S,
    P,
    v,
    L,
    F,
    M,
    C = (e[0].storage_path || 'N/A') + '',
    N;
  return {
    c() {
      ((t = f('dl')),
        (n = f('div')),
        (o = f('dt')),
        (o.textContent = 'Total GIFs'),
        (l = m()),
        (r = f('dd')),
        (i = k(s)),
        (c = m()),
        (u = f('div')),
        (h = f('dt')),
        (h.textContent = 'Disk Usage'),
        (p = m()),
        ($ = f('dd')),
        (S = k(w)),
        (P = m()),
        (v = f('div')),
        (L = f('dt')),
        (L.textContent = 'Storage Path'),
        (F = m()),
        (M = f('dd')),
        (N = k(C)),
        d(o, 'class', 'svelte-y9p609'),
        d(r, 'class', 'svelte-y9p609'),
        d(n, 'class', 'stat-item svelte-y9p609'),
        d(h, 'class', 'svelte-y9p609'),
        d($, 'class', 'svelte-y9p609'),
        d(u, 'class', 'stat-item svelte-y9p609'),
        d(L, 'class', 'svelte-y9p609'),
        d(M, 'class', 'path svelte-y9p609'),
        d(v, 'class', 'stat-item svelte-y9p609'),
        d(t, 'class', 'svelte-y9p609'));
    },
    m(_, H) {
      (y(_, t, H),
        a(t, n),
        a(n, o),
        a(n, l),
        a(n, r),
        a(r, i),
        a(n, c),
        a(t, u),
        a(u, h),
        a(u, p),
        a(u, $),
        a($, S),
        a(u, P),
        a(t, v),
        a(v, L),
        a(v, F),
        a(v, M),
        a(M, N));
    },
    p(_, H) {
      var W;
      (H & 1 &&
        s !== (s = (((W = _[0].total_gifs) == null ? void 0 : W.toLocaleString()) || '0') + '') &&
        x(i, s),
        H & 1 && w !== (w = (_[0].disk_usage_formatted || '0.00 MB') + '') && x(S, w),
        H & 1 && C !== (C = (_[0].storage_path || 'N/A') + '') && x(N, C));
    },
    d(_) {
      _ && g(t);
    },
  };
}
function Lt(e) {
  let t, n, o, l, r, s, i;
  return {
    c() {
      ((t = f('div')),
        (n = k('Error: ')),
        (o = k(e[2])),
        (l = m()),
        (r = f('button')),
        (r.textContent = 'Retry'),
        d(t, 'class', 'error svelte-y9p609'),
        d(r, 'class', 'svelte-y9p609'));
    },
    m(c, u) {
      (y(c, t, u),
        a(t, n),
        a(t, o),
        y(c, l, u),
        y(c, r, u),
        s || ((i = ut(r, 'click', e[3])), (s = !0)));
    },
    p(c, u) {
      u & 4 && x(o, c[2]);
    },
    d(c) {
      (c && (g(t), g(l), g(r)), (s = !1), i());
    },
  };
}
function Mt(e) {
  let t;
  return {
    c() {
      ((t = f('div')), (t.textContent = 'Loading...'), d(t, 'class', 'loading svelte-y9p609'));
    },
    m(n, o) {
      y(n, t, o);
    },
    p: E,
    d(n) {
      n && g(t);
    },
  };
}
function Ct(e) {
  let t, n, o;
  function l(i, c) {
    if (i[1] && !i[0]) return Mt;
    if (i[2]) return Lt;
    if (i[0]) return Et;
  }
  let r = l(e),
    s = r && r(e);
  return {
    c() {
      ((t = f('section')),
        (n = f('h2')),
        (n.textContent = 'Statistics'),
        (o = m()),
        s && s.c(),
        d(n, 'class', 'svelte-y9p609'),
        d(t, 'class', 'stats svelte-y9p609'));
    },
    m(i, c) {
      (y(i, t, c), a(t, n), a(t, o), s && s.m(t, null));
    },
    p(i, [c]) {
      r === (r = l(i)) && s
        ? s.p(i, c)
        : (s && s.d(1), (s = r && r(i)), s && (s.c(), s.m(t, null)));
    },
    i: E,
    o: E,
    d(i) {
      (i && g(t), s && s.d());
    },
  };
}
function xt(e, t, n) {
  let o = null,
    l = !0,
    r = null;
  async function s() {
    (n(1, (l = !0)), n(2, (r = null)));
    try {
      n(0, (o = await kt()));
    } catch (i) {
      n(2, (r = i.message));
    } finally {
      n(1, (l = !1));
    }
  }
  return (
    at(() => {
      s();
      const i = setInterval(s, 3e4);
      return () => clearInterval(i);
    }),
    [o, l, r, s]
  );
}
class Nt extends Q {
  constructor(t) {
    (super(), J(this, t, xt, Ct, V, {}));
  }
}
function Ot(e) {
  let t,
    n,
    o,
    l,
    r,
    s = (e[0].status || 'unknown') + '',
    i,
    c,
    u,
    h,
    p,
    $,
    w = st(e[0].uptime || 0) + '',
    S,
    P,
    v,
    L,
    F,
    M,
    C = lt(e[0].timestamp) + '',
    N;
  return {
    c() {
      ((t = f('dl')),
        (n = f('div')),
        (o = f('dt')),
        (o.textContent = 'Status'),
        (l = m()),
        (r = f('dd')),
        (i = k(s)),
        (c = m()),
        (u = f('div')),
        (h = f('dt')),
        (h.textContent = 'Uptime'),
        (p = m()),
        ($ = f('dd')),
        (S = k(w)),
        (P = m()),
        (v = f('div')),
        (L = f('dt')),
        (L.textContent = 'Last Update'),
        (F = m()),
        (M = f('dd')),
        (N = k(C)),
        d(o, 'class', 'svelte-uoumsm'),
        d(r, 'class', 'status svelte-uoumsm'),
        Z(r, 'ok', e[0].status === 'ok'),
        d(n, 'class', 'stat-item svelte-uoumsm'),
        d(h, 'class', 'svelte-uoumsm'),
        d($, 'class', 'svelte-uoumsm'),
        d(u, 'class', 'stat-item svelte-uoumsm'),
        d(L, 'class', 'svelte-uoumsm'),
        d(M, 'class', 'timestamp svelte-uoumsm'),
        d(v, 'class', 'stat-item svelte-uoumsm'),
        d(t, 'class', 'svelte-uoumsm'));
    },
    m(b, _) {
      (y(b, t, _),
        a(t, n),
        a(n, o),
        a(n, l),
        a(n, r),
        a(r, i),
        a(n, c),
        a(t, u),
        a(u, h),
        a(u, p),
        a(u, $),
        a($, S),
        a(u, P),
        a(t, v),
        a(v, L),
        a(v, F),
        a(v, M),
        a(M, N));
    },
    p(b, _) {
      (_ & 1 && s !== (s = (b[0].status || 'unknown') + '') && x(i, s),
        _ & 1 && Z(r, 'ok', b[0].status === 'ok'),
        _ & 1 && w !== (w = st(b[0].uptime || 0) + '') && x(S, w),
        _ & 1 && C !== (C = lt(b[0].timestamp) + '') && x(N, C));
    },
    d(b) {
      b && g(t);
    },
  };
}
function It(e) {
  let t, n, o, l, r, s, i;
  return {
    c() {
      ((t = f('div')),
        (n = k('Error: ')),
        (o = k(e[2])),
        (l = m()),
        (r = f('button')),
        (r.textContent = 'Retry'),
        d(t, 'class', 'error svelte-uoumsm'),
        d(r, 'class', 'svelte-uoumsm'));
    },
    m(c, u) {
      (y(c, t, u),
        a(t, n),
        a(t, o),
        y(c, l, u),
        y(c, r, u),
        s || ((i = ut(r, 'click', e[3])), (s = !0)));
    },
    p(c, u) {
      u & 4 && x(o, c[2]);
    },
    d(c) {
      (c && (g(t), g(l), g(r)), (s = !1), i());
    },
  };
}
function At(e) {
  let t;
  return {
    c() {
      ((t = f('div')), (t.textContent = 'Loading...'), d(t, 'class', 'loading svelte-uoumsm'));
    },
    m(n, o) {
      y(n, t, o);
    },
    p: E,
    d(n) {
      n && g(t);
    },
  };
}
function Pt(e) {
  let t, n, o;
  function l(i, c) {
    if (i[1] && !i[0]) return At;
    if (i[2]) return It;
    if (i[0]) return Ot;
  }
  let r = l(e),
    s = r && r(e);
  return {
    c() {
      ((t = f('section')),
        (n = f('h2')),
        (n.textContent = 'Health Status'),
        (o = m()),
        s && s.c(),
        d(n, 'class', 'svelte-uoumsm'),
        d(t, 'class', 'health svelte-uoumsm'));
    },
    m(i, c) {
      (y(i, t, c), a(t, n), a(t, o), s && s.m(t, null));
    },
    p(i, [c]) {
      r === (r = l(i)) && s
        ? s.p(i, c)
        : (s && s.d(1), (s = r && r(i)), s && (s.c(), s.m(t, null)));
    },
    i: E,
    o: E,
    d(i) {
      (i && g(t), s && s.d());
    },
  };
}
function Ft(e, t, n) {
  let o = null,
    l = !0,
    r = null;
  async function s() {
    (n(1, (l = !0)), n(2, (r = null)));
    try {
      n(0, (o = await St()));
    } catch (i) {
      n(2, (r = i.message));
    } finally {
      n(1, (l = !1));
    }
  }
  return (
    at(() => {
      s();
      const i = setInterval(s, 1e4);
      return () => clearInterval(i);
    }),
    [o, l, r, s]
  );
}
class Ht extends Q {
  constructor(t) {
    (super(), J(this, t, Ft, Pt, V, {}));
  }
}
function Tt(e) {
  let t, n, o, l, r, s, i, c;
  return (
    (r = new Nt({})),
    (i = new Ht({})),
    {
      c() {
        ((t = f('main')),
          (n = f('header')),
          (n.innerHTML = '<h1 class="svelte-1d5rxi1">Discord GIF Bot</h1>'),
          (o = m()),
          (l = f('div')),
          rt(r.$$.fragment),
          (s = m()),
          rt(i.$$.fragment),
          d(n, 'class', 'svelte-1d5rxi1'),
          d(l, 'class', 'content svelte-1d5rxi1'),
          d(t, 'class', 'svelte-1d5rxi1'));
      },
      m(u, h) {
        (y(u, t, h), a(t, n), a(t, o), a(t, l), z(r, l, null), a(l, s), z(i, l, null), (c = !0));
      },
      p: E,
      i(u) {
        c || (q(r.$$.fragment, u), q(i.$$.fragment, u), (c = !0));
      },
      o(u) {
        (nt(r.$$.fragment, u), nt(i.$$.fragment, u), (c = !1));
      },
      d(u) {
        (u && g(t), K(r), K(i));
      },
    }
  );
}
class Dt extends Q {
  constructor(t) {
    (super(), J(this, t, null, Tt, V, {}));
  }
}
new Dt({ target: document.getElementById('app') });
