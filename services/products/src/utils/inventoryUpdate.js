const { connectRabbitMQ } = require("../config/messageQueue");
const { orderProduct } = require("../resolvers/product");

const QUEUE = "product_inventory_update";

async function updateInventory(products) {
    for (const product of products) {
        const { productId, quantity } = product;
        const res = await orderProduct({ productId, quantity });
        if(!res.success) {
            console.error(`Failed to update inventory for product: ${productId}`);
            console.error(res.message);
        }
    }
}

async function getInventoryUpdates() {
    const { channel } = await connectRabbitMQ();

    if (!channel) {
        console.error("RabbitMQ channel is not initialized.");
        return;
    }

    channel.assertQueue(QUEUE, { durable: false });

    channel.consume(QUEUE, (msg) => {
        if(msg.content) {
            const products = JSON.parse(msg.content.toString());
            updateInventory(products);
        }
    }, { noAck: true });
}

module.exports = { getInventoryUpdates };
