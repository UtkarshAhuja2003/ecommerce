const express = require('express');
const { connectDB } = require('./config/db');
const createApolloServer = require("./apollo");
const { expressMiddleware } = require("@apollo/server/express4");

const app = express();
app.use(express.json());
connectDB();

const startServer = async () => {
  const server = await createApolloServer();
  app.use("/graphql", 
    expressMiddleware(server, {
      context: ({ req }) => {
        return req;
      }
    })
  );
}

startServer();

module.exports = app;