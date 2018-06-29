const express = require('express');
const router = express.Router();

const taskController = require('../controllers/tasks');
const checkAuthentication = require('../middleware/check_auth');

router.post('/',checkAuthentication, taskController.create_new_task);

router.get('/one/:taskID',checkAuthentication, taskController.get_a_task);

router.get('/:projectID', taskController.get_all_tasks);

router.put('/:taskID',checkAuthentication, taskController.update_task);

router.patch('/complete/:taskID',checkAuthentication, taskController.complete_task);

router.delete('/:taskID',checkAuthentication, taskController.delete_task);

router.get('/progres/:projectID',checkAuthentication, taskController.getprogress);

module.exports = router;