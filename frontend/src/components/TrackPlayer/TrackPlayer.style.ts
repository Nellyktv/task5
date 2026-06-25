
export const playButtonSx = {
  width: 48,
  height: 48,
  color: '#fff',
  background: 'linear-gradient(135deg, #7c4dff, #00e5ff)',
  '&:hover': { background: 'linear-gradient(135deg, #6f3fe6, #00cce6)' },
};

export const progressSliderSx = {
  color: 'primary.main',
  height: 4,
  '& .MuiSlider-thumb': {
    width: 8,
    height: 8,
    '&:hover, &.Mui-focusVisible': { boxShadow: 'none' },
    '&.Mui-active': { width: 16, height: 16 },
  },
  '& .MuiSlider-rail': { opacity: 0.28 },
};

export const tinyTextSx = {
  fontSize: '0.75rem',
  opacity: 0.6,
  fontWeight: 500,
};

export const timeLabelsRowSx = {
  display: 'flex',
  justifyContent: 'space-between',
  mt: -1,
};
