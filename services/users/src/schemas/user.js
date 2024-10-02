const typeDefs = `
    type User {
        _id: ID!
        email: String!
        password: String!
        name: String!
        refreshToken: String
    }

    type AuthPayload {
        user: User
        accessToken: String
        refreshToken: String
        message: String
    }

    input RegisterInput {
        email: String!
        password: String!
        name: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input LogoutInput {
        _id: ID!
    }

    type Query {
        users: [User]
        user(_id: ID!): User
    }

    type Mutation {
        registerUser(input: RegisterInput!): AuthPayload
        loginUser(input: LoginInput!): AuthPayload
        logoutUser(input: LogoutInput!): AuthPayload
    }
`;

module.exports = typeDefs;
