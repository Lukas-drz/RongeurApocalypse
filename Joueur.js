// import { Male, Femelle } from './Créature.js'

class Joueur {
  constructor(isHost,pseudo,pouvoir) {
    this.pseudo = pseudo;
    this.isHost = isHost;
    this.creatures = [];
    this.pouvoir = pouvoir;
    this.maxcooldown;
    this.cooldown = 0;
    //Dépendemment du pouvoir
    if (this.pouvoir=="pasteque"){
      this.maxcooldown = 15;
      this.cooldown = 5;
    }
    if (this.pouvoir=="banane"){
      this.maxcooldown = 15;
      this.bananes = [];
      this.cooldown = 5;
    }
    if (this.pouvoir=="coco"){
      this.maxcooldown = 20;
      this.cooldown = 15;
    }
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