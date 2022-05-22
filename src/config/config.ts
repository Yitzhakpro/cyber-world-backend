import convict from 'convict';
import path from 'path';
import fs from 'fs';

const config = convict({
    env: {
        doc: 'The application environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV',
    },
    ip: {
        doc: 'The IP address to bind.',
        default: '0.0.0.0',
        env: 'IP_ADDRESS',
    },
    port: {
        doc: 'The port to bind.',
        format: 'port',
        default: 8080,
        env: 'PORT',
    },
});

const env = config.get('env');
const configPath = path.join(__dirname, `${env}.json`);
if (fs.existsSync(configPath)) {
    config.loadFile(configPath);
    console.info(`Loaded "${env}" config file succesfully`);
} else {
    console.warn(`Could not find "${env}" config file or it should not exist anyway.`);
}

export default config;
