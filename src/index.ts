import createServer from './server';
import config from './config';

const IP = config.get('ip');
const PORT = config.get('port');

const server = createServer();

server.get('/ping', (request, reply) => {
    reply.send('pong');
});

server.listen(PORT, IP, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
