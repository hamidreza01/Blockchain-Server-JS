"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const DEFUALT_DIFFICULTY = 10;
const REWARD_TRANSACTION = {
    address: '**DPX Blockchain**'
};
const ROOT_URL = "127.0.0.1";
const REWARD = 10;
exports.config = {
    NODE_PORT: 8765,
    ADMIN: {
        httpIP: `http://${ROOT_URL}:${8765}`,
    },
    MINE_RATE: 1000 * 60 * 10,
    ROOT_URL,
    ROOT_PORT: 3001,
    GENESIS_DATA: {
        hash: "DEFAULT-DPX-GENESIS-HASH",
        lastHash: "DEFAULT-DPX-LAST-HASH",
        nonce: 0,
        difficulty: DEFUALT_DIFFICULTY,
        timestamp: 0,
        data: {},
    },
    DEFUALT_BALANCE: 0,
    REWARD_TRANSACTION,
    REWARD,
};
