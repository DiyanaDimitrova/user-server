FROM node:8

WORKDIR /user-server

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3001

CMD [ "yarn", "start" ]