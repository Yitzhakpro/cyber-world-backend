import { FastifyPluginCallback } from 'fastify';
import { authService } from '../../../services';
import { IRegisterBody, ILoginBody } from './types';
import { registerSchema, loginSchema } from './schema';

const authRoutes: FastifyPluginCallback = (fastify, opts, done) => {
    fastify.post<{ Body: IRegisterBody }>('/register', { schema: registerSchema }, async (request, reply) => {
        const { email, username, password, birthDate, rememberMe } = request.body;

        const registeredUserInfo = await authService.register(email, username, password, birthDate);

        // TODO: move amount of seconds to config
        const token = fastify.jwt.sign(registeredUserInfo, { expiresIn: 300 }); // 5 mins

        reply.setCookie('accessToken', token).send(registeredUserInfo);
    });

    fastify.post<{ Body: ILoginBody }>('/login', { schema: loginSchema }, async (request, reply) => {
        const { email, password, rememberMe } = request.body;

        const loginStatus = await authService.login(email, password);

        if (loginStatus.success) {
            // TODO: move amount of seconds to config
            const token = fastify.jwt.sign({ ...loginStatus.userInfo }, { expiresIn: 300 }); // 5 mins
            reply.setCookie('accessToken', token, { secure: true, expires: new Date('2022-06-24'), httpOnly: true }).send(loginStatus);
        } else {
            reply.send(loginStatus);
        }
    });

    done();
};

export default authRoutes;
