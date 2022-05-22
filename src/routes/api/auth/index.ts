import { FastifyPluginCallback } from 'fastify';
import { IRegisterBody, ILoginBody } from './types';
import { registerSchema, loginSchema } from './schema';

const authRoutes: FastifyPluginCallback = (fastify, opts, done) => {
    fastify.post<{ Body: IRegisterBody }>('/register', { schema: registerSchema }, (request, reply) => {
        const { email, username, password } = request.body;

        reply.send({ email, username, password });
    });

    fastify.post<{ Body: ILoginBody }>('/login', { schema: loginSchema }, (request, reply) => {
        const { email, password } = request.body;

        reply.send({ email, password });
    });

    done();
};

export default authRoutes;
