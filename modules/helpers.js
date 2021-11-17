//============================================================================
// helper functions for use in 


//============================================================================
// required modules
const User = require('../models/modelUsers');
const Poll = require('../models/modelPolls');


//============================================================================
// local function to get user data
const getUserData = (uid) => {

    User.findOne({ _id: uid }, (err, User) => {

        if (err) {
            return null;
        }

        if (!User) {
            return null;
        }

        return User;
    });
};


//============================================================================
// check if user has admin rights
const userIsAdmin = (uid) => {

    const user = getUserData(uid);

    return user && user.isAdmin;
};


//============================================================================
// check if user is registered and allowed tgo create polls
const userIsRegistered = (uid) => {

    const user = getUserData(uid);

    return user !== null;
}


//============================================================================
// check if user is authorized to modify/delete the poll
const userIsAuthorized = (uid, pollID) => {

    Poll.findOne({ _id: pollID }, (err, Poll) => {

        if (err) {
            return false;
        }

        if (!Poll) {
            return false;
        }

        return (Poll.owner === uid) || userIsAdmin(uid);

    });
}


//============================================================================
// export all functions
module.exports = {
    userIsRegistered,
    userIsAuthorized,
    userIsAdmin,
}
