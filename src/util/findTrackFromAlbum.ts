import {findBestMatch} from 'string-similarity';
import {getDeezerTrack} from '../lib/deezer.js';
import type {DeezerAlbumTracksType} from '../types';

export const findTrackFromAlbum = async (title: string, tracks: DeezerAlbumTracksType[]) => {
  const {bestMatchIndex} = findBestMatch(
    title.toLowerCase(),
    tracks.map((t) => t.title.toLowerCase()),
  );
  return await getDeezerTrack(tracks[bestMatchIndex].id);
};
