var S = Object.defineProperty;
var N = (s, t, e) => t in s ? S(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var o = (s, t, e) => (N(s, typeof t != "symbol" ? t + "" : t, e), e);
const a = (s) => `'${`${s}`.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0")}'`;
class d extends Error {
  constructor(t, ...e) {
    super(...e), this.name = "UnhandledMatchError", this.message = `Unhandled match value of type ${typeof t} - ${t}`, Error.captureStackTrace(this, d);
  }
}
const l = Symbol(), f = (s, t) => {
  const e = /* @__PURE__ */ new Map();
  for (const [...n] of t) {
    const $ = n.pop();
    for (const p of n.flat())
      e.has(p) || e.set(p, $);
  }
  if (!e.has(s) && !e.has(l))
    throw new d(s);
  return e.get(s) ?? e.get(l);
};
f.default = l;
class r {
  toString() {
    throw new Error("This method has to be implemented.");
  }
  and(t) {
    return t instanceof u && (t = t.group()), new m([this, t]);
  }
  or(t) {
    return t instanceof u && (t = t.group()), new E([this, t]);
  }
  negate() {
    return new x(this);
  }
  group() {
    return new w(this);
  }
}
class T extends r {
  toString() {
    return "";
  }
  and(t) {
    return t;
  }
  or(t) {
    return t;
  }
  negate() {
    throw new Error("An empty expression cannot be negated.");
  }
  group() {
    return this;
  }
}
class u extends r {
}
class w extends r {
  constructor(t) {
    super(), this.expression = t;
  }
  toString() {
    return `(${this.expression})`;
  }
  group() {
    return this;
  }
}
class x extends r {
  constructor(t) {
    super(), this.expression = t;
  }
  toString() {
    return `NOT ${this.expression}`;
  }
}
class m extends u {
  constructor(t) {
    super(), this.expressions = t;
  }
  negate() {
    return this.group().negate();
  }
  toString() {
    return this.expressions.join(" AND ");
  }
}
class E extends u {
  constructor(t) {
    super(), this.expressions = t;
  }
  negate() {
    return this.group().negate();
  }
  toString() {
    return this.expressions.join(" OR ");
  }
}
class i extends r {
  constructor(t, e, n = "=") {
    super(), this.field = t, this.value = e, this.operator = n;
  }
  negate() {
    const t = new i(this.field, this.value);
    return t.operator = f(this.operator, [
      ["=", "!="],
      ["!=", "="],
      [">", "<="],
      ["<", ">="],
      [">=", "<"],
      ["<=", ">"]
    ]), t;
  }
  toString() {
    return `${this.field} ${this.operator} ${a(this.value)}`;
  }
}
class B extends r {
  constructor(t, e, n) {
    super(), this.field = t, this.left = e, this.right = n;
  }
  toString() {
    return `${this.field} ${a(this.left)} TO ${a(this.right)}`;
  }
}
class c extends r {
  constructor(e) {
    super();
    o(this, "negated", !1);
    this.field = e;
  }
  negate() {
    const e = new c(this.field);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} NOT EXISTS` : `${this.field} EXISTS`;
  }
}
class h extends r {
  constructor(e, n) {
    super();
    o(this, "negated", !1);
    this.field = e, this.type = n;
  }
  negate() {
    const e = new h(this.field, this.type);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} IS NOT ${this.type}` : `${this.field} IS ${this.type}`;
  }
}
class g extends r {
  constructor(e, n) {
    super();
    o(this, "negated", !1);
    this.field = e, this.values = n;
  }
  negate() {
    const e = new g(this.field, this.values);
    return e.negated = !this.negated, e;
  }
  toString() {
    const e = this.values.map(a);
    return this.negated ? `${this.field} NOT IN [${e.join(", ")}]` : `${this.field} IN [${e.join(", ")}]`;
  }
}
class y extends r {
  constructor(t, e, n) {
    super(), this.latitude = t, this.longitude = e, this.distanceInMeters = n;
  }
  toString() {
    return `_geoRadius(${this.latitude}, ${this.longitude}, ${this.distanceInMeters})`;
  }
}
class G extends r {
  constructor(t, e) {
    super(), this.topLeftCorner = t, this.bottomRightCorner = e;
  }
  toString() {
    return `_geoBoundingBox(${[this.topLeftCorner, this.bottomRightCorner].map(([e, n]) => `[${e}, ${n}]`).join(", ")})`;
  }
}
class I {
  constructor(t) {
    this.field = t;
  }
  equals(t) {
    return new i(this.field, t);
  }
  notEquals(t) {
    return this.equals(t).negate();
  }
  isGreaterThan(t, e = !1) {
    return new i(this.field, t, e ? ">=" : ">");
  }
  isNotGreaterThan(t, e = !1) {
    return this.isGreaterThan(t, e).negate();
  }
  isLowerThan(t, e = !1) {
    return new i(this.field, t, e ? "<=" : "<");
  }
  isNotLowerThan(t, e = !1) {
    return this.isLowerThan(t, e).negate();
  }
  isBetween(t, e, n = !0) {
    return n ? new B(this.field, t, e) : this.isGreaterThan(t).and(this.isLowerThan(e));
  }
  isNotBetween(t, e, n = !0) {
    return this.isBetween(t, e, n).negate();
  }
  exists() {
    return new c(this.field);
  }
  doesNotExist() {
    return this.exists().negate();
  }
  isNull() {
    return new h(this.field, "NULL");
  }
  isNotNull() {
    return this.isNull().negate();
  }
  isEmpty() {
    return new h(this.field, "EMPTY");
  }
  isNotEmpty() {
    return this.isEmpty().negate();
  }
  isIn(t) {
    return new g(this.field, t);
  }
  isNotIn(t) {
    return this.isIn(t).negate();
  }
}
const O = (...s) => {
  let t = new T();
  for (const e of s)
    t = t.and(e);
  return t;
}, R = (s) => new I(s), j = (s) => new x(s), C = (s) => new w(s);
function L(s, t, e) {
  return new y(s, t, e);
}
function M(s, t, e) {
  return L(s, t, e).negate();
}
function b(s, t) {
  return new G(s, t);
}
function q(s, t) {
  return b(s, t).negate();
}
export {
  R as field,
  O as filterBuilder,
  C as group,
  j as not,
  q as notWithinGeoBoundingBox,
  M as notWithinGeoRadius,
  b as withinGeoBoundingBox,
  L as withinGeoRadius
};
