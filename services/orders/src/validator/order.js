const { ORDER_STATUS } = require("../constants");

function validateNewOrder(order) {
    const errors = [];

    if (!order.user || typeof order.user !== 'string') {
        errors.push('User ID is required and should be a string.');
    }

    if (!Array.isArray(order.products) || order.products.length === 0) {
        errors.push('Order must contain at least one product.');
    } else {
        order.products.forEach((product, index) => {
            if (!product.productId || typeof product.productId !== 'string') {
                errors.push(`Product ID is required for product at index ${index}.`);
            }
            if (typeof product.quantity !== 'number' || product.quantity <= 0) {
                errors.push(`Product quantity must be a positive number for product at index ${index}.`);
            }
        });
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}

function validateOrderStatusUpdate(status) {
    const errors = [];

    if (!status || !Object.values(ORDER_STATUS).includes(status)) {
        errors.push(`Order status should be one of: ${ORDER_STATUS.join(', ')}.`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateNewOrder,
    validateOrderStatusUpdate
};
