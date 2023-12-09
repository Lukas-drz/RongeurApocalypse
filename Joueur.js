// import { Male, Femelle } from './Créature.js'

class Joueur {
  constructor(isHost,pseudo) {
    this.pseudo = pseudo;
    this.isHost = isHost;
    this.creatures = [];
  }

  addCreature(creature){this.creatures.push(creature)}

}
module.exports = { Joueur };