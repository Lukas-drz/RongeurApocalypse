class Creature {
  // ajouter reproduction
  constructor(reproductionRate, perception, strength, gender, position,postaniere) {
    // Chaque joueur doit distribuer 9 points sur trois axes valués de 1 à 5 :
      if (reproductionRate < 1 || perception < 1 || strength < 1 || reproductionRate > 5 || perception > 5 || strength > 5 || reproductionRate + perception + strength > 9) {
        throw new Error('Les valeurs doivent être supérieures ou égales à 1 et inferieures ou egales a 5 et le total doit donner 9');
    }
    this.reproductionRate = reproductionRate;
    this.perception = perception;
    this.strength = strength;
    this.gender = gender; 
    this.position = position;
    this.cible = position;
    this.tanière = postaniere;
    this.hydration = 10;
    this.satiety = 10;
    this.cooldown = 0;
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

  deplacement(arrivee, jeu){
    this.coutDeplacement;
    jeu.board[this.position] = 0;
    jeu.board[arrivee] = this;
    this.position = arrivee;
  }



  //Fonction calculant la case sur laquelle la cible tentera de se rendre.
  findCible(jeu){
    var distance = this.perception;
    var cible;
    var possiblePositions = [];
    var besoin;
    if (this.satiety>6&&this.hydration>6){this.cible= this.tanière;return;}
    if (this.hydration+1<=this.satiety){besoin = "plaine"}
    else{besoin = "eau"}
    possiblePositions.push(this.position)
    
    for (i=0;i<distance;i++){
      var tablo = [];//pour éviter le bouclage infini
      for (let element of possiblePositions){
          for (let j of jeu.casesAdjacentes(element)){
              if ((jeu.terrain[j]==besoin)&&(jeu.board[j]==0||((jeu.board[j].strength<this.strength&&(jeu.board[j].tanière!=this.tanière))))){this.cible=j;return;}
              if (!tablo.includes(j)&&(jeu.board[j]==0||jeu.tanières.includes(j)||(jeu.board[j].strength<this.strength&&(jeu.board[j].tanière!=this.tanière))))
              {tablo.push(j)
              };
            }
          }
          possiblePositions=tablo;
           }
      this.cible= jeu.casesAdjacentes(this.position)[Math.floor(Math.random() * jeu.casesAdjacentes(this.position).length)];return;

    }
    
  pousse(poussee,jeu){   
    if (this.strength<=poussee.strength){return false;}
   for (var arrivee of jeu.casesAdjacentes(poussee.position)){
  if (jeu.board[arrivee]==0){
    poussee.deplacement(arrivee,jeu);return true;
    }
  }
  return false;
}


  versCible(jeu){//Fonction permettant de déplacer l'animal de la manière optimale en direction de sa cible
    if (this.position==this.cible){return;}
    else{
      var tentative;
      if (jeu.getAxis(this.cible)[0]==jeu.getAxis(this.position)[0]){//Cas où ils sont sur la même colonne
        if (jeu.getAxis(this.cible)[1]>jeu.getAxis(this.position)[1]){//cas où la cible est sur une ligne plus basse que celle de l'animal
          tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          return;

        
        }
        else{//Cas où la cible est sur une ligne plus haute que l'animal
          tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          return;
        }
      }

      else{


        //-------------------------------------------------------------------------------------------------------------------------------
        if (jeu.getAxis(this.cible)[0]<jeu.getAxis(this.position)[0]){//Cas où la cible est sur une colone à gauche de celle de l'animal

          if (jeu.getAxis(this.cible)[1]==jeu.getAxis(this.position)[1]){//Cas où la cible est sur la même ligne que celle de l'animal
            
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }

            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }

            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            return;
          }
          
          else{
          if (jeu.getAxis(this.cible)[1]>jeu.getAxis(this.position)[1]){//cas où la cible est sur une ligne plus basse que celle de l'animal
            
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }

            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            return;

        
        }
        else{//Cas où la cible est sur une ligne plus haute que l'animal

          tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          //OK
          tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])
          if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
            this.deplacement(tentative,jeu);return;
          }
          return;

        }
      }
    }
        
        //----------------------------------------------------------------------------------------------------------------------------------
       else{//Cas où la cible est sur une colonne à droite de celle de l'animal

          if (jeu.getAxis(this.cible)[1]==jeu.getAxis(this.position)[1]){//Cas où la cible est sur la même ligne que celle de l'animal
            
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            //OK
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }

            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
            if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
              this.deplacement(tentative,jeu);return;
            }
            return;
          }
          
          else{
            if (jeu.getAxis(this.cible)[1]>jeu.getAxis(this.position)[1]){//cas où la cible est sur une ligne plus basse que celle de l'animal
              
              tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }
              
              tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }
              tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }
            
              tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }

              tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }
              tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }
              return;





            }
            else{//Cas où la cible est sur une ligne plus haute que l'animal

              tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }
              tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }
              tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }
              tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }
              tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }

              tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
              if ((tentative>=0&&tentative>jeu.terrain.length)&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0)||(!jeu.tanières.includes(tentative)||tentative==this.tanière)||(this.pousse(jeu.board[tentative],jeu)==true)){
                this.deplacement(tentative,jeu);return;
              }
              return;
            }
          }
      }
      }
    }
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
/* Classes filles pas forcément utiles, à voir

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
*/
module.exports = { Creature };