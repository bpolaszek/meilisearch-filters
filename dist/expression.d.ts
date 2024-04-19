export type MaybeExpression = Expression | string;
export declare class Expression {
    toString(): void;
    and(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression;
    or(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression;
    negate(): Expression;
    group(): Expression;
    static create(...expressions: Array<MaybeExpression>): Expression;
}
export declare class EmptyExpression extends Expression {
    toString(): string;
    and(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression;
    or(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression;
    negate(): Expression;
    group(): Expression;
}
export declare class CompositeExpression extends Expression {
    expressions: Array<Expression>;
    constructor(expressions: Array<MaybeExpression>);
    negate(): Expression;
}
export declare class And extends CompositeExpression {
    constructor(expressions: Array<MaybeExpression>);
    toString(): string;
}
export declare class Or extends CompositeExpression {
    constructor(expressions: Array<MaybeExpression>);
    toString(): string;
}
export declare class Group extends Expression {
    expression: Expression;
    constructor(expression: MaybeExpression);
    toString(): string;
    group(): Group;
}
export declare class Not extends Expression {
    expression: Expression;
    constructor(expression: MaybeExpression);
    and(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression;
    or(expression: MaybeExpression, ...expressions: Array<MaybeExpression>): Expression;
    negate(): Expression;
    toString(): string;
}
export declare class FieldExpression extends Expression {
    field: string;
    constructor(field: string);
}
type ComparisonOperator = '=' | '!=' | '>' | '>=' | '<' | '<=';
export declare class Comparison extends FieldExpression {
    value: any;
    operator: ComparisonOperator;
    constructor(field: string, value: any, operator?: ComparisonOperator);
    negate(): Expression;
    toString(): string;
}
export declare class Between extends FieldExpression {
    left: any;
    right: any;
    constructor(field: string, left: any, right: any);
    toString(): string;
}
export declare class Exists extends FieldExpression {
    private negated;
    constructor(field: string);
    negate(): Expression;
    toString(): string;
}
export type IsFilterType = 'EMPTY' | 'NULL';
export declare class Is extends FieldExpression {
    type: IsFilterType;
    private negated;
    constructor(field: string, type: IsFilterType);
    negate(): Expression;
    toString(): string;
}
export declare class In extends FieldExpression {
    values: Array<any>;
    private negated;
    constructor(field: string, values: Array<any>);
    negate(): Expression;
    toString(): string;
}
export type Latitude = number;
export type Longitude = number;
export declare class GeoRadius extends Expression {
    latitude: Latitude;
    longitude: Longitude;
    distanceInMeters: number;
    constructor(latitude: Latitude, longitude: Longitude, distanceInMeters: number);
    toString(): string;
}
export type Coordinates = [Latitude, Longitude];
export declare class GeoBoundingBox extends Expression {
    topLeftCorner: Coordinates;
    bottomRightCorner: Coordinates;
    constructor(topLeftCorner: Coordinates, bottomRightCorner: Coordinates);
    toString(): string;
}
export {};
