
            require('dotenv').config();
            const express = require('express');
            const cors = require('cors');
            const { expressjwt: jwt } = require('express-jwt');
            const mongoose = require('mongoose');
            const pool = require('./db'); // PostgreSQL pool
            const { connectMongoDB, closeMongoDB } = require('./mongoConnection');

            // Import routes
            const categoriesRoutes = require('./routes/categoriesRoutes');
            const suppliersRoutes = require('./routes/suppliersRoutes');
            const itemsRoutes = require('./routes/itemsRoutes');
            const itemSuppliersRoutes = require('./routes/itemSuppliersRoutes');
            const inventoryLogsRoutes = require('./routes/inventoryLogsRoutes');
            const notificationRoutes = require('./routes/notificationRoutes');
            const authRoutes = require('./routes/auth');

            const app = express();
            const port = process.env.PORT || 5000;

            // Middleware
            app.use(cors());
            app.use(express.json());

            // JWT middleware
            const authMiddleware = jwt({
              secret: process.env.JWT_SECRET,
              algorithms: ['HS256'],
              credentialsRequired: true,
            });

            // Role-based middleware example
            const restrictTo = (roles) => {
              return (req, res, next) => {
                if (!roles.includes(req.auth.role)) {
                  return res.status(403).json({ message: 'Forbidden' });
                }
                next();
              };
            };

            // Public test route for PostgreSQL
            app.get('/test-connection', async (req, res) => {
              try {
                const result = await pool.query('SELECT NOW()');
                console.log('Database connected at:', result.rows[0].now);
                res.json({ message: 'Database connected!', time: result.rows[0].now });
              } catch (err) {
                console.error('Database connection error:', err);
                res.status(500).json({ error: 'Database connection error' });
              }
            });

            // Public test route for MongoDB
            app.get('/test-mongo', (req, res) => {
              const isConnected = mongoose.connection.readyState === 1;
              if (isConnected) {
                res.json({ message: 'MongoDB connected!' });
              } else {
                res.status(500).json({ error: 'MongoDB not connected' });
              }
            });

            // Public auth routes (register/login)
            app.use('/api/auth', authRoutes);

            // Protected routes
            app.use('/api/categories', authMiddleware, categoriesRoutes);
            app.use('/api/suppliers', authMiddleware, suppliersRoutes);
            app.use('/api/items', authMiddleware, itemsRoutes);
            app.use('/api/itemsuppliers', authMiddleware, itemSuppliersRoutes);
            app.use('/api/inventory_logs', authMiddleware, inventoryLogsRoutes);
            app.use('/api/notifications', authMiddleware, notificationRoutes);

            // Example admin-only route
            app.post('/api/auth/create-user', authMiddleware, restrictTo(['admin']), (req, res) => {
              res.json({ message: 'User created (placeholder)' });
            });

            // Start server *after* connecting to MongoDB
            (async () => {
              try {
                await connectMongoDB();
                app.listen(port, () => {
                  console.log(`🚀 Server running on port ${port}`);
                });
              } catch (err) {
                console.error('❌ Failed to connect to MongoDB:', err);
                process.exit(1);
              }
            })();
