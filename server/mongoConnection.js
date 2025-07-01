// mongoConnection.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

let db;

async function connectMongoDB() {
    if (!db) {
        await client.connect();
        db = client.db('inventory_db');
        console.log("✅ MongoDB Connected!");
    }
    return db;
}

function getMongoDB() {
    if (!db) throw new Error('MongoDB not connected!');
    return db;
}

async function closeMongoDB() {
    await client.close();
    console.log('✅ MongoDB connection closed');
}

module.exports = { connectMongoDB, getMongoDB, closeMongoDB };
