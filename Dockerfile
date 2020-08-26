FROM node:12.18.3-alpine3.12
# LABEL author="masb0ymas"

# Setup Timezone
RUN	apk add tzdata
ENV TZ=Asia/Jakarta

RUN apk add nano

COPY . /var/www
WORKDIR /var/www

RUN npm install pm2 -g
RUN yarn
RUN npm run build

# EXPOSE 7000
CMD ["npm", "run", "serve:production-docker"]
