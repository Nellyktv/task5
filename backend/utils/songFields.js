const MAX_LIKES = 10;
const SINGLE_CHANCE = 0.3;

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export const makeTitle = (faker, data) => {
  const adj = faker.helpers.arrayElement(data.adjectives);
  const noun = faker.helpers.arrayElement(data.nouns);
  const variant = faker.number.int({ min: 0, max: 3 });
  switch (variant) {
    case 0:
      return `${capitalize(adj)} ${capitalize(noun)}`;
    case 1:
      return capitalize(noun);
    case 2:
      return `${capitalize(noun)} & ${capitalize(faker.helpers.arrayElement(data.nouns))}`;
    default:
      return `${capitalize(adj)} ${capitalize(faker.helpers.arrayElement(data.adjectives))} ${capitalize(noun)}`;
  }
};

export const makeArtist = (faker, data) => {
  const usePerson = faker.datatype.boolean();
  if (usePerson) return faker.person.fullName();

  const noun = faker.helpers.arrayElement(data.nouns);
  const variant = faker.number.int({ min: 0, max: 2 });
  switch (variant) {
    case 0:
      return `${capitalize(faker.helpers.arrayElement(data.adjectives))} ${capitalize(noun)}`;
    case 1:
      return `${capitalize(noun)} ${faker.helpers.arrayElement(data.bandSuffixes)}`;
    default:
      return `${capitalize(noun)}`;
  }
};

export const makeAlbum = (faker, data, singleLabel) => {
  if (faker.number.float({ min: 0, max: 1 }) < SINGLE_CHANCE) return singleLabel;
  const variant = faker.number.int({ min: 0, max: 1 });
  if (variant === 0) return capitalize(faker.helpers.arrayElement(data.nouns));
  return `${capitalize(faker.helpers.arrayElement(data.adjectives))} ${capitalize(faker.helpers.arrayElement(data.nouns))}`;
};

export const makeReview = (faker, data) => {
  const opener = faker.helpers.arrayElement(data.reviewOpeners);
  const body = faker.helpers.arrayElement(data.reviewBodies);
  const others = data.reviewBodies.filter((b) => b !== body);
  const extra = others.length && faker.datatype.boolean()
    ? ' ' + faker.helpers.arrayElement(others)
    : '';
  return `${opener} ${body}${extra}`;
};

export const makeLikes = (faker, avgLikes) => {
  const base = Math.floor(avgLikes);
  const frac = avgLikes - base;
  const extra = faker.number.float({ min: 0, max: 1 }) < frac ? 1 : 0;
  return Math.min(MAX_LIKES, base + extra);
};
