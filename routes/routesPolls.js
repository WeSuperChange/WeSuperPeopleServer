//============================================================================
// required modules
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ctrlPolls');


//============================================================================
// the routes
router.post('/poll', ctrl.createPoll);
router.put('/poll/:id', ctrl.updatePoll);
router.delete('/poll/:id', ctrl.deletePoll);
router.get('/poll/:id', ctrl.getPollById);
router.get('/polls', ctrl.getPolls);


//============================================================================
// export the router
module.exports = router;