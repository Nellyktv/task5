import { useCallback, useState } from 'react';
import { Box, Container } from '@mui/material';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import { TableView } from '../TableView/TableView';
import { GalleryView } from '../GalleryView/GalleryView';
import { PlayerBar } from '../PlayerBar/PlayerBar';
import type { GenerationParams, ViewMode } from '../../types';

const errorScreenSx = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  px: 3,
  color: 'text.secondary',
};

const MainPage = () => {
  const [params, setParams] = useState<GenerationParams>({
    lang: 'en',
    seed: '1',
    likes: 3,
  });
  const [view, setView] = useState<ViewMode>('table');
  const [error, setError] = useState(false);
  const handleError = useCallback(() => setError(true), []);

  return (
    <>
      {error ? (
        <Box sx={errorScreenSx}>
          Sorry, the server is temporarily unavailable. Please try again later.
        </Box>
      ) : (
        <>
          <Box sx={{ minHeight: '100vh', pb: 12 }}>
            <ToolbarPanel
              params={params}
              onParamsChange={setParams}
              view={view}
              onViewChange={setView}
            />
            <Container maxWidth='lg' sx={{ mt: 3, px: { xs: 2, md: 4 } }}>
              {view === 'table' ? (
                <TableView params={params} onError={handleError} />
              ) : (
                <GalleryView params={params} onError={handleError} />
              )}
            </Container>
          </Box>
          <PlayerBar />
        </>
      )}
    </>
  );
};

export default MainPage;
