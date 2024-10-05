
# Order Service

The Order Service service handles order creation, retrieval, and status updates. It integrates with the User Service for authentication and the Product Service for inventory checks before order placement.

## Key Responsibilities

1. **Order Management**: Create, update, and retrieve orders associated with users.

2. **User Verification**:Connect with user service to validate users using an access token before processing orders.

3. **Inventory Check**: Connect with product service Verify product availability to ensure orders can be fulfilled before finalizing.

4. **Event Handling**: Emit and listen for events related to order status updates, such as "Order Placed" and "Order Shipped."

5. **GraphQL API**: Provides a GraphQL API for order queries and mutations.

6. **Caching**
   - Redis caching for frequently accessed order data.

# Architecture
The Product Service is built with Node.js, Express, GraphQL, and MongoDB. It uses Redis for caching and RabbitMQ for asynchronous event-driven communication with other microservices.

# Data Model

The **Order** model includes the following fields:

- **_id**: Unique identifier (MongoDB ObjectId)
- **userId**: ID of the user who placed the order
- **products**: Array of ordered products, each containing:
  - **productId**: ID of the product
  - **quantity**: Quantity ordered
  - **priceAtPurchase**: Price of the product at the time of purchase
- **status**: Current status of the order (e.g., "pending", "shipped", "delivered")


## Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Queue/Stream**: RabbitMQ (for event-driven communication)
- **GraphQL**: `graphql` and `graphql-http` packages
- **Containerization**: Docker

# Event Communication

The **Order Service** emits and listens to the following events:

## Emitted Events
- **Order Placed**: When a new order is successfully placed.
- **Order Shipped**: When an order's status is updated to shipped.


## Caching Mechanism
The Order Service uses Redis for caching order data to enhance performance and minimize database load. This helps speed up response times when fetching orders.

### Redis Caching Functions

### `getCacheOrder(redisKey)`
- Retrieves a single order from Redis cache using the productID. Returns parsed order data if found; otherwise, returns null.
### `getCacheOrders:(redisKey)`
-  Retrieves a list of orders from Redis cache. Similar to getCacheOrder, it returns the parsed order list if found or null if not.

# API Reference

### Queries
- `getAllOrders`: Retrieves all orders.
- `getUserOrders`: Retrieves orders for the authenticated user using access token.
- `getOrder(orderId: ID!)`: Retrieves details of a specific order.

### Mutations
- `placeOrder(input: OrderInput!)`: Places a new order after verifying the user and checking product quantities.
- `updateOrderStatus(input: UpdateOrderStatusInput!)`: Updates the status of an existing order.



