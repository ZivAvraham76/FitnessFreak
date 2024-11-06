const express = require('express');
const router = express.Router();
const authTokenHandler = require('../Middlewares/checkAuthToken');
const errorHandler = require('../Middlewares/errorMiddleware');
const User = require('../Models/UserSchema');

// Function to create uniform responses
function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

// Route to add water entry
router.post('/addwaterentry', authTokenHandler, async (req, res) => {
    const { date, amountInMilliliters } = req.body;

    // Check if all required details are provided
    if (!date || !amountInMilliliters) {
        return res.status(400).json(createResponse(false, 'Please provide date and water amount'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    user.water.push({
        date: new Date(date),
        amountInMilliliters,
    });

    await user.save();
    res.json(createResponse(true, 'Water entry added successfully'));
});

// Route to get water entries by date
router.post('/getwaterbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = req.userId;

    const user = await User.findById({ _id: userId });

    if (!date) {
    // If no date is provided, get entries for today
        let date = new Date();
        user.water = filterEntriesByDate(user.water, date);

        return res.json(createResponse(true, 'Water entries for today', user.water));
    }

    user.water = filterEntriesByDate(user.water, new Date(date));
    res.json(createResponse(true, 'Water entries for the date', user.water));
});

// Route to get water entries by limit
router.post('/getwaterbylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'All water entries', user.water));
    } else {
        let date = new Date();
        // Calculate the current date minus the specified limit
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();

        // Filter sleep entries entries to only include those from the specified date or later
        user.water = user.water.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        });

        return res.json(createResponse(true, `Water entries for the last ${limit} days`, user.water));
    }
});

// Route to delete a sleep entry
router.delete('/deletewaterentry', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const { amountInMilliliters } = req.body;
    // Check if date is provided
    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    // Filter out the entry to be deleted
    user.water = user.water.filter((entry) => {
        return entry.date.toString() !== new Date(date).toString() || entry.amountInMilliliters !== amountInMilliliters;
    })

    await user.save();
    res.json(createResponse(true, 'Water entry deleted successfully'));
});

// Route to get user's water goal information
router.get('/getusergoalwater', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    const goalWater = 4000; 

    res.json(createResponse(true, 'User max water information', {goalWater }));
});

// Function to filter water entries by date
function filterEntriesByDate(entries, targetDate) {
    return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (
            entryDate.getDate() === targetDate.getDate() &&
            entryDate.getMonth() === targetDate.getMonth() &&
            entryDate.getFullYear() === targetDate.getFullYear()
        );
    });
}

router.use(errorHandler);
module.exports = router;