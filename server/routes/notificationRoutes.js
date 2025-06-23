const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');

router.post('/', notificationsController.createNotification);
router.get('/item/:item_id', notificationsController.getNotificationsByItemId);
router.get('/', notificationsController.getAllNotifications);

module.exports = router;