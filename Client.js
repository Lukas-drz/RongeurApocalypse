console.log("Fichier Client.js reçu")
var socket = io();

var informationsJoueur;
var host = false;

var largeur=13;
var longueur=13;

//Test qui génère un tableau de jeu rapide, à enlever plus tard lorsuqu'on aura externalisé ça
var jeu;
var largeurHexagones = 27;
var jeuDétaillé



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
                    socket.emit('coup', { "case": this.id, "pseudo": informationsJoueur.pseudo });
                    console.log("Pouvoir utilisé sur l'hexagone " + this.id + " joué par le joueur " + informationsJoueur.pseudo);
                });

            // Ajout de l'image depuis l'URL spécifiée

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
if (jeu[i]=="eau"){color="blue";}
if (jeu[i]=="rocher"){color="darkgray"}
if (jeu[i]=="montagne"){color="brown"}
if (jeu[i]=="plaine"){color="lightgreen"}
if (jeu[i]=="1"){color="aliceblue"}
if (jeu[i]=="2"){color="red"}
if (jeu[i]=="3"){color="purple"}
if (jeu[i]=="4"){color="pink"}

fill(i,color)
}
}


//Actualisation des valeurs du damier
function remplirDamier(longueur,largeur,jeu,rayon){
    
    
        var imageUrl = "http://localhost:8888/fichier/player3.png";
        var svgJeu = d3.select("#jeu");
        svgJeu.selectAll(".hexagon-image").remove();

    for (i in jeu){
        imageUrl = "http://localhost:8888/fichier/player"+i+".png";

        if (informationsJoueur.pseudo=="Ryan Gosling"){
            imageUrl = "http://localhost:8888/fichier/gosling"+i+".png";
        }
        
        for (position of jeu[i]){
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
                document.getElementById("afficheCase").innerHTML =  '<h3>Informations créature</h3><h4>Faim: '+jeuDétaillé.board[pos].satiety+' | Soif: '+jeuDétaillé.board[pos].hydration+' | CD reproduction: '+jeuDétaillé.board[pos].cooldown+'</h4>'

            })
        }
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
        document.getElementById("pannel").innerHTML= '<div class="tiers"> <h3 class="pannelText">Vos statistiques</h3> <input type="text" class="pannelText" id = "force" placeholder="force"> <input type="text" class="pannelText" id = "perception" placeholder="perception"> <input type="text" class="pannelText" id = "tauxrepro" placeholder="taux de reproduction"> </div> <div class="tiers"> <h3 class="pannelText">Vos informations</h3> <input type="text" class="pannelText" id = "pseudo" placeholder="pseudonyme"> <h3 class="pannelText">Informations système</h3> <h4 id="systeme" class="pannelText"></h4> </div> <div class="tiers"> <h3 class="pannelText">Configuration de la partie</h3> <input type="text" class="pannelText" id = "nbJoueurs" placeholder="Nombre de joueurs (défaut 2)"> <input type="text" class="pannelText" id = "nbTours" placeholder="nombre de tours (défaut 15)"> </div>'
    }
    else{document.getElementById("pannel").innerHTML='<div class="tiers"> <h3 class="pannelText">Vos statistiques</h3> <input type="text" class="pannelText" id = "force" placeholder="force"> <input type="text" class="pannelText" id = "perception" placeholder="perception"> <input type="text" class="pannelText" id = "tauxrepro" placeholder="taux de reproduction"> </div> <div class="tiers"> <h3 class="pannelText">Vos informations</h3> <input type="text" class="pannelText" id = "pseudo" placeholder="pseudonyme"> <h3 class="pannelText">Informations système</h3> <h4 id="systeme" class="pannelText"></h4> </div>'
}

})

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
    if (nbTours==null||isNaN(nbTours)){nbTours=15}}

    messageSysteme("Connection en cours.")
    informationsJoueur = {"pseudo":pseudo,"force":force,"perception":perception,"tauxrepro":tauxrepro,"host":host}; 
    socket.emit('join',{"pseudo":pseudo,"force":force,"perception":perception,"tauxrepro":tauxrepro,"host":host,"nbTours":nbTours,"nbJoueurs":nbjoueurs})
}

socket.on('joined',data=>{
    if (data=='complet'){messageSysteme("La partie est complète");return;}
    if (data=='pseudopris'){messageSysteme("Ce pseudonyme est déjà utilisé");return;}


    document.getElementById("playButton").remove();
    if (informationsJoueur.pseudo=="Ryan Gosling"){
        document.getElementById("background").src ="http://localhost:8888/fichier/gosling.gif"
    }

    players = data.players;
    jeuDétaillé = data.jeucomplet
    terrain = jeuDétaillé.terrain;
    jeu = data.jeu;
    créerDamier(longueur,largeur,largeurHexagones)
    actualiserDamier(longueur,largeur,terrain);
    remplirDamier(longueur,largeur,jeu,largeurHexagones);
    document.getElementById("pannel").innerHTML= '<div class="tiers"> <h3 class="pannelText">Vos statistiques</h3> <p class="pannelText">Force: '+informationsJoueur.force+' | Perception: '+informationsJoueur.perception+' | Taux reproduction: '+informationsJoueur.tauxrepro+'</p><h3 class="pannelText">Informations de la partie</h3> <p class=pannelText>Tour courant: '+jeuDétaillé.tourActuel+' sur '+jeuDétaillé.nbtours+' max</p></div> <div class="tiers"> <h3 class="pannelText">Vos informations</h3>  <h4 class="pannelText">Connecté en tant que '+informationsJoueur.pseudo+'</p> <h3 class="pannelText">Informations système</h3> <h4 id="systeme" class="pannelText"></h4> </div> <div class="tiers"> <h3 class="pannelText">Informations case</h3><div id="afficheCase"></div></div>'
  
    messageSysteme("Connecté à la partie en tant que "+informationsJoueur.pseudo);
})

window.addEventListener("beforeunload", (event) => {
    socket.emit("unload",host);
  });
  

socket.on("actualisation",data=>{
    document.getElementById("pannel").innerHTML= '<div class="tiers"> <h3 class="pannelText">Vos statistiques</h3> <p class="pannelText">Force: '+informationsJoueur.force+' | Perception: '+informationsJoueur.perception+' | Taux reproduction: '+informationsJoueur.tauxrepro+'</p><h3 class="pannelText">Informations de la partie</h3> <p class=pannelText>Tour courant: '+jeuDétaillé.tourActuel+' sur '+jeuDétaillé.nbtours+' max</p></div> <div class="tiers"> <h3 class="pannelText">Vos informations</h3>  <h4 class="pannelText">Connecté en tant que '+informationsJoueur.pseudo+'</p> <h3 class="pannelText">Informations système</h3> <h4 id="systeme" class="pannelText"></h4> </div> <div class="tiers"> <h3 class="pannelText">Informations case</h3><div id="afficheCase"></div></div>'
  
    if (informationsJoueur==null){return;}
    players = data.players;
    jeuDétaillé = data.jeucomplet
    terrain = jeuDétaillé.terrain;
    jeu = data.jeu;
    créerDamier(longueur,largeur,largeurHexagones)
    actualiserDamier(longueur,largeur,terrain);
    remplirDamier(longueur,largeur,jeu,largeurHexagones);
})

