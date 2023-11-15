const express = require('express');
const app = express();
const http = require('http');
const { isNumberObject } = require('util/types');
const server = http.createServer(app);
const io = new require("socket.io")(server);

app.use(express.static(__dirname));

const PORT = process.env.PORT || 8888;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//-------------------------------Express-------------------------------------------
app.get('/', (request, response) => {
  response.sendFile('index.html', {root: __dirname});
});

app.get('/fichier/:nomFichier', function(request, response) {
  console.log("renvoi de "+request.params.nomFichier);
  response.sendFile(request.params.nomFichier, {root: __dirname});
});
//-------------------------------Variables------------------------------------------
var joueurs = [];
var terrain = [];
var largeur=13;
var longueur=13;
var game = []
//Création de la partie
function initGame(){
  for (i=0;i<longueur*largeur;i++){proba = Math.random()*100;
    if (proba<15){terrain.push("eau");}
    else{if (proba>65){terrain.push("plaine");}else{if (proba>55){terrain.push("montagne");}else{terrain.push("rocher");}}}}
    console.log("terrain généré")
    for (i=0;i<longueur*largeur;i++){game.push(0);}
    console.log("Jeu vidé");}

    initGame()

//-------------------------------Sockets-------------------------------------------
var haveHost = false;
io.on('connection', (socket) => {
  socket.on('load',data=>{socket.emit('loaded',!haveHost)})
  socket.on('Join',data=>{
    console.log(data);
  })

});
//-------------------------------Connection----------------------------------------
