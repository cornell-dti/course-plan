import { Course } from '../types';

export type Checker = 'all-eligible' | ((course: Course) => boolean);
export type Checkers = { readonly [checkerName: string]: Checker };
