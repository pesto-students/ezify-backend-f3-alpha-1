FROM node

WORKDIR /app/socket

COPY package.json .

RUN npm install

RUN npm update @ezzify/common

COPY . .

EXPOSE 4005


CMD ["npm","start"]