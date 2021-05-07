import {getDeezerAlbum, getDeezerTrack, isrc2track, upc2album} from '../lib/deezer.js';
import log from '../lib/logger.js';
import {musicTracks, musicAlbums, musicArtists} from '../database.js';
import {md5File, generateAlbumInfo, generateTrackInfo} from '../util/index.js';
import {findTrackFromAlbum} from './findTrackFromAlbum';
import type {DeezerAlbumType, DeezerTrackType, TrackType} from '../types';

export const addTrackAndAlbum = async (track: DeezerTrackType, trackPath: string, barcode?: string) => {
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

    const isAlbumExists = await musicAlbums.findOne({id: album.id}, {projection: {_id: 1}});
    if (!isAlbumExists) {
      await musicAlbums.insertOne(generateAlbumInfo(album));
    }

    // Only update album tracks
    const {tracks} = generateAlbumInfo(album);
    await musicAlbums.updateOne({id: album.id}, {$set: {tracks}});

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
