# expresso with Sequelize

[![documentation](https://img.shields.io/badge/Documentation-yes-brightgreen.svg)](https://github.com/masb0ymas/expresso#readme)
[![maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/masb0ymas/expresso/graphs/commit-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/masb0ymas/expresso/blob/master/LICENSE.md)

[![Version](https://img.shields.io/badge/Version-4.1.0-blue.svg?cacheSeconds=2592000)](https://github.com/masb0ymas/expresso/releases/tag/v4.1.0)
[![Express](https://img.shields.io/badge/Express-4.18.1-informational?logo=express&color=22272E)](https://expressjs.com/)
![Node](https://badges.aleen42.com/src/node.svg)
![Eslint](https://badges.aleen42.com/src/eslint.svg)
![TypeScript](https://badges.aleen42.com/src/typescript.svg)

## Feature

- [TypeScript](https://github.com/microsoft/TypeScript) `v4.x`
- [Sequelize ORM](https://github.com/sequelize/sequelize) `v6.x` [Sequelize TypeScript](https://github.com/sequelize/sequelize-typescript) `v2.x`
- [Nodemailer](https://github.com/nodemailer/nodemailer) `v6.x`
- [Handlebars](https://github.com/wycats/handlebars.js) for templating HTML
- [Yup](https://github.com/jquense/yup) for validation schema `v0.32.x`
- JavaScript Style [Standard with TypeScript](https://github.com/standard/eslint-config-standard-with-typescript)
- Formating code using [Prettier](https://github.com/prettier/prettier) Integration [Eslint](https://github.com/prettier/eslint-config-prettier) and [TypeScript Eslint](https://github.com/typescript-eslint/typescript-eslint#readme)
- Using [Module Alias](https://github.com/ilearnio/module-alias) for simplify the require/import paths
- Documentation with [Swagger](https://github.com/swagger-api/swagger-ui)
- Generate Log File with [Winston](https://github.com/winstonjs/winston)
- [Convensional Commit](https://www.conventionalcommits.org/en/v1.0.0/) with [Husky](https://github.com/typicode/husky) & [Commitlint](https://github.com/conventional-changelog/commitlint)

### [Check Full Documentation](https://github.com/masb0ymas/expresso/tree/master/src/%40expresso/docs/repo/intro.md)

## How to use

clone this repo with `https` / `ssh` / `github cli`

```sh
git clone https://github.com/masb0ymas/expresso.git
```

After cloning this repo, make sure you have `duplicated` the `.env.example` file to `.env`, don't let the .env.example file be deleted or renamed.

### Install

```sh
yarn
```

### Enabled Husky

```sh
npx husky install
```

```sh
yarn husky install
```

### Generate Secret Key

```sh
yarn key:generate
```

### Usage Development

```sh
yarn dev
```

### Lint Check

```sh
yarn test:lint
```

### Type Check

```sh
yarn test:types
```

### Type Check Watch mode

```sh
yarn test:types-watch
```

### Build

by default build codebase with `SWC`, if you want to build with TypeScript, run this command : `yarn build:ts`

```sh
yarn build
```

## Using Sequelize

Using sequelize with development mode, you can set the database configuration in `.env`, like this :

```sh
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=example_database
DB_USERNAME=example_user
DB_PASSWORD=example_password
DB_SYNC=
DB_TIMEZONE=+07:00
```

then after that you can adjust the database config in `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
now you can run this command :

```sh
yarn db:reset
```

### Usage Production

```sh
yarn serve:production
```

### Usage PM2 for Cluster Process

```sh
pm2 start ecosystem.config.js --env=production
```

## Config Nginx for Limiter / Node JS

```sh
server {
	listen 80;
	listen [::]:80;

	server_name yourdomain.com;
	client_max_body_size 2000M;
	location / {
	proxy_pass http://127.0.0.1:7000;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection 'upgrade';
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-Proto $scheme;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_cache_bypass $http_upgrade;
	}
}
```

## Run loadtest

```sh
npm install -g loadtest
```

Then run the app that you want to test with `node app.js`. We’ll start by testing the version that doesn’t use clustering.

With the app running, open another Terminal and run the following load test:

```sh
loadtest http://localhost:8000/v1/user -n 1000 -c 100
```

`-n` = network / requests

`-c` = concurrency

`--rps` = request per second

Read documentation [loadtest](https://www.npmjs.com/package/loadtest)

## Result loadtest:

if you want to try `1000 requests` you have to increase `RATE_LIMIT=1000`, by default `100 requests`

```sh
Requests: 0 (0%), requests per second: 0, mean latency: 0 ms

Target URL:          http://localhost:8000/v1/user
Max requests:        1000
Concurrency level:   100
Agent:               none

Completed requests:  1000
Total errors:        0
Total time:          1.7057602980000002 s
Requests per second: 586
Mean latency:        162.8 ms

Percentage of the requests served within a certain time
  50%      136 ms
  90%      261 ms
  95%      337 ms
  99%      390 ms
 100%      419 ms (longest request)
```

### Run tests

```sh
yarn test
```

## Run with Docker

before the first docker build, we first check `IPv4 private` so that we can access the `Database` outside the `docker container`.

Adjust the config in .env like this:

```sh
...

DB_CONNECTION=mysql
DB_HOST=172.26.9.187 # example IPv4 private
DB_PORT=3306
DB_DATABASE=example
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_SYNC=
DB_TIMEZONE=+07:00

...

REDIS_HOST=172.26.9.187 # example IPv4 private
REDIS_PASSWORD=your_password
REDIS_PORT=6379
```

### Building image docker

```sh
docker build . -t <your username>/expresso
```

Your image will now be listed by Docker:

```sh
$ docker images

# Example
REPOSITORY                      TAG        ID              CREATED
node                            16         3b66eb585643    5 days ago
<your username>/expresso        latest     d64d3505b0d2    1 minute ago
```

### Run Image

```sh
docker run -p 7000:8000 -d <your username>/expresso
```

Print the output of your app:

```sh
# Get container ID
$ docker ps

# Print app output
$ docker logs <container id>

# Example
Running on http://localhost:8080
```

If you need to go inside the container you can use the `exec` command:

```sh
# Enter the container
$ docker exec -it <container id> /bin/bash
```

### Release your version app

if you want to release the app version, you can use the following command :

```sh
yarn release
```

## SMTP Basic

I use [topol.io](https://topol.io/) to create email templates, and it's free and can export to html format

```sh
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=465
MAIL_AUTH_TYPE=
MAIL_USERNAME=your_mail@domain.com
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=
```

## SMTP with Mailgun API

```sh
MAILGUN_API_KEY=your_api_key_mailgun
MAILGUN_DOMAIN=your_domain
```

## SMTP Google Oauth Email ( Gmail )

```sh
MAIL_DRIVER=gmail
MAIL_HOST=
MAIL_PORT=
MAIL_AUTH_TYPE=OAuth2
MAIL_USERNAME=your_account@gmail.com
MAIL_PASSWORD=
MAIL_ENCRYPTION=

OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_REDIRECT_URL=https://developers.google.com/oauthplayground
OAUTH_REFRESH_TOKEN=your_refresh_token
```

[Setup Google Oauth](https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1)

## Author

👤 [**masb0ymas** (Resume)](https://masb0ymas.netlify.app/)

[![Github](https://badges.aleen42.com/src/github.svg)](https://github.com/masb0ymas)
[![Twitter](https://badges.aleen42.com/src/twitter.svg)](https://twitter.com/masb0ymas)
[![Linkedin](https://img.shields.io/badge/Linkedin-Informational?logo=linkedin&color=0A66C2&logoColor=white)](https://www.linkedin.com/in/masb0ymas)

## Support Me

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/I2I03MVAI)

[<img height="40" src="https://trakteer.id/images/mix/navbar-logo-lite.png">](https://trakteer.id/masb0ymas)

[<img height="40" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png">](https://www.paypal.com/paypalme/masb0ymas)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
