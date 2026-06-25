import type { GenerationParams, SongsResponse } from '../types';
import api from './client';

export const getSongs = async (params: GenerationParams, page: number) => {
  const { data } = await api.get<SongsResponse>('/songs', {
    params: {
      page,
      seed: params.seed === '' ? '0' : params.seed,
      lang: params.lang,
      likes: params.likes,
    },
  });
  return data;
};
