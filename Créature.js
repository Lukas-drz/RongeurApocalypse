class Creature {
  // ajouter reproduction
  constructor(reproductionRate, perception, strength, gender, position) {
    // Chaque joueur doit distribuer 9 points sur trois axes valués de 1 à 5 :
      if (reproductionRate <= 1 || perception <= 1 || strength <= 1 || reproductionRate >= 5 || perception >= 5 || strength >= 5 || reproductionRate + perception + strength != 9) {
        throw new Error('Les valeurs doivent être supérieures ou égales à 1 et inferieures ou egales a 5 et le total doit donner 9');
    }
    this.reproductionRate = reproductionRate;
    this.perception = perception;
    this.strength = strength;
    this.gender = gender; 
    this.position = position;
    this.hydration = 10;
    this.satiety = 10;
    this.dateOfBirth = new Date();
    this.dateOfDeath = null;
  }
  addWater(){
    this.hydration += 3;
    if (this.hydration > 10){
      this.hydration = 10;
    }
  }
  addPrarie(){
    this.satiety += 2;
    if (this.satiety > 10){
      this.satiety = 10;
    }
  }
  coutDeplacement(){
    this.hydration -= 1;
    this.satiety -= 0.5;
  }
  coutArret(){
    this.hydration -= 0.5;
    this.satiety -= 0.25;
  }
  isCreatureDead() {
    if (this.hydration <= 0 || this.satiety <= 0){
      this.dateOfDeath = new Date();
      return true;
    }
    else{
      return false;
    }
  }
}

class Female extends Creature {
  constructor(reproductionRate, perception, strength, position) {
    super(reproductionRate, perception, strength, 'female', position);
  }
}

class Male extends Creature{
  constructor(reproductionRate, perception, strength, position) {
    super(reproductionRate, perception, strength, 'male', position);
  }
}

module.exports = { Female, Male };