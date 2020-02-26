FROM node:lts-alpine3.9

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN apk add python && yarn

COPY . .

EXPOSE 3000

CMD yarn start
