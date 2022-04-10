"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const uniqid_1 = __importDefault(require("uniqid"));
const sign_1 = require("../../Addon/sign");
class Transaction {
    id = (0, uniqid_1.default)();
    outputMap = {};
    inputMap = {
        timestamp: 0,
        address: '',
        amount: 0,
        signature: { s: "", r: "" },
    };
    ;
    constructor(senderWallet, amount, recpient) {
        (this.outputMap = this.outputMapCreator(senderWallet, amount, recpient)),
            (this.inputMap = this.inputMapCreator(senderWallet, this.outputMap));
    }
    inputMapCreator(senderWallet, outputMap) {
        return {
            timestamp: Date.now(),
            address: senderWallet.publicKey,
            amount: senderWallet.balance,
            signature: senderWallet.sign(outputMap),
        };
    }
    outputMapCreator(senderWallet, amount, recipient) {
        let outputMap = {};
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
        outputMap[recipient] = amount;
        return outputMap;
    }
    static isValid(transaction) {
        let total = Object.values(transaction.outputMap).reduce((all, val) => {
            return all + val;
        });
        if (total !== transaction.inputMap.amount) {
            return { message: `invalid transaction from ${transaction.inputMap.address}`, code: 111 };
        }
        if (!(0, sign_1.verify)(transaction.outputMap, transaction.inputMap.signature, transaction.inputMap.address)) {
            return { message: `invalid transaction from ${transaction.inputMap.address}`, code: 112 };
        }
        return true;
    }
}
exports.Transaction = Transaction;
