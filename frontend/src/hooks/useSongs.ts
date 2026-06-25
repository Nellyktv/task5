import { useEffect, useState } from 'react';
import { getSongs } from '../api/songsApi';
import type { GenerationParams, Song } from '../types';

interface Props {
  params: GenerationParams;
  page: number;
  onError: () => void;
}

export const useSongs = ({ params, page, onError }: Props) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    getSongs(params, page)
      .then((res) => {
        setSongs(res.songs);
        setPageSize(res.pageSize);
      })
      .catch(onError);
  }, [params, page, onError]);

  return { songs, pageSize };
}
