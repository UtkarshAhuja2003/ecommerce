import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

/**
 * Middleware to verify JWT token in GraphQL context.
 * @param {Object} context - GraphQL context object
 * @throws {Error} If the token is missing, invalid, or the user is not found.
 */
export const verifyJWT = async (context) => {
    const token = context.req.headers.authorization?.replace("Bearer ", "") || context.token;
  
    if (!token) {
      throw new GraphQLError("Unauthorized request");
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id);
  
      if (!user) {
        throw new GraphQLError("Invalid access token");
      }
      
      context.user = user;
    } catch (error) {
      throw new GraphQLError("Invalid access token");
    }
};
