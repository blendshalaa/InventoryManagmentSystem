const ItemSupplier=require('../models/ItemSuppliers');

const createItemSuppliers=async(req,res)=>{
    try{
        const newItemSupplier =await ItemSupplier.createItemSupplier(req.body);
        return res.status(201).json(newItemSupplier);
    }catch(err){
        console.error("Error creating Item Supplier", err);
        return res.status(500).json({message:"Error creating Item Supplier"})
    }
};

const getAllItemSuppliers=async(req,res)=>{
    try{
    const allItemSuppliers=await ItemSupplier.getAllItemSuppliers();
return res.status(200).json(allItemSuppliers);
    }catch(err){
console.error("Error getting Item Supplier", err);
return res.status(500).json({message})
    }

};

const  getItemSuppliersID=async(req,res)=>{
    const{item_id, supplier_id}=req.params;
    try{
        const itemSupplierId=await ItemSupplier.getItemSuppliersID(item_id, supplier_id);
        return res.status(200).json(itemSupplierId);
    }catch(err){
        console.error("error getting item suppliers by id ",err);
        return res.status(500).json({message:"Error getting item suppliers ",});
    }
};



const deleteItemSuppliers=async(req,res)=>{
    const {item_id, supplier_id}=req.params;
    try{
        const deletedItemSuppliers=await ItemSupplier.deleteItemSuppliers(item_id, supplier_id);
        if(!deletedItems){
            return res.status(404).json({message:"Item Supplier not found"});
        }
        return res.status(200).json(deletedItemSuppliers);
    }catch(err){
        console.error("error deleting item ",err);
        return res.status(500).json({message:"Error deleting item supplier ",});
    }
};


module.exports={
    createItemSuppliers, getAllItemSuppliers, getItemSuppliersID,  deleteItemSuppliers
}
