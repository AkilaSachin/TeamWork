const mongoose= require('mongoose');
const User = require ('./user');
const Project = require ('./project');

const projectfileSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    projectID:      { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    userid:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectfile:    { type: String, required:true },
    date:           { type: String, required:true},
    time:           { type: String,required:true }
});

module.exports =mongoose.model('Projectfile',projectfileSchema);