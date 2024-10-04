const amqp = require('amqplib/callback_api');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
    try {
        if (connection && channel) {
            return { connection, channel };
        }

        const rabbitMQURL = process.env.RABBITMQ_URL || 'amqp://localhost';

        return new Promise((resolve, reject) => {
            amqp.connect(rabbitMQURL, (error0, conn) => {
                if (error0) {
                    console.error("Failed to connect to RabbitMQ", error0.message);
                    return reject(error0);
                }

                console.log("Connected to RabbitMQ");

                conn.createChannel((error1, ch) => {
                    if (error1) {
                        console.error("Failed to create channel", error1.message);
                        return reject(error1);
                    }

                    connection = conn;
                    channel = ch;

                    console.log("Channel created successfully.");
                    resolve({ connection, channel }); 
                });
            });
        });

    } catch (error) {
        console.error("Error connecting to RabbitMQ", error.message);
    }
};

const closeRabbitMQ = () => {
    try {
        if (channel) {
            channel.close();
            console.log("RabbitMQ channel closed");
        }
        if (connection) {
            connection.close();
            console.log("RabbitMQ connection closed");
        }
    } catch (error) {
        console.error("Error closing RabbitMQ connection", error.message);
    }
};

module.exports = { connectRabbitMQ, closeRabbitMQ };
