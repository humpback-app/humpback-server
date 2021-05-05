import test from 'ava';
import dayjs from 'dayjs';
import app from '../../src/app.js';

const headers: {[key: string]: string} = {};

test('POST /login (Setup json web token)', async (t) => {
  const payload = {email: 'user@example.com', password: 'securepassword'};
  const {statusCode, body} = await app.inject({method: 'POST', url: '/login', payload});
  t.is(statusCode, 200);

  const json = JSON.parse(body);
  headers.authorization = 'Bearer ' + json.token;
  t.truthy(json.token);
});

test('GET /api/me (Should return user info)', async (t) => {
  const {statusCode, body} = await app.inject({method: 'GET', url: '/api/me', headers});
  t.is(statusCode, 200);

  const {_id, created_at, ...user} = JSON.parse(body);
  t.truthy(_id);
  t.true(dayjs(created_at).isValid());
  t.deepEqual(user, {
    displayname: 'Sayem Chowdhury',
    username: 'sayem314',
    email: 'user@example.com',
    sex: 'unknown',
    role: 'admin',
    avatar: 'https://www.gravatar.com/avatar/b58996c504c5638798eb6b511e6f49af',
    social: {},
    status: 'active',
  });
});

test('GET /api/users (Should return users with pagination)', async (t) => {
  const {statusCode, body} = await app.inject({method: 'GET', url: '/api/users?page=2&limit=1', headers});
  t.is(statusCode, 200);

  const json = JSON.parse(body);
  t.is(json.users.length, 1);
  t.deepEqual(json.pagination, {limit: 1, page: 2, pages: 2, total: 2});

  const {_id, created_at, ...user} = json.users[0];
  t.truthy(_id);
  t.true(dayjs(created_at).isValid());
  t.deepEqual(user, {
    displayname: 'Sayem',
    username: '74y3m',
    email: 'user2@example.com',
    sex: 'unknown',
    role: 'subscriber',
    avatar: 'https://www.gravatar.com/avatar/ab53a2911ddf9b4817ac01ddcd3d975f',
    social: {},
    status: 'active',
  });
});
