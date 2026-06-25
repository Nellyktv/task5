import { API_BASE } from '../../api/client';

type Props = {
  seed: number;
  title: string;
  artist: string;
  size: number;
  fluid?: boolean;
};


export const AlbumCover = ({ seed, title, artist, size = 320, fluid = false }: Props) => {
  const src = `${API_BASE}/covers?seed=${seed}&title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;

  return (
    <img
      src={src}
      alt={`${title} — ${artist}`}
      width={fluid ? undefined : size}
      height={fluid ? undefined : size}
      style={
        fluid
          ? { width: '100%', aspectRatio: '1 / 1', height: 'auto', display: 'block' }
          : { width: size, height: size, borderRadius: 12, display: 'block' }
      }
    />
  );
};
