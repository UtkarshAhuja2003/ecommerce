const { GraphQLError } = require("graphql");
const User = require("../models/User");

const updateUserProfile = async (_, args) => {
    const { _id, input } = args;

    const user = await User.findById(_id);
    if (!user) {
        throw new GraphQLError("User not found");
    }

    if (input.email) {
        const existingEmail = await User.findOne({ email: input.email });
        if (existingEmail && existingEmail._id.toString() !== _id) {
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

const resetPassword = async (_, args) => {
    const { _id, currentPassword, newPassword } = args;

    const user = await User.findById(_id);
    if (!user) {
        throw new GraphQLError("User not found");
    }

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