const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const subjectSchema = new Schema({
    Sbid:{type: String , required: true,trim: true},
    Sbname:{type: String},
    Credit:{type: Number},
    Faculty: [{ type: Schema.Types.ObjectId, ref: "Faculty" }]
});
//Create model subject
const subject = mongoose.model('Subject', subjectSchema);
//init to using model 
module.exports = subject;