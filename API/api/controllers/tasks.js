const Tasks = require('../models/tasks');
const mongoose = require('mongoose');


exports.get_all_tasks = (req, res, next) => {
    const projectid = mongoose.Types.ObjectId(req.params.projectID);

    // left outer join
    // get tasks with completed user details
    Tasks.aggregate([

        {
            // join user table and tasks table
            $lookup: {
                "from": "users",
                "localField": "completedby",
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


exports.create_new_task = (req, res, next) => {

    const task = new Tasks({
        _id: new mongoose.Types.ObjectId(),
        task: req.body.task,
        description: req.body.description,
        projectID: req.body.projectID,
        startdate: req.body.startdate,
        enddate: req.body.enddate
    });
    task
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Task Successfully Created',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.update_task = (req, res, next) => {
    const id = req.params.taskID;

    Tasks.update({ _id: id }, req.body)
        .then(() => {
            res.status(200).send({ message: 'Successfully Updated' });
        }).catch(err => {
            res.status(404).send(err);
        })
}

exports.delete_task = (req, res, next) => {
    const id = req.params.taskID;

    Tasks.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Task Successfully Removed'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.getprogress = (req, res, next) => {

    const projectid = req.params.projectID;
    Tasks.find({ projectID: projectid })
        .exec()
        .then(docs => {

            Tasks.find({ projectID: projectid, status: "pending" })
                .exec()
                .then(doc => {
                    res.status(201).json({
                        totalcount: docs.length,
                        pendingcount: doc.length
                    });
                })
                .catch(err => {

                    res.status(500).json({
                        error: err
                    });
                });
        }
        )
        .catch(err => {

            res.status(500).json({
                error: err
            });
        });


}

exports.complete_task = (req, res, next) => {

    const id = req.params.taskID;

    Tasks.update({ _id: id }, req.body)
        .then(() => {
            res.status(200).send({ message: 'Successfully Updated' });
        }).catch(err => {
            res.status(404).send(err);
        })
}

exports.get_a_task = (req, res, next) => {

    const id = mongoose.Types.ObjectId(req.params.taskID);

    Tasks.find({ _id: id })
        .exec()
        .then(docs => {
            if (docs.length >= 0) {
                res.status(200).json(docs);
            }
            else {
                res.status(404).json({
                    message: "No Task Found"
                });
            }

        })
        .catch(err => {

            res.status(500).json({
                error: err
            });
        });

}