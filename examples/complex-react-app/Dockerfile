# this docker is intended to be used for creating a production build with dapp-kit with latest version
# to do that we need to do the build outside of the container and then copy the dist folder to the container

FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn
RUN yarn global add vite

EXPOSE 5001

CMD [ "yarn", "preview" ]