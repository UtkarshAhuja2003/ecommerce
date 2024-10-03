const typeDefs = `
    type Order {
        _id: ID!
        userId: ID!
        products: [OrderProduct!]!
        totalAmount: Float!
        status: String!
    }

    type OrderProduct {
        productId: ID!
        quantity: Int!
        priceAtPurchase: Float!
    }

    input OrderProductInput {
        productId: ID!
        quantity: Int!
        priceAtPurchase: Float!
    }

    input OrderInput {
        products: [OrderProductInput!]!
        totalAmount: Float!
    }

    input UpdateOrderStatusInput {
        orderId: ID!
        status: String!
    }

    type OrderResponse {
        success: Boolean!
        message: String!
        order: Order
    }

    type OrdersResponse {
        success: Boolean!
        message: String!
        orders: [Order!]
    }

    type Query {
        getAllOrders: OrdersResponse!
        getUserOrders(userId: ID!): OrdersResponse!
        getOrder(orderId: ID!): OrderResponse!
    }

    type Mutation {
        placeOrder(userId: ID!, input: OrderInput!): OrderResponse!
        updateOrderStatus(input: UpdateOrderStatusInput!): OrderResponse!
    }
`;

module.exports = typeDefs;
