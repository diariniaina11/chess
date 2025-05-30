const container = document.getElementById('chess-table');
const ul = document.createElement('ul');
const rows = 8;
const cols = 8;
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const chiffres = ['1', '2', '3', '4', '5', '6', '7', '8'];


// Pièces d'échecs initiales
const initialPieces = [
    {'a8': '♜', 'b8': '♞', 'c8': '♝', 'd8': '♛', 'e8': '♚', 'f8': '♝', 'g8': '♞', 'h8': '♜',
    'a7': '♟', 'b7': '♟', 'c7': '♟', 'd7': '♟', 'e7': '♟', 'f7': '♟', 'g7': '♟', 'h7': '♟',},
    
    {'a2': '♟', 'b2': '♟', 'c2': '♟', 'd2': '♟', 'e2': '♟', 'f2': '♟', 'g2': '♟', 'h2': '♟',
    'a1': '♜', 'b1': '♞', 'c1': '♝', 'd1': '♛', 'e1': '♚', 'f1': '♝', 'g1': '♞', 'h1': '♜'}
];

const piece={
    'tour': '♜','cavalier': '♞', 'fou': '♝', 'reine': '♛', 'roi': '♚', 'pion': '♟'
}

class Piece{
    type;
    color;
    direction;
    position
    constructor(color, type, direction, position){
        this.color=color;
        this.type=type;
        this.direction=direction;//
        this.position=position;//'a1'
    }
}
class Move{
    end;
    position;
    pieceType;
    color;
    constructor(pieceType, position, color){
        this.position=position;
        this.pieceType=pieceType;
        this.color=color;
    }
    movePossible(){
        
        const position=this.position;
        switch (this.pieceType) {
            case 'tour':
                var ligne=position[0];
                var colonne=position[1];
                var moveHorizontal=[];
                for(let i=0;i<8;i++){
                    moveHorizontal.push(position[0]+String(i+1));
                    
                }
                var moveVertical=[];
                for(let i=0;i<8;i++){
                    moveVertical.push(letters[i]+position[1]);
                }
                moveHorizontal.splice(moveHorizontal.indexOf(position), 1);
                moveVertical.splice(moveVertical.indexOf(position), 1);

                return [...moveHorizontal,...moveVertical];
                
            case 'cavalier':
                

                var movesPossibles=[];
                var ligne=letters.indexOf(position[0]);
                var colonne=chiffres.indexOf(position[1]);

                movesPossibles.push(letters[ligne+2]+chiffres[colonne+1]);
                movesPossibles.push(letters[ligne+2]+chiffres[colonne-1]);
                movesPossibles.push(letters[ligne-2]+chiffres[colonne+1]);
                movesPossibles.push(letters[ligne-2]+chiffres[colonne-1]);
                movesPossibles.push(letters[ligne+1]+chiffres[colonne+2]);
                movesPossibles.push(letters[ligne-1]+chiffres[colonne+2]);
                movesPossibles.push(letters[ligne+1]+chiffres[colonne-2]);
                movesPossibles.push(letters[ligne-1]+chiffres[colonne-2]);
                
                return movesPossibles;
            case 'fou':
                var movesPossibles=[];
                var ligne=letters.indexOf(position[0]);
                var colonne=chiffres.indexOf(position[1]);

                for(let i=ligne, j=colonne;i<7 || j<7;i++, j++){
                    movesPossibles.push(letters[i+1]+chiffres[j+1]);
                              
                }
                
                for(let i=ligne+1, j=colonne-1;i<=7 || 0<=j;i++, j--){
                    movesPossibles.push(letters[i]+chiffres[j]);     
                    

                }

                for(let i=ligne, j=colonne;0<i || 0<j;i--, j--){
                    movesPossibles.push(letters[i-1]+chiffres[j-1]); 
                    

                }

                for(let i=ligne-1, j=colonne+1;0<=i || j<=7;i--, j++){
                    movesPossibles.push(letters[i]+chiffres[j]); 
                }

                const filteredList = movesPossibles.filter(item => !item.includes("undefined"));

                return filteredList;
            case 'reine':
                
                
                var movesPossibles=[];
                var ligne=letters.indexOf(position[0]);
                var colonne=chiffres.indexOf(position[1]);
                
                for(let i=ligne, j=colonne;i<7 || j<7;i++, j++){
                    movesPossibles.push(letters[i+1]+chiffres[j+1]);
                              
                }
                
                for(let i=ligne+1, j=colonne-1;i<=7 || 0<=j;i++, j--){
                    movesPossibles.push(letters[i]+chiffres[j]);     
                    

                }

                for(let i=ligne, j=colonne;0<i || 0<j;i--, j--){
                    movesPossibles.push(letters[i-1]+chiffres[j-1]); 
                    

                }

                for(let i=ligne-1, j=colonne+1;0<=i || j<=7;i--, j++){
                    movesPossibles.push(letters[i]+chiffres[j]); 
                }

                movesPossibles = movesPossibles.filter(item => !item.includes("undefined"));


                var ligne=position[0];
                var colonne=position[1];
                var moveHorizontal=[];
                for(let i=0;i<8;i++){
                    moveHorizontal.push(position[0]+String(i+1));
                }
                var moveVertical=[];
                for(let i=0;i<8;i++){
                    moveVertical.push(letters[i]+position[1]);
                }
                
                const filteredLists = movesPossibles.filter(item => !item.includes("undefined"));
                moveHorizontal.splice(moveHorizontal.indexOf(position), 1);
                moveVertical.splice(moveVertical.indexOf(position), 1);


                return [...moveHorizontal,...moveVertical,...filteredLists];
            case 'roi':
                var movesPossibles=[];
                var ii=letters.indexOf(position[0])-1;
                var jj=chiffres.indexOf(position[1])-1;
                
                
                for(let i=2;0<=i;i--){
                    for(let j=0;j<3;j++){
                        movesPossibles.push(letters[ii+j]+chiffres[jj+i]);
                    }
                }
                
                movesPossibles.splice(movesPossibles.indexOf(position), 1);
                const filteredListsss = movesPossibles.filter(item => !item.includes("undefined"));

                return filteredListsss;
            case 'pion':
                
                if(this.color=='white'){
                    var movesPossibles=[];
                    var colonne=letters.indexOf(position[0]);
                    var ligne=chiffres.indexOf(position[1]);
                    movesPossibles.push(letters[colonne] +chiffres[ligne+1]);
                    if(parseInt(position[1])==2){
                        movesPossibles.push(letters[colonne] +chiffres[ligne+2]);
                    }
                }else{
                    var movesPossibles=[];
                    var colonne=letters.indexOf(position[0]);
                    var ligne=chiffres.indexOf(position[1]);
                    movesPossibles.push(letters[colonne] +chiffres[ligne-1]);
                    if(parseInt(position[1])==7){
                        movesPossibles.push(letters[colonne] +chiffres[ligne-2]);
                    }
                }
                
                return movesPossibles;
            default:
                return "tsis";
        }
    }
    
}
var movesPossiblesContainer=[];



for (let row = 0; row < rows; row++) {
    const li = document.createElement('li');
    
    for (let col = 0; col < cols; col++) {
        const p = document.createElement('p');
        const squareId = letters[col] + (rows - row);
        
        p.id = squareId;
        p.classList.add('piece');
        
        // Alterner les classes pour le fond noir et blanc
        if ((row + col) % 2 === 0) {
            p.classList.add('white');

        } else {
            p.classList.add('black');
        }
        
        // Ajouter les pièces initiales
        if (initialPieces[0][squareId]) {
            p.textContent = initialPieces[0][squareId];
            
        }else if(initialPieces[1][squareId]){
            p.textContent = initialPieces[1][squareId];

        }
        
        // Ajouter un effet de clic

        p.addEventListener('click', function() {
            //console.log('Cliqué sur la case:', squareId);
            square=document.getElementById(squareId);
            //console.log(square.textContent);
            //console.log(square.style.color);

            //move possible
            switch (square.textContent) {
                case '♜':
                    pieceType='tour';
                    break;
                case '♞':
                    pieceType='cavalier';
                    break;
                case '♝':
                    pieceType='fou';
                    break;
                case '♛':
                    pieceType='reine';
                    break;
                case '♚':
                    pieceType='roi';
                    break;
                case '♟':
                    pieceType='pion';
                    break;
                default:
                    pieceType=null;
            }
            AllSquare.forEach(element => {
                element.style.boxShadow = 'none';
            }
            );
            movesPossiblesContainerLenght=movesPossiblesContainer.length;
            
            movesPossiblesContainer.push(new Move(pieceType,square.id, square.style.color)) ;//pieceType, position, color
            movesPossiblesContainer.push(new Move(pieceType,square.id, square.style.color)) ;//pieceType, position, color
            //console.log(movesPossiblesContainer);
            
            
            
            move_used= movesPossiblesContainer[movesPossiblesContainerLenght].movePossible()
            

            move_used.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    
                    element.style.boxShadow = 'inset 0 0 20px rgba(0, 255, 0, 1)';
                    
                }
              });

        });
        if(row<2){
            p.style.color='black';
            p.style.transform='rotate(180deg)';
        }else if(row>5){
            p.style.color='white';
        }
        
        li.appendChild(p);

    }
    ul.appendChild(li);
}





// Ajouter la liste au conteneur
container.appendChild(ul);
//alert(document.getElementById('a8').textContent);

var AllSquare = [...document.getElementsByClassName('piece')]
