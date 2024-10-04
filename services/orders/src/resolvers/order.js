const { GraphQLError } = require('graphql');
const Order = require('../models/order');
const { validateNewOrder, validateOrderStatusUpdate } = require('../validator/order');
const { ORDER_STATUS } = require("../constants");
const { verifyUser } = require("../utils/verifyUser");
const { updateInventory } = require("../utils/inventoryUpdate");
const client = require("../config/redis");
const { getCacheOrder, getCacheOrders } = require("../utils/cacheOrders");
const { getProductsByIDS } = require("../utils/getProducts");
const { validateProducts } = require("../validator/products");

const getAllOrders = async () => {
    try {
        const redisKey = 'orders:all';
        const cachedOrders = await getCacheOrders(redisKey);
        if (cachedOrders) {
            console.log("Orders retrieved from cache");
            return {
                success: true,
                message: 'Orders retrieved successfully',
                orders: cachedOrders
            };
        }

        const orders = await Order.find();
        if (orders.length === 0) {
            return {
                success: true,
                message: 'No orders found',
                orders: []
            };
        }

        await client.setEx(redisKey, 3600, JSON.stringify(orders));

        return {
            success: true,
            message: 'Orders retrieved successfully',
            orders
        };
    } catch (error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

const getUserOrders = async (_, args, context) => {
    try {
        const token = context.headers.authorization?.replace("Bearer ", "") || context.token;
        const user = await verifyUser(token);
        if (!user) {
            throw new GraphQLError("Unauthorized request");
        }
        const userId = user._id;
        if (!userId) {
            throw new GraphQLError('User ID is required');
        }

        const redisKey = `orders:user:${userId}`;
        const cachedOrders = await getCacheOrders(redisKey);
        if (cachedOrders) {
            console.log("User orders retrieved from cache");
            return {
                success: true,
                message: 'User orders retrieved successfully',
                orders: cachedOrders
            };
        }

        const orders = await Order.find({ userId });
        if (orders.length === 0) {
            return {
                success: true,
                message: 'No orders found for the user',
                orders: []
            };
        }

        await client.setEx(redisKey, 3600, JSON.stringify(orders));
        return {
            success: true,
            message: 'User orders retrieved successfully',
            orders
        };
    } catch (error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

const getOrder = async (_, args) => {
    try {
        const { orderId } = args;
        if (!orderId) {
            throw new GraphQLError('Order ID is required');
        }

        const redisKey = `order:${orderId}`;
        const cachedOrder = await getCacheOrder(redisKey);
        if (cachedOrder) {
            console.log("Order retrieved from cache");
            return {
                success: true,
                message: 'Order retrieved successfully',
                order: cachedOrder
            };
        }

        const order = await Order.findById(orderId);
        if (!order) {
            throw new GraphQLError('Order not found');
        }

        await client.setEx(redisKey, 3600, JSON.stringify(order));
        return {
            success: true,
            message: 'Order retrieved successfully',
            order
        };
    } catch (error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

const placeOrder = async (_, args, context) => {
    try {
        const token = context.headers.authorization?.replace("Bearer ", "") || context.token;
        const user = await verifyUser(token);
        if (!user) {
            throw new GraphQLError("Unauthorized request");
        }
        const userId = user._id;

        const { input } = args;
        const { isValid, errors } = validateNewOrder({ ...input, user: userId });
        if (!isValid) {
            throw new GraphQLError(errors.join(' '));
        }

        const productIds = input.products.map(product => product.productId);
        
        const products = await getProductsByIDS(productIds);
        const { isValid: isValidProducts, errors: productErrors } = await validateProducts(input.products, products);
        if (!isValidProducts) {
            throw new GraphQLError(productErrors.join(' '));
        }

        const productMap = new Map(products.map(product => [product._id.toString(), product]));

        const productsWithPrice = input.products.map(inputProduct => {
            const product = productMap.get(inputProduct.productId);
            if (!product) {
                throw new GraphQLError(`Product with ID ${inputProduct.productId} not found.`);
            }

            return {
                ...inputProduct,
                priceAtPurchase: product.price
            };
        });

        const newOrder = new Order({
            userId,
            products: productsWithPrice,
            status: ORDER_STATUS.PLACED
        });

        const savedOrder = await newOrder.save();

        updateInventory(input.products);

        return {
            success: true,
            message: 'Order placed successfully.',
            order: savedOrder
        };
    } catch (error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

const updateOrderStatus = async (_, args) => {
    try {
        const { orderId, status } = args.input;
        if (!orderId) {
            throw new GraphQLError('Order ID is required');
        }

        const { isValid, errors } = validateOrderStatusUpdate(status);
        if (!isValid) {
            throw new GraphQLError(errors.join(' '));
        }

        const order = await Order.findById(orderId);
        if (!order) {
            throw new GraphQLError('Order not found');
        }

        const statusOrder = { [ORDER_STATUS.PLACED]: 1, [ORDER_STATUS.SHIPPED]: 2, [ORDER_STATUS.DELIVERED]: 3 };
        if (statusOrder[status] < statusOrder[order.status]) {
            throw new GraphQLError(`Cannot change status from ${order.status} to ${status}`);
        }

        order.status = status;
        const updatedOrder = await order.save();

        // TODO: Emit "Order Shipped" event if status is 'shipped'

        client.del(`order:${orderId}`);
        return {
            success: true,
            message: `Order status updated to ${status} successfully.`,
            order: updatedOrder
        };
    } catch (error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

module.exports = {
    getAllOrders,
    getUserOrders,
    getOrder,
    placeOrder,
    updateOrderStatus
};
