const Notifications = require('../models/Notifications');

const createNotification = async (req, res) => {
    try {
        console.log('Received body:', JSON.stringify(req.body, null, 2)); // Debug
        const { item_id, type, message, status } = req.body;
        if (!item_id || !type || !message) {
            return res.status(400).json({ message: 'item_id, type, and message are required' });
        }
        if (!['low_stock', 'item_added', 'item_updated'].includes(type)) {
            return res.status(400).json({ message: 'type must be low_stock, item_added, or item_updated' });
        }
        if (typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ message: 'message must be a non-empty string' });
        }
        if (status && !['unread', 'read'].includes(status)) {
            return res.status(400).json({ message: 'status must be unread or read' });
        }
        const newNotification = await Notifications.createNotification({ item_id, type, message, status });
        return res.status(201).json(newNotification);
    } catch (err) {
        console.error('Error creating notification:', err);
        return res.status(400).json({ message: err.message || 'Error creating notification' });
    }
};

const getNotificationsByItemId = async (req, res) => {
    try {
        const { item_id } = req.params;
        if (!item_id || isNaN(item_id) || Number(item_id) <= 0) {
            return res.status(400).json({ message: 'Valid positive item_id is required' });
        }
        const notifications = await Notifications.getNotificationsByItemId(item_id);
        return res.status(200).json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        return res.status(400).json({ message: err.message || 'Error fetching notifications' });
    }
};

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notifications.getAllNotifications();
        return res.status(200).json(notifications);
    } catch (err) {
        console.error('Error fetching all notifications:', err);
        return res.status(500).json({ message: 'Error fetching all notifications' });
    }
};

module.exports = { createNotification, getNotificationsByItemId, getAllNotifications };