import { useState } from 'react';
import { Box, CircularProgress, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import { usePlayerStore, toTrack } from '../../store/usePlayerStore';
import { formatTime } from '../../lib/formatTime';
import type { Song } from '../../types';
import { playButtonSx, progressSliderSx, timeLabelsRowSx, tinyTextSx } from './TrackPlayer.style';

interface Props {
  song: Song;
}

export const TrackPlayer = ({ song }: Props) => {
  const [scrub, setScrub] = useState<number | null>(null);
  const { activeSeed, playing, loading, position, duration, toggle, seek } = usePlayerStore();

  const seed = song.audioSeed;
  const track = toTrack(song);
  const isActive = activeSeed === seed;

  const dur = isActive && duration ? duration : song.duration;
  const pos = scrub !== null ? scrub : isActive ? position : 0;

  const handleToggle = () => {
    toggle(seed, track);
  };

  const handleScrub = (_: Event, value: number | number[]) => {
    setScrub(value as number);
  };

  const handleSeek = (_: Event | React.SyntheticEvent, value: number | number[]) => {
    setScrub(null);
    seek(seed, value as number, track);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <IconButton onClick={handleToggle} sx={playButtonSx} disabled={isActive && loading}>
        {isActive && loading ? (
          <CircularProgress size={24} color='inherit' />
        ) : isActive && playing ? (
          <PauseRounded sx={{ fontSize: 30 }} />
        ) : (
          <PlayArrowRounded sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      <Box sx={{ flexGrow: 1 }}>
        <Slider
          size='small'
          value={pos}
          max={dur || 1}
          step={0.1}
          onChange={handleScrub}
          onChangeCommitted={handleSeek}
          sx={progressSliderSx}
        />
        <Box sx={timeLabelsRowSx}>
          <Typography sx={tinyTextSx}>{formatTime(pos)}</Typography>
          <Typography sx={tinyTextSx}>-{formatTime(Math.max(0, dur - pos))}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
