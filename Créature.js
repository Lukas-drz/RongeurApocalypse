class Creature {
  constructor(reproductionRate, perception, strength, gender, position) {
    // vérification des valeurs
    if (reproductionRate < 1 || perception < 1 || strength < 1) {
      throw new Error('Les valeurs doivent être supérieures ou égales à 1');
    }
    this.reproductionRate = reproductionRate;
    this.perception = perception;
    this.strength = strength;
    this.gender = gender; 
    this.position = position;
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