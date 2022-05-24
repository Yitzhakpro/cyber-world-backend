import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { dbConnections } from './plugins';
import rootRouter from './routes';
import config from './config';

const corsConfig = config.get('cors');

const createServer = () => {
    const server = fastify({ logger: true, pluginTimeout: 100000 });

    // fastify ecosystem
    server.register(fastifyCors, corsConfig);
    // my plugins
    server.register(dbConnections);
    // decorators
    // hooks
    // my services
    server.register(rootRouter);

    return server;
};

export default createServer;
