FROM node

WORKDIR /app/vendor

COPY package.json .

RUN npm install



COPY . .

EXPOSE 4002


CMD ["npm","start"]