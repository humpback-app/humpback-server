export interface GenreType {
  id: string; // '113';
  name: string; // 'Dance';
}

export interface ContributorsType {
  id: string; // '27';
  name: string; // 'Daft Punk';
  md5_image: string;
  radio: boolean;
  role: string; // 'Main';
  type: string; // 'artist';
}

export interface ArtistTypeMinimal {
  id: string; // '27';
  name: string; // 'Daft Punk';
  md5_image: string;
}

export interface ArtistType extends ArtistTypeMinimal {
  radio: boolean;
}
