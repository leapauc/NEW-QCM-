# Documentation

## Conteneurisation

Un conteneur docker permet de gérer l'ensemble du projet New QCM +.
Pour le lancer uns première fois, utiliser la commande :

```
docker compose up --build
```

si besoin de refaire le docker de zéro

```
docker compose down
docker volume rm webdev_pgdata
docker compose up --build
```

Dès lors que le front est opérationnel, l'API, la compodoc Angular, la base de données et le Frontend seront opérationnels.

**NOTE : VEUILLEZ A CE QUE LES PORTS 8081 ou 8080, et 4200 soit disponible.**

## Prerequis

L'ensemble des prérequis est bien géré lors de la création du conteneur docker.

### Database

**/!\ port dans .env à remettre à 5432**

Pour vérifier le fonctionnement:

```
docker exec -it my-postgres psql -U postgres -d webdev
```

### Backend NodeJS

Les dépendances à installer sont les suivantes :

```
npm install express pg dotenv body-parser cors
npm install swagger-jsdoc swagger-ui-express
```

### Frontend

Les dépendances à installer sont les suivantes :

```
npm install bootstrap
npm i --save-dev @types/bootstrap
npm install bootstrap-icons
npm install --save-dev @compodoc/compodoc
```

Pour génèrer la compodoc:

```
npm run compodoc:serve
```
