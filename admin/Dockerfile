FROM node

WORKDIR /app/admin

COPY package.json .

RUN npm install

RUN npm update @ezzify/common

COPY . .

EXPOSE 4003


CMD ["npm","start"]