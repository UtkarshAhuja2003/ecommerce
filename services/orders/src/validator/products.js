const validateProducts = async (inputProducts, dbProducts) => {
    try {
        const errors = [];

        for (const inputProduct of inputProducts) {
            const dbProduct = dbProducts.find(p => p._id.toString() === inputProduct.productId);

            if (!dbProduct) {
                errors.push(`Product with ID ${inputProduct.productId} not found`);
                continue;
            }

            if (inputProduct.quantity > dbProduct.inventory) {
                errors.push(`Insufficient inventory for product ${inputProduct.productId}. Requested: ${inputProduct.quantity}, Available: ${dbProduct.inventory}`);
            }
        }

        if (errors.length > 0) {
            return { isValid: false, errors };
        }

        return { isValid: true, errors: [] };
    } catch (error) {
        return { isValid: false, errors: [error.message] };
    }
};

module.exports = { validateProducts };
