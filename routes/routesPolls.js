//============================================================================
// required modules
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ctrlPolls');


//============================================================================
// the routes
// uid: User ID
// id:  Poll ID
// idx: Poll Index
// ans: answer index
// cat: Poll Category

// the routes (CRUD => create, read , update, delete)
router.post('/poll', ctrl.createPoll);
router.get('/poll/:id', ctrl.getPollById);
router.get('/poll/rnd', ctrl.getRandomPoll);
router.get('/poll/rnd/:cat', ctrl.getRandomPollByCategory);
router.put('/poll/:uid/:id', ctrl.updatePoll);
// router.put('/poll/res/:id/:idx', ctrl.updateResults);
router.put('/poll/res/:id/:idx/:ans', ctrl.updateResults);
router.delete('/poll/:uid/:id', ctrl.deletePoll);

// get poll collections
router.get('/polls', ctrl.getPolls);
router.get('/polls/uid/:uid', ctrl.getPollsByUID);
router.get('/polls/cat/:cat', ctrl.getPollsByCategory);


//============================================================================
// export the router
module.exports = router;