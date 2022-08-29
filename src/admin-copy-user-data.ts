/* eslint-disable no-await-in-loop */
/**
 * Script to copy data from one user on production or dev to another user on dev.
 * Requires service accounts for database
 *
 * From root, run: `npm run ts-node -- src/admin-copy-user-data.ts`
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

const dev = initializeApp({
  credential: credential.cert('serviceAccountDev.json'),
  databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
});

const prod = initializeApp({
  credential: credential.cert('serviceAccountProd.json'),
  databaseURL: 'https://cornell-courseplan.firebaseio.com',
});

const FROM = 'amm487@cornell.edu';
const TO = 'noschiff.dev@gmail.com';

const collections = [
  'user-name',
  'user-semesters',
  'user-toggleable-requirement-choices',
  'user-overridden-fulfillment-choices',
  'user-selectable-requirement-choices',
  'user-subject-colors',
  'user-unique-incrementer',
  'user-onboarding-data',
];

const devDb = getFirestore(dev);
const prodDb = getFirestore(prod);

const execute = async (): Promise<string[]> => {
  const copied = [];
  for (const collection of collections) {
    const get = (await devDb.collection(collection).doc(FROM).get()).data();
    if (get) {
      const result = await prodDb.collection(collection).doc(TO).set(get);
      if (result) copied.push(collection);
    }
  }
  return copied;
};

// eslint-disable-next-line no-console
execute().then(result => console.log(`Copied: ${result}`));
