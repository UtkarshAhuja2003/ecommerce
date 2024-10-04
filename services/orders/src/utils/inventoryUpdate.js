const { connectRabbitMQ } = require("../config/messageQueue");

const QUEUE = "product_inventory_update";

async function updateInventory(products) {
    try {
        const { channel } = await connectRabbitMQ();

        channel.assertQueue(QUEUE, { durable: false });
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(products)));
    } catch (error) {
        console.error("Error sending message to RabbitMQ", error.message);
    }
}

module.exports = { updateInventory };