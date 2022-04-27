"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodes = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
class Nodes {
    port;
    list = [""];
    app = (0, express_1.default)();
    blockChain;
    constructor(port) {
        this.port = port;
    }
    start() {
        this.app.use(express_1.default.json());
        this.app.listen(this.port);
    }
    async broadcast(name, data) {
        for (let i = 0; i < this.list.length; i++) {
            try {
                await axios_1.default.post(`http://${this.list[i]}/${name}`, data);
                console.log(`success send ${this.list[i]} with ${name} channel`);
            }
            catch (error) {
                console.log(`Error brodcast to ${this.list[i]} with ${name} channel`);
            }
        }
    }
    bet(name, callback) {
        this.app.use(express_1.default.json());
        this.app.post("/" + name, (req, res) => {
            callback(req.body);
            res.send("ok");
        });
    }
}
exports.Nodes = Nodes;
