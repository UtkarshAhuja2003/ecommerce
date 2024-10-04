const client = require("../config/redis");

const getCacheProduct = async (redisKey) => {
    try {
        const cachedProduct = await client.get(redisKey);
        if (cachedProduct) {
            return JSON.parse(cachedProduct);
        }
        return null;
    } catch (err) {
        console.error('Error fetching from Redis:', err);
        return null;
    }
};

const getCacheProducts = async (redisKey) => {
    try {
        const cachedProducts = await client.get(redisKey);
        if (cachedProducts) {
            return JSON.parse(cachedProducts);
        }
        return null;
    } catch (err) {
        console.error('Error fetching from Redis:', err);
        return null;
    }
};

module.exports = { getCacheProduct, getCacheProducts };
