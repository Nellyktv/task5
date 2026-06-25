import { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { API_BASE } from '../../api/client';
import { coverBoxSx, spinnerOverlaySx } from './AlbumCover.style';
import styles from './AlbumCover.module.scss';

type Props = {
  seed: number;
  title: string;
  artist: string;
  size: number;
  fluid?: boolean;
};

export const AlbumCover = ({ seed, title, artist, size = 320, fluid = false }: Props) => {
  const src = `${API_BASE}/covers?seed=${seed}&title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;
  const [loaded, setLoaded] = useState(false);

  return (
    <Box sx={coverBoxSx(fluid, size)}>
      {!loaded && (
        <Box sx={spinnerOverlaySx}>
          <CircularProgress size={size > 120 ? 32 : 18} />
        </Box>
      )}
      <img
        src={src}
        alt={`${title} — ${artist}`}
        onLoad={() => setLoaded(true)}
        className={`${styles.cover} ${loaded ? styles.coverLoaded : ''}`}
      />
    </Box>
  );
};
