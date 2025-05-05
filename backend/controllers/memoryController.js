const Save = require('../models/save');

exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    console.log('Received data to save:', req.body); 

    try {
       
        if (!userID || !gameDate || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newSave = new Save({
            userID,
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        });

        await newSave.save(); 
        res.status(201).json({ message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};

/**
 * Controller to retrieve saved games history for a user
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getSavedGames = async (req, res) => {
    const { id: userID } = req.user;
    console.log(`Getting game history for user: ${userID}`); 
    try {
        if (!userID) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const savedGames = await Save.find({ userID }).sort({ gameDate: -1 });
        res.json(savedGames);
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};