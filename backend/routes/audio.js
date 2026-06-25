import express from 'express';
import { generateScore } from '../utils/musicEngine.js';

const router = express.Router();

router.get('/:seed', (req, res) => {
  const seed = parseInt(req.params.seed, 10);
  if (isNaN(seed)) return res.status(400).json({ error: 'Invalid seed' });

  try {
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(generateScore(seed));
  } catch (e) {
    console.error('Score generation error:', e);
    res.status(500).json({ error: 'Score generation failed' });
  }
});

export default router;
