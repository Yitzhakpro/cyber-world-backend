import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import rootRouter from './routes';

const createServer = () => {
    const server = fastify();

    // fastify ecosystem
    server.register(fastifyCors, { credentials: true });
    // my plugins
    // decorators
    // hooks
    // my services
    server.register(rootRouter);

    return server;
};

export default createServer;
