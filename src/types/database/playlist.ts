export interface PlaylistType {
  id: string; // '4523119944';
  title: string; // 'wtf playlist ';
  description: string; // '';
  duration: number; // 18;
  public: boolean;
  collaborative: boolean;
  nb_tracks: number; // 3;
  checksum: string; // 'c185d123834444e3c8869e235dd6f0a6';
  md5_image: string; // 'e206dafb59a3d378d7ffacc989bc4e35';
  picture_type: string; // 'cover';
  creator: {
    id: string; // '2064440442';
    name: string; // 'sayem314';
    type: string; // 'user';
  };
  tracks: string[];
  created_at: string;
  playlist_path: string;
  type: 'playlist';
}
