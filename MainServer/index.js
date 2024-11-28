const express = require('express');
const cors = require('cors');
const http = require('http');
const { createAdapter } = require("@socket.io/redis-adapter");
const { pubClient, subClient } = require("./helpers/redis_helper");

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server, {
    maxHttpBufferSize: 5 * 1024 * 1024,
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
        credentials: true
    }
});

io.adapter(createAdapter(pubClient, subClient, { requestsTimeout: 5000 }));

subClient.subscribe('main-server', (data, error) => {
    if (!data) {
        console.error('Failed to subscribe the Redis channel');
    } else {
        let new_data = JSON.parse(data);
        console.log(`From : ${new_data.from}, To: ${new_data.to}`);
        pubClient.publish('client-server-' + new_data.from, JSON.stringify({ from: 'Main', to: new_data.from }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Main Server is running on port ${PORT}`);
});