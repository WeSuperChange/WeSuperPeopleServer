//============================================================================
// poll controller


//============================================================================
// required modules
const PollGroup = require('../models/modelPolls');
const { userIsAuthorized, userIsRegistered } = require('../modules/helpers');


//============================================================================
// controller functions for the poll routes


//============================================================================
// create a new poll, data in req.body
// router.post('/poll', ctrl.createPoll);
const createPoll = (req, res) => {

    const body = req.body;


    // check if we got a body => no body, no poll
    if (!body) {
        return res
            .status(400)
            .json({ success: false, error: 'You must provide a poll' });
    }


    // only registered users are allowd to create ne polls
    if (!userIsRegistered(body.newPollUser)) {
        return res
            .status(403)
            .json({ success: false, error: 'You are not authorized!' });
    }


    // because the frontend has no knowledge about the poll data model, we need to build is by oursevles

    // create answer objects from answer texts
    const pollAnswers = [];
    body.newPollAnswers.forEach(answer => {
        pollAnswers.push({
            "AnswerText": answer,
            "AnswerCount": 0
        });
    });

    // format a single poll to match the poll model
    const singlePoll = {
        Category: body.newPollCategory,
        Question: body.newPollQuestion,
        PollAnswers: [...pollAnswers]
    }

    // build a pollgroup object
    const pollGroup = {
        UID: body.newPollUser,
        Polls: [singlePoll]
    };

    // finally the data are formed accordiung to our data modelm now try to save
    const poll = new PollGroup(pollGroup);
    poll
        .save()
        .then(() => {
            console.log("Poll created");
            return res
                .status(201)
                .json({ success: true, id: PollGroup._id, message: 'Poll created!' });
        })
        .catch(error => {
            console.log(error);
            return res
                .status(400)
                .json({ error, message: 'Poll not created!' });
        });
}


//============================================================================
// update a poll, data 
// router.put('/poll/:uid/:id', ctrl.updatePoll);
const updatePoll = async (req, res) => {

    console.log("function updatePoll()");

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
// router.delete('/poll/:uid/:id', ctrl.deletePoll);
const deletePoll = async (req, res) => {

    if (!userIsAuthorized(req.params.uid)) {
        return res
            .status(403)
            .json({ success: false, error: 'You are not authorized!' });
    }

    //  TODO: create an aggregated query to select the right poll to delete
    await PollGroup.findOneAndDelete({ id: req.params.id }, (err, Poll) => {

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

    await PollGroup.findOne({ id: req.params.id }, (err, Poll) => {

        if (err) {
            return res
                .status(400)
                .json({ success: false, error: err });
        }

        if (!Poll) {
            return res
                .status(404)
                .json({ error, message: 'Poll not found!' });
        }

        return res
            .status(200)
            .json({ success: true, data: Poll });

    }).catch(err => console.log(err));
}


//============================================================================
// get a single random poll
const getRandomPoll = async (req, res) => {

    // await PollGroup.aggregate([{ $sample: { size: 1 } }], (err, Poll) => {

    //     if (err) {
    //         return res
    //             .status(400)
    //             .json({ success: false, error: err });
    //     }

    //     if (!Poll) {
    //         return res
    //             .status(404)
    //             .json({ error, message: 'No polls found!' });
    //     }

    //     return res
    //         .status(200)
    //         .json({ success: true, data: Poll });

    // }).catch(err => console.log(err));


    PollGroup.count().exec((err, count) => {

        // Get a random entry
        var random = Math.floor(Math.random() * count)

        // // Again query all users but only fetch one offset by our random #
        // PollGroup.findOne().skip(random).exec(
        //     function (err, result) {
        //         // Tada! random user
        //         console.log(result)
        //     })

        PollGroup.findOne().skip(random).exec((err, Poll) => {

            if (err) {
                return res
                    .status(400)
                    .json({ success: false, error: err });
            }

            if (!Poll) {
                return res
                    .status(404)
                    .json({ error, message: 'Poll not found!' });
            }

            return res
                .status(200)
                .json({ success: true, data: Poll });

        }).catch(err => console.log(err));
    });
}


//============================================================================
// get a single single poll of a given category
const getRandomPollByCategory = async (req, res) => {

    const aggregate = [
        { '$match': { 'Polls.Category': req.params.cat } },
        { '$sample': { 'size': 1 } }
    ];

    await PollGroup.aggregate(aggregate, (err, Poll) => {

        if (err) {
            return res
                .status(400)
                .json({ success: false, error: err });
        }

        if (!Poll) {
            return res
                .status(404)
                .json({ error, message: 'No polls found!' });
        }

        return res
            .status(200)
            .json({ success: true, data: Poll });

    }).catch(err => console.log(err));
}


//============================================================================
// update results by poll id 
//router.put('/poll/res/:id/:idx/:ans', ctrl.updateResults);
const updateResults = async (req, res) => {

    // const body = req.body;

    // if (!body) {
    //     return res
    //         .status(400)
    //         .json({ success: false, error: 'You must provide a body to update' });
    // }

    await PollGroup.findOne({ "?id": req.params.id }, (err, PollCollection) => {

        if (err) {
            return res
                .status(404)
                .json({ err, message: 'Poll not found!' });
        }

        // set the answer
        PollCollection.Polls[req.params.idx].AnswerCount++;

        PollCollection
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
// router.get('/polls', ctrl.getPolls);
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
// router.get('/polls/uid/:uid', ctrl.getPollsByUID);
const getPollsByUID = async (req, res) => {

    await PollGroup.find({ "UID": req.params.uid }, (err, Polls) => {

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
// router.get('/polls/cat/:cat', ctrl.getPollsByCategory);
const getPollsByCategory = async (req, res) => {

    await PollGroup.find({ "Polls.Category": req.params.cat }, (err, Polls) => {

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
    getRandomPoll,
    getRandomPollByCategory,
    updateResults,
    getPolls,
    getPollsByUID,
    getPollsByCategory
}
