export interface DeezerGenreType {
  id: number; // 113;
  name: string; // 'Dance';
  picture: string; // 'https://api.deezer.com/genre/113/image';
  type: 'genre';
}

export interface DeezerContributorsType {
  id: number; // 27;
  name: string; // 'Daft Punk';
  link: string; // 'https://www.deezer.com/artist/27';
  share: string; // 'https://www.deezer.com/artist/27?utm_source=deezer&utm_content=artist-27&utm_term=0_1619266129&utm_medium=web';
  picture: string; // 'https://api.deezer.com/artist/27/image';
  picture_small: string; // 'https://cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/56x56-000000-80-0-0.jpg';
  picture_medium: string; // 'https://cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/250x250-000000-80-0-0.jpg';
  picture_big: string; // 'https://cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/500x500-000000-80-0-0.jpg';
  picture_xl: string; // 'https://cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/1000x1000-000000-80-0-0.jpg';
  radio: boolean;
  tracklist: string; // 'https://api.deezer.com/artist/27/top?limit=50';
  type: string; // 'artist';
  role: string; // 'Main';
}

export interface DeezerArtistType {
  id: string; // '27';
  name: string; // 'Daft Punk';
  link: string; // 'https://www.deezer.com/artist/27';
  share: string; // 'https://www.deezer.com/artist/27?utm_source=deezer&utm_content=artist-27&utm_term=0_1619266129&utm_medium=web';
  picture: string; // 'https://api.deezer.com/artist/27/image';
  picture_small: string; // 'https://cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/56x56-000000-80-0-0.jpg';
  picture_medium: string; // 'https://cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/250x250-000000-80-0-0.jpg';
  picture_big: string; // 'https://cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/500x500-000000-80-0-0.jpg';
  picture_xl: string; // 'https://cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/1000x1000-000000-80-0-0.jpg';
  radio: boolean;
  tracklist: string; // 'https://api.deezer.com/artist/27/top?limit=50';
  type: 'artist';
}
