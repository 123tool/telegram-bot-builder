const express = require('express');
const router = express.Router();
const botController = require('../controllers/bot.controller');

// REST API Master Dashboard Routes
router.get('/stats', botController.getDashboardStats);
router.post('/settings', botController.updateSettings);
router.post('/engine', botController.toggleBotEngine);
router.post('/commands', botController.addCommand);
router.delete('/commands/:id', botController.deleteCommand);
router.post('/broadcast', botController.broadcastMessage);

module.exports = router;
