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
}
module.exports = { Game };