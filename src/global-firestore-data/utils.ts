import { uniqueIncrementerCollection } from '../firebase-frontend-config';
import store from '../store';

// enum to define seasons as integers in season order
export const SeasonsEnum = Object.freeze({
  Winter: 0,
  Spring: 1,
  Summer: 2,
  Fall: 3,
});

export const incrementUniqueID = (amount = 1): number => {
  const updatedID = store.state.uniqueIncrementer + amount;
  uniqueIncrementerCollection
    .doc(store.state.currentFirebaseUser.email)
    .set({ uniqueIncrementer: updatedID });
  return updatedID;
};
