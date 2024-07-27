# PostgreSql

## Linux

### Download from registry 

```shell
podman pull docker.io/library/postgres 
```

### Check image 
```shell
podman images 
```

### Run the container 

```shell
podman run -dt --name service-db -e POSTGRES_PASSWORD=*** -v "/home/israel-ramos/podman-data/postgresql" -p 5432:5432 postgres
```

## Windows

```shell
podman pull docker.io/library/postrges

podman volume create pg_data

podman run -dt --name service-db -e POSTGRES_PASSWORD=*** -v "host/path:/mount/path" -p 5432:5432 postgres
```

# MySQL

```shell
podman run -dt -e MYSQL_ROOT_PASSWORD=<SenhaDoUsuárioRoot> \
-e MYSQL_USER=<NomeDeUsuário> -e MYSQL_DATABASE=<NomeDoBanco> \
--name <NomeDoContainer> -p 3306:3306 mysql:latest
```

# TypeORM CLI

[TypeORM](https://orkhan.gitbook.io/typeorm/docs/using-cli)

```typeorm:cli``` should already be configured on the ```package.json``` to run the migrations as scripts

Use generate to create a migration on the folder, for some reason create does not worked as expected 

* If its a new db run the migration command first

```shell
npm run migration:run
```

This will update all tables need it for the project

* If you need to create a new migration run this command

```shell
npm run migration:generate src/database/migrations/pg/Init
```

* You can revert a migration with this command

```shell
npm run migration:revert
```

Make sure the migration table data on postagres have the migration files in the project.


# Helpful git commands

Run the following command to remove the file and rewrite the entire history with new commit hashes:

```shell
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch <path-to-file>' --prune-empty --tag-name-filter cat -- --all
```

After this, you might need to force-push your changes using:

```shell
git push --force
```