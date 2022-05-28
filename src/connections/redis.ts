import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';
import config from '@config';

const redisClientOptions = config.get('database.redis.options');

class RedisClient {
    public client: RedisClientType;

    constructor() {
        this.client = createClient(redisClientOptions);
    }

    async connect() {
        await this.client.connect();
        console.log('[+] Connected to Redis server');
    }

    async disconnect() {
        await this.client.disconnect();
        console.log('[+] Disconnected from Redis server');
    }
}

const redisClient = new RedisClient();
redisClient.client.on('error', (err) => console.log('Redis client error: ', err));

export default redisClient;
