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
        <div class="controls" style="margin-bottom:15px; text-align:center;">
            <label for="colorSelect">Choisir votre couleur :</label>
            <select id="colorSelect">
                <option value="white" selected>Blanc</option>
                <option value="black">Noir</option>
            </select>
            <button id="startGame" style="margin-left:10px; padding:6px 12px;">Démarrer</button>
            <p id="status" style="margin-top:8px; font-weight:bold;">Tour : --</p>
        </div>
        <form id="chess-table">
        </form>
        <!-- bouton pour afficher/masquer les mouvements possibles -->
        <button id="toggleMoves" style="margin-top:10px; padding:8px 16px; font-size:1rem;">Afficher mouvements</button>
    </div>

    <script src="./js/index.js"></script>
</body>
</html>