const typeDefs = `
    type Product {
        _id: ID!
        name: String!
        description: String
        price: Float!
        inventory: Int!
        category: String
    }

    input ProductInput {
        name: String!
        description: String
        price: Float!
        inventory: Int!
        category: String
    }

    input UpdateProductInput {
        name: String
        description: String
        price: Float
        inventory: Int
        category: String
    }

    type SuccessResponse {
        success: Boolean!
        message: String!
    }

    type ProductResponse {
        success: Boolean!
        message: String!
        product: Product
    }

    type ProductsResponse {
        success: Boolean!
        message: String!
        products: [Product!]
    }

    type Query {
        getProduct(id: ID!): ProductResponse!
        getProducts: ProductsResponse!
        getProductsByIDS(ids: [ID!]!): ProductsResponse!
    }

    type Mutation {
        createProduct(input: ProductInput!): ProductResponse!
        updateProduct(_id: ID!, input: UpdateProductInput!): ProductResponse!
        deleteProduct(_id: ID!): ProductResponse!
        updateInventory(_id: ID!, inventory: Int!): ProductResponse!
    }
`;

module.exports = typeDefs;
