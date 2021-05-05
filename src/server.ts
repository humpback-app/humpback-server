import mongo from './database.js';
import server from './app.js';

try {
  // Establish and verify database connection
  await mongo.db('admin').command({ping: 1});
  server.log.info('Database connected successfully');

  // Start server
  await server.listen(process.env.PORT || 3000);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
