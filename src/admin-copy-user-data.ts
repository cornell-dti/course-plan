/* eslint-disable no-await-in-loop,no-console */
/**
 * TPM ONLY SCRIPT! BE CAREFUL COPYING TO PROD!
 * Script to copy data from one user on production or dev to another user on dev.
 * Requires service accounts for database.
 * serviceAccount.json (if using dev) and serviceAccountProd.json (if using prod) must be at the root.
 *
 * From root, run: `npm run ts-node -- src/admin-copy-user-data.ts <FROM_ENV>/<FROM_USER> <TO_ENV>/<TO_USER> <EXECUTE>`
 * FROM_ENV and TO_ENV should be either "dev" or "prod"
 * EXECUTE must be TRUE or FALSE. EXECUTE=FALSE will preview the changes, EXECUTE=TRUE will do the changes
 * EXAMPLE: `npm run ts-node -- src/admin-copy-user-data.ts prod/noschiff.dev@gmail.com dev/nps39@cornell.edu TRUE`
 */

import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

const fromArg = process.argv[2];
const toArg = process.argv[3];
const executeArg = process.argv[4];

if (fromArg && toArg && (executeArg === 'TRUE' || executeArg === 'FALSE')) {
  const [FROM_ENV, FROM] = fromArg.split('/');
  const [TO_ENV, TO] = toArg.split('/');
  const EXECUTE = executeArg === 'TRUE';
  execute(FROM, FROM_ENV, TO, TO_ENV, EXECUTE).then(copied => {
    if (EXECUTE) console.log(`Copied: [${copied}] from ${fromArg} to ${toArg}`);
    else console.log(copied);
  });
} else {
  throw new Error('Refer to the documentation to correctly run this script.');
}

async function execute(
  FROM: string,
  FROM_ENV: string,
  TO: string,
  TO_ENV: string,
  EXECUTE: boolean
): Promise<string[]> {
  let fromDb;
  let toDb;
  if (FROM_ENV === 'dev' || TO_ENV === 'dev') {
    const dev = initializeApp({
      credential: cert('serviceAccount.json'),
      databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
    });
    const devDb = getFirestore(dev);
    if (FROM_ENV === 'dev') fromDb = devDb;
    if (TO_ENV === 'dev') toDb = devDb;
  }

  if (FROM_ENV === 'prod' || TO_ENV === 'prod') {
    const prod = initializeApp({
      credential: cert('serviceAccountProd.json'),
      databaseURL: 'https://cornell-courseplan.firebaseio.com',
    });
    const prodDb = getFirestore(prod);
    if (FROM_ENV === 'prod') fromDb = prodDb;
    if (TO_ENV === 'prod') toDb = prodDb;
  }

  const copied = [];
  if (fromDb && toDb) {
    for (const collection of collections) {
      const fromDoc = fromDb.collection(collection).doc(FROM);
      const get = (await fromDoc.get()).data();
      if (get) {
        const toDoc = toDb.collection(collection).doc(TO);
        if (EXECUTE) {
          const result = await toDoc.set(get);
          if (result) copied.push(collection);
        } else {
          copied.push(
            `PREVIEW: copy from ${FROM_ENV}/${fromDoc.path} to ${TO_ENV}/${
              toDoc.path
            }: ${JSON.stringify(get)}`
          );
        }
      }
    }
  }
  return copied;
}
