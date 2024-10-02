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

    type TokenPayload {
        accessToken: String
        refreshToken: String
    }

    input RegisterInput {
        email: String!
        password: String!
        name: String!
    }
    
    input UpdateProfileInput {
        email: String
        name: String
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input LogoutInput {
        _id: ID!
    }

    input RefreshTokenInput {
        incomingRefreshToken: String!
    }

    type Status {
        message: String
    }

    type Query {
        users: [User]
        user(_id: ID!): User
    }

    type Mutation {
        registerUser(input: RegisterInput!): AuthPayload
        loginUser(input: LoginInput!): AuthPayload
        logoutUser(input: LogoutInput!): Status
        refreshToken(input: RefreshTokenInput!): TokenPayload
        updateUserProfile(input: UpdateProfileInput!): Status
        resetPassword(currentPassword: String!, newPassword: String!): Status
    }
`;

module.exports = typeDefs;
