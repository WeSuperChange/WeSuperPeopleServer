//============================================================================
// user controller


//============================================================================
// required modules
const User = require('../models/modelUsers');


//============================================================================
// controller functions for the routes

// create a new user
const createUser = (req, res) => {

    const body = req.body;

    if (!body) {
        return res
            .status(400)
            .json({ success: false, error: 'You must provide a user' });
    }

    const user = new User(body);
    if (!user) {
        return res
            .status(400)
            .json({ success: false, error: err });
    }

    user
        .save()
        .then(() => {
            return res
                .status(201)
                .json({ success: true, id: user._id, message: 'User created!' });
        })
        .catch(error => {
            return res
                .status(400)
                .json({ error, message: 'User not created!' });
        });
}


//============================================================================
// update a user 
const updateUser = (req, res) => {
    const body = req.body;

    if (!body) {
        return res
            .status(400)
            .json({ success: false, error: 'You must provide a body to update' });
    }

    User.findOne({ _id: req.params.id }, (err, User) => {

        if (err) {
            return res
                .status(404)
                .json({ err, message: 'User not found!' });
        }

        // user.UID = body.user;
        user.isAdmin = body.isAdmin;
        user.isOnline = body.isOnline;


        User
            .save()
            .then(() => {
                return res
                    .status(200)
                    .json({ success: true, id: User._id, message: 'User updated!' });
            })
            .catch(error => {
                return res
                    .status(404)
                    .json({ error, message: 'User not updated!' });
            });
    });
}


//============================================================================
// delete a user
const deleteUser = async (req, res) => {

    await User.findOneAndDelete(
        { "UID": req.params.id }, (err, user) => {
            if (err) {
                return res
                    .status(400)
                    .json({ success: false, error: err });
            }

            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, error: `User not found` });
            }

            return res
                .status(200)
                .json({ success: true, data: user });

        }).catch(err => console.log(err));
}


//============================================================================
// get a user by database id (userModel._id)
const getUserById = async (req, res) => {
    await User.findOne(
        { _id: req.params.id }, (err, user) => {
            if (err) {
                return res
                    .status(400)
                    .json({ success: false, error: err });
            }

            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, error: `User not found` });
            }

            return res
                .status(200)
                .json({ success: true, message: 'User deleted!' });
        })
        .catch(err => console.log(err));
}


//============================================================================
// export all functions
module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUserById
}
