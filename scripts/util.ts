import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

/**
 * Make sure this directory is in the .gitignore
 * Otherwise, sensitive information may be accidentally pushed
 */
const DEFAULT_OUTPUT_DIRECTORY = path.join('scripts', 'out');

export const writeToFile = (value, fileName: string) => {
  try {
    mkdirSync(DEFAULT_OUTPUT_DIRECTORY, { recursive: true });
  } finally {
    writeFileSync(
      path.join(DEFAULT_OUTPUT_DIRECTORY, fileName),
      JSON.stringify(value, undefined, 2)
    );
  }
};

export default { writeToFile };
