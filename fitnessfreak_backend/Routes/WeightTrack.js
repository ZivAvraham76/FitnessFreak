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

// Route to add weight entry
router.post('/addweightentry', authTokenHandler, async (req, res) => {
    const { date, weight } = req.body;
    // Check if all required details are provided
    if (!date || !weight) {
        return res.status(400).json(createResponse(false, 'Please provide date and weight'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    user.weight.push({
        date: new Date(date),
        weight : weight,
    });

    await user.save();
    res.json(createResponse(true, 'Weight entry added successfully'));
});

// Route to get weight entries by date
router.post('/getweightbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = req.userId;

    const user = await User.findById({ _id: userId });

    if (!date) {
        // If no date is provided, get entries for today
        let date = new Date();
        user.weight = filterEntriesByDate(user.weight, date);// Filter entries for today

        return res.json(createResponse(true, 'Weight entries for today', user.weight));
    }

    user.weight = filterEntriesByDate(user.weight, new Date(date));
    res.json(createResponse(true, 'Weight entries for the date', user.weight));
});


router.post('/getweightbylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else {
        // Calculate the current date minus the specified limit
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();

        // Filter step entries entries to only include those from the specified date or later
        user.workouts = user.workouts.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })

        return res.json(createResponse(true, 'Workouts entries for the last ${limit} days', user.weight));
    }
});
// Route to delete a sleep entry
router.delete('/deleteweightentry', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const { weight } = req.body;

    // Check if date is provided
    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    // Filter out the entry to be deleted
    user.weight = user.weight.filter((entry) => {
        return entry.date.toString() !== new Date(date).toString() || entry.weight !== weight;
    })

    await user.save();
    res.json(createResponse(true, 'Weight entry deleted successfully'));
});


// has a bug
// Route to get user's weight goal information
router.get('/getusergoalweight', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    const currentWeight = user.weight.length > 0 ? user.weight[user.weight.length - 1].weight : null;
    const goalWeight = 22 * ((user.height[user.height.length - 1].height / 100) ** 2);

    res.json(createResponse(true, 'User goal weight information', { currentWeight, goalWeight }));
});


// Function to filter weight entries by date
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