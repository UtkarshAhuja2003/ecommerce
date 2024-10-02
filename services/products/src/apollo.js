const { ApolloServer} = require("@apollo/server");
const typeDefs = require("./schemas/product");
const { createProduct, updateProduct, updateInventory, deleteProduct, getProduct, getProducts } = require("./resolvers/product")

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
    return server;
};

module.exports = createApolloServer;