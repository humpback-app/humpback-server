import {isrc2track, upc2album} from './deezer.js';
import {findTrackByFingerprint} from './chromaprint.js';
import log from './logger.js';
import {musicTracks} from '../database.js';
import {findTrackFromAlbum, addTrackAndAlbum} from '../util/index.js';
import type {ScrapeFilesType, DeezerAlbumType, DeezerTrackType, TrackType} from '../types';

export const extractAudio = async (
  file: ScrapeFilesType,
  projection: Record<string, 0 | 1> = {_id: 0, readable: 1},
) => {
  try {
    const entry = await musicTracks.findOne({track_path: file.path}, {projection});
    if (entry && entry.readable) {
      return entry as TrackType;
    }

    let track: DeezerTrackType | null = null;
    let album: DeezerAlbumType | null = null;

    if (file.meta?.barcode && file.meta.barcode.length > 12) {
      file.meta.barcode = file.meta.barcode.slice(-12);
    }

    if (file.meta?.isrc && file.meta.isrc[0]) {
      log.info('[extractAudio:isrc:track] ' + file.path);
      track = await isrc2track(file.meta.isrc[0]);
      return await addTrackAndAlbum(track, file.path, file.meta.barcode);
    }

    if (file.meta?.barcode && file.meta?.barcode.length > 10) {
      log.info('[extractAudio:barcode:album] ' + file.path);
      const title = file.meta.title || file.name.split('.').slice(0, -1).join('.');
      try {
        album = await upc2album(file.meta.barcode);
        track = await findTrackFromAlbum(title, album.tracks.data);

        // Refetech track using ISRC to prevent duplicate tracks
        // Deezer contains same track with different song id
        track = await isrc2track(track.isrc);
        return await addTrackAndAlbum(track, file.path, file.meta.barcode);
      } catch (err) {
        // Fallback to fingerprint lookup
        log.warn('[extractAudio:barcode:album] ' + err.message);
      }
    }

    track = await findTrackByFingerprint(file.path);
    if (track) {
      return await addTrackAndAlbum(track, file.path, file.meta?.barcode);
    }
  } catch (err) {
    log.error(`[extractAudio] ${err.message}`, file.path);
  }
};
