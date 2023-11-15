console.log("Fichier Client.js reçu")

var largeur=13;
var longueur=13;

//Test qui génère un tableau de jeu rapide, à enlever plus tard lorsuqu'on aura externalisé ça
var game = []
for (i=0;i<longueur*largeur;i++){if (Math.random()*100<15){game.push("eau");}
else{if (Math.random()*100>65){game.push("plaine");}else{game.push("rocher");}}}


//-------------------Création Hexagone sous forme de tableau de points----------------------------------------
function creerHexagone(rayon){
    var points = new Array();
    for (var i = 0;i<6;i++){
        var angle = i*Math.PI/3;
        var x = Math.sin(angle)*rayon+40;
        var y = -Math.cos(angle)*rayon+40;
        points.push([Math.round(x*100)/100,Math.round(y*100)/100]);
    }
    return points;
}
//------------Création d'un damier selon les paramètres entrés dans le SVG d'identifiant "jeu"---------------------------
function créerDamier(nbLines,nbColumns,rayon){
    Hexagone = creerHexagone(rayon);
for (var l = 0; l < nbLines; l++) {
    for (var c = 0; c < nbColumns; c++) {
        var d = "";
        var x, y;

        for (var i = 0; i < 6; i++) {
            h=Hexagone[i]
            x = h[0]+(Hexagone[1][0]-Hexagone[0][0])*l*2+(Hexagone[1][0]-Hexagone[0][0])*c;
            y = h[1]+(Hexagone[1][1]-Hexagone[0][1])*c*3;

            if (i == 0) {
                d += "M" + x + "," + y + " L";} 
            else {
                d += x + "," + y + " ";}
        
            }
        d+="Z"

        /*Ajout*/
        d3.select("#jeu")
            .append("path")
            .attr("d", d)
            .attr("stroke", "black")
            .attr("fill", "aliceblue")
            .attr("id", "h" + (l * nbLines + c))
            .on("click", function(data){
                socket.emit('coup',{"case":this.id,"Id":idjoueur})
                console.log("Hexagone "+this.id+" joué par joueur "+idjoueur)
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
if (jeu[i]=="eau"){color="blue";}
if (jeu[i]=="rocher"){color="gray"}
if (jeu[i]=="plaine"){color="lightgreen"}
fill(i,color)
}
}

//-------------Initialisation du damier lors de la connection---------------------------------------------------------------
window.addEventListener("load", (event) => {
    créerDamier(longueur,largeur,20)
    actualiserDamier(longueur,largeur,game);
  });