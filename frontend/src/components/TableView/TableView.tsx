import { useState } from 'react';
import {
  Box,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { GenerationParams } from '../../types';
import { useSongs } from '../../hooks/useSongs';
import styles from './TableView.module.scss';
import { containerSx, headCellSx, headCellWidthSx, paginationBoxSx } from './TableView.style';
import { dataOfNameTable } from './dataOfNameTable';
import { SongRow } from './SongRow/SongRow';

interface Props {
  params: GenerationParams;
  onError: () => void;
}

export const TableView = ({ params, onError }: Props) => {
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const coreKey = `${params.lang}|${params.seed}|${params.likes}`;
  const [prevCore, setPrevCore] = useState(coreKey);
  if (prevCore !== coreKey) {
    setPrevCore(coreKey);
    setPage(1);
    setMaxPage(1);
  }

  const { songs, pageSize, loading } = useSongs({ params, page, onError });

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const hasNextPage = songs.length >= pageSize;
  const knownMax = hasNextPage ? page + 1 : page;
  if (knownMax > maxPage) setMaxPage(knownMax);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer className={styles.container} sx={containerSx}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              {dataOfNameTable.map((el) => (
                <TableCell
                  key={el.key}
                  align={el.align}
                  sx={headCellWidthSx(el.width, el.hide)}
                >
                  {el.label}
                </TableCell>
              ))}
              <TableCell sx={{ ...headCellSx, width: '56px' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {songs.map((el) => (
              <SongRow key={el.index} song={el} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {songs.length > 0 && (
        <Box sx={paginationBoxSx}>
          <Pagination
            count={maxPage}
            page={page}
            onChange={handlePageChange}
            color='primary'
            boundaryCount={2}
            siblingCount={1}
          />
        </Box>
      )}
    </Box>
  );
};
