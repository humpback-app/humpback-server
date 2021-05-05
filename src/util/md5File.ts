// Adapted from https://github.com/kodie/md5-file
import {createReadStream} from 'fs';
import {createHash} from 'crypto';

/**
 * Asynchronously get the MD5-sum of the file at `path`
 * @param {String} path exact file location
 */
export const md5File = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const output = createHash('md5');
    const input = createReadStream(path);

    input.on('error', reject);

    output.once('readable', () => {
      resolve(output.read().toString('hex'));
    });

    input.pipe(output);
  });
};
