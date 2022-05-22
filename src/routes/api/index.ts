import { FastifyPluginCallback } from 'fastify';
import authRoutes from './auth';
import userRoutes from './user';

const apiRoutes: FastifyPluginCallback = (fastify, opts, done) => {
    fastify.register(authRoutes, { prefix: '/auth' });
    fastify.register(userRoutes, { prefix: '/user' });

    done();
};

export default apiRoutes;
