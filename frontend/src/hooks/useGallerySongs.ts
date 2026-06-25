import { useCallback, useEffect, useState } from 'react';
import { getSongs } from '../api/songsApi';
import type { GenerationParams, Song } from '../types';

const INITIAL_PAGES = 3;

interface Props {
  params: GenerationParams;
  onError: () => void;
}

export const useGallerySongs = ({ params, onError }: Props) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(0);

  const coreKey = `${params.lang}|${params.seed}|${params.likes}`;
  const [prevCore, setPrevCore] = useState(coreKey);
  if (prevCore !== coreKey) {
    setPrevCore(coreKey);
    setPage(0);
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    if (page !== 0) return;
    const requests = Array.from({ length: INITIAL_PAGES }, (_, i) => getSongs(params, i + 1));
    Promise.all(requests)
      .then((res) => {
        setSongs(res.flatMap((el) => el.songs));
        setPage(INITIAL_PAGES);
      })
      .catch(onError);
  }, [page, params, onError]);

  const loadMore = useCallback(async () => {
    const next = page + 1;
    try {
      const res = await getSongs(params, next);
      setSongs((prev) => [...prev, ...res.songs]);
      setPage(next);
    } catch {
      onError();
    }
  }, [params, page, onError]);

  return { songs, loadMore };
};
