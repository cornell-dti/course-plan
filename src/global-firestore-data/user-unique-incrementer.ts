import { doc, setDoc } from 'firebase/firestore';

import { uniqueIncrementerCollection } from '../firebase-config';
import store from '../store';

const incrementUniqueID = (amount = 1): number => {
  const updatedID = store.state.uniqueIncrementer + amount;
  setDoc(doc(uniqueIncrementerCollection, store.state.currentFirebaseUser.email), {
    uniqueIncrementer: updatedID,
  });
  return updatedID;
};

export default incrementUniqueID;
