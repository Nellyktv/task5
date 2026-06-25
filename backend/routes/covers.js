import Router from 'express';
import { renderCover } from '../utils/coverImage.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { seed = 0, title = '', artist = '' } = req.query;
    const png = await renderCover(seed, title, artist);
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(png);
  } catch (err) {
    console.error(`Request has error: ${err}`);
    res.status(500).json({ error: 'Failed to generate cover' });
  }
});

export default router;
