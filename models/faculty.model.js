const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var facultySchema = new Schema({
    Fid: { type: String, required: true },
    Fname: { type: String }
});
//Create model faculty
const faculty = mongoose.model('Faculty', facultySchema);
//init to using model 
module.exports = faculty;