FROM node:22-alpine

WORKDIR /app/users

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "start"]
