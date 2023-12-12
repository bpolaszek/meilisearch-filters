var m = Object.defineProperty;
var E = (n, t, e) => t in n ? m(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var i = (n, t, e) => (E(n, typeof t != "symbol" ? t + "" : t, e), e);
const a = (n) => `'${`${n}`.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0")}'`;
class g extends Error {
  constructor(t, ...e) {
    super(...e), this.name = "UnhandledMatchError", this.message = `Unhandled match value of type ${typeof t} - ${t}`, Error.captureStackTrace(this, g);
  }
}
const d = Symbol(), x = (n, t) => {
  const e = /* @__PURE__ */ new Map();
  for (const [...s] of t) {
    const T = s.pop();
    for (const w of s.flat())
      e.has(w) || e.set(w, T);
  }
  if (!e.has(n) && !e.has(d))
    throw new g(n);
  return e.get(n) ?? e.get(d);
};
x.default = d;
class r {
  toString() {
    throw new Error("This method has to be implemented.");
  }
  and(t, ...e) {
    return new c([this, t, ...e]);
  }
  or(t, ...e) {
    return new $([this, t, ...e]);
  }
  negate() {
    return new N(this);
  }
  group() {
    return new S(this);
  }
}
class B extends r {
  toString() {
    return "";
  }
  and(t, ...e) {
    return e.length === 0 ? t : new c([t, ...e]);
  }
  or(t, ...e) {
    return e.length === 0 ? t : new $([t, ...e]);
  }
  negate() {
    return this;
  }
  group() {
    return this;
  }
}
class l extends r {
  constructor(e) {
    super();
    i(this, "expressions");
    this.expressions = e.map(
      (s) => s instanceof l ? s.group() : s
    );
  }
  negate() {
    return this.group().negate();
  }
}
class c extends l {
  constructor(t) {
    super(t);
  }
  toString() {
    return this.expressions.join(" AND ");
  }
}
class $ extends l {
  constructor(t) {
    super(t);
  }
  toString() {
    return this.expressions.join(" OR ");
  }
}
class S extends r {
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
class N extends r {
  constructor(t) {
    super(), this.expression = t;
  }
  and(t, ...e) {
    return this.group().and(t, ...e);
  }
  or(t, ...e) {
    return this.group().or(t, ...e);
  }
  negate() {
    return this.expression;
  }
  toString() {
    return `NOT ${this.expression}`;
  }
}
class u extends r {
  constructor(t) {
    super(), this.field = t;
  }
}
class o extends u {
  constructor(t, e, s = "=") {
    super(t), this.value = e, this.operator = s;
  }
  negate() {
    const t = new o(this.field, this.value);
    return t.operator = x(this.operator, [
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
class y extends u {
  constructor(t, e, s) {
    super(t), this.left = e, this.right = s;
  }
  toString() {
    return `${this.field} ${a(this.left)} TO ${a(this.right)}`;
  }
}
class p extends u {
  constructor(e) {
    super(e);
    i(this, "negated", !1);
  }
  negate() {
    const e = new p(this.field);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} NOT EXISTS` : `${this.field} EXISTS`;
  }
}
class h extends u {
  constructor(e, s) {
    super(e);
    i(this, "negated", !1);
    this.type = s;
  }
  negate() {
    const e = new h(this.field, this.type);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} IS NOT ${this.type}` : `${this.field} IS ${this.type}`;
  }
}
class f extends u {
  constructor(e, s) {
    super(e);
    i(this, "negated", !1);
    this.values = s;
  }
  negate() {
    const e = new f(this.field, this.values);
    return e.negated = !this.negated, e;
  }
  toString() {
    const e = this.values.map(a);
    return this.negated ? `${this.field} NOT IN [${e.join(", ")}]` : `${this.field} IN [${e.join(", ")}]`;
  }
}
class G extends r {
  constructor(t, e, s) {
    super(), this.latitude = t, this.longitude = e, this.distanceInMeters = s;
  }
  toString() {
    return `_geoRadius(${this.latitude}, ${this.longitude}, ${this.distanceInMeters})`;
  }
}
class I extends r {
  constructor(t, e) {
    super(), this.topLeftCorner = t, this.bottomRightCorner = e;
  }
  toString() {
    return `_geoBoundingBox(${[this.topLeftCorner, this.bottomRightCorner].map(([e, s]) => `[${e}, ${s}]`).join(", ")})`;
  }
}
class L {
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
    return s ? new y(this.field, t, e) : this.isGreaterThan(t).and(this.isLowerThan(e));
  }
  isNotBetween(t, e, s = !0) {
    return this.isBetween(t, e, s).negate();
  }
  exists() {
    return new p(this.field);
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
    return new f(this.field, t);
  }
  isNotIn(t) {
    return this.isIn(t).negate();
  }
  hasAll(t) {
    return new c(t.map((e) => this.equals(e)));
  }
  hasNone(t) {
    return this.hasAll(t).negate();
  }
}
const b = (...n) => n.length === 0 ? new B() : new c(n), j = (n) => new L(n), M = (n) => new N(n), q = (n) => new S(n);
function v(n, t, e) {
  return new G(n, t, e);
}
function A(n, t, e) {
  return v(n, t, e).negate();
}
function O(n, t) {
  return new I(n, t);
}
function C(n, t) {
  return O(n, t).negate();
}
export {
  j as field,
  b as filterBuilder,
  q as group,
  M as not,
  C as notWithinGeoBoundingBox,
  A as notWithinGeoRadius,
  O as withinGeoBoundingBox,
  v as withinGeoRadius
};
