FROM node:20-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma migrate dev

RUN npm run build

CMD [ "npm", "run", "start:dev" ]