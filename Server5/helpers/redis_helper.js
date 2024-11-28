const { createClient } = require("redis");

const pubClient = createClient({
    url: 'redis://127.0.0.1:6379',
    password: 'Pxj2DEAuMWLG2'
});

const subClient = pubClient.duplicate();

pubClient.connect().catch(console.error);
subClient.connect().catch(console.error);

module.exports = { pubClient, subClient };
