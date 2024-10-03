const { ApolloServer} = require("@apollo/server");
const typeDefs = require("./schemas/order");
const { getAllOrders, getOrder, getUserOrders, placeOrder, updateOrderStatus} = require("./resolvers/order");

const createApolloServer = async() => {
    const server = new ApolloServer({
        typeDefs,
        resolvers: {
            Query: {
                getAllOrders,
                getUserOrders,
                getOrder
            },
            Mutation: {
                placeOrder,
                updateOrderStatus
            }
        }
    });

    await server.start();
    return server;
};

module.exports = createApolloServer;