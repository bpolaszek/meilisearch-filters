import {
  Between,
  Comparison,
  Coordinates,
  EmptyExpression,
  Exists,
  Expression,
  FieldExpression,
  CompositeExpression,
  GeoBoundingBox,
  GeoRadius,
  Group,
  In,
  Is,
  Latitude,
  Longitude,
  Not,
  And,
} from './expression.ts'

type Stringable = string | number | {toString(): string}

class Field {
  constructor(private field: string) {}

  equals(value: Stringable): Expression {
    return new Comparison(this.field, value)
  }

  notEquals(value: Stringable): Expression {
    return this.equals(value).negate()
  }

  isGreaterThan(value: Stringable, includeValue: boolean = false): Expression {
    return new Comparison(this.field, value, includeValue ? '>=' : '>')
  }

  isNotGreaterThan(value: Stringable, includeValue: boolean = false): Expression {
    return this.isGreaterThan(value, includeValue).negate()
  }

  isLowerThan(value: Stringable, includeValue: boolean = false): Expression {
    return new Comparison(this.field, value, includeValue ? '<=' : '<')
  }

  isNotLowerThan(value: Stringable, includeValue: boolean = false): Expression {
    return this.isLowerThan(value, includeValue).negate()
  }

  isBetween(left: Stringable, right: Stringable, includeBoundaries: boolean = true): Expression {
    return includeBoundaries
      ? new Between(this.field, left, right)
      : this.isGreaterThan(left).and(this.isLowerThan(right))
  }

  isNotBetween(left: Stringable, right: Stringable, includeBoundaries: boolean = true): Expression {
    return this.isBetween(left, right, includeBoundaries).negate()
  }

  exists(): Expression {
    return new Exists(this.field)
  }

  doesNotExist(): Expression {
    return this.exists().negate()
  }

  isNull(): Expression {
    return new Is(this.field, 'NULL')
  }

  isNotNull(): Expression {
    return this.isNull().negate()
  }

  isEmpty(): Expression {
    return new Is(this.field, 'EMPTY')
  }

  isNotEmpty(): Expression {
    return this.isEmpty().negate()
  }

  isIn(values: Array<Stringable>): Expression {
    return new In(this.field, values)
  }

  isNotIn(values: Array<Stringable>): Expression {
    return this.isIn(values).negate()
  }

  hasAll(values: Array<Stringable>): Expression {
    return new And(values.map((value) => this.equals(value)))
  }

  hasNone(values: Array<Stringable>): Expression {
    return this.hasAll(values).negate()
  }
}

export const filterBuilder = (...expressions: Array<Expression>) => {
  return 0 === expressions.length ? new EmptyExpression() : new And(expressions)
}

export const field = (field: string) => new Field(field)
export const not = (expression: Expression) => new Not(expression)
export const group = (expression: Expression, ...expressions: Array<Expression>) => {
  return 0 === expressions.length ? new Group(expression) : new And([expression, ...expressions]).group()
}

export function withinGeoRadius(latitude: Latitude, longitude: Longitude, distanceInMeters: number): Expression {
  return new GeoRadius(latitude, longitude, distanceInMeters)
}

export function notWithinGeoRadius(latitude: Latitude, longitude: Longitude, distanceInMeters: number): Expression {
  return withinGeoRadius(latitude, longitude, distanceInMeters).negate()
}

export function withinGeoBoundingBox(topLeftCorner: Coordinates, bottomRightCorner: Coordinates): Expression {
  return new GeoBoundingBox(topLeftCorner, bottomRightCorner)
}

export function notWithinGeoBoundingBox(topLeftCorner: Coordinates, bottomRightCorner: Coordinates): Expression {
  return withinGeoBoundingBox(topLeftCorner, bottomRightCorner).negate()
}

export type {Expression, FieldExpression, CompositeExpression, Field}
