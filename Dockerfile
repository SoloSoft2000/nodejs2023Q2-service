FROM node:20-alpine AS build

WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/
RUN --mount=type=bind,source=package.json,target=./package.json \
    --mount=type=bind,source=package-lock.json,target=./package-lock.json \
    --mount=type=bind,source=prisma,target=./prisma \
    --mount=type=cache,target=/root/.npm \
    npm ci
# RUN npm install

COPY . .

# RUN npm run build

# FROM node:20-alpine

# WORKDIR /app

# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/src ./src
# COPY --from=build /app/package*.json ./
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/prisma ./prisma
# COPY --from=build /app/doc ./doc
# COPY --from=build /app/tsconfig.build.json ./

EXPOSE ${PORT}

CMD npx prisma migrate deploy && \
    npm run start:dev
