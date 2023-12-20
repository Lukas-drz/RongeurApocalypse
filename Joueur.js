// import { Male, Femelle } from './Créature.js'

class Joueur {
  constructor(isHost,pseudo) {
    this.pseudo = pseudo;
    this.isHost = isHost;
    this.creatures = [];
  }

  addCreature(creature){this.creatures.push(creature)}



  getLastCreature(){//gets the most recent creature born in the player's array of creatures. Useful for getting the winner in a tie-scenario
    if (this.creatures.length==0){return null}
    var youngest = this.creatures[0]

    for (var animal of this.creatures){
      if (animal.dateOfBirth.getTime()>youngest.dateOfBirth.getTime()){
        youngest = animal
      }
    }
    return youngest;
  }


}
module.exports = { Joueur };