import { Checkers } from './types';
/**
 * A object that contains all checkers for requirements.
 * To get a checker, do:
 *
 * ```typescript
 * import checkers from './all-requirements-checkers';
 *
 * const checker = checkers['name-of-your-checker'];
 * ```
 *
 * A checker might be a function that you can directly call.
 *
 * ```typescript
 * if (checker(course)) {
 *   // Course satisfies the requirement.
 * }
 * ```
 *
 * Or it can be an array that represents checkers for all subrequirements:
 *
 * ```typescript
 * if (checker.all(oneChecker => oneChecker(course))) {
 *   // Course satisfies all sub-requirements.
 * }
 * ```
 */
declare const requirementCheckers: Checkers;
export default requirementCheckers;
