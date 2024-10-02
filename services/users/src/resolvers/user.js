const { GraphQLError } = require("graphql");
const User = require("../models/User");
const { generateAccessAndRefreshTokens } = require("./auth");
const verifyJWT = require("../middlewares/auth");

const registerUser = async(_, args) => {
    const { name, email, password } = args.input;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new GraphQLError("User already exists");
    }

    const user = await User.create({
        email,
        password,
        name
      });
    
    await user.save();
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );
    user.refreshToken = refreshToken;

    return {
        user,
        accessToken,
        refreshToken,
        message: "User registered successfully",
    };
};

const loginUser = async (_, args) => {
    const { email, password } = args.input;
    if(!email || !password) {
        throw new GraphQLError("Invalid credentials");
    }

    const user = await User.findOne({ email });
    if(!user) {
        throw new GraphQLError("User not found");
    }

    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid) {
        throw new GraphQLError("Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );
    user.refreshToken = refreshToken;

    return {
        user,
        accessToken,
        refreshToken,
        message: "User logged in successfully",
    };
};

const logoutUser = async (_, args, context) => {
    const user = await verifyJWT(context);
    if(!user) {
        throw new GraphQLError("User not found");
    }

    await User.findByIdAndUpdate(user._id, { refreshToken: "" });
    return {
        message: "User logged out successfully",
    };
};

const getAllUsers = async () => {
    return await User.find();
};

const getUser = async (_, args) => {
    const { _id } = args;
    const user = await User.findById(_id);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getUser
};