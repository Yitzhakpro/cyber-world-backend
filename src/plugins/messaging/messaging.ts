import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Server } from 'socket.io';
import { SocketMessaingController } from '@services';
import config from '@config';

// TODO: Add better errors

const corsConfig = config.get('cors');

const messaging: FastifyPluginAsync = async (fastify, opts) => {
    try {
        const ioServer = new Server(fastify.server, { cors: { ...corsConfig } });

        const socketMessaingController = new SocketMessaingController(ioServer, fastify.jwt);

        fastify.decorate('messaingController', socketMessaingController);
        fastify.log.info('Initialized socket io server');
    } catch (err) {
        throw new Error('Failed in socket io');
    }
};

export default fp(messaging);
