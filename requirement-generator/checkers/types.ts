import { Course } from '../types';

export type Checker = (course: Course) => boolean;
export type Checkers = { readonly [checkerName: string]: Checker | readonly Checker[] };
