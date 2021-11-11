//============================================================================
// required modules
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ctrlUsers');


//============================================================================
// the routes
router.post('/user', ctrl.createUser);
router.put('/user/:id', ctrl.updateUser);
router.delete('/user/:id', ctrl.deleteUser);
router.get('/user/:id', ctrl.getUserById);


//============================================================================
// export the router
module.exports = router;