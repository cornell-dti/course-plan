/** All registered GK togglers. Do not manually add items to it. */
const GateKeeperTogglers: Record<string, () => void> = {};

// Add your new feature flags below

export const isRequirementDebuggerEnabled = registerFeatureFlagChecker('RequirementDebugger');

// Add your new feature flags above
// Gate keeper runtime code below. Do not touch if you do not understand.

/**
 * @param flagName name of the feature flag. Use `PascalCase` to be callable in developer console.
 * @returns a checker function to tell whether the feature flag is enabled.
 */
function registerFeatureFlagChecker(flagName: string): () => boolean {
  const localStorageKey = `CP_GK-${flagName}`;
  GateKeeperTogglers[`enable${flagName}`] = () => {
    localStorage.setItem(localStorageKey, 'true');
    window.location.reload();
  };
  GateKeeperTogglers[`disable${flagName}`] = () => {
    localStorage.removeItem(localStorageKey);
    window.location.reload();
  };
  return () => localStorage.getItem(localStorageKey) === 'true';
}

declare global {
  interface Window {
    GK: typeof GateKeeperTogglers;
  }
}

export const registerGateKeeper = (): void => {
  window.GK = GateKeeperTogglers;
};
