import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import authRouter from './src/routes/auth.route.js';
import sessionRouter from './src/routes/session.route.js';
import errorHandler from './src/middlewares/errorHandler.js';

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
    origin : process.env.CLIENT_URL || 'http://localhost:3000',
    credentials : true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/api/health', (req, res) => {
    res.status(200).json({
        status : 'success',
        message : 'Server is healthy',
        timestamp : new Date().toISOString()
    });
});

app.use('/api/auth', authRouter)
app.use('/api/session', sessionRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});