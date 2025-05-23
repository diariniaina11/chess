const container = document.getElementById('chess-table');
const ul = document.createElement('ul');
const rows = 8;
const cols = 8;
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const chiffres = ['1', '2', '3', '4', '5', '6', '7', '8'];


// Pièces d'échecs initiales
const initialPieces = {
    'a8': '♜', 'b8': '♞', 'c8': '♝', 'd8': '♛', 'e8': '♚', 'f8': '♝', 'g8': '♞', 'h8': '♜',
    'a7': '♟', 'b7': '♟', 'c7': '♟', 'd7': '♟', 'e7': '♟', 'f7': '♟', 'g7': '♟', 'h7': '♟',
    'a2': '♙', 'b2': '♙', 'c2': '♙', 'd2': '♙', 'e2': '♙', 'f2': '♙', 'g2': '♙', 'h2': '♙',
    'a1': '♖', 'b1': '♘', 'c1': '♗', 'd1': '♕', 'e1': '♔', 'f1': '♗', 'g1': '♘', 'h1': '♖'
};

const piece={
    'Black':{'tour': '♖','cavalier': '♘', 'fou': '♗', 'reine': '♕', 'roi': '♔', 'pion': '♙'},
    'White':{'tour': '♜','cavalier': '♞', 'fou': '♝', 'reine': '♛', 'roi': '♚', 'pion': '♟'}
}
class Piece{
    type;
    color;
    direction;
    position
    constructor(color, type, direction, position){
        this.color=color;
        this.type=type;
        this.type=direction;
        this.type=position;
    }
}
class Move{
    piece;
    start;
    end;
    constructor(piece, start, end){
        this.piece=piece;
        this.start=start;
        this.end=end;
    }
    movePossible(){
        var position=this.piece.position;
        switch (this.piece) {
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
                return [...moveHorizontal,...moveVertical];
                
            case 'cavalier':
                movesPossibles=[]
                var ligne=letters.indexOf(position[0]);
                var colonne=chiffres.indexOf(position[1]);

                moves.push(letters[ligne+2]+chiffres[colonne+1]);
                moves.push(letters[ligne+2]+chiffres[colonne-1]);
                moves.push(letters[ligne-2]+chiffres[colonne+1]);
                moves.push(letters[ligne-2]+chiffres[colonne-1]);
                moves.push(letters[ligne+1]+chiffres[colonne+2]);
                moves.push(letters[ligne-1]+chiffres[colonne+2]);
                moves.push(letters[ligne+1]+chiffres[colonne-2]);
                moves.push(letters[ligne-1]+chiffres[colonne-2]);
                
                return movesPossibles;
            case 'fou':
                movesPossibles=[];
                var ligne=letters.indexOf(position[0]);
                var colonne=chiffres.indexOf(position[1]);
                for(let i=1;i<8;i++){
                    movesPossibles.push(letters[ligne+i]+chiffres[colonne+i]);
                    movesPossibles.push(letters[ligne+i]+chiffres[colonne-i]);
                    movesPossibles.push(letters[ligne-i]+chiffres[colonne+i]);
                    movesPossibles.push(letters[ligne-i]+chiffres[colonne-i]);
                }
                return movesPossibles;
                break;
            case 'reine':
                movesPossibles=[];
                var ligne=letters.indexOf(position[0]);
                var colonne=chiffres.indexOf(position[1]);
                for(let i=1;i<8;i++){
                    movesPossibles.push(letters[ligne+i]+chiffres[colonne+i]);
                    movesPossibles.push(letters[ligne+i]+chiffres[colonne-i]);
                    movesPossibles.push(letters[ligne-i]+chiffres[colonne+i]);
                    movesPossibles.push(letters[ligne-i]+chiffres[colonne-i]);
                }





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
                break;
            case 'roi':
                
                break;
            default:
                break;
        }
    }
}



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
        if (initialPieces[squareId]) {
            p.textContent = initialPieces[squareId];
        }
        
        // Ajouter un effet de clic
        p.addEventListener('click', function() {
            console.log('Cliqué sur la case:', squareId);


        });
        
        li.appendChild(p);
    }
    ul.appendChild(li);
}

// Ajouter la liste au conteneur
container.appendChild(ul);
alert(document.getElementById('a8').textContent);
