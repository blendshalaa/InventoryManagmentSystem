const express = require('express');
const router = express.Router();
const inventoryLogsController = require('../controllers/inventoryLogsController');

router.post('/', inventoryLogsController.createLog);
router.get('/item/:item_id', inventoryLogsController.getLogsByItemId);
router.get('/', inventoryLogsController.getAllLogs);

module.exports = router;