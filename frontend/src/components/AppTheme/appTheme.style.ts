import { createTheme } from '@mui/material';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f5f6fa', paper: '#ffffff' },
    primary: { main: '#7c4dff' },
    secondary: { main: '#00e5ff' },
    divider: 'rgba(0,0,0,0.12)',
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Inter, Roboto, system-ui, sans-serif' },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#121212', paper: '#1e1e1e' },
    primary: { main: '#7c4dff' },
    secondary: { main: '#00e5ff' },
    divider: 'rgba(255,255,255,0.1)',
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Inter, Roboto, system-ui, sans-serif' },
});