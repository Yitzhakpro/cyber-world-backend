import { FastifyPluginCallback } from 'fastify';
import apiRoutes from './api';

const rootRouter: FastifyPluginCallback = (fastify, opts, done) => {
    fastify.register(apiRoutes, { prefix: '/api' });

    done();
};

export default rootRouter;
