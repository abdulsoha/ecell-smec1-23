import express from 'express';
import paymentRoutes from './routes/payment.js'; // or .ts if using ESModules correctly

const app = express();
app.use(express.json());

// ✅ Register your payment routes
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
