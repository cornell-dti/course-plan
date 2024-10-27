/** All registered GK togglers. Do not manually add items to it. */
const GateKeeperTogglers: Record<string, () => void> = {};

// Register your new feature flags below, both in type and in `registerFeatureFlagChecker`.
type FeatureFlagName =
  | 'APIBFulfillment'
  | 'Case'
  | 'RequirementConflicts'
  | 'RequirementDebugger'
  | 'ToggleRequirementsBarBtn'
  | 'Profile'
  | 'MultiplePlans'
  | 'SavedCourses';
/* | 'AddYourFeatureFlagNameHere' */
const featureFlagCheckers: FeatureFlagCheckers = registerFeatureFlagChecker(
  'APIBFulfillment',
  'Case',
  'RequirementConflicts',
  'RequirementDebugger',
  'ToggleRequirementsBarBtn',
  'Profile',
  'MultiplePlans',
  'SavedCourses'
  /* 'AddYourFeatureFlagNameHere' */
);
export default featureFlagCheckers;

// Add your new feature flags above
// Gate keeper runtime code below. Do not touch if you do not understand.

type FeatureFlagCheckers = Record<`is${FeatureFlagName}Enabled`, () => boolean>;
/**
 * @param flagName name of the feature flag. Use `PascalCase` to be callable in developer console.
 * @returns a checker function to tell whether the feature flag is enabled.
 */
function registerFeatureFlagChecker(...flagNames: readonly FeatureFlagName[]): FeatureFlagCheckers {
  return (Object.fromEntries(
    flagNames.map(flagName => {
      const localStorageKey = `CP_GK-${flagName}`;
      GateKeeperTogglers[`enable${flagName}`] = () => {
        localStorage.setItem(localStorageKey, 'true');
        window.location.reload();
      };
      GateKeeperTogglers[`disable${flagName}`] = () => {
        localStorage.removeItem(localStorageKey);
        window.location.reload();
      };
      return [`is${flagName}Enabled`, () => localStorage.getItem(localStorageKey) === 'true'];
    })
  ) as unknown) as FeatureFlagCheckers;
}

declare global {
  interface Window {
    GK: typeof GateKeeperTogglers;
  }
}

export const registerGateKeeper = (): void => {
  window.GK = GateKeeperTogglers;
};
