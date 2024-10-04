const client = require("../config/redis");

const getCacheUser = async (redisKey) => {
    try {
        const cachedUser = await client.get(redisKey);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
        return null;
    } catch (err) {
        console.error('Error fetching from Redis:', err);
        return null;
    }
};

const getCacheUsers = async (redisKey) => {
    try {
        const cachedUsers = await client.get(redisKey);
        if (cachedUsers) {
            return JSON.parse(cachedUsers);
        }
        return null;
    } catch (err) {
        console.error('Error fetching from Redis:', err);
        return null;
    }
};

module.exports = { getCacheUser, getCacheUsers };
