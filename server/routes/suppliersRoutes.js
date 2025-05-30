const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliersController');



router.post('/',suppliersController.createSupply);
router.get('/',suppliersController.getAllSuppliers);
router.get('/:supplier_id',suppliersController.getSupplyID)
router.put('/:supplier_id',suppliersController.updateSupplier);
router.delete('/:supplier_id',suppliersController.deleteSupplier);

module.exports = router;
