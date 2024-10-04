const { ApolloServer} = require("@apollo/server");
const typeDefs = require("./schemas/product");
const { createProduct, updateProduct, updateInventory, deleteProduct, getProduct, getProducts } = require("./resolvers/product")
const { getInventoryUpdates } = require("./utils/inventoryUpdate");

const createApolloServer = async() => {
    const server = new ApolloServer({
        typeDefs,
        resolvers: {
            Query: {
                getProduct,
                getProducts
            },
            Mutation: {
                createProduct,
                updateProduct,
                updateInventory,
                deleteProduct
            }
        }
    });

    await server.start();
    getInventoryUpdates();
    return server;
};

module.exports = createApolloServer;