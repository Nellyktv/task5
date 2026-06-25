export const coverBoxSx = (fluid: boolean, size: number) => ({
  position: 'relative',
  width: fluid ? '100%' : size,
  height: fluid ? 'auto' : size,
  aspectRatio: '1 / 1',
  flexShrink: 0,
  borderRadius: fluid ? 0 : '12px',
  overflow: 'hidden',
  bgcolor: 'action.hover',
});

export const spinnerOverlaySx = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
