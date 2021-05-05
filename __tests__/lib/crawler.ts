import test from 'ava';
import {walk, metadata} from '../../src/lib/crawler.js';

test('walk & metadata', async (t) => {
  const files = walk('/home');
  const {value} = files.next();

  t.is(typeof value, 'object');
  t.is(Object.keys(value).length, 3);

  const meta = await metadata(value.path);
  t.truthy(meta);
});
