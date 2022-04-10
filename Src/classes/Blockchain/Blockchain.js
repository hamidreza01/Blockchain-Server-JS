"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
const hash_creator_1 = require("../../Addon/hash-creator");
const Block_1 = require("./Block");
class Blockchain {
    
    chain = [Block_1.Block.genesis()];
    addBlock(data) {
        const block = Block_1.Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
    }
    static isValid(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block_1.Block.genesis()))
            return false;
        for (let i = 1; i < chain.length; i++) {
            if (chain[i].hash !==
                (0, hash_creator_1.hashCreator)(chain[i].lastHash, JSON.stringify(chain[i].data), chain[i].nonce.toString(), chain[i].difficulty.toString(), chain[i].timestamp.toString())) {
                return false;
            }
            if (chain[i].lastHash !== chain[i - 1].hash) {
                return false;
            }
            if (Math.abs(chain[i - 1].difficulty - chain[i].difficulty) > 1) {
                return false;
            }
        }
        return true;
    }
    replaceChain(chain) {
        if (chain?.length < this.chain.length) {
            return { message: "chain is short", code: 101 };
        }
        if (!Blockchain.isValid(chain)) {
            return { message: "chain is not valid", code: 102 };
        }
        this.chain = chain;
        return true;
    }
}
exports.Blockchain = Blockchain;
