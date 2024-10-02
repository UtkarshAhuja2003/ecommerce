const { GraphQLError } = require("graphql");
const User = require("../models/User");
const verifyJWT = require("../middlewares/auth");

const updateUserProfile = async (_, args, context) => {
    const user = await verifyJWT(context);
    if (!user) {
        throw new GraphQLError("User not found");
    }

    const { input } = args;

    if (input.email) {
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser && existingUser._id.toString() !== user._id) {
            throw new GraphQLError("Email is already in use");
        }
    }

    Object.keys(input).forEach(key => {
        user[key] = input[key];
    });

    await user.save();

    return {
        message: "User profile updated successfully",
        user
    };
};

const resetPassword = async (_, args, context) => {
    const user = await verifyJWT(context);
    if (!user) {
        throw new GraphQLError("User not found");
    }

    const { currentPassword, newPassword } = args;

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
        throw new GraphQLError("Invalid current password");
    }

    user.password = newPassword;
    await user.save();

    return {
        message: "Password reset successfully"
    };
};

module.exports = {
    updateUserProfile,
    resetPassword
};