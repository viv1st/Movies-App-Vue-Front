# Movies App
Cette application écrit en Vue.js permet de visualiser une liste de films, mais également d'ajouter des films, d'en modifier, d'en supprimer et de les trier.
Pour manipuler les données, elle effectue des requêtes API vers une API .NET déployée sur Azure dont le code source se trouve sur ce repo : https://github.com/viv1st/Movies-API-Dotnet

## Comment utiliser l'application ?
- Cloner le projet
- Se mettre dans le répertoire du repo
- Lancer la commande : ``` npm install ``` (cela suppose que vous avez installé préalablement Node.js sur votre poste de travail
- Lancer ``` npm run dev ``` pour lancer l'application
- Au début, quand vous arriverez sur la page de connexion, vous devez saisir ces identifiants :
  - Username : user
  - Password : passWord1!
- Vous pouvez maintenant naviguer librement dans l'application

## Remarques
- L'application est configuré pour se lancer sur le port ```5173``` et le serveur autorisera les requêtes uniquement venant de localhost lancé sur ce port.
Ainsi, si jamais une autre application utilise ce port, veuillez l'arrêter pour pouvoir accéder à l'application.  
- La session dure 15 minutes : si vous essayer d'ajouter, de modifier ou supprimer un film au bout de 15 minutes, vous serez automatiquement redirigé vers la page de connexion.
- Pas de système de déconnexion par contre quand vous fermez la fenêtre du navigateur, vous perdrez votre session. Il faudra donc se reconnecter.
- Pas d'inscription : vous devrez utiliser les identiiants par défaut définis plus haut.
