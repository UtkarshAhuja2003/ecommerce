const app = require("./app");

const PORT = process.env.PORT || 8001;
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`User service started on Port: ${PORT} in ${NODE_ENV} Environment`);
    })
}

try {
    startServer();
} catch (error) {
    console.error("An error occured while starting server", error.message);
}