class Creature {
  constructor(reproductionRate, perception, strength, gender, position) {
    // Chaque joueur doit distribuer 9 points sur trois axes valués de 1 à 5 :
      if (reproductionRate <= 1 || perception <= 1 || strength <= 1 || reproductionRate >= 5 || perception >= 5 || strength >= 5 || reproductionRate + perception + strength != 9) {
        throw new Error('Les valeurs doivent être supérieures ou égales à 1 et inferieures ou egales a 5');
    }
    this.reproductionRate = reproductionRate;
    this.perception = perception;
    this.strength = strength;
    this.gender = gender; 
    this.position = position;
    // ajouter taux d’hydratation et de satiété valués de 0 à 10.
  }
}

export class Female extends Creature {
  constructor(reproductionRate, perception, strength, position) {
    super(reproductionRate, perception, strength, 'female', position);
  }
}

export class Male extends Creature{
  constructor(reproductionRate, perception, strength, position) {
    super(reproductionRate, perception, strength, 'male', position);
  }
}