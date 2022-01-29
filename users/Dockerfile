FROM node

WORKDIR /app/users

COPY package.json .

RUN npm install

RUN npm update @ezzify/common

COPY . .

EXPOSE 4001


CMD ["npm","start"]