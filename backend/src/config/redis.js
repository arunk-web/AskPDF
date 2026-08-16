const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL,{
    tls:{},
});

redisClient.on('connect', ()=> {
    console.log('Redis connected successfully');
});

redisClient.on('error', (error) => {
    console.error('Redis connection error:', error.message);
});

module.exports = redisClient;
