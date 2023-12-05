// import { Male, Femelle } from './Créature.js'

class Joueur {
  constructor(isHost) {
    this.isHost = isHost;
    this.creatures = {
      male: null,
      female: null
    };
  }

  parametrerCreature(creature) {
    if (creature.gender === 'male') {
      this.creatures.male = creature;
    } else if (creature.gender === 'female') {
      this.creatures.female = creature;
    } else {
      throw new Error("Le genre doit être 'male' ou 'female'");
    }
  }
  ajouterEnfant(gender, childCreature) {
    if (gender === 'male' || gender === 'female') {
      this.creatures.children.push({ gender, creature: childCreature });
    } else {
      throw new Error("Le genre doit être 'male' ou 'female'");
    }
  }
}
module.exports = { Joueur };