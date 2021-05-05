// Adapted from https://github.com/fraunhoferfokus/JSum
import crypto from 'crypto';

// Delimeter to separate object items form each other when stringifying
const DELIM = '\u0000';

/**
 * Stringifies a JSON object (not any randon JS object).
 *
 * It should be noted that JS objects can have members of
 * specific type (e.g. function), that are not supported
 * by JSON.
 *
 * @param {Object} obj JSON object
 * @returns {String} stringified JSON object.
 */
const stringify = (obj: Record<string, any>): string => {
  if (Array.isArray(obj)) {
    const stringifiedArr = [];
    for (let i = 0; i < obj.length; i++) {
      stringifiedArr[i] = stringify(obj[i]);
    }
    return JSON.stringify(stringifiedArr);
  } else if (typeof obj === 'object' && obj !== null) {
    const acc = [];
    const sortedKeys = Object.keys(obj).sort();

    for (let i = 0; i < sortedKeys.length; i++) {
      const k = sortedKeys[i];
      acc[i] = `${k}:${stringify(obj[k])}`;
    }

    return acc.join(DELIM);
  } else if (typeof obj === 'string') {
    // https://github.com/fraunhoferfokus/JSum/issues/6
    return `"${obj}"`;
  }

  return obj;
};

/**
 * Creates hash of given JSON object.
 * @param {Object} obj JSON object
 */
export const checksum = (obj: Record<any, any>) => crypto.createHash('SHA256').update(stringify(obj)).digest('hex');
