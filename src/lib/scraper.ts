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
    const isPlaylistExists = await musicPlaylists.findOne({playlist_path: file.path}, {projection: {_id: 1}});
    if (isPlaylistExists) {
      return;
    }

    const {name, tracks} = m3u8Reader(file.path);
    const addedTracks: (TrackType | DeezerTrackType)[] = [];
    for (const track of tracks) {
      const info = await extractMeta({name: basename(track), path: track, type: 'audio'});
      const addedTrack = await extractAudio(info, {_id: 0, id: 1, duration: 1});
      if (addedTrack) {
        addedTracks.push(addedTrack);
      }
    }

    const playlistInfo = await generatePlaylistInfo({
      name,
      description: '',
      path: file.path,
      duration: addedTracks.reduce((total, at) => total + Number(at.duration), 0),
      tracks: addedTracks.map((t) => `${t.id}`),
    });
    await musicPlaylists.insertOne(playlistInfo);
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
