const ProjectMembers = require('../models/project_members');
const User = require('../models/user');
const mongoose = require('mongoose');

// get projects members of the project
exports.get_project_members = (req, res, next) => {
    const projectid = mongoose.Types.ObjectId(req.params.projectID);

    // left outer join
    // get project members name with member details
    ProjectMembers.aggregate([
        {
            // join user table and project members table.
            $lookup: {
                "from": "users",
                "localField": "memberID",
                "foreignField": "_id",
                "as": "member"
            }
        },
        {
            "$match": {
                "projectID": projectid
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

};

// add member to project
exports.add_member = (req, res, next) => {

    projectid = req.body.projectID;
    userid = req.params.userID;

    checkadmin(projectid, userid, function (crole) {
        if (crole == "admin") {

            ProjectMembers
                .find({
                    projectID: req.body.projectID,
                    memberID: req.body.memberID
                })
                .exec()
                .then(data => {
                    if (data.length >= 1) {
                        return res.status(409).json({
                            message: 'User allready in the project'
                        });
                    }
                    else {
                        const member = new ProjectMembers({
                            _id: new mongoose.Types.ObjectId(),
                            projectID: req.body.projectID,
                            memberID: req.body.memberID,
                            role: req.body.role

                        });

                        member
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User successfuly added'
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

        }
        else {

            return res.status(409).json({
                message: 'You do not have permission to remove a member'
            });

        }
    });
}

// remove member from project
exports.remove_member = (req, res, next) => {

    const userid = req.body.userID;
    const projectid = req.body.projectID;
    const id = req.params.ID;

    checkadmin(projectid, userid, function (crole) {
        if (crole == "admin") {

            ProjectMembers.remove({ _id: id })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Member Removed',
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

            return res.status(409).json({
                message: 'You do not have permission to remove a member'
            });

        }
    });

}

// check if the currenet user is admin of project
function checkadmin(projectid, userid, cb) {

    ProjectMembers.find({ projectID: projectid, memberID: userid })
        .exec()
        .then(docs => {
            const response = {
                project: docs.map(doc => {
                    cb(doc.role)
                })
            };
        })
        .catch(err => {
            resu = err
        });

} 