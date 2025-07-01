const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db'); // Shared PostgreSQL pool

const SECRET_KEY = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// Register
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !['admin', 'user'].includes(role)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const result = await pool.query(
            'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING user_id, email, role',
            [email, hashedPassword, role]
        );
        const user = result.rows[0];
        const token = jwt.sign({ userId: user.user_id, email: user.email, role: user.role }, SECRET_KEY, {
            expiresIn: '1h',
        });
        res.status(201).json({ token, user: { userId: user.user_id, email: user.email, role: user.role } });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.user_id, email: user.email, role: user.role }, SECRET_KEY, {
            expiresIn: '1h',
        });
        res.json({ token, user: { userId: user.user_id, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create User (admin-only)
router.post('/create-user', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !['admin', 'user'].includes(role)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const result = await pool.query(
            'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING user_id, email, role',
            [email, hashedPassword, role]
        );
        const user = result.rows[0];
        res.status(201).json({ user: { userId: user.user_id, email: user.email, role: user.role } });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;