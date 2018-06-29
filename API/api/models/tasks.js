const mongoose= require('mongoose');
const Project = require ('./project');

const tasksSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    projectID:      { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    task:           { type: String ,required:true},
    description:    { type: String ,required:true},
    startdate:      { type: String ,required:true},
    enddate:        { type: String ,required:true},
    completedby:    { type: mongoose.Schema.Types.ObjectId },
    status:         { type: String, default: 'pending' }
});

module.exports =mongoose.model('Tasks',tasksSchema);