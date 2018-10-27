FROM node:6

RUN mkdir /holiday-extras-server
WORKDIR /holiday-extras-server

COPY package.json .

RUN npm install --production

COPY . .

CMD ["npm", "start"]