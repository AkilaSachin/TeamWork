const express = require('express');
const router = express.Router();

const checkAuthentication = require('../middleware/check_auth');
const Projectmembercontorller = require('../controllers/project_members');

// get all project members according to the projectID
router.get('/:projectID', checkAuthentication, Projectmembercontorller.get_project_members);

//add member to the  project
router.post('/:userID', checkAuthentication, Projectmembercontorller.add_member);

// remove member from project
router.post('/delete/:ID', checkAuthentication, Projectmembercontorller.remove_member);

module.exports = router;