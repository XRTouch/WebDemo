var http = require('http');
var express = require('express');
const app = express();
const fs = require("fs");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const addon = require("./cppInterface/cppInterface");
console.log('init');
addon.init("COM3");

const BDD_FILE_PATH = __dirname+"/BDD/bdd.json";

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
        if (Math.abs(newValue - lastValue) >= 1) {
            lastValue = newValue
            socket.emit("custom/getAngle", lastValue);
        }
    }, 33);
    socket.on("custom/setAngle", val => {
        addon.setForce(Math.max(Math.min(parseInt(val)+30, 100), 0));
    });

    socket.on("custom/getResource", data => {
        fs.readFile(BDD_FILE_PATH, {encoding: "utf-8"}, (err, content) => {
            if (err) return;
            const obj = JSON.parse(content);
            let cursor = obj;
            data.path.forEach(branch => {
                try {cursor = cursor[branch];} catch (e) {cursor = null;}
            });
            socket.emit("custom/setResource", {
                id: data.id,
                data: cursor
            });
        })
    });
});

server.listen(80);