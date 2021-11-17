//============================================================================
// helper functions for use in 


//============================================================================
// required modules
const User = require('../models/modelUsers');
const Poll = require('../models/modelPolls');


//============================================================================
// local function to get user data
const getUserData = (uid) => {

    User.findOne({ UID: uid }, (err, user) => {

        if (err) {
            return null;
        }

        if (!user) {
            return null;
        }

        return user;
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

    // TODO: build a query to find the requested poll
    Poll.findOne({ id: pollID }, (err, poll) => {

        if (err) {
            return false;
        }

        if (!poll) {
            return false;
        }

        return (poll.owner === uid) || userIsAdmin(uid);

    });
}


//============================================================================
// export all functions
module.exports = {
    userIsRegistered,
    userIsAuthorized,
    userIsAdmin,
}
