import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment';

dotenv.config();

const app = express();

// raw body for webhook verification
app.use((req, res, next) => {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => (data += chunk));
  req.on('end', () => {
    (req as any).rawBody = data;
    next();
  });
});

app.use(express.json());
app.use(cors());

app.use('/api/payment', paymentRoutes);

app.get('/', (_, res) => {
  res.send('Backend is running');
});

export default app;
