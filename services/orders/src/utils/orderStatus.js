const { connectRabbitMQ } = require("../config/messageQueue");

const ORDER_STATUS_QUEUE = "order_status_update";

async function emitOrderStatus(orderId, status) {
    try {
        const { channel } = await connectRabbitMQ();

        const message = {
            orderId: orderId,
            status: status,
            timestamp: new Date()
        };

        channel.assertQueue(ORDER_STATUS_QUEUE, { durable: false });
        channel.sendToQueue(ORDER_STATUS_QUEUE, Buffer.from(JSON.stringify(message)));
        
        console.log(`Order status updated: ${orderId} is now ${status}`);
    } catch (error) {
        console.error("Error sending message to RabbitMQ", error.message);
    }
}

module.exports = { emitOrderStatus };
