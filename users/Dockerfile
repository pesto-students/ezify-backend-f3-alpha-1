FROM node

WORKDIR /app/users

COPY package.json .

RUN npm install

RUN npm update @ezzify/common

ENV SENDGRID_API_KEY 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

ENV SENDGRID_SENDER_EMAIL kawthekar56@gmail.com

COPY . .

EXPOSE 4001


CMD ["npm","start"]