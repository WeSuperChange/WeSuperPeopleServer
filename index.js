const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// just a test
// console.log(uuidv4());


const dotenv = require('dotenv');
dotenv.config();


// create the express app
const app = express();


// some middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUS}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, (err) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log("database is connected");
    const apiPort = process.env.PORT || 5000;
    app.listen(apiPort, () => {
        console.log(`Server running on port ${apiPort}`);
    });
});
