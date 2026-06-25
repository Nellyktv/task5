import { useState } from 'react';
import { Box, Chip, Collapse, IconButton, TableCell, TableRow } from '@mui/material';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { bodyCellSx, hiddenCellSx, likesBox, tableRow } from '../TableView.style';
import { AlbumCover } from '../../AlbumCover/AlbumCover';
import { SongDetails } from '../../SongDetails/SongDetails';
import type { Song } from '../../../types';
import styles from '../TableView.module.scss';

interface Props {
  song: Song;
}

export const SongRow = ({ song }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        onClick={() => setOpen(!open)}
        sx={tableRow(open)}
      >
        <TableCell sx={bodyCellSx}>{song.index}</TableCell>
        <TableCell sx={bodyCellSx}>
          <div className={styles.titleCell}>
            <div className={styles.thumb}>
              <AlbumCover seed={song.coverSeed} title={song.title} artist={song.artist} size={46} />
            </div>
            <span className={styles.trackTitle}>{song.title}</span>
          </div>
        </TableCell>
        <TableCell sx={bodyCellSx}>{song.artist}</TableCell>
        <TableCell sx={hiddenCellSx}>{song.album}</TableCell>
        <TableCell sx={hiddenCellSx}>

          <Chip label={song.genre} size='small' variant='outlined' color='primary' />
        </TableCell>
        <TableCell align='right' sx={bodyCellSx}>
          <Box sx={likesBox}>
            <FavoriteBorderIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <span className={styles.likes}>{song.likes}</span>
          </Box>
        </TableCell>
        <TableCell align='right' sx={bodyCellSx}>
          <IconButton size='small'>
            <KeyboardArrowDown
              sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }}
            />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} sx={{ py: 0, border: 0 }}>
          <Collapse in={open} unmountOnExit>
            <SongDetails song={song} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
