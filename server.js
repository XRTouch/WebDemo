var http = require('http');
var express = require('express');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const addon = require("./cppInterface/cppInterface");
console.log('init');
addon.init("COM5");

/* 
Serveur web par defaut :)
a lancer avec nodejs [node server.js]
serveur sur le port 80 (localhost) 
*/
app.get('/*', (req, res) => {
    let path = req.url;
    if (req.url == "/") path = "/index.html";
    path = path.split("?")[0];
    path = __dirname+"/client"+path;
    res.sendFile(path);
});

io.on("connection", socket => {
    let lastValue = -1;
    setInterval(() => {
        let newValue = addon.getAngle();
        if (Math.abs(newValue - lastValue) > 10) {
            lastValue = newValue
            console.log(lastValue);
            socket.emit("custom/getAngle", lastValue);
        }
    }, 33);
    socket.on("custom/setForce", val => {
        addon.setForce(parseInt(val));
    });
});

server.listen(80);