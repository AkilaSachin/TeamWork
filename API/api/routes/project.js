const express = require ('express');
const router = express.Router();

const Projectcontorller = require ('../controllers/project');
const checkAuthentication = require('../middleware/check_auth');


router.get('/:userid',checkAuthentication, Projectcontorller.get_all_projects);

router.get('/other/:userid',checkAuthentication, Projectcontorller.get_other_projects);

router.get('/one/:projectID',checkAuthentication, Projectcontorller.get_a_project);

router.post('/', checkAuthentication, Projectcontorller.create_new_project);

router.delete('/:projectID',checkAuthentication, Projectcontorller.delete_project);

router.put('/:projectID',checkAuthentication, Projectcontorller.update_project);





module.exports = router;