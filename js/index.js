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
    movePossible(allSquares){
        // build a simple board lookup for occupancy and colors
        const board = {};
        allSquares.forEach(el => {
            board[el.id] = {piece: el.textContent, color: el.style.color || null};
        });

        const pos = this.position;
        const colIdx = letters.indexOf(pos[0]);
        const rowIdx = chiffres.indexOf(pos[1]);

        const inBounds = (c,r) => c>=0 && c<8 && r>=0 && r<8;

        const addStep = (moves, c, r) => {
            const square = letters[c] + chiffres[r];
            if(!board[square] || board[square].piece === ''){
                moves.push(square);
                return true; // continue sliding
            } else {
                // occupied
                if(board[square].color !== this.color){
                    moves.push(square); // can capture enemy
                }
                return false; // block further moves
            }
        };

        switch(this.pieceType){
            case 'tour': {
                const moves = [];
                const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
                dirs.forEach(([dc,dr]) => {
                    let c = colIdx + dc;
                    let r = rowIdx + dr;
                    while(inBounds(c,r) && addStep(moves,c,r)){
                        c += dc;
                        r += dr;
                    }
                });
                return moves;
            }
            case 'cavalier': {
                const moves = [];
                const jumps = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]];
                jumps.forEach(([dc,dr]) => {
                    const c = colIdx + dc;
                    const r = rowIdx + dr;
                    if(inBounds(c,r)){
                        const square = letters[c]+chiffres[r];
                        if(!board[square] || board[square].piece === '' || board[square].color !== this.color){
                            moves.push(square);
                        }
                    }
                });
                return moves;
            }
            case 'fou': {
                const moves = [];
                const dirs = [[1,1],[1,-1],[-1,1],[-1,-1]];
                dirs.forEach(([dc,dr]) => {
                    let c = colIdx + dc;
                    let r = rowIdx + dr;
                    while(inBounds(c,r) && addStep(moves,c,r)){
                        c += dc;
                        r += dr;
                    }
                });
                return moves;
            }
            case 'reine': {
                const moves = [];
                const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
                dirs.forEach(([dc,dr]) => {
                    let c = colIdx + dc;
                    let r = rowIdx + dr;
                    while(inBounds(c,r) && addStep(moves,c,r)){
                        c += dc;
                        r += dr;
                    }
                });
                return moves;
            }
            case 'roi': {
                const moves = [];
                for(let dc=-1; dc<=1; dc++){
                    for(let dr=-1; dr<=1; dr++){
                        if(dc===0 && dr===0) continue;
                        const c = colIdx + dc;
                        const r = rowIdx + dr;
                        if(inBounds(c,r)){
                            const sq = letters[c]+chiffres[r];
                            if(!board[sq] || board[sq].piece === '' || board[sq].color !== this.color){
                                moves.push(sq);
                            }
                        }
                    }
                }
                return moves;
            }
            case 'pion': {
                const moves = [];
                const forward = this.color === 'white' ? 1 : -1;
                const startRow = this.color === 'white' ? 1 : 6;
                // forward move
                let r = rowIdx + forward;
                let c = colIdx;
                if(inBounds(c,r) && (!board[letters[c]+chiffres[r]] || board[letters[c]+chiffres[r]].piece === '')){
                    moves.push(letters[c]+chiffres[r]);
                    if(rowIdx === startRow){
                        r = rowIdx + 2*forward;
                        if(inBounds(c,r) && (!board[letters[c]+chiffres[r]] || board[letters[c]+chiffres[r]].piece === '')){
                            moves.push(letters[c]+chiffres[r]);
                        }
                    }
                }
                // capture diagonals
                [[1,forward],[-1,forward]].forEach(([dc,dr])=>{
                    const cc = colIdx + dc;
                    const rr = rowIdx + dr;
                    if(inBounds(cc,rr)){
                        const sq = letters[cc]+chiffres[rr];
                        if(board[sq] && board[sq].piece !== '' && board[sq].color && board[sq].color !== this.color){
                            moves.push(sq);
                        }
                    }
                });
                return moves;
            }
            default:
                return [];
        }
    }
}

// keep track of a clicked piece and its potential moves
let selectedPiece = null;
let selectedMoves = [];
let selectedHighlighted = false; // whether the moves are currently displayed

// update visual state of the toggle button
function updateButtonState(btn){
    if(!btn) return;
    btn.disabled = !selectedPiece; // disabled when no piece selected
    if(selectedHighlighted){
        btn.classList.add('active');
        btn.textContent = 'Masquer mouvements';
    } else {
        btn.classList.remove('active');
        btn.textContent = 'Afficher mouvements';
    }
}

// button element will be wired once the board is built
function wireToggleButton(){
    const btn = document.getElementById('toggleMoves');
    if(!btn) return;
    btn.disabled = true;
    btn.addEventListener('click', () => {
        if(!selectedPiece) return;
        if(!selectedHighlighted){
            // highlight previously computed moves
            selectedMoves.forEach(id => {
                const el = document.getElementById(id);
                if(el) el.style.boxShadow = 'inset 0 0 20px rgba(0, 255, 0, 1)';
            });
            selectedHighlighted = true;
        } else {
            // remove highlight
            selectedMoves.forEach(id => {
                const el = document.getElementById(id);
                if(el) el.style.boxShadow = 'none';
            });
            selectedHighlighted = false;
        }
        updateButtonState(btn);
    });
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
        if (initialPieces[0][squareId]) {
            p.textContent = initialPieces[0][squareId];
            
        }else if(initialPieces[1][squareId]){
            p.textContent = initialPieces[1][squareId];

        }
        
        // Ajouter un effet de clic

        p.addEventListener('click', function() {
            // when a square is clicked we record selection but do not highlight until the button is pressed
            const square = document.getElementById(squareId);
            // determine piece type
            switch (square.textContent) {
                case '♜': pieceType='tour'; break;
                case '♞': pieceType='cavalier'; break;
                case '♝': pieceType='fou'; break;
                case '♛': pieceType='reine'; break;
                case '♚': pieceType='roi'; break;
                case '♟': pieceType='pion'; break;
                default: pieceType=null;
            }

            // clear any existing highlights
            AllSquare.forEach(el => el.style.boxShadow = 'none');
            selectedMoves = [];
            // if the button was active we will reapply highlights below

            if(pieceType){
                const moveObj = new Move(pieceType, square.id, square.style.color);
                selectedMoves = moveObj.movePossible(AllSquare);
                selectedPiece = square;
            } else {
                selectedPiece = null;
            }

            // update button enablement/text/class
            const btn = document.getElementById('toggleMoves');
            updateButtonState(btn);

            // if the toggle was in 'active' mode (highlighted) and we have a new selection,
            // immediately show the computed moves
            if(selectedPiece && selectedHighlighted){
                selectedMoves.forEach(id => {
                    const el = document.getElementById(id);
                    if(el) el.style.boxShadow = 'inset 0 0 20px rgba(0, 255, 0, 1)';
                });
            }
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
// after DOM squares exist we can wire the toggle button and update the AllSquare list
wireToggleButton();

var AllSquare = [...document.getElementsByClassName('piece')];
