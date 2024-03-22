FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN apk add git

RUN yarn

RUN npm install -g vue@3.2.13
RUN npm install -g @vue/cli-service@5.0.8

COPY . .

EXPOSE 5006

CMD [ "yarn", "dev" ]