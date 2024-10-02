const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");
const User = require("../models/User");

/**
 * Middleware to verify JWT token in GraphQL context.
 * @param {Object} context - GraphQL context object
 * @throws {Error} If the token is missing, invalid, or the user is not found.
 */
const verifyJWT = async (context) => {
    const token = context.headers.authorization?.replace("Bearer ", "") || context.token;
  
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
      return user;
    } catch (error) {
      throw new GraphQLError("Invalid access token");
    }
};

module.exports = verifyJWT;