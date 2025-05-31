const pool = require('../db')

const ItemSuppliers = {
    createItemSupplier: async ({ item_id, supplier_id}) => {
        const result = await pool.query
            ('INSERT INTO item_suppliers (item_id, supplier_id) VALUES ($1, $2) RETURNING *',
                [ item_id, supplier_id]
            );
        return result.rows[0]
    },

    getAllItemSuppliers: async () => {
        const result = await pool.query('SELECT * FROM item_suppliers ');
        return result.rows;
    },

    getItemSuppliersID: async (item_id, supplier_id) => {
        const result = await pool.query('SELECT * FROM item_suppliers WHERE item_id=$1 and supplier_id=$2',[item_id, supplier_id]);
        return result.rows[0];
    },


    deleteItemSuppliers: async (item_id, supplier_id) => {
        const result = await pool.query('DELETE from item_suppliers WHERE item_id=$1 and supplier_id=$2 RETURNING *',
            [item_id, supplier_id]);
        return result.rows[0];
    }



}

module.exports = ItemSuppliers;
