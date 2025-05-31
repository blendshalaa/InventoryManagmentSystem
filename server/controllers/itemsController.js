const Items=require('../models/Items');

const createItems=async(req,res)=>{
    try{
        const newItem =await Items.createItems(req.body);
        return res.status(201).json(newItem);
    }catch(err){
        console.error("Error creating Items", err);
        return res.status(500).json({message:"Error creating Items"})
    }
};

const getAllItems=async(req,res)=>{
    try{
    const allItems=await Items.getAllItems();
return res.status(200).json(allItems);
    }catch(err){
console.error("Error getting Items", err);
return res.status(500).json({message})
    }

};

const  getItemsID=async(req,res)=>{
    const{item_id}=req.params;
    try{
        const itemId=await Items.getItemsID(item_id);
        return res.status(200).json(itemId);
    }catch(err){
        console.error("error getting items by id ",err);
        return res.status(500).json({message:"Error getting items ",});
    }
};

const updateItems=async(req,res)=>{
    const {item_id}=req.params;
    const {name, category_id, quantity, price, description, low_stock_threshold} = req.body;
    try{
        const updatedItems=await Items.updateItems(item_id,{name, category_id, quantity, price, description, low_stock_threshold});
        if(!updatedItems){
            return res.status(404).json({message:"Items not found"});
        }
        return res.status(200).json(updatedItems);
    }catch(err){
        console.error("error updating items ",err);
        return res.status(500).json({message:"Error updating items ",});
    }
};



const deleteItems=async(req,res)=>{
    const {item_id}=req.params;
    try{
        const deletedItems=await Items.deleteItems(item_id);
        if(!deletedItems){
            return res.status(404).json({message:"Item not found"});
        }
        return res.status(200).json(deletedItems);
    }catch(err){
        console.error("error deleting item ",err);
        return res.status(500).json({message:"Error deleting item ",});
    }
};


module.exports={
    createItems, getAllItems, getItemsID, updateItems, deleteItems
}
