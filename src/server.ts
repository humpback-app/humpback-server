import mongo from './database.js';
import server from './app.js';
import {scrape} from './lib/scraper.js';

try {
  // Establish and verify database connection
  await mongo.db('admin').command({ping: 1});
  server.log.info('Database connected successfully');

  // Start server
  await server.listen(process.env.PORT || 3000);

  // Start the scrapper
  // Hardcoded now for testing purposes
  await scrape('/media');
  server.log.info('Scraping completed');
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
