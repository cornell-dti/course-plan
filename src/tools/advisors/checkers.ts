import { AdvisorChecker } from '@/tools/advisors/types';

/**
 * This function returns a checker that checks whether an advisor works with the user based on the user's last name
 *
 * Usage:
 * ```typescript
 * const checker = lastNameRange('A', 'L');
 * ```
 *
 * @returns a single checker that checks whether this individual advisor works with the user
 */

export const lastNameRange = (startLetter: string, endLetter: string): AdvisorChecker => (
  user: FirestoreUserName
): boolean => {
  if (user.lastName) {
    const lastInitial = user.lastName.trim().charAt(0).toLowerCase();
    return lastInitial >= startLetter.toLowerCase() && lastInitial <= endLetter.toLowerCase();
  }
  return true;
};

/**
 * This function returns a checker that checks whether an advisor works with the user
 * based on the user's last name given that the advisor works with last names in multiple ranges.
 * This checker takes in an array of tuples, where the tuple holds the start letter and the end letter of the range.
 *
 * Usage for someone advising students with last names C-D and Q - Z:
 * ```typescript
 * const checker = lastNameRanges([['C', 'D'], ['Q', 'Z'],]),
 * ```
 *
 * @returns a single checker that checks whether this individual advisor works with the user
 */
export const lastNameRanges = (range: [string, string][]): AdvisorChecker => (
  user: FirestoreUserName
): boolean => {
  if (user.lastName) {
    const lastInitial = user.lastName.trim().charAt(0).toLowerCase();
    for (const [start, end] of range) {
      if (lastInitial >= start.toLowerCase() && lastInitial <= end.toLowerCase()) {
        return true;
      }
    }
    return false; // if there is a last name, but it doesn't fit any range
  }
  return true; // if no last name, show all options
};
