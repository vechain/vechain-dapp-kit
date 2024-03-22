FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN yarn

COPY . .

EXPOSE 5003

CMD [ "yarn", "dev" ]