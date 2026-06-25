import { type ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './appTheme.style';
import { useAppStore } from '../../store/useAppStore';

type AppThemeProps = { children: ReactNode };

export const AppTheme = ({ children }: AppThemeProps) => {
  const mode = useAppStore((s) => s.mode);
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppTheme;