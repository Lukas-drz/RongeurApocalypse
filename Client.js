console.log("Fichier Client.js reçu")
var socket = io();

var informationsJoueur;
var host = false;

var largeur=13;
var longueur=13;

var jeu;
const largeurHexagones = 27;
var jeuDétaillé;
var idPouvoir;
const nbPouvoirs = 3;//Nombre de pouvoirs, sert à faire cycler l'affichage. Peut changer avec les mises à jour du jeu.
const nomsPouvoirs=["pasteque","banane","coco"]
const textesPouvoirs = ["La pastèque permet de placer un hexagone qui donnera à la fois de la nourriture et de l'eau. C'est un pouvoir très utile pour contrer les aléas d'un point d'apparition difficile.",
"Le canon-banane peut être placé sur un hexagone et tentera à chaque tour de tirer sur une créature ennemie assez proche. C'est un pouvoir très offensif.",
"La noix de coco, une fois lâchée sur un hexagone, cause d'énormes dégâts aux hexagones adjacents ainsi que sur celui ciblé. L'hexagone ciblé devient infranchissable et les hexagones adjacents se remplissent d'eau de coco."
];


//-------------------Création Hexagone sous forme de tableau de points----------------------------------------
function creerHexagone(rayon) {
    var points = new Array();
    for (var i = 0; i < 6; i++) {
        var angle = i * Math.PI / 3;
        var x = Math.sin(angle) * rayon + 40;
        var y = -Math.cos(angle) * rayon + 40;
        points.push([Math.round(x * 100) / 100, Math.round(y * 100) / 100]);
    }
    return points;
}

function créerDamier(nbLines, nbColumns, rayon) {
    document.getElementById("jeu").style.visibility="visible";
    document.getElementById("jeu").innerHTML = "";
    Hexagone = creerHexagone(rayon);

    for (var l = 0; l < nbLines; l++) {
        for (var c = 0; c < nbColumns; c++) {
            var d = "";
            var x, y;

            for (var i = 0; i < 6; i++) {
                h = Hexagone[i];
                x = h[0] + (Hexagone[1][0] - Hexagone[0][0]) * l * 2;
                if (c % 2 == 1) {
                    x += (Hexagone[1][0] - Hexagone[0][0]);
                }
                y = h[1] + (Hexagone[1][1] - Hexagone[0][1]) * c * 3;

                if (i == 0) {
                    d += "M" + x + "," + y + " L";
                } else {
                    d += x + "," + y + " ";
                }
            


            }
            d += "Z";



            d3.select("#jeu")
                .append("path")
                .attr("d", d)
                .attr("stroke", "black")
                .attr("fill", "aliceblue")
                .attr("id", "h" + (l * nbLines + c))
                .on("click", function (data) {
                    socket.emit('pouvoirUtilise', { "position": this.id.substring(1), "pseudo": informationsJoueur.pseudo});
                    console.log("Pouvoir utilisé sur l'hexagone " + this.id.substring(1) + " joué par le joueur " + informationsJoueur.pseudo);
                });


        }
    }
}




//Coloriage d'un hexagone
function fill(id,couleur){
    d3.select(("#h"+id)).attr("fill", couleur);
}
//Coloriage du damier

function actualiserDamier(longueur,largeur,jeu){
for (i=0;i<longueur*largeur;i++){
    var color="aliceblue";
if (jeu[i]=="eau"){color="DodgerBlue";}
if (jeu[i]=="rocher"){color="darkgray"}
if (jeu[i]=="montagne"){color="brown"}
if (jeu[i]=="plaine"){color="lightgreen"}
if (jeu[i]=="1"){color="aliceblue"}
if (jeu[i]=="2"){color="red"}
if (jeu[i]=="3"){color="purple"}
if (jeu[i]=="4"){color="pink"}
if (jeu[i]=="pasteque"){color ="lightcoral"}

fill(i,color)
}
}


//Actualisation des valeurs du damier
function remplirDamier(longueur,largeur,jeu,jeuDétaillé,rayon){
    
    
        var imageUrl = "http://localhost:8888/fichier/player3.png";
        var svgJeu = d3.select("#jeu");
        svgJeu.selectAll(".hexagon-image").remove();


 //Placement des bananes
 for (var joueur of jeuDétaillé.joueurs){
    if (joueur.pouvoir=="banane"){
    for (var banane of joueur.bananes){
    imageUrl = "http://localhost:8888/fichier/pouvoir1.png";


    var hexagonElement = d3.select("#h" + banane.position);
    var boundingBox = hexagonElement.node().getBBox();
    var centreX = boundingBox.x + boundingBox.width / 2;
    var centreY = boundingBox.y + boundingBox.height / 2;
    svgJeu.append("image")
        .attr("xlink:href", imageUrl)
        .attr("x", centreX-(rayon*1.4)/2) 
        .attr("y", centreY-(rayon*1.4)/2) 
        .attr("width", rayon*1.4) 
        .attr("height", rayon*1.4) 
        .attr("class", "hexagon-image")
        .attr("id", "b" + banane.position).on("mouseover",function(data){
            var pos = this.id.substring(1);
            var bananePointée
            for (var joueur of jeuDétaillé.joueurs)
            if (joueur.pouvoir=="banane"){{
                for (var banane of joueur.bananes){
                    if (banane.position==pos){
                        bananePointée = banane;
                    }
                }
            }}
            
            document.getElementById("afficheCase").innerHTML =  '<h3>Informations de la banane'+'</h3><h4>Tirs restants: '+bananePointée.tirsRestants+' | Cooldown: '+bananePointée.cooldown+'</h4><h4>Propriétaire: '+bananePointée.propriétaire+'</h4>'
            
        })
    }
}
}

    //Placement des créatures
    for (i in jeu){
        imageUrl = "http://localhost:8888/fichier/player"+i+".png";

        if (informationsJoueur.pseudo=="Ryan Gosling"){
            imageUrl = "http://localhost:8888/fichier/gosling"+i+".png";
        }
        
        for (position of jeu[i]){
            jeu = jeu.filter((element)=>element!=position)
        var hexagonElement = d3.select("#h" + position);
        var boundingBox = hexagonElement.node().getBBox();
        var centreX = boundingBox.x + boundingBox.width / 2;
        var centreY = boundingBox.y + boundingBox.height / 2;
        svgJeu.append("image")
            .attr("xlink:href", imageUrl)
            .attr("x", centreX-(rayon*1.4)/2) 
            .attr("y", centreY-(rayon*1.4)/2) 
            .attr("width", rayon*1.4) 
            .attr("height", rayon*1.4) 
            .attr("class", "hexagon-image")
            .attr("id", "c" + position)
            .on("mouseover",function(data){
                var pos = this.id.substring(1);
                if (!jeuDétaillé.tanières.includes(parseInt(pos))){
                document.getElementById("afficheCase").innerHTML =  '<h3>Informations de '+jeuDétaillé.board[pos].nom+'</h3><h4>Faim: '+jeuDétaillé.board[pos].satiety+' | Soif: '+jeuDétaillé.board[pos].hydration+' | CD reproduction: '+jeuDétaillé.board[pos].cooldown+'</h4><h4>Cible: '+jeuDétaillé.board[pos].cible+' | Sexe: '+jeuDétaillé.board[pos].gender+'</h4>'
                }
            })
            .on("click", function (data) {
                socket.emit('pouvoirUtilise', { "position": this.id.substring(1), "pseudo": informationsJoueur.pseudo});
                console.log("Pouvoir utilisé sur l'hexagone " + this.id.substring(1) + " joué par le joueur " + informationsJoueur.pseudo);
            });
        }
    }

   
}





//Tanière


function créerTanière(rayon) {
    document.getElementById("tanière").innerHTML = "";
    Hexagone = creerHexagone(rayon);
    for (var l = 0; l < 2; l++) {
        for (var c = 0; c < 5; c++) {
            var d = "";
            var x, y;

            for (var i = 0; i < 6; i++) {
                h = Hexagone[i];
                x = h[0] + (Hexagone[1][0] - Hexagone[0][0]) * l * 2;
                if (c % 2 == 1) {
                    x += (Hexagone[1][0] - Hexagone[0][0]);
                }
                y = h[1] + (Hexagone[1][1] - Hexagone[0][1]) * c * 3;

                if (i == 0) {
                    d += "M" + x + "," + y + " L";
                } else {
                    d += x + "," + y + " ";
                }
            }
            d += "Z";
            d3.select("#tanière")
                .append("path")
                .attr("d", d)
                .attr("stroke", "black")
                .attr("fill", "saddlebrown")
                .attr("id", "t" + (l * 5 + c))
            }}}


            function remplirTanière(jeu,rayon){
                var idj;
                for (var test of jeu.joueurs){
                    if (test.pseudo == informationsJoueur.pseudo) {idj = jeu.joueurs.indexOf(test);}
                }


                var imageUrl = "http://localhost:8888/fichier/player"+idj+".png";
                var svgJeu = d3.select("#tanière");
                svgJeu.selectAll(".hexagon-image").remove();
        
  
                if (informationsJoueur.pseudo=="Ryan Gosling"){
                    imageUrl = "http://localhost:8888/fichier/gosling"+idj+".png";
                }
                
                for (var creat in jeu.board[jeu.tanières[idj]]){
                    creature = jeu.board[jeu.tanières[idj]][creat]
                var hexagonElement = d3.select("#t" + jeu.board[jeu.tanières[idj]].indexOf(creature));
                var boundingBox = hexagonElement.node().getBBox();
                var centreX = boundingBox.x + boundingBox.width / 2;
                var centreY = boundingBox.y + boundingBox.height / 2;
                svgJeu.append("image")
                    .attr("xlink:href", imageUrl)
                    .attr("x", centreX-(rayon*1.4)/2) 
                    .attr("y", centreY-(rayon*1.4)/2) 
                    .attr("width", rayon*1.4) 
                    .attr("height", rayon*1.4) 
                    .attr("class", "hexagon-image")
                    .attr("id", "ct" + creat)
                    .on("mouseover",function(data){
                        var idj;
                        var pos = this.id.substring(2);
                        console.log(pos)
                        for (var test of jeuDétaillé.joueurs){
                            if (test.pseudo == informationsJoueur.pseudo) {idj = jeu.joueurs.indexOf(test);}
                        }
                        var pointee = jeuDétaillé.board[jeuDétaillé.tanières[idj]][pos];
                        document.getElementById("afficheCase").innerHTML =  '<h3>Informations de '+pointee.nom+'</h3><h4>Faim: '+pointee.satiety+' | Soif: '+pointee.hydration+' | CD reproduction: '+pointee.cooldown+'</h4><h4>Cible: '+pointee.cible+' | Sexe: '+pointee.gender+'</h4>'
        
                    })
                }
            }
        
        


  //Affichage message système
  function messageSysteme(message){
    document.getElementById("systeme").innerText = message;
  }
  
//-------------Initialisation de l'hôte---------------------------------------------------------------
window.addEventListener("load", (event) => {
    socket.emit("load");
  });
  
  //----------Loading into the game----------------------------------------------------------------


  socket.on('loaded',data=>{
    host=data;
    if (host==true){
        document.getElementById("pannel").innerHTML= '<div class="tiers"> <h3 class="pannelText">Vos statistiques</h3> <input type="text" class="pannelText" id = "force" placeholder="force"> <input type="text" class="pannelText" id = "perception" placeholder="perception"> <input type="text" class="pannelText" id = "tauxrepro" placeholder="taux de reproduction"> </div> <div class="tiers"> <h3 class="pannelText">Vos informations</h3> <input type="text" class="pannelText" id = "pseudo" placeholder="pseudonyme"> <h3 class="pannelText">Informations système</h3> <h4 id="systeme" class="pannelText"></h4> </div> <div class="tiers"> <h3 class="pannelText">Configuration de la partie</h3> <input type="text" class="pannelText" id = "nbJoueurs" placeholder="Nombre de joueurs (défaut 2)"> <input type="text" class="pannelText" id = "nbTours" placeholder="nombre de tours (défaut 30)"> </div>'
    }
    else{document.getElementById("pannel").innerHTML='<div class="tiers"> <h3 class="pannelText">Vos statistiques</h3> <input type="text" class="pannelText" id = "force" placeholder="force"> <input type="text" class="pannelText" id = "perception" placeholder="perception"> <input type="text" class="pannelText" id = "tauxrepro" placeholder="taux de reproduction"> </div> <div class="tiers"> <h3 class="pannelText">Vos informations</h3> <input type="text" class="pannelText" id = "pseudo" placeholder="pseudonyme"> <h3 class="pannelText">Informations système</h3> <h4 id="systeme" class="pannelText"></h4> </div>'
}

idPouvoir=0;
document.getElementById("pouvoirPannel").innerHTML =` <h3 class="pannelText">Pouvoir</h3>
<div class="pouvoir">
<p class="pouvoirBouton" onclick="previousPouvoir()">🠔</p> <img src="http://localhost:8888/fichier/pouvoir`+idPouvoir+`.png" id="pouvoir" class="pouvoirImage" ></img> <p class="pouvoirBouton" onclick="nextPouvoir()">🠖</p> 
</div>
<h3 type="text" class="pouvoirText" id = "pouvoirText" ">`+textesPouvoirs[idPouvoir]+`</h3>
`
})

function nextPouvoir(){
idPouvoir = (idPouvoir+1)%nbPouvoirs
document.getElementById("pouvoirPannel").innerHTML = ` <h3 class="pannelText">Pouvoir</h3>
<div class="pouvoir">
<p class="pouvoirBouton" onclick="previousPouvoir()">🠔</p> <img src="http://localhost:8888/fichier/pouvoir`+idPouvoir+`.png" id="pouvoir" class="pouvoirImage" ></img> <p class="pouvoirBouton" onclick="nextPouvoir()">🠖</p> 
</div>
<h3 type="text" class="pouvoirText" id = "pouvoirText" ">`+textesPouvoirs[idPouvoir]+`</h3>
`
}
function previousPouvoir(){
    idPouvoir = (idPouvoir+nbPouvoirs-1)%nbPouvoirs
    document.getElementById("pouvoirPannel").innerHTML = ` <h3 class="pannelText">Pouvoir</h3>
    <div class="pouvoir">
    <p class="pouvoirBouton" onclick="previousPouvoir()">🠔</p> <img src="http://localhost:8888/fichier/pouvoir`+idPouvoir+`.png" id="pouvoir" class="pouvoirImage" ></img> <p class="pouvoirBouton" onclick="nextPouvoir()">🠖</p> 
    </div>
    <h3 type="text" class="pouvoirText" id = "pouvoirText" ">`+textesPouvoirs[idPouvoir]+`</h3>
    `
    }



//-------------Connection---------------------------------------------------------------------------------------------------
function connection(){
    pseudo = document.getElementById("pseudo").value;
    force = parseInt(document.getElementById("force").value);
    perception = parseInt(document.getElementById("perception").value);
    tauxrepro = parseInt(document.getElementById("tauxrepro").value);
    total = force+perception+tauxrepro;
    if (isNaN(force)||isNaN(tauxrepro)||isNaN(perception)){messageSysteme("Les statistiques doivent être des entiers");return;}
    if(force<1||force>5||perception<1||perception>5||tauxrepro<1||tauxrepro>5){messageSysteme("Les statistiques doivent être comprises entre 1 et 5 (inclus)");return;}
    if (total>9){messageSysteme("Le total des statistiques doit être <=9");console.log("Total stats actuel: "+total);return;}
    if (pseudo==""||pseudo==null){messageSysteme("Le pseudonyme ne peut pas être nul");return;}

    var nbjoueurs;
    var nbTours;
    if (host){nbjoueurs = parseInt(document.getElementById("nbJoueurs").value);
    if (nbjoueurs>4){messageSysteme("Ce jeu n'accepte pas plus de 4 joueurs");return;}
    nbTours = parseInt(document.getElementById("nbTours").value)
    if (nbjoueurs==null||isNaN(nbjoueurs)){nbjoueurs=2}
    if (nbTours==null||isNaN(nbTours)){nbTours=30}}

    messageSysteme("Connection en cours.")
    informationsJoueur = {"pseudo":pseudo,"force":force,"perception":perception,"tauxrepro":tauxrepro,"host":host,"pouvoir":nomsPouvoirs[idPouvoir]}; 
    socket.emit('join',{"pseudo":pseudo,"force":force,"perception":perception,"tauxrepro":tauxrepro,"host":host,"nbTours":nbTours,"nbJoueurs":nbjoueurs,"pouvoir":nomsPouvoirs[idPouvoir]})
}

socket.on('joined',data=>{
    if (data=='complet'){messageSysteme("La partie est complète");return;}
    if (data=='pseudopris'){messageSysteme("Ce pseudonyme est déjà utilisé");return;}


    document.getElementById("playButton").remove();
    document.getElementById("pouvoirPannel").remove();
    if (informationsJoueur.pseudo=="Ryan Gosling"){
        document.getElementById("background").src ="http://localhost:8888/fichier/gosling.gif"
    }

    players = data.players;
    jeuDétaillé = data.jeucomplet
    terrain = jeuDétaillé.terrain;
    jeu = data.jeu;
    créerDamier(longueur,largeur,largeurHexagones)
    créerTanière(largeurHexagones)
    actualiserDamier(longueur,largeur,terrain);
    remplirDamier(longueur,largeur,jeu,jeuDétaillé,largeurHexagones);
    remplirTanière(jeuDétaillé,largeurHexagones)
    document.getElementById("pannel").innerHTML= '<div class="tiers" id=stats> <h3 class="pannelText">Vos statistiques</h3> <p class="pannelText">Force: '+informationsJoueur.force+' | Perception: '+informationsJoueur.perception+' | Taux reproduction: '+informationsJoueur.tauxrepro+'</p><h3 class="pannelText">Informations de la partie</h3> <p class=pannelText>Tour courant: '+jeuDétaillé.tourActuel+' sur '+jeuDétaillé.nbtours+' max</p></div> <div class="tiers" id="middle"> <h3 class="pannelText">Vos informations</h3>  <h4 class="pannelText">Connecté en tant que '+informationsJoueur.pseudo+'</p> <h3 class="pannelText">Informations système</h3> <h4 id="systeme" class="pannelText"></h4> </div> <div class="tiers"> <h3 class="pannelText">Informations case</h3><div id="afficheCase"></div></div>'
  
    messageSysteme("Connecté à la partie en tant que "+informationsJoueur.pseudo);
})

window.addEventListener("beforeunload", (event) => {
    socket.emit("unload",host);
  });
  

  socket.on("actualisation",data=>{
    if (informationsJoueur==null){return;}
    var cd;
    for (var p of jeuDétaillé.joueurs){//Affichage du cooldown
        if (p.pseudo == informationsJoueur.pseudo) {cd = p.cooldown}
    }
    document.getElementById("stats").innerHTML = '<h3 class="pannelText">Vos statistiques</h3> <p class="pannelText">Force: '+informationsJoueur.force+' | Perception: '+informationsJoueur.perception+' | Taux reproduction: '+informationsJoueur.tauxrepro+'</p><h3 class="pannelText">Informations de la partie</h3> <p class=pannelText>Tour courant: '+jeuDétaillé.tourActuel+' sur '+jeuDétaillé.nbtours+' max | Cooldown pouvoir: '+cd+' tours.</p>'
    
    
    
    jeu = data.jeu;
    players = data.players;
    jeuDétaillé = data.jeucomplet
    terrain = jeuDétaillé.terrain;
    créerDamier(longueur,largeur,largeurHexagones)
    actualiserDamier(longueur,largeur,terrain);
    remplirDamier(longueur,largeur,jeu,jeuDétaillé,largeurHexagones);
    remplirTanière(jeuDétaillé,largeurHexagones)
})


socket.on("systeme",data=>{
    messageSysteme(data);
})

socket.on('gameFinished',data=>{
    console.log("partie finie")
    document.getElementById("gameRow").remove();
    document.body.innerHTML+=`<h4 class="winner">`+data+`a gagné !</>`
    messageSysteme(data+" a gagné");
});