require('dotenv').config();
const { MongoClient } = require('mongodb');
const { Pool } = require('pg');
const Notifications = require('./Notifications');
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);
const dbName = 'inventory_db';

const pgPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT)
});

const InventoryLogs = {
    async createLog({ item_id, action, quantity_change }) {
        try {
            await client.connect();
            const db = client.db(dbName);
            const parsedItemId = parseInt(item_id, 10);
            const parsedQuantityChange = parseInt(quantity_change, 10);
            if (isNaN(parsedItemId) || parsedItemId <= 0) {
                throw new Error('item_id must be a positive integer');
            }
            if (!['add', 'remove', 'update'].includes(action)) {
                throw new Error('action must be add, remove, or update');
            }
            if (isNaN(parsedQuantityChange)) {
                throw new Error('quantity_change must be an integer');
            }
            const itemCheck = await pgPool.query('SELECT item_id, quantity FROM items WHERE item_id = $1', [parsedItemId]);
            if (itemCheck.rowCount === 0) {
                throw new Error('Item does not exist');
            }
            const log = {
                item_id: parsedItemId,
                action,
                quantity_change: parsedQuantityChange,
                timestamp: new Date()
            };
            console.log('Inserting log:', JSON.stringify(log, null, 2));
            const result = await db.collection('inventory_logs').insertOne(log);
            // Check for low stock
            const item = itemCheck.rows[0];
            const newQuantity = item.quantity + (action === 'remove' ? -parsedQuantityChange : parsedQuantityChange);
            if (newQuantity < 5) {
                await Notifications.createNotification({
                    item_id: parsedItemId,
                    type: 'low_stock',
                    message: `Item ${parsedItemId} stock is low: ${newQuantity} units remaining`,
                    status: 'unread'
                });
            }
            return { _id: result.insertedId, ...log };
        } catch (err) {
            console.error('Create log error:', err);
            throw err;
        } finally {
            await client.close();
        }
    },

    async getLogsByItemId(item_id) {
        try {
            await client.connect();
            const db = client.db(dbName);
            const parsedItemId = parseInt(item_id, 10);
            if (isNaN(parsedItemId) || parsedItemId <= 0) {
                throw new Error('item_id must be a positive integer');
            }
            return await db.collection('inventory_logs')
                .find({ item_id: parsedItemId })
                .sort({ timestamp: -1 })
                .toArray();
        } finally {
            await client.close();
        }
    },

    async getAllLogs() {
        try {
            await client.connect();
            const db = client.db(dbName);
            return await db.collection('inventory_logs')
                .find({})
                .sort({ timestamp: -1 })
                .toArray();
        } finally {
            await client.close();
        }
    }
};

module.exports = InventoryLogs;