FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Set the Temp Working Directory inside the container
WORKDIR /temp-deps

# copy package json
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile

FROM base AS builder

# Set the Temp Working Directory inside the container
WORKDIR /temp-build

# copy base code
COPY . .

# copy environment
RUN cp .env.example .env
COPY --from=deps /temp-deps/node_modules ./node_modules

# prune devDependencies
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# image runner app
FROM base AS runner

# Set the Current Working Directory inside the container
WORKDIR /app

ENV NODE_ENV=production

# editor cli with nano
RUN apk add nano

COPY --from=builder /temp-build/public ./public
COPY --from=builder /temp-build/node_modules ./node_modules
COPY --from=builder /temp-build/package.json ./package.json
COPY --from=builder /temp-build/script ./script
COPY --from=builder /temp-build/logs ./logs
COPY --from=builder /temp-build/dist ./dist
COPY --from=builder /temp-build/.env ./.env

# This container exposes port 8000 to the outside world
EXPOSE 8000

# Run for production
CMD ["yarn", "start:production"]
