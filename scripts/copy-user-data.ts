/* eslint-disable no-await-in-loop,no-console */
/**
 * BE CAREFUL WHEN COPYING TO PROD!
 * Script to copy data from one user on production or dev to another user on dev.
 * Requires service accounts for database.
 * serviceAccount.json (if using dev) and serviceAccountProd.json (if using prod) must be at the root.
 * If you encounter problems, see scripts/firebase-config.ts for more information on how the service account is loaded.
 *
 * The data written (with --execute) or the data to be written (without --execute) to the target
 * will be outputted to scripts/out/<OUTPUT> when -o is included and written to the console otherwise.
 * If it doesn't already exist, out/ should be created in scripts/ if you include -o <OUTPUT>.
 *
 * From root, run: `npm run ts-node -- scripts/copy-user-data.ts -f <FROM_ENV>/<FROM_USER> -t <TO_ENV>/<TO_USER> -o <OUTPUT>`
 * To execute the script, include `--execute` at the end of the command
 * FROM_ENV and TO_ENV should be either "dev" or "prod"
 * OUTPUT is an optional argument to specify the filepath to write the JSON log to. If left empty, the script will write to the console.
 * EXAMPLE: `npm run ts-node -- scripts/copy-user-data.ts -f dev/dummyaccount -t dev/newdummyaccount -o "log.json"`
 */


import parseArgs from 'minimist';
import {
  DATABASE_URL_DEV,
  DATABASE_URL_PROD,
  SERVICE_ACCOUNT_DEV,
  SERVICE_ACCOUNT_PROD,
  getDatabase,
  userCollectionNames,
} from './firebase-config';
import { writeToFile } from './util';

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
    const devDb = getDatabase(SERVICE_ACCOUNT_DEV, DATABASE_URL_DEV, 'dev');
    if (options.fromEnv === 'dev') fromDb = devDb;
    if (options.toEnv === 'dev') toDb = devDb;
  }

  if (options.fromEnv === 'prod' || options.toEnv === 'prod') {
    const prodDb = getDatabase(SERVICE_ACCOUNT_PROD, DATABASE_URL_PROD, 'prod');
    if (options.fromEnv === 'prod') fromDb = prodDb;
    if (options.toEnv === 'prod') toDb = prodDb;
  }

  const log: { source: { [key: string]: unknown } } = { source: {} };
  if (fromDb && toDb) {
    // this should always be true
    for (const collection of userCollectionNames) {
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
      writeToFile(log, options.output);
    }
  }
}
