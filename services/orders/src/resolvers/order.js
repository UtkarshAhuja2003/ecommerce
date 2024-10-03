const { GraphQLError } = require('graphql');
const Order = require('../models/order');
const { validateNewOrder, validateOrderStatusUpdate } = require('../validator/order');
const { ORDER_STATUS } = require("../constants");
const { verifyUser } = require("../utils/verifyUser");

const getAllOrders = async () => {
    try {
        const orders = await Order.find();
        if (orders.length === 0) {
            return {
                success: true,
                message: 'No orders found',
                orders: []
            };
        }
        return {
            success: true,
            message: 'Orders retrieved successfully',
            orders
        };
    } catch (error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

const getUserOrders = async (_, args) => {
    try {
        const { userId } = args;
        console.log(userId);
        // TODO: Add user authentication logic
        if (!userId) {
            throw new GraphQLError('User ID is required');
        }

        const orders = await Order.find({ userId });
        if (orders.length === 0) {
            return {
                success: true,
                message: 'No orders found for the user',
                orders: []
            };
        }
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

        const order = await Order.findById(orderId);
        if (!order) {
            throw new GraphQLError('Order not found');
        }
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

        // TODO: Add product availability and inventory validation logic

        const newOrder = new Order({
            userId,
            products: input.products,
            totalAmount: input.totalAmount,
            status: ORDER_STATUS.PLACED
        });

        const savedOrder = await newOrder.save();

        // TODO: Emit "Order Placed" event and update inventory

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
