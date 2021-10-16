import { toggleableRequirementChoicesCollection } from '@/firebase-frontend-config';
import store from '@/store';

// TODO: add functions addToggleableRequirementChoice and deleteToggleRequirementChoice
const chooseToggleableRequirementOption = (
  toggleableRequirementChoices: AppToggleableRequirementChoices
): void => {
  toggleableRequirementChoicesCollection
    .doc(store.state.currentFirebaseUser.email)
    .set(toggleableRequirementChoices);
};

export default chooseToggleableRequirementOption;
