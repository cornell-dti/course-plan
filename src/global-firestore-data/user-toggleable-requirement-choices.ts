import { doc, setDoc } from 'firebase/firestore';

import { toggleableRequirementChoicesCollection } from '../firebase-config';
import store from '../store';

const editToggleableRequirementChoices = (
  toggleableRequirementChoices: AppToggleableRequirementChoices
): void => {
  setDoc(
    doc(toggleableRequirementChoicesCollection, store.state.currentFirebaseUser.email),
    toggleableRequirementChoices
  );
};

const chooseToggleableRequirementOption = (requirementID: string, option: string): void => {
  editToggleableRequirementChoices({
    ...store.state.toggleableRequirementChoices,
    [requirementID]: option,
  });
};

export default chooseToggleableRequirementOption;
