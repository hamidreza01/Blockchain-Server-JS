try {
  const express = require("express");
  const app = express();

  const { Blockchain } = require("./Src/classes/Blockchain/Blockchain");
  const {
    TransactionPool,
  } = require("./Src/classes/Blockchain/TransactionPool");
  const { Transaction } = require("./Src/classes/Blockchain/Transaction");
  const transactionPool = new TransactionPool();
  const {
    config: { ADMIN }, config,
  } = require("./config");

  let nodeList = [ADMIN.httpIP];

  const axios = require("axios").default;

  const net = require("net");

  const server = net.createServer();

  const blockChain = new Blockchain();
  console.log = ()=>{};
  class SocketCtrl {
    constructor() {
      this.sockets = [];
      this.mainSocket;
    }
    slice(number) {
      this.sockets.forEach((x) => {
        x.write(JSON.stringify({ action: "sliceChain", data: number }));
      });
    }
    reaplceChain(chain) {
      this.sockets.forEach((x) => {
        x.write(JSON.stringify({ action: "replaceChain", data: chain }));
      });
    }
    reaplceNode(nodeList) {
      this.sockets.forEach((x) => {
        x.write(JSON.stringify({ action: "replaceNodes", data: nodeList }));
      });
    }
    addNode(ip) {
      this.sockets.forEach((x) => {
        x.write(JSON.stringify({ action: "newNode", data: ip }));
      });
    }
    help(ip) {
      this.mainSocket = ip;
    }
  }

  const socketCtrl = new SocketCtrl();
  server.on("connection", (socket) => {
    console.log(`${socket.remoteAddress}:${socket.remotePort}`);

    if (
      socketCtrl.mainSocket == `${socket.remoteAddress}:${socket.remotePort}`
    ) {
      socket.write(JSON.stringify({ action: "giveMeData" }));
    }

    socket.on("data", (data) => {
      data = JSON.parse(data.toString());
      if (data.action == "addMe") {
        socket.id = `${socket.remoteAddress}:${socket.remotePort}`;
        socket.write(
          JSON.stringify({
            action: "welcome",
            data: {
              nodeList,
              chain: blockChain.chain,
              transactionMap: transactionPool.transactionMap,
            },
          })
        );
        nodeList.push(`${socket.remoteAddress}:${socket.remotePort - 2}`);
        socketCtrl.addNode(`${socket.remoteAddress}:${socket.remotePort - 2}`);
        socketCtrl.sockets.push(socket);
      }
      if (data.action === "dataForYou" && socket.id == socketCtrl.mainSocket) {
        nodeList = data.data.nodeList;
        blockChain.chain = data.data.chain;
        socketCtrl.reaplceChain(data.data.chain);
        socketCtrl.reaplceNode(data.data.nodeList);
      }
    });

    socket.on("error", (err) => {
      console.log("app is have problem :", err);
    });
    socket.on("end", () => {
      socketCtrl.sockets = socketCtrl.sockets.filter((x) => x.id != socket.id);
    });
  });

  server.on("close", () => {
    console.log("netword has been closed");
  });
  server.on("error", (err) => {
    console.log(`error : ${err}`);
  });
  server.on("listening", () => {
    console.log("admin network is runnig");
  });
  server.listen({
    port: 3001,
    host : '0.0.0.0'
  });

  app.use(express.json());
  app.use((req, res, next) => {
    next();
  });
  app.use((req, res, next) => {
    if (
      nodeList.find((x) => req.ip.replace("::ffff:", "") === x.split(":")[0])
    ) {
      next();
    } else {
      res.send("who are you ?");
    }
  });

  app.post("/chain", (req, res, next) => {
    try {
      const data = req.body;
      if (
        blockChain.validTransactionData(data) === true &&
        blockChain.replaceChain(data) === true
      ) {
        transactionPool.clearBlockchainTransactions(data);
        res.send("ok");
      }
    } catch (err) {
      next(err);
    }
  });

  app.post("/transaction", (req, res, next) => {
    try {
      const check = Transaction.isValid(req.body);
      if (check !== true) {
        return check;
      }
      transactionPool.add(req.body);
      res.send("ok");
    } catch (err) {
      next(err);
    }
  });

  app.post("/blocks", (req, res, next) => {
    try {
      res.status(200).json(blockChain.chain);
    } catch (err) {
      next(err);
    }
  });

  setInterval(() => {
    for (let i = 0; i < nodeList.length; i++) {
      axios
        .get(`http://${nodeList[i]}/blocks`)
        .then(() => {})
        .catch(() => {
          nodeList = nodeList.filter((x) => x != nodeList[i]);
          socketCtrl.reaplceNode(nodeList);
        });
    }
    if (fs.existsSync("./chain.log")) {
      fs.unlinkSync("./chain.log");
      fs.writeFileSync("./chain.log", JSON.stringify(blockChain.chain));
    } else {
      fs.writeFileSync("./chain.log", JSON.stringify(blockChain.chain));
    }
    if (fs.existsSync("./nodes.log")) {
      fs.unlinkSync("./nodes.log");
      fs.writeFileSync("./nodes.log", JSON.stringify(nodeList));
    } else {
      fs.writeFileSync("./nodes.log", JSON.stringify(nodeList));
    }
  }, 1000 * 60 * 60);

  // listen app

  app.listen(process.env.PORT || config.NODE_PORT || 45451, () => {
    console.log("admin is runnig");
  });
} catch (error) {
  console.error(error);
}
