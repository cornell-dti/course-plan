import { AdvisorChecker } from '@/requirements/tools-types';

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
// eslint-disable-next-line import/prefer-default-export
export const lastNameRange = (startLetter: string, endLetter: string): AdvisorChecker => (
  user: FirestoreUserName
): boolean => {
  if (user.lastName) {
    const lastInitial = user.lastName.charAt(0);
    return lastInitial >= startLetter && lastInitial <= endLetter;
  }
  return true;
};
