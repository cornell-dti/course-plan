/* eslint-disable no-await-in-loop,no-console */
/**
 * BE CAREFUL WHEN COPYING TO PROD!
 * Script to copy data from one user on production or dev to another user on dev.
 * Requires service accounts for database.
 * serviceAccountDev.json (if using dev) and serviceAccountProd.json (if using prod) must be at the root.
 * The output will be the data written or to be written to the target.
 *
 * From root, run: `npm run ts-node -- scripts/copy-user-data.ts -f <FROM_ENV>/<FROM_USER> -t <TO_ENV>/<TO_USER> -o <OUTPUT>`
 * To execute the script, include `--execute` at the end of the command
 * FROM_ENV and TO_ENV should be either "dev" or "prod"
 * OUTPUT is an optional argument to specify the JSON file to write the log to. If left empty, the script will write to the console.
 * EXAMPLE: `npm run ts-node -- scripts/copy-user-data.ts -f dev/dummyaccount -t dev/newdummyaccount -o "log.json"`
 */

import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import parseArgs from 'minimist';
import { writeFileSync } from 'fs';

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

const args = parseArgs(process.argv, {
  string: ['f', 't', 'o'],
  boolean: true,
  alias: { from: 'f', to: 't', output: 'o' },
  default: { e: false, execute: false, output: '' },
});

if (args.from && args.to && 'execute' in args && 'output' in args) {
  const [sourceEnv, sourceDoc] = args.from.split('/');
  const [targetEnv, targetDoc] = args.to.split('/');
  if (
    (args.execute === true || args.execute === false) &&
    (sourceEnv === 'prod' || sourceEnv === 'dev') &&
    (targetEnv === 'prod' || targetEnv === 'dev') &&
    sourceDoc &&
    targetDoc
  ) {
    execute({
      fromUser: sourceDoc,
      fromEnv: sourceEnv,
      toUser: targetDoc,
      toEnv: targetEnv,
      execute: args.execute,
      output: args.output,
    }).then(() => {
      console.log('Done');
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
    output: string;
  }>
): Promise<void> {
  let fromDb;
  let toDb;
  if (options.fromEnv === 'dev' || options.toEnv === 'dev') {
    const dev = initializeApp({
      credential: cert('serviceAccountDev.json'),
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

  const log: { source: { [key: string]: unknown } } = { source: {} };
  if (fromDb && toDb) {
    // this should always be true
    for (const collection of collections) {
      const fromDoc = fromDb.collection(collection).doc(options.fromUser);
      const dataToCopy = (await fromDoc.get()).data();
      if (dataToCopy) {
        const toDoc = toDb.collection(collection).doc(options.toUser);
        let doLog = true;
        if (options.execute) {
          const result = await toDoc.set(dataToCopy);
          if (!result) doLog = false;
        }
        if (doLog) {
          log.source[`${options.fromEnv}/${fromDoc.path}`] = dataToCopy;
        }
      }
    }

    if (!options.output) {
      console.log(JSON.stringify(log, undefined, 2));
    } else {
      writeFileSync(options.output, JSON.stringify(log, undefined, 2));
    }
  }
}
