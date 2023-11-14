class Creature {
  constructor(reproductionRate, perception, strength, gender) {
    // vérification des valeurs
    if (reproductionRate < 1 || perception < 1 || strength < 1) {
      throw new Error('Les valeurs doivent être supérieures ou égales à 1');
    }
    this.reproductionRate = reproductionRate;
    this.perception = perception;
    this.strength = strength;
    this.gender = gender; // Ajout d'un attribut "genre"
  }
}