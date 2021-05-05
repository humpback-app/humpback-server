interface ReleaseGroupsType {
  id: string;
  releases: Array<{
    id: string;
    mediums: Array<{
      format: string | null;
      position: number | null;
      track_count: number | null;
      tracks: Array<{
        artists: Array<{
          id: string;
          name: string;
        }>;
        id: string;
        position: number | null;
        title: string;
      }>;
    }>;
  }>;
}

export interface FingerprintResultsType {
  id: string;
  recordings?: Array<{
    id?: string;
    releasegroups?: Array<ReleaseGroupsType>;
    sources?: number;
  }>;
  score: number;
}

export interface FingerprintType {
  results: Array<FingerprintResultsType>;
  status: string;
}

export interface MusicbrainzRecordingType {
  disambiguation?: string;
  id: string;
  isrcs: string[];
  video: boolean;
  length: number;
  'first-release-date': string;
  title: string;
}
