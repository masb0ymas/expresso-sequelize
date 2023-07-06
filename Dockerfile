FROM node:18-alpine AS base
LABEL author="masb0ymas"
LABEL name="expresso"

# Install dependencies only when needed
FROM base as deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk add --update --no-cache curl py-pip
RUN apk add --no-cache make python3 g++ gcc libgcc libstdc++
RUN npm install --quiet node-gyp -g

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev

# Set the Temp Working Directory inside the container
WORKDIR /temp-deps

# copy package json
COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --frozen-lockfile

FROM base as builder

# Set the Temp Working Directory inside the container
WORKDIR /temp-build

RUN export NODE_OPTIONS=\"--max_old_space_size=4096\"

# copy base code
COPY . .

# copy environment
RUN cp .env.docker-production .env

COPY --from=deps /temp-deps/node_modules ./node_modules

# prune devDependencies
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# image runner app
FROM base as runner

# Set the Current Working Directory inside the container
WORKDIR /app

ENV NODE_ENV production

# Setup Timezone
RUN apk add tzdata
ENV TZ=Asia/Jakarta

# editor cli with nano
RUN apk add nano

COPY --from=builder /temp-build/public ./public
COPY --from=builder /temp-build/assets ./assets
COPY --from=builder /temp-build/node_modules ./node_modules
COPY --from=builder /temp-build/package.json ./package.json
COPY --from=builder /temp-build/dist ./dist
COPY --from=builder /temp-build/logs ./logs
COPY --from=builder /temp-build/.env ./.env

# initial app
RUN node ./dist/scripts/generate.js

# This container exposes port 8000 to the outside world
EXPOSE 8000

# Run for production
CMD ["yarn", "serve:production-docker"]
