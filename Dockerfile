FROM node:20-alpine

WORKDIR /usr/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .


RUN npm run build


CMD [ "npm", "run", "start:dev" ]