const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL,{
    tls:{},
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
});

redisClient.on('connect', ()=> {
    console.log('Redis connected successfully');
});

redisClient.on('error', (error) => {
    console.error('Redis connection error:', error.message);
});

module.exports = redisClient;
