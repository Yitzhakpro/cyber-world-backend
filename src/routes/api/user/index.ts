import { FastifyPluginCallback } from 'fastify';
import { IGetUserByIdParams } from './types';
import { getUserByIdSchema } from './schema';

const userRoutes: FastifyPluginCallback = (fastify, opts, done) => {
    fastify.get<{ Params: IGetUserByIdParams }>('/:userId', { schema: getUserByIdSchema }, (request, reply) => {
        const { userId } = request.params;

        reply.send({ userId });
    });

    done();
};

export default userRoutes;
