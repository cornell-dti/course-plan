import { doc, setDoc } from 'firebase/firestore';

import { toggleableRequirementChoicesCollection } from '../firebase-config';
import store from '../store';

const editToggleableRequirementChoices = async (
  toggleableRequirementChoices: AppToggleableRequirementChoices
): Promise<void> => {
  await setDoc(
    doc(toggleableRequirementChoicesCollection, store.state.currentFirebaseUser.email),
    toggleableRequirementChoices
  );
};

const chooseToggleableRequirementOption = async (
  requirementID: string,
  option: string
): Promise<void> => {
  await editToggleableRequirementChoices({
    ...store.state.toggleableRequirementChoices,
    [requirementID]: option,
  });
};

export default chooseToggleableRequirementOption;
