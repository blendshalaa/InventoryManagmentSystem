const pool=require('../db')

const Categories={
    createCategories:async({name,description})=> {
        const result=await pool.query('INSERT INTO categories (name,description)VALUES ($1,$2)RETURNING*',
            [name,description]);
        return result.rows[0]

    },
    getAllCategories:async()=>{
        const result=await pool.query('SELECT * FROM categories');
        return result.rows;
    },
    getCategoryID:async(category_id)=> {
        const result=await pool.query("SELECT * FROM categories WHERE category_id=$1",
            [category_id]);
        return result.rows[0];
    },
    updateCategory:async(category_id,{name,description,created_at,updated_at})=> {
        const result=await pool.query('UPDATE categories SET name=$1,description=$2,created_at=$3,updated_at=$4 WHERE category_id=$5 RETURNING *',
            [name,description,created_at,updated_at,category_id]);
        return result.rows[0];
},
    deleteCategory:async(category_id)=> {
        const result=await pool.query('DELETE FROM categories WHERE category_id=$1 RETURNING *',
            [category_id]);
        return result.rows[0];
    }
}

module.exports=Categories;