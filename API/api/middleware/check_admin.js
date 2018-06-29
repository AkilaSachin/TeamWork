
module.exports =(req, res, next) => {
    const ProjectMembers = require ('../models/project_members');
    const mongoose= require('mongoose');

    const projectid = req.params.projectID;
    const userid = req.params.userID
    ProjectMembers.find({projectID: projectid,memberID: userid})
        .exec()
        .then(docs => {
            const response={
                project: docs.map(doc =>{
                    
                        role:doc.name;
                        if(role == "admin"){
                            next();
                        }
                        else{
                            return res.status(409).json({
                                message: 'You cannot remove a member'
                            });
                        }
                })
            };
           
        })
        .catch(err => {
            
            res.status(500).json({
                error: err
            });
        });
    

};