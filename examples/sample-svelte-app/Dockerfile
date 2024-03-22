FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN apk add git

RUN yarn

COPY . .

RUN npm i -g vite

RUN yarn build

EXPOSE 5005

CMD [ "yarn", "preview" ]