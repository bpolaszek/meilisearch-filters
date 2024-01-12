(function(r,i){typeof exports=="object"&&typeof module<"u"?i(exports):typeof define=="function"&&define.amd?define(["exports"],i):(r=typeof globalThis<"u"?globalThis:r||self,i(r["meilisearch-filters"]={}))})(this,function(r){"use strict";var U=Object.defineProperty;var F=(r,i,o)=>i in r?U(r,i,{enumerable:!0,configurable:!0,writable:!0,value:o}):r[i]=o;var a=(r,i,o)=>(F(r,typeof i!="symbol"?i+"":i,o),o);const i=n=>`'${`${n}`.replace(/[\\"']/g,"\\$&").replace(/\u0000/g,"\\0")}'`;class o extends Error{constructor(e,...t){super(...t),this.name="UnhandledMatchError",this.message=`Unhandled match value of type ${typeof e} - ${e}`,Error.captureStackTrace(this,o)}}const p=Symbol(),m=(n,e)=>{const t=new Map;for(const[...s]of e){const W=s.pop();for(const I of s.flat())t.has(I)||t.set(I,W)}if(!t.has(n)&&!t.has(p))throw new o(n);return t.get(n)??t.get(p)};m.default=p;const h=n=>typeof n=="string"?$.fromString(n):n,w=n=>n.map(h);class u{toString(){throw new Error("This method has to be implemented.")}and(e,...t){return new l(w([this,e,...t]))}or(e,...t){return new B(w([this,e,...t]))}negate(){return new E(this)}group(){return new N(this)}}class T extends u{toString(){return""}and(e,...t){return t.length===0?h(e):new l([e,...t])}or(e,...t){return t.length===0?h(e):new B([e,...t])}negate(){return this}group(){return this}}class $ extends u{constructor(e){super(),this.expression=e}toString(){return this.expression}static fromString(e){return e.length>0?new $(e):new T}}class g extends u{constructor(t){super();a(this,"expressions");this.expressions=w(t).map(s=>s instanceof g?s.group():s)}negate(){return this.group().negate()}}class l extends g{constructor(e){super(e)}toString(){return this.expressions.join(" AND ")}}class B extends g{constructor(e){super(e)}toString(){return this.expressions.join(" OR ")}}class N extends u{constructor(t){super();a(this,"expression");this.expression=h(t)}toString(){return`(${this.expression})`}group(){return this}}class E extends u{constructor(t){super();a(this,"expression");this.expression=h(t)}and(t,...s){return this.group().and(t,...s)}or(t,...s){return this.group().or(t,...s)}negate(){return this.expression}toString(){return`NOT ${this.expression}`}}class d extends u{constructor(e){super(),this.field=e}}class c extends d{constructor(e,t,s="="){super(e),this.value=t,this.operator=s}negate(){const e=new c(this.field,this.value);return e.operator=m(this.operator,[["=","!="],["!=","="],[">","<="],["<",">="],[">=","<"],["<=",">"]]),e}toString(){return`${this.field} ${this.operator} ${i(this.value)}`}}class b extends d{constructor(e,t,s){super(e),this.left=t,this.right=s}toString(){return`${this.field} ${i(this.left)} TO ${i(this.right)}`}}class x extends d{constructor(t){super(t);a(this,"negated",!1)}negate(){const t=new x(this.field);return t.negated=!this.negated,t}toString(){return this.negated?`${this.field} NOT EXISTS`:`${this.field} EXISTS`}}class f extends d{constructor(t,s){super(t);a(this,"negated",!1);this.type=s}negate(){const t=new f(this.field,this.type);return t.negated=!this.negated,t}toString(){return this.negated?`${this.field} IS NOT ${this.type}`:`${this.field} IS ${this.type}`}}class S extends d{constructor(t,s){super(t);a(this,"negated",!1);this.values=s}negate(){const t=new S(this.field,this.values);return t.negated=!this.negated,t}toString(){const t=this.values.map(i);return this.negated?`${this.field} NOT IN [${t.join(", ")}]`:`${this.field} IN [${t.join(", ")}]`}}class R extends u{constructor(e,t,s){super(),this.latitude=e,this.longitude=t,this.distanceInMeters=s}toString(){return`_geoRadius(${this.latitude}, ${this.longitude}, ${this.distanceInMeters})`}}class v extends u{constructor(e,t){super(),this.topLeftCorner=e,this.bottomRightCorner=t}toString(){return`_geoBoundingBox(${[this.topLeftCorner,this.bottomRightCorner].map(([t,s])=>`[${t}, ${s}]`).join(", ")})`}}class L{constructor(e){this.field=e}equals(e){return new c(this.field,e)}notEquals(e){return this.equals(e).negate()}isGreaterThan(e,t=!1){return new c(this.field,e,t?">=":">")}isNotGreaterThan(e,t=!1){return this.isGreaterThan(e,t).negate()}isLowerThan(e,t=!1){return new c(this.field,e,t?"<=":"<")}isNotLowerThan(e,t=!1){return this.isLowerThan(e,t).negate()}isBetween(e,t,s=!0){return s?new b(this.field,e,t):this.isGreaterThan(e).and(this.isLowerThan(t))}isNotBetween(e,t,s=!0){return this.isBetween(e,t,s).negate()}exists(){return new x(this.field)}doesNotExist(){return this.exists().negate()}isNull(){return new f(this.field,"NULL")}isNotNull(){return this.isNull().negate()}isEmpty(){return new f(this.field,"EMPTY")}isNotEmpty(){return this.isEmpty().negate()}isIn(e){return new S(this.field,e)}isNotIn(e){return this.isIn(e).negate()}hasAll(e){return new l(e.map(t=>this.equals(t)))}hasNone(e){return this.hasAll(e).negate()}}const O=(...n)=>n.length===0?new T:new l(n),j=n=>new L(n),M=n=>new E(n),q=(n,...e)=>e.length===0?new N(n):new l([n,...e]).group();function y(n,e,t){return new R(n,e,t)}function A(n,e,t){return y(n,e,t).negate()}function G(n,e){return new v(n,e)}function C(n,e){return G(n,e).negate()}r.field=j,r.filterBuilder=O,r.group=q,r.not=M,r.notWithinGeoBoundingBox=C,r.notWithinGeoRadius=A,r.withinGeoBoundingBox=G,r.withinGeoRadius=y,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})});
