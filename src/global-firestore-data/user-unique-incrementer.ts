import { doc, setDoc } from 'firebase/firestore';

import { uniqueIncrementerCollection } from '../firebase-config';
import store from '../store';

const incrementUniqueID = (amount = 1): number => {
  const updatedID = store.state.uniqueIncrementer + amount;
  setDoc(doc(uniqueIncrementerCollection, store.state.currentFirebaseUser.email), {
    uniqueIncrementer: updatedID,
    uniqueBlankCourseIncrementer: store.state.uniqueBlankCourseIncrementer,
  });
  return updatedID;
};

const incrementBlankCourseCrseID = (amount = 1): number => {
  const updatedBlankCourseID = store.state.uniqueBlankCourseIncrementer + amount;
  setDoc(
    doc(uniqueIncrementerCollection, store.state.currentFirebaseUser.email),
    {
      uniqueBlankCourseIncrementer: updatedBlankCourseID,
    },
    { merge: true }
  ); // Use merge to avoid overwriting other fields
  return updatedBlankCourseID;
};

export { incrementBlankCourseCrseID, incrementUniqueID };
