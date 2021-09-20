# Install dependencies only when needed
FROM node:14-alpine
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

# Set config npm & install dependencies
RUN npm config set scripts-prepend-node-path true
RUN npm install -g typescript
RUN npm install -g pm2

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn

# Bundle app source
COPY . .

# Build app
RUN yarn build

EXPOSE 8000

# Run for production
CMD ["yarn", "serve:production-docker"]
