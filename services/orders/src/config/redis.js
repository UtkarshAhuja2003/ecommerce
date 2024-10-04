const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

(async () => {
    await client.connect();
})();

module.exports = client;