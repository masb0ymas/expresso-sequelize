# Documentation

## Motivation

This boilerplate was made because I had several problems. The problem consists of express initials that are repeated over and over again, as well as every project I work on has some important undocumented features. After this boilerplate, I can focus on developing existing features and new features.

- [Getting Started](https://github.com/masb0ymas/boilerplate-express-typescript-sequelize/blob/master/docs/repo/intro.md)
- [Using Sequelize](https://github.com/masb0ymas/boilerplate-express-typescript-sequelize/blob/master/docs/repo/sequelize.md)
  - [Sequelize Model](https://github.com/masb0ymas/boilerplate-express-typescript-sequelize/blob/master/docs/repo/sequelize.md#sequelize-model)
  - [Model Association](https://github.com/masb0ymas/boilerplate-express-typescript-sequelize/blob/master/docs/repo/sequelize.md#model-association)
  - [Using Sequelize Plugin]()

## Getting Started

### Clone this repo

clone this repo with `https`

```sh
git clone https://github.com/masb0ymas/boilerplate-express-typescript-sequelize.git
```

clone this repo with `ssh`

```sh
git clone git@github.com:masb0ymas/boilerplate-express-typescript-sequelize.git
```

clone this repo with `github cli`

```sh
gh repo clone masb0ymas/boilerplate-express-typescript-sequelize
```

### Setup .env

After cloning this repo, make sure you have `duplicated` the `.env.example` file to `.env`, don't let the .env.example file be deleted or renamed.

When running this application, by default set the development mode. you can set the database configuration in `.env`, like this :

```sh
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=example_database
DB_USERNAME=example_user
DB_PASSWORD=example_password
DB_OPERATOR_ALIAS=
DB_TIMEZONE=+07:00
```

if you use `MySQL` or `MariaDB` Database, set `DB_TIMEZONE=+07:00` for Indonesia's time.

if you use `PostgreSQL` Database, set `DB_TIMEZONE=Asia/Jakarta` for Indonesia's time.

If you leave it blank, `DB_TIMEZONE` is set to `UTC` by default.

### JWT Secret

Thing you have to do after changing `.env` config, you will have to run this command :

```sh
yarn refresh:env-jwt
```

This command will generate a random string for `JWT_SECRET_ACCESS_TOKEN` and `JWT_SECRET_REFRESH_TOKEN`
