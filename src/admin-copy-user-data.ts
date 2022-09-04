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

if (fromArg && toArg && executeArg) {
  const [FROM_ENV, FROM] = fromArg.split('/');
  const [TO_ENV, TO] = toArg.split('/');
  if (
    (executeArg === 'TRUE' || executeArg === 'FALSE') &&
    (FROM_ENV === 'prod' || FROM_ENV === 'dev') &&
    (TO_ENV === 'prod' || TO_ENV === 'dev') &&
    FROM &&
    TO
  ) {
    const doCopy = executeArg === 'TRUE';
    execute({
      fromUser: FROM,
      fromEnv: FROM_ENV,
      toUser: TO,
      toEnv: TO_ENV,
      execute: doCopy,
    }).then(copied => {
      if (doCopy) console.log(`Copied: [${copied}] from ${fromArg} to ${toArg}`);
      else console.log(copied);
    });
  } else {
    throw new Error('Refer to the documentation to correctly run this script.');
  }
} else {
  throw new Error('Please include all required command line arguments.');
}

async function execute(
  options: Readonly<{
    fromUser: string;
    toUser: string;
    fromEnv: 'prod' | 'dev';
    toEnv: 'prod' | 'dev';
    execute: boolean;
  }>
): Promise<string[]> {
  let fromDb;
  let toDb;
  if (options.fromEnv === 'dev' || options.toEnv === 'dev') {
    const dev = initializeApp({
      credential: cert('serviceAccount.json'),
      databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
    });
    const devDb = getFirestore(dev);
    if (options.fromEnv === 'dev') fromDb = devDb;
    if (options.toEnv === 'dev') toDb = devDb;
  }

  if (options.fromEnv === 'prod' || options.toEnv === 'prod') {
    const prod = initializeApp({
      credential: cert('serviceAccountProd.json'),
      databaseURL: 'https://cornell-courseplan.firebaseio.com',
    });
    const prodDb = getFirestore(prod);
    if (options.fromEnv === 'prod') fromDb = prodDb;
    if (options.toEnv === 'prod') toDb = prodDb;
  }

  const copied = [];
  if (fromDb && toDb) {
    // this should always be true
    for (const collection of collections) {
      const fromDoc = fromDb.collection(collection).doc(options.fromUser);
      const dataToCopy = (await fromDoc.get()).data();
      if (dataToCopy) {
        const toDoc = toDb.collection(collection).doc(options.toUser);
        if (options.execute) {
          const result = await toDoc.set(dataToCopy);
          if (result) copied.push(collection);
        } else {
          copied.push(
            `PREVIEW: copy from ${options.fromEnv}/${fromDoc.path} to ${options.toEnv}/${
              toDoc.path
            }: ${JSON.stringify(dataToCopy)}`
          );
        }
      }
    }
  }
  return copied;
}
