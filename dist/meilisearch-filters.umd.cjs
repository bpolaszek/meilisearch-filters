(function (s, r) {
  typeof exports == "object" && typeof module < "u" ? r(exports) : typeof define == "function" && define.amd ? define(["exports"], r) : (s = typeof globalThis < "u" ? globalThis : s || self, r(s["meilisearch-filters"] = {}));
})(this, function (s) {
  "use strict";
  var M = Object.defineProperty;
  var C = (s, r, o) => r in s ? M(s, r, {enumerable: !0, configurable: !0, writable: !0, value: o}) : s[r] = o;
  var l = (s, r, o) => (C(s, typeof r != "symbol" ? r + "" : r, o), o);
  const r = n => (n + "").replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0"),
    o = n => (typeof n != "string" && (n = `${n}`), n.includes("'") ? `'${r(n)}'` : n);

  class c extends Error {
    constructor(e, ...t) {
      super(...t), this.name = "UnhandledMatchError", this.message = `Unhandled match value of type ${typeof e} - ${e}`, Error.captureStackTrace(this, c);
    }
  }

  const g = Symbol(), w = (n, e) => {
    const t = new Map;
    for (const [...i] of e) {
      const j = i.pop();
      for (const m of i.flat()) t.has(m) || t.set(m, j);
    }
    if (!t.has(n) && !t.has(g)) throw new c(n);
    return t.get(n) ?? t.get(g);
  };
  w.default = g;

  class u {
    toString() {
      throw new Error("This method has to be implemented.");
    }

    and(e) {
      return e instanceof a && (e = e.group()), new N([this, e]);
    }

    or(e) {
      return e instanceof a && (e = e.group()), new B([this, e]);
    }

    negate() {
      return new x(this);
    }

    group() {
      return new $(this);
    }
  }

  class a extends u {
  }

  class $ extends u {
    constructor(e) {
      super(), this.expression = e;
    }

    toString() {
      return `(${this.expression})`;
    }

    group() {
      return this;
    }
  }

  class x extends u {
    constructor(e) {
      super(), this.expression = e;
    }

    toString() {
      return `NOT ${this.expression}`;
    }
  }

  class N extends a {
    constructor(e) {
      super(), this.expressions = e;
    }

    negate() {
      return this.group().negate();
    }

    toString() {
      return this.expressions.join(" AND ");
    }
  }

  class B extends a {
    constructor(e) {
      super(), this.expressions = e;
    }

    negate() {
      return this.group().negate();
    }

    toString() {
      return this.expressions.join(" OR ");
    }
  }

  class h extends u {
    constructor(e, t, i = "=") {
      super(), this.field = e, this.value = t, this.operator = i;
    }

    negate() {
      const e = new h(this.field, this.value);
      return e.operator = w(this.operator, [["=", "!="], ["!=", "="], [">", "<="], ["<", ">="], [">=", "<"], ["<=", ">"]]), e;
    }

    toString() {
      return `${this.field} ${this.operator} ${o(this.value)}`;
    }
  }

  class y extends u {
    constructor(e, t, i) {
      super(), this.field = e, this.left = t, this.right = i;
    }

    toString() {
      return `${this.field} ${o(this.left)} TO ${o(this.right)}`;
    }
  }

  class f extends u {
    constructor(t) {
      super();
      l(this, "negated", !1);
      this.field = t;
    }

    negate() {
      const t = new f(this.field);
      return t.negated = !this.negated, t;
    }

    toString() {
      return this.negated ? `${this.field} NOT EXISTS` : `${this.field} EXISTS`;
    }
  }

  class d extends u {
    constructor(t, i) {
      super();
      l(this, "negated", !1);
      this.field = t, this.type = i;
    }

    negate() {
      const t = new d(this.field, this.type);
      return t.negated = !this.negated, t;
    }

    toString() {
      return this.negated ? `${this.field} IS NOT ${this.type}` : `${this.field} IS ${this.type}`;
    }
  }

  class p extends u {
    constructor(t, i) {
      super();
      l(this, "negated", !1);
      this.field = t, this.values = i;
    }

    negate() {
      const t = new p(this.field, this.values);
      return t.negated = !this.negated, t;
    }

    toString() {
      const t = this.values.map(o);
      return this.negated ? `${this.field} NOT IN [${t.join(", ")}]` : `${this.field} IN [${t.join(", ")}]`;
    }
  }

  class G extends u {
    constructor(e, t, i) {
      super(), this.latitude = e, this.longitude = t, this.distanceInMeters = i;
    }

    toString() {
      return `_geoRadius(${this.latitude}, ${this.longitude}, ${this.distanceInMeters})`;
    }
  }

  class E extends u {
    constructor(e, t) {
      super(), this.topLeftCorner = e, this.bottomRightCorner = t;
    }

    toString() {
      return `_geoBoundingBox(${[this.topLeftCorner, this.bottomRightCorner].map(([t, i]) => `[${t}, ${i}]`).join(", ")})`;
    }
  }

  class I {
    constructor(e) {
      this.field = e;
    }

    equals(e) {
      return new h(this.field, e);
    }

    notEquals(e) {
      return this.equals(e).negate();
    }

    isGreaterThan(e, t = !1) {
      return new h(this.field, e, t ? ">=" : ">");
    }

    isNotGreaterThan(e, t = !1) {
      return this.isGreaterThan(e, t).negate();
    }

    isLowerThan(e, t = !1) {
      return new h(this.field, e, t ? "<=" : "<");
    }

    isNotLowerThan(e, t = !1) {
      return this.isLowerThan(e, t).negate();
    }

    isBetween(e, t, i = !0) {
      return i ? new y(this.field, e, t) : this.isGreaterThan(e).and(this.isLowerThan(t));
    }

    isNotBetween(e, t, i = !0) {
      return this.isBetween(e, t, i).negate();
    }

    exists() {
      return new f(this.field);
    }

    doesNotExist() {
      return this.exists().negate();
    }

    isNull() {
      return new d(this.field, "NULL");
    }

    isNotNull() {
      return this.isNull().negate();
    }

    isEmpty() {
      return new d(this.field, "EMPTY");
    }

    isNotEmpty() {
      return this.isEmpty().negate();
    }

    isIn(e) {
      return new p(this.field, e);
    }

    isNotIn(e) {
      return this.isIn(e).negate();
    }
  }

  const b = n => new I(n), R = n => new x(n), v = n => new $(n);

  function S(n, e, t) {
    return new G(n, e, t);
  }

  function L(n, e, t) {
    return S(n, e, t).negate();
  }

  function T(n, e) {
    return new E(n, e);
  }

  function O(n, e) {
    return T(n, e).negate();
  }

  s.field = b, s.group = v, s.not = R, s.notWithinGeoBoundingBox = O, s.notWithinGeoRadius = L, s.withinGeoBoundingBox = T, s.withinGeoRadius = S, Object.defineProperty(s, Symbol.toStringTag, {value: "Module"});
});
