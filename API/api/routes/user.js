const express = require ('express');
const router = express.Router();

const userController = require('../controllers/user');
const checkAuthentication = require('../middleware/check_auth');

router.post('/signup', userController.Signup);

router.post('/login', userController.login);

router.get('/getusers', userController.users_get_all);

router.get('/search/:pro',userController.search_users);

router.delete('/:userID',checkAuthentication, userController.deleteuser);

router.post('/start/authentication', userController.authenticate);

module.exports = router;