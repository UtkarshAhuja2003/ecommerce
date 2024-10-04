const { ApolloServer} = require("@apollo/server");
const typeDefs = require("./schemas/product");
const { createProduct, updateProduct, updateInventory, deleteProduct, getProduct, getProducts, getProductsByIDS } = require("./resolvers/product")
const { getInventoryUpdates } = require("./utils/inventoryUpdate");

const createApolloServer = async() => {
    const server = new ApolloServer({
        typeDefs,
        resolvers: {
            Query: {
                getProduct,
                getProducts,
                getProductsByIDS
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