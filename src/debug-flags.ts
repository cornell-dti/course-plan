const GK_RDB = 'CP_GK-RDB'; // Requirement DeBugger

export const isRequirementDebuggerEnabled = (): boolean => localStorage.getItem(GK_RDB) === 'true';

const enableRequirementDebugger = (): void => {
  localStorage.setItem(GK_RDB, 'true');
  window.location.reload();
};
const disableRequirementDebugger = (): void => {
  localStorage.removeItem(GK_RDB);
  window.location.reload();
};

const GateKeeper = { enableRequirementDebugger, disableRequirementDebugger };

declare global {
  interface Window {
    GK: typeof GateKeeper;
  }
}

export const registerGateKeeper = (): void => {
  window.GK = GateKeeper;
};
