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

/**
 * Strips Non-breaking space (NBS) from a string and returns the result
 * 
 * @param value the field to clean
 * @returns the cleansed field
 */
export const cleanField = (value: string | null | undefined) =>
  value?.replace(/\u00a0/g, ' ') || undefined;

/**
 * Recursively strips NBS from an expression
 * 
 * @param field the field to clean
 * @returns the cleansed field
 */
export const clean = <E>(field: E) => {
  switch (typeof field) {
    case 'string':
      return cleanField(field);
    case 'object':
      if (field == null) return field;
      if (Array.isArray(field)) return field.map(clean);
      return Object.fromEntries(Object.entries(field).map(([k, v]) => [k, clean(v)]))
    default:
      return field;
  }
}

export default { writeToFile };
