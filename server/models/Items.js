const pool = require('../db');

const Items = {
    async createItems({ name, category_id, quantity, price, description, low_stock_threshold }) {
        // Validate category_id exists
        const categoryCheck = await pool.query('SELECT category_id FROM categories WHERE category_id = $1', [category_id]);
        if (categoryCheck.rows.length === 0) {
            throw new Error('Invalid category_id: Category does not exist');
        }
        const result = await pool.query(
            'INSERT INTO items (name, category_id, quantity, price, description, low_stock_threshold) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, category_id, quantity, price, description, low_stock_threshold]
        );
        return result.rows[0];
    },

    async getAllItems() {
        const result = await pool.query('SELECT * FROM items');
        return result.rows;
    },

    async getItemsID(item_id) {
        const result = await pool.query('SELECT * FROM items WHERE item_id = $1', [item_id]);
        return result.rows[0];
    },

    async updateItems(item_id, { name, category_id, quantity, price, description, low_stock_threshold }) {
        // Validate category_id exists
        const categoryCheck = await pool.query('SELECT category_id FROM categories WHERE category_id = $1', [category_id]);
        if (categoryCheck.rows.length === 0) {
            throw new Error('Invalid category_id: Category does not exist');
        }
        const result = await pool.query(
            'UPDATE items SET name = $1, category_id = $2, quantity = $3, price = $4, description = $5, low_stock_threshold = $6 WHERE item_id = $7 RETURNING *',
            [name, category_id, quantity, price, description, low_stock_threshold, item_id]
        );
        return result.rows[0];
    },

    async deleteItems(item_id) {
        const result = await pool.query('DELETE FROM items WHERE item_id = $1 RETURNING *', [item_id]);
        return result.rows[0];
    },
};

module.exports = Items;
