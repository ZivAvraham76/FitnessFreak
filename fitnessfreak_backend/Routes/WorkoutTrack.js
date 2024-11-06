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

// Route to add workout entry
router.post('/addworkoutentry', authTokenHandler, async (req, res) => {
    const { date, exercise, durationInMinutes } = req.body;
    // Check if all required details are provided
    if (!date || !exercise || !durationInMinutes) {
        return res.status(400).json(createResponse(false, 'Please provide date, exercise, and duration'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    user.workouts.push({
        date: new Date(date),
        exercise,
        durationInMinutes,
    });

    await user.save();
    res.json(createResponse(true, 'Workout entry added successfully'));
});

// Route to get workout entries by date
router.post('/getworkoutsbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = req.userId;

    const user = await User.findById({ _id: userId });
    if (!date) {
        // If no date is provided, get entries for today
        let date = new Date();
        user.workouts = filterEntriesByDate(user.workouts, date);// Filter entries for today

        return res.json(createResponse(true, 'Workout entries for today', user.workouts));
    }

    user.workouts = filterEntriesByDate(user.workouts, new Date(date));
    res.json(createResponse(true, 'Workout entries for the date', user.workouts));
});


// Route to get sleep entries by limit
router.post('/getworkoutsbylimit', authTokenHandler, async (req, res) => {
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

        return res.json(createResponse(true, 'Workouts entries for the last ${limit} days', user.workouts));
    }
});

router.delete('/deleteworkoutentry', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const { exercise } = req.body;
    const { durationInMinutes } = req.body;
    console.log(':',date);
    console.log('::',exercise);
    console.log(':::',durationInMinutes);
    // Check if date is provided
    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    
    // Filter out the entry to be deleted
    user.workouts = user.workouts.filter((entry) => {
        return entry.date.toString() !== new Date(date).toString() || entry.exercise !== exercise || entry.durationInMinutes !== durationInMinutes;
    })


    
    await user.save();
    res.json(createResponse(true, 'Workout entry deleted successfully'));
});

// Route to get user's sleep goal information
router.get('/getusergoalworkout', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if(user.goal == "weightLoss"){
        let goal = 7;
        res.json(createResponse(true, 'User goal workout days', { goal }));
    }
    else if(user.goal == "weightGain"){

        let goal = 4;
        res.json(createResponse(true, 'User goal workout days', { goal }));
    }
    else{
   
        let goal = 5;
        res.json(createResponse(true, 'User goal workout days', { goal }));
    }

    res.json(createResponse(true, 'User workout history', { workouts: user.workouts }));
});

// Function to filter workout entries by date
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