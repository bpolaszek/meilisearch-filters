import {escape} from './utils.ts'
import match from 'match-operator'

export class Expression {
  toString() {
    throw new Error('This method has to be implemented.')
  }

  and(expression: Expression): Expression {
    if (expression instanceof CompositeExpression) {
      expression = expression.group()
    }
    return new And([this, expression])
  }

  or(expression: Expression): Expression {
    if (expression instanceof CompositeExpression) {
      expression = expression.group()
    }
    return new Or([this, expression])
  }

  negate(): Expression {
    return new Not(this)
  }

  group(): Expression {
    return new Group(this)
  }
}

export class EmptyExpression extends Expression {
  toString() {
    return ''
  }

  and(expression: Expression): Expression {
    return expression
  }

  or(expression: Expression): Expression {
    return expression
  }

  negate(): Expression {
    throw new Error('An empty expression cannot be negated.')
  }

  group(): Expression {
    return this
  }
}

class CompositeExpression extends Expression {}

export class Group extends Expression {
  constructor(public expression: Expression) {
    super()
  }

  toString() {
    return `(${this.expression})`
  }

  group(): Group {
    return this
  }
}

export class Not extends Expression {
  constructor(public expression: Expression) {
    super()
  }

  toString() {
    return `NOT ${this.expression}`
  }
}

export class And extends CompositeExpression {
  constructor(public expressions: Array<Expression>) {
    super()
  }

  negate(): Expression {
    return this.group().negate()
  }

  toString() {
    return this.expressions.join(' AND ')
  }
}

export class Or extends CompositeExpression {
  constructor(public expressions: Array<Expression>) {
    super()
  }

  negate(): Expression {
    return this.group().negate()
  }

  toString() {
    return this.expressions.join(' OR ')
  }
}

type ComparisonOperator = '=' | '!=' | '>' | '>=' | '<' | '<='
export class Comparison extends Expression {
  constructor(
    public field: string,
    public value: any,
    public operator: ComparisonOperator = '='
  ) {
    super()
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

export class Between extends Expression {
  constructor(
    public field: string,
    public left: any,
    public right: any
  ) {
    super()
  }

  toString() {
    return `${this.field} ${escape(this.left)} TO ${escape(this.right)}`
  }
}

export class Exists extends Expression {
  private negated: boolean = false

  constructor(public field: string) {
    super()
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

export class Is extends Expression {
  private negated: boolean = false

  constructor(
    public field: string,
    public type: IsFilterType
  ) {
    super()
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

export class In extends Expression {
  private negated: boolean = false

  constructor(
    public field: string,
    public values: Array<any>
  ) {
    super()
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
