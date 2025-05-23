<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Création de compte - Glassmorphism</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap" rel="stylesheet" />
    <style>
        /* CSS ici (voir section suivante) */
    </style>
    <link rel="stylesheet" href="./css/account_creation/style.css">
</head>
<body>
    <img id="bg-image" src="./img/login-bg/loginbackgroud.jpeg" alt="background image">
    <div class="container" >
        <form class="glass-form">
            <h2>Créer un compte</h2>
            <div class="input-group">
                <label for="fullname">Nom complet</label>
                <input type="text" id="fullname" placeholder="Entrez votre nom complet" required />
            </div>
            <div class="input-group">
                <label for="email">Adresse e-mail</label>
                <input type="email" id="email" placeholder="Entrez votre e-mail" required />
            </div>
            <div class="input-group">
                <label for="username">Nom d'utilisateur</label>
                <input type="text" id="username" placeholder="Choisissez un nom d'utilisateur" required />
            </div>
            <div class="input-group">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" placeholder="Créez un mot de passe" required />
            </div>
            <div class="input-group">
                <label for="confirm-password">Confirmer le mot de passe</label>
                <input type="password" id="confirm-password" placeholder="Confirmez votre mot de passe" required />
            </div>
            <button type="submit">S'inscrire</button>
            <p class="login-text">Déjà un compte ? <a href="#">Se connecter</a></p>
        </form>
    </div>
</body>
</html>
