## Database

En local :
sudo -i -u postgres
psql -U postgres -p 5432 -f createDB.sql
psql -U postgres -p 5432 -d webdev -f 01-fillDB.sql
/!\ port dans .env à remettre à 5432

Via conteneur docker:
docker compose up -d

si besoin de refaire le docker de zéro
docker compose down
docker volume rm webdev_pgdata
docker compose up -d

Pour vérifier le fonctionnement:
docker exec -it my-postgres psql -U postgres -d webdev

## Backend NodeJS

npm install express pg dotenv body-parser cors
npm install swagger-jsdoc swagger-ui-express

## Frontend

npm install bootstrap
npm i --save-dev @types/bootstrap
npm install bootstrap-icons
npm install --save-dev @compodoc/compodoc

#### Génère la compodoc:

npm run npm run compodoc:serve
