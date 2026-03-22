const NUM_BGS = 13;
const RAND_BG_NUM = Math.floor(Math.random() * NUM_BGS) + 1;
const RAND_BG_URL = `bg/bg${RAND_BG_NUM}.jpg`;

export const BG_STYLE = {
  backgroundImage: `url(${RAND_BG_URL})`,
};
