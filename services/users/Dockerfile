FROM node:22-alpine

WORKDIR /app/users

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 8001

CMD ["yarn", "start"]
