FROM node

WORKDIR /app/users

COPY package.json .

RUN npm install

RUN npm update @ezzify/common

ENV SENDGRID_API_KEY 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

ENV SENDGRID_SENDER_EMAIL harshitsinghchouhan2018@gmail.com

COPY . .

EXPOSE 4001


CMD ["npm","start"]