import test from 'ava';
import app from '../src/app.js';

test('GET /', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/',
  });

  t.is(response.statusCode, 200);
  t.deepEqual(response.json(), {hello: 'world'});
});
