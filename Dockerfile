FROM node:12.18.3-alpine3.12
# LABEL author="masb0ymas"

COPY . /var/www
WORKDIR /var/www

RUN npm install pm2 -g
RUN yarn
RUN npm run build

# EXPOSE 7000
CMD ["npm", "run", "start"]
