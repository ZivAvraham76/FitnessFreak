const express = require('express');
const router = express.Router();
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const errorHandler = require('../Middlewares/errorMiddleware');
const request = require('request');
const User = require('../Models/UserSchema');
require('dotenv').config();

// Function to create uniform responses
function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

// Route to test the API
router.get('/test', authTokenHandler, async (req, res) => {
    res.json(createResponse(true, 'Test API works for calorie intake'));
});

// Route to add calorie intake
router.post('/addcalorieintake', authTokenHandler, async (req, res) => {

    const { item, date, quantity, quantitytype } = req.body;
    // Check if all required details are provided
    if (!item || !date || !quantity || !quantitytype) {
        return res.status(400).json(createResponse(false, "Please provide all the details"))
    }
    // Convert quantity to grams based on its type
    let qtyingrams = 0;
    if (quantitytype === 'g') {
        qtyingrams = quantity;
    }
    else if (quantitytype === 'kg') {
        qtyingrams = quantity * 1000;
    }
    else if (quantitytype === 'ml') {
        qtyingrams = quantity;
    }
    else if (quantitytype === 'l') {
        qtyingrams = quantity * 1000;
    }
    else res.status(400).json(createResponse(false, "Invalid quantity type"))

    // GET request to the nutrition API to fetch nutritional information
    var query = item;
    request.get({
        url: 'https://api.api-ninjas.com/v1/nutrition?query=' + query,
        headers: {
            'X-Api-Key': process.env.NUTRITION_API_KEY,
        },
    }, async function (error, response, body) {
        if (error) return console.error('Request failed:', error);
        else if (response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
        else {
            body = JSON.parse(body);
            if (!body[0].calories || !body[0].serving_size_g || body[0].serving_size_g === 0) {
                return res.status(400).json(createResponse(false, "Invalid nutritional data"));
            }
            // Calculate calorie intake based on serving size and quantity

            // TODO: Comment this out when subscribed to NinjaAPI
            // let calorieIntake = (body[0].calories / body[0].serving_size_g) * parseInt(qtyingrams);
            const userId = req.userId;
            const user = await User.findOne({ _id: userId });
            // Push the new calorie intake record to the user's calorie intake array
            user.calorieIntake.push({
                item,
                date: new Date(date),
                quantity,
                quantitytype,
                calorieIntake: "Only available for premium subscribers"
                // TODO: Comment this out when subscribed to NinjaAPI
                //calorieIntake: parseInt(calorieIntake)
            })

            await user.save();
            res.json(createResponse(true, 'Calorie intake added successfully'));

        }
    });


});

// Route to get calorie intake by date
router.post('/getcalorieintakebydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    if (!date) {
        // If no date is provided, get entries for today
        let date = new Date();
        user.calorieIntake = filterEntriesByDate(user.calorieIntake, date); // Filter entries for today
        return res.json(createResponse(true, 'Calorie intake for today: ', user.calorieIntake));
    }
    user.calorieIntake = filterEntriesByDate(user.calorieIntake, new Date(date)); // Filter entries for the specified date
    return res.json(createResponse(true, 'Calorie intake for today: ', user.calorieIntake));
}
)

// Route to get calorie intake by limit (number of days)
router.post('/getcalorieintakebylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'))
    }
    else if (limit === 'all') {
        return res.json(createResponse(true, 'Calorie intake: ', user.calorieIntake));
    }
    else {
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();
        // Filter calorie intake entries to only include those from the specified date or later
        user.calorieIntake = user.calorieIntake.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })


        return res.json(createResponse(true, `Calorie intake for the last ${limit} days`, user.calorieIntake));

    }
});

// Route to delete a calorie intake entry
router.delete('/deletecalorieintake', authTokenHandler, async (req, res) => {
    const { item, date } = req.body;
    // Check if both item and date are provided
    if (!item || !date) {
        return res.status(400).json(createResponse(false, 'Please provide all the details'))
    }
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    // Filter out the entry to be deleted
    user.calorieIntake = user.calorieIntake.filter((entry) => {
        return entry.date.toString() !== new Date(date).toString();
    })
    await user.save();
    res.json(createResponse(true, 'Calorie intake deleted successfully'));
});

// Route to get the user's goal calorie intake
router.get('/getgoalcalorieintake', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    let maxCalorieIntake = 0;
    let heightInCm = parseInt(user.height[user.height.length - 1].height); // Get the latest height
    let weightInKg = parseFloat(user.weight[user.weight.length - 1].weight); // Get the latest weight
    let age = new Date().getFullYear() - new Date(user.dob).getFullYear(); // Calculate age
    let BMR = 0;
    let gender = user.gender;

    // Calculate BMR based on gender
    if (gender == 'male') {
        BMR = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * age)

    }
    else if (gender == 'female') {
        BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age)

    }
    else {
        BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age)
    }

    // Calculate max calorie intake based on user's goal
    if (user.goal == 'weightLoss') {
        maxCalorieIntake = BMR - 500;
    }
    else if (user.goal == 'weightGain') {
        maxCalorieIntake = BMR + 500;
    }
    else {
        maxCalorieIntake = BMR;
    }

    res.json(createResponse(true, 'max calorie intake', { maxCalorieIntake }));


});

// Function to filter calorie intake entries by date
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
