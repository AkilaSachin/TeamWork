const mongoose= require('mongoose');
const User = require ('./user');

const projectSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    name:           { type: String ,required:true},
    description:    { type: String },
    userid:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startdate:      { type: String ,required:true},
    enddate:        { type: String ,required:true}

});
// projectSchema.index( { "$**": "text" } );
module.exports =mongoose.model('Project',projectSchema);