FROM node:20-alpine AS build

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=./package.json \
    --mount=type=bind,source=package-lock.json,target=./package-lock.json \
    --mount=type=bind,source=prisma,target=./prisma \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

EXPOSE ${PORT}

CMD npx prisma migrate deploy && \
    npm run start:dev
