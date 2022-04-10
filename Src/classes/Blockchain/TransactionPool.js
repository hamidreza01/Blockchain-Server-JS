"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionPool = void 0;
class TransactionPool {
    transactionMap = {};
    constructor() {
    }
    add(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }
}
exports.TransactionPool = TransactionPool;
;
