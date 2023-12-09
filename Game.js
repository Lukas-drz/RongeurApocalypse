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
    var adj = [pos-13,pos+13,pos-1,pos+1];

    if (((pos%13)%2)==1){
    adj.push(pos+12);adj.push(pos+14);
    }
    else{
        adj.push(pos-12);adj.push(pos-14);
    }
    //On enlève les incorrects
    return adj.filter((element)=>element>=0&&element<this.board.length&&this.terrain[element]!="montagne");
  }
}
module.exports = { Game };