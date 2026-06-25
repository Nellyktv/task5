import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import songsRouter from './routes/songs.js';
import coversRouter from './routes/covers.js';
import audioRouter from './routes/audio.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/songs', songsRouter);
app.use('/api/covers', coversRouter);
app.use('/api/audio', audioRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
