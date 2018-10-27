FROM node:6

RUN mkdir /user-server
WORKDIR /user-server

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]