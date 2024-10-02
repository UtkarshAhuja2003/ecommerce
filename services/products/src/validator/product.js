const { PRODUCT_CATEGORIES } = require("../constants");

function validateNewProduct(product) {
    const errors = [];

    if (!product.name || typeof product.name !== 'string') {
        errors.push('Product name is required and should be a string.');
    } else if (product.name.length < 2 || product.name.length > 200) {
        errors.push('Product name should be between 2 and 200 characters.');
    }

    if (!product.description || typeof product.description !== 'string') {
        errors.push('Product description is required and should be a string.');
    } else if (product.description.length < 10 || product.description.length > 1000) {
        errors.push('Product description should be between 10 and 1000 characters.');
    }

    if (product.price === undefined || typeof product.price !== 'number' || product.price < 0) {
        errors.push('Product price is required and should be a non-negative number.');
    }

    if (product.inventory === undefined || typeof product.inventory !== 'number' || product.inventory < 0) {
        errors.push('Product inventory count is required and should be a non-negative number.');
    }

    if (!product.category || typeof product.category !== 'string') {
        errors.push('Product category is required and should be a string.');
    } else if (!Object.values(PRODUCT_CATEGORIES).includes(product.category)) {
        errors.push(`Product category should be one of: ${Object.values(PRODUCT_CATEGORIES).join(', ')}.`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {validateNewProduct};
