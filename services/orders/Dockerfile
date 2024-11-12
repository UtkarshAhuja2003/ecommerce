FROM node:22-alpine

WORKDIR /app/orders

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 8003

CMD ["yarn", "start"]
