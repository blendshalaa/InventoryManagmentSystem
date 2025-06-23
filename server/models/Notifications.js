require('dotenv').config();
const { MongoClient } = require('mongodb');
const { Pool } = require('pg');

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri);
const dbName = 'inventory_db';

const pgPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT)
});

const Notifications = {
    async createNotification({ item_id, type, message, status = 'unread' }) {
        try {
            await client.connect();
            const db = client.db(dbName);
            // Validate inputs
            const parsedItemId = parseInt(item_id, 10);
            if (isNaN(parsedItemId) || parsedItemId <= 0) {
                throw new Error('item_id must be a positive integer');
            }
            if (!['low_stock', 'item_added', 'item_updated'].includes(type)) {
                throw new Error('type must be low_stock, item_added, or item_updated');
            }
            if (typeof message !== 'string' || message.trim() === '') {
                throw new Error('message must be a non-empty string');
            }
            if (!['unread', 'read'].includes(status)) {
                throw new Error('status must be unread or read');
            }
            // Check if item_id exists in items table
            const itemCheck = await pgPool.query('SELECT item_id FROM items WHERE item_id = $1', [parsedItemId]);
            if (itemCheck.rowCount === 0) {
                throw new Error('Item does not exist');
            }
            const notification = {
                item_id: parsedItemId,
                type,
                message,
                timestamp: new Date(),
                status
            };
            console.log('Inserting notification:', JSON.stringify(notification, null, 2)); // Debug
            const result = await db.collection('notifications').insertOne(notification);
            return { _id: result.insertedId, ...notification };
        } catch (err) {
            console.error('Create notification error:', err);
            throw err;
        } finally {
            await client.close();
        }
    },

    async getNotificationsByItemId(item_id) {
        try {
            await client.connect();
            const db = client.db(dbName);
            const parsedItemId = parseInt(item_id, 10);
            if (isNaN(parsedItemId) || parsedItemId <= 0) {
                throw new Error('item_id must be a positive integer');
            }
            return await db.collection('notifications')
                .find({ item_id: parsedItemId })
                .sort({ timestamp: -1 })
                .toArray();
        } finally {
            await client.close();
        }
    },

    async getAllNotifications() {
        try {
            await client.connect();
            const db = client.db(dbName);
            return await db.collection('notifications')
                .find({})
                .sort({ timestamp: -1 })
                .toArray();
        } finally {
            await client.close();
        }
    }
};

module.exports = Notifications;