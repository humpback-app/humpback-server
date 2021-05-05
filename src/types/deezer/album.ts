import type {DeezerGenreType, DeezerContributorsType, DeezerArtistType} from './common.js';

export interface DeezerAlbumTracksType {
  id: string; // '3135553';
  readable: boolean;
  title: string; // 'One More Time';
  title_short: string; // 'One More Time';
  title_version?: string; // '';
  link: string; // 'https://www.deezer.com/track/3135553';
  duration: string; // '320';
  rank: string; // '944554';
  explicit_lyrics: boolean;
  explicit_content_lyrics: number; // 0;
  explicit_content_cover: number; // 0;
  preview: string; // 'https://cdns-preview-e.dzcdn.net/stream/c-e77d23e0c8ed7567a507a6d1b6a9ca1b-9.mp3';
  md5_image: string; // '2e018122cb56986277102d2041a592c8';
  artist: {
    id: string; // '27';
    name: string; // 'Daft Punk';
    tracklist: string; // 'https://api.deezer.com/artist/27/top?limit=50';
    type: 'artist';
  };
  type: 'track';
}

export interface DeezerAlbumType {
  id: string; // '302127';
  title: string; // 'Discovery';
  upc: string; // '724384960650';
  link: string; // 'https://www.deezer.com/album/302127';
  share: string; // 'https://www.deezer.com/album/302127?utm_source=deezer&utm_content=album-302127&utm_term=0_1619285648&utm_medium=web';
  cover: string; // 'https://api.deezer.com/album/302127/image';
  cover_small: string; // 'https://cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/56x56-000000-80-0-0.jpg';
  cover_medium: string; // 'https://cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/250x250-000000-80-0-0.jpg';
  cover_big: string; // 'https://cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/500x500-000000-80-0-0.jpg';
  cover_xl: string; // 'https://cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/1000x1000-000000-80-0-0.jpg';
  md5_image: string; // '2e018122cb56986277102d2041a592c8';
  genre_id: number; // 113;
  genres: {
    data: DeezerGenreType[];
  };
  label: string; // 'Parlophone (France)';
  nb_tracks: number; // 14;
  duration: number; // 3660;
  fans: number; // 234778;
  rating: number; // 0;
  release_date: string; // '2001-03-07';
  record_type: string; // 'album';
  available: boolean;
  tracklist: string; // 'https://api.deezer.com/album/302127/tracks';
  explicit_lyrics: boolean;
  explicit_content_lyrics: number; // 7;
  explicit_content_cover: number; // 0;
  contributors: DeezerContributorsType[];
  artist: DeezerArtistType;
  type: 'album';
  tracks: {
    data: DeezerAlbumTracksType[];
  };
}
