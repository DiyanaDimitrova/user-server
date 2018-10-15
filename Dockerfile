FROM node:6

RUN mkdir /holiday-extras-server
WORKDIR /aholiday-extras-serverpp

COPY package.json .

RUN npm install --production

COPY . .

CMD ["npm", "start"]