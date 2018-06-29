const Project = require('../models/project');
const ProjectMembers = require('../models/project_members');
const Tasks = require('../models/tasks');
const Users = require('../models/user');
const mongoose = require('mongoose');

// get all projects with userID
exports.get_all_projects = (req, res, next) => {
    const userID = req.params.userid;
    Project.find({ userid: userID, })
        .exec()
        .then(docs => {

            if (docs.length >= 0) {
                res.status(200).json(docs);
            }
            else {
                res.status(404).json({
                    message: "No Projects Found"
                });
            }

        })
        .catch(err => {

            res.status(500).json({
                error: err
            });
        });

};

// create new project
exports.create_new_project = (req, res, next) => {
    
    Users.find({ _id: req.body.userid })
        .exec()
        .then(user => {

            if (user.length > 0) {
                const project = new Project({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    description: req.body.description,
                    userid: req.body.userid,
                    startdate: req.body.startdate,
                    enddate: req.body.enddate
                });
                project
                    .save()
                    .then(result => {

                        const member = new ProjectMembers({
                            _id: new mongoose.Types.ObjectId(),
                            projectID: result._id,
                            memberID: req.body.userid,
                            role: "admin"
                        });

                        member
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'Project Successfully Created',
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });

                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            }
            else {
                res.status(404).json({
                    message: "Member Not Found"
                });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });


};


exports.delete_project = (req, res, next) => {
    const id = req.params.projectID;


    Tasks.find({ projectID: id, status: "pending" })
        .exec()
        .then(task => {

            if (task.length > 0) {
                res.status(404).json({
                    message: "Please remove or complete all Tasks"
                });
            }
            else {

                Project.remove({ _id: id })
                    .exec()
                    .then(result => {

                        ProjectMembers.remove({ projectID: id })
                            .exec()
                            .then(result => {
                                res.status(200).json({

                                    message: 'Project Successfully Removed'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });

                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}


exports.update_project = (req, res, next) => {
    const id = req.params.projectID;

    Project.update({ _id: id }, req.body)
        .then(() => {
            res.status(200).send({ message: 'Successfully Updated' });
        }).catch(err => {
            res.status(404).send(err);
        })

}


exports.search_project = (req, res, next) => {
    const x = req.params.pro;
    // $regex is allowed to get result from partial word. 
    //"$options": "i" --- is  make word not case sensitive
    Project.find().or([{ name: { "$regex": x, "$options": "i" } },

    { startdate: { "$regex": x, "$options": "i" } }
    ])
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                project: docs.map(doc => {
                    return {
                        id: doc._id,
                        name: doc.name,
                        description: doc.description,
                        startdate: doc.startdate,
                        enddate: doc.enddate
                    }
                })
            };
            if (docs.length >= 0) {
                res.status(200).json(response);
            }
            else {
                res.status(404).json({
                    message: "No Projects Found"
                });
            }

        })
        .catch(err => {

            res.status(500).json({
                error: err
            });
        });
};

exports.get_a_project = (req, res, next) => {

    const projectID = req.params.projectID;
    Project.findOne({ _id: projectID, })
        .exec()
        .then(docs => {
            res.status(200).json(docs);

        })
        .catch(err => {

            res.status(500).json({
                error: err
            });
        });

}

exports.get_other_projects = (req, res, next) => {
    const userID = mongoose.Types.ObjectId(req.params.userid);
    che: String;
    che = 'pending';

    //get project members with the project details and tasks. (left outer join)
    ProjectMembers.aggregate([
        {
            // join project table and projectmember table
            $lookup: {
                "from": "projects",
                "localField": "projectID",
                "foreignField": "_id",
                "as": "project"
            }
        },
        {
            // select all project according to userID
            "$match": {
                "memberID":  userID
            }
        },
        {
            // join task table and project members table
            $lookup: {
                from: "tasks",
                localField: "projectID",
                foreignField: "projectID",
                as: "tasks",
            }
        }

    ]).exec().then(data => {
        res.status(201).json(data);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err

        });
    });
}