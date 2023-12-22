const express = require('express');
const app = express();
const http = require('http');
const { isNumberObject } = require('util/types');
const server = http.createServer(app);
const io = new require("socket.io")(server);

const { Creature } = require('./Créature.js');
const { Joueur } = require('./Joueur.js');
const { Game } = require('./Game.js');
const { Banane } = require('./banane.js');
var game;
var positionTanieres;

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
//-------------------------------Fonctions------------------------------------------
function initGame(firstPlayer,nbJoueurs){
game = new Game(firstPlayer);
game.setNbJoueurs(nbJoueurs);
game.setTours(10);
var largeur=13;
var longueur=13;
positionTanieres = [Math.floor(longueur/2)+13,Math.floor(((largeur-1)*longueur+longueur/2))-13,Math.floor(Math.floor(((largeur/2)))*longueur+1),Math.floor(Math.floor(((largeur/2)))*longueur+longueur-2)]
console.log("Position des tanières:"+positionTanieres)

//Création de la partie
for (i=0;i<longueur*largeur;i++){game.board.push(0);}

  game.terrain = [];
  for (i=0;i<longueur*largeur;i++){proba = Math.random()*100;
    if (proba<15){game.terrain.push("eau");}else{if (proba>65){game.terrain.push("plaine");}else{if (proba>60&&i%13!=0&&i%13!=12&&i/13!=0&&i/13!=12){game.terrain.push("montagne");}else{game.terrain.push("rocher");}}}}

    for (i=0;i<game.nbJoueurs;i++){

        game.terrain[positionTanieres[i]]=""+(i+1)
        game.board[positionTanieres[i]] = []
      }
      game.tanières = positionTanieres;
      console.log("terrain généré")
      console.log("Jeu vidé");
    }
    
    
    function actualisation(){
  var jeusimplifié = [];
  for (i in game.joueurs){
  jeusimplifié[i] = [];
  for(creature of game.joueurs[i].creatures){
    jeusimplifié[i].push(creature.position);
  }
  }
    
    io.emit("actualisation",{"players":game.joueurs,"jeu":jeusimplifié,"jeucomplet":game})
 }


 
 
 //Fonction qui gère le passage d'un tour
 function tour(jeu) {//Avec du recul ça aurait été plus malin de mettre la fonction "tour" comme méthode de la classe game, à noter pour la prochaine fois
  if (jeu.tourActuel >= jeu.nbtours) {
    
    var winner = jeu.getWinner();
    actualisation();
    io.emit('gameFinished',winner);

      console.log("partie finie, gagnant: "+winner);

      game = null;
      positionTanieres = null;
      haveHost = null;

      return;

  }

  jeu.reproduction();//Gère la reproduction de toutes les équipes
  jeu.joueurs.forEach(player => {
    //Gestion pouvoir
    if (player.cooldown>0){player.cooldown--;}
      if (player.pouvoir=="banane"){
        for (var banane of player.bananes){banane.tirer(game)}
      }

//Gestion animaux
      for (var animal of player.creatures) {
        animal.jouer(jeu);
        if (animal.cooldown>0){animal.cooldown--}
        
      }
    });
    actualisation();

    
  jeu.tourActuel++;
  console.log("Tour: "+jeu.tourActuel)

  setTimeout(() => {
    actualisation();
      tour(jeu);
  }, 1000);
}
//-------------------------------Sockets-------------------------------------------
var haveHost = false;
io.on('connection', (socket) => {
  socket.on('load',data=>{socket.emit('loaded',!haveHost);haveHost=true;console.log("nouveau chargement de la page");})

  socket.on('join',data=>{
    let joueur;
    if (game==null){
      if (data.host==false){socket.emit("systeme","Veuillez attendre que la partie soit crée");return;}//Cas où l'host ne se connecte pas le premier
      console.log("-----------------------------------------\ncreation partie par "+data.pseudo);
      
      joueur = new Joueur(true,data.pseudo,data.pouvoir)//Création de la partie selon l'hôte et ses paramètres
      initGame(joueur,data.nbJoueurs);
      let male = new Creature(data.tauxrepro,data.perception,data.force,"male",positionTanieres[0],positionTanieres[0])
      let femelle = new Creature(data.tauxrepro,data.perception,data.force,"female",positionTanieres[0],positionTanieres[0])
      game.joueurs[0].addCreature(male)
      game.joueurs[0].addCreature(femelle)
      game.board[positionTanieres[0]].push(male);
      game.board[positionTanieres[0]].push(femelle);

     

      game.setTours(data.nbTours);
      console.log("Max joueurs: "+data.nbJoueurs+"\nNombre de tours: "+data.nbTours+"\n-----------------------------------------\n");
    }

    else {for (player of game.joueurs){if (player.pseudo==data.pseudo){
      console.log("pseudonyme pris");
      socket.emit("joined","pseudopris");return;
    }};

    console.log("Nouvelle connection: " +data.pseudo+"\nhote: "+data.host);
    if (game.joueurs.length>=game.nbJoueurs){
      socket.emit("joined","complet");return;
    }

    //Création du joueur-----
    joueur=new Joueur(false,data.pseudo,data.pouvoir)
    let male = new Creature(data.tauxrepro,data.perception,data.force,"male",positionTanieres[game.joueursConnectes],positionTanieres[game.joueursConnectes])
    let femelle = new Creature(data.tauxrepro,data.perception,data.force,"female",positionTanieres[game.joueursConnectes],positionTanieres[game.joueursConnectes])
    joueur.addCreature(male)
    joueur.addCreature(femelle)
    game.board[positionTanieres[game.joueursConnectes]].push(male)
    game.board[positionTanieres[game.joueursConnectes]].push(femelle)  
    game.addJoueur(joueur)
    actualisation();

  

  }

  //Le damier utilisé pour l'actuaisation côté client est calculé via les joueurs
  var jeusimplifié = [];
  for (i in game.joueurs){
  jeusimplifié[i] = [];
  for(creature of game.joueurs[i].creatures){
    jeusimplifié[i].push(creature.position);
  }

  }

    socket.emit("joined",{"players":game.joueurs,"jeu":jeusimplifié,"jeucomplet":game})
    console.log("Joueurs:\n");
    game.joueurs.forEach(element => {
      console.log(element);
    });


  if (game.nbJoueurs==game.joueursConnectes){
    console.log("démarrage de la partie")
    io.emit("systeme","La partie commence !")

    tour(game)}
});

  socket.on('unload',data=>{if(data==true){haveHost=false;console.log("hôte déconnecté.")}})


 
  socket.on('pouvoirUtilise', data=>{ //Données reçues sous la forme  { "position": this.id.substring(1), "pseudo": informationsJoueur.pseudo}
    if (game.tourActuel==0){socket.emit("systeme","La partie n'a pas encore commencé");return;}
    let position = parseInt(data.position);
    if (game.tanières.includes(position)){socket.emit("systeme","Impossible d'utiliser un pouvoir sur une tanière");return}

      for (var joueur of game.joueurs){
        if (joueur.pseudo==data.pseudo){
          //On isole le joueur concerné
          if (joueur.cooldown>0){socket.emit("systeme","Vous ne pouvez pas encore utiliser votre pouvoir !");return;}

            if (joueur.pouvoir=="pasteque"){
              game.terrain[position] = "pasteque"
              joueur.cooldown = joueur.maxcooldown;
              actualisation();
            }
          
            if (joueur.pouvoir=="banane"){
                let canplace = false;
                if (game.board[position]!=1&&joueur.creatures.includes(game.board[position])){
                  canplace = true;
                }
                for (var test of game.casesAdjacentes(position)){
                  if (game.board[test]!=1&&joueur.creatures.includes(game.board[test])){
                    canplace = true;
                  }
                }

                if (canplace==false){socket.emit("systeme","Doit être placé près d'une de vos troupes");return;}


                for (var test of game.joueurs){
                  if (test.pouvoir=="banane"){
                  for (var t2 of test.bananes){
                      if (t2.position==position){
                        socket.emit("systeme","Il y a déjà une banane sur cet hexagone");return;
                      }
                  }
                  }
                }
            

              joueur.bananes.push(new Banane(data.pseudo,position))
              joueur.cooldown = joueur.maxcooldown;
              actualisation();

            }

            
            if (joueur.pouvoir=="coco"){
              for (var test of game.casesAdjacentes(position)){if (game.tanières.includes(test)){socket.emit("systeme","Trop près d'une tanière !");return}}
              game.coco(position)
              joueur.cooldown = joueur.maxcooldown;
              actualisation();
            }



        }
      }


  });
                    

});



