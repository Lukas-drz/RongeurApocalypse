const express = require('express');
const app = express();
const http = require('http');
const { isNumberObject } = require('util/types');
const server = http.createServer(app);
const io = new require("socket.io")(server);

const { Male, Female } = require('./Créature.js');
const { Joueur } = require('./Joueur.js');
const { Game } = require('./Game.js');
var game;
var terrain;

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
function initGame(firstPlayer,nbJoueurs){
game = new Game(firstPlayer);
game.setNbJoueurs(nbJoueurs);
game.setTours(10);
var largeur=13;
var longueur=13;
var positionTanieres = [Math.floor(longueur/2),Math.floor(Math.floor(((largeur/2)))*longueur),Math.floor((largeur-1)*longueur+longueur/2),Math.floor(Math.floor(((largeur/2)))*longueur+longueur-1)]
console.log(positionTanieres)
//Création de la partie
  terrain = [];
  for (i=0;i<longueur*largeur;i++){proba = Math.random()*100;
    if (proba<15){terrain.push("eau");}
    else{if (proba>65){terrain.push("plaine");}else{if (proba>55){terrain.push("montagne");}else{terrain.push("rocher");}}}}

    for (i=0;i<game.nbJoueurs;i++){

        terrain[positionTanieres[i]]=""+(i+1)
    }

    console.log("terrain généré")
    for (i=0;i<longueur*largeur;i++){game.board.push(0);}
    console.log("Jeu vidé");
  }

  // Example des classes
  /*var joueur1 = new Joueur(true);
    var male1 = new Male(3,3,3, 'male', 1);
    var female1 = new Female(3,3,3,'female', 2);
    joueur1.parametrerCreature(male1, 'male');
    joueur1.parametrerCreature(female1, 'female');
    console.log(joueur1);*/

//-------------------------------Sockets-------------------------------------------
var haveHost = false;
io.on('connection', (socket) => {
  socket.on('load',data=>{socket.emit('loaded',!haveHost);haveHost=true;console.log("nouveau chargement de la page");})

  socket.on('join',data=>{
    let joueur;
    if (game==null){
      joueur = new Joueur(true,data.pseudo)
      
      console.log("creation partie par "+data.pseudo);
      initGame(joueur,data.nbJoueurs);
      game.setTours(data.nbTours);
      console.log("Max joueurs: "+data.nbJoueurs+"\nNombre de tours: "+data.nbTours);
    }
    else {for (player of game.joueurs){if (player.pseudo==data.pseudo){
      console.log("pseudonyme pris");
      socket.emit("joined","pseudopris");return;
    }};

    console.log("Nouvelle connection: " +data.pseudo+"\nhote: "+data.host);
    if (game.joueurs.length>=game.nbJoueurs){
      socket.emit("joined","complet");return;
    }
    joueur=new Joueur(false,data.pseudo)
    
    game.addJoueur(joueur)

  }

  //Le damier utilisé pour l'actuaisation côté client est calculé via les joueurs
  var jeusimplifié = [];
  for (i in game.joueurs){
  jeusimplifié[i] = [];
  for(creature of game.joueurs[i].creatures){
    jeusimplifié[i].push(creature.position);
  }

  }

    socket.emit("joined",{"players":game.joueurs,"terrain":terrain,"jeu":jeusimplifié,"jeucomplet":game.board})
    console.log("Joueurs:\n");
    game.joueurs.forEach(element => {
      console.log(element);
    });
  
});

  socket.on('unload',data=>{if(data==true){haveHost=false;console.log("hôte déconnecté.")}})


});





//-------------------------------Connection----------------------------------------
