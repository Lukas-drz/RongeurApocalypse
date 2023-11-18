export class Game {
    constructor(host) {
        this.host = host;
        this.joueurs = [];
        this.nbjoueurs = 0;
        this.joueursConnectes = 0;
        this.nbtours = 0;
        this.tourActuel = 0;
    }
    addJoueur(joueur) {
        this.joueurs.push(joueur);
        this.joueursConnectes++;
    }
    removeJoueur(joueur) {
        this.joueurs.splice(this.joueurs.indexOf(joueur), 1);
        this.joueursConnectes--;
    }
    setNbJoueurs(nbjoueurs) {
        this.nbjoueurs = nbjoueurs;
    }
    setTours(nbtours) {
        this.nbtours = nbtours;
    }
    isFinished() {
        return this.nbtours == this.tourActuel;
    }
}