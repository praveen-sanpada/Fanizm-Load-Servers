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

pubClient.publish('main-server', JSON.stringify({ from: 'Server1', to: "Main" }));

subClient.subscribe('client-server-Server1', (data, error) => {
    if (!data) {
        console.error('Failed to subscribe to Redis channel');
    } else {
        let new_data = JSON.parse(data);
        console.log(`From : ${new_data.from}, To: ${new_data.to}`);
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server1 is running on port ${PORT}`);
});