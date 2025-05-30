const Suppliers=require("../models/Suppliers");


const createSupply=async(req,res)=>{
    try{
        const newSupply=await Suppliers.createSup(req.body);
        return res.status(201).json(newSupply);
    }catch(err){
        console.error('error creating suply',err);
        return res.status(500).json({message:"error creating suply"});
    }
};

const getAllSuppliers=async(req,res)=>{
    try{
        const getAll=await Suppliers.getAllSup();
        return res.status(200).json(getAll);
    }catch(err){
        console.error('error getAllSuppliers',err);
        return res.status(500).json({message:"error getAllSuppliers"});
    }
};

const getSupplyID=async(req,res)=>{
    const{supplier_id}=req.params;
    try{
        const supplyID=await Suppliers.getSupID(supplier_id);
        return res.status(200).json(supplyID);
    }catch(err){
        console.error('error getSupplyID',err);
        return res.status(500).json({message:"error getSupplyID"});
    }
};

const updateSupplier=async(req,res)=>{
    const{supplier_id}=req.params;
    const{name,contact_email,phone}=req.body;
    try {
        const updatedSupply=await Suppliers.updateSup(supplier_id,{name,contact_email,phone});

        if(!supplier_id){
            return res.status(400).json({message:"supplier not found"});
        }
        return res.status(200).json(updatedSupply);
    }catch(err){
        console.error('error updating supplier',err);
        return res.status(500).json({message:"error updating supplier"});
    }
};

const deleteSupplier=async(req,res)=>{
    const{supplier_id}=req.params;
    try{
        const deletedSupply=await Suppliers.deleteSup(supplier_id);
        if(!deletedSupply){
            return res.status(400).json({message:"supplier not found"});
        }
        return res.status(200).json(deletedSupply);
    }catch(err){
        console.error('error deleting supplier',err);
        return res.status(500).json({message:"error deleting supplier"});
    }
};

module.exports = {
    createSupply,
    getAllSuppliers,
    getSupplyID,
    updateSupplier,
    deleteSupplier,
}