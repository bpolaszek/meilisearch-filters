export declare class Expression {
    toString(): void;
    and(expression: Expression): Expression;
    or(expression: Expression): Expression;
    negate(): Expression;
    group(): Expression;
}
export declare class EmptyExpression extends Expression {
    toString(): string;
    and(expression: Expression): Expression;
    or(expression: Expression): Expression;
    negate(): Expression;
    group(): Expression;
}
declare class CompositeExpression extends Expression {
}
export declare class Group extends Expression {
    expression: Expression;
    constructor(expression: Expression);
    toString(): string;
    group(): Group;
}
export declare class Not extends Expression {
    expression: Expression;
    constructor(expression: Expression);
    toString(): string;
}
export declare class And extends CompositeExpression {
    expressions: Array<Expression>;
    constructor(expressions: Array<Expression>);
    negate(): Expression;
    toString(): string;
}
export declare class Or extends CompositeExpression {
    expressions: Array<Expression>;
    constructor(expressions: Array<Expression>);
    negate(): Expression;
    toString(): string;
}
type ComparisonOperator = '=' | '!=' | '>' | '>=' | '<' | '<=';
export declare class Comparison extends Expression {
    field: string;
    value: any;
    operator: ComparisonOperator;
    constructor(field: string, value: any, operator?: ComparisonOperator);
    negate(): Expression;
    toString(): string;
}
export declare class Between extends Expression {
    field: string;
    left: any;
    right: any;
    constructor(field: string, left: any, right: any);
    toString(): string;
}
export declare class Exists extends Expression {
    field: string;
    private negated;
    constructor(field: string);
    negate(): Expression;
    toString(): string;
}
export type IsFilterType = 'EMPTY' | 'NULL';
export declare class Is extends Expression {
    field: string;
    type: IsFilterType;
    private negated;
    constructor(field: string, type: IsFilterType);
    negate(): Expression;
    toString(): string;
}
export declare class In extends Expression {
    field: string;
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
