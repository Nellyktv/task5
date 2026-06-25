import { fakerRU, fakerEN, fakerDE } from '@faker-js/faker';
import { combinedSeed } from './rng.js';
import { getLocaleData } from './locales.js';
import { previewDuration } from './musicEngine.js';
import { makeTitle, makeArtist, makeAlbum, makeReview, makeLikes } from './songFields.js';

const PAGE_SIZE = 20;
const MAX_SEED = 99999999;
const MAX_LIKES = 10;

const fakerByLang = { en: fakerEN, de: fakerDE, ru: fakerRU };

export const generateSongs = ({ page = 1, seed = 0, lang = 'en', likes = 0 }) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const avgLikes = Math.min(MAX_LIKES, Math.max(0, Number(likes) || 0));
  const faker = fakerByLang[lang] || fakerEN;
  const data = getLocaleData(lang);
  const singleLabel = data.single;

  faker.seed(combinedSeed(seed, pageNum));

  const songs = [];
  for (let i = 0; i < PAGE_SIZE; i++) {
    const index = (pageNum - 1) * PAGE_SIZE + i + 1;

    const title = makeTitle(faker, data);
    const artist = makeArtist(faker, data);
    const album = makeAlbum(faker, data, singleLabel);
    const genre = faker.helpers.arrayElement(data.genres);
    const review = makeReview(faker, data);

    const coverSeed = faker.number.int({ min: 0, max: MAX_SEED });
    const audioSeed = faker.number.int({ min: 0, max: MAX_SEED });

    songs.push({
      index,
      title,
      artist,
      album,
      genre,
      likes: makeLikes(faker, avgLikes),
      coverSeed,
      audioSeed,
      duration: previewDuration(audioSeed),
      review,
    });
  }

  return {
    page: pageNum,
    pageSize: PAGE_SIZE,
    lang,
    seed: String(seed),
    likes: avgLikes,
    songs,
  };
};
