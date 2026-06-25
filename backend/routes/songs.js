import Router from 'express';
import { generateSongs } from '../utils/generateSongs.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { page = 1, seed = 0, lang = 'en', likes = 0 } = req.query;
    const result = generateSongs({ page, seed, lang, likes });
    res.json(result);
  } catch (err) {
    console.error(`Request has error: ${err}`);
    res.status(500).json({ error: 'Failed to generate songs' });
  }
});

export default router;
