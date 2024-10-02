const express = require("express");
const { ApolloServer} = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { connectDB } = require("./config/db");
const typeDefs = require("./schemas/user");
const { registerUser, loginUser, logoutUser, getAllUsers, getUser } = require("./resolvers/user");
const { refreshAccessToken } = require("./resolvers/auth");

let app;
async function startServer() {
  app = express();
  app.use(express.json());
  connectDB();
  
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Mutation: {
        registerUser,
        loginUser,
        logoutUser,
        refreshToken: refreshAccessToken,
      },
      Query: {
        users: getAllUsers,
        user: getUser,
      },
    },
  });

  await server.start();
  app.use("/graphql", expressMiddleware(server));
}

startServer();

module.exports = app;
