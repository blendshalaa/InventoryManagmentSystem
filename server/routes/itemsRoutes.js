const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');


router.post('/',itemsController.createItems);

router.get('/',itemsController.getAllItems);
router.get('/:item_id',itemsController.getItemsID);
router.put('/:item_id',itemsController.updateItems);
router.delete('/:item_id',itemsController.deleteItems);


module.exports = router;