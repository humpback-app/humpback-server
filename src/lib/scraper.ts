import {basename} from 'path';
import {walk, metadata} from './crawler.js';
import log from './logger.js';
import {musicPlaylists} from '../database.js';
import {m3u8Reader, generatePlaylistInfo} from '../util/index.js';
import {extractAudio} from './extract.js';
import type {DeezerTrackType, TrackType, ScrapeFilesType} from '../types';

const extractMeta = async (file: ScrapeFilesType) => {
  const meta = await metadata(file.path);
  return {...file, meta: meta?.common};
};

const extractPlaylist = async (file: ScrapeFilesType) => {
  try {
    const {name, tracks} = m3u8Reader(file.path);
    const addedTracks: (TrackType | DeezerTrackType)[] = [];
    for (const track of tracks) {
      const info = await extractMeta({
        name: basename(track),
        path: track,
        type: 'audio',
      });
      const addedTrack = await extractAudio(info, {readable: 1, isrc: 1});
      if (addedTrack) {
        addedTracks.push(addedTrack);
      }
    }
    const playlistInfo = await generatePlaylistInfo({
      name,
      description: '',
      path: '',
      isrcs: addedTracks.map((t) => t.isrc),
    });
    await musicPlaylists.updateOne({id: playlistInfo.id}, {$set: playlistInfo}, {upsert: true});
  } catch (err) {
    log.error('[extractPlaylist] ' + err.message);
  }
};

export const scrape = async (path: string) => {
  const playlists: ScrapeFilesType[] = [];
  let files: ScrapeFilesType[] = [];

  for (const file of walk(path)) {
    if (file.type === 'audio') {
      const info = await extractMeta(file);
      files.push(info);

      if (files.length >= 5) {
        for (const audio of files) {
          await extractAudio(audio);
        }
        files = [];
      }
    } else if (file.type === 'playlist') {
      playlists.push(file);
    }
  }

  if (files.length > 0) {
    for (const audio of files) {
      await extractAudio(audio);
    }
  }

  for (const playlist of playlists) {
    await extractPlaylist(playlist);
  }
};
