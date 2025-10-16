import { doc, setDoc } from 'firebase/firestore';

import { uniqueIncrementerCollection } from '../firebase-config';
import store from '../store';

const incrementUniqueID = (amount = 1): number => {
  const updatedID = store.state.uniqueIncrementer + amount;
  const noUpdatedBlankCourseID = store.state.uniqueBlankCourseIncrementer;
  setDoc(doc(uniqueIncrementerCollection, store.state.currentFirebaseUser.email), {
    uniqueIncrementer: updatedID,
    uniqueBlankCourseIncrementer: noUpdatedBlankCourseID,
  });
  return updatedID;
};

const incrementBlankCourseCrseID = (amount = 1): number => {
  const updatedBlankCourseID = store.state.uniqueBlankCourseIncrementer + amount;
  const noUpdatedID = store.state.uniqueIncrementer;
  setDoc(doc(uniqueIncrementerCollection, store.state.currentFirebaseUser.email), {
    uniqueIncrementer: noUpdatedID,
    uniqueBlankCourseIncrementer: updatedBlankCourseID,
  });
  return updatedBlankCourseID;
};

export { incrementBlankCourseCrseID, incrementUniqueID };
