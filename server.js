import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();
console.log("Ashar Pusing to see the pipeline!");
// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('HaariYaari API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
