"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const sign_1 = require("../../Addon/sign");
const config_1 = require("../../../config");
const hash_creator_1 = require("../../Addon/hash-creator");
class Wallet {
    balance = config_1.config.DEFUALT_BALANCE;
    keyPair = sign_1.ec.genKeyPair();
    publicKey = this.keyPair.getPublic().encode('hex');
    sign(data) {
        return this.keyPair.sign((0, hash_creator_1.hashCreator)(JSON.stringify(data)));
    }
}
exports.Wallet = Wallet;
