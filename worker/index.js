const keys = require('./keys'); // Connection hostname and port to redis
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate(); // Subscribes to redis and watched when a new value id added then it calls fib to find corresponding fib no

function fib(index) {
    if(index<2) return 1;
    return fib(index-2)+fib(index-1);
}

sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert'); // Subscribes to insert event when a new key is inserted