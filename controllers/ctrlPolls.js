//============================================================================
// poll controller


//============================================================================
// required modules
const PollGroup = require('../models/modelPolls');
const { userIsAuthorized } = require('../modules/helpers');


//============================================================================
// controller functions for the routes

// create a new poll
const createPoll = (req, res) => {

    if (!userIsAuthorized(req.params.uid)) {
        return res
            .status(403)
            .json({ success: false, error: 'You are not authorized!' });
    }

    const body = req.body
    if (!body) {
        return res
            .status(400)
            .json({ success: false, error: 'You must provide a poll' });
    }

    // format a single poll to match the poll model
    const singlePoll = {
        PollCategory: body.Category,
        PollQuestion: question,
        PollAnswers: [...newPollAnswers]
    }

    // build a pollgroup object
    const pollGroup = {
        UID: body.newPollUser,
        Polls: [singlePoll]
    };

    const Poll = new PollGroup(pollGroup);
    // if (!Poll) {
    //     return res
    //         .status(400)
    //         .json({ success: false, error: err });
    // }

    Poll
        .save()
        .then(() => {
            return res
                .status(201)
                .json({ success: true, id: PollGroup._id, message: 'Poll created!' });
        })
        .catch(error => {
            return res
                .status(400)
                .json({ error, message: 'Poll not created!' });
        });
}


//============================================================================
// update a poll 
const updatePoll = async (req, res) => {

    if (!userIsAuthorized(req.params.uid, req.params.id)) {
        return res
            .status(403)
            .json({ success: false, error: 'You are not authorized!' });
    }

    const body = req.body;

    if (!body) {
        return res
            .status(404)
            .json({ success: false, error: 'You must provide some data for update' });
    }

    PollGroup.findOne({ id: req.params.id }, (err, pollGroup) => {

        if (err) {
            return res
                .status(404)
                .json({ err, message: 'Poll not found!' });
        }


        // Poll.location = body.location;
        // Poll.activity = body.activity;
        // Poll.image_url = body.image_url;
        // Poll.description = body.description;

        pollGroup
            .save()
            .then(() => {
                return res
                    .status(200)
                    .json({ success: true, id: pollGroup._id, message: 'Poll updated!' });
            })
            .catch(error => {
                return res
                    .status(404)
                    .json({ error, message: 'Poll not updated!' });
            });
    });
}

//============================================================================
// delete a poll
const deletePoll = async (req, res) => {

    if (!userIsAuthorized(req.params.uid)) {
        return res
            .status(403)
            .json({ success: false, error: 'You are not authorized!' });
    }

    //  TODO: create an aggregated query to select the right poll to delete
    await PollGroup.findOneAndDelete({ _id: req.params.id }, (err, Poll) => {

        if (err) {
            return res
                .status(400)
                .json({ success: false, error: err })
        }

        if (!Poll) {
            return res
                .status(404)
                .json({ success: false, error: `Poll not found` });
        }

        return res
            .status(200)
            .json({ success: true, message: 'Poll deleted!' });

    }).catch(err => console.log(err));
}

//============================================================================
// get a single poll by database id (pollModel._id)
const getPollById = async (req, res) => {

    await PollGroup.findOne({ _id: req.params.id }, (err, Poll) => {

        if (err) {
            return res
                .status(400)
                .json({ success: false, error: err });
        }

        if (!Poll) {
            return res
                .status(404)
                .json({ error, message: 'Poll not updated!' });
        }

        return res
            .status(200)
            .json({ success: true, data: Poll });

    }).catch(err => console.log(err));
}


//============================================================================
// update results by poll id 

//router.put('/poll/res/:id/:idx', ctrl.updateResults);
const updateResults = async (req, res) => {

    // const body = req.body;

    // if (!body) {
    //     return res
    //         .status(400)
    //         .json({ success: false, error: 'You must provide a body to update' });
    // }

    PollGroup.findOne({ id: req.params.id }, (err, PollGroup) => {

        if (err) {
            return res
                .status(404)
                .json({ err, message: 'Poll not found!' });
        }

        // set the answer
        PollGroup.Polls[req.params.idx] =

            PollGroup
                .save()
                .then(() => {
                    return res
                        .status(200)
                        .json({ success: true, id: Poll._id, message: 'Poll updated!' });
                })
                .catch(error => {
                    return res
                        .status(404)
                        .json({ error, message: 'Poll not updated!' });
                });
    });
}


//============================================================================
// get a collection of all polls
const getPolls = async (req, res) => {

    await PollGroup.find({}, (err, Polls) => {

        if (err) {
            return res
                .status(400)
                .json({ success: false, error: err });
        }
        if (!Polls.length) {
            return res
                .status(404)
                .json({ success: false, error: `Poll not found` });
        }
        return res
            .status(200)
            .json({ success: true, data: Polls });

    }).catch(err => console.log(err));
}


//============================================================================
// get a collection of all polls for a specific user
const getPollsByUID = async (req, res) => {

    await PollGroup.find({ match: { "owner": req.params.uid } }, (err, Polls) => {

        if (err) {
            return res
                .status(400)
                .json({ success: false, error: err });
        }
        if (!Polls.length) {
            return res
                .status(404)
                .json({ success: false, error: `Poll not found` });
        }
        return res
            .status(200)
            .json({ success: true, data: Polls });

    }).catch(err => console.log(err));
}


//============================================================================
// get a collection of all polls by category
const getPollsByCategory = async (req, res) => {

    await PollGroup.find({ match: { "category": req.params.cat } }, (err, Polls) => {

        if (err) {
            return res
                .status(400)
                .json({ success: false, error: err });
        }
        if (!Polls.length) {
            return res
                .status(404)
                .json({ success: false, error: `Poll not found` });
        }
        return res
            .status(200)
            .json({ success: true, data: Polls });

    }).catch(err => console.log(err));
}


//============================================================================
// export all functions
module.exports = {
    createPoll,
    updatePoll,
    deletePoll,
    getPollById,
    updateResults,
    getPolls,
    getPollsByUID,
    getPollsByCategory
}
