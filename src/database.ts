import {MongoClient} from 'mongodb';

const LOCAL_DATABASE = 'mongodb://localhost:27017/humpback_test';
const MONGODB_URI = process.env.MONGODB_URI || LOCAL_DATABASE;

// Exit with error if database uri is not set
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI variable not set');
  process.exit(1);
}

// Create the database
const mongo = new MongoClient(MONGODB_URI, {retryWrites: true, w: 'majority'});

// Connect the database
await mongo.connect();

// Export collections
export const usersAccounts = mongo.db().collection('users.accounts');
export const musicTracks = mongo.db().collection('music.tracks');
export const musicAlbums = mongo.db().collection('music.albums');
export const musicArtists = mongo.db().collection('music.artists');
export const musicPlaylists = mongo.db().collection('music.playlists');

// Create indexes
await usersAccounts.createIndexes([
  {
    key: {displayname: 1},
  },
  {
    key: {username: 1},
  },
  {
    key: {email: 1},
  },
]);
await musicTracks.createIndexes([
  {
    key: {id: 1},
  },
  {
    key: {isrc: 1},
  },
  {
    key: {track_path: 1},
  },
]);
await musicAlbums.createIndexes([
  {
    key: {id: 1},
  },
  {
    key: {upc: 1},
  },
]);
await musicArtists.createIndexes([
  {
    key: {id: 1},
  },
  {
    key: {name: 1},
  },
]);
await musicPlaylists.createIndexes([
  {
    key: {id: 1},
  },
  {
    key: {title: 1},
  },
  {
    key: {'creator.name': 1},
  },
]);

// Export database as default
export default mongo;
