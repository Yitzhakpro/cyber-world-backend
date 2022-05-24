import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { dbConnections } from './plugins';
import rootRouter from './routes';
import config from './config';

const corsConfig = config.get('cors');
const accessTokenSecret = config.get('auth.jwt.secret');

const createServer = () => {
    const server = fastify({ logger: true, pluginTimeout: 100000 });

    // fastify ecosystem
    server.register(fastifyCors, corsConfig);
    server.register(fastifyCookie);
    server.register(fastifyJwt, { secret: accessTokenSecret });
    // my plugins
    server.register(dbConnections);
    // decorators
    // hooks
    // my services
    server.register(rootRouter);

    return server;
};

export default createServer;
