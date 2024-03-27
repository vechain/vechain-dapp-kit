FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN apk add git

RUN yarn

RUN yarn global add @angular/cli

RUN yarn global add serve

COPY . .

RUN yarn build

EXPOSE 5004

CMD [ "serve", "dist/easy-angular", "-p", "5004"]