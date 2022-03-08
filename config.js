const MINE_RATE = 10000;
const DIFFICULTY = 10;
const GENESIS_DATA = {
  hash: 'DEXhash',
  lastHash: 'dexLastHash',
  nonce: 0,
  difficulty: DIFFICULTY,
  timeStamp: '0',
  data: ['DEX-BlockChain'],
};
const ADMIN = {
  httpIP : `localhost:45451` 
}
module.exports = {
  GENESIS_DATA,
  MINE_RATE,
  ADMIN
};
