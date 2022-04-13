# Install dependencies only when needed
FROM node:14-alpine as deps
LABEL author="masb0ymas"

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk add --update --no-cache curl py-pip
RUN apk add --no-cache make python2 g++ gcc libgcc libstdc++
RUN npm install --quiet node-gyp -g

# install for sharp library
RUN apk add --update --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community --repository http://dl-3.alpinelinux.org/alpine/edge/main vips-dev

# Setup Timezone
RUN	apk add tzdata
ENV TZ=Asia/Jakarta

RUN apk add nano

WORKDIR /app
COPY package.json ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /app

RUN export NODE_OPTIONS=\"--max_old_space_size=4096\"

COPY . .

RUN cp .env.example .env

COPY --from=deps /app/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S expresso -u 1001

# Set config npm & install dependencies
RUN npm config set scripts-prepend-node-path true
RUN npm install -g typescript
RUN npm install -g pm2

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/.sequelizerc ./.sequelizerc
COPY --from=builder /app/logs ./logs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env ./.env

# initial app
RUN node ./dist/@expresso/scripts/generate.js

# USER expresso

EXPOSE 8000

# Run for production
CMD ["yarn", "serve:production-docker"]
