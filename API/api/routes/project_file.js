const express = require ('express');
const router = express.Router();
const mongoose= require('mongoose');
const multer = require('multer');

const checkAuthentication = require('../middleware/check_auth');
const projectfileController = require('../controllers/project_file');

// set storage info
const storage= multer.diskStorage({
    destination:function(req, file, cb){

        const fs = require('fs');
        const checkfolder = req.body.projectID;

        if (!fs.existsSync('./uploads/'+checkfolder)){
            fs.mkdirSync('./uploads/'+checkfolder);
        }

        cb(null, './uploads/'+checkfolder);
        
    },
    filename: function(req, file, cb){

        cb(null, file.originalname);
    }
});

// check the file type
const fileFilter =(req, file, cb) =>{
    if(file.mimetype === 'application/x-rar-compressed' || file.mimetype === 'application/zip' || file.mimetype === '	application/x-7z-compressed'){
        cb(null,true);
    }else{
        cb(null,false);
    }  
};

//file size eka 10mb => 1024 *1024 *10
const upload = multer({
    storage:storage, 
    limits:{
    fileSize: 1024 *1024 *10
    },
    fileFilter: fileFilter
});

//upload a file
router.post('/', upload.single('projectfile'),checkAuthentication, projectfileController.upload_file);

// delete a file
router.delete('/:fileID',checkAuthentication, projectfileController.delete_a_file);

module.exports = router;