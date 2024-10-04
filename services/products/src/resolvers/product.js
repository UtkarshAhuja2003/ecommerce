const { GraphQLError } = require('graphql');
const Product = require('../models/product');
const { validateNewProduct } = require("../validator/product");
const client = require("../config/redis");
const { getCacheProduct, getCacheProducts } = require("../utils/cacheProducts");

const createProduct = async (_, args) => {
    try {
        const { name, description, price, inventory, category } = args.input;
        const { isValid, errors } = validateNewProduct({ name, description, price, inventory, category });
        if (!isValid) {
            throw new GraphQLError(errors.join(' '));
        }

        const newProduct = new Product({
            name,
            description,
            price,
            inventory,
            category
        });
        const product = await newProduct.save();

        return {
            success: true,
            message: 'Product created successfully.',
            product
        }
    } catch (error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

const updateProduct = async (_, args) => {
    try {
        const { _id, input } = args;

        const existingProduct = await Product.findById(_id);
        if (!existingProduct) {
            throw new GraphQLError('Product not found');
        }

        const updatedProductData = {
            ...existingProduct.toObject(),
            ...input
        };

        const { isValid, errors } = validateNewProduct(updatedProductData);
        if (!isValid) {
            throw new GraphQLError(errors.join(', '));
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            _id,
            { $set: input },
            { runValidators: true, new: true }
        );

        client.del(`product:${_id}`);

        return {
            success: true,
            message: 'Product updated successfully.',
            product: updatedProduct
        };
    } catch (error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

const deleteProduct = async (_, args) => {
    try {
        const { _id } = args;

        const product = await Product.findById(_id);
        if (!product) {
            throw new GraphQLError('Product not found');
        }

        await Product.findByIdAndDelete(_id);

        return {
            success: true,
            message: 'Product successfully deleted',
            product
        };
    } catch(error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

const getProduct = async (_, args) => {
    try {
        const { id } = args;
        if (!id) {
            throw new GraphQLError('Product ID is required');
        }

        const redisKey = `product:${id}`;
        const cachedProduct = await getCacheProduct(redisKey);
        if (cachedProduct) {
            return {
                success: true,
                message: 'Product found',
                product: cachedProduct
            };
        }

        const product = await Product.findById(id);
        if (!product) {
            throw new GraphQLError('Product not found');
        }

        client.setEx(redisKey, 3600, JSON.stringify(product));

        return {
            success: true,
            message: 'Product found',
            product
        };

    } catch (error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

const getProducts = async () => {
    try {
        const redisKey = 'products:all';
        const cachedProducts = await getCacheProducts(redisKey);
        if (cachedProducts) {
            return {
                success: true,
                message: 'Products found',
                products: cachedProducts
            };
        }

        const products = await Product.find();

        client.setEx(redisKey, 3600, JSON.stringify(products));

        return {
            success: true,
            message: 'Products found',
            products
        };

    } catch (error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

const updateInventory = async (_, args) => {
    try {
        const { _id, inventory } = args;
        console.log(_id, inventory);
        if (!_id) {
            throw new GraphQLError('Product ID is required');
        }
        if (typeof inventory !== 'number' || inventory < 0) {
            throw new GraphQLError('Inventory must be a non-negative number');
        }

        const product = await Product.findById(_id);
        if (!product) {
            throw new GraphQLError('Product not found');
        }

        product.inventory = inventory;
        const updatedProduct = await product.save();

        return {
            success: true,
            message: 'Inventory updated successfully',
            product: updatedProduct
        };
    } catch (error) {
        throw new GraphQLError(error.message || 'Internal server error');
    }
};

const orderProduct = async ({productId, quantity}) => {
    const product = await Product.findById(productId);
    if (!product) {
        return {
            success: false,
            message: 'Product not found'
        };
    }
    if(product.inventory < quantity) {
        return {
            success: false,
            message: 'Product out of stock'
        };
    }
    product.inventory -= quantity;
    await product.save();
    return {
        success: true,
        message: 'Product ordered successfully'
    };
};


module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateInventory,
    orderProduct
};