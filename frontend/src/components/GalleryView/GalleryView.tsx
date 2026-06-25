import InfiniteScroll from 'react-infinite-scroll-component';
import { Box } from '@mui/material';
import type { GenerationParams } from '../../types';
import { useGallerySongs } from '../../hooks/useGallerySongs';
import styles from './GalleryView.module.scss';
import { SongCard } from './Cards/SongCard';

interface Props {
  params: GenerationParams;
  onError: () => void;
}

export const GalleryView = ({ params, onError }: Props) => {
  const { songs, loadMore } = useGallerySongs({ params, onError });

  return (
    <InfiniteScroll
      dataLength={songs.length}
      next={loadMore}
      hasMore={true}
      loader={<Box sx={{ textAlign: 'center', py: 2 }}>Loading…</Box>}
    >
      <div className={styles.grid}>
        {songs.map((el) => (
          <SongCard key={el.index} song={el} />
        ))}
      </div>
    </InfiniteScroll>
  );
};
