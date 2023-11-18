// import { Male, Femelle } from './Créature.js'

export class Joueur {
  constructor(isHost) {
    this.isHost = isHost;
    this.creatures = {
      male: null,
      female: null
    };
  }

  parametrerCreature(creature) {
    if (gender === 'male') {
      this.creatures.male = creature;
    } else if (gender === 'female') {
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