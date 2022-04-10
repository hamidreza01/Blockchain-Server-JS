const DEFUALT_DIFFICULTY = 3;
import { _Block } from "./Src/interfaces/Blockchain/_Block";
const ADMIN = {
  httpIP : `localhost:45451` 
}
export const config: {
  MINE_RATE: number;
  ADMIN : {},
  GENESIS_DATA: _Block;
  DEFUALT_BALANCE: number;
  ROOT_URL: string;
  ROOT_PORT: number;
} = {
  ADMIN,
  MINE_RATE: 1000,
  ROOT_URL: "127.0.0.1",
  ROOT_PORT: 3000,
  GENESIS_DATA: {
    hash: "DEXhash",
    lastHash: "dexLastHash",
    nonce: 0,
    difficulty: DEFUALT_DIFFICULTY,
    timestamp: 0,
    data: ["DEX-BlockChain"],
  },
  DEFUALT_BALANCE: 0,
};