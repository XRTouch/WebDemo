var http = require('http');
var express = require('express');
const app = express();
const server = http.createServer(app);

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

server.listen(80);