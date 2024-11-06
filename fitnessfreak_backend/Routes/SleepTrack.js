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

// Route to add sleep entry
router.post('/addsleepentry', authTokenHandler, async (req, res) => {
    const { date, durationInHrs } = req.body;
    // Check if all required details are provided
    if (!date || !durationInHrs) {
        return res.status(400).json(createResponse(false, "Please provide all the details"))
    }
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    user.sleep.push({
        date : new Date(date),
        durationInHrs,
    });
    await user.save();
            res.json(createResponse(true, 'sleep entry added successfully'));
});

// Route to get sleep entries by date
router.post('/getsleepbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if(!date){
        // If no date is provided, get entries for today
        let date = new Date();
        user.sleep = filterEntriesByDate(user.sleep, date); // Filter entries for today
        res.json(createResponse(true, 'sleep entries for today', user.sleep));
    }

    user.sleep = filterEntriesByDate(user.sleep, new Date(date));
    res.json(createResponse(true, 'sleep entries for the date', user.sleep));
});

// Route to get sleep entries by limit
router.post('/getsleepbylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'All sleep entries', user.sleep));
    } else {
        // Calculate the current date minus the specified limit
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();

        // Filter sleep entries entries to only include those from the specified date or later
        user.sleep = user.sleep.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })

        return res.json(createResponse(true, 'Sleep entries for the last ${limit} days', user.sleep));
    }
});

// Route to delete a sleep entry
router.delete('/deletesleepentry', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const {durationInHrs} = req.body;
    // Check if date is provided
    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'))
    }
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    // Filter out the entry to be deleted
    user.sleep = user.sleep.filter((entry) => {
        return entry.date.toString() !== new Date(date).toString() || entry.durationInHrs !== durationInHrs;    })

    await user.save();
    res.json(createResponse(true, 'Sleep entry deleted successfully'));
});

// Route to get user's sleep goal information
router.get('/getusersleep', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    const goalSleep = 6;
    res.json(createResponse(true, 'User max sleep information', {goalSleep}));

})

// Function to filter sleep entries by date
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