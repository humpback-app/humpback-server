import got from 'got';
import cache from './cache.js';
import type {DeezerAlbumType, DeezerTrackType} from '../types';

/**
 * Handle rate limits on deezer public api
 * Deezer limits are 50 requests every 5 second
 */
const instance = got.extend({
  prefixUrl: 'https://api.deezer.com/',
  responseType: 'json',
  retry: {
    limit: 10,
    calculateDelay: () => 5200,
  },
  hooks: {
    afterResponse: [
      (response) => {
        const shouldRetry = (response.body as any).error && (response.body as any).error.code === 4;
        if (shouldRetry) {
          response.statusCode = 429;
        }
        return response;
      },
    ],
  },
});

/**
 * Common function to request with cache
 * @param {String} key
 * @param {String} slug
 */
const request = async (key: string, slug: string) => {
  const data = cache.get(key);
  if (data) {
    return data;
  }

  const {body}: any = await instance(slug);
  if (body.error) {
    throw new Error(`No match found: ${slug}`);
  }

  if (body.id && typeof body.id === 'number') {
    body.id = body.id.toString();
  }

  cache.set(key, body);
  return body;
};

/**
 * Find a music metadata using ISRC
 * @param {String} isrc International Standard Recording Code
 */
export const isrc2track = async (isrc: string): Promise<DeezerTrackType> => {
  const track: DeezerTrackType = await request(`deezer:isrc:${isrc}`, `track/isrc:${isrc}`);
  cache.set(`deezer:track:${track.id}`, track);
  return track;
};
/**
 * Find deezer track metadata using track id
 * @param {String} id Track ID
 */
export const getDeezerTrack = (id: string): Promise<DeezerTrackType> => request(`deezer:track:${id}`, `track/${id}`);

/**
 * Find music album metadata using UPC
 * @param {String} upc Universal Product Code / Barcode
 */
export const upc2album = async (upc: string): Promise<DeezerAlbumType> => {
  if (upc.length > 12) {
    upc = upc.slice(-12);
  }
  const album: DeezerAlbumType = await request(`deezer:upc:${upc}`, `album/upc:${upc}`);
  cache.set(`deezer:album:${album.id}`, album);
  return album;
};

/**
 * Find music album metadata using album id
 * @param {String} id Album ID
 */
export const getDeezerAlbum = (id: string): Promise<DeezerAlbumType> => request(`deezer:album:${id}`, `album/${id}`);
