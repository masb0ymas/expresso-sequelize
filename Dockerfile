FROM node:12.18.3-alpine3.12
LABEL author="masb0ymas"

# Setup Timezone
RUN	apk add tzdata
ENV TZ=Asia/Jakarta

RUN apk add nano

# Create app directory
WORKDIR /var/www

COPY package.json /var/www
COPY yarn.lock /var/www

# Set config npm & install dependencies
RUN npm config set scripts-prepend-node-path true
RUN npm install pm2 -g
RUN yarn
# RUN yarn build

# Bundle app source
COPY . .

EXPOSE 7000
CMD ["yarn", "start"]
