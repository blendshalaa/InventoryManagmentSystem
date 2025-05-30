const pool=require('../db');


const Suppliers={
    createSup:async({name,contact_email,phone})=>{
        const result=await pool.query('INSERT INTO suppliers(name,contact_email,phone)VALUES ($1,$2,$3)RETURNING*',
            [name,contact_email,phone]);
        return result.rows[0];
    },
    getAllSup:async()=>{
        const result=await pool.query('SELECT * FROM suppliers');
        return result.rows;
    },
    getSupID:async(supplier_id)=>{
        const result=await pool.query('SELECT * FROM suppliers where supplier_id=$1',
            [supplier_id]);
        return result.rows[0];
    },
    updateSup:async(supplier_id, {name,contact_email,phone})=>{
        const result=await pool.query('UPDATE suppliers SET name=$1,contact_email=$2,phone=$3 WHERE supplier_id=$4 RETURNING * ',
            [name,contact_email,phone,supplier_id]);
        return result.rows[0];
},
    deleteSup:async(supplier_id)=>{
        const result=await pool.query('DELETE FROM suppliers where supplier_id=$1 RETURNING *',
            [supplier_id]);
    }
}

module.exports=Suppliers;