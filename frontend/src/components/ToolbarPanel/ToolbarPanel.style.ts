export const toolbarPanelSx = (dark: boolean) => ({
  position: 'relative',
  width: '100%',
  bgcolor: dark ? '#1e1e1e' : '#ffffff',
  color: dark ? '#fff' : '#1a1a1a',
  borderColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
});

export const mutedTextSx = (dark: boolean) => ({
  color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
});
