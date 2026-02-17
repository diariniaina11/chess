<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Chess Game</title>
    <link rel="stylesheet" href="./css/index.css">
</head>
<body>
    <div class="container">
        <h1>♔ Jeu d'Échecs ♛</h1>
        <div class="controls" style="margin-bottom:15px; text-align:center; display:flex; flex-wrap:wrap; justify-content:center; gap:8px; align-items:center;">
            <label for="colorSelect" style="font-weight:bold;">Couleur :</label>
            <select id="colorSelect">
                <option value="white" selected>Blanc</option>
                <option value="black">Noir</option>
            </select>
            <button id="startGame" class="ctrl-btn">Démarrer</button>
            <button id="undoMove" class="ctrl-btn" disabled>Annuler coup</button>
            <button id="resign" class="ctrl-btn" disabled>Abandonner</button>
            <button id="restart" class="ctrl-btn">Rejouer</button>
            <p id="status" style="margin-top:8px; font-weight:bold; min-width:200px; text-align:center;">Tour : --</p>
        </div>
        <form id="chess-table">
        </form>
        <!-- bouton pour afficher/masquer les mouvements possibles -->
        <button id="toggleMoves" style="margin-top:10px; padding:8px 16px; font-size:1rem;">Afficher mouvements</button>
    </div>

    <script src="./js/index.js"></script>
</body>
</html>