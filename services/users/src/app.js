import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import connectDB from "./config/db.js";
import typeDefs from "./schemas/user.js";
import { registerUser, loginUser, logoutUser, getAllUsers, getUser } from "./resolvers/user.js";

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

export default app;
