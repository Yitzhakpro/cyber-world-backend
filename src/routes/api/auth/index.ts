import { FastifyPluginCallback } from 'fastify';
import { authService } from '../../../services';
import { DecodedToken, IRegisterBody, ILoginBody } from './types';
import { registerSchema, loginSchema } from './schema';
import config from '../../../config';

const jwtConfig = config.get('auth.jwt.options');
const accessTokenName = config.get('auth.cookie.name');

const authRoutes: FastifyPluginCallback = (fastify, opts, done) => {
    fastify.get('/isAuthenticated', async (request, reply) => {
        try {
            await request.jwtVerify();
            const { username } = request.user as DecodedToken;
            const IsAuthenticatedResponse = await authService.isAuthenticated(username);

            reply.send(IsAuthenticatedResponse);
        } catch (err) {
            reply.send({ loggedIn: false });
        }
    });

    fastify.post<{ Body: IRegisterBody }>('/register', { schema: registerSchema }, async (request, reply) => {
        const { email, username, password, birthDate, rememberMe } = request.body;

        const registeredUserInfo = await authService.register(email, username, password, birthDate);

        const token = fastify.jwt.sign(registeredUserInfo, jwtConfig);

        reply.setCookie(accessTokenName, token).send(registeredUserInfo);
    });

    fastify.post<{ Body: ILoginBody }>('/login', { schema: loginSchema }, async (request, reply) => {
        const { email, password, rememberMe } = request.body;

        const loginStatus = await authService.login(email, password);

        if (loginStatus.success) {
            const token = fastify.jwt.sign({ ...loginStatus.userInfo }, jwtConfig);
            reply.setCookie(accessTokenName, token, { secure: true, expires: new Date('2022-06-24'), httpOnly: true }).send(loginStatus);
        } else {
            reply.send(loginStatus);
        }
    });

    done();
};

export default authRoutes;
