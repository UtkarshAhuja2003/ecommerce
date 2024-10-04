const client = require("../config/redis");

const getCacheOrder = async (redisKey) => {
    try {
        const cachedOrder = await client.get(redisKey);
        if (cachedOrder) {
            return JSON.parse(cachedOrder);
        }
        return null;
    } catch (err) {
        console.error('Error fetching from Redis:', err);
        return null;
    }
};

const getCacheOrders = async (redisKey) => {
    try {
        const cachedOrders = await client.get(redisKey);
        if (cachedOrders) {
            return JSON.parse(cachedOrders);
        }
        return null;
    } catch (err) {
        console.error('Error fetching from Redis:', err);
        return null;
    }
};

module.exports = { getCacheOrder, getCacheOrders };
