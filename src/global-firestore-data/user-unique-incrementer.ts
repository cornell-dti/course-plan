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

const incrementUniqueIDBy = (count: number): readonly number[] => {
  const base = store.state.uniqueIncrementer;
  if (count > 0) incrementUniqueID(count);
  return Array.from({ length: Math.max(count, 0) }, (_, i) => base + i + 1);
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

export { incrementBlankCourseCrseID, incrementUniqueID, incrementUniqueIDBy };
