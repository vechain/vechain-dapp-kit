FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN yarn

RUN npm install -g next@14.0.3

COPY . .

RUN yarn build

EXPOSE 5002

CMD [ "yarn", "start" ]