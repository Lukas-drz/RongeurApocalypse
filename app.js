const express = require('express');
const app = express();
const http = require('http');
const { isNumberObject } = require('util/types');
const server = http.createServer(app);
const io = new require("socket.io")(server);

/*import { Male, Female } from './Créature.js'
import { Joueur } from './Joueur.js'*/


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
var terrain;
var largeur=13;
var longueur=13;
var game = [];
var nbTours;
var nbJoueurs;
//Création de la partie
function initGame(){
  terrain = [];
  for (i=0;i<longueur*largeur;i++){proba = Math.random()*100;
    if (proba<15){terrain.push("eau");}
    else{if (proba>65){terrain.push("plaine");}else{if (proba>55){terrain.push("montagne");}else{terrain.push("rocher");}}}}
    console.log("terrain généré")
    for (i=0;i<longueur*largeur;i++){game.push(0);}
    console.log("Jeu vidé");
  }
    // Example des classes

/*    let joueur1 = new Joueur(true);
    male = Male(5,2,2, 'male', 1);
    female = Female(3,4,2,'female', 2);
    joueur1.parametrerCreature(male, 'male');
    joueur1.parametrerCreature(femelle, 'female')*/

//-------------------------------Sockets-------------------------------------------
var haveHost = false;
io.on('connection', (socket) => {
  socket.on('load',data=>{socket.emit('loaded',!haveHost);haveHost=true;console.log("nouveau chargement de la page");})

  socket.on('join',data=>{
    console.log("Nouvelle connection:" +data.pseudo+"\nhote: "+data.host);
    if (joueurs.length>=nbJoueurs){
      socket.emit("joined","complet");return;
    }
    for (player of joueurs){if (player.pseudo==data.pseudo){
      console.log("pseudonyme pris");
      socket.emit("joined","pseudopris");return;
    }};
      
    joueurs.push({"pseudo":data.pseudo,"force":data.force,"perception":data.perception,"tauxrepro":data.tauxrepro,"host:":data.host})
    if (terrain==null){initGame();}
    socket.emit("joined",{"players":joueurs,"terrain":terrain,"jeu":game})
    console.log("Joueurs:\n"+joueurs);
  });
  });





//-------------------------------Connection----------------------------------------
