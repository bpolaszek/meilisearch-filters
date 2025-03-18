import {escape} from './utils.ts'
import match from 'match-operator'

export type MaybeExpression = Expression | string
export type Stringable = string | number | boolean | {toString(): string}

const ensureExpression = (expression: MaybeExpression): Expression => {
  return 'string' === typeof expression ? LiteralExpression.fromString(expression) : expression
}

const ensureExpressions = (expressions: Array<MaybeExpression>): Array<Expression> => {
  return expressions.map(ensureExpression)
}

const avoidEmptyExpressions = (expressions: Array<Expression>): Array<Expression> => {
  return expressions.filter((expression) => !(expression instanceof EmptyExpression))
}

export class Expression {
  toString() {
    throw new Error('This method has to be implemented.')
  }

  and(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression {
    expressions = avoidEmptyExpressions(ensureExpressions([this, expression, ...expressions]))
    return expressions.length > 0 ? new And(expressions) : this
  }

  or(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression {
    expressions = avoidEmptyExpressions(ensureExpressions([this, expression, ...expressions]))
    return expressions.length > 0 ? new Or(expressions) : this
  }

  negate(): Expression {
    return new Not(this)
  }

  group(): Expression {
    return new Group(this)
  }

  static create(...expressions: Array<MaybeExpression>): Expression {
    expressions = avoidEmptyExpressions(ensureExpressions(expressions))
    if (0 === expressions.length) {
      return new EmptyExpression()
    }

    const expression = expressions.shift() as Expression

    // @ts-ignore
    return expressions.length > 0 ? expression.and(...expressions) : expression
  }
}

export class EmptyExpression extends Expression {
  toString() {
    return ''
  }

  and(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression {
    return 0 === expressions.length ? ensureExpression(expression) : super.and(expression, ...expressions)
  }

  or(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression {
    return 0 === expressions.length ? ensureExpression(expression) : super.or(expression, ...expressions)
  }

  negate(): Expression {
    return this
  }

  group(): Expression {
    return this
  }
}

class LiteralExpression extends Expression {
  constructor(public expression: string) {
    super()
  }

  toString() {
    return this.expression
  }

  static fromString(expression: string): LiteralExpression | EmptyExpression {
    return expression.length > 0 ? new LiteralExpression(expression) : new EmptyExpression()
  }
}

export class CompositeExpression extends Expression {
  public expressions: Array<Expression>

  constructor(expressions: Array<MaybeExpression>) {
    super()
    this.expressions = ensureExpressions(expressions).map((expression) =>
      expression instanceof CompositeExpression ? expression.group() : expression
    )
  }

  negate(): Expression {
    return this.group().negate()
  }
}

export class And extends CompositeExpression {
  constructor(expressions: Array<MaybeExpression>) {
    super(expressions)
  }

  toString() {
    return this.expressions.join(' AND ')
  }
}

export class Or extends CompositeExpression {
  constructor(expressions: Array<MaybeExpression>) {
    super(expressions)
  }

  toString() {
    return this.expressions.join(' OR ')
  }
}

export class Group extends Expression {
  public expression: Expression

  constructor(expression: MaybeExpression) {
    super()
    this.expression = ensureExpression(expression)
  }

  toString() {
    return `(${this.expression})`
  }

  group(): Group {
    return this
  }
}

export class Not extends Expression {
  public expression: Expression

  constructor(expression: MaybeExpression) {
    super()
    this.expression = ensureExpression(expression)
  }

  and(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression {
    return this.group().and(expression, ...expressions)
  }

  or(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression {
    return this.group().or(expression, ...expressions)
  }

  negate(): Expression {
    return this.expression
  }

  toString() {
    return `NOT ${this.expression}`
  }
}

export class FieldExpression extends Expression {
  constructor(public field: string) {
    super()
  }
}

type ComparisonOperator = '=' | '!=' | '>' | '>=' | '<' | '<='

export class Comparison extends FieldExpression {
  constructor(
    field: string,
    public value: Stringable,
    public operator: ComparisonOperator = '='
  ) {
    super(field)
  }

  negate(): Expression {
    const clone = new Comparison(this.field, this.value)
    clone.operator = match(this.operator, [
      ['=', '!='],
      ['!=', '='],
      ['>', '<='],
      ['<', '>='],
      ['>=', '<'],
      ['<=', '>'],
    ])
    return clone
  }

  toString() {
    return `${this.field} ${this.operator} ${escape(this.value)}`
  }
}

export class Between extends FieldExpression {
  constructor(
    field: string,
    public left: Stringable,
    public right: Stringable
  ) {
    super(field)
  }

  toString() {
    return `${this.field} ${escape(this.left)} TO ${escape(this.right)}`
  }
}

export class Exists extends FieldExpression {
  private negated: boolean = false

  constructor(field: string) {
    super(field)
  }

  negate(): Expression {
    const clone = new Exists(this.field)
    clone.negated = !this.negated
    return clone
  }

  toString() {
    return this.negated ? `${this.field} NOT EXISTS` : `${this.field} EXISTS`
  }
}

export type IsFilterType = 'EMPTY' | 'NULL'

export class Is extends FieldExpression {
  private negated: boolean = false

  constructor(
    field: string,
    public type: IsFilterType
  ) {
    super(field)
  }

  negate(): Expression {
    const clone = new Is(this.field, this.type)
    clone.negated = !this.negated
    return clone
  }

  toString() {
    return this.negated ? `${this.field} IS NOT ${this.type}` : `${this.field} IS ${this.type}`
  }
}

export class In extends FieldExpression {
  private negated: boolean = false

  constructor(
    field: string,
    public values: Stringable[]
  ) {
    super(field)
  }

  negate(): Expression {
    const clone = new In(this.field, this.values)
    clone.negated = !this.negated
    return clone
  }

  toString() {
    const escapedValues = this.values.map(escape)
    return this.negated
      ? `${this.field} NOT IN [${escapedValues.join(', ')}]`
      : `${this.field} IN [${escapedValues.join(', ')}]`
  }
}

export class Contains extends FieldExpression {
  private negated: boolean = false

  constructor(
    field: string,
    public value: Stringable
  ) {
    super(field)
  }

  negate(): Expression {
    const clone = new Contains(this.field, this.value)
    clone.negated = !this.negated
    return clone
  }

  toString() {
    return this.negated
      ? `${this.field} NOT CONTAINS ${escape(this.value)}`
      : `${this.field} CONTAINS ${escape(this.value)}`
  }
}

export class StartsWith extends FieldExpression {
  private negated: boolean = false

  constructor(
    field: string,
    public value: Stringable
  ) {
    super(field)
  }

  negate(): Expression {
    const clone = new StartsWith(this.field, this.value)
    clone.negated = !this.negated
    return clone
  }

  toString() {
    return this.negated
      ? `${this.field} NOT STARTS WITH ${escape(this.value)}`
      : `${this.field} STARTS WITH ${escape(this.value)}`
  }
}

export type Latitude = number
export type Longitude = number

export class GeoRadius extends Expression {
  constructor(
    public latitude: Latitude,
    public longitude: Longitude,
    public distanceInMeters: number
  ) {
    super()
  }

  toString() {
    return `_geoRadius(${this.latitude}, ${this.longitude}, ${this.distanceInMeters})`
  }
}

export type Coordinates = [Latitude, Longitude]

export class GeoBoundingBox extends Expression {
  constructor(
    public topLeftCorner: Coordinates,
    public bottomRightCorner: Coordinates
  ) {
    super()
  }

  toString() {
    const boundingBox = [this.topLeftCorner, this.bottomRightCorner]
    return `_geoBoundingBox(${boundingBox.map(([lat, lng]) => `[${lat}, ${lng}]`).join(', ')})`
  }
}
