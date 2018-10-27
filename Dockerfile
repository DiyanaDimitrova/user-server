FROM node:8

WORKDIR /user-server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]