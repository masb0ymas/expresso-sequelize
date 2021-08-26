FROM ubuntu:latest
USER root

RUN apt-get update
RUN apt -y upgrade
RUN apt-get -y install curl gnupg

# install node
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get -y install nodejs

# library for sharp
RUN apt-get --only-upgrade install libvips
RUN apt-get install nano

# Create app directory
WORKDIR /var/www

# Install app dependencies
COPY package*.json ./

# Set config npm & install dependencies
RUN npm config set scripts-prepend-node-path true
RUN npm install -g typescript
RUN npm install -g pm2
RUN npm install -g yarn
RUN yarn

# Bundle app source
COPY . .

# Build app
RUN yarn build:docker

EXPOSE 8000

# Run for production
CMD ["yarn", "serve:production-docker"]
