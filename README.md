
# Microservices Backend System

This system consists of three isolated microservices for user management, product management, and order processing. These services communicate asynchronously using a message queue for state management and are routed through Nginx to provide unified access to each microservice.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/new/?autostart=false#https://github.com/UtkarshAhuja2003/ecommerce)

## Microservices:
- **User Service**: Handles user registration, authentication, and profile management. [User Service README](./services/users/README.md)
- **Product Service**: Manages products, including creation, inventory updates, and deletion. [Product Service README](./services/products/README.md)
- **Order Service**: Manages the creation and processing of orders. [Order Service README](./services/orders/README.md)

## System Features:
- **Event-Driven Architecture**: Services communicate via events ("User Registered", "Order Placed").
- **JWT Authentication**: Secure access to protected routes in the User and Order services.
- **Caching**: Implemented for frequently queried data to optimize performance.
- **Asynchronous Communication**: Queue-based event system ensures state consistency across services.
- **NGINX Reverse Proxy**: NGINX is used to route requests to the appropriate microservice, providing a single access point for the User, Product, and Order services (`/user`, `/product`, `/order`).

Github Actions: This project uses GitHub Actions for continuous integration (CI) to automate project building with every commit.

## Prerequisites:
- **Docker**: Ensure Docker and Docker Compose are installed.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/UtkarshAhuja2003/ecommerce.git
cd ecommerce
```
2. Copy environment files: For each service, navigate to the service directory and copy the .env.sample to .env.
```bash
cd services/users
cp .env.sample .env

cd ../products
cp .env.sample .env

cd ../orders
cp .env.sample .env
```

3. Set up Docker containers for services, databases, redis, proxy and message queue:
```bash
docker-compose up --build
```

4. Access the services:

User Service: http://localhost/user \
Product Service: http://localhost/product \
Order Service: http://localhost/order


# API Documentation
A Postman collection is provided to test the API endpoints for user, product, and order management.

**Postman Collection**: 🚀 [![Postman Collection](https://img.shields.io/badge/Open%20in-Postman-orange)](https://www.postman.com/utkarsh-team/workspace/utkarsh-team-workspace/collection/670067ff083131f0be40fb9a?action=share&creator=26095985)

## Tech Stack
- **Node.js**: Backend services for user, product, and order management.
- **Apollo Server**: GraphQL API implementation.
- **MongoDB**: Database for managing persistent data.
- **Redis**: Cache for optimized performance.
- **RabbitMQ**: Messaging service for inter-service communication.
- **Nginx**: Proxy server for routing requests.
- **Docker**: Containerization of all services.
- **Gitpod**: Cloud-based development environment.


### Key Dependencies

- **Apollo Server**: Implements a GraphQL API to handle queries and mutations across microservices.
- **Amqplib**: Facilitates interaction with RabbitMQ for message queuing.
- **Bcrypt.js**: Used for password hashing and security.
- **Express**: Web framework for building APIs and handling HTTP requests.
- **JSON Web Token (JWT)**: Handles authentication and authorization.



## Project Structure

```bash
├── .github/ # Github actions
├── docker-compose.yml 
├── proxy/ # Nginx proxy
│   ├── Dockerfile
├── services/
│   ├── users/
│   │   ├── src/
│   │   │   ├── config/ # Database, Message Queue, Redis connection
│   │   │   ├── middlewares/
│   │   │   ├── models/ # Database schema
│   │   │   ├── resolvers/ # Handles GraphQL queries and mutations.
│   │   │   ├── schemas/ GraphQL schemas
│   │   │   ├── utils/
│   │   │   ├── apollo.js # Apollo Server
│   │   │   ├── app.js
│   │   │   └── index.js
│   │   ├── tests/
│   │   ├── .env
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── products/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── models/
│   │   │   ├── resolvers/
│   │   │   ├── schemas/
│   │   │   ├── utils/
│   │   │   ├── apollo.js
│   │   │   ├── app.js
│   │   │   └── index.js
│   │   ├── .env
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── orders/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── models/
│   │   │   ├── resolvers/
│   │   │   ├── schemas/
│   │   │   ├── utils/
│   │   │   │   ├── cacheOrders.js
│   │   │   │   ├── getProducts.js
│   │   │   │   ├── inventoryUpdate.js
│   │   │   │   ├── orderStatus.js
│   │   │   │   └── verifyUser.js
│   │   │   ├── validator/
│   │   │   ├── apollo.js
│   │   │   ├── app.js
│   │   │   ├── constants.js
│   │   │   └── index.js
│   │   ├── .env
│   │   ├── Dockerfile
│   │   └── package.json
└── README.md

```