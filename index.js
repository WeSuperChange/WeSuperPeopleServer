//============================================================================
// requirements for the backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');


//============================================================================
// import the routes for users and polls
const routesPolls = require('./routes/routesPolls');
const routesUsers = require('./routes/routesUsers');


//============================================================================
// configure access to  environment variables
dotenv.config();


//============================================================================
// create the backend app using express
const app = express();


//============================================================================
// some middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//============================================================================
// the default route: if this website is called without params, redirect the 
// user to the frontend page
app.get('/', (req, res) => {
    // res.send('<h1>Hello World!</h1>');
    res.redirect('https://superpeople.netlify.app/');
});


//============================================================================
// CRUD routes for users and polls
app.use('/api', routesUsers);
app.use('/api', routesPolls);


//============================================================================
// An error page for invalid routes, redirect to frontend error page
app.use((req, res, next) => {
    return res.status(404).redirect('https://superpeople.netlify.app/err404');
});


//============================================================================
// Connect to MongoDB using variables from environment
// only if the db connection is established start the backend server
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUS}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, (err) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log("Database is connected");
    const apiPort = process.env.PORT || 5000;
    app.listen(apiPort, () => {
        console.log(`Server running on port ${apiPort}`);
    });
});
