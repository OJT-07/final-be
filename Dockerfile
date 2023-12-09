FROM node:16.18.0-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

RUN apk update && apk upgrade && apk add --no-cache bash git

EXPOSE 6001


