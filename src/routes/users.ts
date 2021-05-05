import {usersAccounts} from '../database.js';
import * as Schema from '../schema/index.js';
import type {FastifyInstance, RouteShorthandOptions} from 'fastify';

const user = async (fastify: FastifyInstance, options: RouteShorthandOptions) => {
  fastify.get('/me', options, async (res) =>
    usersAccounts.findOne({username: (res.user as Schema.JWTType).username}, {projection: {password: 0}}),
  );

  fastify.get<{Querystring: Schema.PaginationType}>(
    '/users',
    {...options, schema: {querystring: Schema.Users}},
    async (res, reply) => {
      const userRole = (res.user as Schema.JWTType).role;
      if (userRole === 'admin') {
        const {page, limit} = res.query;
        const users = await usersAccounts
          .find({}, {projection: {password: 0}})
          .skip(page > 1 ? page - 1 * limit : 0)
          .limit(limit)
          .toArray();

        const total = await usersAccounts.countDocuments();
        const pages = Math.ceil(total / limit);
        const pagination: Schema.PaginationType = {limit, page, pages, total};
        return {users, pagination};
      }

      reply.code(403).send('Forbidden');
    },
  );
};

export default user;
