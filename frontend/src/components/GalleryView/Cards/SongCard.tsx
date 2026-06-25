import { Box, Card, CardContent, Chip, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { usePlayerStore, toTrack } from '../../../store/usePlayerStore';
import type { Song } from '../../../types';
import { AlbumCover } from '../../AlbumCover/AlbumCover';
import styles from '../GalleryView.module.scss';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toggleStyle } from '../GalleryStyles';

interface Props {
  song: Song;
}

export const SongCard = ({ song }: Props) => {
  const activeSeed = usePlayerStore((s) => s.activeSeed);
  const playing = usePlayerStore((s) => s.playing);
  const loading = usePlayerStore((s) => s.loading);
  const toggle = usePlayerStore((s) => s.toggle);
  const isActive = activeSeed === song.audioSeed;
  const isPlaying = isActive && playing;
  const isLoading = isActive && loading;
  const track = toTrack(song);

  const handleToggle = () => {
    toggle(song.audioSeed, track);
  };

  return (
    <Card className={styles.card} elevation={0}>
      <Box className={styles.cover}>
        <AlbumCover seed={song.coverSeed} title={song.title} artist={song.artist} size={300} fluid />
        <IconButton
          className={`${styles.playBtn} ${isPlaying || isLoading ? styles.playBtnActive : ''}`}
          onClick={handleToggle}
          disabled={isLoading}
          sx={toggleStyle}
        >
          {isLoading ? <CircularProgress size={24} color='inherit' /> : isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
        </IconButton>
      </Box>
      <CardContent>
        <Typography variant='subtitle2' noWrap>
          {song.index}. {song.title}
        </Typography>
        <Typography variant='body2' color='text.secondary' noWrap>
          {song.artist}
        </Typography>
        <Stack direction='row' spacing={1} sx={{ mt: 1, alignItems: 'center' }}>
          <Chip label={song.genre} size='small' variant='outlined' />
          <Chip
            icon={<FavoriteIcon />}
            label={song.likes}
            size='small'
            color='error'
            variant='outlined'
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
