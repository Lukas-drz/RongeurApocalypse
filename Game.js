const { Creature } = require('./Créature.js');
class Game {
    constructor(host) {
        this.host = host;
        this.joueurs = [host];
        this.nbJoueurs = 1;
        this.joueursConnectes = 1;
        this.nbtours = 0;
        this.tourActuel = 0;
        this.board = [];
        this.terrain = [];
        this.tanières = [];
    }
    addJoueur(joueur) {
        this.joueurs.push(joueur);
        this.joueursConnectes++;
    }
    removeJoueur(joueur) {
        this.joueurs.splice(this.joueurs.indexOf(joueur), 1);
        this.joueursConnectes--;
    }
    setNbJoueurs(nbJoueurs) {
        this.nbJoueurs = nbJoueurs;
    }
    setTours(nbtours) {
        this.nbtours = nbtours;
    }
    isFinished() {
        return this.nbtours == this.tourActuel;
    }

    getAxis(pos){//Cette fonction renvoie sous forme d'un tableau de deux éléments les positions X et Y (donc la ligne et la colonne) de la case demandée. Utile pour jouer les tours
        return [Math.floor(pos/13),pos%13]
    }
    getCase(axis){
        return axis[0]*13+axis[1]
    }

    //Liste des cases adjacentes
  casesAdjacentes(pos){
    var adj = [pos];
    if (pos/13!=0){//Si pas col gauche
        adj.push(pos-13)
    }
    if (pos/13!=12){//Si pas col droite
        adj.push(pos+13)
    }

    if (((pos%13)%2)==1){//ligne impaire
    adj.push(pos+12);adj.push(pos+14);adj.push(pos-1);adj.push(pos+1)
    }
    else{//Ligne paire
        if (pos%13!=0){//Ligne pas 0
            adj.push(pos-1);
            if (pos/13!=0){//Si pas col gauche
                adj.push(pos-14);
            }
        }   if (pos%13!=12){//Ligne pas 12
            adj.push(pos+1);
            if (pos/13!=0){//Si pas col gauche
                adj.push(pos-12);
            }
        }
    }

    //On enlève les incorrects
    return adj.filter((element)=>element>=0&&element<this.board.length&&this.terrain[element]!="montagne");
  }


reproduction(){
    var listeRepro;
    for (i=0;i<this.nbJoueurs;i++){
        listeRepro = this.board[this.tanières[i]];
        if (listeRepro.length<10&&(listeRepro!=[]||listeRepro!=undefined)){
        for (var animal of listeRepro){
            if (animal.cooldown==0){
            for (var j of listeRepro){
                if (j!=animal&&j.cooldown==0&&j.gender!=animal.gender){
                    for (var y=0;y<animal.reproductionRate;y++){
                        let creature;                           
                        if (Math.random()*100<=50){
                        creature = new Creature(animal.reproductionRate,animal.perception,animal.strength,"male",animal.tanière,animal.tanière)}
                        else{
                        creature = new Creature(animal.reproductionRate,animal.perception,animal.strength,"female",animal.tanière,animal.tanière)}

                        this.board[animal.tanière].push(creature)
                        this.joueurs[i].creatures.push(creature)
                        animal.cooldown = 5;
                        j.cooldown=5;
                    }
                }
                }
            }
        }
        }
    }


}



getWinner(){
    var trueTie = true;
    for (var player of this.joueurs){
        if (player.creatures.length>0){trueTie=false}
    }
    if (trueTie){return "Personne n'"}
    var winner = this.joueurs[0];
    for (var player of this.joueurs){
        if (player.creatures.length>winner.creatures.length){
            winner = player;
        }
        
        if (player.getLastCreature()!=null && player.creatures.length==winner.creatures.length){
            if (player.getLastCreature().dateOfBirth.getTime()>winner.getLastCreature().dateOfBirth.getTime()){
                winner = player;
            }
        }

    }
    return winner.pseudo+" ";
}
    

}
module.exports = { Game };