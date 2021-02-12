/**
 * Put all functions that can use and change the firestore data here.
 */

import {
  semestersCollection,
  toggleableRequirementChoicesCollection,
  subjectColorsCollection,
  uniqueIncrementerCollection,
} from './firebaseConfig';
import store from './store';

export const editSemesters = (
  updater: (oldSemesters: readonly FirestoreSemester[]) => readonly FirestoreSemester[]
): void => {
  const newSemesters = updater(store.state.semesters);
  store.commit('setSemesters', newSemesters);
  semestersCollection.doc(store.state.currentFirebaseUser.email).set({ semesters: newSemesters });
};

export const chooseToggleableRequirementOption = (
  toggleableRequirementChoices: AppToggleableRequirementChoices
): void => {
  toggleableRequirementChoicesCollection
    .doc(store.state.currentFirebaseUser.email)
    .set(toggleableRequirementChoices);
};

const getSubjectColor = (subjectColors: Record<string, string>, subject: string): string => {
  if (subjectColors[subject]) return subjectColors[subject];

  const colors = [
    {
      text: 'Red',
      hex: 'DA4A4A',
    },
    {
      text: 'Orange',
      hex: 'FFA53C',
    },
    {
      text: 'Green',
      hex: '58C913',
    },
    {
      text: 'Blue',
      hex: '139DC9',
    },
    {
      text: 'Purple',
      hex: 'C478FF',
    },
    {
      text: 'Pink',
      hex: 'F296D3',
    },
  ];

  // Create list of used colors
  const colorsUsedMap: Record<string, boolean> = {};
  for (const subjectKey of Object.keys(subjectColors)) {
    const subjectColor = subjectColors[subjectKey];
    colorsUsedMap[subjectColor] = true;
  }

  // Filter out used colors
  const unusedColors = colors.filter(color => !colorsUsedMap[color.hex]);

  let randomColor: string;

  // pick a color from unusedColors if there are any
  if (unusedColors.length !== 0) {
    randomColor = unusedColors[Math.floor(Math.random() * unusedColors.length)].hex;
    // otherwise pick a color following the random order set by the first 7 subjects
  } else {
    const colorIndex = Object.keys(subjectColors).length;
    const key = Object.keys(subjectColors)[colorIndex % colors.length];
    randomColor = subjectColors[key];
  }

  subjectColors[subject] = randomColor;
  return randomColor;
};

export const getOrAllocateSubjectColor = (subject: string): string => {
  const subjectsColorCopy = { ...store.state.subjectColors };
  const color = getSubjectColor(subjectsColorCopy, subject);
  // Update subjectColors on Firebase with new subject color group
  subjectColorsCollection.doc(store.state.currentFirebaseUser.email).set(subjectsColorCopy);
  return color;
};

export const incrementUniqueID = (amount = 1): number => {
  const updatedID = store.state.uniqueIncrementer + amount;
  uniqueIncrementerCollection
    .doc(store.state.currentFirebaseUser.email)
    .set({ uniqueIncrementer: updatedID });
  return updatedID;
};
