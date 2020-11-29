FROM node:12.18.3-alpine3.12
LABEL author="masb0ymas"

# Setup Timezone
RUN	apk add tzdata
ENV TZ=Asia/Jakarta

RUN apk add nano

# Create app directory
WORKDIR /var/www

# Bundle app source
COPY . /var/www

# Set config npm & install dependencies
RUN npm config set scripts-prepend-node-path true
RUN npm install typescript -g
RUN npm install pm2 -g

# Build app
RUN yarn build:docker

EXPOSE 8000
CMD ["yarn", "serve:production-docker"]
