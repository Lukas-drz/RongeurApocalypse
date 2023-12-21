
class Banane {
    constructor(propriétaire,position) {
        this.propriétaire = propriétaire;
        this.position = position;

        this.cooldown = 0;
        this.tirsRestants = 4;

    }


    tirer(jeu){

        var joueur;//Calcul de l'état du propriétaire pour ne pas fiare de tirs alliés
        for (var j of jeu.joueurs){
            if (j.pseudo==this.propriétaire){
                joueur = j;
            }
        }


        if (this.tirsRestants==0){//Destruction des bananes mortes
             joueur.bananes = joueur.bananes.filter((elem)=>elem!=this);    
              };
        

if (this.cooldown<1){
            var distance = 3;//Même principe que lorsque les créatures cherchent leur cible
            var cible;
            var possiblePositions = [];
            possiblePositions.push(this.position);
            var besoin;

            
            for (i=0;i<distance;i++){
              var tablo = [];//pour éviter le bouclage infini
              for (let element of possiblePositions){

                  for (let j of jeu.casesAdjacentes(element)){

                      if (!jeu.tanières.includes(j)&&jeu.board[j]!=0&&!joueur.creatures.includes(jeu.board[j])){
                        jeu.board[j].tuer(jeu);
                        this.cooldown = 3;
                        this.tirsRestants--;
                        return;
                      };
                      if (!tablo.includes(j)&&!jeu.tanières.includes(j))
                      {tablo.push(j)};
                    }
                  }
                  possiblePositions=tablo;
                   }
                }
                   if (this.cooldown>0){this.cooldown--};
         
       
    }




}
module.exports = { Banane };