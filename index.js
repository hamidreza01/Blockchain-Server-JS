const express = require("express");
const app = express();
const BlockChain = require("./BlockChain");
const blockChain = new BlockChain();
const {ADMIN} = require("./config")
let nodeList = [ADMIN.httpIP];
const axios = require("axios").default;
const net = require("net");

const server = net.createServer();

class SocketCtrl{
  constructor(){
    this.sockets = [];
    this.mainSocket;
  }
  slice(number){
    this.sockets.forEach((x)=>{
      x.write(JSON.stringify({action : 'sliceChain',data : number}));
    })
  }
  reaplceChain(chain){
    this.sockets.forEach((x)=>{
      x.write(JSON.stringify({action : 'replaceChain',data : chain}));
    })
  }
  reaplceNode(nodeList){
    this.sockets.forEach((x)=>{
      x.write(JSON.stringify({action : 'replaceNodes',data : nodeList}));
    })
  }
  addNode(ip){
    this.sockets.forEach((x)=>{
      x.write(JSON.stringify({action : 'newNode',data : ip}));
    })
  }
  help(ip){
    this.mainSocket = ip;
  }
}

const socketCtrl = new SocketCtrl()
server.on("connection",(socket)=>{
  console.log(`${socket.remoteAddress}:${socket.remotePort}`); 
  
  if(socketCtrl.mainSocket == `${socket.remoteAddress}:${socket.remotePort}`){
    socket.write(JSON.stringify({action : "giveMeData"}));
  };
  
  socket.on("data",(data)=>{
    data = JSON.parse(data.toString())
    if(data.action == 'addMe'){
      socket.id = `${socket.remoteAddress}:${socket.remotePort}`;
      socket.write(JSON.stringify({action : 'welcome', data: nodeList}));
      nodeList.push(`${socket.remoteAddress}:${socket.remotePort - 2}`);
      socketCtrl.addNode(`${socket.remoteAddress}:${socket.remotePort - 2}`);
      socketCtrl.sockets.push(socket);
    }
    if(data.action === 'dataForYou' && socket.id == socketCtrl.mainSocket){
      nodeList = data.nodes;
      blockChain.chain = data.chain;
      socketCtrl.reaplceChain(data.chain);
      socketCtrl.reaplceNode(data.nodes);
    }
  });

  socket.on("error",(err)=>{
    console.log("app is have problem :" ,err)
  })
  socket.on("end",()=>{
    socketCtrl.sockets = socketCtrl.sockets.filter((x)=> x.id != socket.id);
  })
});

server.on("close",()=>{
  console.log("netword has been closed")
})
server.on("error",(err)=>{
  console.log(`error : ${err}`)
})
server.on("listening",()=>{
  console.log('admin network is runnig')
})
server.listen({
  port : 3000,
  host : "localhost"
});


app.use(express.json());

app.use((req, res, next) => {
  if (
    nodeList.find(
      (x) => req.ip.replace("::ffff:", "") === x.split(":")[0]
    )
  ) {
    next();
  } else {
    res.send("who are you ?");
  }
});

app.post("/api/replace", (req, res, next) => {
  try {
    blockChain.replaceChain(req.body.chain);
    res.status(200).json({
      process: true,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/api/blocks", (req, res, next) => {
  try {
    res.status(200).json(blockChain.chain);
  } catch (err) {
    next(err);
  }
});

// listen app
 app.listen(45451, () => {
   console.log("admin is runnig");
 });
