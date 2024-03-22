FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN apk add git

RUN yarn

COPY . .

EXPOSE 5004

CMD [ "yarn", "dev" ]