const pool = require('../db')

const Items = {
    createItems: async ({ name, category_id, quantity, price, description, low_stock_threshold }) => {
        const result = await pool.query
            ('INSERT INTO items (name, category_id, quantity,price, description, low_stock_threshold) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [name, category_id, quantity, price, description, low_stock_threshold]
            );
        return result.rows[0]
    },

    getAllItems: async () => {
        const result = await pool.query('SELECT * FROM items ');
        return result.rows;
    },

    getItemsID: async (item_id) => {
        const result = await pool.query('SELECT * FROM items WHERE item_id=$1 ',[item_id]);
        return result.rows[0];
    },

    updateItems: async (item_id, { name, category_id, quantity, price, description, low_stock_threshold }) => {
        const result = await pool.query('UPDATE items SET name=$1, category_id=$2, quantity=$3, price=$4, description=$5, low_stock_threshold=$6 WHERE item_id=$7 RETURNING *',
            [name, category_id, quantity, price, description, low_stock_threshold, item_id]
        )
        return result.rows[0];
    },

    deleteItems: async (item_id) => {
        const result = await pool.query('DELETE from items WHERE item_id=$1 RETURNING *',
            [item_id]);
        return result.rows[0];
    }



}

module.exports = Items;
