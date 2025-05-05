const express = require('express');
const { saveGameData, getSavedGames } = require('../controllers/memoryController');
const { checkUser } = require('../middleware/auth');
const router = express.Router();
// Middleware to check user authentication
router.use(checkUser);
// Route to save game data
router.post('/save', saveGameData);
router.get('/history', getSavedGames);

module.exports = router;
