import test from 'ava';
import {tmpdir} from 'os';
import {join} from 'path';
import {writeFileSync, unlinkSync} from 'fs';
import {md5File} from '../../src/util/md5File.js';

test('md5File', async (t) => {
  const file = join(tmpdir(), 'hello.json');
  writeFileSync(file, JSON.stringify({hello: 'world'}));

  const hash = await md5File(file);
  unlinkSync(file);

  t.is(hash, 'fbc24bcc7a1794758fc1327fcfebdaf6');
});
