var G = Object.defineProperty;
var I = (n, t, e) => t in n ? G(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var i = (n, t, e) => (I(n, typeof t != "symbol" ? t + "" : t, e), e);
const l = (n) => `'${`${n}`.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0")}'`;
class f extends Error {
  constructor(t, ...e) {
    super(...e), this.name = "UnhandledMatchError", this.message = `Unhandled match value of type ${typeof t} - ${t}`, Error.captureStackTrace(this, f);
  }
}
const g = Symbol(), m = (n, t) => {
  const e = /* @__PURE__ */ new Map();
  for (const [...s] of t) {
    const y = s.pop();
    for (const S of s.flat())
      e.has(S) || e.set(S, y);
  }
  if (!e.has(n) && !e.has(g))
    throw new f(n);
  return e.get(n) ?? e.get(g);
};
m.default = g;
const u = (n) => typeof n == "string" ? w.fromString(n) : n, p = (n) => n.map(u);
class r {
  toString() {
    throw new Error("This method has to be implemented.");
  }
  and(t, ...e) {
    return new a(p([this, t, ...e]));
  }
  or(t, ...e) {
    return new E(p([this, t, ...e]));
  }
  negate() {
    return new B(this);
  }
  group() {
    return new T(this);
  }
}
class N extends r {
  toString() {
    return "";
  }
  and(t, ...e) {
    return e.length === 0 ? u(t) : new a([t, ...e]);
  }
  or(t, ...e) {
    return e.length === 0 ? u(t) : new E([t, ...e]);
  }
  negate() {
    return this;
  }
  group() {
    return this;
  }
}
class w extends r {
  constructor(t) {
    super(), this.expression = t;
  }
  toString() {
    return this.expression;
  }
  static fromString(t) {
    return t.length > 0 ? new w(t) : new N();
  }
}
class d extends r {
  constructor(e) {
    super();
    i(this, "expressions");
    this.expressions = p(e).map(
      (s) => s instanceof d ? s.group() : s
    );
  }
  negate() {
    return this.group().negate();
  }
}
class a extends d {
  constructor(t) {
    super(t);
  }
  toString() {
    return this.expressions.join(" AND ");
  }
}
class E extends d {
  constructor(t) {
    super(t);
  }
  toString() {
    return this.expressions.join(" OR ");
  }
}
class T extends r {
  constructor(e) {
    super();
    i(this, "expression");
    this.expression = u(e);
  }
  toString() {
    return `(${this.expression})`;
  }
  group() {
    return this;
  }
}
class B extends r {
  constructor(e) {
    super();
    i(this, "expression");
    this.expression = u(e);
  }
  and(e, ...s) {
    return this.group().and(e, ...s);
  }
  or(e, ...s) {
    return this.group().or(e, ...s);
  }
  negate() {
    return this.expression;
  }
  toString() {
    return `NOT ${this.expression}`;
  }
}
class h extends r {
  constructor(t) {
    super(), this.field = t;
  }
}
class o extends h {
  constructor(t, e, s = "=") {
    super(t), this.value = e, this.operator = s;
  }
  negate() {
    const t = new o(this.field, this.value);
    return t.operator = m(this.operator, [
      ["=", "!="],
      ["!=", "="],
      [">", "<="],
      ["<", ">="],
      [">=", "<"],
      ["<=", ">"]
    ]), t;
  }
  toString() {
    return `${this.field} ${this.operator} ${l(this.value)}`;
  }
}
class L extends h {
  constructor(t, e, s) {
    super(t), this.left = e, this.right = s;
  }
  toString() {
    return `${this.field} ${l(this.left)} TO ${l(this.right)}`;
  }
}
class x extends h {
  constructor(e) {
    super(e);
    i(this, "negated", !1);
  }
  negate() {
    const e = new x(this.field);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} NOT EXISTS` : `${this.field} EXISTS`;
  }
}
class c extends h {
  constructor(e, s) {
    super(e);
    i(this, "negated", !1);
    this.type = s;
  }
  negate() {
    const e = new c(this.field, this.type);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} IS NOT ${this.type}` : `${this.field} IS ${this.type}`;
  }
}
class $ extends h {
  constructor(e, s) {
    super(e);
    i(this, "negated", !1);
    this.values = s;
  }
  negate() {
    const e = new $(this.field, this.values);
    return e.negated = !this.negated, e;
  }
  toString() {
    const e = this.values.map(l);
    return this.negated ? `${this.field} NOT IN [${e.join(", ")}]` : `${this.field} IN [${e.join(", ")}]`;
  }
}
class v extends r {
  constructor(t, e, s) {
    super(), this.latitude = t, this.longitude = e, this.distanceInMeters = s;
  }
  toString() {
    return `_geoRadius(${this.latitude}, ${this.longitude}, ${this.distanceInMeters})`;
  }
}
class O extends r {
  constructor(t, e) {
    super(), this.topLeftCorner = t, this.bottomRightCorner = e;
  }
  toString() {
    return `_geoBoundingBox(${[this.topLeftCorner, this.bottomRightCorner].map(([e, s]) => `[${e}, ${s}]`).join(", ")})`;
  }
}
class R {
  constructor(t) {
    this.field = t;
  }
  equals(t) {
    return new o(this.field, t);
  }
  notEquals(t) {
    return this.equals(t).negate();
  }
  isGreaterThan(t, e = !1) {
    return new o(this.field, t, e ? ">=" : ">");
  }
  isNotGreaterThan(t, e = !1) {
    return this.isGreaterThan(t, e).negate();
  }
  isLowerThan(t, e = !1) {
    return new o(this.field, t, e ? "<=" : "<");
  }
  isNotLowerThan(t, e = !1) {
    return this.isLowerThan(t, e).negate();
  }
  isBetween(t, e, s = !0) {
    return s ? new L(this.field, t, e) : this.isGreaterThan(t).and(this.isLowerThan(e));
  }
  isNotBetween(t, e, s = !0) {
    return this.isBetween(t, e, s).negate();
  }
  exists() {
    return new x(this.field);
  }
  doesNotExist() {
    return this.exists().negate();
  }
  isNull() {
    return new c(this.field, "NULL");
  }
  isNotNull() {
    return this.isNull().negate();
  }
  isEmpty() {
    return new c(this.field, "EMPTY");
  }
  isNotEmpty() {
    return this.isEmpty().negate();
  }
  isIn(t) {
    return new $(this.field, t);
  }
  isNotIn(t) {
    return this.isIn(t).negate();
  }
  hasAll(t) {
    return new a(t.map((e) => this.equals(e)));
  }
  hasNone(t) {
    return this.hasAll(t).negate();
  }
}
const q = (...n) => n.length === 0 ? new N() : new a(n), A = (n) => new R(n), C = (n) => new B(n), U = (n, ...t) => t.length === 0 ? new T(n) : new a([n, ...t]).group();
function b(n, t, e) {
  return new v(n, t, e);
}
function F(n, t, e) {
  return b(n, t, e).negate();
}
function j(n, t) {
  return new O(n, t);
}
function W(n, t) {
  return j(n, t).negate();
}
export {
  A as field,
  q as filterBuilder,
  U as group,
  C as not,
  W as notWithinGeoBoundingBox,
  F as notWithinGeoRadius,
  j as withinGeoBoundingBox,
  b as withinGeoRadius
};
