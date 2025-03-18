var G = Object.defineProperty;
var O = (n, t, e) => t in n ? G(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var r = (n, t, e) => O(n, typeof t != "symbol" ? t + "" : t, e);
const o = (n) => `'${`${n}`.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0")}'`;
class p extends Error {
  constructor(t, ...e) {
    super(...e), this.name = "UnhandledMatchError", this.message = `Unhandled match value of type ${typeof t} - ${t}`, Error.captureStackTrace(this, p);
  }
}
const f = Symbol(), v = (n, t) => {
  const e = /* @__PURE__ */ new Map();
  for (const [...s] of t) {
    const y = s.pop();
    for (const E of s.flat())
      e.has(E) || e.set(E, y);
  }
  if (!e.has(n) && !e.has(f))
    throw new p(n);
  return e.get(n) ?? e.get(f);
};
v.default = f;
const h = (n) => typeof n == "string" ? $.fromString(n) : n, l = (n) => n.map(h), g = (n) => n.filter((t) => !(t instanceof w));
class i {
  toString() {
    throw new Error("This method has to be implemented.");
  }
  and(t, ...e) {
    return e = g(l([this, t, ...e])), e.length > 0 ? new S(e) : this;
  }
  or(t, ...e) {
    return e = g(l([this, t, ...e])), e.length > 0 ? new R(e) : this;
  }
  negate() {
    return new I(this);
  }
  group() {
    return new B(this);
  }
  static create(...t) {
    if (t = g(l(t)), t.length === 0)
      return new w();
    const e = t.shift();
    return t.length > 0 ? e.and(...t) : e;
  }
}
class w extends i {
  toString() {
    return "";
  }
  and(t, ...e) {
    return e.length === 0 ? h(t) : super.and(t, ...e);
  }
  or(t, ...e) {
    return e.length === 0 ? h(t) : super.or(t, ...e);
  }
  negate() {
    return this;
  }
  group() {
    return this;
  }
}
class $ extends i {
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
class d extends i {
  constructor(e) {
    super();
    r(this, "expressions");
    this.expressions = l(e).map(
      (s) => s instanceof d ? s.group() : s
    );
  }
  negate() {
    return this.group().negate();
  }
}
class S extends d {
  constructor(t) {
    super(t);
  }
  toString() {
    return this.expressions.join(" AND ");
  }
}
class R extends d {
  constructor(t) {
    super(t);
  }
  toString() {
    return this.expressions.join(" OR ");
  }
}
class B extends i {
  constructor(e) {
    super();
    r(this, "expression");
    this.expression = h(e);
  }
  toString() {
    return `(${this.expression})`;
  }
  group() {
    return this;
  }
}
class I extends i {
  constructor(e) {
    super();
    r(this, "expression");
    this.expression = h(e);
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
class a extends i {
  constructor(t) {
    super(), this.field = t;
  }
}
class u extends a {
  constructor(t, e, s = "=") {
    super(t), this.value = e, this.operator = s;
  }
  negate() {
    const t = new u(this.field, this.value);
    return t.operator = v(this.operator, [
      ["=", "!="],
      ["!=", "="],
      [">", "<="],
      ["<", ">="],
      [">=", "<"],
      ["<=", ">"]
    ]), t;
  }
  toString() {
    return `${this.field} ${this.operator} ${o(this.value)}`;
  }
}
class A extends a {
  constructor(t, e, s) {
    super(t), this.left = e, this.right = s;
  }
  toString() {
    return `${this.field} ${o(this.left)} TO ${o(this.right)}`;
  }
}
class N extends a {
  constructor(e) {
    super(e);
    r(this, "negated", !1);
  }
  negate() {
    const e = new N(this.field);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} NOT EXISTS` : `${this.field} EXISTS`;
  }
}
class c extends a {
  constructor(e, s) {
    super(e);
    r(this, "negated", !1);
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
class T extends a {
  constructor(e, s) {
    super(e);
    r(this, "negated", !1);
    this.values = s;
  }
  negate() {
    const e = new T(this.field, this.values);
    return e.negated = !this.negated, e;
  }
  toString() {
    const e = this.values.map(o);
    return this.negated ? `${this.field} NOT IN [${e.join(", ")}]` : `${this.field} IN [${e.join(", ")}]`;
  }
}
class x extends a {
  constructor(e, s) {
    super(e);
    r(this, "negated", !1);
    this.value = s;
  }
  negate() {
    const e = new x(this.field, this.value);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} NOT CONTAINS ${o(this.value)}` : `${this.field} CONTAINS ${o(this.value)}`;
  }
}
class m extends a {
  constructor(e, s) {
    super(e);
    r(this, "negated", !1);
    this.value = s;
  }
  negate() {
    const e = new m(this.field, this.value);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} NOT STARTS WITH ${o(this.value)}` : `${this.field} STARTS WITH ${o(this.value)}`;
  }
}
class L extends i {
  constructor(t, e, s) {
    super(), this.latitude = t, this.longitude = e, this.distanceInMeters = s;
  }
  toString() {
    return `_geoRadius(${this.latitude}, ${this.longitude}, ${this.distanceInMeters})`;
  }
}
class C extends i {
  constructor(t, e) {
    super(), this.topLeftCorner = t, this.bottomRightCorner = e;
  }
  toString() {
    return `_geoBoundingBox(${[this.topLeftCorner, this.bottomRightCorner].map(([e, s]) => `[${e}, ${s}]`).join(", ")})`;
  }
}
class W {
  constructor(t) {
    this.field = t;
  }
  equals(t) {
    return new u(this.field, t);
  }
  notEquals(t) {
    return this.equals(t).negate();
  }
  isGreaterThan(t, e = !1) {
    return new u(this.field, t, e ? ">=" : ">");
  }
  isNotGreaterThan(t, e = !1) {
    return this.isGreaterThan(t, e).negate();
  }
  isLowerThan(t, e = !1) {
    return new u(this.field, t, e ? "<=" : "<");
  }
  isNotLowerThan(t, e = !1) {
    return this.isLowerThan(t, e).negate();
  }
  isBetween(t, e, s = !0) {
    return s ? new A(this.field, t, e) : this.isGreaterThan(t).and(this.isLowerThan(e));
  }
  isNotBetween(t, e, s = !0) {
    return this.isBetween(t, e, s).negate();
  }
  exists() {
    return new N(this.field);
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
    return new T(this.field, t);
  }
  isNotIn(t) {
    return this.isIn(t).negate();
  }
  hasAll(t) {
    return new S(t.map((e) => this.equals(e)));
  }
  hasNone(t) {
    return this.hasAll(t).negate();
  }
  contains(t) {
    return new x(this.field, t);
  }
  doesNotContain(t) {
    return this.contains(t).negate();
  }
  startsWith(t) {
    return new m(this.field, t);
  }
  doesNotStartWith(t) {
    return this.startsWith(t).negate();
  }
}
const q = (...n) => i.create(...n), U = (n) => new W(n), F = (n) => new I(n), H = (n, ...t) => t.length === 0 ? new B(n) : new S([n, ...t]).group();
function b(n, t, e) {
  return new L(n, t, e);
}
function X(n, t, e) {
  return b(n, t, e).negate();
}
function j(n, t) {
  return new C(n, t);
}
function k(n, t) {
  return j(n, t).negate();
}
export {
  d as CompositeExpression,
  w as EmptyExpression,
  i as Expression,
  W as Field,
  a as FieldExpression,
  U as field,
  q as filterBuilder,
  H as group,
  F as not,
  k as notWithinGeoBoundingBox,
  X as notWithinGeoRadius,
  j as withinGeoBoundingBox,
  b as withinGeoRadius
};
