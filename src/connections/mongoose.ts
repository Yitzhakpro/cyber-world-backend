import mongoose from 'mongoose';
import config from '@config';

const { ip, port, name } = config.get('database.mongodb');
const MONGO_URI = `mongodb://${ip}:${port}/${name}`;

// TODO: add better error handling

const connectToMongo = async () => {
    try {
        await mongoose.connect(MONGO_URI, { connectTimeoutMS: 9000 });
    } catch (err: any) {
        throw err;
    }
};

export default connectToMongo;
