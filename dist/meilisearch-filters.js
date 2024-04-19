var G = Object.defineProperty;
var I = (n, t, e) => t in n ? G(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var i = (n, t, e) => (I(n, typeof t != "symbol" ? t + "" : t, e), e);
const l = (n) => `'${`${n}`.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0")}'`;
class f extends Error {
  constructor(t, ...e) {
    super(...e), this.name = "UnhandledMatchError", this.message = `Unhandled match value of type ${typeof t} - ${t}`, Error.captureStackTrace(this, f);
  }
}
const p = Symbol(), N = (n, t) => {
  const e = /* @__PURE__ */ new Map();
  for (const [...r] of t) {
    const y = r.pop();
    for (const E of r.flat())
      e.has(E) || e.set(E, y);
  }
  if (!e.has(n) && !e.has(p))
    throw new f(n);
  return e.get(n) ?? e.get(p);
};
N.default = p;
const u = (n) => typeof n == "string" ? $.fromString(n) : n, h = (n) => n.map(u), g = (n) => n.filter((t) => !(t instanceof w));
class s {
  toString() {
    throw new Error("This method has to be implemented.");
  }
  and(t, ...e) {
    return e = g(h([this, t, ...e])), e.length > 0 ? new x(e) : this;
  }
  or(t, ...e) {
    return e = g(h([this, t, ...e])), e.length > 0 ? new v(e) : this;
  }
  negate() {
    return new B(this);
  }
  group() {
    return new T(this);
  }
  static create(...t) {
    if (t = g(h(t)), t.length === 0)
      return new w();
    const e = t.shift();
    return t.length > 0 ? e.and(...t) : e;
  }
}
class w extends s {
  toString() {
    return "";
  }
  and(t, ...e) {
    return e.length === 0 ? u(t) : super.and(t, ...e);
  }
  or(t, ...e) {
    return e.length === 0 ? u(t) : super.or(t, ...e);
  }
  negate() {
    return this;
  }
  group() {
    return this;
  }
}
class $ extends s {
  constructor(t) {
    super(), this.expression = t;
  }
  toString() {
    return this.expression;
  }
  static fromString(t) {
    return t.length > 0 ? new $(t) : new w();
  }
}
class d extends s {
  constructor(e) {
    super();
    i(this, "expressions");
    this.expressions = h(e).map(
      (r) => r instanceof d ? r.group() : r
    );
  }
  negate() {
    return this.group().negate();
  }
}
class x extends d {
  constructor(t) {
    super(t);
  }
  toString() {
    return this.expressions.join(" AND ");
  }
}
class v extends d {
  constructor(t) {
    super(t);
  }
  toString() {
    return this.expressions.join(" OR ");
  }
}
class T extends s {
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
class B extends s {
  constructor(e) {
    super();
    i(this, "expression");
    this.expression = u(e);
  }
  and(e, ...r) {
    return this.group().and(e, ...r);
  }
  or(e, ...r) {
    return this.group().or(e, ...r);
  }
  negate() {
    return this.expression;
  }
  toString() {
    return `NOT ${this.expression}`;
  }
}
class a extends s {
  constructor(t) {
    super(), this.field = t;
  }
}
class o extends a {
  constructor(t, e, r = "=") {
    super(t), this.value = e, this.operator = r;
  }
  negate() {
    const t = new o(this.field, this.value);
    return t.operator = N(this.operator, [
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
class L extends a {
  constructor(t, e, r) {
    super(t), this.left = e, this.right = r;
  }
  toString() {
    return `${this.field} ${l(this.left)} TO ${l(this.right)}`;
  }
}
class S extends a {
  constructor(e) {
    super(e);
    i(this, "negated", !1);
  }
  negate() {
    const e = new S(this.field);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} NOT EXISTS` : `${this.field} EXISTS`;
  }
}
class c extends a {
  constructor(e, r) {
    super(e);
    i(this, "negated", !1);
    this.type = r;
  }
  negate() {
    const e = new c(this.field, this.type);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} IS NOT ${this.type}` : `${this.field} IS ${this.type}`;
  }
}
class m extends a {
  constructor(e, r) {
    super(e);
    i(this, "negated", !1);
    this.values = r;
  }
  negate() {
    const e = new m(this.field, this.values);
    return e.negated = !this.negated, e;
  }
  toString() {
    const e = this.values.map(l);
    return this.negated ? `${this.field} NOT IN [${e.join(", ")}]` : `${this.field} IN [${e.join(", ")}]`;
  }
}
class O extends s {
  constructor(t, e, r) {
    super(), this.latitude = t, this.longitude = e, this.distanceInMeters = r;
  }
  toString() {
    return `_geoRadius(${this.latitude}, ${this.longitude}, ${this.distanceInMeters})`;
  }
}
class R extends s {
  constructor(t, e) {
    super(), this.topLeftCorner = t, this.bottomRightCorner = e;
  }
  toString() {
    return `_geoBoundingBox(${[this.topLeftCorner, this.bottomRightCorner].map(([e, r]) => `[${e}, ${r}]`).join(", ")})`;
  }
}
class b {
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
  isBetween(t, e, r = !0) {
    return r ? new L(this.field, t, e) : this.isGreaterThan(t).and(this.isLowerThan(e));
  }
  isNotBetween(t, e, r = !0) {
    return this.isBetween(t, e, r).negate();
  }
  exists() {
    return new S(this.field);
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
    return new m(this.field, t);
  }
  isNotIn(t) {
    return this.isIn(t).negate();
  }
  hasAll(t) {
    return new x(t.map((e) => this.equals(e)));
  }
  hasNone(t) {
    return this.hasAll(t).negate();
  }
}
const A = (...n) => s.create(...n), C = (n) => new b(n), U = (n) => new B(n), F = (n, ...t) => t.length === 0 ? new T(n) : new x([n, ...t]).group();
function j(n, t, e) {
  return new O(n, t, e);
}
function W(n, t, e) {
  return j(n, t, e).negate();
}
function M(n, t) {
  return new R(n, t);
}
function X(n, t) {
  return M(n, t).negate();
}
export {
  C as field,
  A as filterBuilder,
  F as group,
  U as not,
  X as notWithinGeoBoundingBox,
  W as notWithinGeoRadius,
  M as withinGeoBoundingBox,
  j as withinGeoRadius
};
