const express = require('express');
const app = express();
const http = require('http');
const { isNumberObject } = require('util/types');
const server = http.createServer(app);
const io = new require("socket.io")(server);

const { Male, Female } = require('./Créature.js');
const { Joueur } = require('./Joueur.js');
const { Game } = require('./Game.js');


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
  // console.log("renvoi de "+request.params.nomFichier);
  response.sendFile(request.params.nomFichier, {root: __dirname});
});
//-------------------------------Variables------------------------------------------
var joueur1 = new Joueur(true);
var game = new Game(joueur1);
game.setNbJoueurs(2);
game.setTours(10);
var terrain;
var largeur=13;
var longueur=13;
//Création de la partie
function initGame(){
  terrain = [];
  for (i=0;i<longueur*largeur;i++){proba = Math.random()*100;
    if (proba<15){terrain.push("eau");}
    else{if (proba>65){terrain.push("plaine");}else{if (proba>55){terrain.push("montagne");}else{terrain.push("rocher");}}}}
    console.log("terrain généré")
    for (i=0;i<longueur*largeur;i++){game.board.push(0);}
    console.log("Jeu vidé");
  }
    // Example des classes
    var male1 = new Male(3,3,3, 'male', 1);
    var female1 = new Female(3,3,3,'female', 2);
    joueur1.parametrerCreature(male1, 'male');
    joueur1.parametrerCreature(female1, 'female');
    console.log(joueur1);

//-------------------------------Sockets-------------------------------------------
var haveHost = false;
io.on('connection', (socket) => {
  socket.on('load',data=>{socket.emit('loaded',!haveHost);haveHost=true;console.log("nouveau chargement de la page");})

  socket.on('join',data=>{
    console.log("Nouvelle connection:" +data.pseudo+"\nhote: "+data.host);
    if (game.joueurs.length>=game.nbJoueurs){
      socket.emit("joined","complet");return;
    }
    for (player of game.joueurs){if (player.pseudo==data.pseudo){
      console.log("pseudonyme pris");
      socket.emit("joined","pseudopris");return;
    }};
      
    game.joueurs.push({"pseudo":data.pseudo,"force":data.force,"perception":data.perception,"tauxrepro":data.tauxrepro,"host:":data.host})
    if (terrain==null){initGame();}
    socket.emit("joined",{"players":game.joueurs,"terrain":terrain,"jeu":game})
    console.log("Joueurs:\n"+game.joueurs);
  });
  });





//-------------------------------Connection----------------------------------------
