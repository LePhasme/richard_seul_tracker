# Richard Seul Tracker

Enregistre les mouvements de la souris et les rejoue via la base robotique.

## Instalation

Voir le dépôt https://github.com/LePhasme/richard_seul_test pour la partie Arduino (script de test et bibliothèques requises).  

1. Installer [node.js](https://nodejs.org/en/) (version 8.x LTS)
1. Pour une installation sous Windows, exécuter la commande : `npm install --global --production windows-build-tools` _(voir [ici](https://github.com/felixrieseberg/windows-build-tools) pour plus de détails, il se peut que le terminal doive être lancé en mode administrateur)_ 
1. Installer [PM2](https://github.com/Unitech/pm2) : `npm install --global pm2` _(il se peut que le terminal doive être lancé en mode administrateur)_
1. Télécharger ou clôner le présent dépôt
1. Dans le dossier `richard_seul_tracker`, exécuter la commande `npm install` 

## Contenu

Le projet repose sur [webpack](https://webpack.js.org/) et [Vue.js](https://vuejs.org/) (cf. [guide](http://vuejs-templates.github.io/webpack/) et [docs pour vue-loader](http://vuejs.github.io/vue-loader)).

### Principaux dossiers

- `build` et `config` : scripts et fichiers de configuration de l'environnement de développement
- `data` : dossier de sauvegarde des mouvements enregistrés
- `dist` : dossier contenant la version de production de l'application (voir plus bas)
- `src` : sources de l'application
- `static` : dossier contenant les éléments statiques (non utilisé)

### Structure des sources

- `App.vue` : composant principal de l'application, définit sa structure globale
- `assets/sass/main.scss` : feuille de style principale (se contente d'importer le framework [Bulma](https://bulma.io/), les autres styles étant définis dans le contexte de chaque composant)
- `backend/index.js` : script node.js indépendant implémentant un serveur HTTP et Websocket écoutant sur le port 8090 et se chargeant :
	- de charger et d'enregistrer les données stockées dans le dossier `data`
	- d'envoyer à la carte Arduino, via le port série, les coordonnées streamées depuis l'application principale
- `components/Manager.vue` : composant gérant les données stockées (chargement, suppression, etc.)
- `components/Recorder.vue` : composant chargé de l'enregistrement des données captées
- `component/Tracker.vue` : composant chargé de la captation des données
- `component/Visualizer.vue` : composant chargé de l'affichage (des données enregistrées, des données captées, etc.)
- `event-bus.js` : module de déclaration des mécanismes de communication entre les composants (bus d'événements internes et Websocket)
- `main.js` : script principal initialisant l'application
- `router/index.js` : définition des routes (motifs d'URL – ici il n'y en a qu'une seule)

## Exécution

### Lancement en mode développement

`npm run dev`

Ce script va lancer le serveur `backend` ainsi qu'un serveur de développement sur `localhost:8080`, puis ouvrir le navigateur par défaut sur le projet.

Le serveur de développement dispose d'un mécanisme de "hot reload" : le contenu du navigateur sera automatiquement rechargé lors de chaque modification des sources et en fonction des besoins (idem pour le serveur `backend`).

### Publication en vue de la production

`npm run build`

L'application sera compilée et minifiée dans le dossier `dist`.
