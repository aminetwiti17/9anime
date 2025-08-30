export interface EpisodeSource {
  url: string;
  quality?: string;
  server?: string;
}

export interface EpisodeData {
  id: string;
  number: number;
  title: string;
  description: string;
  thumbnail?: string;
  airDate?: string;
  status?: string;
  sources: EpisodeSource[];
}

export interface AnimeEpisodeData {
  animeId: string;
  animeTitle: string;
  episodes: EpisodeData[];
}