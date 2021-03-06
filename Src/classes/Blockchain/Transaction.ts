import { _Transaction } from "../../interfaces/Blockchain/_Transaction";
import { _Wallet } from "../../interfaces/Blockchain/_Wallet";
import uniqid from "uniqid";
import { _Errors } from "../../types/errors_interface";
import { verify } from "../../Addon/sign";
import { inputMap_type } from "../../types/inputMap_types";
import { config } from "../../../config";
export class Transaction implements _Transaction {
  id: string = uniqid();
  public outputMap: any = {};
  public inputMap: inputMap_type = {
    timestamp: 0,
    address: "",
    amount: 0,
    signature: { s: "", r: "" },
  };
  constructor(senderWallet: _Wallet, amount: number, recpient: string, inputMap?: inputMap_type, outputMap?: {}) {
    (this.outputMap =  outputMap || this.outputMapCreator(senderWallet, amount, recpient)),
      (this.inputMap = inputMap || this.inputMapCreator(senderWallet, this.outputMap));
  }
  inputMapCreator(senderWallet: _Wallet, outputMap: {}): inputMap_type {
    return {
      timestamp: Date.now(),
      address: senderWallet.publicKey,
      amount: senderWallet.balance,
      signature: senderWallet.sign(outputMap),
    };
  }
  outputMapCreator(
    senderWallet: _Wallet,
    amount: number,
    recipient: string
  ): {} {
    let outputMap: any = {};
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
    outputMap[recipient] = amount;
    return outputMap;
  }
  update(
    recpient: string,
    amount: number,
    senderWallet: _Wallet
  ): void | _Errors {
    if (this.outputMap[senderWallet.publicKey] < amount) {
      return { message: "amount exceeds balance", code: 112 };
    } 
    if(this.outputMap[recpient]){
      this.outputMap[recpient] += amount
    }else{
      this.outputMap[recpient] = amount;
    }
    this.inputMap = this.inputMapCreator(senderWallet,this.outputMap)
  }
  static isValid(transaction: _Transaction): _Errors | boolean {
    let total = Object.values(transaction.outputMap).reduce((all, val: any) => {
      return (all as number) + val;
    });
    if (total !== transaction.inputMap.amount) {
      return {
        message: `invalid transaction from ${transaction.inputMap.address}`,
        code: 111,
      };
    }
    if (
      !verify(
        transaction.outputMap,
        transaction.inputMap.signature,
        transaction.inputMap.address
      )
    ) {
      return {
        message: `invalid transaction from ${transaction.inputMap.address}`,
        code: 112,
      };
    }
    return true;
  }
  static reward(minerWallet: _Wallet): _Transaction {
    return new Transaction(
      minerWallet,
      0,
      minerWallet.publicKey,
      config.REWARD_TRANSACTION as any,
      {[minerWallet.publicKey]: config.REWARD}
    );
  }
}
