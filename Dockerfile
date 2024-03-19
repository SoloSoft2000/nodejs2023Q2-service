FROM node:20-alpine as build

WORKDIR /usr/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:migrate:dev" ]