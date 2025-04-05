# Express API with Sequelize

[![Documentation](https://img.shields.io/badge/Documentation-yes-brightgreen.svg)](https://github.com/masb0ymas/express-api-sequelize#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/masb0ymas/express-api-sequelize/graphs/commit-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/masb0ymas/express-api-sequelize/blob/master/LICENSE.md)
[![Version](https://img.shields.io/badge/Version-6.0.0-blue.svg?cacheSeconds=2592000)](https://github.com/masb0ymas/express-api-sequelize/releases/tag/v6.0.0)
[![Express](https://img.shields.io/badge/Express-4.21.2-informational?logo=express&color=22272E)](https://expressjs.com/)
![Node](https://badges.aleen42.com/src/node.svg)
![Eslint](https://badges.aleen42.com/src/eslint.svg)
![TypeScript](https://badges.aleen42.com/src/typescript.svg)
![Docker](https://badges.aleen42.com/src/docker.svg)

A robust Express API template with TypeScript, Sequelize ORM, and comprehensive tooling for building production-ready applications.
Base API using [express-api](https://github.com/masb0ymas/express-api)

## Features

- **[TypeScript](https://github.com/microsoft/TypeScript)** `5.8.x` - Type-safe JavaScript
- **[Sequelize](https://github.com/sequelize/sequelize)** `6.x` - Powerful ORM for SQL databases
- **[Nodemailer](https://github.com/nodemailer/nodemailer)** `6.x` - Email sending made simple
- **[Handlebars](https://github.com/wycats/handlebars.js)** - HTML templating engine
- **[Zod](https://github.com/colinhacks/zod)** `3.x` - TypeScript-first schema validation
- **Code Quality**
  - JavaScript Style with [Standard with TypeScript](https://github.com/standard/eslint-config-standard-with-typescript)
  - Code formatting with [Prettier](https://github.com/prettier/prettier)
  - [ESLint](https://github.com/prettier/eslint-config-prettier) and [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint) integration
- **API Documentation** with [Swagger](https://github.com/swagger-api/swagger-ui) OpenAPI `3.x`
- **Logging** with [Pino](https://github.com/pinojs/pino)
- **Git Workflow** with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), [Husky](https://github.com/typicode/husky) & [Commitlint](https://github.com/conventional-changelog/commitlint)
- **Containerization** with Docker

## Module System

- By default, the `main` branch uses ES Modules (`type: module`)
- For CommonJS, use the `commonjs` branch

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/masb0ymas/express-api-sequelize.git
   cd express-api-sequelize
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Then configure database settings in the `.env` file

3. **Install dependencies**

   ```bash
   yarn install
   ```

4. **Set up database**

   ```bash
   yarn db:create && yarn db:reset
   ```

   Or create your database manually

5. **Start development server**

   ```bash
   yarn dev
   ```

   With file watching:

   ```bash
   yarn dev:watch
   ```

6. **Enable Git hooks**
   ```bash
   yarn husky install
   ```

## Deployment

### Release Process

```bash
yarn release
```

### Docker Deployment

```bash
# Build the Docker image
docker build -t yourname/express:v1.0.0 .

# Run the container
docker run -p 7000:8000 -d yourname/express:v1.0.0
```

## Author

[![Github](https://badges.aleen42.com/src/github.svg)](https://github.com/masb0ymas)
[![Twitter](https://badges.aleen42.com/src/twitter.svg)](https://twitter.com/masb0ymas)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Informational?logo=linkedin&color=0A66C2&logoColor=white)](https://www.linkedin.com/in/masb0ymas)

## Support

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/I2I03MVAI)

[<img height="40" src="https://trakteer.id/images/mix/navbar-logo-lite.png">](https://trakteer.id/masb0ymas)

[<img height="40" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png">](https://www.paypal.com/paypalme/masb0ymas)
