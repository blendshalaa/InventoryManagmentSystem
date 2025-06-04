const Items = require('../models/Items');

const createItems = async (req, res) => {
    try {
        const { name, category_id, quantity, price, description, low_stock_threshold } = req.body;
        if (!name || !category_id || quantity == null || price == null || low_stock_threshold == null) {
            return res.status(400).json({ message: 'Name, category_id, quantity, price, and low_stock_threshold are required' });
        }
        if (quantity < 0 || price < 0 || category_id < 1 || low_stock_threshold < 0) {
            return res.status(400).json({ message: 'Invalid input values: numbers must be non-negative, category_id must be positive' });
        }
        const newItem = await Items.createItems({
            name,
            category_id,
            quantity,
            price,
            description,
            low_stock_threshold,
        });
        return res.status(201).json(newItem);
    } catch (err) {
        console.error('Error creating item:', err);
        return res.status(400).json({ message: err.message || 'Error creating item' });
    }
};

const getAllItems = async (req, res) => {
    try {
        const allItems = await Items.getAllItems();
        return res.status(200).json(allItems);
    } catch (err) {
        console.error('Error getting items:', err);
        return res.status(500).json({ message: 'Error getting items' });
    }
};

const getItemsID = async (req, res) => {
    const { item_id } = req.params;
    try {
        const itemId = await Items.getItemsID(item_id);
        if (!itemId) {
            return res.status(404).json({ message: 'Item not found' });
        }
        return res.status(200).json(itemId);
    } catch (err) {
        console.error('Error getting item by id:', err);
        return res.status(400).json({ message: err.message || 'Error getting item' });
    }
};

const updateItems = async (req, res) => {
    const { item_id } = req.params;
    const { name, category_id, quantity, price, description, low_stock_threshold } = req.body;
    try {
        if (!name || !category_id || quantity == null || price == null || low_stock_threshold == null) {
            return res.status(400).json({ message: 'Name, category_id, quantity, price, and low_stock_threshold are required' });
        }
        if (quantity < 0 || price < 0 || category_id < 1 || low_stock_threshold < 0) {
            return res.status(400).json({ message: 'Invalid input values: numbers must be non-negative, category_id must be positive' });
        }
        const updatedItems = await Items.updateItems(item_id, {
            name,
            category_id,
            quantity,
            price,
            description,
            low_stock_threshold,
        });
        if (!updatedItems) {
            return res.status(404).json({ message: 'Item not found' });
        }
        return res.status(200).json(updatedItems);
    } catch (err) {
        console.error('Error updating item:', err);
        return res.status(400).json({ message: err.message || 'Error updating item' });
    }
};

const deleteItems = async (req, res) => {
    const { item_id } = req.params;
    try {
        const deletedItems = await Items.deleteItems(item_id);
        if (!deletedItems) {
            return res.status(404).json({ message: 'Item not found' });
        }
        return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Error deleting item:', err);
        return res.status(400).json({ message: err.message || 'Error deleting item' });
    }
};

module.exports = {
    createItems,
    getAllItems,
    getItemsID,
    updateItems,
    deleteItems,
};