var http = require('http');
var express = require('express');
const app = express();
const fs = require("fs");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const addon = require("./cppInterface/cppInterface");
addon.init("COM3");

const BDD_FILE_PATH = __dirname+"/bdd.json";

class LecteurJSON {
    static data = null;
    static chargerFichier() {
        this.lireEtSauvegarderFichier(BDD_FILE_PATH);
    }

    static lireEtSauvegarderFichier(path) {
        LecteurJSON.data = JSON.parse(fs.readFileSync(path, {encoding: "utf-8"}));
    }

    static lireFichier(path) {
        if (LecteurJSON.data == null) {
            LecteurJSON.chargerFichier();
        }
        let cursor = JSON.parse(JSON.stringify(LecteurJSON.data));
        path.forEach(branch => {
            try {cursor = cursor[branch];} catch (e) {cursor = null;}
        });
        return cursor;
    }
}

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

server.on("listening", () => {
    console.log("server listening on port " + server.address().port);
    process.stdout.write("Loading BDD ...");
    LecteurJSON.chargerFichier();
    process.stdout.write(" Done\n");
});

let cissorsEnabled = true;
let lastTime = Date.now();
io.on("connection", socket => {
    let lastAngle = 0;
    let lastMovement = 0;
    setInterval(() => {
        let newAngle = addon.getAngle();
        if (Math.abs(newAngle - lastAngle) >= 1) {
            lastAngle = newAngle
            socket.emit("custom/getAngle", newAngle);
        }
        let newMovement = addon.getMovement();
        if (newMovement != lastMovement) {
            lastMovement = newMovement;
            socket.emit("custom/getMovement", newMovement);
        }
    }, 40);
    socket.on("custom/setAngle", val => {
        if (cissorsEnabled && (lastTime < Date.now() - 40)) {
            lastTime = Date.now();
            addon.setForce(Math.max(Math.min(parseInt(val)+30, 100), 0));
        }
    });
    socket.on("custom/disable", val => {
        addon.setForce(0);
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
        });
        socket.emit("custom/setResource", {
            id: data.id,
            data: LecteurJSON.lireFichier(data.path)
        });
    });
});

server.listen(80);