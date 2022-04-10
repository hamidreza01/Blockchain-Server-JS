"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const DEFUALT_DIFFICULTY = 3;
const ADMIN = {
    httpIP: `localhost:45451`
};
exports.config = {
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
