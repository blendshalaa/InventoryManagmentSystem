const Categories=require('../models/Categories');



const createCategory=async(req,res)=>{
    const{name,description}=req.body;
    try{
        const newCategory=await Categories.createCategories(req.body);
        return res.status(201).json(newCategory);
    }catch(err){
        console.error("error creating category ",err);
        return res.status(500).json({message:"Error creating category"})
    }
};

const getAllCategories=async(req,res)=>{
    try{
        const allCategories=await Categories.getAllCategories();
        return res.status(200).json(allCategories);
    }catch(err){
        console.error("error getting category ",err);
        return res.status(500).json({message:"Error getting category ",});
    }
};

const  getCategoriesID=async(req,res)=>{
    const{category_id}=req.params;
    try{
        const categoryID=await Categories.getCategoryID(category_id);
        return res.status(200).json(categoryID);
    }catch(err){
        console.error("error getting category ",err);
        return res.status(500).json({message:"Error getting category ",});
    }
};

const updateCategory=async(req,res)=>{
    const {category_id}=req.params;
    const {name,description,created_at,updated_at} = req.body;
    try{
        const updatedCategory=await Categories.updateCategory(category_id,{name,description,created_at,updated_at});
        if(!updatedCategory){
            return res.status(404).json({message:"Category not found"});
        }
        return res.status(200).json(updatedCategory);
    }catch(err){
        console.error("error updating category ",err);
        return res.status(500).json({message:"Error updating category ",});
    }
};

const deleteCategory=async(req,res)=>{
    const {category_id}=req.params;
    try{
        const deletedCategory=await Categories.deleteCategory(category_id);
        if(!deletedCategory){
            return res.status(404).json({message:"Category not found"});
        }
        return res.status(200).json(deletedCategory);
    }catch(err){
        console.error("error deleting category ",err);
        return res.status(500).json({message:"Error deleting category ",});
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoriesID,
    updateCategory,
    deleteCategory,

}