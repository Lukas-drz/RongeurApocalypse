class Creature {
  // ajouter reproduction
  constructor(reproductionRate, perception, strength, gender, position,postaniere) {
    // Chaque joueur doit distribuer 9 points sur trois axes valués de 1 à 5 :
    this.reproductionRate = reproductionRate;
    this.perception = perception;
    this.strength = strength;
    this.gender = gender; 
    this.position = position;
    this.cible = position;
    this.tanière = postaniere;
    this.hydration = 5;
    this.satiety = 5;
    this.cooldown = 5;
    this.dateOfBirth = new Date();
    this.dateOfDeath = null;
    var nom = "";
    var syllabes = ["ta","to","ti","tu","te","mu","pa","po","pom","pi","ra","ka","ja","fa","fi","ji","lo","li","la","moissat","ju","lu","ron","ton","pang","dong","wa","rio","piou","za","zo","fa","coco","ja","dor"]
    var syllabe = Math.floor(Math.random() * 3) + 2;
    for (var sylcourante=0;sylcourante<syllabe;sylcourante++){
      nom += syllabes[Math.floor(Math.random()*syllabes.length)];
    }
    if (Math.random() * 100<3){nom+= " De Savigne.";this.strength++;this.perception++;}//Créature noble
    this.nom = nom;
    if (this.nom=="pompidor"){this.strength=40;}

  }
  addWater(){
    this.hydration += 3;
    if (this.hydration > 10){
      this.hydration = 10;
    }
  }
  addPrairie(){
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
    this.coutDeplacement();
    if (arrivee==this.tanière){
      jeu.board[this.tanière].push(this)
    }
    else{
      jeu.board[arrivee] = this;}

      if (this.position==this.tanière){
        jeu.board[this.position]=jeu.board[this.position].filter((elem)=>elem!=this);
      }
      else{
      jeu.board[this.position] = 0;
      }
      this.position = arrivee;

  }



  //Fonction calculant la case sur laquelle la cible tentera de se rendre.
  findCible(jeu){
    var distance = this.perception;
    var cible;
    var possiblePositions = [];
    possiblePositions.push(this.position);
    var besoin;
    if (this.cible==this.tanière&&this.satiety>3&&this.hydration>4&&this.cooldown==0&&jeu.board[this.tanière].length<7){this.cible=this.tanière;return;}
    if (this.satiety>=6&&this.hydration>=6&&this.cooldown==0&&jeu.board[this.tanière].length<5){this.cible=this.tanière;return;}


    if (this.hydration<=this.satiety){besoin = "eau"}
    else{besoin = "plaine"}
    if ((jeu.terrain[this.position]==besoin||jeu.terrain[this.position]=="pasteque")){this.cible=this.position;return;}


    possiblePositions.push(this.position)
    
    for (i=0;i<distance;i++){
      var tablo = [];//pour éviter le bouclage infini
      for (let element of possiblePositions){
          for (let j of jeu.casesAdjacentes(element)){
              if (((jeu.terrain[j]==besoin||jeu.terrain[j]=="pasteque")&&(jeu.board[j]==0)||(((jeu.board[j].strength<this.strength&&(jeu.board[j].tanière!=this.tanière)))))){this.cible=j;return;}
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
    if (this.tanière==poussee.tanière){return false;}
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
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }

          if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])}
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }

          tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
          if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]-1])}
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
          return;

        
        }
        else{//Cas où la cible est sur une ligne plus haute que l'animal
          tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
          if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]-1])}
          
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }
          if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])}
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
          return;
        }
      }

      else{


        //-------------------------------------------------------------------------------------------------------------------------------
        if (jeu.getAxis(this.cible)[0]<jeu.getAxis(this.position)[0]){//Cas où la cible est sur une colonne à gauche de celle de l'animal

          if (jeu.getAxis(this.cible)[1]==jeu.getAxis(this.position)[1]){//Cas où la cible est sur la même ligne que celle de l'animal
            
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }

            if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]-1])}
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }

            if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]+1])}
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }

            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }


            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }

            if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])}
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }
            return;
          }
          
          else{
          if (jeu.getAxis(this.cible)[1]>jeu.getAxis(this.position)[1]){//cas où la cible est sur une ligne plus basse que celle de l'animal
            
            if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]+1])}
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }

            tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }

            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }
            if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]-1])}
          
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }

            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }
            return;

        
        }
        else{//Cas où la cible est sur une ligne plus haute que l'animal

          if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]-1])}
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          } 

          if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]+1])}
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          } 
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
       
          tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
          tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }

          if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])}
          
          if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
            this.deplacement(tentative,jeu);return;
          }
          //OK
          
          return;

        }
      }
    }
        
        //----------------------------------------------------------------------------------------------------------------------------------
       else{//Cas où la cible est sur une colonne à droite de celle de l'animal

          if (jeu.getAxis(this.cible)[1]==jeu.getAxis(this.position)[1]){//Cas où la cible est sur la même ligne que celle de l'animal
            
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }
            if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])}
          
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }
            if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])}
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }
            //OK
            tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }

            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }
            tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
            if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
              this.deplacement(tentative,jeu);return;
            }
            return;
          }
          
          else{
            if (jeu.getAxis(this.cible)[1]>jeu.getAxis(this.position)[1]){//cas où la cible est sur une ligne plus basse que celle de l'animal
              
              if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])}
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
                this.deplacement(tentative,jeu);return;
              }
              
              tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
                this.deplacement(tentative,jeu);return;
              }
              tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
                this.deplacement(tentative,jeu);return;
              }
            
              if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]-1])}
          
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
                this.deplacement(tentative,jeu);return;
              }

              tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
                this.deplacement(tentative,jeu);return;
              }
              tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
                this.deplacement(tentative,jeu);return;
              }
              return;





            }
            else{//Cas où la cible est sur une ligne plus haute que l'animal

              if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]-1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]-1])}
          
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
                this.deplacement(tentative,jeu);return;
              }
              tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]-1])
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
                this.deplacement(tentative,jeu);return;
              }
              tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]])
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
                this.deplacement(tentative,jeu);return;
              }
              if (((this.position%13)%2)==1){tentative = jeu.getCase([jeu.getAxis(this.position)[0]+1,jeu.getAxis(this.position)[1]+1])}else{tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])}
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
                this.deplacement(tentative,jeu);return;
              }
              tentative = jeu.getCase([jeu.getAxis(this.position)[0]-1,jeu.getAxis(this.position)[1]])
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
                this.deplacement(tentative,jeu);return;
              }

              tentative = jeu.getCase([jeu.getAxis(this.position)[0],jeu.getAxis(this.position)[1]+1])
              if ((jeu.casesAdjacentes(this.position).includes(tentative))&&tentative>=0&&tentative<jeu.terrain.length&&jeu.terrain[tentative]!="montagne"&&(jeu.board[tentative]==0||(jeu.tanières.includes(tentative)&&tentative==this.tanière)||(this.tanière!=jeu.board[tentative].tanière&&this.pousse(jeu.board[tentative],jeu)==true&&!jeu.tanières.includes(tentative)))){
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

tuer(jeu){
  if (this.position==this.tanière){
    jeu.joueurs[jeu.tanières.indexOf(this.tanière)].creatures = jeu.joueurs[jeu.tanières.indexOf(this.tanière)].creatures.filter((elem)=>elem!=this);
    jeu.board[this.position]=jeu.board[this.position].filter((elem)=>elem!=this);
    return;
    }
  jeu.board[this.position]=0
  jeu.joueurs.forEach(element => {
    element.creatures = element.creatures.filter((elem)=>elem!=this);    
  });
  
}

jouer(jeu){
  if (this.isCreatureDead()==true){this.tuer(jeu);return;}
  
  this.findCible(jeu);
  if (this.cible==this.position){if (jeu.terrain[this.position]=="plaine"){this.addPrairie();}if (jeu.terrain[this.position]=="eau"){this.addWater()};if(jeu.terrain[this.position]=="pasteque"){this.addPrairie();this.addWater()};this.coutArret();return}
  this.versCible(jeu);
  if(jeu.terrain[this.position]=="pasteque"){this.addPrairie();this.addWater()}
  if (jeu.terrain[this.position]=="plaine"){this.addPrairie();}
  if (jeu.terrain[this.position]=="eau"){this.addWater()}
  return;



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