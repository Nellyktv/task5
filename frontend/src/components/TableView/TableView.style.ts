export const tableRow = (open: boolean) => ({
    cursor: 'pointer',
    bgcolor: open ? 'action.selected' : 'transparent',
    '&:hover': { bgcolor: open ? 'action.selected' : 'action.hover' },
    '& > *': { borderBottom: 'unset' },
});

export const headCellSx = {
    color: 'text.secondary',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    borderColor: 'divider',
};

export const bodyCellSx = {
    borderColor: 'divider',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};
export const hideOnMobile = { display: { xs: 'none', md: 'table-cell' } };

export const hiddenCellSx = { borderColor: 'divider', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: { xs: 'none', md: 'table-cell' } };

export const likesBox = { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 };

export const headCellWidthSx = (width: string, hide?: boolean) => ({
  ...headCellSx,
  ...(hide ? hideOnMobile : {}),
  width,
});

export const containerSx = { bgcolor: 'background.paper', border: 1, borderColor: 'divider' };

export const paginationBoxSx = { display: 'flex', justifyContent: 'center', mt: 3 };