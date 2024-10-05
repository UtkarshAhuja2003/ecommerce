
# User Service

This service manages user registration, authentication, and profile updates. It handles JWT-based authentication, interacts with other microservices through RabbitMQ for event-driven communication, and exposes a GraphQL API for interacting with users.

## Key Responsibilities
- **User Registration and Login**: Allows users to create an account with their email, password, and name.
- **Authentication**: Provides JWT-based authentication, issuing access and refresh tokens upon login.
- **Profile Management**: Allows users to update their profile and reset passwords.
- **Event-Driven Communication**: Emits and listens to events to synchronize user data with other microservices.

## Features
- **GraphQL API**: Exposes queries and mutations for managing users.
- **JWT Authentication**: Secure token-based authentication.
- **Caching**: Implements Redis caching for frequently accessed user data to optimise performance.
- **Event Emission**: Emits events like User Registered and User Profile Updated.
- **Docker Support**: Fully containerized with Docker for easy deployment.
- **Password Hashing**: Passwords are protected using bcrypt before saving data
- **Environment Configurations**: Separate configurations for development and production environments.

# Architecture
The User Service is built with Node.js, Express, GraphQL, and MongoDB. It uses Redis for caching and RabbitMQ for asynchronous event-driven communication with other microservices.

## Data Model

The **User** model includes the following fields:

- **_id**: Unique identifier (MongoDB ObjectId)
- **email**: User's email address (unique)
- **password**: Hashed password
- **name**: User's full name
- **refreshToken**: Token for refreshing JWT


## Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Caching**: Redis
- **Queue/Stream**: RabbitMQ (for event-driven communication)
- **GraphQL**: `graphql` and `graphql-http` packages
- **Containerization**: Docker

## Event-Driven Communication
The User Service communicates with other microservices through RabbitMQ, ensuring asynchronous and decoupled interactions. It emits various events related to user actions.

### Events
- **User Registered**:
  - **Producer**: User Service
  - **Details**: Emitted when a new user registers. 
  
- **User Profile Updated**:
  - **Producer**: User Service
  - **Details**: Emitted when a user updates their profile information. 

## Authentication

This service uses **JWT (JSON Web Tokens)** for authentication. The authentication flow is as follows:

1. User registers or logs in.
2. Service returns an access token and a refresh token.
3. Access token is used for API calls.
4. Refresh token is used to obtain a new access token when it expires.

## Caching Mechanism
To optimize performance, frequently queried data is cached using Redis. The caching system is designed to reduce database queries and improve response times for common requests, such as fetching user profiles.

### Redis Caching Functions

### `getCacheUser(redisKey)`
- Retrieves a single user from the Redis cache using the userID.

**Example usage:**
```
const cachedUser = await getCacheUser(`user:${userId}`);
```
### `getCacheUsers(redisKey)`
- Retrieves a list of users from the Redis cache using the provided key.

**Example usage:**
```
const cachedUsers = await getCacheUsers('users:all');
```

# API Reference

### Queries
- `users`: Retrieve a list of all users.
- `user(_id: ID!)`: Fetch details of a specific user by their ID.

### Mutations
- `registerUser(input: RegisterInput!)`: Register a new user by validating data. Returns the `AuthPayload` containing the user data and tokens.
- `loginUser(input: LoginInput!)`: Log in an existing user, returning an access token and refresh token.
- `logoutUser(input: LogoutInput!)`: Log out a user, invalidating their session.
- `refreshToken(input: RefreshTokenInput!)`: Refresh the JWT tokens using a valid refresh token.
- `updateUserProfile(input: UpdateProfileInput!)`: Update the user's email or name.
- `resetPassword(currentPassword: String!, newPassword: String!)`: Reset a user's password.
- `verifyUser(accessToken: String!)`: Verify the user using their access token to authorise.

