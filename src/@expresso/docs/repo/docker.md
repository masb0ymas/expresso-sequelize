# Using Docker

## Setup

If you want deploy this application to docker. You have to adjust the env and docker-compose configurations. Set this `DB_HOST=db` so that you can access the DB inside the container docker with the service name `db`. `DB_HOST=..`. must be accessed using IPv4 Docker Network services `db`.

```sh
...

DB_CONNECTION=mysql
DB_HOST=db # access to service db in docker
DB_PORT=3306
DB_DATABASE=example
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_OPERATOR_ALIAS=
DB_TIMEZONE=+07:00

...

REDIS_HOST=redis
REDIS_PASSWORD=your_password
REDIS_PORT=6379 # Default: 6379
```

`container_name` in each service is customizable.

## Deploy

Before deploying an application to Docker, make sure you have Docker installed on the server. [Documentation Docker](https://docs.docker.com/engine/install/).

After all the above configuration is adjusted, you can run it with the command:

Command aggregates the output of each container

```sh
docker-compose up
```

Detached mode: Run containers in the background,

```sh
docker-compose up -d
```

Check running docker compose

```sh
docker-compose ps
```
