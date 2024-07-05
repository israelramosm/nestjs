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

```bash
https://orkhan.gitbook.io/typeorm/docs/using-cli
```
