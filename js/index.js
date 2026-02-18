const container = document.getElementById('chess-table');
const ul = document.createElement('ul');
const rows = 8;
const cols = 8;
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const chiffres = ['1', '2', '3', '4', '5', '6', '7', '8'];

// game state
let currentPlayer = 'white'; // whose turn it is
let playerColor = null;      // human player's color (white or black)
let gameActive = false;      // flag to disable interaction when over
let moveHistory = [];        // stack for undo
let gameMode = 'pvp';        // 'pvp' or 'ai'
let aiDifficulty = 1;        // 1-4
let aiThinking = false;      // to prevent double clicks while AI is thinking
let stockfish = null;        // Not used, using Lichess API instead

// Lichess API for best move analysis
async function getLichessBestMove(fen, depth = 20){
    try {
        const response = await fetch(`https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=1`);
        const data = await response.json();
        if(data.pvs && data.pvs[0] && data.pvs[0].moves){
            // return first move in UCI format (e2e4)
            return data.pvs[0].moves.split(' ')[0];
        }
        return null;
    } catch(e){
        console.warn('Lichess API error:', e);
        return null;
    }
}

// Convert board to FEN notation for Stockfish
function getBoardFEN(){
    let fen = '';
    for(let row = 8; row >= 1; row--){
        let empty = 0;
        for(let col = 0; col < 8; col++){
            const square = document.getElementById(letters[col] + row);
            if(!square || !square.textContent){
                empty++;
            } else {
                if(empty > 0) fen += empty;
                empty = 0;
                const piece = square.textContent;
                const isWhite = square.style.color === 'white';
                // Convert piece symbols to FEN notation
                let fenPiece = '';
                switch(piece){
                    case '♟': fenPiece = 'p'; break; // pion
                    case '♜': fenPiece = 'r'; break; // tour
                    case '♞': fenPiece = 'n'; break; // cavalier
                    case '♝': fenPiece = 'b'; break; // fou
                    case '♛': fenPiece = 'q'; break; // reine
                    case '♚': fenPiece = 'k'; break; // roi
                }
                fen += isWhite ? fenPiece.toUpperCase() : fenPiece;
            }
        }
        if(empty > 0) fen += empty;
        if(row > 1) fen += '/';
    }
    // add side to move and other FEN info
    const sideToMove = currentPlayer === 'white' ? 'w' : 'b';
    fen += ' ' + sideToMove + ' KQkq - 0 1';
    return fen;
}

function updateStatus(){
    const status = document.getElementById('status');
    if(!status) return;
    let prefix = 'Tour : ';
    const col = currentPlayer === 'white' ? 'Blanc' : 'Noir';
    let text = prefix + col;
    if(gameMode === 'ai' && currentPlayer !== playerColor && aiThinking){
        text += ' (Stockfish pense...)';
    } else if(playerColor && playerColor !== 'both'){
        text += currentPlayer === playerColor ? ' (votre tour)' : ' (adversaire)';
    }
    status.textContent = text;
}

// determine if king of given color is under attack
function isKingInCheck(color){
    // find king square
    let kingSq = null;
    AllSquare.forEach(el => {
        if(el.textContent === '♚' && el.style.color === color){
            kingSq = el.id;
        }
    });
    if(!kingSq) return false; // no king (already captured)
    // generate all moves of opposite color
    const enemy = color === 'white' ? 'black' : 'white';
    const moves = generateAllMoves(enemy);
    return moves.includes(kingSq);
}

function generateAllMoves(color){
    let accum = [];
    AllSquare.forEach(el => {
        if(el.textContent && el.style.color === color){
            let pt = null;
            switch(el.textContent){
                case '♜': pt='tour'; break;
                case '♞': pt='cavalier'; break;
                case '♝': pt='fou'; break;
                case '♛': pt='reine'; break;
                case '♚': pt='roi'; break;
                case '♟': pt='pion'; break;
            }
            if(pt){
                const moveObj = new Move(pt, el.id, el.style.color);
                accum = accum.concat(moveObj.movePossible(AllSquare));
            }
        }
    });
    return accum;
}

function checkGameState(){
    if(!gameActive) return;
    const status = document.getElementById('status');
    // if the current player's king no longer exists, opponent just captured it => checkmate
    let kingExists = false;
    AllSquare.forEach(el => {
        if(el.textContent === '♚' && el.style.color === currentPlayer){
            kingExists = true;
        }
    });
    if(!kingExists){
        status.textContent = 'Échec et mat – ' + (currentPlayer === 'white' ? 'Blanc' : 'Noir') + ' perd';
        gameActive = false;
        disablePostGameButtons();
        return;
    }

    const inCheck = isKingInCheck(currentPlayer);
    const allMoves = generateAllMoves(currentPlayer);
    if(inCheck){
        if(allMoves.length === 0){
            status.textContent = 'Échec et mat – ' + (currentPlayer === 'white' ? 'Blanc' : 'Noir') + ' perd';
            gameActive = false;
            disablePostGameButtons();
        } else {
            status.textContent = status.textContent + ' (échec)';
        }
    } else {
        if(allMoves.length === 0){
            status.textContent = 'Pat – partie nulle';
            gameActive = false;
            disablePostGameButtons();
        }
    }
}

function disablePostGameButtons(){
    document.getElementById('undoMove').disabled = true;
    document.getElementById('resign').disabled = true;
}

function movePiece(fromSquare, toSquare){
    // save history entry before mutating
    moveHistory.push({
        fromId: fromSquare.id,
        toId: toSquare.id,
        piece: fromSquare.textContent,
        color: fromSquare.style.color,
        captured: toSquare.textContent || '',
        capturedColor: toSquare.style.color || ''
    });
    // history changed, allow undo
    const undoBtn = document.getElementById('undoMove');
    if(undoBtn) undoBtn.disabled = false;

    const wasActive = selectedHighlighted;

    // move piece
    toSquare.textContent = fromSquare.textContent;
    toSquare.style.color = fromSquare.style.color;
    fromSquare.textContent = '';
    fromSquare.style.color = '';

    AllSquare.forEach(el => el.style.boxShadow = 'none');

    selectedPiece = toSquare;
    if(wasActive && selectedPiece.textContent){
        let pt = null;
        switch (toSquare.textContent) {
            case '♜': pt='tour'; break;
            case '♞': pt='cavalier'; break;
            case '♝': pt='fou'; break;
            case '♛': pt='reine'; break;
            case '♚': pt='roi'; break;
            case '♟': pt='pion'; break;
        }
        if(pt){
            const moveObj = new Move(pt, toSquare.id, toSquare.style.color);
            selectedMoves = moveObj.movePossible(AllSquare);
        } else {
            selectedMoves = [];
        }
        selectedMoves.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.style.boxShadow = 'inset 0 0 20px rgba(0, 255, 0, 1)';
        });
    } else {
        selectedMoves = [];
    }
    selectedHighlighted = wasActive;
    updateButtonState(document.getElementById('toggleMoves'));

    // after move update status and check conditions
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    updateStatus();
    checkGameState();

    AllSquare = [...document.getElementsByClassName('piece')];
    
    // if AI vs human and it's now AI's turn, schedule move
    if(gameMode === 'ai' && gameActive && currentPlayer !== playerColor){
        setTimeout(() => scheduleAIMove(), 800);
    }
}

function makeAIMove(){
    if(aiThinking || !gameActive) return;
    aiThinking = true;
    
    // get FEN position
    const fen = getBoardFEN();
    
    // based on difficulty, add delay and randomness
    let delay = 500;
    let useRandom = false;
    
    if(aiDifficulty === 1){
        delay = 300;
        useRandom = true; // level 1: mostly random
    } else if(aiDifficulty === 2){
        delay = 600;
        useRandom = Math.random() < 0.4; // 40% random
    } else if(aiDifficulty === 3){
        delay = 1000;
        useRandom = Math.random() < 0.1; // 10% random
    } else if(aiDifficulty === 4){
        delay = 1200;
        useRandom = false; // always best
    }
    
    setTimeout(async () => {
        try {
            let moveUCI = null;
            
            if(useRandom){
                // pick random legal move for easy levels
                moveUCI = getRandomMove();
            } else {
                // get best move from Lichess API
                moveUCI = await getLichessBestMove(fen);
            }
            
            if(moveUCI && moveUCI.length >= 4){
                const fromSquare = moveUCI.substring(0, 2);
                const toSquare = moveUCI.substring(2, 4);
                
                const source = document.getElementById(fromSquare);
                const dest = document.getElementById(toSquare);
                
                if(source && dest && source.textContent){
                    movePiece(source, dest);
                } else {
                    // fallback
                    makeRandomAIMove();
                }
            } else {
                makeRandomAIMove();
            }
        } catch(e){
            console.error('AI move error:', e);
            makeRandomAIMove();
        } finally {
            aiThinking = false;
        }
    }, delay);
}

function getRandomMove(){
    const allMoves = generateAllMoves(currentPlayer);
    if(allMoves.length === 0) return null;
    return allMoves[Math.floor(Math.random() * allMoves.length)];
}

function makeRandomAIMove(){
    // fallback: pick random legal move
    const allMoves = generateAllMoves(currentPlayer);
    if(allMoves.length === 0){
        return;
    }
    
    const randomDest = allMoves[Math.floor(Math.random() * allMoves.length)];
    // find source for this move
    for(let p of AllSquare){
        if(!p.textContent || p.style.color !== currentPlayer) continue;
        let pt = null;
        switch(p.textContent){
            case '♜': pt='tour'; break;
            case '♞': pt='cavalier'; break;
            case '♝': pt='fou'; break;
            case '♛': pt='reine'; break;
            case '♚': pt='roi'; break;
            case '♟': pt='pion'; break;
        }
        if(!pt) continue;
        const moveObj = new Move(pt, p.id, p.style.color);
        if(moveObj.movePossible(AllSquare).includes(randomDest)){
            const dest = document.getElementById(randomDest);
            if(dest){
                movePiece(p, dest);
            }
            return;
        }
    }
}

function scheduleAIMove(){
    makeAIMove();
}

// handle start game / additional buttons
window.addEventListener('DOMContentLoaded', () => {
    const gameModeSel = document.getElementById('gameMode');
    const colorLabel = document.getElementById('colorLabel');
    const colorSelect = document.getElementById('colorSelect');
    const diffLabel = document.getElementById('diffLabel');
    const diffSelect = document.getElementById('difficultySelect');
    const startBtn = document.getElementById('startGame');
    const undoBtn = document.getElementById('undoMove');
    const resignBtn = document.getElementById('resign');
    const restartBtn = document.getElementById('restart');

    // handle game mode change
    if(gameModeSel){
        gameModeSel.addEventListener('change', (e) => {
            gameMode = e.target.value;
            if(gameMode === 'pvp'){
                colorLabel.style.display = 'none';
                colorSelect.style.display = 'none';
                diffLabel.style.display = 'none';
                diffSelect.style.display = 'none';
            } else {
                colorLabel.style.display = 'inline';
                colorSelect.style.display = 'inline';
                diffLabel.style.display = 'inline';
                diffSelect.style.display = 'inline';
            }
        });
    }

    if(startBtn){
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(gameMode === 'pvp'){
                playerColor = 'both'; // both are human
            } else {
                playerColor = colorSelect.value;
                aiDifficulty = parseInt(diffSelect.value);
            }
            currentPlayer = 'white';
            gameActive = true;
            moveHistory = [];
            updateStatus();
            gameModeSel.disabled = true;
            colorSelect.disabled = true;
            diffSelect.disabled = true;
            startBtn.disabled = true;
            if(undoBtn) undoBtn.disabled = false;
            if(resignBtn) resignBtn.disabled = false;
            
            // if AI is black and starts, trigger AI move
            if(gameMode === 'ai' && playerColor === 'white'){
                setTimeout(() => scheduleAIMove(), 500);
            }
        });
    }
    if(undoBtn){
        undoBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            undoMove();
        });
    }
    if(resignBtn){
        resignBtn.addEventListener('click',(e)=>{
            e.preventDefault();
            gameActive = false;
            const status = document.getElementById('status');
            status.textContent = 'Partie abandonnée' + (gameMode === 'ai' ? ' – vous avez perdu' : '');
            disablePostGameButtons();
        });
    }
    if(restartBtn){
        restartBtn.addEventListener('click',(e)=>{
            e.preventDefault();
            restartGame();
        });
    }
});



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
    // keep enabled when a piece is selected or when the toggle is active
    btn.disabled = !selectedPiece && !selectedHighlighted;
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
            // ignore clicks until a game has been started or after it ends, or AI is thinking
            if(playerColor === 'both' || !gameActive || aiThinking) return;

            const square = document.getElementById(squareId);
            const content = square.textContent;
            const sqColor = square.style.color;

            // if moving and clicked square is a legal destination
            if(selectedPiece && selectedMoves.includes(squareId)){
                movePiece(selectedPiece, square);
                return;
            }

            // try to select a piece only if it belongs to the current player
            let pieceType = null;
            switch (content) {
                case '♜': pieceType='tour'; break;
                case '♞': pieceType='cavalier'; break;
                case '♝': pieceType='fou'; break;
                case '♛': pieceType='reine'; break;
                case '♚': pieceType='roi'; break;
                case '♟': pieceType='pion'; break;
                default: pieceType=null;
            }

            // reset previous highlights
            AllSquare.forEach(el => el.style.boxShadow = 'none');
            const wasActive = selectedHighlighted;
            selectedMoves = [];

            // mark chosen piece visually
            if(pieceType && sqColor === currentPlayer){
                square.style.boxShadow = 'inset 0 0 10px rgba(255,0,0,0.8)';
                const moveObj = new Move(pieceType, square.id, square.style.color);
                selectedMoves = moveObj.movePossible(AllSquare);
                selectedPiece = square;
                selectedHighlighted = wasActive;
            } else {
                selectedPiece = null;
                selectedHighlighted = false;
            }

            // refresh UI states
            const btn = document.getElementById('toggleMoves');
            updateButtonState(btn);
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
// initialize status (before game start shows Tour : --)
updateStatus();

function undoMove(){
    if(moveHistory.length === 0) return;
    const last = moveHistory.pop();
    const from = document.getElementById(last.fromId);
    const to = document.getElementById(last.toId);
    if(from && to){
        from.textContent = last.piece;
        from.style.color = last.color;
        to.textContent = last.captured;
        to.style.color = last.capturedColor;
    }
    // switch turn back
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    // reactivate game if it was over
    gameActive = true;
    updateStatus();
    // clear selection/highlight
    AllSquare.forEach(el => el.style.boxShadow = 'none');
    selectedPiece = null;
    selectedMoves = [];
    selectedHighlighted = false;
    updateButtonState(document.getElementById('toggleMoves'));
    // re-enable resign button
    document.getElementById('resign').disabled = false;
    if(moveHistory.length === 0){
        document.getElementById('undoMove').disabled = true;
    }
    checkGameState();
}

function restartGame(){
    // simple full reset: reload page as easiest path
    window.location.reload();
}
