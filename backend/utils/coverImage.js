import { createCanvas } from '@napi-rs/canvas';
import { createRand } from './rng.js';

const SIZE = 600;

const TEXT_LEFT = 42;
const TITLE_FONT = 'bold 54px Arial';
const ARTIST_FONT = '500 30px Arial';
const TITLE_BASELINE = 492;
const ARTIST_BASELINE = 558;
const LINE_HEIGHT = 60;
const TITLE_MAX_WIDTH = 516;
const SCRIM_START = 300;

const PALETTES = [
  ['#ff6b6b', '#ffd93d', '#1a1a2e', '#f8f9fa'],
  ['#08d9d6', '#252a34', '#ff2e63', '#eaeaea'],
  ['#2d4059', '#ea5455', '#f07b3f', '#ffd460'],
  ['#0f3460', '#16213e', '#e94560', '#f5f5f5'],
  ['#355c7d', '#6c5b7b', '#c06c84', '#f67280'],
  ['#5f0f40', '#9a031e', '#fb8b24', '#e36414'],
];

const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];
const randomInt = (rand, min, max) => min + Math.floor(rand() * (max - min + 1));
const randomFloat = (rand, min, max) => min + rand() * (max - min);

const brightness = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r + g + b;
};

const darkestColor = (palette) => {
  let darkest = palette[0];
  for (const hex of palette) {
    if (brightness(hex) < brightness(darkest)) darkest = hex;
  }
  return darkest;
};

const drawRings = (ctx, rand, palette) => {
  const centerX = randomFloat(rand, 180, 420);
  const centerY = randomFloat(rand, 180, 420);
  const count = randomInt(rand, 6, 10);
  const step = 372 / count;
  for (let i = count; i > 0; i--) {
    ctx.fillStyle = palette[i % palette.length];
    ctx.beginPath();
    ctx.arc(centerX, centerY, step * i, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawBands = (ctx, rand, palette) => {
  ctx.save();
  ctx.translate(SIZE / 2, SIZE / 2);
  ctx.rotate(randomFloat(rand, -0.6, 0.6));
  const count = randomInt(rand, 4, 7);
  const bandWidth = (SIZE * 2) / count;
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = pick(rand, palette);
    ctx.fillRect(-SIZE + i * bandWidth, -SIZE, bandWidth + 1, SIZE * 2);
  }
  ctx.restore();
};

const drawShapes = (ctx, rand, palette) => {
  const columns = randomInt(rand, 3, 4);
  const cellSize = SIZE / columns;
  for (let row = 0; row < columns; row++) {
    for (let col = 0; col < columns; col++) {
      if (rand() < 0.5) {
        ctx.fillStyle = pick(rand, palette);
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
  ctx.fillStyle = pick(rand, palette);
  ctx.beginPath();
  ctx.arc(randomFloat(rand, 180, 420), randomFloat(rand, 180, 420), 108, 0, Math.PI * 2);
  ctx.fill();
};

const splitIntoLines = (ctx, text, maxWidth) => {
  const words = String(text).split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.slice(0, 2);
};

const drawText = (ctx, title, artist) => {
  const scrim = ctx.createLinearGradient(0, SCRIM_START, 0, SIZE);
  scrim.addColorStop(0, 'rgba(0, 0, 0, 0)');
  scrim.addColorStop(1, 'rgba(0, 0, 0, 0.88)');
  ctx.fillStyle = scrim;
  ctx.fillRect(0, SCRIM_START, SIZE, SIZE - SCRIM_START);

  ctx.fillStyle = '#ffffff';
  ctx.font = TITLE_FONT;
  const titleLines = splitIntoLines(ctx, title, TITLE_MAX_WIDTH);
  let y = TITLE_BASELINE - (titleLines.length - 1) * LINE_HEIGHT;
  for (const line of titleLines) {
    ctx.fillText(line, TEXT_LEFT, y);
    y += LINE_HEIGHT;
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.font = ARTIST_FONT;
  ctx.fillText(String(artist), TEXT_LEFT, ARTIST_BASELINE);
};

export const renderCover = async (seed, title, artist) => {
  const rand = createRand(seed);
  const palette = pick(rand, PALETTES);

  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = darkestColor(palette);
  ctx.fillRect(0, 0, SIZE, SIZE);

  const style = randomInt(rand, 0, 2);
  switch (style) {
    case 0:
      drawRings(ctx, rand, palette);
      break;
    case 1:
      drawBands(ctx, rand, palette);
      break;
    default:
      drawShapes(ctx, rand, palette);
  }

  drawText(ctx, title, artist);

  return canvas.toBuffer('image/png');
};
