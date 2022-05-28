import { RedisClientType } from '@redis/client';
import { RedisClient } from '@databases';

// TODO: add better errors

class AuthDAL {
    redisClient: RedisClientType;

    constructor() {
        this.redisClient = RedisClient.client;
    }

    async getUserToken(username: string) {
        try {
            const token = await this.redisClient.get(username);

            return token;
        } catch (err) {
            throw new Error('Could not get user token');
        }
    }

    async setUsernameToken(username: string, token: string) {
        try {
            await this.redisClient.setEx(username, 300, token);
        } catch (err) {
            throw new Error('Could not set user token');
        }
    }

    async removeUsernameToken(username: string) {
        try {
            await this.redisClient.del(username);
        } catch (err) {
            throw new Error('Could not delete user token');
        }
    }
}

export default new AuthDAL();
