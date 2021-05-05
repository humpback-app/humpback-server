import {getDeezerAlbum, getDeezerTrack, isrc2track, upc2album} from './deezer.js';
import {findTrackByFingerprint} from './chromaprint.js';
import log from './logger.js';
import {musicTracks, musicAlbums, musicArtists} from '../database.js';
import {md5File, generateAlbumInfo, generateTrackInfo, findTrackFromAlbum} from '../util/index.js';
import type {ScrapeFilesType, DeezerAlbumType, DeezerTrackType, TrackType} from '../types';

const addTrackAndAlbum = async (track: DeezerTrackType, trackPath: string, barcode?: string) => {
  try {
    if (!track.readable) {
      track = await isrc2track(track.isrc);
    }

    let album: DeezerAlbumType;
    try {
      album = await getDeezerAlbum(track.album.id);
    } catch (err) {
      if (barcode) {
        album = await upc2album(barcode);
      } else {
        throw err;
      }
    }
    await musicAlbums.updateOne({id: album.id}, {$set: generateAlbumInfo(album)}, {upsert: true});

    const trackIds = album.tracks.data.map((t) => t.id.toString());
    const availableTracks = await musicTracks.find({id: {$in: trackIds}}, {projection: {_id: 0, id: 1}}).toArray();

    if (!trackIds.includes(`${track.id}`)) {
      track = await findTrackFromAlbum(track.title, album.tracks.data);
    }

    await Promise.all(
      trackIds.map(async (id) => {
        if (id === track.id || !availableTracks.includes({id})) {
          try {
            let md5hash = '';
            let trackInfo: TrackType | null = null;

            if (track.id === id) {
              md5hash = await md5File(trackPath);
              trackInfo = generateTrackInfo(track, trackPath, md5hash, true);
              await musicTracks.updateOne({isrc: trackInfo.isrc}, {$set: trackInfo}, {upsert: true});
              await musicArtists.updateOne({id: trackInfo.artist.id}, {$set: trackInfo.artist}, {upsert: true});
              return;
            }

            const isTrackExists = await musicTracks.findOne({id: id});
            if (!isTrackExists) {
              const trackData = await getDeezerTrack(id);
              trackInfo = generateTrackInfo(trackData, '', '', false);
              await musicTracks.insertOne(trackInfo);
              await musicArtists.updateOne({id: trackInfo.artist.id}, {$set: trackInfo.artist}, {upsert: true});
            }
          } catch (err) {
            log.error(`[addAlbum:promiseAll] ${err.message} (${id})`);
          }
        }
      }),
    );

    return track;
  } catch (err) {
    log.error(`[addTrackAndAlbum] ${err.message}`, trackPath);
  }
};

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
