const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');
const connectMongoDB = require('./mongoConnection');
const mongoose = require('mongoose');
const categoriesRoutes = require('./routes/categoriesRoutes');
const suppliersRoutes = require('./routes/suppliersRoutes');
const itemsRoutes = require('./routes/itemsRoutes');
const itemSuppliersRoutes=require('./routes/itemSuppliersRoutes')

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

connectMongoDB();

// PostgreSQL test route
app.get('/test-connection', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Database connected at:', result.rows[0].now);
        res.json({ message: 'Database connected!', time: result.rows[0].now });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ error: 'Database connection failed!' });
    }
});

// MongoDB test route
app.get('/test-mongo', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
        res.json({ message: 'MongoDB connected!' });
    } else {
        res.status(500).json({ error: 'MongoDB not connected' });
    }
});




//ROUTES

app.use('/api/categories', categoriesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/itemsuppliers', itemSuppliersRoutes);







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
