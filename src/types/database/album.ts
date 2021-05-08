import type {GenreType, ContributorsType, ArtistTypeMinimal} from './common.js';

export interface AlbumType {
  id: string; // '302127';
  title: string; // 'Discovery';
  upc: string; // '724384960650';
  md5_image: string; // '2e018122cb56986277102d2041a592c8';
  genre_id: string; // '113';
  genres: GenreType[];
  label: string; // 'Parlophone (France)';
  nb_tracks: number; // 14;
  duration: number; // 3660;
  release_date: string; // '2001-03-07';
  record_type: string; // 'album';
  /**
   * Boolean indicating if album is available
   */
  available: boolean;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number; // 7;
  explicit_content_cover: number; // 0;
  contributors: ContributorsType[];
  artist: ArtistTypeMinimal;
  tracks: string[];
  created_at: string;
  type: 'album';
}
