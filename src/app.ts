import fastify from 'fastify';
import jwt from 'fastify-jwt';
import auth from './routes/auth.js';
import users from './routes/users.js';

// Fastify instance
const app = fastify({
  logger: {
    prettyPrint: {
      levelFirst: true,
      translateTime: 'h:MM:ss TT',
      errorProps: 'message',
      ignore: 'pid,hostname,req,reqId,err,res,responseTime',
      messageFormat: '{req.method} {res.statusCode} {req.remoteAddress} {req.url} {msg}',
    },
    serializers: {
      req(req) {
        /* c8 ignore next 5 */
        return {
          method: req.method,
          url: req.url,
          remoteAddress: req.headers['X-Forwarded-For'] || (req as any).ip,
        };
      },
    },
  },
});

// Register json web token
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'secret',
  sign: {expiresIn: '10d'},
});

const jwtVerify = async (request: any) => request.jwtVerify();
const authenticatedApiRoutes = {preValidation: [jwtVerify], prefix: '/api'};

// Root endpoint for ping
app.get('/', {logLevel: 'error'}, async () => ({hello: 'world'}));

// User auth and info
app.register(auth);
app.register(users, authenticatedApiRoutes);

export default app;
