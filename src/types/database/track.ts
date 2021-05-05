import type {ArtistType, ContributorsType} from './common.js';

interface TrackAlbumType {
  id: string; // '302127';
  title: string; // 'Discovery';
  md5_image: string; // '2e018122cb56986277102d2041a592c8';
  release_date: string; // '2001-03-07';
}

export interface TrackType {
  /**
   * Track ID from metadata provider
   */
  id: string; // '3135556';
  /**
   * Boolean indicating if track is available
   */
  readable: boolean;
  title: string; // 'Harder, Better, Faster, Stronger';
  title_short: string; // 'Harder, Better, Faster, Stronger';
  title_version?: string; // '';
  isrc: string; // 'GBDUW0000059';
  duration: number; // 224;
  /**
   * Track position in album
   */
  track_position: number; // 4;
  /**
   * Album disk number
   */
  disk_number: number; // 1;
  release_date: string; // '2001-03-07';
  explicit_lyrics: boolean;
  explicit_content_lyrics: number; // 0;
  explicit_content_cover: number; // 0;
  bpm: number; // 123.4;
  gain: number; // -12.4;
  contributors: ContributorsType[];
  /**
   * MD5 hash of the track
   */
  md5_origin: string;
  /**
   * Location of the track
   */
  track_path: string;
  /**
   * Cover hash from metadata provider
   */
  md5_image: string;
  artist: ArtistType;
  album: TrackAlbumType;
  created_at: string;
  type: 'track';
}
