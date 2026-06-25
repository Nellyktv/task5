import {
  AppBar, Toolbar, Stack, Select, type SelectChangeEvent, MenuItem, TextField,
  InputAdornment, IconButton, Slider, Typography, ToggleButtonGroup, ToggleButton,
  Paper, Box, Tooltip,
} from '@mui/material';
import {
  Autorenew as AutorenewIcon, FavoriteBorder as FavoriteBorderIcon,
  ViewList as ViewListIcon, GridView as GridViewIcon, MusicNote as MusicNoteIcon,
  Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import type { GenerationParams, Locale, ViewMode } from '../../types';
import styles from './ToolbarPanel.module.scss';
import { toolbarPanelSx, mutedTextSx } from './ToolbarPanel.style';
import { languages, translations } from './toolbatPanelData';
import { useAppStore } from '../../store/useAppStore';
import { randomSeed } from '../../lib/rng';

interface Props {
  params: GenerationParams;
  onParamsChange: (params: GenerationParams) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ToolbarPanel = ({ params, onParamsChange, view, onViewChange }: Props) => {
  const mode = useAppStore((s) => s.mode);
  const onToggleMode = useAppStore((s) => s.toggleMode);
  const t = translations[params.lang];
  const dark = mode === 'dark';

  const handleLanguage = (e: SelectChangeEvent) => {
    onParamsChange({ ...params, lang: e.target.value as Locale });
  };

  const handleSeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbersOnly = e.target.value.replace(/\D/g, '');
    onParamsChange({ ...params, seed: numbersOnly });
  };

  const handleRandomSeed = () => {
    onParamsChange({ ...params, seed: randomSeed() });
  };

  const handleLikes = (_e: Event, value: number | number[]) => {
    onParamsChange({ ...params, likes: value as number });
  };

  const handleView = (_e: React.MouseEvent<HTMLElement>, next: ViewMode | null) => {
    if (next) onViewChange(next);
  };

  return (
    <AppBar position='sticky' color='transparent' elevation={0}>
      <Toolbar disableGutters sx={{ px: 2 }}>
        <Paper className={styles.panel} sx={toolbarPanelSx(dark)}>
          <Tooltip title={t.theme}>
            <IconButton
              onClick={onToggleMode}
              color='inherit'
              sx={{ position: 'absolute', top: 12, right: 12 }}
            >
              {dark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          <Box className={styles.brand}>
            <Box className={styles.logo}>
              <MusicNoteIcon />
            </Box>
            <Box>
              <Typography className={styles.title}>
                Music Store
              </Typography>
              <Typography className={styles.subtitle} sx={mutedTextSx(dark)}>
                {t.subtitle}
              </Typography>
            </Box>
          </Box>

          <Stack
            className={styles.controls}
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ alignItems: 'center' }}
          >
            <Select size='small' value={params.lang} onChange={handleLanguage}>
              {languages.map((el) => (
                <MenuItem key={el.id} value={el.value}>
                  {el.label}
                </MenuItem>
              ))}
            </Select>

            <TextField
              size='small'
              label={t.seed}
              value={params.seed}
              onChange={handleSeed}
              sx={{ minWidth: 200 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Tooltip title={t.random}>
                        <IconButton edge='end' onClick={handleRandomSeed}>
                          <AutorenewIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Stack
              className={styles.likes}
              direction='row'
              spacing={1.5}
              sx={{ alignItems: 'center', flexGrow: 1, minWidth: 200 }}
            >
              <FavoriteBorderIcon fontSize='small' />
              <Typography variant='body2' className={styles.likesLabel} sx={mutedTextSx(dark)}>
                {t.likes}
              </Typography>
              <Slider
                min={0}
                max={10}
                step={0.1}
                value={params.likes}
                onChange={handleLikes}
              />
              <span className={styles.likesBadge}>{params.likes.toFixed(1)}</span>
            </Stack>

            <ToggleButtonGroup
              size='small'
              exclusive
              value={view}
              onChange={handleView}
            >
              <ToggleButton value='table'>
                <ViewListIcon fontSize='small' sx={{ mr: 0.5 }} /> {t.table}
              </ToggleButton>
              <ToggleButton value='gallery'>
                <GridViewIcon fontSize='small' sx={{ mr: 0.5 }} /> {t.gallery}
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Paper>
      </Toolbar>
    </AppBar>
  );
};
