import test from 'ava';
import mongo from '../../src/database.js';
import app from '../../src/app.js';

test('Drop mongodb test database', async (t) => {
  const dropped = await mongo.db().dropDatabase();
  t.true(dropped);
});

test('POST /signup (Should return acknowledged)', async (t) => {
  const payload = {
    displayname: 'Sayem Chowdhury',
    username: 'sayem314',
    email: 'user@example.com',
    password: 'securepassword',
  };
  const {statusCode, body} = await app.inject({method: 'POST', url: '/signup', payload});
  t.is(statusCode, 201);

  const json = JSON.parse(body);
  t.true(json.acknowledged);
  t.truthy(json.insertedId);
});

test('POST /signup (Should prevent duplicate registration)', async (t) => {
  const payload = {
    displayname: 'Sayem',
    username: 'SAYEM314',
    email: 'USER@EXAMPLE.COM',
    password: 'securepassword',
  };
  const {statusCode} = await app.inject({method: 'POST', url: '/signup', payload});
  t.is(statusCode, 409);
});

test('POST /login (Should return json web token)', async (t) => {
  const payload = {email: 'user@example.com', password: 'securepassword'};
  const {statusCode, body} = await app.inject({method: 'POST', url: '/login', payload});
  t.is(statusCode, 200);

  const json = JSON.parse(body);
  process.env.TOKEN = json.token;
  t.truthy(json.token);
});
