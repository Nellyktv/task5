import { useState } from 'react';
import { Box, IconButton, Paper, Slider, Typography } from '@mui/material';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { usePlayerStore } from '../../store/usePlayerStore';
import { AlbumCover } from '../AlbumCover/AlbumCover';
import { formatTime } from '../../lib/formatTime';
import { playerBarSx, playButtonSx } from './PlayerBar.style';

export const PlayerBar = () => {

  const { activeTrack, playing, position, duration, toggle, seek, stop } = usePlayerStore();
  const [scrub, setScrub] = useState<number | null>(null);

  if (!activeTrack) return null;

  const dur = duration || 1;
  const pos = scrub !== null ? scrub : position;

  const handleToggle = () => {
    toggle(activeTrack.audioSeed, activeTrack);
  };

  const handleScrub = (_: Event, value: number | number[]) => {
    setScrub(value as number);
  };

  const handleSeek = (_: Event | React.SyntheticEvent, value: number | number[]) => {
    setScrub(null);
    seek(activeTrack.audioSeed, value as number, activeTrack);
  };

  return (
    <Paper elevation={8} sx={playerBarSx}>
      <AlbumCover seed={activeTrack.coverSeed} title={activeTrack.title} artist={activeTrack.artist} size={48} />

      <Box sx={{ minWidth: 0, width: { xs: 110, sm: 200 } }}>
        <Typography variant='subtitle2' noWrap>
          {activeTrack.title}
        </Typography>
        <Typography variant='body2' color='text.secondary' noWrap>
          {activeTrack.artist}
        </Typography>
      </Box>

      <IconButton onClick={handleToggle} sx={playButtonSx}>
        {playing ? <PauseRounded /> : <PlayArrowRounded />}
      </IconButton>

      <Typography variant='caption' sx={{ color: 'text.secondary', width: 38, textAlign: 'right' }}>
        {formatTime(pos)}
      </Typography>

      <Slider
        size='small'
        value={pos}
        max={dur}
        step={0.1}
        onChange={handleScrub}
        onChangeCommitted={handleSeek}
        sx={{ flexGrow: 1 }}
      />

      <Typography variant='caption' sx={{ color: 'text.secondary', width: 38 }}>
        {formatTime(dur)}
      </Typography>

      <IconButton onClick={stop} size='small' sx={{ color: 'text.secondary' }}>
        <CloseRounded />
      </IconButton>
    </Paper>
  );
};
