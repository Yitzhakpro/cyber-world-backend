import { FastifyPluginCallback } from 'fastify';
import { authService } from '../../../services';
import { IRegisterBody, ILoginBody } from './types';
import { registerSchema, loginSchema } from './schema';

const authRoutes: FastifyPluginCallback = (fastify, opts, done) => {
    fastify.post<{ Body: IRegisterBody }>('/register', { schema: registerSchema }, async (request, reply) => {
        const { email, username, password, birthDate, rememberMe } = request.body;

        const registeredUser = await authService.register(email, username, password, birthDate);

        reply.send({ registeredUser });
    });

    fastify.post<{ Body: ILoginBody }>('/login', { schema: loginSchema }, (request, reply) => {
        const { email, password, rememberMe } = request.body;

        reply.send({ email, password });
    });

    done();
};

export default authRoutes;
