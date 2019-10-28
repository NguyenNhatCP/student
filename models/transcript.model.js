const mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;
const Schema =mongoose.Schema;
var transcriptSchema = new Schema({
    Sid:{type: Number,required: true},
    Rpoint:{type: SchemaTypes.Number},
    Mpoint:{type: SchemaTypes.Number},
    Epoint:{type: SchemaTypes.Number},
    Student: [{ type: Schema.Types.ObjectId, ref: 'Student'}],
    //Grade:{type: Number},
    Subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
});
//Create model transcript
const transcript = mongoose.model('Transcript', transcriptSchema);
//init to using model 
module.exports = transcript;