//============================================================================
// poll controller


//============================================================================
// required modules
const Poll = require('../models/modelPolls')


//============================================================================
// controller functions for the routes

// create a new poll
const createPoll = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400)
            .json({
                success: false,
                error: 'You must provide a Poll',
            });
    }

    const Poll = new Poll(body);
    if (!Poll) {
        return res
            .status(400)
            .json({
                success: false,
                error: err
            });
    }

    Poll
        .save()
        .then(() => {
            return res
                .status(201)
                .json({
                    success: true,
                    id: Poll._id,
                    message: 'Poll created!',
                });
        })
        .catch(error => {
            return res
                .status(400)
                .json({
                    error,
                    message: 'Poll not created!',
                });
        });
}

//----------------------------------------------------------------------------
// update a poll 
const updatePoll = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res
            .status(400)
            .json({
                success: false,
                error: 'You must provide a body to update',
            });
    }

    Poll.findOne(
        { _id: req.params.id }, (err, Poll) => {
            if (err) {
                return res
                    .status(404)
                    .json({
                        err,
                        message: 'Poll not found!',
                    });
            }

            // Poll.location = body.location;
            // Poll.activity = body.activity;
            // Poll.image_url = body.image_url;
            // Poll.description = body.description;

            Poll
                .save()
                .then(() => {
                    return res
                        .status(200)
                        .json({
                            success: true,
                            id: Poll._id,
                            message: 'Poll updated!',
                        });
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Poll not updated!',
                    });
                });
        });
}

//----------------------------------------------------------------------------
// delete a poll
const deletePoll = async (req, res) => {
    await Poll.findOneAndDelete(
        { _id: req.params.id }, (err, Poll) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }

            if (!Poll) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        error: `Poll not found`
                    });
            }

            return res
                .status(200)
                .json({
                    success: true, data: Poll
                });
        }).catch(err => console.log(err))
}

//----------------------------------------------------------------------------
// get a poll by database id (pollModel._id)
const getPollById = async (req, res) => {
    await Poll.findOne(
        { _id: req.params.id }, (err, Poll) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }

            if (!Poll) {
                return res
                    .status(404)
                    .json({ success: false, error: `Poll not found` })
            }
            return res.status(200).json({ success: true, data: Poll })
        })
        .catch(err => console.log(err));
}


//----------------------------------------------------------------------------
// get a collection of all polls
const getPolls = async (req, res) => {
    await Poll.find(
        {}, (err, Polls) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!Polls.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Poll not found` })
            }
            return res.status(200).json({ success: true, data: Polls })
        }).catch(err => console.log(err))
}


//============================================================================
// export all functions
module.exports = {
    createPoll,
    updatePoll,
    deletePoll,
    getPolls,
    getPollById,
}
