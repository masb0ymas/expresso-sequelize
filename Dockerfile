FROM node:12.3.0
LABEL author="masb0ymas"
COPY . /var/www
WORKDIR /var/www
RUN yarn
RUN cp .env.example .env
RUN npm run build
EXPOSE 7000
CMD ["npm", "run", "serve:production"]
