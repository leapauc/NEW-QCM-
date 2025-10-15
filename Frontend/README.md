# NEW QCM + Projet

## Besoins

Dans le but de s’affranchir du format papier des questionnaires et d’éviter l’étape de numérisation des
questionnaires papier, LECLIENT souhaite pouvoir disposer d’outils informatiques et multimédias
permettant :

- de récupérer la base de questions existantes dans l’application QCM PLUS.
- de créer de nouvelles questions en ligne avec des protocoles d’activités de type QCM et d'importer
  les ressources nécessaires
- d'ajouter les questions dans des questionnaires
- de créer/modifier/supprimer des questionnaires
- d’effectuer en ligne et à distance le questionnaire
- de conserver et d'afficher le dernier résultat d'un stagiaire
- de gérer les différents niveaux d'accès (droits)

---

## Contenerisation

L'ensemble du projet (backend, base de données et frontend) est contenu dans un conteneur docker.

Il suffira donc de lancer le conteneur docker pour pouvoir accéder à l'application.
La commande à executer est la suivante :

```
docker compose up --build
```

---

## Documentation

La documentation Angular est disponible dans le dossier documentation sur le github suivant :

```
https://github.com/leapauc/NEW-QCM-
```

mais également à l'url suivante :

```
http://localhost:8081
```

---

## Prérequis

### Angular prérequis :

Le projet Angular nécessite l'installation de quelques librairies indispensables à son bon fonctionnement :

- bootstrap
- bootstrap-icons
- @compodoc/compodoc

La tâche est réalisé au cours de la création du conteneur docker.

En local, l'installation peut se faire avec les commandes suivantes :

```
npm install bootstrap
npm i --save-dev @types/bootstrap
npm install bootstrap-icons
npm install --save-dev @compodoc/compodoc
```

** ATTENTION : au préalable, il faudra installer nodeJS. **

### Autre prérequis :

Le frontend Angular communique avec un backend NodeJS qui répond sur :

```
http://localhost:3000
```

Différentes urls sont disponibles et permettent de réaliser de nombreuses requêtes dans la base de données.

La documentation de l'API est disponible à l'url suivante :

```
http://localhost:3000/api-docs/
```
