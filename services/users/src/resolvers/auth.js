const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const User = require('../models/User');
const verifyJWT = require("../middlewares/auth");

const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId);
    if(!user) {
        throw new GraphQLError("User not found");
    }
    
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    await user.save();
    
    return { accessToken, refreshToken };
};

// Generate new refresh token if refresh token is near to expire
const refreshTokenRotation = async (userId, incomingRefreshToken) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new GraphQLError("User not found");
    }

    const decodedToken = jwt.decode(incomingRefreshToken);
    const tokenExpiryTime = decodedToken.exp * 1000;
    const currentTime = Date.now();

    const timeToExpire = tokenExpiryTime - currentTime;
    const oneDay = 24 * 60 * 60 * 1000;

    let refreshToken = incomingRefreshToken;

    if (timeToExpire < oneDay) {
        refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
    }

    return refreshToken;
};

const refreshAccessToken = async (_, args) => {
    const { incomingRefreshToken } = args.input;  
    if (!incomingRefreshToken) {
      throw new GraphQLError("Invalid refresh token");
    }
  
    try {
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id);
      
      if (!user) {
        throw new GraphQLError("Invalid refresh token");
      }
  
      if (incomingRefreshToken !== user.refreshToken) {
        throw new GraphQLError("Refresh token is expired or used");
      }
  
      const accessToken = user.generateAccessToken();
      const refreshToken = refreshTokenRotation(user._id, incomingRefreshToken);
  
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new GraphQLError(error.message || "Invalid refresh token");
    }
};

const verifyUser = async (_, args) => {
  try {
    const { accessToken } = args;
    if(!accessToken) {
      throw new GraphQLError("Unauthorized request");
    }
    const user = await verifyJWT({ token: accessToken });
    return {
      user,
      message: "User is authenticated",
      success: true,
    }
  } catch (error) {
    throw new GraphQLError(error.message || "Invalid access token");
  }
}

module.exports = { generateAccessAndRefreshTokens, refreshAccessToken, verifyUser };