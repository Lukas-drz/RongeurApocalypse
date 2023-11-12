var largeur;
var longueur;




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