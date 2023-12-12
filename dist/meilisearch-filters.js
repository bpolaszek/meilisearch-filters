var m = Object.defineProperty;
var E = (s, t, e) => t in s ? m(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var a = (s, t, e) => (E(s, typeof t != "symbol" ? t + "" : t, e), e);
const u = (s) => `'${`${s}`.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0")}'`;
class d extends Error {
  constructor(t, ...e) {
    super(...e), this.name = "UnhandledMatchError", this.message = `Unhandled match value of type ${typeof t} - ${t}`, Error.captureStackTrace(this, d);
  }
}
const c = Symbol(), x = (s, t) => {
  const e = /* @__PURE__ */ new Map();
  for (const [...n] of t) {
    const N = n.pop();
    for (const w of n.flat())
      e.has(w) || e.set(w, N);
  }
  if (!e.has(s) && !e.has(c))
    throw new d(s);
  return e.get(s) ?? e.get(c);
};
x.default = c;
class r {
  toString() {
    throw new Error("This method has to be implemented.");
  }
  and(t) {
    return t instanceof h && (t = t.group()), new g([this, t]);
  }
  or(t) {
    return t instanceof h && (t = t.group()), new B([this, t]);
  }
  negate() {
    return new S(this);
  }
  group() {
    return new $(this);
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
class h extends r {
}
class o extends r {
  constructor(t) {
    super(), this.field = t;
  }
}
class $ extends r {
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
class S extends r {
  constructor(t) {
    super(), this.expression = t;
  }
  toString() {
    return `NOT ${this.expression}`;
  }
}
class g extends h {
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
class B extends h {
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
class i extends o {
  constructor(t, e, n = "=") {
    super(t), this.value = e, this.operator = n;
  }
  negate() {
    const t = new i(this.field, this.value);
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
    return `${this.field} ${this.operator} ${u(this.value)}`;
  }
}
class y extends o {
  constructor(t, e, n) {
    super(t), this.left = e, this.right = n;
  }
  toString() {
    return `${this.field} ${u(this.left)} TO ${u(this.right)}`;
  }
}
class p extends o {
  constructor(e) {
    super(e);
    a(this, "negated", !1);
  }
  negate() {
    const e = new p(this.field);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} NOT EXISTS` : `${this.field} EXISTS`;
  }
}
class l extends o {
  constructor(e, n) {
    super(e);
    a(this, "negated", !1);
    this.type = n;
  }
  negate() {
    const e = new l(this.field, this.type);
    return e.negated = !this.negated, e;
  }
  toString() {
    return this.negated ? `${this.field} IS NOT ${this.type}` : `${this.field} IS ${this.type}`;
  }
}
class f extends o {
  constructor(e, n) {
    super(e);
    a(this, "negated", !1);
    this.values = n;
  }
  negate() {
    const e = new f(this.field, this.values);
    return e.negated = !this.negated, e;
  }
  toString() {
    const e = this.values.map(u);
    return this.negated ? `${this.field} NOT IN [${e.join(", ")}]` : `${this.field} IN [${e.join(", ")}]`;
  }
}
class G extends r {
  constructor(t, e, n) {
    super(), this.latitude = t, this.longitude = e, this.distanceInMeters = n;
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
    return `_geoBoundingBox(${[this.topLeftCorner, this.bottomRightCorner].map(([e, n]) => `[${e}, ${n}]`).join(", ")})`;
  }
}
class L {
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
    return n ? new y(this.field, t, e) : this.isGreaterThan(t).and(this.isLowerThan(e));
  }
  isNotBetween(t, e, n = !0) {
    return this.isBetween(t, e, n).negate();
  }
  exists() {
    return new p(this.field);
  }
  doesNotExist() {
    return this.exists().negate();
  }
  isNull() {
    return new l(this.field, "NULL");
  }
  isNotNull() {
    return this.isNull().negate();
  }
  isEmpty() {
    return new l(this.field, "EMPTY");
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
    return new g(t.map((e) => this.equals(e)));
  }
  hasNone(t) {
    return this.hasAll(t).negate();
  }
}
const R = (...s) => s.length === 0 ? new T() : new g(s), j = (s) => new L(s), A = (s) => new S(s), C = (s) => new $(s);
function b(s, t, e) {
  return new G(s, t, e);
}
function M(s, t, e) {
  return b(s, t, e).negate();
}
function v(s, t) {
  return new I(s, t);
}
function q(s, t) {
  return v(s, t).negate();
}
export {
  j as field,
  R as filterBuilder,
  C as group,
  A as not,
  q as notWithinGeoBoundingBox,
  M as notWithinGeoRadius,
  v as withinGeoBoundingBox,
  b as withinGeoRadius
};
