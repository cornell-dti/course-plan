import { Course } from '../types';
export declare type Checker = (course: Course) => boolean;
export declare type Checkers = {
    readonly [checkerName: string]: Checker | readonly Checker[];
};
