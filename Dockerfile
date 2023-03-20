# build stage
FROM node:18.15.0-alpine AS build

WORKDIR /app

COPY package*.json .

RUN yarn

COPY . .

RUN yarn build

# deploy stage
FROM node:18.15.0-alpine

WORKDIR /app

COPY --from=build /app/node_modules /node_modules
COPY --from=build /app/dist /dist
COPY .env.prod package.json /

CMD ["yarn", "start:prod"]