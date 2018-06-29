const ProjectFile = require('../models/project_file');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

//upload file path and file information
exports.upload_file = (req, res, next) => {
    const project = new ProjectFile({
        _id: new mongoose.Types.ObjectId(),
        projectID: req.body.projectID,
        userid: req.body.userID,
        projectfile: req.file.path,
        date: req.body.date,
        time: req.body.time
    });
    project
        .save()
        .then(result => {
            res.status(201).json({
                message: 'project uploaded succesfully'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

//delete uploaded single file
exports.delete_a_file = (req, res, next) => {

    console.log(req.body.filepath);

    const id = req.params.fileID;

    ProjectFile.remove({ _id: id })
        .exec()
        .then(result => {

            if (result) {
                const p = req.body.filepath;
                fs.unlink(p, function (err) {
                    if (err)
                        res.status(500).send(err);
                    else
                        res.status(200).send("File successfully deleted");
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

}
