export type Locale = 'en' | 'de' | 'ru';

export type ViewMode = 'table' | 'gallery';

export interface Song {
  index: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
  coverSeed: number;
  audioSeed: number;
  duration: number;
  review: string;
}

export interface SongsResponse {
  page: number;
  pageSize: number;
  lang: Locale;
  seed: string;
  likes: number;
  songs: Song[];
}

export interface GenerationParams {
  lang: Locale;
  seed: string;
  likes: number;
}
