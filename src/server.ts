import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { dbConnections, messaging } from '@plugins';
import verifySavedToken from './decorators';
import rootRouter from './routes';
import config from '@config';

const env = config.get('env');
const corsConfig = config.get('cors');
const accessTokenSecret = config.get('auth.jwt.secret');
const accessTokenName = config.get('auth.cookie.name');

const createServer = () => {
    const server = fastify({
        logger: {
            prettyPrint:
                env === 'development'
                    ? {
                          translateTime: 'SYS:HH:MM:ss TT',
                          ignore: 'pid,hostname',
                      }
                    : false,
        },
        pluginTimeout: 100000,
    });

    // fastify ecosystem
    server.register(fastifyCors, corsConfig);
    server.register(fastifyCookie);
    server.register(fastifyJwt, {
        secret: accessTokenSecret,
        cookie: {
            cookieName: accessTokenName,
            signed: false,
        },
    });
    // my plugins
    server.register(dbConnections);
    server.register(messaging);
    // decorators
    server.register(verifySavedToken);
    // hooks
    // my services
    server.register(rootRouter);

    return server;
};

export default createServer;
