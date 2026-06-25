type DataTable = {
  key: string;
  label: string;
  align?: 'right';
  hide?: boolean;
  width: string;
};

export const dataOfNameTable: DataTable[] = [
  { key: 'index', label: '#', width: '56px' },
  { key: 'title', label: 'Title', width: '34%' },
  { key: 'artist', label: 'Artist', width: '18%' },
  { key: 'album', label: 'Album', hide: true, width: '18%' },
  { key: 'genre', label: 'Genre', hide: true, width: '14%' },
  { key: 'likes', label: 'Likes', align: 'right', width: '90px' },
];
