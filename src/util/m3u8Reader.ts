import {readFileSync, existsSync} from 'fs';
import {basename, dirname, resolve} from 'path';

export const m3u8Reader = (playlistFile: string) => {
  const playlistRoot = dirname(playlistFile);
  const playlist = readFileSync(playlistFile, {encoding: 'utf-8'});

  return {
    name: basename(playlistFile).split('.').slice(0, -1).join('.'),
    tracks: playlist
      .trim()
      .split(/\r?\n/g)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => resolve(playlistRoot, line))
      .filter((line) => existsSync(line)),
  };
};
