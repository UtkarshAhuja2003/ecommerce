const { connectRabbitMQ } = require("../config/messageQueue");

const USER_REGISTER_QUEUE = "user_register";
const PROFILE_UPDATE_QUEUE = "profile_update";

async function userRegisterEvent(user) {
    try {
        const { channel } = await connectRabbitMQ();

        channel.assertQueue(USER_REGISTER_QUEUE, { durable: false });
        channel.sendToQueue(USER_REGISTER_QUEUE, Buffer.from(JSON.stringify(user)));
        console.log("User Registered", user);
    } catch (error) {
        console.error("Error sending message to RabbitMQ", error.message);
    }
}

async function profileUpdateEvent(user) {
    try {
        const { channel } = await connectRabbitMQ();

        channel.assertQueue(PROFILE_UPDATE_QUEUE, { durable: false });
        channel.sendToQueue(PROFILE_UPDATE_QUEUE, Buffer.from(JSON.stringify(user)));
        console.log("User Profile Updated", user);
    } catch (error) {
        console.error("Error sending message to RabbitMQ", error.message);
    }
}

module.exports = { userRegisterEvent, profileUpdateEvent };