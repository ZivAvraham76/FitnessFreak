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

// Route to add step entry
router.post('/addstepentry', authTokenHandler, async (req, res) => {
    const { date, steps } = req.body;
    // Check if all required details are provided
    if (!date || !steps) {
        return res.status(400).json(createResponse(false, "Please provide all the details"))
    }
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    user.steps.push({
        date : new Date(date),
        steps,
    });
    await user.save();
            res.json(createResponse(true, 'steps entry added successfully'));
});

// Route to get step entries by date
router.post('/getstepsbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    if(!date){
        // If no date is provided, get entries for today
        let date = new Date();
        user.steps = filterEntriesByDate(user.steps, date); // Filter entries for today
        return res.json(createResponse(true, 'steps entries for today', user.steps));
    }

    user.steps = filterEntriesByDate(user.steps, new Date(date));
    res.json(createResponse(true, 'steps entries for the date', user.steps));
});

// Route to get step entries by limit
router.post('/getstepsbylimit', authTokenHandler, async (req, res) => {
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
        user.steps = user.steps.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })

        return res.json(createResponse(true, 'Steps entries for the last ${limit} days', user.steps));
    }
});

// Route to delete a step entry
router.delete('/deletestepsntry', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const { steps } = req.body; 
    // Check if date is provided
    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'))
    }
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    // Filter out the entry to be deleted
    user.steps = user.steps.filter((entry) => {
        return entry.date.toString() !== new Date(date).toString() || entry.steps !== steps;
    })
    await user.save();
    res.json(createResponse(true, 'Steps entry deleted successfully'));
});

// Route to get user's step goal information
router.get('/getusergoalsteps', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    let totalSteps = 0;

    if(user.goal == "weightLoss"){
        totalSteps = 10000;
    }
    else if(user.goal == "weightGain"){
        totalSteps = 5000;
    }
    else{
        totalSteps = 7500;
    }   

    res.json(createResponse(true, 'User steps information', { totalSteps }));
});

// Function to filter steps entries by date
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