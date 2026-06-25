import { Box, Chip, Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AlbumCover } from '../AlbumCover/AlbumCover';
import { TrackPlayer } from '../TrackPlayer/TrackPlayer';
import type { Song } from '../../types';
import styles from './SongDetails.module.scss';

interface Props {
  song: Song;
}

export const SongDetails = ({ song }: Props) => {
  return (
    <Box className={styles.details} sx={{ bgcolor: 'action.hover', color: 'text.primary' }}>
      <AlbumCover seed={song.coverSeed} title={song.title} artist={song.artist} size={200} />
      <div className={styles.info}>
        <div className={styles.title}>{song.title}</div>
        <div className={styles.artist}>{song.artist}</div>
        <Stack direction='row' spacing={1} sx={{ mb: 2 }}>
          <Chip label={song.album} size='small' />
          <Chip label={song.genre} size='small' variant='outlined' />
          <Chip
            icon={<FavoriteIcon />}
            label={song.likes}
            size='small'
            color='error'
            variant='outlined'
          />
        </Stack>
        <TrackPlayer song={song} />
        <div className={styles.reviewLabel}>Review</div>
        <div className={styles.reviewText}>{song.review}</div>
      </div>
    </Box>
  );
}
