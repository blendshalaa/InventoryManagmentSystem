
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');


router.post('/',categoriesController.createCategory);

router.get('/',categoriesController.getAllCategories);
router.get('/:category_id',categoriesController.getCategoriesID);
router.put('/:category_id',categoriesController.updateCategory);
router.delete('/:category_id',categoriesController.deleteCategory);


module.exports = router;