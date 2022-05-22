import fastify from 'fastify';
import fastifyCors from '@fastify/cors';

const createServer = () => {
    const server = fastify();

    // fastify ecosystem
    server.register(fastifyCors, { credentials: true });
    // my plugins
    // decorators
    // hooks
    // my services

    return server;
};

export default createServer;
