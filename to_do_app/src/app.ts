import express from 'express';
import router from './routes/index';

import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['One', 'Two'], 
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));


app.use('/v1', router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
