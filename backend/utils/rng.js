import seedrandom from 'seedrandom';

const PAGES_PER_SEED = 10000;

export const createRand = (seed) => seedrandom(String(seed));

export const combinedSeed = (userSeed, page) => Number(userSeed) * PAGES_PER_SEED + page;
