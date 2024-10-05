
# Product Service

The Product Service is designed to manage product-related operations, including creating, updating, deleting, and retrieving product information. It communicates with other services through event-driven architecture using RabbitMQ for state management, ensuring consistent data across the system.

## Key Responsibilities
1. **Product Management**: Create, update, delete, and retrieve products

2. **Event-Driven Communication**: Emits and listens to events to synchronize user data with other microservices.

3. **Inventory Management**: Update inventory automatically when an **"Order Placed"** event is received from the Order Service.

4. **GraphQL API**: Provides a GraphQL API for product queries and mutations.

6. **Caching**
   - Redis caching for frequently accessed product data.

# Architecture
The Product Service is built with Node.js, Express, GraphQL, and MongoDB. It uses Redis for caching and RabbitMQ for asynchronous event-driven communication with other microservices.

## Data Model

The **Product** model includes the following fields:

- **_id**: Unique identifier (MongoDB ObjectId)
- **name**: Product name
- **description**: Product description
- **price**: Product price
- **inventory**: Current inventory count
- **category**: Product category


## Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Queue/Stream**: RabbitMQ (for event-driven communication)
- **GraphQL**: `graphql` and `graphql-http` packages
- **Containerization**: Docker

## Event-Driven Communication
The Product Service communicates with other microservices through RabbitMQ, ensuring asynchronous and decoupled interactions. It listens to events.

### Events
- **Order Placed**: To update inventory when an order is placed.

## Caching Mechanism
To optimize performance, frequently queried data is cached using Redis. The caching system is designed to reduce database queries and improve response times for common requests, such as fetching product data.

### Redis Caching Functions

### `getCacheProduct(redisKey)`
- Retrieves a single product from the Redis cache using a specified key. If the product is found, it is parsed and returned; otherwise, it returns null
### `getCacheProducts:(redisKey)`
- Retrieves a list of products from the Redis cache using a specified key. Similar to getCacheProduct, it returns the parsed product list if found, or null if not.

# API Reference

### Queries
- `getProduct(id: ID!)`: Retrieve a specific product by its ID.
- `getProducts`: Retrieve a list of all products.
- `getProductsByIDS(ids: [ID!]!)`: Retrieve multiple products by their IDs.

### Mutations
- `createProduct(input: ProductInput!)`: Create a new product with validation.
- `updateProduct(_id: ID!, input: UpdateProductInput!)`: Update an existing product.
- `deleteProduct(_id: ID!)`: Delete a product by its ID.
- `updateInventory(_id: ID!, inventory: Int!)`: Update the inventory level of a product.


