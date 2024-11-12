FROM node:22-alpine

WORKDIR /app/products

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 8002

CMD ["yarn", "start"]
