const express = require('express');
const router = express.Router();
const itemsSupplierController = require('../controllers/itemSuppliersController');


router.post('/',itemsSupplierController.createItemSuppliers);

router.get('/',itemsSupplierController.getAllItemSuppliers);
router.get('/:item_id/:supplier_id',itemsSupplierController.getItemSuppliersID);
router.delete('/:item_id/:supplier_id',itemsSupplierController.deleteItemSuppliers);


module.exports = router;