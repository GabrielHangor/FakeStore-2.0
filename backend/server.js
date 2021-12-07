import express from 'express';
import dotenv from 'dotenv';
import connectToDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

connectToDB();

const app = express();

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
