import { FastifyPluginCallback } from 'fastify';
import { userService, authService } from '@services';
import { IRegisterBody, ILoginBody } from './types';
import { registerSchema, loginSchema } from './schema';
import config from '@config';

const jwtConfig = config.get('auth.jwt.options');
const accessTokenName = config.get('auth.cookie.name');
const accessCookieOptions = config.get('auth.cookie.options');

const authRoutes: FastifyPluginCallback = (fastify, opts, done) => {
    fastify.get('/activity', { onRequest: fastify.verifyAgainstSavedToken }, async (request, reply) => {
        // ? maybe prevent from re-issue token because of spamming
        try {
            await request.jwtVerify();

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { username } = request.user!;

            const userInfo = await userService.getUserInfoByUsername(username);
            const token = fastify.jwt.sign(userInfo, jwtConfig);
            await authService.saveToken(username, token);

            reply.setCookie(accessTokenName, token, accessCookieOptions).send(userInfo);
        } catch (err) {
            console.log('err: ', err);
            reply.status(500).send(err);
        }
    });

    fastify.get('/isAuthenticated', async (request, reply) => {
        try {
            await request.jwtVerify();

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { username } = request.user!;
            const IsAuthenticatedResponse = await authService.isAuthenticated(username);

            reply.send(IsAuthenticatedResponse);
        } catch (err) {
            reply.send({ loggedIn: false });
        }
    });

    fastify.post<{ Body: IRegisterBody }>('/register', { schema: registerSchema }, async (request, reply) => {
        const { email, username, password, birthDate } = request.body;

        const registerStatus = await authService.register(email, username, password, birthDate);

        const token = fastify.jwt.sign({ ...registerStatus.userInfo }, jwtConfig);
        await authService.saveToken(username, token);

        reply.setCookie(accessTokenName, token, accessCookieOptions).send(registerStatus);
    });

    fastify.post<{ Body: ILoginBody }>('/login', { schema: loginSchema }, async (request, reply) => {
        const { email, password } = request.body;

        const loginStatus = await authService.login(email, password);

        if (loginStatus.success && loginStatus.userInfo) {
            const { username } = loginStatus.userInfo;
            const token = fastify.jwt.sign({ ...loginStatus.userInfo }, jwtConfig);
            await authService.saveToken(username, token);

            reply.setCookie(accessTokenName, token, accessCookieOptions).send(loginStatus);
        } else {
            reply.send(loginStatus);
        }
    });

    done();
};

export default authRoutes;
