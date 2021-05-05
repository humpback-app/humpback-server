import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {md5Image} from './md5Image.js';
import {usersAccounts} from '../database.js';
import {checksum} from '../lib/checksum.js';
import type {AlbumType, TrackType, DeezerAlbumType, DeezerTrackType, PlaylistType} from '../types';

/**
 * Convert deezer album metadata to minimal required data
 * @param {Object} album album metadata from deezer
 */
export const generateAlbumInfo = (album: DeezerAlbumType): AlbumType => {
  return {
    id: `${album.id}`,
    title: album.title,
    upc: album.upc,
    md5_image: album.md5_image,
    genre_id: `${album.genre_id}`,
    genres: album.genres.data.map((genre) => ({id: `${genre.id}`, name: genre.name})),
    label: album.label,
    nb_tracks: album.nb_tracks,
    duration: album.duration,
    release_date: album.release_date,
    record_type: album.record_type,
    available: true,
    explicit_lyrics: album.explicit_lyrics,
    explicit_content_lyrics: album.explicit_content_lyrics,
    explicit_content_cover: album.explicit_content_cover,
    contributors: album.contributors.map((contributor) => ({
      id: `${contributor.id}`,
      name: contributor.name,
      radio: contributor.radio,
      md5_image: md5Image(contributor.picture_xl),
      type: contributor.type,
      role: contributor.role,
    })),
    artist: {
      id: `${album.artist.id}`,
      name: album.artist.name,
      radio: album.artist.radio,
      md5_image: md5Image(album.artist.picture_xl),
    },
    tracks: album.tracks.data.map((track) => `${track.id}`),
    created_at: dayjs().toISOString(),
    type: album.type,
  };
};

/**
 * Convert deezer track metadata to minimal required data
 * @param {Object} track track metadata from deezer
 * @param {String} path absolute location of the track
 * @param {String} md5hash md5 hash of the track
 */
export const generateTrackInfo = (
  track: DeezerTrackType,
  path: string,
  md5hash: string,
  readable: boolean,
): TrackType => {
  return {
    id: `${track.id}`,
    readable,
    title: track.title,
    title_short: track.title_short,
    title_version: track.title_version,
    isrc: track.isrc,
    duration: Number(track.duration),
    track_position: track.track_position,
    disk_number: track.disk_number,
    release_date: track.release_date,
    explicit_lyrics: track.explicit_lyrics,
    explicit_content_lyrics: track.explicit_content_lyrics,
    explicit_content_cover: track.explicit_content_cover,
    bpm: track.bpm,
    gain: track.gain,
    contributors: track.contributors.map((contributor) => ({
      id: `${contributor.id}`,
      name: contributor.name,
      radio: contributor.radio,
      md5_image: md5Image(contributor.picture_xl),
      role: contributor.role,
      type: contributor.type,
    })),
    md5_origin: md5hash,
    track_path: path,
    md5_image: track.md5_image,
    artist: {
      id: `${track.artist.id}`,
      name: track.artist.name,
      md5_image: md5Image(track.artist.picture_xl),
      radio: track.artist.radio,
    },
    album: {
      id: `${track.album.id}`,
      title: track.album.title,
      md5_image: track.album.md5_image,
      release_date: track.album.release_date,
    },
    created_at: dayjs().toISOString(),
    type: track.type,
  };
};

interface PlaylistInfoType {
  name: string;
  description: string;
  path: string;
  isrcs: string[];
  username?: string;
}

/**
 * Convert playlist to minimal required data
 * @param {String} name playlist name
 * @param {String} path absolute location of playlist file
 * @param {Object[]} tracks list of tracks
 */
export const generatePlaylistInfo = async ({
  name,
  description,
  path,
  isrcs,
  username,
}: PlaylistInfoType): Promise<PlaylistType> => {
  let creator = {
    id: '0',
    name: 'ghost',
    type: 'user',
  };
  if (username) {
    const user = await usersAccounts.findOne({username});
    if (user) {
      creator = {
        id: user._id,
        name: user.displayname,
        type: 'user',
      };
    }
  }

  return {
    id: nanoid(14),
    title: name,
    description,
    duration: 0,
    public: true,
    collaborative: true,
    nb_tracks: isrcs.length,
    checksum: checksum(isrcs),
    md5_image: '',
    picture_type: 'cover',
    creator,
    type: 'playlist',
    created_at: dayjs().toISOString(),
    tracks: isrcs,
  };
};
