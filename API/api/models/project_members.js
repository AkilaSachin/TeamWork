const mongoose= require('mongoose');
const User = require ('./user');
const Project = require ('./project');

const projectmembersSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    projectID:      { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    memberID:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role:           { type: String,required:true }
});

module.exports =mongoose.model('ProjectMembers',projectmembersSchema);