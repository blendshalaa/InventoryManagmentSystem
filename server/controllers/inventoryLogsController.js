const InventoryLogs = require('../models/InventoryLogs');

const createLog = async (req, res) => {
    try {
        console.log('Received body:', JSON.stringify(req.body, null, 2)); // Debug
        const { item_id, action, quantity_change } = req.body;
        if (!item_id || !action || !quantity_change) {
            return res.status(400).json({ message: 'item_id, action, and quantity_change are required' });
        }
        if (!['add', 'remove', 'update'].includes(action)) {
            return res.status(400).json({ message: 'action must be add, remove, or update' });
        }
        if (!Number.isInteger(Number(item_id)) || Number(item_id) < 0) {
            return res.status(400).json({ message: 'item_id must be a positive integer' });
        }
        if (!Number.isInteger(Number(quantity_change))) {
            return res.status(400).json({ message: 'quantity_change must be an integer' });
        }
        const newLog = await InventoryLogs.createLog({ item_id, action, quantity_change });
        return res.status(201).json(newLog);
    } catch (err) {
        console.error('Error creating log:', err);
        return res.status(400).json({ message: err.message || 'Error creating log' });
    }
};

const getLogsByItemId = async (req, res) => {
    try {
        const { item_id } = req.params;
        if (!item_id || isNaN(item_id) || Number(item_id) < 0) {
            return res.status(400).json({ message: 'Valid positive item_id is required' });
        }
        const logs = await InventoryLogs.getLogsByItemId(item_id);
        return res.status(200).json(logs);
    } catch (err) {
        console.error('Error fetching logs:', err);
        return res.status(400).json({ message: err.message || 'Error fetching logs' });
    }
};

const getAllLogs = async (req, res) => {
    try {
        const logs = await InventoryLogs.getAllLogs();
        return res.status(200).json(logs);
    } catch (err) {
        console.error('Error fetching all logs:', err);
        return res.status(500).json({ message: 'Error fetching all logs' });
    }
};

module.exports = { createLog, getLogsByItemId, getAllLogs };