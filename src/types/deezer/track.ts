import type {DeezerContributorsType, DeezerArtistType} from './common.js';

interface DeezerAlbumType {
  id: string; // '302127';
  title: string; // 'Discovery';
  link: string; // 'https://www.deezer.com/album/302127';
  cover: string; // 'https://api.deezer.com/album/302127/image';
  cover_small: string; // 'https://cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/56x56-000000-80-0-0.jpg';
  cover_medium: string; // 'https://cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/250x250-000000-80-0-0.jpg';
  cover_big: string; // 'https://cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/500x500-000000-80-0-0.jpg';
  cover_xl: string; // 'https://cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/1000x1000-000000-80-0-0.jpg';
  md5_image: string; // '2e018122cb56986277102d2041a592c8';
  release_date: string; // '2001-03-07';
  tracklist: string; // 'https://api.deezer.com/album/302127/tracks';
  type: 'album';
}

export interface DeezerTrackType {
  id: string | number; // '3135556' || -3135556;
  readable: boolean;
  title: string; // 'Harder, Better, Faster, Stronger';
  title_short: string; // 'Harder, Better, Faster, Stronger';
  title_version?: string; // '';
  isrc: string; // 'GBDUW0000059';
  link: string; // 'https://www.deezer.com/track/3135556';
  share: string; // 'https://www.deezer.com/track/3135556?utm_source=deezer&utm_content=track-3135556&utm_term=0_1619266129&utm_medium=web';
  duration: string; // '224';
  track_position: number; // 4;
  disk_number: number; // 1;
  rank: string; // '849981';
  release_date: string; // '2001-03-07';
  explicit_lyrics: boolean;
  explicit_content_lyrics: number; // 0;
  explicit_content_cover: number; // 0;
  preview: string; // 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3';
  bpm: number; // 123.4;
  gain: number; // -12.4;
  available_countries: string[];
  contributors: DeezerContributorsType[];
  md5_image: '2e018122cb56986277102d2041a592c8';
  artist: DeezerArtistType;
  album: DeezerAlbumType;
  type: 'track';
}
