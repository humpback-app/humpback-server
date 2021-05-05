import {readdirSync} from 'fs';
import {join} from 'path';
import {parseFile} from 'music-metadata';
import log from './logger.js';
import type {CrawlerType} from '../types';

const ignoreDirs = /lost\+found|log|node_modules|tmp|cache|run|dev|lib|mongodb|redis|lock|sys|spool|proc|private|boot|etc|recovery|bin|themes|sessions/;
const audioExt = /.*\.(mp3|flac|m4a|aac|alac|ogg|aiff)$/;

/**
 * Recursively find audio files in a directory
 * @param {String} dir folder to search on
 * @returns {name: filename, path: absolute_path, type: file_type}
 */
export function* walk(dir: string): Generator<CrawlerType> {
  try {
    const files = readdirSync(dir, {withFileTypes: true});
    for (const file of files) {
      if (!file.name.startsWith('.')) {
        if (file.isFile()) {
          if (file.name.match(audioExt)) {
            yield {name: file.name, path: join(dir, file.name), type: 'audio'};
          } else if (file.name.endsWith('.m3u8')) {
            yield {name: file.name, path: join(dir, file.name), type: 'playlist'};
          }
        } else if (file.isDirectory() && !file.name.match(ignoreDirs)) {
          yield* walk(join(dir, file.name));
        }
      }
    }
  } catch (err) {
    log.error('[walk] ' + err.message);
  }
}

/**
 * Extract music metadata for given file
 * @param {String} path file path
 * @returns metadata info
 */
export const metadata = async (path: string) => {
  try {
    const metadata = await parseFile(path, {skipCovers: true});
    return metadata;
  } catch (err) {
    log.error(`[metadata] ${err.message}`, path);
  }
};
