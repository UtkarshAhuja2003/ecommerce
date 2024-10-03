const { ApolloServer} = require("@apollo/server");
const typeDefs = require("./schemas/user");
const { registerUser, loginUser, logoutUser, getAllUsers, getUser } = require("./resolvers/user");
const { refreshAccessToken, verifyUser } = require("./resolvers/auth");
const { updateUserProfile, resetPassword } = require("./resolvers/userProfile");

const createApolloServer = async() => {
    const server = new ApolloServer({
        typeDefs,
        resolvers: {
          Mutation: {
            registerUser,
            loginUser,
            logoutUser,
            refreshToken: refreshAccessToken,
            updateUserProfile,
            resetPassword,
            verifyUser,
          },
          Query: {
            users: getAllUsers,
            user: getUser,
          },
        },
    });

    await server.start();
    return server;
};

module.exports = createApolloServer;