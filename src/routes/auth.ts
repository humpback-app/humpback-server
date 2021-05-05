import bcrypt from 'bcrypt';
import {usersAccounts} from '../database.js';
import {setUserInfo} from '../common/user.js';
import * as Schema from '../schema/index.js';
import type {FastifyInstance} from 'fastify';

/**
 * A cryptographic salt is made up of random bits added
 * to each password instance before its hashing.
 * Salts create unique passwords even in the instance of
 * two users choosing the same passwords.
 */
const saltRounds = 10;

/**
 * Create user index for faster query performance
 * Strength 2 means case insensitive search
 */
const collation = {locale: 'en', strength: 2};

const auth = async (fastify: FastifyInstance) => {
  // User login
  fastify.post<{Body: Schema.LoginType}>('/login', {schema: {body: Schema.Login}}, async (res, reply) => {
    res.body.email = res.body.email.toLowerCase();
    const user = await usersAccounts.findOne({email: res.body.email}, {collation});
    if (user && bcrypt.compareSync(res.body.password, user.password)) {
      const {_id, username, role} = user;
      const token = fastify.jwt.sign({_id, username, role});
      return {token};
    }

    reply.code(401).send('Invalid credentials');
  });

  // User signup
  fastify.post<{Body: Schema.SignupType}>('/signup', {schema: {body: Schema.Signup}}, async (res, reply) => {
    res.body.email = res.body.email.toLowerCase();
    const user = await usersAccounts.findOne(
      {$or: [{email: res.body.email}, {username: res.body.username}]},
      {collation},
    );
    if (user) {
      reply.code(409).send('User already exists with that username or email.');
      return;
    }

    const userCount = await usersAccounts.countDocuments();
    if (userCount === 0) {
      usersAccounts.createIndex({username: 1, email: 1}, {collation});
      res.body.role = 'admin';
    } else {
      res.body.role = 'subscriber';
    }

    res.body.password = await bcrypt.hash(res.body.password, saltRounds);
    const created = await usersAccounts.insertOne(res.body);
    await setUserInfo(res.body);
    reply.code(201).send(created);
  });
};

export default auth;
