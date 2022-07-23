import express from 'express';
import userRoutes from './routes/UserRoutes';
import sessionRoutes from './routes/SessionRoutes';
import themeRoutes from './routes/ThemeRoutes';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

async function connectToDatabase() {
    try {
        const connection = await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017'
        );
        console.log(connection.connection.host);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

config();
connectToDatabase();

const app = express();
const whitelist = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://iridescent-brioche-d82873.netlify.app',
];
const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use(express.json());
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/themes', themeRoutes);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
