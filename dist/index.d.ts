import { Coordinates, Expression, Group, Latitude, Longitude, Not } from './expression.ts';
type Stringable = string | number | {
    toString(): string;
};
declare class Field {
    private field;
    constructor(field: string);
    equals(value: Stringable): Expression;
    notEquals(value: Stringable): Expression;
    isGreaterThan(value: Stringable, includeValue?: boolean): Expression;
    isNotGreaterThan(value: Stringable, includeValue?: boolean): Expression;
    isLowerThan(value: Stringable, includeValue?: boolean): Expression;
    isNotLowerThan(value: Stringable, includeValue?: boolean): Expression;
    isBetween(left: Stringable, right: Stringable, includeBoundaries?: boolean): Expression;
    isNotBetween(left: Stringable, right: Stringable, includeBoundaries?: boolean): Expression;
    exists(): Expression;
    doesNotExist(): Expression;
    isNull(): Expression;
    isNotNull(): Expression;
    isEmpty(): Expression;
    isNotEmpty(): Expression;
    isIn(values: Array<Stringable>): Expression;
    isNotIn(values: Array<Stringable>): Expression;
}
export declare const filterBuilder: (...filters: Array<Expression>) => Expression;
export declare const field: (field: string) => Field;
export declare const not: (expression: Expression) => Not;
export declare const group: (expression: Expression) => Group;
export declare function withinGeoRadius(latitude: Latitude, longitude: Longitude, distanceInMeters: number): Expression;
export declare function notWithinGeoRadius(latitude: Latitude, longitude: Longitude, distanceInMeters: number): Expression;
export declare function withinGeoBoundingBox(topLeftCorner: Coordinates, bottomRightCorner: Coordinates): Expression;
export declare function notWithinGeoBoundingBox(topLeftCorner: Coordinates, bottomRightCorner: Coordinates): Expression;
export {};
