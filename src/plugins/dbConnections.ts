import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { connectToMongo } from '../connections';

// TODO: Add better errors

const dbConnections: FastifyPluginAsync = async (fastify, opts) => {
    try {
        await connectToMongo();

        fastify.log.info('Connected to databases');
    } catch (err) {
        fastify.log.error(err);
        throw new Error('failed to connect to databases');
    }
};

export default fp(dbConnections);
