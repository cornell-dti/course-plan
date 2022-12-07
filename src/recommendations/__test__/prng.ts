
/**
 * A seeded random number generator
 * 
 * @param seed the seed of the prng
 * @returns a random number generator seeded with `seed`
 */
const mulberry32 = (seed: number) => {
  let mutableSeed = seed;
  return () => {
    mutableSeed += 0x6d2b79f5;
    /* eslint-disable no-bitwise */
    let rand = Math.imul(mutableSeed ^ (mutableSeed >>> 15), mutableSeed | 1);
    rand ^= rand + Math.imul(rand ^ (rand >>> 7), rand | 61);
    return ((rand ^ (rand >>> 14)) >>> 0) / 4294967296;
  };
};

export default mulberry32;
