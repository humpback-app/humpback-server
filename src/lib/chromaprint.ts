import {spawnSync} from 'child_process';
import got from 'got';
import {isrc2track} from './deezer.js';
import log from './logger.js';
import type {FingerprintResultsType, FingerprintType, MusicbrainzRecordingType} from '../types';

const fpcalc =
  process.platform === 'linux'
    ? 'fpcalc-linux-x64'
    : process.platform === 'darwin'
    ? 'fpcalc-darwin-x64'
    : process.platform === 'win32'
    ? 'fpcalc-win-x64.exe'
    : null;

const fingerprint = async (file: string): Promise<FingerprintResultsType | undefined> => {
  if (fpcalc) {
    try {
      const {stdout, error, stderr} = spawnSync('bin/' + fpcalc, ['-json', file], {encoding: 'utf-8'});
      if (error || stderr) {
        throw error ? error : new Error(stderr.trim());
      }

      const data: {duration: number; fingerprint: string} = JSON.parse(stdout);
      const {body} = await got<FingerprintType>(
        `https://api.acoustid.org/v2/lookup?client=Ppf0LvUFJl&duration=${Math.floor(data.duration)}&fingerprint=${
          data.fingerprint
        }&meta=recordings+recordingids+releases+releaseids+releasegroups+releasegroupids+tracks+compress+usermeta+sources`,
        {responseType: 'json'},
      );

      if (body.status === 'ok' && body.results.length > 0) {
        return body.results[0];
      } else {
        log.warn(`[fingerprint] status: ${body.status}`, file);
      }
    } catch (err) {
      log.error(`[fingerprint] ${err.message}`, file);
    }
  }
};

export const findTrackByFingerprint = async (file: string) => {
  try {
    log.pending(`[findTrackByFingerprint] ${file}`);
    const data = await fingerprint(file);
    if (data?.recordings?.[0].id) {
      const {body} = await got<MusicbrainzRecordingType>(
        `https://musicbrainz.org/ws/2/recording/${data.recordings[0].id}?inc=isrcs&fmt=json`,
        {responseType: 'json'},
      );
      if (body.isrcs && body.isrcs[0]) {
        const track = await isrc2track(body.isrcs[0]);
        log.success(`[findTrackByFingerprint] ${file}`);
        return track;
      }
      log.warn(`[findTrackByFingerprint] ISRC not available ${file}`);
    } else {
      log.warn(`[findTrackByFingerprint] ID not found in AcoustID ${file}`);
    }
  } catch (err) {
    log.error(`[findTrackByFingerprint] ${err.message}`, file);
  }

  return null;
};
