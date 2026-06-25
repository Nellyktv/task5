export const randomSeed = (): string => {
  const buf = new BigUint64Array(1);
  crypto.getRandomValues(buf);
  return buf[0].toString();
};
