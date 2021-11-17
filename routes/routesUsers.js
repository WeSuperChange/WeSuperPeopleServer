//============================================================================
// required modules
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ctrlUsers');


//============================================================================
// the routes (CRUD => create, read , update, delete)
router.post('/user', ctrl.createUser);
router.get('/user/:id', ctrl.getUserById);
router.put('/user/:id', ctrl.updateUser);
router.delete('/user/:id', ctrl.deleteUser);


//============================================================================
// export the router
module.exports = router;